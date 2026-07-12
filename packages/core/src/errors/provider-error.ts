import { AIError } from "./ai-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.ProviderError`;
const markerSymbol = Symbol.for(marker);

export interface ProviderErrorOptions {
  providerId?: string;
  statusCode?: number;
  cause?: unknown;
}

export class ProviderError extends AIError {
  private readonly [markerSymbol] = true;
  public readonly providerId?: string;
  public readonly statusCode?: number;

  constructor(message: string, options: ProviderErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.providerId = options.providerId;
    this.statusCode = options.statusCode;
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is ProviderError {
    return SDKError.hasMarker(error, marker);
  }
}
