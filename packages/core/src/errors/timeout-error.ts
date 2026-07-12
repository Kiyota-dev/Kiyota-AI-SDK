import { AIError } from "./ai-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.TimeoutError`;
const markerSymbol = Symbol.for(marker);

export interface TimeoutErrorOptions {
  timeoutMs: number;
  cause?: unknown;
}

export class TimeoutError extends AIError {
  private readonly [markerSymbol] = true;
  public readonly timeoutMs: number;

  constructor(message: string, options: TimeoutErrorOptions) {
    super(message, { cause: options.cause });
    this.timeoutMs = options.timeoutMs;
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is TimeoutError {
    return SDKError.hasMarker(error, marker);
  }
}
