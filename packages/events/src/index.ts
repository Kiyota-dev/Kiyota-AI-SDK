export { createEventBus, SimpleEventBus } from "./simple-event-bus.js";
export type { EventBus, EventHandler, KiyotaEvent } from "./types.js";

// Well-known event types and payload shapes.
export interface RequestStartPayload {
  model: string;
  provider: string;
  messages: Array<{ role: string; content: string }>;
  options?: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
  };
}

export interface RequestCompletePayload {
  model: string;
  provider: string;
  text?: string;
  finishReason: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface RequestErrorPayload {
  model: string;
  provider: string;
  error: unknown;
}

export interface StreamStartPayload {
  model: string;
  provider: string;
}

export interface StreamChunkPayload {
  model: string;
  provider: string;
  text: string;
}

export interface StreamFinishPayload {
  model: string;
  provider: string;
  finishReason: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamErrorPayload {
  model: string;
  provider: string;
  error: unknown;
}
