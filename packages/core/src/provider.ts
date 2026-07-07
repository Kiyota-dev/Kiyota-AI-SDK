export type { Provider, ProviderCapabilities } from "./types/provider.js";

export interface MiddlewareContext {
  request: unknown;
  context?: unknown;
  next: () => Promise<unknown>;
}

export type Middleware = (ctx: MiddlewareContext) => Promise<unknown>;
