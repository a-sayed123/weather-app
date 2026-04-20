'use strict'

// // // ---------------- \\ \\ \\
// ------- UTILITIES here ------- \\
// -------------------------------- \\

export const ICON_SRC = {
  sunny: "./assets/images/icon-sunny.webp",
  fog: "./assets/images/icon-fog.webp",
  drizzle: "./assets/images/icon-drizzle.webp",
  rain: "./assets/images/icon-rain.webp",
  snow: "./assets/images/icon-snow.webp",
  storm: "./assets/images/icon-storm.webp",
  overcast: "./assets/images/icon-overcast.webp",
  "partly-cloudy": "./assets/images/icon-partly-cloudy.webp",
}
export const ICON_CODES = {
  0: "sunny",
  1: "sunny",
  2: "partly-cloudy",
  3: "overcast",
  45: "fog",
  48: "fog",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
}

const WEATHER_RANGES = [
  {min: 0, max: 1, type: "sunny"},
  {min: 2, max: 2, type: "partly-cloudy"},
  {min: 3, max: 3, type: "overcast"},
  {min: 45, max: 48, type: "fog"},
  {min: 51, max: 57, type: "drizzle"},
  {min: 61, max: 67, type: "rain"},
  {min: 71, max: 77, type: "snow"},
  {min: 80, max: 82, type: "rain"},
  {min: 85, max: 86, type: "snow"},
  {min: 95, max: 99, type: "storm"},
]


export function getKeyByValue(object, value) {
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      if (object[key] === value) return key;
    }
  }
  return null;
}

// Units converting function
const conversions = {
  C:    { F:   (c) =>   Math.round((c * 9/5) + 32)  },
  F:    { C:   (f) =>   Math.round((f - 32) * 5/9)  },
  KMH:  { MPH: (kmh) => Math.round(kmh * 0.621371)  },
  MPH:  { KMH: (mph) => Math.round(mph / 0.621371)  },
  MM:   { IN:  (mm) =>  Math.round(mm / 25.4)       },
  IN:   { MM:  (In) =>  Math.round(In * 25.4)       },
}

export function unitsConverter(from, value, to) {
  if (from === to)return
  return conversions[from]?.[to]?.(value)
}

// function sorting days as this day
export function sortDays(daysList) {
  return daysList.sort((a, b) => {
    return new Date(a) - Date(b)
  })
}

export function getDayName(date, type = "long") {
  const Day = date.toLocaleDateString("en-US", { weekday: type })
  return Day
}

export function getMonthName(date, type = "long") {
  const Month = date.toLocaleDateString("en-US", { month: type });
  return Month
}

export function getDayListNames(datesList, type = "long") {
  const namesList = []
  const baseDate = new Date()
  const days = sortDays(datesList)
  days.forEach((day, index) => {
    const newDate = new Date(baseDate)
    newDate.setDate(baseDate.getDate() + index)
    namesList.push(getDayName(newDate, type))
  })
  return namesList
}

const cashe = {}
export function getWeatherType(code){
  if(cashe[code]) return cashe[code]
  const range = WEATHER_RANGES.find(r => code >= r.min && code <= r.max)
  const type = range ? range.type : "unknown"
  cashe[code] = type
  return type
}

export function oldGetIcon(code){
  return ICON_SRC[ICON_CODES[code]]
}

export function newGetIcon(code){
  const type = getWeatherType(code)
  return ICON_SRC[type]
}

export function updateTextElement(elements, dataArray, unit = "") {
  elements.forEach((el, index) => {
    if (!dataArray[index]) return
    el.textContent = `${dataArray[index]} ${unit}`
  })
}

export function updateSrcElements(iconElements, weatherCodes) {
  iconElements.forEach((icon, index) => {
    const code = weatherCodes?.[index]
    if (code === undefined) return
    icon.src = newGetIcon(code)
  })
}

export function findCurrentHourIndex(date, hoursArray) {
  const currentTime = date.toISOString().slice(0, 13)
  const hourIndex = hoursArray.findIndex(t => t.startsWith(currentTime))
  return hourIndex
}

export function orederDays(daysListElements, type = "long") {
  const baseDate = new Date()
  daysListElements.forEach((day, index) => {
    const newDate = new Date(baseDate)
    newDate.setDate(baseDate.getDate() + index)
    day.textContent = getDayName(newDate, type)
    day.dataset.date = newDate.toISOString().slice(0, 10)
  })
}

// get data app

// hourly
export function getHourlyByDay(data, selectedDay) {
  const selectedDayString = selectedDay.toISOString().slice(0, 10)
  const times = []
  const temps = []
  const icons = []

  data.hourly.time.forEach((time, index) => {
    if (time.startsWith(selectedDayString)) {
      times.push(time.slice(0, 13))
      temps.push(data.hourly.temperature_2m?.[index])
      icons.push(data.hourly.weathercode?.[index])
    }
  })
  return { times, temps, icons }
}
// current
export function getCurrentWeather(data){
  const temp = Math.round(data.current_weather.temperature)
  const iconCode = data.current_weather.weathercode
  return {temp, iconCode}
}
// main
export function getMainTagData(data){
  const hours = data.hourly.time
  const date = new Date()
  const index = findCurrentHourIndex(date, hours)
  const wind = Math.round(data.current_weather.windspeed)
  const temp = Math.round(data.hourly.apparent_temperature[index])
  const prec = data.hourly.precipitation[index]
  const humidit = data.hourly.relative_humidity_2m[index]
  return {temp, prec, humidit, wind}
}
// daily
export function getDailyForecast(data){
  const highTemp = []
  const lowTemp = []
  const iconCode = []
  const days = []
  data.daily.time.forEach((day, index) => {
    highTemp.push(data.daily.temperature_2m_max[index])
    lowTemp.push(data.daily.temperature_2m_min[index])
    iconCode.push(data.daily.weathercode[index])
    days.push(data.daily.time[index])
  })
  return {highTemp, lowTemp, iconCode, days}
}
// place 
export function getPlace(data){
  const place = {
    city: data.address.city || data.address.town || data.address.village || data.address.state,
    country: data.address.country,
  }
  return place
}
// all pure data to view 

export function getPureData(data, date){
  const pureData = {
    Hourly: getHourlyByDay(data, date),
    Daily: getDailyForecast(data),
    MainTag: getMainTagData(data),
    cardData: getCurrentWeather(data),
  }
  return pureData
}
