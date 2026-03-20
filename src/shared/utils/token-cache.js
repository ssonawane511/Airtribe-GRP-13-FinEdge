class InvalidatedTokenCache {
  constructor() {
    this.cache = new Map();
  }

  has(token) {
    const entry = this.cache.get(token);
    if (!entry) {
      return false;
    }

    if (entry.expiresAt <= Date.now()) {
      clearTimeout(entry.timeout);
      this.cache.delete(token);
      return false;
    }

    return true;
  }

  invalidate(token, ttlMs) {
    if (!token || !ttlMs || ttlMs <= 0) {
      return false;
    }

    const existingEntry = this.cache.get(token);
    if (existingEntry) {
      clearTimeout(existingEntry.timeout);
    }

    const timeout = setTimeout(() => {
      this.cache.delete(token);
    }, ttlMs);
    timeout.unref?.();

    this.cache.set(token, {
      expiresAt: Date.now() + ttlMs,
      timeout,
    });

    return true;
  }

  clear() {
    for (const entry of this.cache.values()) {
      clearTimeout(entry.timeout);
    }
    this.cache.clear();
  }
}

const invalidatedTokenCache = new InvalidatedTokenCache();

export default invalidatedTokenCache;
