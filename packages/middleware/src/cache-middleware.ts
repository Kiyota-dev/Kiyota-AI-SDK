import type { Cache } from "@kiyota/cache";
import type { LanguageModelV1GenerateResult } from "@kiyota/core";
import type { ModelMiddleware } from "./types.js";

export interface CacheMiddlewareOptions {
  cache: Cache<LanguageModelV1GenerateResult>;
  /** Time-to-live in milliseconds. */
  ttlMs?: number;
  /** Build a deterministic cache key from the request. */
  keyFn?: (request: { model: string; messages: unknown }) => string;
}

export function createCacheMiddleware(options: CacheMiddlewareOptions): ModelMiddleware {
  const { cache, ttlMs } = options;

  const keyFn =
    options.keyFn ??
    ((request) =>
      `kiyota:generate:${request.model}:${JSON.stringify(request.messages)}`);

  return async (ctx) => {
    const key = keyFn({
      model: ctx.model.modelId,
      messages: ctx.request.prompt,
    });

    const cached = await cache.get(key);
    if (cached != null) {
      return cached;
    }

    const result = await ctx.next();

    if ("text" in result) {
      await cache.set(key, result, ttlMs);
    }

    return result;
  };
}
