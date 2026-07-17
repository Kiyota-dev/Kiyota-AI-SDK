import type { Cache, CacheEntry } from "./types.js";

export interface InMemoryCacheOptions {
  /** Maximum number of entries before eviction (LRU). */
  maxSize?: number;
}

export class InMemoryCache<TValue = unknown> implements Cache<TValue> {
  private readonly store = new Map<string, CacheEntry<TValue>>();
  private readonly maxSize: number;

  constructor(options: InMemoryCacheOptions = {}) {
    this.maxSize = options.maxSize ?? Number.POSITIVE_INFINITY;
  }

  async get(key: string): Promise<TValue | undefined> {
    const entry = this.store.get(key);

    if (entry === undefined) {
      return undefined;
    }

    if (entry.expiresAt != null && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  async set(key: string, value: TValue, ttlMs?: number): Promise<void> {
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      const firstKey = this.store.keys().next().value;
      if (firstKey != null) {
        this.store.delete(firstKey);
      }
    }

    this.store.set(key, {
      value,
      expiresAt: ttlMs != null ? Date.now() + ttlMs : undefined,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export function createMemoryCache<TValue = unknown>(
  options?: InMemoryCacheOptions,
): Cache<TValue> {
  return new InMemoryCache<TValue>(options);
}
