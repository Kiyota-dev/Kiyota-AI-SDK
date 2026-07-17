import {
  embed,
  embedMany,
  generateObject,
  generateText,
  streamObject,
  streamText,
} from "@kiyota/client";
import type { EmbeddingModelV1, LanguageModelV1 } from "@kiyota/core";
import { requireCapability, resolveModel } from "@kiyota/models";
import { createAnthropic } from "@kiyota/provider-anthropic";
import { createOpenAI } from "@kiyota/provider-openai";
import type { KiyotaConfig } from "./config.js";

export type { KiyotaConfig } from "./config.js";

// Re-export core AI functions so users can import everything from "@kiyota/sdk".
export {
  embed,
  embedMany,
  generateObject,
  generateText,
  streamObject,
  streamText,
} from "@kiyota/client";

export type {
  GenerateTextOptions,
  GenerateTextResult,
} from "@kiyota/client";
export type {
  StreamTextOptions,
  StreamTextResult,
} from "@kiyota/client";
export type {
  EmbedOptions,
  EmbedResult,
  EmbedManyOptions,
  EmbedManyResult,
} from "@kiyota/client";
export type {
  GenerateObjectOptions,
  GenerateObjectResult,
} from "@kiyota/client";
export type {
  StreamObjectOptions,
  StreamObjectResult,
} from "@kiyota/client";

class ProviderNotConfiguredError extends Error {
  constructor(provider: string) {
    super(
      `Provider "${provider}" is not configured. Pass it to kiyota({ ${provider}: { apiKey: "..." } }).`,
    );
    this.name = "ProviderNotConfiguredError";
  }
}

/**
 * Create a Kiyota SDK instance with configured providers and a bound model registry.
 *
 * @example
 * ```ts
 * import { kiyota } from "@kiyota/sdk";
 *
 * const ai = kiyota({
 *   openai: { apiKey: process.env.OPENAI_API_KEY },
 * });
 *
 * const { text } = await ai.generateText({
 *   model: ai.models.openai.gpt4o,
 *   messages: [{ role: "user", content: "Hello!" }],
 * });
 * ```
 */
export function kiyota(config: KiyotaConfig = {}) {
  const openai = config.openai ? createOpenAI(config.openai) : undefined;
  const anthropic = config.anthropic ? createAnthropic(config.anthropic) : undefined;

  const requireOpenAI = () => {
    if (!openai) {
      throw new ProviderNotConfiguredError("openai");
    }
    return openai;
  };

  const requireAnthropic = () => {
    if (!anthropic) {
      throw new ProviderNotConfiguredError("anthropic");
    }
    return anthropic;
  };

  const chatModel = (modelId: string): LanguageModelV1 => {
    const definition = resolveModel(modelId);
    requireCapability(definition, "chat");

    if (definition.provider === "anthropic") {
      return requireAnthropic().languageModel(modelId);
    }

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
      get anthropic() {
        return requireAnthropic();
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
      anthropic: {
        get claude35Sonnet(): LanguageModelV1 {
          return chatModel("claude-3-5-sonnet-20241022");
        },
        get claude35Haiku(): LanguageModelV1 {
          return chatModel("claude-3-5-haiku-20241022");
        },
        get claude3Opus(): LanguageModelV1 {
          return chatModel("claude-3-opus-20240229");
        },
        get claude3Sonnet(): LanguageModelV1 {
          return chatModel("claude-3-sonnet-20240229");
        },
        get claude3Haiku(): LanguageModelV1 {
          return chatModel("claude-3-haiku-20240307");
        },
      },
    },
  };
}
