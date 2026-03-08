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
        const entry = this.cache.get(key);
        if (entry) {
            if (entry.expiresAt < Date.now()) {
                this.invalidate(key);
                return null;
            }
            return entry.value;
        }
        return null;
    }

    set(key, value, ttlMs) {
        const timeout = setTimeout(() => {
            this.cache.delete(key);
        }, ttlMs);
        this.cache.set(key, { value, timeout, expiresAt: Date.now() + ttlMs });
    }

    invalidate(key) {
        const entry = this.cache.get(key);
        if (entry) {
            clearTimeout(entry.timeout);
        }
        this.cache.delete(key);
    }
}

export default Cache.getInstance();