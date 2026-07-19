'use strict'

// ----- IMPORT -----
import UI from "../ui/UI.js"
import * as Logic from "../logic/Logic.js"
import * as API from "../data/API.js"
import validator from "../tools/validator.js"
import { UIcontroller } from "../ui/UIcontroller.js"
import Cities from "../data/Cities.js"
import Cache from "../tools/Cache.js"
import LANGUAGE_CITY_MAP from "../config/langugeCityMap.js"

const APP = {

    // ==================================================
    // 1. Domain State
    // ==================================================

    state: {
        status: "",
        theme: "dark",
        units: {
            temperature: "C",
            wind: "KMH",
            precipition: "MM",
        },
        location: {},
        locationSource: "local",
        processedData: {
            weather: {},
            place: {},
        },
        rawData: {},
        coords: { lat: 21.42664, lon: 39.82563 },
        selectedDay: new Date(),
    },
    services: {
        cache: null,
        resultStrategies: {},
        extractors: {},
        locationStrategies: [],
    },
    config: {
        cache: {
            maxSize: 10,
            ttlMinutes: 10,
        },
        STATUS: {
            INITIIAL: "initial",
            LOADING: "loading",
            SUCCESS: "success",
            ERROR: "error",
            NO_RESULT: "noResult",
        },
    },

    runtime: {
        metrics: { cacheHit: 0, cacheMiss: 0 }
    },

    // ==================================================
    // 2. Initialization
    // ==================================================

    init() {
        const { maxSize, ttlMinutes } = this.config.cache
        this.services.cache = new Cache(maxSize, ttlMinutes * 60 * 1000)
        this.bindEvents()
        this.services.locationStrategies = [
            this.cachePipeline.bind(this),
            this.localPipeline.bind(this),
            this.apiPipeline.bind(this),
        ]
        this.services.resultStrategies = {
            cache: this.useCacheResult.bind(this),
            local: this.useLocalResult.bind(this),
            fallback: this.useAPIResult.bind(this),
        }
        this.services.extractors = {
            fallback: this.extractDataFromAPI.bind(this),
            local: this.extractDataFromLocal.bind(this),
        }
    },

    // ==================================================
    // 3. Event Binding
    // ==================================================

    bindEvents() {
        UIcontroller.init({
            onAppInit: this.handleAppInit.bind(this),
            onSearchRequested: this.handleSearch.bind(this),
            onLocationAllow: this.handleGeolocationAccepted.bind(this),
            onUnitChange: this.handleChangeUnits.bind(this),
            onDayChange: this.handleChangeDay.bind(this),
        })
    },


    // ==================================================
    // 4. Event Handlers
    // ==================================================

    async handleAppInit() {
        await this.initializeWorkflow()
        return true
    },
    async handleSearch(cityName) {
        if (!validator.isValidCityName(cityName)) return false
        this.transitionToState(this.config.STATUS.LOADING)
        await this.searchWorkflow(cityName)
        this.transitionToState(this.config.STATUS.SUCCESS)
    },
    handleGeolocationAccepted() {
        this.geolocationWorkflow()
    },
    handleChangeUnits(type, unit) {
        if (this.state.units[type] === unit)
            return
        this.changeUnitWorkflow(type, unit)
    },
    handleChangeDay(day) {
        const dayDate = day.dataset.day
        if (!dayDate) return
        this.changeDayWorkflow(dayDate)
    },

    // ==================================================
    // 5. Workflows
    // ==================================================

    async initializeWorkflow() {
        const city = this.getInitialCity()
        if (!validator.isValidCityName(city)) {
            this.transitionToState(this.config.STATUS.ERROR)
            return
        }
        const result = await this.searchWorkflow(city)
        if (!result) {
            this.transitionToState(this.config.STATUS.NO_RESULT)
            return
        }
        this.transitionToState(this.config.STATUS.INITIIAL)
    },
    async searchWorkflow(cityName) {
        const result = await this.searchProviders(cityName)
        if (!result) return null
        const { source, data } = result
        this.state.locationSource = source
        this.applySearchResult(source, data)
        if (source !== "cache") { await this.fetchAndProcessData(); }
        this.transitionToState(this.config.STATUS.SUCCESS)
        this.renderUI()
        return true
    },
    changeUnitWorkflow(type, unit) {
        this.state.units[type] = unit
        this.reprocessData()
        this.renderUI()
    },
    geolocationWorkflow() {
        try {
            navigator.geolocation.getCurrentPosition(
                this.geolocationSuccessWorkflow.bind(this),
                this.geolocationErrorWorkflow.bind(this)
            )
        } catch { this.transitionToState(STATUS.ERROR); return; }
    },
    async geolocationSuccessWorkflow(position) {
        const { latitude, longitude } = position.coords
        const coords = { lat: latitude, lon: longitude }
        if (!validator.hasCoords(coords)) { this.transitionToState(this.config.STATUS.NO_RESULT); return; }
        this.state.coords = { lat: latitude, lon: longitude }
        this.state.locationSource = "fallback"
        await this.fetchAndProcessData()
        this.transitionToState(this.config.STATUS.SUCCESS)
        this.renderUI()
    },
    async geolocationErrorWorkflow() {
        console.log("User denied location")
        await this.initializeWorkflow()
    },
    changeDayWorkflow(dayDate) {
        this.state.selectedDay = new Date(dayDate)
        this.reprocessData()
        this.renderUI()
    },



    // ==================================================
    // 6. State Transitions
    // ==================================================

    async transitionToState(state) {
        const states = {
            initial: async () => {
                this.setState(this.config.STATUS.INITIIAL)
            },
            success: async () => {
                this.setState(this.config.STATUS.SUCCESS)
            },
            loading: () => {
                this.setState(this.config.STATUS.LOADING)
                this.renderUI()
            },
            error: () => {
                this.setState(this.config.STATUS.ERROR)
                this.renderUI()
            },
            noResult: () => {
                console.trace()
                this.setState(this.config.STATUS.NO_RESULT)
                this.renderUI()
            },
        }
        const handler = states[state]

        if (!handler) {
            throw new Error(`unknown state : ${state}`)
        }

        await handler()
    },
    setState(state) {
        const isValidState = Object.values(this.config.STATUS).includes(state)
        if (!isValidState) { throw new Error(`Unknown state: ${state}`) }
        this.state.status = state
    },

    // ==================================================
    // 7. Private Helpers
    // ==================================================

    async searchProviders(cityName) {
        let result = {}
        for (const provider of this.services.locationStrategies) {
            result = await provider(cityName)
            if (result) break
        }
        return result
    },
    cachePipeline(cityName) {
        const cityInCache = this.services.cache.get(cityName)
        if (!cityInCache) return null
        this.runtime.metrics.cacheHit++
        return { source: "cache", data: cityInCache }
    },
    async localPipeline(cityName) {
        const citydetails = await Cities.init({ query: cityName })
        if (!citydetails?.length) return null
        this.runtime.metrics.cacheMiss++
        return { source: "local", data: citydetails[0] }
    },
    async apiPipeline(cityName) {
        try {
            const { lat, lon } = await API.searchByCityName(cityName)
            this.state.coords = { lat, lon }
        } catch (error) { this.transitionToState(STATUS.ERROR); console.log(error); return null; }
        this.runtime.metrics.cacheMiss++
        return { source: "fallback", data: { lat, lon } }
    },
    applySearchResult(source, data) {
        this.services.resultStrategies[source](data)
    },
    useCacheResult(result) {
        this.state.processedData = result
    },
    useLocalResult(result) {
        this.state.location = result
        this.state.coords = { lat: result.lat, lon: result.lon }
    },
    useAPIResult(result) {
        this.state.coords = result
    },
    renderUI() {
        UI.init({
            weatherData: this.state.processedData.weather,
            placeData: this.state.processedData.place,
            date: this.state.selectedDay,
            state: this.state.status,
            units: this.state.units,
        })
    },
    getInitialCity() {
        const lang = navigator.language.split("-")[0]
        return LANGUAGE_CITY_MAP[lang] || "Makkah Al Mukarramah"
    },
    async fetchAndProcessData() {
        this.state.rawData = await this.fetchData({
            coords: this.state.coords,
            source: this.state.locationSource,
        })
        // filtering data
        this.state.processedData.weather = Logic.buildWeatherView({
            data: this.state.rawData.weatherData,
            selectedDate: this.state.selectedDay,
            units: this.state.units,
        })
        this.state.processedData.place = Logic.getPlace({
            data: this.state.rawData.placeData,
            source: this.state.locationSource,
        })
        this.services.cache.set(this.state.processedData.place.city, this.state.processedData)
        return true
    },
    reprocessData() {
        this.state.processedData.weather = Logic.buildWeatherView({
            data: this.state.rawData.weatherData,
            selectedDate: this.state.selectedDay,
            units: this.state.units,
        })
        this.state.processedData.place = Logic.getPlace({
            data: this.state.rawData.placeData,
            source: this.state.locationSource,
        })
        this.services.cache.set(this.state.processedData.place.city, this.state.processedData)
        return true
    },
    async fetchData({ coords, source }) {
        try {
            return {
                weatherData: await API.getWeather(coords),
                placeData: await this.services.extractors[source](coords),
            }
        } catch (error) { return false; }
        return null
    },
    extractDataFromLocal(coords) {
        return this.state.location
    },
    async extractDataFromAPI(coords) {
        return await API.getPlaceName(coords)
    },

    // ==================================================
    // 8. Development Tools
    // ==================================================

    debugState() {
        console.log("App state --> ", this.state)
        console.trace()
    },
    debugServices() {
        console.log("App services --> ", this.services)
    },
    debugRuntime() {
        console.log("App runtime --> ", this.runtime)
    },
}
export default APP