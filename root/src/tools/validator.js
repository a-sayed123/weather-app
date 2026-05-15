'use strict'

// // // ------------------------- \\ \\ \\
// --------- VALIDATIONS here ---------- \\
// ------------------------------------- \\

export const validator = {
    hasCoords(coords) { 
        console.log(coords)
        if(!Array.isArray(coords)) return false
        if(coords.length !== 2) return false
        const [lat, lon] = coords
        console.log(typeof lat)
        console.log((Number.isFinite(lat2) && Number.isFinite(lon2)))
        return (Number.isFinite(lat) && Number.isFinite(lon))
     },
    isReadyForRender(rawData) { return rawData?.weatherData && rawData?.placeData },
    isValidCityName(cityName) {
        if (typeof cityName !== "string") return false
        if (cityName.length < 2) return false
        if (!/^[\p{L}\s]+$/u.test(cityName)) return false
        return true
    },
}

export default validator