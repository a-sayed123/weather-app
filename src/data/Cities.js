'use strict'

const Cities = {
    // object state
    state: {
        query: "",
        previousQuery: "",
        cachedResults: [],
        filteredCities: [],
        rawData: [],
        // isDublicated: false,
    },

    // main method
    async init({ query = "", refresh = false }) {
        if (refresh || this.state.rawData.length === 0) { await this.loadData(); }
        this.state.query = query
        this.updateResults()
        return this.state.filteredCities
    },

    // Data Controller
    updateResults() {
        this.state.filteredCities = this.filterCities()
    },

    async loadData() {
        console.log(import.meta.url);
        const response = await fetch("../../assets/data/cities.json")
        if (!response.ok)
            throw new Error("Failed to load cities dataset")

        this.state.rawData = await response.json()
    },

    filterCities() {
        const normalized = this.state.query.trim().toLowerCase()
        let source = this.state.rawData
        if (!normalized) {
            this.state.previousQuery = ""
            this.state.cachedResults = []
            return []
        }
        if (this.state.previousQuery && normalized.startsWith(this.state.previousQuery)) { source = this.state.cachedResults }
        const result = source.filter(cityObj => cityObj.city?.toLowerCase().startsWith(normalized))
        this.state.previousQuery = normalized
        this.state.cachedResults = result
        return result
    },

}

export default Cities