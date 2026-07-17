import type {
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1GenerateResult,
  LanguageModelV1Message,
  LanguageModelV1StreamPart,
  LanguageModelV1StreamResult,
  Warning,
} from "@kiyota/core";
import {
  type FetchFunction,
  combineHeaders,
  createEventSourceResponseHandler,
  createJsonResponseHandler,
  parseProviderOptions,
  postJsonToApi,
} from "@kiyota/provider-utils";
import { anthropicFailedResponseHandler } from "../anthropic-error.js";
import type {
  AnthropicMessage,
  AnthropicMessageResponse,
  AnthropicStreamChunk,
} from "../types.js";
import type { AnthropicChatModelId, AnthropicChatSettings } from "./anthropic-chat-options.js";

type AnthropicChatConfig = {
  provider: string;
  headers: () => Record<string, string | undefined>;
  url: (options: { path: string }) => string;
  fetch?: FetchFunction;
};

export class AnthropicChatLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = "v1";
  readonly modelId: AnthropicChatModelId;
  readonly defaultObjectGenerationMode = "json" as const;
  readonly capabilities = {
    supportsStreaming: true,
    supportsToolCalls: false,
    supportsVision: false,
    supportsJSON: true,
    supportsReasoning: false,
  };

  private readonly config: AnthropicChatConfig;

  constructor(modelId: AnthropicChatModelId, config: AnthropicChatConfig) {
    this.modelId = modelId;
    this.config = config;
  }

  get provider(): string {
    return this.config.provider;
  }

  async doGenerate(options: LanguageModelV1CallOptions): Promise<LanguageModelV1GenerateResult> {
    const args = this.getArgs(options);
    const response = await postJsonToApi({
      url: this.config.url({ path: "/messages" }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args.body,
      fetch: this.config.fetch,
      abortSignal: options.abortSignal,
    });

    const data = await createJsonResponseHandler<AnthropicMessageResponse>({
      errorHandler: anthropicFailedResponseHandler,
    })(response);

    return {
      text: this.extractText(data),
      finishReason: this.mapFinishReason(data.stop_reason),
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      warnings: args.warnings,
      response: {
        id: data.id,
        modelId: data.model,
        headers: this.headersToRecord(response.headers),
        body: data,
      },
    };
  }

  async doStream(options: LanguageModelV1CallOptions): Promise<LanguageModelV1StreamResult> {
    const args = this.getArgs(options, true);
    const response = await postJsonToApi({
      url: this.config.url({ path: "/messages" }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args.body,
      fetch: this.config.fetch,
      abortSignal: options.abortSignal,
    });

    const handler = createEventSourceResponseHandler();

    return {
      stream: this.transformStream(handler(response), args.warnings),
    };
  }

  private async *transformStream(
    source: AsyncIterable<{ event?: string; data: string }>,
    warnings: Warning[],
  ): AsyncIterable<LanguageModelV1StreamPart> {
    for await (const chunk of source) {
      if (chunk.data.trim() === "") continue;

      const data = JSON.parse(chunk.data) as AnthropicStreamChunk;

      if (data.type === "content_block_delta" && "delta" in data) {
        const text = data.delta.text;
        if (text) {
          yield { type: "text", text };
        }
      }

      if (data.type === "message_delta" && "delta" in data) {
        const finishReason = this.mapFinishReason(data.delta.stop_reason);
        yield {
          type: "finish",
          finishReason,
          usage:
            "usage" in data && data.usage != null
              ? {
                  promptTokens: data.usage.input_tokens,
                  completionTokens: data.usage.output_tokens,
                  totalTokens: data.usage.input_tokens + data.usage.output_tokens,
                }
              : undefined,
        };
      }
    }

    for (const warning of warnings) {
      yield {
        type: "error",
        error: new Error(warning.message ?? `Unsupported: ${warning.feature}`),
      };
    }
  }

  private getArgs(
    options: LanguageModelV1CallOptions,
    stream = false,
  ): { body: unknown; warnings: Warning[] } {
    const warnings: Warning[] = [];
    const anthropicOptions = parseProviderOptions<AnthropicChatSettings>({
      provider: "anthropic",
      providerOptions: options.providerOptions,
    });

    if (options.tools != null && options.tools.length > 0) {
      warnings.push({
        type: "unsupported",
        feature: "tools",
        details: "Tool calling is not yet supported for Anthropic in v0.2.1.",
      });
    }

    const systemMessage = options.prompt.find(
      (message): message is LanguageModelV1Message & { role: "system" } =>
        message.role === "system",
    );

    const messages = options.prompt
      .filter((message) => message.role !== "system")
      .map(this.toAnthropicMessage);

    return {
      body: {
        model: this.modelId,
        system: systemMessage?.content,
        messages,
        max_tokens: options.maxOutputTokens ?? 4096,
        temperature: options.temperature,
        top_p: options.topP,
        stop_sequences: options.stopSequences,
        stream,
        metadata: anthropicOptions?.metadata,
      },
      warnings,
    };
  }

  private toAnthropicMessage(message: LanguageModelV1Message): AnthropicMessage {
    if (message.role === "user") {
      return {
        role: "user",
        content: message.content.map((part) => (part.type === "text" ? part.text : "")).join(""),
      };
    }

    if (message.role === "assistant") {
      return {
        role: "assistant",
        content: message.content.map((part) => (part.type === "text" ? part.text : "")).join(""),
      };
    }

    return { role: "user", content: "" };
  }

  private extractText(response: AnthropicMessageResponse): string | undefined {
    const textBlocks = response.content
      .filter((block): block is { type: "text"; text: string } => block.type === "text")
      .map((block) => block.text);

    return textBlocks.length > 0 ? textBlocks.join("") : undefined;
  }

  private mapFinishReason(
    finishReason: string | null | undefined,
  ): LanguageModelV1GenerateResult["finishReason"] {
    if (finishReason == null) return "other";
    if (finishReason === "end_turn") return "stop";
    if (finishReason === "max_tokens") return "length";
    if (finishReason === "stop_sequence") return "stop";
    return "other";
  }

  private headersToRecord(headers: Headers): Record<string, string> {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  }
}
