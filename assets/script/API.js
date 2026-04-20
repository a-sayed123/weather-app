'use strict'

// // // ---------------- \\ \\ \\
// --------- API here ----------- \\
// -------------------------------- \\


// import { dateThisDay } from "./script.js"

// get Place and put it in html
export async function getPlaceName(lat, long) {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&accept-language=en`)
    const data = await res.json()
    return data
}

// get weather and put it in html
export async function getweather(lat, long) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true&hourly=temperature_2m,weathercode,apparent_temperature,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,weathercode`)
    const data = await res.json()
    return data
}

// get the lat and lon from city name
export async function handleSearch(cityName) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}&limit=1&accept-language=en`)
    const result = await response.json()
    let lat = result[0].lat
    let lon = result[0].lon
    return [lat, lon]
}

