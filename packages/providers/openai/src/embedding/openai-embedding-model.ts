import type { EmbeddingModelV1, EmbeddingModelV1EmbedResult } from "@nurovia/core";
import {
  type FetchFunction,
  combineHeaders,
  createJsonResponseHandler,
  postJsonToApi,
} from "@nurovia/provider-utils";
import { openaiFailedResponseHandler } from "../openai-error.js";

export type OpenAIEmbeddingModelId =
  | "text-embedding-3-small"
  | "text-embedding-3-large"
  | "text-embedding-ada-002"
  | (string & {});

interface OpenAIEmbeddingResponse {
  data: { embedding: number[]; index: number }[];
  usage?: { prompt_tokens: number; total_tokens: number };
}

type OpenAIEmbeddingConfig = {
  provider: string;
  headers: () => Record<string, string | undefined>;
  url: (options: { path: string }) => string;
  fetch?: FetchFunction;
};

export class OpenAIEmbeddingModel implements EmbeddingModelV1 {
  readonly specificationVersion = "v1";
  readonly provider: string;
  readonly modelId: OpenAIEmbeddingModelId;

  private readonly config: OpenAIEmbeddingConfig;

  constructor(modelId: OpenAIEmbeddingModelId, config: OpenAIEmbeddingConfig) {
    this.modelId = modelId;
    this.config = config;
    this.provider = config.provider;
  }

  async doEmbed({
    values,
    abortSignal,
    headers,
  }: {
    values: string[];
    abortSignal?: AbortSignal;
    headers?: Record<string, string | undefined>;
  }): Promise<EmbeddingModelV1EmbedResult> {
    const response = await postJsonToApi({
      url: this.config.url({ path: "/embeddings" }),
      headers: combineHeaders(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float",
      },
      fetch: this.config.fetch,
      abortSignal,
    });

    const data = await createJsonResponseHandler<OpenAIEmbeddingResponse>({
      errorHandler: openaiFailedResponseHandler,
    })(response);

    const embeddings = data.data.sort((a, b) => a.index - b.index).map((item) => item.embedding);

    return {
      embeddings,
      usage: data.usage
        ? {
            tokens: data.usage.prompt_tokens,
          }
        : undefined,
      response: {
        headers: this.headersToRecord(response.headers),
        body: data,
      },
    };
  }

  private headersToRecord(headers: Headers): Record<string, string> {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  }
}
