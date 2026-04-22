'use strict'

// // // ---------------- \\ \\ \\
// -------- EVENTS HERE -------- \\
// ------------------------------ \\

export const UIcontroller = {
    // --------------------
    // ---> Glopal OBJECT
    // --------------------
    elements: {},
    docHandlers: [],

    // -------------------
    // ---> INIT
    // -------------------
    init(app) {
        this.casheDom()
        this.bindEvents()
        this.app = app
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
            // confraim
            Confraim: document.querySelector("[data-confraim]"),
            // Units
            unitsBtn: document.querySelector("[data-units-btn]"),
            unitsList: document.querySelector("[data-units-list]"),
            unitsListItem: document.querySelectorAll("[data-unit]"),
            // suggestions
            searchInput: document.querySelector("[data-search-input]"),
            suggestionList: document.querySelector("[data-suggestion-select]"),
            suggestionListItem: document.querySelectorAll("[data-suggest-item]"),
            // hourly forecast
            hourlyDaysBtn: document.querySelector("[data-btn-days]"),
            hourlyDaysBtnText: document.getElementById("btn__text"),
            hourlyDaysList: document.querySelector("[data-select-daily]"),
            hourlyDaysListItem: document.querySelectorAll("[data-day-select]"),
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
        ]
        document.addEventListener("click", this.handleMainOutsideClick.bind(this))

        // preloader
        window.addEventListener("load", this.handlePreloader.bind(this))

        // confraim 
        const actions = {
            allow: () => this.handleAllow(),
            deny: () => this.handleDeny(),
        }
        this.elements.Confraim.addEventListener("click", (e) => {
            const button = e.target.closest("[data-choice]")
            if (!button) return
            const choice = button.dataset.choice
            actions[choice]?.()
        })

        // Units
        this.elements.unitsBtn.addEventListener("click", this.handleUnitsBtn.bind(this))
        this.elements.unitsListItem.forEach(item => {
            item.addEventListener("click", this.handleUnitsListItem.bind(this))
        })

        // suggestion
        this.elements.searchInput.addEventListener("click", this.handleSuggestion.bind(this))
        this.elements.suggestionListItem.forEach(suggestion => {
            suggestion.addEventListener("click", this.handleSuggestionListItem.bind(this, suggestion)
            )
        })

        // Hourl Days
        this.elements.hourlyDaysBtn.addEventListener("click", this.handleHourlyDaysBtn.bind(this))
        this.elements.hourlyDaysListItem.forEach(item => {
            item.addEventListener("click", this.handleHourlyDaysListItem.bind(this, item))
        })
    },

    // --------------------------------------
    // ---> HANDLERS ( LOGIC OF THE EVENTS )
    // --------------------------------------

    // preloader
    handlePreloader() { this.hidePreloader() },
    // confraim
    handleAllow() {
        this.hideConfraim()
        this.hideOverlay()
        console.log("underDevelop")
    },
    handleDeny() {
        this.hideConfraim()
        this.hideOverlay()
    },
    // Units 
    handleUnitsBtn() { this.toggleUnitsBtn() },
    handleUnitsListItem(e) {
        const item = e.target.closest(".list-item")
        const group = item.closest(".option__group")
        const unit = item?.dataset.unit
        const type = item?.dataset.type
        this.clearGroup(group)
        this.setCheckedOnUnitsListItem(item)
        this.hideUnitsList()
        this.app.onChangeUnit(type, unit)
    },
    // suggestions
    handleSuggestion() { this.toggleSuggestionList() },
    handleSuggestionListItem(item) {
        this.clearSuggestionList()
        this.setSelectedOnSuggestionItem(item)
        this.hideSuggestionList()
        this.getSuggestion(item)
    },
    // hourly forecast
    handleHourlyDaysBtn() { this.toggleHourlyList() },
    handleHourlyDaysListItem(item) {
        this.clearHourlyDaysList()
        this.setSelectedOnDaysListItem(item)
        this.hideHourlyDaysList()
        this.changeHourlyDaysBtnText(item)
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

    // ------------------------------------------
    // ---> UI METHODS  ( ONLU DOM MANIPULATION )
    // ------------------------------------------

    // preloader 
    hidePreloader() { this.elements.Preloader.classList.add("hide") },
    // confraim
    hideConfraim() { this.elements.Confraim.classList.add("hide") },
    // overlay
    hideOverlay() { this.elements.Overlay.classList.add("hide") },
    // Units
    toggleUnitsBtn() { this.elements.unitsList.classList.toggle("hide") },
    clearGroup(group) {
        const items = group.querySelectorAll(".list-item")
        items.forEach(item => {
            item.classList.remove("checked")
        })
    },
    setCheckedOnUnitsListItem(item) { item.classList.add("checked") },
    hideUnitsList() { this.elements.unitsList.classList.add("hide") },
    // suggestions
    toggleSuggestionList() { this.elements.suggestionList.classList.toggle("hide") },
    clearSuggestionList() { this.elements.suggestionListItem.forEach(item => { item.classList.remove("selected") }) },
    setSelectedOnSuggestionItem(item) { item.classList.add("selected") },
    hideSuggestionList() { this.elements.suggestionList.classList.add("hide") },
    getSuggestion(item) { this.elements.searchInput.value = item.textContent.trim() },
    // hourly forecast
    toggleHourlyList() { this.elements.hourlyDaysList.classList.toggle("hide") },
    clearHourlyDaysList() { this.elements.hourlyDaysListItem.forEach(item => { item.classList.remove("selected") }) },
    setSelectedOnDaysListItem(item) { item.classList.add("selected") },
    hideHourlyDaysList() { this.elements.hourlyDaysList.classList.add("hide") },
    changeHourlyDaysBtnText(item) { this.elements.hourlyDaysBtnText.textContent = item.textContent },
}