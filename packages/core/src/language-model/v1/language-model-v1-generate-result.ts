import type { Warning } from "../../types/warning.js";
import type { LanguageModelV1ToolCallPart } from "./language-model-v1-prompt.js";
import type { LanguageModelV1Usage } from "./language-model-v1-usage.js";

export interface LanguageModelV1GenerateResult {
  text?: string;
  reasoning?: string;
  toolCalls?: LanguageModelV1ToolCallPart[];
  finishReason: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | string;
  usage: LanguageModelV1Usage;
  warnings?: Warning[];
  response?: {
    id?: string;
    timestamp?: Date;
    modelId?: string;
    headers?: Record<string, string>;
    body?: unknown;
  };
  request?: {
    body?: unknown;
  };
}
