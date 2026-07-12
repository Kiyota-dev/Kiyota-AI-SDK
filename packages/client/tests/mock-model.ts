import type {
  EmbeddingModelV1,
  EmbeddingModelV1EmbedResult,
  LanguageModelV1,
  LanguageModelV1CallOptions,
  LanguageModelV1GenerateResult,
  LanguageModelV1StreamPart,
  LanguageModelV1StreamResult,
} from "@nurovia/core";

export function createMockLanguageModel(
  generate: (options: LanguageModelV1CallOptions) => Promise<LanguageModelV1GenerateResult>,
  stream?: (options: LanguageModelV1CallOptions) => AsyncIterable<LanguageModelV1StreamPart>,
): LanguageModelV1 {
  return {
    specificationVersion: "v1",
    provider: "mock",
    modelId: "mock-model",
    defaultObjectGenerationMode: "json",
    capabilities: {
      supportsStreaming: true,
      supportsToolCalls: false,
      supportsVision: false,
      supportsJSON: true,
      supportsReasoning: false,
    },
    doGenerate: generate,
    doStream: async (options): Promise<LanguageModelV1StreamResult> => ({
      stream: stream ? stream(options) : emptyStream(),
    }),
  };
}

async function* emptyStream(): AsyncIterable<LanguageModelV1StreamPart> {}

export function createMockEmbeddingModel(
  embed: (values: string[]) => Promise<EmbeddingModelV1EmbedResult>,
): EmbeddingModelV1 {
  return {
    specificationVersion: "v1",
    provider: "mock",
    modelId: "mock-embedding",
    doEmbed: async ({ values }): Promise<EmbeddingModelV1EmbedResult> => embed(values),
  };
}
