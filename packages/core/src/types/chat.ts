import type { RequestContext } from "./context.js";
import type { Message } from "./message.js";
import type { ModelRef } from "./model.js";

export interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

export interface ChatResult {
  content: string;
  model: string;
  provider: string;
  usage?: TokenUsage;
  finishReason?: string;
}

export interface ChatOptions {
  model: string | ModelRef;
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  context?: RequestContext;
}

export interface ChatRequest extends ChatOptions {
  stream?: boolean;
}
