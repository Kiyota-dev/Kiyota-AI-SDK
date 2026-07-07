import { AIError } from "./ai-error.js";

export class TimeoutError extends AIError {
  public readonly timeoutMs: number;

  constructor(message: string, options: { timeoutMs: number; cause?: unknown }) {
    super(message, { cause: options.cause });
    this.timeoutMs = options.timeoutMs;
  }
}
