import type {
  LanguageModelV1Prompt,
  LanguageModelV1ResponseFormat,
  LanguageModelV1Tool,
  LanguageModelV1ToolChoice,
} from "./language-model-v1-prompt.js";

export interface LanguageModelV1CallOptions {
  prompt: LanguageModelV1Prompt;

  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  seed?: number;

  tools?: LanguageModelV1Tool[];
  toolChoice?: LanguageModelV1ToolChoice;
  responseFormat?: LanguageModelV1ResponseFormat;

  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
  providerOptions?: Record<string, Record<string, unknown>>;
}
