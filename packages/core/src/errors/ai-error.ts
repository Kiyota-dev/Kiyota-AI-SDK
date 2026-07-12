import { SDKError, type SDKErrorOptions, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.AIError`;
const markerSymbol = Symbol.for(marker);

export class AIError extends SDKError {
  private readonly [markerSymbol] = true;

  constructor(message: string, options?: SDKErrorOptions) {
    super("AIError", message, options);
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is AIError {
    return SDKError.hasMarker(error, marker);
  }
}
