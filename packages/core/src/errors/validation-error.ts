import { AIError } from "./ai-error.js";
import { SDKError, SDK_ERROR_MARKER } from "./sdk-error.js";

const marker = `${SDK_ERROR_MARKER}.ValidationError`;
const markerSymbol = Symbol.for(marker);

export interface ValidationErrorOptions {
  field?: string;
  cause?: unknown;
}

export class ValidationError extends AIError {
  private readonly [markerSymbol] = true;
  public readonly field?: string;

  constructor(message: string, options: ValidationErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.field = options.field;
    void this[markerSymbol];
  }

  static override isInstance(error: unknown): error is ValidationError {
    return SDKError.hasMarker(error, marker);
  }
}
