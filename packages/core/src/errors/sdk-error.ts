export const SDK_ERROR_MARKER = "kiyota.ai.error";
const sdkErrorSymbol = Symbol.for(SDK_ERROR_MARKER);

export interface SDKErrorOptions {
  cause?: unknown;
}

export class SDKError extends Error {
  private readonly [sdkErrorSymbol] = true;
  readonly cause?: unknown;

  constructor(
    public readonly name: string,
    message: string,
    options: SDKErrorOptions = {},
  ) {
    super(message);
    this.cause = options.cause;
    void this[sdkErrorSymbol];
  }

  static isInstance(error: unknown): error is SDKError {
    return SDKError.hasMarker(error, SDK_ERROR_MARKER);
  }

  static hasMarker(error: unknown, marker: string): boolean {
    const markerSymbol = Symbol.for(marker);
    return (
      error != null &&
      typeof error === "object" &&
      markerSymbol in error &&
      typeof (error as Record<symbol, unknown>)[markerSymbol] === "boolean" &&
      (error as Record<symbol, boolean>)[markerSymbol] === true
    );
  }
}
