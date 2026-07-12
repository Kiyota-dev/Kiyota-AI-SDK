import { ProviderError, type ProviderErrorOptions } from "./provider-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.RateLimitError`;
const markerSymbol = Symbol.for(marker);

export interface RateLimitErrorOptions extends ProviderErrorOptions {
  retryAfter?: number;
}

export class RateLimitError extends ProviderError {
  private readonly [markerSymbol] = true;
  public readonly retryAfter?: number;

  constructor(message: string, options: RateLimitErrorOptions = {}) {
    super(message, options);
    this.retryAfter = options.retryAfter;
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is RateLimitError {
    return SDKError.hasMarker(error, marker);
  }
}
