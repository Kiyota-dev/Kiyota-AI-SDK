import type { LanguageModelV1 } from "@nurovia/core";
import {
  type SimpleMessage,
  convertToLanguageModelPrompt,
} from "../prompt/convert-to-language-model-prompt.js";

export interface GenerateObjectOptions<T = unknown> {
  model: LanguageModelV1;
  messages: SimpleMessage[];
  schema?: { parse: (value: unknown) => T };
  output?: "object" | "no-schema";
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
  providerOptions?: Record<string, Record<string, unknown>>;
}

export interface GenerateObjectResult<T = unknown> {
  object: T;
  text?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function generateObject<T>(
  options: GenerateObjectOptions<T>,
): Promise<GenerateObjectResult<T>> {
  const responseFormat: {
    type: "json";
    schema?: Record<string, unknown>;
    name?: string;
  } = { type: "json" };

  const result = await options.model.doGenerate({
    prompt: convertToLanguageModelPrompt(options.messages),
    responseFormat,
    maxOutputTokens: options.maxTokens,
    temperature: options.temperature,
    topP: options.topP,
    abortSignal: options.abortSignal,
    headers: options.headers,
    providerOptions: options.providerOptions,
  });

  const rawText = result.text ?? "";
  const cleaned = rawText.replace(/^```json\s*|\s*```$/g, "").trim();
  const parsed = JSON.parse(cleaned) as unknown;

  return {
    object: options.schema ? options.schema.parse(parsed) : (parsed as T),
    text: rawText,
    usage: result.usage,
  };
}
