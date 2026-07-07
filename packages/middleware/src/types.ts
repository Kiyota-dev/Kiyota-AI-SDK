import type { ChatRequest, ChatResult, RequestContext, StreamChunk } from "@nurovia/core";

export interface MiddlewareContext {
  request: ChatRequest;
  context: RequestContext;
  next: () => Promise<ChatResult | AsyncIterable<StreamChunk>>;
}

export type Middleware = (
  ctx: MiddlewareContext,
) => Promise<ChatResult | AsyncIterable<StreamChunk>>;
