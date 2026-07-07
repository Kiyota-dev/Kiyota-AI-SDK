import {
  AuthenticationError,
  ProviderError,
  RetryError,
  TimeoutError,
  ValidationError,
} from "@nurovia/core";
import type { RequestContext } from "@nurovia/core";
import { type BackoffPolicy, calculateDelay } from "./policies.js";

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: BackoffPolicy;
  jitter?: boolean;
  retryable?: (error: unknown) => boolean;
}

export function defaultRetryable(error: unknown): boolean {
  if (error instanceof AuthenticationError || error instanceof ValidationError) {
    return false;
  }
  if (error instanceof ProviderError || error instanceof TimeoutError) {
    return true;
  }
  return false;
}

export interface RetryTaskOptions<T> {
  fn: (context: RequestContext) => Promise<T>;
  context: RequestContext;
  options?: RetryOptions;
}

export async function withRetry<T>({ fn, context, options = {} }: RetryTaskOptions<T>): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const delayMs = options.delayMs ?? 1000;
  const backoff = options.backoff ?? "exponential";
  const jitter = options.jitter ?? true;
  const retryable = options.retryable ?? defaultRetryable;

  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn(context);
    } catch (error) {
      lastError = error;

      if (!retryable(error)) {
        throw error;
      }

      if (attempt < maxAttempts - 1) {
        const delay = calculateDelay(attempt, delayMs, backoff, jitter);
        await sleep(delay);
      }
    }
  }

  throw new RetryError(`Failed after ${maxAttempts} attempts`, {
    attempts: maxAttempts,
    cause: lastError,
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
