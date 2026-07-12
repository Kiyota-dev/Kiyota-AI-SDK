import type { EmbeddingModelV1 } from "@nurovia/core";

export interface EmbedOptions {
  model: EmbeddingModelV1;
  value: string;
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
}

export interface EmbedResult {
  embedding: number[];
  usage?: { tokens: number };
  response?: {
    headers?: Record<string, string>;
    body?: unknown;
  };
}

export async function embed(options: EmbedOptions): Promise<EmbedResult> {
  const result = await options.model.doEmbed({
    values: [options.value],
    abortSignal: options.abortSignal,
    headers: options.headers,
  });

  return {
    embedding: result.embeddings[0] ?? [],
    usage: result.usage,
    response: result.response,
  };
}
