'use strict'

class Cache {
    #cache = new Map()
    #ttl
    #maxSize

    constructor(maxSize, ttl) {
        this.#maxSize = maxSize
        // ttl ---> the specified age of the city in cache
        this.#ttl = ttl
    }

    get(key) {
        if (!this.#cache.has(key)) return null
        const currentTime = Date.now()
        const entry = this.#cache.get(key)
        if (this.#isExpired(entry, currentTime)) {
            this.#cache.delete(key)
            return null
        }
        this.#cache.delete(key)
        this.#cache.set(key, entry)
        return entry.data
    }
    set(key, value) {
        if (value === undefined || value === null) return false
        const currentTime = Date.now()
        const cityObj = {
            data: structuredClone(value),
            expiredAt: currentTime + this.#ttl,
        }
        if (this.#cache.has(key)) {
            this.#cache.delete(key)
            // Refresh LRU position
            this.#cache.set(key, cityObj)
            return true
        }
        if (this.#cache.size === this.#maxSize) {this.#evictLRU()}
        this.#cache.set(key, cityObj)
        return true
    }
    clear() {
        this.#cache.clear()
    }
    #isExpired(entry, currentTime) {
        return (currentTime >= entry.expiredAt)
    }
    #evictLRU() {
        this.#cache.delete(this.#cache.keys().next().value)
    }
}

export default Cache