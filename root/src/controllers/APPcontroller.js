'use strict'

// // // ------------------- \\ \\ \\
// ------ EVENTS LOGIC HERE ------- \\
// --------------------------------- \\

// ------------------------------------------------------------- \\

//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\

import *  as  UI from "../ui/UI.js"
import * as Logic from "../logic/Logic.js"
import * as API from "../api/API.js"
import validator from "../tools/validator.js"
import { UIcontroller } from "../ui/UIcontroller.js"

// ------------------------------------------------------------- \\

//----------------------------------\\
//------- APP MANAGE SECTION -------\\
//----------------------------------\\


const STATUS = {
    INITIIAL: "initial",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
    NO_RESULT: "noResult",
}

const LANGUAGE_CITY_MAP = {
    ar: "Cairo",
    tr: "Istanbul",
    fr: "Paris",
    en: "London",
    es: "Madrid",
    de: "Berlin",
    it: "Roma",
    pt: "Lisbon",
    ru: "Moscow",
    zh: "Beijing",
    ja: "Tokyo",
}

export const APPcontroller = {
    state: {
        units: {
            temperature: "C",
            wind: "KMH",
            precipition: "MM",
        },
        selectedDay: new Date(),
        coords: { lat: null, lon: null },
        status: STATUS.INITIIAL,
    },
    rawData: {},
    init() {this.bindEvents()},
    async runAppFlow({ refresh = false } = {}) {
        // Validation
        console.log(refresh)
        if (refresh) { await this.getRawData() }
        if (!validator.isReadyForRender(this.rawData)) { this.setState(STATUS.INITIIAL); this.handleInitialState() }
        // Extract data
        const pureData = Logic.getPureData(this.rawData.weatherData, this.state.selectedDay, this.state.units)
        const place = Logic.getPlace(this.rawData.placeData)
        // Render Data
        UI.updateUi(pureData, place, this.state.selectedDay, this.state.units)
    },
    async getRawData() {
        if (!validator.hasCoords(this.state.coords)) { this.setState(STATUS.NO_RESULT); return }
        const { lat: latitude, lon: longitude } = this.state.coords
        try {
            this.rawData = {
                weatherData: await API.getWeather(latitude, longitude),
                placeData: await API.getPlaceName(latitude, longitude),
            }
        } catch (error) { this.setState(STATUS.ERROR); console.log(error) }
    },
    bindEvents() {
        UIcontroller.init({
            initializeApp: this.handleInitialState.bind(this),
            onChangeUnit: this.handleChangeUnits.bind(this),
            onChangeDay: this.handleChangeDay.bind(this),
            onLocationAllow: this.handleLocationAllow.bind(this),
            onSearchBtnClick: this.handleSearch.bind(this),
        })
    },
    // ---> HANDLERS
    handleChangeUnits(type, newUnit) {
        const oldUnit = this.state.units[type]
        if (oldUnit === newUnit) return
        this.state.units[type] = newUnit
        this.runAppFlow()
    },
    handleChangeDay(day) {
        const dayDate = day.dataset.date
        this.state.selectedDay = new Date(dayDate)
        this.runAppFlow()
    },
    handleLocationAllow() {
        try {
            navigator.geolocation.getCurrentPosition(this.handleLocationSuccess.bind(this), this.handleLocationError.bind(this))
        } catch { this.setState(STATUS.ERROR) }
    },
    handleLocationSuccess(position) {
        const { latitude, longitude } = position.coords
        this.state.coords = { lat: latitude, lon: longitude }
        if (!validator.hasCoords(this.state.coords)) this.setState(STATUS.NO_RESULT)
        this.setState(STATUS.SUCCESS)
        this.runAppFlow({ refresh: true })
    },
    handleLocationError() {
        console.log("User denied location")
        this.runAppFlow()
    },
    async handleSearch(cityName) {
        if (!validator.isValidCityName(cityName)) { console.log("This is not valid city name !?"); this.setState(STATUS.NO_RESULT); return }
        try {
            this.setState(STATUS.LOADING)
            const coords = await API.searchByCityName(cityName)
            if (!validator.hasCoords(coords)) { this.setState(STATUS.NO_RESULT); return }
            this.state.coords = { lat: coords[0], lon: coords[1] }
        } catch (error) { this.setState(STATUS.ERROR); return }
        await this.runAppFlow({ refresh: true })
        this.setState(STATUS.SUCCESS)
    },
    getInitialCity(){
        const lang = navigator.language.split("-")[0]
        return LANGUAGE_CITY_MAP[lang] || "Makkah Al Mukarramah"
    },
    async handleInitialState() {
        const initialCity = this.getInitialCity()
        try{
            const coords = Number(await API.searchByCityName(initialCity))
            console.log(validator.hasCoords(coords))
            if (!validator.hasCoords(coords)) { this.setState(STATUS.NO_RESULT); return false }
            console.log(coords)
            this.state.coords = { lat: Number(coords[0]), lon: Number(coords[1]) }
            console.log(coords)
            await this.runAppFlow({ refresh: true })
            return true
        } catch (error) { this.setState(STATUS.ERROR); return false }
    },
    setState(newState) {
        const isValidState = newState && Object.values(STATUS).includes(newState)
        if (!isValidState) {
            this.state.status = STATUS.INITIIAL
            UI.renderState(STATUS.INITIIAL)
            this.setState(STATUS.INITIIAL); this.handleInitialState()
            return
        }
        this.state.status = newState
        UI.renderState(newState)
    },
}

export default APPcontroller