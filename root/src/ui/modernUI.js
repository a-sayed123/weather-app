'use strict'

//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\

import {
    getDayName, getMonthName, getDayListNames,
    updateTextElement, updateSrcElements, orderDays,
    ICON_SRC, ICON_CODES, getIcon,
    getHourlyByDay
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

    init({ weatherData = null, placeData = null, state = STATUS.NO_RESULT, units } = {}) {
        this.RenderController({ weatherData, placeData, state, units })
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
            // header
            headerTitle: document.querySelector(".header__title"),
            searchBtn: document.getElementById("search-btn"),
            headerSearchContainer: document.querySelector(".header__search"),
            unitsBtn: document.querySelector("[data-units-btn]"),
            unitsList: document.querySelector("[data-units-list]"),
            headerSearchInput: document.querySelector("[data-search-input]"),
            // progress search
            searchInProgress: document.querySelector(".search-progress"),
            // suggestion
            suggestionList: document.querySelector("[data-suggestion-select]"),
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

    RenderController({ weatherData, placeData, state, units }) {
        const Renderers = {
            initial: this.RenderInitial,
            success: this.RenderSuccess,
            loading: this.RenderLoading,
            error: this.RenderError,
            noResult: this.RenderNoResult,
        }

        if (weatherData === null || placeData === null) { Renderers[state](); return; }
        Renderers[state]?.call(this, weatherData, placeData, units)
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
    },

    // /////////////////// //
    // Rendering Functions //
    // /////////////////// //

    // ---------------
    // --->  Initial
    // ---------------

    RenderInitial(weatherData, placeData, units) {
        this.RenderData(weatherData, placeData, units)
    },

    // -----------------
    // --->  Successs
    // -----------------

    RenderSuccess(weatherData, placeData, units) {
        this.RenderData(weatherData, placeData, units)
    },

    // -----------------
    // --->  Loading
    // -----------------

    RenderLoading() {
        this.getBodyLoading()
        this.getCardLoading()
        this.getMainLoading()
        this.getDailyLoading()
        this.getHourlyLoading()
    },

    // -----------------
    // --->  Error
    // -----------------

    RenderError() { },

    // -----------------
    // --->  No Result
    // -----------------

    RenderNoResult() { },

    // /////////////////////// //
    // Data Rendering Function //
    // /////////////////////// //

    RenderData(weatherData, placeData, units) {
        const cardData = weatherData.cardData
        this.RenderCard(cardData, placeData)

        const mainData = weatherData.mainTag
        this.RenderMain(mainData, units)

        const dailyData = weatherData.daily
        this.RenderDaily(dailyData)

        const hourlyItemWeatherData = weatherData.hourly
        const hourlyDayWeatherData = weatherData.daily
        const hourlyData = { hourlyItemWeatherData, hourlyDayWeatherData }
        this.RenderHourly(hourlyData)
    },

    // //////////////////////// //
    // Data Rendering Functions //
    // //////////////////////// //

    // render card
    RenderCard(weatherData, placeData) {
        const date = new Date()
        this.elements.cardElements.cardLocation.textContent = `${placeData.city}, ${placeData.country}`
        this.elements.cardElements.cityTemp.textContent = `${weatherData.temp}°`
        this.elements.cardElements.cardIcon.src = `${getIcon(weatherData.iconCode)}`
        this.elements.cardElements.thisDayDate.textContent = `${getDayName(date)}, ${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`
    },

    // render main
    RenderMain(weatherData, units) {
        this.elements.mainElements.feelsLike.textContent = `${weatherData.temp}°`
        this.elements.mainElements.humiditly.textContent = `${weatherData.humidity}%`
        this.elements.mainElements.windSpeed.textContent = `${weatherData.wind} ${this.tools.unitsToShow[units.wind]}`
        this.elements.mainElements.precipitation.textContent = `${weatherData.prec} ${this.tools.unitsToShow[units.precipition]}`
        console.log(weatherData)
    },

    // render daily
    RenderDaily(weatherData) {

        const html = weatherData.map(day => this.createDailyItem(day)).join("")
        this.elements.stateElements.dailyListItems.innerHTML = html
    },

    // render hourly
    RenderHourly(hourlyData) {
        const hourlyDaysSelectHtml = hourlyData.hourlyDayWeatherData.map(day => this.createHourlyDayItem(day)).join("")
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
        return `<li class="day__option" data-day=${day.day}>${getDayName(day.day)}</li> `
    },

    // /////////////////////// //
    // Only UI State Functions //
    // /////////////////////// //

    // ---------
    // Loading
    // ---------

    getBodyLoading() {
        document.body.classList.add("loading")
    },

    getCardLoading() {
        const html = `
            <div class="loading">
                <p class="text">Loading...</p>
                <div class="icon">
                <img
                    class="img-cover"
                    src="./assets/images/icon-loading.svg"
                    alt="Loading Icon"
                />
                </div>
            </div>
            `
        this.elements.stateElements.card.innerHTML = html
        this.elements.stateElements.card.classList.add("loading")
    },

    getMainLoading() {
        console.log(this.elements.stateElements.mainListItems)
        this.elements.stateElements.mainListItems.forEach(item => {
            item.classList.add("loading")
        })
    },

    getDailyLoading() {
        this.elements.stateElements.dailyItems.forEach(item => { item.classList.add("loading") })
    },

    getHourlyLoading() {
        this.elements.stateElements.dayBtn.classList.add("loading")
        this.elements.stateElements.hourlyItems.forEach(item => { item.classList.add("loading") });
        this.elements.stateElements.hourlyListItems.classList.add("loading")
    },

}

export default UI 