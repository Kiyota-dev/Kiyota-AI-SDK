import { AIError } from "./ai-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.ConfigurationError`;
const markerSymbol = Symbol.for(marker);

export class ConfigurationError extends AIError {
  private readonly [markerSymbol] = true;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is ConfigurationError {
    return SDKError.hasMarker(error, marker);
  }
}
