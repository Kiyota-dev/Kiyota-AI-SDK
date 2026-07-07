import type { ChatRequest, Message } from "@nurovia/core";
import { FetchTransport, type Transport } from "@nurovia/transport";
import type { OpenAIChatCompletionRequest, OpenAIChatCompletionResponse } from "../types.js";

export interface ChatCompletionsOptions {
  apiKey: string;
  baseURL?: string;
  transport?: Transport;
  timeout?: number;
}

export class ChatCompletionsAPI {
  private readonly transport: Transport;
  private readonly apiKey: string;

  constructor(options: ChatCompletionsOptions) {
    this.apiKey = options.apiKey;
    this.transport =
      options.transport ??
      new FetchTransport({
        baseURL: options.baseURL ?? "https://api.openai.com/v1",
        defaultTimeout: options.timeout,
      });
  }

  async create(request: ChatRequest): Promise<OpenAIChatCompletionResponse> {
    const response = await this.transport.request<OpenAIChatCompletionResponse>({
      url: "/chat/completions",
      method: "POST",
      headers: this.headers(),
      body: this.buildBody(request),
      context: request.context,
    });
    return response.data;
  }

  async *createStream(request: ChatRequest): AsyncIterable<string> {
    const stream = this.transport.stream({
      url: "/chat/completions",
      method: "POST",
      headers: this.headers(),
      body: this.buildBody(request, true),
      context: request.context,
    });

    const decoder = new TextDecoder();
    for await (const chunk of stream) {
      const text = decoder.decode(chunk.bytes);
      for (const line of text.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === "data: [DONE]") continue;
        if (trimmed.startsWith("data: ")) {
          yield trimmed.slice(6);
        }
      }
    }
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  private buildBody(request: ChatRequest, stream = false): OpenAIChatCompletionRequest {
    const model = typeof request.model === "string" ? request.model : request.model.model;
    return {
      model,
      messages: request.messages.map(this.toOpenAIMessage),
      temperature: request.temperature,
      max_tokens: request.maxTokens,
      top_p: request.topP,
      stream,
    };
  }

  private toOpenAIMessage(message: Message): {
    role: "system" | "user" | "assistant";
    content: string;
  } {
    return {
      role: message.role,
      content: message.content,
    };
  }
}
