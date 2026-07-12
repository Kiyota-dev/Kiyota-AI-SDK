import { ProviderError, type ProviderErrorOptions } from "./provider-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.AuthenticationError`;
const markerSymbol = Symbol.for(marker);

export class AuthenticationError extends ProviderError {
  private readonly [markerSymbol] = true;

  constructor(message: string, options: ProviderErrorOptions = {}) {
    super(message, options);
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is AuthenticationError {
    return SDKError.hasMarker(error, marker);
  }
}
