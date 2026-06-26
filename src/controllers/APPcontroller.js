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
import * as API from "../api/API.js"
import validator from "../tools/validator.js"
import { UIcontroller } from "../ui/UIcontroller.js"

// ------------------------------------------------------------- \\

//----------------------------------\\
//------- APP MANAGE SECTION -------\\
//----------------------------------\\

// --------------
// - This is the manager of my app its responsibility is to be the orchestrator of this app ,
// - It is the state manager every desicion taken here only ,
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
        if (refresh) { await this.getRawData() }
        if (!validator.isReadyForRender(this.rawData)) { return false }
        // Extract data
        this.pureData.weatherData = Logic.getPureData(this.rawData.weatherData, this.state.selectedDay, this.state.units)
        this.pureData.placeData = Logic.getPlace(this.rawData.placeData)
        return true
    },
    async getRawData() {
        if (!validator.hasCoords(this.state.coords)) { this.setState(STATUS.NO_RESULT); return }
        const { lat: latitude, lon: longitude } = this.state.coords
        try {
            this.rawData = {
                weatherData: await API.getWeather(latitude, longitude),
                placeData: await API.getPlaceName(latitude, longitude),
            }
        } catch (error) { this.stateManager(STATUS.ERROR); console.log(error); return; }
    },

    bindEvents() {
        UIcontroller.init({
            initializeApp: this.handleInitialState.bind(this),
            onChangeUnit: this.handleChangeUnits.bind(this),
            onChangeDay: this.handleChangeDay.bind(this),
            onLocationAllow: this.handleLocationAllow.bind(this),
            onSearchBtnClick: this.handleSearch.bind(this),
            onClickRetry: this.handleRetry.bind(this),
            onSelectSuggestion: this.handleSelectSuggestion.bind(this),
        })
    },

    // ---> HANDLERS
    async handleRetry(item) {
        if (!item) return
        item.remove()
        await this.handleInitialState()
    },
    handleSelectSuggestion(item, items){
        items.forEach(item => {
            item.setAttribute("aria-selected","false")
        })
        item.setAttribute("aria-selected","true")
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
            console.log("state is here NO_RESULT")
            return
        }
        try {
            this.stateManager(STATUS.LOADING)
            const coords = await API.searchByCityName(cityName)
            if (!validator.hasCoords(coords)) { this.stateManager(STATUS.NO_RESULT); return; }
            this.state.coords = coords
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
            const coords = await API.searchByCityName(initialCity)
            if (!validator.hasCoords(coords)) { this.stateManager(STATUS.NO_RESULT); return false; }
            this.state.coords = coords
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