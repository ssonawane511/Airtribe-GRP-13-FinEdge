let instance = null;

class Cache {
    constructor() {
        this.cache = new Map();
    }

    static getInstance() {
        if (!instance) {
            instance = new Cache();
        }
        return instance;
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value, ttlMs) {
        this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
        setTimeout(() => {
            this.cache.delete(key);
        }, ttlMs);
    }

    invalidate(key) {
        this.cache.delete(key);
    }
}

export default Cache.getInstance();