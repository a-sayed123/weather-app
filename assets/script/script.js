'use strict'

// variables
const overlay = document.querySelector("[data-overlay]")
const confraim = document.querySelector("[data-confraim]")
const PreLoader = document.querySelector("[data-preloader]")
const confraimChoice = document.querySelectorAll("[data-confraim-choice]")
const selectHeader= document.querySelector("[data-select-header]")
const selectBtn = document.querySelector("[data-select-btn-header]")
const TempSelect = document.querySelectorAll("[data-temp-select]")
const windSelect = document.querySelectorAll("[data-wind-select]")
const precSelect = document.querySelectorAll("[data-prec-select]")
const dailySelect = document.querySelector("[data-select-daily]")
const DayOptions = document.querySelectorAll("[data-day-select]")
const daysBtn = document.querySelector("[data-btn-days]")
const selectDaysBtnText = document.getElementById("btn__text")
let userChoice = false

// events

window.addEventListener("load", () => {
    PreLoader.classList.add("hide")
 })

confraimChoice[0].addEventListener("click", () => {
    userChoice = true
    confraim.classList.add("hide")
    overlay.classList.add("hide")
    PreLoader.classList.remove("hide")
})

confraimChoice[1].addEventListener("click", () => {
    userChoice = false
    confraim.classList.add("hide")
    overlay.classList.add("hide")
})

selectBtn.addEventListener("click", () => {
    selectHeader.classList.toggle("hide")
})

selectHeader.querySelectorAll("[data-temp-select]").forEach(li => {
li.addEventListener('click', () => {
    selectHeader.querySelectorAll("[data-temp-select]").forEach( item => item.classList.remove("checked"))
    li.classList.add("checked")
    selectHeader.classList.add("hide")    
})
})

selectHeader.querySelectorAll("[data-wind-select]").forEach(li => {
li.addEventListener('click', () => {
    selectHeader.querySelectorAll("[data-wind-select]").forEach( item => item.classList.remove("checked"))
    li.classList.add("checked")
    selectHeader.classList.add("hide")
})
})

selectHeader.querySelectorAll("[data-prec-select]").forEach(li => {
li.addEventListener('click', () => {
    selectHeader.querySelectorAll("[data-prec-select]").forEach( item => item.classList.remove("checked"))
    li.classList.add("checked")
    selectHeader.classList.add("hide")
})
})

daysBtn.addEventListener("click", () => {
    dailySelect.classList.toggle("hide")
})

DayOptions.forEach(item => {
    item.addEventListener("click", () => {
        selectDaysBtnText.textContent = item.textContent
        dailySelect.classList.add("hide")
        DayOptions.forEach(i => {
            i.classList.remove("selected")
        })
        item.classList.add("selected")
    })
})

// APIs & Functions




