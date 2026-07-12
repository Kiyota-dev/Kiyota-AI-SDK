import { AIError } from "./ai-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.RetryError`;
const markerSymbol = Symbol.for(marker);

export interface RetryErrorOptions {
  attempts: number;
  cause?: unknown;
}

export class RetryError extends AIError {
  private readonly [markerSymbol] = true;
  public readonly attempts: number;

  constructor(message: string, options: RetryErrorOptions) {
    super(message, { cause: options.cause });
    this.attempts = options.attempts;
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is RetryError {
    return SDKError.hasMarker(error, marker);
  }
}
