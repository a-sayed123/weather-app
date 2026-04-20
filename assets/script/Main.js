'use strict'

  // // // ---------------- \\ \\ \\
 // --------- MAIN here ---------- \\
// -------------------------------- \\

// ------------------------------------------------------------- \\

//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\
import { getPlaceName, getweather } from "./API.js"
import { updateUi } from "./UI.js"
import {  getPureData, getPlace} from "./Logic.js"
import {UIcontroller} from "./UIcontroller.js"


const lat = 40
const long = 	40

UIcontroller.init()

const date = new Date()
const placeData = await getPlaceName(lat, long)
const data = await getweather(lat, long)
console.log(data)
console.log(placeData)
const puredata = getPureData(data, date)
const place = getPlace(placeData)

console.log(puredata)
updateUi(puredata, place, date)

