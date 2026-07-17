import type {
  ChatRequest,
  ChatResult,
  Provider,
  ProviderCapabilities,
  ProviderConfig,
  StreamChunk,
} from "@kiyota/core";
import { ProviderError } from "@kiyota/core";
import type { Transport } from "@kiyota/transport";
import { isNonEmptyString } from "@kiyota/utils";
import { OpenAIChat } from "./chat.js";

export interface OpenAIProviderConfig extends ProviderConfig {
  apiKey: string;
  transport?: Transport;
}

export class OpenAIProvider implements Provider {
  readonly id = "openai";
  readonly name = "OpenAI";
  readonly version = "0.1.0";

  private readonly chatClient: OpenAIChat;

  constructor(config: OpenAIProviderConfig) {
    if (!isNonEmptyString(config.apiKey)) {
      throw new ProviderError("OpenAI API key is required", { providerId: this.id });
    }
    this.chatClient = new OpenAIChat({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      timeout: config.timeout?.request,
      transport: config.transport,
    });
  }

  capabilities(): ProviderCapabilities {
    return {
      streaming: true,
      functionCalling: false,
      vision: false,
      jsonMode: false,
      systemMessages: true,
      maxTokens: true,
    };
  }

  chat(request: ChatRequest): Promise<ChatResult> {
    return this.chatClient.chat(request);
  }

  stream(request: ChatRequest): AsyncIterable<StreamChunk> {
    return this.chatClient.stream(request);
  }
}
