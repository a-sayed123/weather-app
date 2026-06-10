'use strict'

// // // ------------------------- \\ \\ \\
// --------- VALIDATIONS here ---------- \\
// ------------------------------------- \\

export const validator = {
    hasCoords(coords) { 
        if (!coords || typeof coords !== "object") return false
        return (Number.isFinite(coords.lat) && Number.isFinite(coords.lon) )
     },
    isReadyForRender(rawData) { return rawData?.weatherData && rawData?.placeData },
    isValidCityName(cityName) {
        if (typeof cityName !== "string") return false
        if (cityName.length < 2) return false;
        if (!/^[\p{L}\s]+$/u.test(cityName)) return false
        return true
    },
}

export default validator