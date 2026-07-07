import type { ChatRequest, ChatResult } from "./chat.js";
import type { StreamChunk } from "./stream.js";

export interface ProviderCapabilities {
  streaming: boolean;
  functionCalling: boolean;
  vision: boolean;
  jsonMode: boolean;
  systemMessages: boolean;
  maxTokens: boolean;
}

export interface Provider {
  id: string;
  name: string;
  version: string;
  capabilities(): ProviderCapabilities;
  chat(request: ChatRequest): Promise<ChatResult>;
  stream(request: ChatRequest): AsyncIterable<StreamChunk>;
}
