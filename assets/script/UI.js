'use strict'

// // // ---------------- \\ \\ \\
// ---------- UI here ----------- \\
// -------------------------------- \\


//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\
import {
  getDayName, getMonthName, getDayListNames,
  updateTextElement, updateSrcElements, orederDays,
  ICON_SRC, ICON_CODES, getIcon,
  getHourlyByDay
} from "./Logic.js"



//----------------------------------\\
//------- UI GLOPAL VARIABLES ------\\
//----------------------------------\\

export const dateThisDay = new Date()
const units = {
  celsius: document.getElementById("celsius"),
  fahrenheit: document.getElementById("fahrenheit"),
  kilometerPerHou: document.getElementById("kilometerPerHour"),
  milesPerHour: document.getElementById("milesPerHour"),
  milliMete: document.getElementById("milliMeter"),
  inch: document.getElementById("inch"),
}




//----------------------------------\\
//------ UI updating functions -----\\
//----------------------------------\\

//  this fun updates card section

// this fun updates Card
const cardElements = {
  cardLocation: document.getElementById("location"),
  cityTemp: document.getElementById("temperature"),
  cardIcon: document.getElementById("mainIcon"),
  thisDayDate: document.getElementById("date"),
}

export function UpdateCard(weatherData, placeData) {
  const date = new Date()
  cardElements.cardLocation.textContent = `${placeData.city}, ${placeData.country}`
  cardElements.cityTemp.textContent = `${weatherData.temp}°`
  cardElements.cardIcon.src = `${getIcon(weatherData.iconCode)}`
  cardElements.thisDayDate.textContent = `${getDayName(date)}, ${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`
}

// this fun updates Main section 
const mainElement = {
  windSpeed: document.getElementById("wind"),
  feelsLike: document.getElementById("feels-like-temp"),
  humiditly: document.getElementById("humidity-precent"),
  precipitation: document.getElementById("precipitation"),
}
const unitsToShow = {
  KMH: "km/h",
  MPH: "mph",
  MM: "mm",
  IN: "in",
}

export function updateMain(dataCurrentWeather, units) {
  mainElement.feelsLike.textContent = `${dataCurrentWeather.temp}°`
  mainElement.humiditly.textContent = `${dataCurrentWeather.humidity}%`
  mainElement.windSpeed.textContent = `${dataCurrentWeather.wind} ${unitsToShow[units.wind]}`
  mainElement.precipitation.textContent = `${dataCurrentWeather.prec} ${unitsToShow[units.precipition]}`
}

// this fun updates Daily section
const dailyElements = {
  highDegree: document.querySelectorAll("[data-day-highDegree]"),
  lowDegree: document.querySelectorAll("[data-day-LowDegree]"),
  dayTitle: document.querySelectorAll("[data-day-title]"),
  icons: document.querySelectorAll("[data-day-icon]"),
}
orederDays(dailyElements.dayTitle, "short")
export function updateDaily(dailyData) {
  dailyElements.lowDegree.forEach((degree, index) => { degree.textContent = dailyData[index].highTemp })
  dailyElements.highDegree.forEach((degree, index) => { degree.textContent = dailyData[index].lowTemp })
  dailyElements.icons.forEach((icon, index) => { icon.src = getIcon(dailyData[index].iconCode) })
}

// this fun updates Hourly section 
const hourElements = {
  hourDegree: document.querySelectorAll("[data-hour-degree]"),
  hourIcon: document.querySelectorAll("[data-hour-icon]"),
  selectTagDays: document.querySelectorAll("[data-day-select]"),
  btnText: document.getElementById("btn__text")
}

// select btn days oredering
hourElements.btnText.textContent = getDayName(dateThisDay)
orederDays(hourElements.selectTagDays)
export function updateHourly(dataHourly) {
  // show in UI
  hourElements.hourDegree.forEach((degree, index) => { degree.textContent = dataHourly[index].temp })
  hourElements.hourIcon.forEach((icon, index) => { icon.src = getIcon(dataHourly[index].icon) })
}

// this fun updates UI completely section 
export function updateUi(weatherData, placeData, date, units) {
  updateHourly(weatherData.hourly, date)
  updateDaily(weatherData.daily)
  updateMain(weatherData.mainTag, units)
  UpdateCard(weatherData.cardData, placeData)
}

