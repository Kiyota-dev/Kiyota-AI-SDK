import { ProviderError } from "./provider-error.js";

export class RateLimitError extends ProviderError {
  public readonly retryAfter?: number;

  constructor(
    message: string,
    options: { providerId?: string; retryAfter?: number; cause?: unknown } = {},
  ) {
    super(message, options);
    this.retryAfter = options.retryAfter;
  }
}
