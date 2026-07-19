'use strict'

// // // ------------------------- \\ \\ \\
// --------- VALIDATIONS here ---------- \\
// ------------------------------------- \\
// ------------------
// --> This script is responsible for Validation System in My App .
// ------------------

export const validator = {
    hasCoords(coords) {
        if (!coords || typeof coords !== "object") return false
        return (Number.isFinite(coords.lat) && Number.isFinite(coords.lon))
    },
    isReadyForRender(rawData) { return Boolean(rawData?.weatherData && rawData?.placeData) },
    isValidCityName(city) {
        if (typeof city !== "string") return false
        const cityName = city.trim()
        if (cityName.length < 2) return false;
        if (!/^[\p{L}\s]+$/u.test(cityName)) return false
        return true
    },
    isValidForLocalSearch(city){
        const cityName = city.trim()
        return /^[a-z\s]+$/i.test(cityName)
    },
}

export default validator