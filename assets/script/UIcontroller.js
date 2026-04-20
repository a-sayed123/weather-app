'use strict'

// // // ---------------- \\ \\ \\
// -------- EVENTS here --------- \\
// -------------------------------- \\

export const UIcontroller = {
    elements: {},
    docClickHandlers: [],

    init(){
        this.casheDom()
        this.bindEvents()
    },
    casheDom(){
        this.elements = {
            Preloader: document.querySelector("[data-preloader]"),
            confraim: document.querySelector("[data-confraim]"),
            overlay: document.querySelector("[data-overlay]"),
            unitsButton: document.querySelector("[data-select-btn-header]"),
            unitsList: document.querySelector("[data-select-header]"),
            unitsListGroubItem: document.querySelector(".custom__select .option__group"),
            unitsListItem: document.querySelector("[data-option-select]"),
        }
    },
    bindEvents(){
        // preloader
        window.addEventListener("load", this.handlePreloader.bind(this))
        // confraim
        const actions = {
            allow: () => this.handleAllow(),
            deny: () => this.handleDeny(),
        }
        this.elements.confraim.addEventListener("click", (e) => {
            const button = e.target.closest("[data-choice]")
            if(!button) return
            const choice = button?.dataset.choice
            actions[choice]?.()
        })

        // Units 
        this.elements.unitsButton.addEventListener("click", this.handleUnitsBtn.bind(this))
        


    },

    // handlers
    handlePreloader(){ this.hidePreloader()},

    handleAllow(){ 
        this.hideConfraim()
        this.hideOverlay()
        console.log("underDevelop")
    },
    handleDeny(){
        this.hideConfraim()
        this.hideOverlay()
    },
    handleUnitsBtn(){
        this.toggleUnitsBtn()
    },

    
    // events functions logic
    hidePreloader(){ this.elements.Preloader.classList.add("hide")},
    hideConfraim(){ this.elements.confraim.classList.add("hide")},
    hideOverlay(){ this.elements.overlay.classList.add("hide") },
    toggleUnitsBtn(){ this.elements.unitsList.classList.toggle("hide")},
}
