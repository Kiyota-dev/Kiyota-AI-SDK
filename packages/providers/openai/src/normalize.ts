import type { ChatResult, StreamChunk, TokenUsage } from "@nurovia/core";
import { normalizeChatResult, normalizeStreamChunk } from "@nurovia/normalizer";
import type { OpenAIChatCompletionResponse, OpenAIStreamChunk } from "./types.js";

export function normalizeOpenAIChatResult(
  response: OpenAIChatCompletionResponse,
  provider: string,
): ChatResult {
  const choice = response.choices[0];
  const usage: TokenUsage | undefined = response.usage
    ? {
        prompt: response.usage.prompt_tokens,
        completion: response.usage.completion_tokens,
        total: response.usage.total_tokens,
      }
    : undefined;

  return normalizeChatResult({
    content: choice?.message?.content ?? "",
    model: response.model,
    provider,
    usage,
    finishReason: choice?.finish_reason ?? undefined,
  });
}

export function normalizeOpenAIStreamChunk(
  chunk: OpenAIStreamChunk,
  provider: string,
): StreamChunk {
  const choice = chunk.choices[0];
  return normalizeStreamChunk({
    content: choice?.delta?.content ?? "",
    model: chunk.model,
    provider,
    finishReason: choice?.finish_reason ?? undefined,
  });
}
