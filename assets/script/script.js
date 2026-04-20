'use strict'

import { getPlaceName, getweather } from "./api.js"
import { dateThisDay, UpdateCard, updateMain, updateDaily, updateHourly, updateUi } from "./ui.js"
import { getHourlyByDay,getDailyForecast,getMainTagData,getCurrentWeather,getPlace} from "./logic.js"
// import {getKeyByValue} from "./utils.js"

const date = new Date()
// console.log(date.getMonth())
// ------------------
// ---> Variables
// ------------------

// ---> overlay

const overlay = document.querySelector("[data-overlay]")

// ---> preloader

const PreLoader = document.querySelector("[data-preloader]")

// ---> confraim

const confraim = document.querySelector("[data-confraim]")
const confraimChoice = document.querySelectorAll("[data-confraim-choice]")
let userChoice = false

// ---> header select ( Units )

const selectHeader = document.querySelector("[data-select-header]")
const selectBtn = document.querySelector("[data-select-btn-header]")
const TempSelect = document.querySelectorAll("[data-temp-select]")
const windSelect = document.querySelectorAll("[data-wind-select]")
const precSelect = document.querySelectorAll("[data-prec-select]")

// ---> suggestions Select

const suggestionSelect = document.querySelector("[data-suggestion-select]")
const suggestItem = document.querySelectorAll("[data-suggest-item]")
const SearchInput = document.querySelector("[data-search-input]")

// ---> daily forecast select

const dailySelect = document.querySelector("[data-select-daily]")
const DayOptions = document.querySelectorAll("[data-day-select]")
const daysBtn = document.querySelector("[data-btn-days]")
const selectDaysBtnText = document.getElementById("btn__text")

// ------------------
// ---> Events 
// ------------------


// ---> preloader

// window.addEventListener("load", () => {
//     PreLoader.classList.add("hide")
// })

// ---> confraim

confraimChoice[1].addEventListener("click", () => {
    userChoice = false
    confraim.classList.add("hide")
    overlay.classList.add("hide")
})

// ---> header select ( Units )

selectBtn.addEventListener("click", () => {
    selectHeader.classList.toggle("hide")
})

document.addEventListener("click", (e) => {
    if (!selectBtn.contains(e.target)) {
        selectHeader.classList.add("hide")
    }
})

selectHeader.querySelectorAll("[data-temp-select]").forEach(li => {
    li.addEventListener('click', () => {
        selectHeader.querySelectorAll("[data-temp-select]").forEach(item => item.classList.remove("checked"))
        li.classList.add("checked")
        selectHeader.classList.add("hide")
    })
})

selectHeader.querySelectorAll("[data-wind-select]").forEach(li => {
    li.addEventListener('click', () => {
        selectHeader.querySelectorAll("[data-wind-select]").forEach(item => item.classList.remove("checked"))
        li.classList.add("checked")
        selectHeader.classList.add("hide")
    })
})

selectHeader.querySelectorAll("[data-prec-select]").forEach(li => {
    li.addEventListener('click', () => {
        selectHeader.querySelectorAll("[data-prec-select]").forEach(item => item.classList.remove("checked"))
        li.classList.add("checked")
        selectHeader.classList.add("hide")
    })
})

// ---> suggestions Select

SearchInput.addEventListener("click", () => {
    suggestItem.forEach(item => {
        item.addEventListener("click", () => {
            suggestItem.forEach(i => {
                i.classList.remove("selected")
            })
            SearchInput.value = item.textContent
            item.classList.add("selected")
            suggestionSelect.classList.add("hide")
        })
    })
    suggestionSelect.classList.toggle("hide")
})

document.addEventListener("click", (e) => {
    if (!SearchInput.contains(e.target)) {
        suggestionSelect.classList.add("hide")
    }
})

// ---> daily forecast select

daysBtn.addEventListener("click", () => {
    dailySelect.classList.toggle("hide")
})

DayOptions.forEach(item => {
    item.addEventListener("click", () => {
        selectDaysBtnText.textContent = item.textContent
        dailySelect.classList.add("hide")
        DayOptions.forEach(i => {
            i.classList.remove("selected")
        })
        item.classList.add("selected")
    })
})

document.addEventListener("click", (e) => {
    if (!daysBtn.contains(e.target)) {
        dailySelect.classList.add("hide")
    }
})

