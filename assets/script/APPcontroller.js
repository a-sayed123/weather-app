'use strict'

// // // ------------------- \\ \\ \\
// ------ EVENTS LOGIC HERE ------- \\
// --------------------------------- \\

// ------------------------------------------------------------- \\

//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\

import *  as  UI from "./UI.js"
import * as Logic from "./Logic.js"
import * as API from "./API.js"
import validator from "./validator.js"
import { UIcontroller } from "./UIcontroller.js"

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
    async init() {
        this.bindEvents()
        await this.getRawData()
        this.runAppFlow()
    },
    async runAppFlow({ refresh = false } = {}) {
        // validation
        if (refresh) { await this.getRawData() }
        if (!validator.isReadyForRender(this.rawData)) { this.setState(STATUS.NO_RESULT); return }
        // extract data
        const pureData = Logic.getPureData(this.rawData.weatherData, this.state.selectedDay, this.state.units)
        const place = Logic.getPlace(this.rawData.placeData)
        // Dender Data
        UI.updateUi(pureData, place, this.state.selectedDay, this.state.units)
    },
    async getRawData() {
        if (!validator.hasCoords(this.state.coords)) { this.setState(STATUS.NO_RESULT);  return }
        const { lat: latitude, lon: longitude } = this.state.coords
        try {
            this.rawData = {
                weatherData: await API.getWeather(latitude, longitude),
                placeData: await API.getPlaceName(latitude, longitude),
            }
        } catch (error) { console.log("Error after fetch", error) }
    },
    bindEvents() {
        UIcontroller.init({
            onChangeUnit: this.handleChangeUnits.bind(this),
            onChangeDay: this.handleChangeDay.bind(this),
            onLocationAllow: this.handleLocationAllow.bind(this),
            onSearchBtnClick: this.handleSearch.bind(this),
        })
    },
    loadingDefaultState() { },
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
        navigator.geolocation.getCurrentPosition(this.handleLocationSuccess.bind(this), this.handleLocationError.bind(this))
    },
    handleLocationSuccess(position) {
        const { latitude, longitude } = position.coords
        this.state.coords = { lat: latitude, lon: longitude }
        this.runAppFlow({ refresh: true })
    },
    handleLocationError() {
        console.log("User denied location")
        this.runAppFlow()
    },
    async handleSearch(cityName) {
        if (!validator.isValidCityName(cityName)) { console.log("This is not valid city name !?"); UI.renderState(STATUS.NO_RESULT); return }
        try {
            UI.renderState(STATUS.LOADING)
            const coords = await API.searchByCityName(cityName)
            if (!coords || coords?.length === 0) { this.setState(STATUS.NO_RESULT); return }
            this.state.coords = { lat: coords[0], lon: coords[1] }
        } catch (error) { this.setState(STATUS.ERROR); return }
        await this.runAppFlow({ refresh: true })
        UI.renderState(STATUS.SUCCESS)
    },
    setState(newState) {
        if (!newState) return
        this.state.status = newState  
    },
}

export default APPcontroller