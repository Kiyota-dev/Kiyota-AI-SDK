import type { Logger } from "./logger.js";

export interface RetryConfig {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: "fixed" | "exponential" | "linear";
  jitter?: boolean;
}

export interface TimeoutConfig {
  request?: number;
  stream?: number;
}

export interface AIConfig {
  provider?: string;
  apiKey?: string;
  baseURL?: string;
  retry?: RetryConfig;
  timeout?: TimeoutConfig;
  logger?: Logger;
}

export interface ProviderConfig {
  apiKey?: string;
  baseURL?: string;
  timeout?: TimeoutConfig;
}
