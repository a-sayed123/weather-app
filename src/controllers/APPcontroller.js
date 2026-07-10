'use strict'

// // // ------------------- \\ \\ \\
// ------ EVENTS LOGIC HERE ------- \\
// --------------------------------- \\

// ------------------------------------------------------------- \\

//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\

import UI from "../ui/UI.js"
import * as Logic from "../logic/Logic.js"
import * as API from "../data/API.js"
import validator from "../tools/validator.js"
import { UIcontroller } from "../ui/UIcontroller.js"
import Cities from "../data/cities.js"

//----------------------------------\\
//------- APP MANAGE SECTION -------\\
//----------------------------------\\

// --------------
// - This is the manager of my app its responsibility is to be the orchestrator of this app ,
// - It is the state manager every desicion wil be taken only here ,
// - Another scripts is just have a specific role buit this script is the manager of them .
// --------------

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
        coords: { lat: 21.42664, lon: 39.82563 },
        cityObj: {},
        locationStrategy: "local",
        status: STATUS.SUCCESS,
    },
    rawData: {},
    pureData: {
        weatherData: {},
        placeData: {},
    },

    init() { this.bindEvents() },

    async runDataAppFlow({ refresh = false } = {}) {
        // Validation
        if (refresh) {
            const isReady = await this.getRawData()
            if (!isReady) return false
        }
        if (!validator.isReadyForRender(this.rawData)) { return false }
        // Extract data
        this.pureData.weatherData = Logic.getPureData(this.rawData.weatherData, this.state.selectedDay, this.state.units)
        this.pureData.placeData = Logic.getPlace(this.rawData.placeData, this.state.locationStrategy)
        return true
    },

    async getRawData() {
        const { lat, lon } = this.state.coords
        if (!validator.hasCoords({ lat, lon })) { this.setState(STATUS.NO_RESULT); return false; }
        try {
            this.rawData = { weatherData: await API.getWeather({ lat, lon }) }
            if (this.state.locationStrategy === "fallback") {
                this.rawData.placeData = await API.getPlaceName({ lat, lon })
            } else {
                this.rawData.placeData = this.state.cityObj[0]
            }
        } catch (error) { this.stateManager(STATUS.ERROR); console.log(error); return false; }
        return true
    },

    bindEvents() {
        UIcontroller.init({
            initializeApp: this.handleInitialState.bind(this),
            onChangeUnit: this.handleChangeUnits.bind(this),
            onChangeDay: this.handleChangeDay.bind(this),
            onLocationAllow: this.handleLocationAllow.bind(this),
            onSearchBtnClick: this.handleSearch.bind(this),
            onClickRetry: this.handleRetry.bind(this),
        })
    },

    // ---> HANDLERS
    async handleRetry(item) {
        if (!item) return
        item.remove()
        await this.handleInitialState()
    },
    handleChangeUnits(type, newUnit) {
        const oldUnit = this.state.units[type]
        if (oldUnit === newUnit) return
        this.state.units[type] = newUnit
        this.runDataAppFlow()
        this.renderUI()
    },
    handleChangeDay(day) {
        const dayDate = day.dataset.day
        this.state.selectedDay = new Date(dayDate)
        this.runDataAppFlow()
        this.renderUI()
    },
    handleLocationAllow() {
        try {
            navigator.geolocation.getCurrentPosition(this.handleLocationSuccess.bind(this), this.handleLocationError.bind(this))
        } catch { this.stateManager(STATUS.ERROR); return; }
    },
    async handleLocationSuccess(position) {
        if (this._isLocation) return;
        this._isLocation = true
        const { latitude, longitude } = position.coords
        this.state.coords = { lat: latitude, lon: longitude }
        if (!validator.hasCoords(this.state.coords)) { this.stateManager(STATUS.NO_RESULT); return; }
        this.stateManager(STATUS.SUCCESS)
    },
    async handleLocationError() {
        console.log("User denied location")
        this.stateManager(STATUS.INITIIAL)
    },
    async handleSearch(cityName) {
        if (!validator.isValidCityName(cityName)) {
            console.log("This is not valid city name !?")
            this.stateManager(STATUS.NO_RESULT)
            return
        }
        try {
            this.stateManager(STATUS.LOADING)
            const cityObj = await Cities.init({ query: cityName })
            if (cityObj?.length) {
                const { lat, lon } = cityObj[0]
                this.state.coords = { lat, lon }
                this.state.cityObj = cityObj
                this.state.locationStrategy = "local"
            } else {
                this.state.coords = await API.searchByCityName(cityName)
                this.state.locationStrategy = "fallback"
            }
            if (!validator.hasCoords(this.state.coords)) { this.stateManager(STATUS.NO_RESULT); return; }
        } catch (error) { this.stateManager(STATUS.ERROR); return; }
        this.stateManager(STATUS.SUCCESS)
    },
    getInitialCity() {
        const lang = navigator.language.split("-")[0]
        return LANGUAGE_CITY_MAP[lang] || "Makkah Al Mukarramah"
    },
    async handleInitialState() {
        const initialCity = this.getInitialCity()
        if (!initialCity) { this.stateManager(STATUS.ERROR); return; }
        try {
            this.state.cityObj= await Cities.init({ query: initialCity })
            if (this.state.cityObj?.length) {
                this.state.coords = { lat: this.state.cityObj[0].lat, lon: this.state.cityObj[0].lon }
                this.state.locationStrategy = "local"
            }
            else {
                this.state.coords = await API.searchByCityName(initialCity)
                this.state.locationStrategy = "fallback"
            }
            if (!validator.hasCoords(this.state.coords)) { this.stateManager(STATUS.NO_RESULT); return false; }
            this.stateManager(STATUS.INITIIAL)
            return true
        } catch (error) { console.log("error from try catch initial state", error); this.stateManager(STATUS.ERROR); return false; }
    },
    setState(state) {
        const isValidState = state && Object.values(STATUS).includes(state)
        if (!isValidState) { this.state.status = STATUS.INITIIAL; return; }
        this.state.status = state
    },
    renderUI() {
        UI.init({
            weatherData: this.pureData.weatherData,
            placeData: this.pureData.placeData,
            date: this.state.selectedDay,
            state: this.state.status,
            units: this.state.units,
        })
    },
    async stateManager(state) {
        const states = {
            initial: async () => {
                this.setState(STATUS.INITIIAL)
                const isready = await this.runDataAppFlow({ refresh: true })
                if (!isready) this.stateManager(STATUS.ERROR)
                this.renderUI()
            },
            success: async () => {
                this.setState(STATUS.SUCCESS)
                const isReady = await this.runDataAppFlow({ refresh: true })
                if (!isReady) this.stateManager(STATUS.ERROR)
                this.renderUI()
            },
            loading: () => {
                this.setState(STATUS.LOADING)
                this.renderUI()
            },
            error: () => {
                this.setState(STATUS.ERROR)
                this.renderUI()
            },
            noResult: () => {
                this.setState(STATUS.NO_RESULT)
                this.renderUI()
            },
        }
        const handler = states[state]

        if (!handler) {
            throw new Error(`unknown state : ${state}`)
        }

        await handler()
    },
}
export default APPcontroller