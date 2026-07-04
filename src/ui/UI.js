'use strict'

//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\

// -------------
// --> This script is responsible for rendering data flow depending on APP state .
// -------------

import {
    getDayName, getMonthName,
    getIcon
} from "../logic/Logic.js"


const STATUS = {
    INITIIAL: "initial",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
    NO_RESULT: "noResult",
}

const UI = {

    // ///////////// //
    // Main Function //
    // ///////////// // 

    init({ weatherData = null, placeData = null, state = STATUS.NO_RESULT, units, date } = {}) {
        this.RenderController({ weatherData, placeData, state, units, date })
    },

    // //////////// //
    // DOM Elements //
    // //////////// //

    // this is the only Variable call DOM In my app

    elements: {
        cardElements: {
            cardLocation: document.getElementById("location"),
            cityTemp: document.getElementById("temperature"),
            cardIcon: document.getElementById("mainIcon"),
            thisDayDate: document.getElementById("date"),
        },

        mainElements: {
            windSpeed: document.getElementById("wind"),
            feelsLike: document.getElementById("feels-like-temp"),
            humiditly: document.getElementById("humidity-precent"),
            precipitation: document.getElementById("precipitation"),
        },

        stateElements: {
            // topbar
            topbar: document.querySelector(".topbar"),
            // header
            header: document.querySelector(".header"),
            headerTitle: document.querySelector(".header__title"),
            searchBtn: document.getElementById("search-btn"),
            headerSearchContainer: document.querySelector(".header__search"),
            unitsBtn: document.querySelector("[data-units-btn]"),
            headerSearchInput: document.querySelector("[data-search-input]"),
            // progress search
            searchInProgress: document.querySelector(".search-progress"),
            // suggestion
            suggestionList: document.querySelector(".suggestions .list__items"),

            // API error
            apiError: document.querySelector(".error"),
            // main
            main: document.querySelector(".main"),
            mainListItems: document.querySelectorAll(".current-info .list-item .item__content"),
            // hourly
            hourlyList: document.querySelector(".hourly-list"),
            hourlyItems: document.querySelectorAll(".hourly-list .list-item"),
            hourlyListItems: document.querySelector(".hourly-list .list-items"),
            daysList: document.querySelector("[data-select-daily]"),
            dayBtn: document.querySelector("[data-btn-days]"),
            BtnDaysList: document.querySelector(".select__options .day__options"),
            dayBtnText: document.querySelector("#btn__text"),
            // no result
            noResult: document.querySelector(".no-result"),
            noResultText: document.querySelector(".no-result .title"),
            // Error
            error: document.querySelector(".error-view"),
            // card
            loadingCard: document.querySelector(".loading-card"),
            card: document.querySelector(".card"),
            // daily
            dailyListItems: document.querySelector(".daily-forecast .daily__list"),
            dailyItems: document.querySelectorAll(".daily-forecast  .daily__list .list__item"),
            dayTitles: document.querySelectorAll("[data-day-title]"),
            // footer
            footer: document.querySelector(".footer"),
        }
    },

    // /////////////////////// //
    // UI Rendering Controller //
    // /////////////////////// //

    RenderController({ weatherData, placeData, state, units, date }) {
        const Renderers = {
            initial: this.RenderInitial,
            success: this.RenderSuccess,
            loading: this.RenderLoading,
            error: this.RenderError,
            noResult: this.RenderNoResult,
        }
        this.tools.selectedDay = date
        if (weatherData === null || placeData === null) { Renderers[state](); return; }
        Renderers[state]?.call(this, weatherData, placeData, units, date)
    },

    // ////////////////////// //
    // UI Rendering Tools kit //
    // ////////////////////// //

    tools: {
        unitsToShow: {
            KMH: "km/h",
            MPH: "mph",
            MM: "mm",
            IN: "in",
        },
        selectedDay: null,
    },

    // /////////////////// //
    // Rendering Functions //
    // /////////////////// //

    // ---------------
    // --->  Initial
    // ---------------

    RenderInitial(weatherData, placeData, units) {
        this.clearBody()
        this.RenderData(weatherData, placeData, units, date)
    },

    // -----------------
    // --->  Successs
    // -----------------

    RenderSuccess(weatherData, placeData, units) {
        this.clearBody()
        this.RenderData(weatherData, placeData, units, date)
    },

    // -----------------
    // --->  Loading
    // -----------------

    RenderLoading() {
        this.clearBody()
        this.getBodyLoading()
    },

    // -----------------
    // --->  Error
    // -----------------

    RenderError() {
        this.clearBody()
        this.getBodyError()
    },

    // -----------------
    // --->  No Result
    // -----------------

    RenderNoResult() {
        this.clearBody()
        this.getBodyNoResult()
    },

    // /////////////////////// //
    // Data Rendering Function //
    // /////////////////////// //

    RenderData(weatherData, placeData, units, date) {
        const cardData = weatherData.cardData
        this.RenderCard(cardData, placeData)

        const mainData = weatherData.mainTag
        this.RenderMain(mainData, units)

        const dailyData = weatherData.daily
        this.RenderDaily(dailyData)

        const hourlyItemWeatherData = weatherData.hourly
        const hourlyDayWeatherData = { daily: weatherData.daily, selectedDay: date }
        const hourlyData = { hourlyItemWeatherData, hourlyDayWeatherData }
        this.RenderHourly(hourlyData)
    },

    // //////////////////////// //
    // Data Rendering Functions //
    // //////////////////////// //

    // render suggestion
    RenderSuggestion(matchesCities, query){
        const html = matchesCities.map((city, index) => this.createSuggestionMarkup(index, city, query)).join("")
        this.elements.stateElements.suggestionList.innerHTML= html
    },

    // render card
    RenderCard(weatherData, placeData) {
        const date = new Date()
        this.elements.cardElements.cardLocation.textContent = `${placeData.city}, ${placeData.country}`
        this.elements.cardElements.cityTemp.textContent = `${weatherData.temp}°`
        this.elements.cardElements.cardIcon.src = `${weatherData.iconImg}`
        this.elements.cardElements.cardIcon.setAttribute("alt", weatherData.iconState)
        this.elements.cardElements.thisDayDate.textContent = `${getDayName(date)}, ${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`
    },

    // render main
    RenderMain(weatherData, units) {
        this.elements.mainElements.feelsLike.textContent = `${weatherData.temp}°`
        this.elements.mainElements.humiditly.textContent = `${weatherData.humidity}%`
        this.elements.mainElements.windSpeed.textContent = `${weatherData.wind} ${this.tools.unitsToShow[units.wind]}`
        this.elements.mainElements.precipitation.textContent = `${weatherData.prec} ${this.tools.unitsToShow[units.precipition]}`
    },

    // render daily
    RenderDaily(weatherData) {
        const html = weatherData.map(day => this.createDailyItem(day)).join("")
        this.elements.stateElements.dailyListItems.innerHTML = html
    },

    // render hourly
    RenderHourly(hourlyData) {
        const hourlyDaysSelectHtml = hourlyData.hourlyDayWeatherData.daily.map(day => this.createHourlyDayItem(day)).join("")
        this.elements.stateElements.BtnDaysList.innerHTML = hourlyDaysSelectHtml
        const hourlyHtml = hourlyData.hourlyItemWeatherData.map((hour, index) => this.createHourlyItem(hour, index)).join("")
        this.elements.stateElements.hourlyListItems.innerHTML = hourlyHtml
    },

    // //////// //
    // Builders //
    // //////// //


    createDailyItem(day) {
        return `
            <li class="list__item">

                <h3 class="title">
                ${getDayName(day.day, "short")}
                </h3>

                <div class="state-icon">
                    <img
                        class="img-cover"
                        src="${getIcon(day.iconCode)}"
                        alt="weather-icon"
                    />
                </div>

                <p class="degree high-degree">
                ${Math.round(day.highTemp)}°
                </p>

                <p class="degree low-degree">
                ${Math.round(day.lowTemp)}°
                </p>

            </li>
            `
    },

    createHourlyItem(hour, index) {
        return `
        <li class="list-item">
            <div class="icon">
                <img
                class="img-cover"
                src="${getIcon(hour.icon)}"
                alt="cloud-icon"
                data-hour-icon
                />
            </div>
            <p class="item__hour">${index % 12 || 12} ${index < 12 ? "AM" : "PM"}</p>
            <p class="item__degree" data-hour-degree>${hour.temp}°</p>
        </li>
        `
    },

    createHourlyDayItem(day) {
        const today = this.tools.selectedDay.toISOString().slice(0,10)
        let isSelected = false
        if (day.day === today) isSelected = true
        return `<li class="day__option" data-day=${day.day} role="option" aria-selected="${isSelected}">${getDayName(day.day)}</li> `
    },

    createSuggestionMarkup(index, city, query){
        const suggestion = `
        <li
              class="list__item"
              aria-selected="false"
              id="suggest-${index}"
              role="option"
              data-suggestion-item
            >
              ${this.prepareCityName(city, query)}
        </li>
        `
        return suggestion
    },

    prepareCityName(city, query){
        const match = city.slice(query.length)
        return `<span class="matches">${query}</span>${match}`
    },

    // /////////////////////// //
    // Only UI State Functions //
    // /////////////////////// //

    // ---------
    // Loading
    // ---------

    // run loading state
    getBodyLoading() {
        document.body.setAttribute("inert", "")
        document.body.setAttribute("data-state", "loading")
    },

    // ---------
    // Error
    // ---------

    // run error state
    getBodyError() {
        document.body.setAttribute("data-state", "error")
        this.elements.stateElements.unitsBtn.setAttribute("inert", "")
        document.querySelectorAll(".hide").forEach(item => {item.setAttribute("inert", "") })
    },

    // -----------
    // No Result
    // ---------=-

    getBodyNoResult() {
        document.body.setAttribute("data-state", "noResult")
        this.elements.unitsBtn.setAttribute("disabled")

    },

    // /////////////// //
    // Cleaning Engain //
    // /////////////// //

    clearBody() {
        document.body.removeAttribute("data-state")
        document.body.removeAttribute("inert")
    },

}


export default UI 