// ---------------------
// ---> APIs & Functions
// ---------------------

//  ----> VARIABLES

// glopal
const cardLocation = document.getElementById("location")
const searchBtn = document.getElementById("search-btn")
// const dateThisDay = new Date()
// const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
// const dayCompleteNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
// const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",]
const units = {
    "celsius": document.getElementById("celsius"),
    "fahrenheit": document.getElementById("fahrenheit"),
    "kilometerPerHour": document.getElementById("kilometerPerHour"),
    "milesPerHour": document.getElementById("milesPerHour"),
    "milliMeter": document.getElementById("milliMeter"),
    "inch": document.getElementById("inch"),
}

const icons = {
    0: "./assets/images/icon-sunny.webp",
    1: "./assets/images/icon-sunny.webp",
    2: "./assets/images/icon-partly-cloudy.webp",
    3: "./assets/images/icon-overcast.webp",
    45: "./assets/images/icon-fog.webp",
    48: "./assets/images/icon-fog.webp",
    51: "./assets/images/icon-drizzle.webp",
    53: "./assets/images/icon-drizzle.webp",
    55: "./assets/images/icon-drizzle.webp",
    56: "./assets/images/icon-drizzle.webp",
    57: "./assets/images/icon-drizzle.webp",
    61: "./assets/images/icon-rain.webp",
    63: "./assets/images/icon-rain.webp",
    65: "./assets/images/icon-rain.webp",
    66: "./assets/images/icon-rain.webp",
    67: "./assets/images/icon-rain.webp",
    71: "./assets/images/icon-snow.webp",
    73: "./assets/images/icon-snow.webp",
    75: "./assets/images/icon-snow.webp",
    77: "./assets/images/icon-snow.webp",
    80: "./assets/images/icon-rain.webp",
    81: "./assets/images/icon-rain.webp",
    82: "./assets/images/icon-rain.webp",
    85: "./assets/images/icon-snow.webp",
    86: "./assets/images/icon-snow.webp",
    95: "./assets/images/icon-storm.webp",
    96: "./assets/images/icon-storm.webp",
    99: "./assets/images/icon-storm.webp",
}

// header
const cityTemp = document.getElementById("temperature")
const cardIcon = document.getElementById("mainIcon")
const thisDayDate = document.getElementById("date")



// daily forcast
export const dayTitle = document.querySelectorAll("[data-day-title]")
export const dailyBtnText = document.getElementById("btn__text")
const daysHighDegree = {
    1: document.getElementById("high-degree-Tue"),
    2: document.getElementById("high-degree-Wed"),
    3: document.getElementById("high-degree-Thu"),
    4: document.getElementById("high-degree-Fri"),
    5: document.getElementById("high-degree-Sat"),
    6: document.getElementById("high-degree-Sun"),
    7: document.getElementById("high-degree-Mon"),
}
const daysLowDegree = {
    1: document.getElementById("low-degree-Tue"),
    2: document.getElementById("low-degree-Wed"),
    3: document.getElementById("low-degree-Thu"),
    4: document.getElementById("low-degree-Fri"),
    5: document.getElementById("low-degree-Sat"),
    6: document.getElementById("low-degree-Sun"),
    7: document.getElementById("low-degree-Mon"),
}
const dailyIcons = {
    1: document.getElementById("Tue-icon"),
    2: document.getElementById("Wed-icon"),
    3: document.getElementById("Thu-icon"),
    4: document.getElementById("Fri-icon"),
    5: document.getElementById("Sat-icon"),
    6: document.getElementById("Sun-icon"),
    7: document.getElementById("Mon-icon"),
}

