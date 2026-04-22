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
  ICON_SRC,ICON_CODES,
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
//-------UI STATES functions ------\\
//----------------------------------\\

function dataError() {
  const headerTitle = document.querySelector(".header__title").classList.add("hide")
  const headerSearchContainer = document.querySelector(".header__search").classList.add("hide")
  const apiError = document.querySelector(".error-api").classList.remove("hide")
  const main = document.querySelector(".main").classList.add("hide")
  const hourlyList = document.querySelector(".hourly-list").classList.add("hide")
  const footer = document.querySelector(".footer").classList.add("hide")
}

function noResult() {
  const main = document.querySelector(".main").classList.add("hide")
  const hourlyList = document.querySelector(".hourly-list").classList.add("hide")
  const footer = document.querySelector(".footer").classList.add("hide")
  const noResultText = document.querySelector(".no-result").classList.remove("hide")
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

export function UpdateCard(weatherData, placeData, dateData) {
  const date = new Date()
  cardElements.cardLocation.textContent = `${placeData.city}, ${placeData.country}`
  cardElements.cityTemp.textContent = `${weatherData.temp}°`
  cardElements.cardIcon.src = `${ICON_SRC[ICON_CODES[weatherData.iconCode]]}`
  cardElements.thisDayDate.textContent = `${dateData.day}, ${dateData.month} ${dateData.date}, ${dateData.year}`
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
  dailyElements.icons.forEach((icon, index) => { icon.textContent = dailyData[index].iconCode })
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
  hourElements.hourIcon.forEach((icon, index) => { icon.textContent = dataHourly[index].icon })
}

// this fun updates UI completely section 
export function updateUi(weatherData, placeData, date, units) {
  updateHourly(weatherData.hourly, date)
  updateDaily(weatherData.daily)
  updateMain(weatherData.mainTag, units)
  UpdateCard(weatherData.cardData, placeData, dateData)
}