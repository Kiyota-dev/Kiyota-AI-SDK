import type {
  LanguageModelV1,
  LanguageModelV1GenerateResult,
  LanguageModelV1Usage,
  Warning,
} from "@kiyota/core";
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
}

export interface GenerateTextResult {
  text: string;
  finishReason: LanguageModelV1GenerateResult["finishReason"];
  usage: LanguageModelV1Usage;
  warnings?: Warning[];
  response?: LanguageModelV1GenerateResult["response"];
}

export async function generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
  const result = await options.model.doGenerate({
    prompt: convertToLanguageModelPrompt(options.messages),
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
  });

  return {
    text: result.text ?? "",
    finishReason: result.finishReason,
    usage: result.usage,
    warnings: result.warnings,
    response: result.response,
  };
}
