import type {
  ChatRequest,
  ChatResult,
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1GenerateResult,
  LanguageModelV1StreamResult,
  RequestContext,
  StreamChunk,
} from "@kiyota/core";

/** @deprecated Legacy middleware context for the registry-based AI class. */
export interface MiddlewareContext {
  request: ChatRequest;
  context: RequestContext;
  next: () => Promise<ChatResult | AsyncIterable<StreamChunk>>;
}

/** @deprecated Legacy middleware for the registry-based AI class. */
export type Middleware = (
  ctx: MiddlewareContext,
) => Promise<ChatResult | AsyncIterable<StreamChunk>>;

/** Model-first middleware context. */
export interface ModelMiddlewareContext {
  /** The language model being invoked. */
  model: LanguageModelV1;
  /** The call options that will be sent to the provider. */
  request: LanguageModelV1CallOptions;
  /** Invoke the next middleware or the underlying model call. */
  next: () => Promise<LanguageModelV1GenerateResult | LanguageModelV1StreamResult>;
}

/** Model-first middleware function. */
export type ModelMiddleware = (
  ctx: ModelMiddlewareContext,
) => Promise<LanguageModelV1GenerateResult | LanguageModelV1StreamResult>;

export interface ModelMiddlewareResult<T = unknown> {
  request: LanguageModelV1CallOptions;
  result: T;
}
