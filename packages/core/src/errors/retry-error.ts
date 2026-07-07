import { AIError } from "./ai-error.js";

export class RetryError extends AIError {
  public readonly attempts: number;

  constructor(message: string, options: { attempts: number; cause?: unknown }) {
    super(message, { cause: options.cause });
    this.attempts = options.attempts;
  }
}
