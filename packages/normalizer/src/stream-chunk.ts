import type { StreamChunk } from "@kiyota/core";

export interface StreamChunkInput {
  content: string;
  model?: string;
  provider?: string;
  finishReason?: string;
}

export function normalizeStreamChunk(input: StreamChunkInput): StreamChunk {
  return {
    content: input.content,
    model: input.model,
    provider: input.provider,
    finishReason: input.finishReason,
  };
}
