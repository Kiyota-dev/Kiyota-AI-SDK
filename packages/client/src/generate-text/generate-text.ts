import type {
  LanguageModelV1,
  LanguageModelV1GenerateResult,
  LanguageModelV1Usage,
  Warning,
} from "@kiyota/core";
import type { EventBus } from "@kiyota/events";
import { runModelMiddleware, type ModelMiddleware } from "@kiyota/middleware";
import {
  type SimpleMessage,
  convertToLanguageModelPrompt,
} from "../prompt/convert-to-language-model-prompt.js";

export interface GenerateTextOptions {
  model: LanguageModelV1;
  messages: SimpleMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  seed?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
  providerOptions?: Record<string, Record<string, unknown>>;
  eventBus?: EventBus;
  middleware?: ModelMiddleware[];
}

export interface GenerateTextResult {
  text: string;
  finishReason: LanguageModelV1GenerateResult["finishReason"];
  usage: LanguageModelV1Usage;
  warnings?: Warning[];
  response?: LanguageModelV1GenerateResult["response"];
}

export async function generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
  const eventBus = options.eventBus;
  const model = options.model;
  const provider = model.provider;
  const modelId = model.modelId;

  eventBus?.emit({
    type: "request:start",
    version: 1,
    payload: {
      model: modelId,
      provider,
      messages: options.messages,
      options: {
        maxTokens: options.maxTokens,
        temperature: options.temperature,
        topP: options.topP,
        topK: options.topK,
      },
    },
  });

  const prompt = convertToLanguageModelPrompt(options.messages);
  const request = {
    prompt,
    maxOutputTokens: options.maxTokens,
    temperature: options.temperature,
    topP: options.topP,
    topK: options.topK,
    frequencyPenalty: options.frequencyPenalty,
    presencePenalty: options.presencePenalty,
    stopSequences: options.stopSequences,
    seed: options.seed,
    abortSignal: options.abortSignal,
    headers: options.headers,
    providerOptions: options.providerOptions,
  };

  const middleware = options.middleware ?? [];

  try {
    const result = (await runModelMiddleware(
      model,
      request,
      middleware,
      async (req) => model.doGenerate(req),
    )) as LanguageModelV1GenerateResult;

    eventBus?.emit({
      type: "request:complete",
      version: 1,
      payload: {
        model: modelId,
        provider,
        text: result.text,
        finishReason: result.finishReason,
        usage: result.usage,
      },
    });

    return {
      text: result.text ?? "",
      finishReason: result.finishReason,
      usage: result.usage,
      warnings: result.warnings,
      response: result.response,
    };
  } catch (error) {
    eventBus?.emit({
      type: "request:error",
      version: 1,
      payload: {
        model: modelId,
        provider,
        error,
      },
    });
    throw error;
  }
}
