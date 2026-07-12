import type {
  ChatRequest,
  ChatResult,
  Logger,
  ModelRef,
  Provider,
  RequestContext,
  StreamChunk,
} from "@nurovia/core";
import { ConfigurationError, type MessageRole } from "@nurovia/core";
import { withRetry } from "@nurovia/retry";
import { createRequestContext } from "@nurovia/transport";
import type { AIConfig } from "./config.js";
import { ProviderRegistry } from "./registry.js";

let deprecationWarningShown = false;

function warnAboutDeprecation(): void {
  if (deprecationWarningShown) return;
  deprecationWarningShown = true;

  console.warn(
    "[Nurovia AI SDK] The `AI` class and registry-based API are deprecated and will be removed in v0.3.0. " +
      "Migrate to the model-first API: `generateText({ model: openai.languageModel('gpt-4o'), messages })`. " +
      "See https://github.com/Nurovia-dev/Nurovia-AI-SDK/blob/main/docs/migrate-v0.1-to-v0.2.md",
  );
}

export class AI {
  private readonly registry = new ProviderRegistry();
  private readonly config: Required<Pick<AIConfig, "retry" | "timeout">> &
    Omit<AIConfig, "retry" | "timeout">;
  private readonly logger: Logger;

  constructor(config: AIConfig = {}) {
    warnAboutDeprecation();

    this.config = {
      ...config,
      retry: config.retry ?? {},
      timeout: config.timeout ?? {},
    };
    this.logger = config.logger ?? console;

    if (config.middleware) {
      this.logger.debug("Middleware is configured but not yet implemented in v0.1.0");
    }
  }

  register(provider: Provider): void {
    warnAboutDeprecation();
    this.registry.register(provider.id, provider);
  }

  async chat(options: {
    model: string | ModelRef;
    messages: { role: MessageRole; content: string }[];
    provider?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
    context?: Partial<RequestContext>;
  }): Promise<ChatResult | AsyncIterable<StreamChunk>> {
    const provider = this.resolveProvider(options.model, options.provider);
    const request = this.buildRequest(options);

    if (options.stream) {
      return this.executeStream(provider, request);
    }

    return this.executeChat(provider, request);
  }

  private resolveProvider(model: string | ModelRef, providerName?: string): Provider {
    const name =
      providerName ?? (typeof model === "object" ? model.provider : this.config.provider);

    if (!name) {
      throw new ConfigurationError(
        "A provider must be specified via options.provider, model.provider, or AIConfig.provider",
      );
    }

    return this.registry.get(name);
  }

  private buildRequest(options: {
    model: string | ModelRef;
    messages: { role: MessageRole; content: string }[];
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
    context?: Partial<RequestContext>;
  }): ChatRequest {
    return {
      model: options.model,
      messages: options.messages,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      topP: options.topP,
      stream: options.stream,
      context: createRequestContext(options.context),
    };
  }

  private async executeChat(provider: Provider, request: ChatRequest): Promise<ChatResult> {
    return withRetry({
      fn: () => provider.chat(request),
      context: request.context ?? createRequestContext(),
      options: this.config.retry,
    });
  }

  private async *executeStream(
    provider: Provider,
    request: ChatRequest,
  ): AsyncIterable<StreamChunk> {
    const stream = provider.stream(request);
    for await (const chunk of stream) {
      yield chunk;
    }
  }
}
