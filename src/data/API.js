'use strict'

// // // ---------------- \\ \\ \\
// --------- API here ----------- \\
// -------------------------------- \\


//--------------------------------------\\
//---- API SECTIONS SLICING REQUEST ----\\
//--------------------------------------\\

const HOURLY = "temperature_2m,weathercode,apparent_temperature,relative_humidity_2m,precipitation,wind_direction_10m"
const DAILY = "temperature_2m_max,temperature_2m_min,weathercode"


// get Place from API
export async function getPlaceName({lat, lon}) {
    const result = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`)
    const data = await result.json()
    return data
}

// get weather from API
export async function getWeather({lat, lon}) {
    const result = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=${HOURLY}&daily=${DAILY}`)
    const data = await result.json()
    return data
}

// get the lat and lon by city name
export async function searchByCityName(cityName) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  )
  if (!response.ok) {throw new Error(`HTTP Error ${response.status}`);}
  const data = await response.json();
  if (!data.results?.length) {throw new Error("City not found")}
  const city = data.results[0];
  return {
    lat: city.latitude,
    lon: city.longitude,
  };
}