'use strict'

const Cities = {
    // object tools
    tools: {
        query: "",
        previousQuery: "",
        previousResult: [],
        pureData: [],
        RawData: [],
        isDublicated: false,
    },

    // main method
    async init({ query = "", refresh = false }) {
        if (refresh || this.tools.RawData.length === 0) { await this.loadData(); }
        this.tools.query = query
        this.CitiesDataController()
        return this.tools.pureData
    },

    // Data Controller
    CitiesDataController() {
        this.tools.pureData = this.filterCities()
    },

    async loadData() {
        const response = await fetch("../../assets/data/Cities.json")
        if (!response.ok)
            throw new Error("Failed to load cities dataset")

        this.tools.RawData = await response.json()
    },

    filterCities() {
        const normalized = this.tools.query.trim().toLowerCase()
        let source = this.tools.RawData
        if (!normalized) {
            this.tools.previousQuery = ""
            this.tools.previousResult = []
            return []
        }
        if (this.tools.previousQuery && normalized.startsWith(this.tools.previousQuery)) { source = this.tools.previousResult }
        const result = source.filter(cityObj => cityObj.city?.toLowerCase().startsWith(normalized))
        this.tools.previousQuery = normalized
        this.tools.previousResult = result
        return result
    },

}

export default Cities