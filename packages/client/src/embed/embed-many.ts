import type { EmbeddingModelV1 } from "@kiyota/core";

export interface EmbedManyOptions {
  model: EmbeddingModelV1;
  values: string[];
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
}

export interface EmbedManyResult {
  embeddings: number[][];
  usage?: { tokens: number };
  response?: {
    headers?: Record<string, string>;
    body?: unknown;
  };
}

export async function embedMany(options: EmbedManyOptions): Promise<EmbedManyResult> {
  const result = await options.model.doEmbed({
    values: options.values,
    abortSignal: options.abortSignal,
    headers: options.headers,
  });

  return {
    embeddings: result.embeddings,
    usage: result.usage,
    response: result.response,
  };
}
