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
import { openaiFailedResponseHandler } from "../openai-error.js";
import type { OpenAIChatCompletionResponse, OpenAIStreamChunk } from "../types.js";
import type { OpenAIChatModelId, OpenAIChatSettings } from "./openai-chat-options.js";

type OpenAIChatConfig = {
  provider: string;
  headers: () => Record<string, string | undefined>;
  url: (options: { path: string }) => string;
  fetch?: FetchFunction;
};

export class OpenAIChatLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = "v1";
  readonly modelId: OpenAIChatModelId;
  readonly defaultObjectGenerationMode = "json" as const;
  readonly capabilities = {
    supportsStreaming: true,
    supportsToolCalls: false,
    supportsVision: false,
    supportsJSON: true,
    supportsReasoning: false,
  };

  private readonly config: OpenAIChatConfig;

  constructor(modelId: OpenAIChatModelId, config: OpenAIChatConfig) {
    this.modelId = modelId;
    this.config = config;
  }

  get provider(): string {
    return this.config.provider;
  }

  async doGenerate(options: LanguageModelV1CallOptions): Promise<LanguageModelV1GenerateResult> {
    const args = this.getArgs(options);
    const response = await postJsonToApi({
      url: this.config.url({ path: "/chat/completions" }),
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args.body,
      fetch: this.config.fetch,
      abortSignal: options.abortSignal,
    });

    const data = await createJsonResponseHandler<OpenAIChatCompletionResponse>({
      errorHandler: openaiFailedResponseHandler,
    })(response);

    const choice = data.choices[0];
    const usage = data.usage;

    return {
      text: choice?.message?.content ?? undefined,
      finishReason: this.mapFinishReason(choice?.finish_reason),
      usage: usage
        ? {
            promptTokens: usage.prompt_tokens,
            completionTokens: usage.completion_tokens,
            totalTokens: usage.total_tokens,
          }
        : { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
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
      url: this.config.url({ path: "/chat/completions" }),
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
      if (chunk.data === "[DONE]") continue;

      const data = JSON.parse(chunk.data) as OpenAIStreamChunk;
      const choice = data.choices[0];

      if (choice?.delta?.content) {
        yield { type: "text", text: choice.delta.content };
      }

      if (choice?.finish_reason) {
        yield {
          type: "finish",
          finishReason: this.mapFinishReason(choice.finish_reason),
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
    const openaiOptions = parseProviderOptions<OpenAIChatSettings>({
      provider: "openai",
      providerOptions: options.providerOptions,
    });

    if (options.topK != null) {
      warnings.push({
        type: "unsupported",
        feature: "topK",
        details: "OpenAI does not support topK sampling.",
      });
    }

    if (options.tools != null && options.tools.length > 0) {
      warnings.push({
        type: "unsupported",
        feature: "tools",
        details: "Tool calling is not yet supported for OpenAI in v0.2.0.",
      });
    }

    const responseFormat =
      options.responseFormat?.type === "json"
        ? options.responseFormat.schema != null
          ? {
              type: "json_schema",
              json_schema: {
                schema: options.responseFormat.schema,
                strict: true,
                name: options.responseFormat.name ?? "response",
                description: options.responseFormat.description,
              },
            }
          : { type: "json_object" }
        : undefined;

    return {
      body: {
        model: this.modelId,
        messages: options.prompt.map(this.toOpenAIMessage),
        max_tokens: options.maxOutputTokens,
        temperature: options.temperature,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stop: options.stopSequences,
        seed: options.seed,
        stream,
        response_format: responseFormat,
        user: openaiOptions?.user,
        logit_bias: openaiOptions?.logitBias,
        parallel_tool_calls: openaiOptions?.parallelToolCalls,
        reasoning_effort: openaiOptions?.reasoningEffort,
        service_tier: openaiOptions?.serviceTier,
        store: openaiOptions?.store,
      },
      warnings,
    };
  }

  private toOpenAIMessage(message: LanguageModelV1Message): { role: string; content: string } {
    if (message.role === "system") {
      return { role: "system", content: message.content };
    }

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

    return { role: "tool", content: "" };
  }

  private mapFinishReason(
    finishReason: string | null | undefined,
  ): LanguageModelV1GenerateResult["finishReason"] {
    if (finishReason == null) return "other";
    if (finishReason === "stop") return "stop";
    if (finishReason === "length") return "length";
    if (finishReason === "content_filter") return "content-filter";
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
