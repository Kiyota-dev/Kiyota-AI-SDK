import {
  embed,
  embedMany,
  generateObject,
  generateText,
  streamObject,
  streamText,
} from "@nurovia/client";
import type { EmbeddingModelV1, LanguageModelV1 } from "@nurovia/core";
import { requireCapability, resolveModel } from "@nurovia/models";
import { createOpenAI } from "@nurovia/provider-openai";
import type { NuroviaConfig } from "./config.js";

export type { NuroviaConfig } from "./config.js";

// Re-export core AI functions so users can import everything from "nurovia".
export {
  embed,
  embedMany,
  generateObject,
  generateText,
  streamObject,
  streamText,
} from "@nurovia/client";

export type {
  GenerateTextOptions,
  GenerateTextResult,
} from "@nurovia/client";
export type {
  StreamTextOptions,
  StreamTextResult,
} from "@nurovia/client";
export type {
  EmbedOptions,
  EmbedResult,
  EmbedManyOptions,
  EmbedManyResult,
} from "@nurovia/client";
export type {
  GenerateObjectOptions,
  GenerateObjectResult,
} from "@nurovia/client";
export type {
  StreamObjectOptions,
  StreamObjectResult,
} from "@nurovia/client";

class ProviderNotConfiguredError extends Error {
  constructor(provider: string) {
    super(
      `Provider "${provider}" is not configured. Pass it to nurovia({ ${provider}: { apiKey: "..." } }).`,
    );
    this.name = "ProviderNotConfiguredError";
  }
}

/**
 * Create a Nurovia SDK instance with configured providers and a bound model registry.
 *
 * @example
 * ```ts
 * import { nurovia } from "nurovia";
 *
 * const ai = nurovia({
 *   openai: { apiKey: process.env.OPENAI_API_KEY },
 * });
 *
 * const { text } = await ai.generateText({
 *   model: ai.models.openai.gpt4o,
 *   messages: [{ role: "user", content: "Hello!" }],
 * });
 * ```
 */
export function nurovia(config: NuroviaConfig = {}) {
  const openai = config.openai ? createOpenAI(config.openai) : undefined;

  const requireOpenAI = () => {
    if (!openai) {
      throw new ProviderNotConfiguredError("openai");
    }
    return openai;
  };

  const chatModel = (modelId: string): LanguageModelV1 => {
    const definition = resolveModel(modelId);
    requireCapability(definition, "chat");
    return requireOpenAI().languageModel(modelId);
  };

  const embeddingModel = (modelId: string): EmbeddingModelV1 => {
    const definition = resolveModel(modelId);
    requireCapability(definition, "embedding");
    return requireOpenAI().embedding(modelId);
  };

  return {
    generateText,
    streamText,
    embed,
    embedMany,
    generateObject,
    streamObject,

    providers: {
      get openai() {
        return requireOpenAI();
      },
    },

    models: {
      openai: {
        get gpt4o(): LanguageModelV1 {
          return chatModel("gpt-4o");
        },
        get gpt4oMini(): LanguageModelV1 {
          return chatModel("gpt-4o-mini");
        },
        get gpt4Turbo(): LanguageModelV1 {
          return chatModel("gpt-4-turbo");
        },
        get gpt4(): LanguageModelV1 {
          return chatModel("gpt-4");
        },
        get gpt35Turbo(): LanguageModelV1 {
          return chatModel("gpt-3.5-turbo");
        },
        get o1(): LanguageModelV1 {
          return chatModel("o1");
        },
        get o3Mini(): LanguageModelV1 {
          return chatModel("o3-mini");
        },
        get textEmbedding3Small(): EmbeddingModelV1 {
          return embeddingModel("text-embedding-3-small");
        },
        get textEmbedding3Large(): EmbeddingModelV1 {
          return embeddingModel("text-embedding-3-large");
        },
        get textEmbeddingAda002(): EmbeddingModelV1 {
          return embeddingModel("text-embedding-ada-002");
        },
      },
    },
  };
}