// hourly forcast
const hoursDegree = {
    0: document.getElementById("hour-0-degree"),
    1: document.getElementById("hour-1-degree"),
    2: document.getElementById("hour-2-degree"),
    3: document.getElementById("hour-3-degree"),
    4: document.getElementById("hour-4-degree"),
    5: document.getElementById("hour-5-degree"),
    6: document.getElementById("hour-6-degree"),
    7: document.getElementById("hour-7-degree"),
    8: document.getElementById("hour-8-degree"),
    9: document.getElementById("hour-9-degree"),
    10: document.getElementById("hour-10-degree"),
    11: document.getElementById("hour-11-degree"),
    12: document.getElementById("hour-12-degree"),
    13: document.getElementById("hour-13-degree"),
    14: document.getElementById("hour-14-degree"),
    15: document.getElementById("hour-15-degree"),
    16: document.getElementById("hour-16-degree"),
    17: document.getElementById("hour-17-degree"),
    18: document.getElementById("hour-18-degree"),
    19: document.getElementById("hour-19-degree"),
    20: document.getElementById("hour-20-degree"),
    21: document.getElementById("hour-21-degree"),
    22: document.getElementById("hour-22-degree"),
    23: document.getElementById("hour-23-degree"),
}
const currentTime = dateThisDay.toISOString().slice(0, 13)
const hoursIcons = {
    0: document.getElementById("hour-0-icon"),
    1: document.getElementById("hour-1-icon"),
    2: document.getElementById("hour-2-icon"),
    3: document.getElementById("hour-3-icon"),
    4: document.getElementById("hour-4-icon"),
    5: document.getElementById("hour-5-icon"),
    6: document.getElementById("hour-6-icon"),
    7: document.getElementById("hour-7-icon"),
    8: document.getElementById("hour-8-icon"),
    9: document.getElementById("hour-9-icon"),
    10: document.getElementById("hour-10-icon"),
    11: document.getElementById("hour-11-icon"),
    12: document.getElementById("hour-12-icon"),
    13: document.getElementById("hour-13-icon"),
    14: document.getElementById("hour-14-icon"),
    15: document.getElementById("hour-15-icon"),
    16: document.getElementById("hour-16-icon"),
    17: document.getElementById("hour-17-icon"),
    18: document.getElementById("hour-18-icon"),
    19: document.getElementById("hour-19-icon"),
    20: document.getElementById("hour-20-icon"),
    21: document.getElementById("hour-21-icon"),
    22: document.getElementById("hour-22-icon"),
    23: document.getElementById("hour-23-icon"),
}

// ---> API affective function


// Position API


// weather API Function

// function getweather(lat, long) {

//     fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,weathercode`)
//         .then(res => res.json())
//         .then(data => {
//             const hourIndex = data.hourly.time.findIndex(t => t.startsWith(currentTime))
//             // const dailyDays = data.daily.time.map(dateStr => {
//             //     const date = new Date(dateStr + "T00:00:00Z")
//             //     return dayNames[date.getUTCDay()]
//             // })

//             // const dailyCompleteDays = data.daily.time.map(dateStr => {
//             //     const date = new Date(dateStr + "T00:00:00Z")
//             //     return dayCompleteNames[date.getUTCDay()]
//             // })


//             console.log(data)
//             //  operations

//             cityTemp.textContent = `${data.current_weather.temperature}°`

//             cardIcon.src = `${icons[data.current_weather.weathercode]}`

//             // hourly forcast operation forloop
//             const firstHourEveryDay = {
//                 0: 0,
//                 1: 24,
//                 2: 48,
//                 3: 72,
//                 4: 96,
//                 5: 120,
//                 6: 144,
//             }
//             const lastHourEveryDay = {
//                 0: 23,
//                 1: 47,
//                 2: 71,
//                 3: 95,
//                 4: 119,
//                 5: 143,
//                 6: 167,
//             }

//             for (let i = 0; i <= 23; i++) {
//                 hoursDegree[i].textContent = `${data.hourly.temperature_2m[i]}°`
//                 const hourlyIconCode = data.hourly.weathercode[i]
//                 hoursIcons[i].src = icons[hourlyIconCode]
//             }

//             // daily forcast operation forloop
//             for (let i = 0; i < 6; i++) {
//                 // dayTitle[i].textContent = dailyDays[i]
//                 daysHighDegree[i + 1].textContent = `${data.daily.temperature_2m_max[i]}°`
//                 daysLowDegree[i + 1].textContent = `${data.daily.temperature_2m_min[i]}°`
//                 const dailyIconCode = data.daily.weathercode[i + 1]
//                 dailyIcons[i + 1].src = icons[dailyIconCode]
//                 // DayOptions[i].textContent = dailyCompleteDays[i]
//             }
//             daysHighDegree[7].textContent = `${data.daily.temperature_2m_max[6]}°`
//             daysLowDegree[7].textContent = `${data.daily.temperature_2m_min[6]}°`
//             // day-7
//             // dayTitle[6].textContent = dailyDays[6]
//             daysOrder(dayNames)
//             daysOrder(dayCompleteNames, DayOptions)
//             // DayOptions[6].textContent = dailyCompleteDays[6]

