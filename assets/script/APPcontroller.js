'use strict'

// // // ------------------- \\ \\ \\
// ------ EVENTS LOGIC HERE ------- \\
// --------------------------------- \\

// ------------------------------------------------------------- \\

//----------------------------------\\
//------ UI IMPORTING SECTION ------\\
//----------------------------------\\

import *  as  UI from  "./UI.js"
import * as Logic from "./Logic.js"
import * as API from "./API.js"
import {UIcontroller} from "./UIcontroller.js"

// ------------------------------------------------------------- \\

//----------------------------------\\
//------- APP MANAGE SECTION -------\\
//----------------------------------\\

const lat = 40
const lon = 40

export const APPcontroller = {
    state: {
        units: {
            temperature: "C",
            wind: "KMH",
            precipition: "MM",
        },
        selectedDay: new Date(),
        selectedCity: "",
    },
    rawData: {},
    async init(){
        this.bindEvents() 
        await this.getRawData()
        this.runAppFlow()
    },
    runAppFlow(){
        const pureData = Logic.getPureData(this.rawData.weatherData, this.state.selectedDay, this.state.units)
        const place = Logic.getPlace(this.rawData.placeData)
        const dateData = Logic.getDayData(this.state.selectedDay)
        UI.updateHourly(pureData.hourly, date)
        UI.updateDaily(pureData.daily)
        UI.updateMain(pureData.mainTag, this.state.units)
        UI.UpdateCard(pureData.cardData, place, dateData)
    },

    async getRawData(){
        try{
            this.rawData = {
                weatherData: await API.getWeather(lat, lon),
                placeData: await API.getPlaceName(lat, lon),
            }
        }catch(error){console.log(error)}
    },
    bindEvents(){
        UIcontroller.init({ onChangeUnit: this.handleChangeUnits.bind(this) })
    },
    loadingDefaultState(){},
    
    handleChangeUnits(type, newUnit){
        const oldUnit = this.state.units[type]
        if(oldUnit === newUnit)return
        this.state.units[type] = newUnit
        this.runAppFlow()
    },
    convertGroupOfUnits(oldUnit, array, newUnit){
        array.forEach(item => {
            item = Logic.unitsConverter(oldUnit, item, newUnit)
        })
    },
}

export default APPcontroller