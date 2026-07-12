import { ProviderError, type ProviderErrorOptions } from "./provider-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.ModelNotFoundError`;
const markerSymbol = Symbol.for(marker);

export interface ModelNotFoundErrorOptions extends ProviderErrorOptions {
  model?: string;
}

export class ModelNotFoundError extends ProviderError {
  private readonly [markerSymbol] = true;
  public readonly model?: string;

  constructor(message: string, options: ModelNotFoundErrorOptions = {}) {
    super(message, options);
    this.model = options.model;
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is ModelNotFoundError {
    return SDKError.hasMarker(error, marker);
  }
}