//             // dailyBtnText.textContent = dayCompleteNames[dateThisDay.getUTCDay()] // default btn day name
//             putCurrentDay(dailyBtnText)
//             // card date
//             thisDayDate.textContent = `${dayCompleteNames[dateThisDay.getUTCDay()]}, ${monthsNames[dateThisDay.getMonth()]}, ${dateThisDay.getFullYear()}`

//             // main tag quantities API
//             feelsLike.textContent = `${data.hourly.apparent_temperature[hourIndex]}°`
//             humiditly.textContent = `${data.hourly.relative_humidity_2m[hourIndex]}%`
//             windSpeed.textContent = `${data.current_weather.windspeed} km/h`
//             precipitation.textContent = `${data.hourly.precipitation[hourIndex]} mm`

//             // Events
//             // tempreture
//             units["fahrenheit"].addEventListener("click", () => {

//                 // card temp
//                 cityTemp.textContent = `${((data.current_weather.temperature * 1.8) + 32).toFixed(2)}°`

//                 // main 
//                 feelsLike.textContent = `${((data.hourly.apparent_temperature[hourIndex] * 1.8) + 32).toFixed(2)}°`

//                 // hourly forecast
//                 for (let i = 0; i <= 23; i++) {
//                     hoursDegree[i].textContent = `${((data.hourly.temperature_2m[i] * 1.8) + 32).toFixed(2)}°`
//                 }

//                 // daily forecast
//                 for (let i = 0; i < 6; i++) {
//                     daysHighDegree[i + 1].textContent = `${((data.daily.temperature_2m_max[i] * 1.8) + 32).toFixed(2)}°`
//                     daysLowDegree[i + 1].textContent = `${((data.daily.temperature_2m_min[i] * 1.8) + 32).toFixed(2)}°`
//                 }
//                 daysHighDegree[7].textContent = `${((data.daily.temperature_2m_max[6] * 1.8) + 32).toFixed(2)}°`
//                 daysLowDegree[7].textContent = `${((data.daily.temperature_2m_min[6] * 1.8) + 32).toFixed(2)}°`

//             })
//             units["celsius"].addEventListener("click", () => {
//                 // card temp
//                 cityTemp.textContent = `${data.current_weather.temperature}°`

//                 // main 
//                 feelsLike.textContent = `${data.hourly.apparent_temperature[hourIndex]}°`

//                 // hourly forecast
//                 for (let i = 0; i <= 23; i++) {
//                     hoursDegree[i].textContent = `${data.hourly.temperature_2m[i]}°`
//                 }

//                 // daily forecast
//                 for (let i = 0; i < 6; i++) {
//                     daysHighDegree[i + 1].textContent = `${data.daily.temperature_2m_max[i]}°`
//                     daysLowDegree[i + 1].textContent = `${data.daily.temperature_2m_min[i]}°`
//                 }
//                 daysHighDegree[7].textContent = `${data.daily.temperature_2m_max[6]}°`
//                 daysLowDegree[7].textContent = `${data.daily.temperature_2m_min[6]}°`

//             })
//             // windSpeed
//             units["milesPerHour"].addEventListener("click", () => {
//                 windSpeed.textContent = `${(data.current_weather.windspeed * 0.621371).toFixed(2)} mph`
//             })
//             units["kilometerPerHour"].addEventListener("click", () => {
//                 windSpeed.textContent = `${data.current_weather.windspeed} km/h`
//             })
//             // precipitation Inches = mm / 25.4 
//             units["inch"].addEventListener("click", () => {
//                 precipitation.textContent = `${(data.hourly.precipitation[hourIndex] / 25.4).toFixed(2)} in`
//             })
//             units["milliMeter"].addEventListener("click", () => {
//                 precipitation.textContent = `${data.hourly.precipitation[hourIndex]} mm`
//             })

//             // hourly select days

