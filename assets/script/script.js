'use strict'

// ------------------
// ---> Variables 
// ------------------

// ---> overlay

const overlay = document.querySelector("[data-overlay]")

// ---> preloader

const PreLoader = document.querySelector("[data-preloader]")

// ---> confraim

const confraim = document.querySelector("[data-confraim]")
const confraimChoice = document.querySelectorAll("[data-confraim-choice]")
let userChoice = false

// ---> header select ( Units )

const selectHeader = document.querySelector("[data-select-header]")
const selectBtn = document.querySelector("[data-select-btn-header]")
const TempSelect = document.querySelectorAll("[data-temp-select]")
const windSelect = document.querySelectorAll("[data-wind-select]")
const precSelect = document.querySelectorAll("[data-prec-select]")

// ---> suggestions Select

const suggestionSelect = document.querySelector("[data-suggestion-select]")
const suggestItem = document.querySelectorAll("[data-suggest-item]")
const SearchInput = document.querySelector("[data-search-input]")

// ---> daily forecast select

const dailySelect = document.querySelector("[data-select-daily]")
const DayOptions = document.querySelectorAll("[data-day-select]")
const daysBtn = document.querySelector("[data-btn-days]")
const selectDaysBtnText = document.getElementById("btn__text")

// ------------------
// ---> Events 
// ------------------


// ---> preloader

window.addEventListener("load", () => {
    PreLoader.classList.add("hide")
})

// ---> confraim

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

// ---> header select ( Units )

selectBtn.addEventListener("click", () => {
    selectHeader.classList.toggle("hide")
})

document.addEventListener("click", (e) => {
    if(!selectBtn.contains(e.target)){
        selectHeader.classList.add("hide")
    }
})

selectHeader.querySelectorAll("[data-temp-select]").forEach(li => {
    li.addEventListener('click', () => {
        selectHeader.querySelectorAll("[data-temp-select]").forEach(item => item.classList.remove("checked"))
        li.classList.add("checked")
        selectHeader.classList.add("hide")
    })
})

selectHeader.querySelectorAll("[data-wind-select]").forEach(li => {
    li.addEventListener('click', () => {
        selectHeader.querySelectorAll("[data-wind-select]").forEach(item => item.classList.remove("checked"))
        li.classList.add("checked")
        selectHeader.classList.add("hide")
    })
})

selectHeader.querySelectorAll("[data-prec-select]").forEach(li => {
    li.addEventListener('click', () => {
        selectHeader.querySelectorAll("[data-prec-select]").forEach(item => item.classList.remove("checked"))
        li.classList.add("checked")
        selectHeader.classList.add("hide")
    })
})

// ---> suggestions Select

SearchInput.addEventListener("click", () => {
    suggestItem.forEach(item => {
        item.addEventListener("click", () => {
            suggestItem.forEach(i => {
                i.classList.remove("selected")
            })
            SearchInput.value = item.textContent
            item.classList.add("selected")
            suggestionSelect.classList.add("hide")
        })
    })
    suggestionSelect.classList.toggle("hide")
})

document.addEventListener("click", (e) => {
    if(!SearchInput.contains(e.target)){
        suggestionSelect.classList.add("hide")
    }
})

// ---> daily forecast select

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

document.addEventListener("click", (e) => {
    if(!daysBtn.contains(e.target)){
        dailySelect.classList.add("hide")
    }
})

// ---------------------
// ---> APIs & Functions
// ---------------------

