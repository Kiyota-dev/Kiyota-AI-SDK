export interface Cache<TValue = unknown> {
  /** Get a value by key. Returns undefined when missing or expired. */
  get(key: string): Promise<TValue | undefined>;
  /** Store a value with an optional time-to-live in milliseconds. */
  set(key: string, value: TValue, ttlMs?: number): Promise<void>;
  /** Remove a single key. */
  delete(key: string): Promise<void>;
  /** Clear all cached values. */
  clear(): Promise<void>;
}

export interface CacheEntry<TValue> {
  value: TValue;
  expiresAt?: number;
}
