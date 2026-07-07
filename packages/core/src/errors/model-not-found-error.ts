import { ProviderError } from "./provider-error.js";

export class ModelNotFoundError extends ProviderError {
  public readonly model?: string;

  constructor(
    message: string,
    options: { providerId?: string; model?: string; cause?: unknown } = {},
  ) {
    super(message, options);
    this.model = options.model;
  }
}