//             DayOptions.forEach(item => {
//                 item.addEventListener("click", () => {
//                     DayOptions.forEach(i => { i.classList.remove("selected") })
//                     let dayIndex = getKeyByValue(DayOptions, item)
//                     let firstHour = firstHourEveryDay[dayIndex]
//                     let lastHour = lastHourEveryDay[dayIndex]
//                     let iteration = 0
//                     for (let i = firstHour; i <= lastHour; i++) {
//                         hoursDegree[iteration].textContent = `${data.hourly.temperature_2m[i]}°`
//                         const hourlyIconCode = data.hourly.weathercode[i]
//                         hoursIcons[iteration].src = icons[hourlyIconCode]
//                         iteration++;
//                     }
//                     item.classList.add("selected")
//                 })
//             })
//         })
// }

// getPlaceName(lat, long)
// getweather(lat, long)

// geolocation 

confraimChoice[0].addEventListener("click", () => {
    PreLoader.classList.remove("hide")
    navigator.geolocation.getCurrentPosition(onSucess, onError)
    async function onSucess(position) {
        lat = position.coords.latitude
        long = position.coords.longitude
        await getweather(lat, long)
        // await getPlaceName(lat, long, cardLocation)
        PreLoader.classList.add("hide")
        confraim.classList.add("hide")
        overlay.classList.add("hide")
    }
    async function onError(err) {
        console.warn("Geolocation Faield :" + err)
        PreLoader.classList.add("hide")
        confraim.classList.add("hide")
        overlay.classList.add("hide")
    }
})

// async function handleSearch(cityName) {
//     const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}&limit=1&accept-language=en`)
//     const result = await response.json()
//     let lat = result[0].lat
//     let lon = result[0].lon
//     return [lat, lon]
// }

searchBtn.addEventListener("click", async () => {
    let city = await handleSearch(SearchInput.value.trim())
    console.log(city)
    getPlaceName(city[0], city[1], cardLocation)
    getweather(city[0], city[1])
})




