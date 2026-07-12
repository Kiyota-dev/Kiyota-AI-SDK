export interface EmbeddingModelV1EmbedResult {
  embeddings: number[][];
  usage?: {
    tokens: number;
  };
  response?: {
    headers?: Record<string, string>;
    body?: unknown;
  };
}

export interface EmbeddingModelV1 {
  readonly specificationVersion: "v1";
  readonly provider: string;
  readonly modelId: string;

  doEmbed(options: {
    values: string[];
    abortSignal?: AbortSignal;
    headers?: Record<string, string | undefined>;
  }): Promise<EmbeddingModelV1EmbedResult>;
}
