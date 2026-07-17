import type { ModelMiddleware } from "./types.js";

export interface LoggingMiddlewareOptions {
  logger?: Pick<Console, "debug" | "info" | "error">;
}

export function createLoggingMiddleware(options: LoggingMiddlewareOptions = {}): ModelMiddleware {
  const logger = options.logger ?? console;

  return async (ctx) => {
    const start = Date.now();
    logger.debug?.("[KiyotaMiddleware] Request started", {
      model: ctx.model.modelId,
      provider: ctx.model.provider,
    });

    try {
      const result = await ctx.next();
      logger.debug?.("[KiyotaMiddleware] Request completed", {
        model: ctx.model.modelId,
        provider: ctx.model.provider,
        durationMs: Date.now() - start,
      });
      return result;
    } catch (error) {
      logger.error?.("[KiyotaMiddleware] Request failed", {
        model: ctx.model.modelId,
        provider: ctx.model.provider,
        durationMs: Date.now() - start,
        error,
      });
      throw error;
    }
  };
}
