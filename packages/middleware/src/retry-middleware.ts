import { ProviderError } from "@kiyota/core";
import type { ModelMiddleware } from "./types.js";

export interface RetryMiddlewareOptions {
  /** Maximum number of retry attempts. */
  maxAttempts?: number;
  /** Delay between retries in milliseconds. */
  delayMs?: number;
  /** Backoff multiplier. */
  backoff?: number;
  /** Predicate that decides whether an error is retryable. */
  retryable?: (error: unknown) => boolean;
}

export function createRetryMiddleware(options: RetryMiddlewareOptions = {}): ModelMiddleware {
  const maxAttempts = options.maxAttempts ?? 3;
  const delayMs = options.delayMs ?? 500;
  const backoff = options.backoff ?? 2;
  const retryable =
    options.retryable ??
    ((error) => error instanceof ProviderError && (error.statusCode ?? 0) >= 500);

  return async (ctx) => {
    let lastError: unknown;
    let currentDelay = delayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        return await ctx.next();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts || !retryable(error)) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= backoff;
      }
    }

    throw lastError;
  };
}
