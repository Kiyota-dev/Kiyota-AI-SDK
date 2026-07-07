import type { ChatRequest, ChatResult, StreamChunk } from "@nurovia/core";
import { ChatCompletionsAPI, type ChatCompletionsOptions } from "./api/chat-completions.js";
import { normalizeOpenAIChatResult, normalizeOpenAIStreamChunk } from "./normalize.js";
import type { OpenAIStreamChunk } from "./types.js";

export interface OpenAIChatOptions extends ChatCompletionsOptions {}

const PROVIDER = "openai";

export class OpenAIChat {
  private readonly api: ChatCompletionsAPI;

  constructor(options: OpenAIChatOptions) {
    this.api = new ChatCompletionsAPI(options);
  }

  async chat(request: ChatRequest): Promise<ChatResult> {
    const response = await this.api.create(request);
    return normalizeOpenAIChatResult(response, PROVIDER);
  }

  async *stream(request: ChatRequest): AsyncIterable<StreamChunk> {
    for await (const data of this.api.createStream(request)) {
      try {
        const chunk = JSON.parse(data) as OpenAIStreamChunk;
        yield normalizeOpenAIStreamChunk(chunk, PROVIDER);
      } catch {
        // Skip malformed SSE lines.
      }
    }
  }
}
