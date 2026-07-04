'use strict'

import { getDayName, toggleAria } from "../logic/Logic.js"

// // // ---------------- \\ \\ \\
// -------- EVENTS HERE -------- \\
// ------------------------------ \\

// --------------
// --> This script is responsible every event on this app 
//     every eventListener is only here .
// --------------


export const UIcontroller = {
    // --------------------
    // ---> Glopal OBJECT
    // --------------------
    elements: {},
    docHandlers: [],
    dropdownElements: [],

    // -------------------
    // ---> INIT
    // -------------------
    init(app) {
        this.app = app
        this.casheDom()
        this.bindEvents()
    },

    // -------------------
    // ---> Dom cahe
    // -------------------
    casheDom() {
        this.elements = {
            // preloader
            Preloader: document.querySelector("[data-preloader]"),
            // overlay
            Overlay: document.querySelector("[data-overlay]"),
            // confirm
            Confirm: document.querySelector("[data-confirm]"),
            // Units
            unitsBtn: document.querySelector("[data-units-btn]"),
            unitsList: document.querySelector("[data-units-list]"),
            unitsListItem: document.querySelectorAll('.list-item input[type="radio"]'),
            // suggestions 
            suggestionList: document.querySelector("[data-suggestion-select]"),
            suggestionListItems: document.querySelectorAll("[data-suggest-item]"),
            // form
            searchBtn: document.getElementById("search-btn"),
            searchInput: document.querySelector("[data-search-input]"),
            form: document.getElementById("search_form"),
            // hourly forecast
            hourlyDaysBtn: document.querySelector("[data-btn-days]"),
            hourlyDaysBtnText: document.getElementById("btn__text"),
            hourlyDaysList: document.querySelector("[data-select-daily]"),
            hourlyDaysListGroup: document.querySelector(".select__options .day__options"),
            hourlyDaysListItem: document.querySelectorAll(".day__option"),
            // Error
            error: document.querySelector(".error"),
            errorBtn: document.querySelector(".error__btn"),
        }
    },

    // --------------------
    // ---> Events System
    // -------------------
    bindEvents() {
        // Dom Events
        this.docHandlers = [
            this.handleOutsideClickUnits.bind(this),
            this.handleOutsideClickSuggestion.bind(this),
            this.handleOutsideClickHourly.bind(this),
        ],

        this.dropdownElements = [
            { list: this.elements.unitsList, btn: this.elements.unitsBtn},
            { list: this.elements.hourlyDaysList, btn: this.elements.hourlyDaysBtn},
            { list: this.elements.suggestionList, btn: this.elements.searchInput},
        ]
        // glopal events

        // esc even
        this.dropdownElements.forEach(el => {
            el.list.addEventListener("keydown", this.handleEsc.bind(this, el))
        })

        // hide dropdowns in click outside it
        document.addEventListener("click", this.handleMainOutsideClick.bind(this))

        // intial state
        window.addEventListener("load", async () => { await this.handleInitialState() })

        // confirm
        const actions = {
            allow: () => this.handleAllow(),
            deny: () => this.handleDeny(),
        }
        this.elements.Confirm.addEventListener("click", (e) => {
            const button = e.target.closest("[data-choice]")
            if (!button) return
            const choice = button.dataset.choice
            actions[choice]?.()
        })

        // Units
        this.elements.unitsBtn.addEventListener("click", this.handleUnitsBtn.bind(this))
        this.elements.unitsList.addEventListener("focusout", this.hsndleFocusOut.bind(this))
        this.elements.unitsListItem.forEach(input => {
            input.addEventListener("change", this.handleUnitsListItem.bind(this))
        })

        // suggestion
        this.elements.searchInput.addEventListener("click", this.handleSuggestion.bind(this))
        this.elements.suggestionListItems.forEach(suggestion => {
            suggestion.addEventListener("click", this.handleSuggestionListItem.bind(this, suggestion)
            )
        })
        this.elements.form.addEventListener("submit", this.handleForm.bind(this))
        this.elements.searchBtn.addEventListener("click", this.handleSearchBtn.bind(this))
        // Hourl Days
        this.elements.hourlyDaysBtn.addEventListener("click", this.handleHourlyDaysBtn.bind(this))
        this.elements.hourlyDaysListGroup.addEventListener("click", (e) => {
            const item = e.target.closest("[data-day]")
            if (!item) return
            const items = document.querySelectorAll("[data-day]")
            this.handleHourlyDaysListItem(item, items)
        })

        // Error 
        this.elements.errorBtn.addEventListener("click", async (e) => { await this.handleRetryBtn(e) })
    },

    // --------------------------------------
    // ---> HANDLERS ( LOGIC OF THE EVENTS )
    // --------------------------------------

    // Inital state
    async handleInitialState() {
        try {
            const isReady = await this.app.initializeApp()
            if (!isReady) { this.hidePreloader(); return; }
            this.showOverlay()
            this.showConfirm()
            this.hidePreloader()
            this.elements.hourlyDaysBtnText.textContent = getDayName(new Date())
        } catch (error) { this.hidePreloader(); console.log("handlePreloader error...", error) }
    },
    // confirm
    handleAllow() {
        this.hideConfirm()
        this.hideOverlay()
        this.app.onLocationAllow()
        console.log("allow clicked")
    },
    handleDeny() {
        this.hideConfirm()
        this.hideOverlay()
    },
    // Units
    handleUnitsBtn() { this.toggleUnitsBtn() },
    hsndleFocusOut(e) {
        const next = e.relatedTarget

        if (!this.elements.unitsList.contains(next))
            this.hideUnitsList()
    },
    handleUnitsListItem(e) {
        const input = e.target
        if (!input instanceof HTMLInputElement) return
        const unit = input.value
        const type = input.name
        this.app.onChangeUnit(type, unit)
    },
    // suggestions
    handleSuggestion() { this.toggleSuggestionList() },
    handleSuggestionListItem(item) {
        this.hideSuggestionList()
        this.getSuggestion(item)
        const items = this.elements.suggestionListItems
        this.app.onSelectSuggestion(item, items)
    },
    // form
    handleForm(e) {
        e.preventDefault()
        this.handleSearchBtn()
    },
    handleSearchBtn() {
        const cityName = this.elements.searchInput.value
        this.elements.searchInput.value = ""
        this.app.onSearchBtnClick(cityName)
    },
    // hourly forecast
    handleHourlyDaysBtn() { this.toggleHourlyList() },
    handleHourlyDaysListItem(item, items) {
        this.clearHourlyDaysList(items)
        this.ChangeDayBtnText(item)
        this.hideHourlyDaysList()
        this.app.onChangeDay(item)
    },
    // Dom events
    handleMainOutsideClick(e) { this.docHandlers.forEach(fn => { fn(e) }) },
    handleOutsideClickUnits(e) {
        if (this.elements.unitsBtn.contains(e.target)) return
        if (this.elements.unitsList.contains(e.target)) return
        this.hideUnitsList()
    },
    handleOutsideClickSuggestion(e) {
        if (this.elements.searchInput.contains(e.target)) return
        if (this.elements.suggestionList.contains(e.target)) return
        this.hideSuggestionList()
    },
    handleOutsideClickHourly(e) {
        if (this.elements.hourlyDaysBtn.contains(e.target)) return
        if (this.elements.hourlyDaysList.contains(e.target)) return
        this.hideHourlyDaysList()
    },

    // error handler
    async handleRetryBtn(e) {
        this.elements.errorBtn.setAttribute("aria-pressed", "true")
        this.handleInitialState()
    },

    // esc handler
    handleEsc(el, e){
        if (e.key !== "Escape") return
        this.hideUnitsList()
        this.hideSuggestionList()
        this.hideHourlyDaysList()
        el.btn.focus()
    },

    // ------------------------------------------
    // ---> UI METHODS  ( ONLy DOM MANIPULATION )
    // ------------------------------------------

    // preloader
    hidePreloader() { this.elements.Preloader.classList.add("hide") },
    // confirm
    showConfirm() { this.elements.Confirm.classList.remove("hide") },
    hideConfirm() { this.elements.Confirm.classList.add("hide") },
    // overlay
    showOverlay() { this.elements.Overlay.classList.remove("hide") },
    hideOverlay() { this.elements.Overlay.classList.add("hide") },
    // Units
    toggleUnitsBtn() {
        const element = this.elements.unitsBtn
        toggleAria(element, "aria-expanded")
        const isActivated = element.getAttribute("aria-expanded")
        if (!isActivated) this.elements.unitsList.setAttribute("inert","")
        this.elements.unitsList.removeAttribute("inert")
    },
    clearGroup(group) {
        const items = group.querySelectorAll(".list-item")
        items.forEach(item => {
            item.setAttribute("aria-selected", "false")
        })
    },
    hideUnitsList() {
        this.elements.unitsBtn.setAttribute("aria-expanded", "false")
        setTimeout(() => { this.elements.unitsList.setAttribute("inert", "") }, 300);
    },
    // suggestions
    toggleSuggestionList() {
        const el = this.elements.suggestionList
        const isActive = toggleAria(el, "aria-expanded")
        if (isActive) {this.elements.suggestionList.removeAttribute("inert", ""); return;}
        this.elements.suggestionList.setAttribute("inert", "")
        console.log(isActive)
    },
    hideSuggestionList() { this.elements.suggestionList.setAttribute("aria-expanded", "false") },
    getSuggestion(item) { this.elements.searchInput.value = item.textContent.trim() },
    // hourly forecast
    toggleHourlyList() { this.elements.hourlyDaysList.classList.toggle("hide") },
    clearHourlyDaysList(items) {
        items.forEach(item => {
            item.classList.remove("selected")
        })
    },
    hideHourlyDaysList() { this.elements.hourlyDaysList.setAttribute("aria-expanded", "false") },
    ChangeDayBtnText(item) {
        this.elements.hourlyDaysBtnText.textContent = item.textContent
    },
}