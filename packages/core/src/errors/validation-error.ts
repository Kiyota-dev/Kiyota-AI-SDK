import { AIError } from "./ai-error.js";

export class ValidationError extends AIError {
  public readonly field?: string;

  constructor(message: string, options: { field?: string; cause?: unknown } = {}) {
    super(message, { cause: options.cause });
    this.field = options.field;
  }
}
