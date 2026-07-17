import type { Cache } from "./types.js";

export interface RedisClientLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number; PX?: number }): Promise<string | null>;
  del(key: string): Promise<number>;
  flushAll?(): Promise<string>;
}

export interface RedisCacheOptions {
  client: RedisClientLike;
  /** Default TTL in milliseconds. */
  defaultTtlMs?: number;
  /** Optional key prefix. */
  keyPrefix?: string;
}

export class RedisCache<TValue = unknown> implements Cache<TValue> {
  private readonly client: RedisClientLike;
  private readonly defaultTtlMs?: number;
  private readonly keyPrefix: string;

  constructor(options: RedisCacheOptions) {
    this.client = options.client;
    this.defaultTtlMs = options.defaultTtlMs;
    this.keyPrefix = options.keyPrefix ?? "kiyota:cache:";
  }

  private resolveKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async get(key: string): Promise<TValue | undefined> {
    const raw = await this.client.get(this.resolveKey(key));

    if (raw == null) {
      return undefined;
    }

    try {
      return JSON.parse(raw) as TValue;
    } catch {
      return raw as TValue;
    }
  }

  async set(key: string, value: TValue, ttlMs?: number): Promise<void> {
    const ttl = ttlMs ?? this.defaultTtlMs;
    const serialized = JSON.stringify(value);

    if (ttl != null) {
      await this.client.set(this.resolveKey(key), serialized, { PX: ttl });
    } else {
      await this.client.set(this.resolveKey(key), serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(this.resolveKey(key));
  }

  async clear(): Promise<void> {
    if (this.client.flushAll) {
      await this.client.flushAll();
    } else {
      throw new Error("Redis client does not support flushAll.");
    }
  }
}

export function createRedisCache<TValue = unknown>(
  options: RedisCacheOptions,
): Cache<TValue> {
  return new RedisCache<TValue>(options);
}