//----------------------------------\\
//-------UI STATES functions -------\\
//----------------------------------\\

const states = { initial, loading, success, error, noResult }

const stateElements = {
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
  mainList: document.querySelectorAll(".main .list-item .item__content"),
  // hourly
  hourlyList: document.querySelector(".hourly-list"),
  hourlyItems: document.querySelectorAll(".hourly-list .list-item"),
  daysList: document.querySelector("[data-select-daily]"),
  dayBtn: document.querySelector("[data-btn-days]"),
  dayBtnText: document.querySelector("#btn__text"),
  hourlyListItems: document.querySelector(".hourly-list .list-items"),
  // no result
  noResult: document.querySelector(".no-result"),
  noResultText: document.querySelector(".no-result .title"),
  // card
  loadingCard: document.querySelector(".loading-card"),
  card: document.querySelector(".card"),
  // daily
  dailyItems: document.querySelectorAll(".daily-forecast .list__item"),
  // footer
  footer: document.querySelector(".footer")
}

const baseVisibleElements = [
  stateElements.headerTitle,
  stateElements.headerSearchContainer,
  stateElements.main,
  stateElements.hourlyList,
  stateElements.footer,
]
const baseHiddenElements = [
  stateElements.apiError,
  stateElements.noResult,
  stateElements.loadingCard,
]
const loadingElements = [
  stateElements.unitsBtn,
  stateElements.searchBtn,
  stateElements.headerSearchInput,
  ...stateElements.mainList,
  stateElements.card,
  ...stateElements.dailyItems,
  ...stateElements.hourlyItems,
  stateElements.dayBtnText,
  stateElements.dayBtn,
  stateElements.hourlyListItems,
  stateElements.hourlyList,
]

function resetStates() {
  baseVisibleElements.forEach(item => { item.classList.remove("hide") })
  baseHiddenElements.forEach(item => { item.classList.add("hide") })
  loadingElements.forEach(item => { item.classList.remove("loading") })
}

// --> error state fuction
function errorHeader() {
  stateElements.headerTitle.classList.add("hide")
  stateElements.headerSearchContainer.classList.add("hide")
  stateElements.unitsBtn.classList.add("Error")
}

function errorMainHourlyFooter() {
  stateElements.main.classList.add("hide")
  stateElements.hourlyList.classList.add("hide")
  stateElements.footer.classList.add("hide")
}

function showErrorElement() { stateElements.apiError.classList.remove("hide") }

function error() {
  errorHeader()
  errorMainHourlyFooter()
  showErrorElement()
}

// ---> no result state function
function noResult() {
  stateElements.main.classList.add("hide")
  stateElements.hourlyList.classList.add("hide")
  stateElements.unitsBtn.classList.add("loading")
  stateElements.footer.classList.add("loading")
  stateElements.noResult.classList.remove("hide")
}

// ---> Loading state functions
// header
function getLoadingHeader() {
  stateElements.searchBtn.classList.add("loading")
  stateElements.unitsBtn.classList.add("loading")
  stateElements.headerSearchInput.classList.add("loading")
}
// main
function getMainLoading() {
  stateElements.mainList.forEach(item => { item.classList.add("loading") })
  stateElements.card.classList.add("loading")
  stateElements.loadingCard.classList.remove("hide")
}
// daily
function getDailyLoading() {
  stateElements.dailyItems.forEach(item => { item.classList.add("loading") })
}
// hourly
function getHourlyLoading() {
  stateElements.hourlyItems.forEach(item => { item.classList.add("loading") })
  stateElements.dayBtnText.classList.add("loading")
  stateElements.dayBtn.classList.add("loading")
  stateElements.hourlyListItems.classList.add("loading")
  stateElements.hourlyList.classList.add("loading")
}
function loading() {
  getHourlyLoading()
  getDailyLoading()
  getMainLoading()
  getLoadingHeader()
}
function success() { stateElements.noResult.textContent = "🚫 No search result found!"}
function initial() {}
export function notValidCityName() { noResult(); stateElements.noResultText.textContent = "🚫 This is not a valid city name !" }
export function renderState(state) { resetStates(); states[state]() }