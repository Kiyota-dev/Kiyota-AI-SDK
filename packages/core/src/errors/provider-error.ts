import { AIError } from "./ai-error.js";

export class ProviderError extends AIError {
  public readonly providerId?: string;
  public readonly statusCode?: number;

  constructor(
    message: string,
    options: { providerId?: string; statusCode?: number; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.providerId = options.providerId;
    this.statusCode = options.statusCode;
  }
}