export const UIcontroller = {
    // --------------------
    // ---> ELEMENTS OBJECT
    // --------------------
    elements: {},
    docClickHandlers: [],

    // -------------------
    // ---> INIT
    // -------------------
    init() {
        this.casheDOM()
        this.bindEvents()
    },


    // -------------------
    // ---> Dom cahe
    // -------------------
    casheDOM() {
        this.elements = {
            // ---> preloader
            PreLoader: document.querySelector("[data-preloader]"),
            // ---> overlay
            overlay: document.querySelector("[data-overlay]"),
            // ---> confraim
            confraim: document.querySelector("[data-confraim]"),
            // ---> header select ( Units )
            toggleBtn: document.querySelector("[data-select-btn-header]"),
            menu: document.querySelector("[data-select-header]"),
            // ---> suggestions Select
            suggestionSelect: document.querySelector("[data-suggestion-select]"),
            suggestItem: document.querySelectorAll("[data-suggest-item]"),
            SearchInput: document.querySelector("[data-search-input]"),
            // ---> daily forecast select
            dailySelect: document.querySelector("[data-select-daily]"),
            DayOptions: document.querySelectorAll("[data-day-select]"),
            daysBtn: document.querySelector("[data-btn-days]"),
            selectDaysBtnText: document.getElementById("btn__text"),
        }
    },

    // ,-------------------
    // ---> Events System
    // -------------------
    bindEvents() {
        // document
        this.docClickHandlers = [
            this.handleOutsideClickUnits.bind(this),
            this.handleOutsideClickSuggestions.bind(this),
            this.handleOutsideClickHourlyDays.bind(this),
        ]

        document.addEventListener("click", this.handleMainClickDom.bind(this))

        // ---> preloader
        window.addEventListener("load", this.handlePageLoad.bind(this))

        // ---> confraim
        const choiceHandlers = {
            allow: () => this.handleAllow(),
            deny: () => this.handleDeny(),
        }
        this.elements.confraim.addEventListener("click", (e) => {
            const button = e.target.closest("[data-choice]")
            if (!button) return
            const choice = button.dataset.choice
            choiceHandlers[choice]?.()
        })

        // ---> header select ( Units )
        this.elements.toggleBtn.addEventListener("click", this.toggleMenu.bind(this))
        this.elements.menu.addEventListener("click", this.handleMenuClick.bind(this))

        // ---> suggestions Select
        this.elements.SearchInput.addEventListener("click", this.handleSuggestions.bind(this))
        this.elements.suggestItem.forEach(item => {
            item.addEventListener("click", this.handleSuggestionsItems.bind(this, item))
        })

        // ---> daily forecast select
        this.elements.daysBtn.addEventListener("click", this.handleDaysBtn.bind(this))
        this.elements.DayOptions.forEach(item => {
            item.addEventListener("click", this.handleDaysItems.bind(this, item))
        })

    },

    // --------------------------------------
    // ---> HANDLERS ( LOGIC OF THE EVENTS )
    // --------------------------------------
    handleMainClickDom(e) {
        this.docClickHandlers.forEach(fn => { fn(e) })
    },
    handlePageLoad() {
        this.hidePreloader()
    },
    handleAllow() {
        this.hideConfraim()
        this.hideOverlay()
    },
    handleDeny() {
        this.hideConfraim()
        this.hideOverlay()
    },
    handleMenuToggle() { this.toggleMenu() },
    handleMenuClick(e) {
        const option = e.target.closest("[data-option-select]")
        if (!option) return
        const group = option.closest(".option__group")
        this.clearGroup(group)
        this.setChecked(option)
        this.closeMenu()
    },
    handleOptionClick(e) {
        const clickedOption = e.currentTarget
        this.clearActiveState()
        this.setActive(clickedOption)
    },
    handleSuggestions() { this.toggleSuggestions() },
    handleSuggestionsItems(item) {
        this.elements.suggestItem.forEach(i => { this.clearSuggestionsItems(i) })
        this.getSearchInput(item.textContent)
        this.addSelected(item)
        this.hideSuggestion()
    },
    handleDaysBtn() { this.toggleDailySelect() },
    handleDaysItems(item) {
        this.changeBtnDayName(item.textContent)
        this.elements.DayOptions.forEach(i => {
            this.removeSelected(i)
        })
        this.addSelected(item)
        this.hideDaysOptionsList()
    },
    handleOutsideClickUnits(e) {
        if (this.elements.menu.contains(e.target)) return
        if (this.elements.toggleBtn.contains(e.target)) return
        this.closeMenu()
    },
    handleOutsideClickSuggestions(e) {
        if (this.elements.SearchInput.contains(e.target)) return
        if (this.elements.suggestionSelect.contains(e.target)) return
        this.hideSuggestion()
    },
    handleOutsideClickHourlyDays(e) {
        if (this.elements.dailySelect.contains(e.target)) return
        if (this.elements.daysBtn.contains(e.target)) return
        this.hideDaysOptionsList()
    },

    // --------------------------------------
    // ---> UI METHODS  ( ONLU DOM MANIPULATION  )
    // --------------------------------------
    toggleMenu(e) {
        e.stopPropagation()
        this.elements.menu.classList.toggle("hide")
    },
    clearGroup(group) {
        const items = group.querySelectorAll(".list-item")
        items.forEach(item => {
            item.classList.remove("checked")
        })
    },
    clearActiveState() {
        this.elements.options.forEach(option => {
            option.classList.remove("checked")
        })
    },
    hidePreloader() { this.elements.PreLoader.classList.add("hide") },
    hideOverlay() { this.elements.overlay.classList.add("hide") },
    hideConfraim() { this.elements.confraim.classList.add("hide") },
    closeMenu() { this.elements.menu.classList.add("hide") },
    setActive(element) { element.classList.add("checked") },
    setChecked(option) { option.classList.add("checked") },
    toggleSuggestions() { this.elements.suggestionSelect.classList.toggle("hide") },
    clearSuggestionsItems(el) { el.classList.remove("selected") },
    getSearchInput(value) { this.elements.SearchInput.value = value },
    addSelected(e) { e.classList.add("selected") },
    removeSelected(e) { e.classList.remove("selected") },
    hideSuggestion() { this.elements.suggestionSelect.classList.add("hide") },
    toggleDailySelect() { this.elements.dailySelect.classList.toggle("hide") },
    hideDaysOptionsList() { this.elements.dailySelect.classList.add("hide") },
    changeBtnDayName(e) { this.elements.selectDaysBtnText.textContent = e },
}
