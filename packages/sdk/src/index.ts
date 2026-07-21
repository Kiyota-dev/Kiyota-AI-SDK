import {
  embed,
  embedMany,
  generateObject,
  generateText,
  streamObject,
  streamText,
} from "@kiyota/client";
import type { EmbeddingModelV1, LanguageModelV1 } from "@kiyota/core";
import {
  bestCoding as bestCodingModel,
  bestVision as bestVisionModel,
  cheapest as cheapestModel,
  fastest as fastestModel,
  findModels,
  highestReasoning as highestReasoningModel,
  listModels,
  listModelsByProvider,
  listProviders,
  recommended as recommendedModel,
  requireCapability,
  resolveModel,
  type ModelDefinition,
} from "@kiyota/registry";
import { createAnthropic } from "@kiyota/provider-anthropic";
import { createDeepSeek } from "@kiyota/provider-deepseek";
import { createGemini } from "@kiyota/provider-gemini";
import { createKimi } from "@kiyota/provider-kimi";
import { createMiniMax } from "@kiyota/provider-minimax";
import { createMistral } from "@kiyota/provider-mistral";
import { createNVIDIA } from "@kiyota/provider-nvidia";
import { createOpenAI } from "@kiyota/provider-openai";
import { createQwen } from "@kiyota/provider-qwen";
import { createXAI } from "@kiyota/provider-xai";
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
 *   anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
 * });
 *
 * const { text } = await ai.generateText({
 *   model: ai.models.openai.gpt56Terra,
 *   messages: [{ role: "user", content: "Hello!" }],
 * });
 * ```
 */
export function kiyota(config: KiyotaConfig = {}) {
  const openai = config.openai ? createOpenAI(config.openai) : undefined;
  const anthropic = config.anthropic ? createAnthropic(config.anthropic) : undefined;
  const kimi = config.kimi ? createKimi(config.kimi) : undefined;
  const deepseek = config.deepseek ? createDeepSeek(config.deepseek) : undefined;
  const mistral = config.mistral ? createMistral(config.mistral) : undefined;
  const minimax = config.minimax ? createMiniMax(config.minimax) : undefined;
  const xai = config.xai ? createXAI(config.xai) : undefined;
  const qwen = config.qwen ? createQwen(config.qwen) : undefined;
  const gemini = config.gemini ? createGemini(config.gemini) : undefined;
  const nvidia = config.nvidia ? createNVIDIA(config.nvidia) : undefined;

  const providerInstances = {
    openai,
    anthropic,
    kimi,
    deepseek,
    mistral,
    minimax,
    xai,
    qwen,
    gemini,
    nvidia,
  } as const;

  const requireProvider = <K extends keyof typeof providerInstances>(
    name: K,
  ): NonNullable<(typeof providerInstances)[K]> => {
    const provider = providerInstances[name];
    if (!provider) {
      throw new ProviderNotConfiguredError(name);
    }
    return provider;
  };

  const chatModel = (modelId: string): LanguageModelV1 => {
    const definition = resolveModel(modelId);
    requireCapability(definition, "chat");
    const provider = requireProvider(definition.provider as keyof typeof providerInstances);
    return provider.languageModel(modelId);
  };

  const embeddingModel = (modelId: string): EmbeddingModelV1 => {
    const definition = resolveModel(modelId);
    requireCapability(definition, "embedding");
    if (definition.provider !== "openai") {
      throw new ProviderNotConfiguredError(definition.provider);
    }
    return requireProvider("openai").embedding(modelId);
  };

  const toLanguageModel = (definition: ModelDefinition): LanguageModelV1 =>
    chatModel(definition.id);

  return {
    generateText,
    streamText,
    embed,
    embedMany,
    generateObject,
    streamObject,

    providers: {
      get openai() {
        return requireProvider("openai");
      },
      get anthropic() {
        return requireProvider("anthropic");
      },
      get kimi() {
        return requireProvider("kimi");
      },
      get deepseek() {
        return requireProvider("deepseek");
      },
      get mistral() {
        return requireProvider("mistral");
      },
      get minimax() {
        return requireProvider("minimax");
      },
      get xai() {
        return requireProvider("xai");
      },
      get qwen() {
        return requireProvider("qwen");
      },
      get gemini() {
        return requireProvider("gemini");
      },
      get nvidia() {
        return requireProvider("nvidia");
      },
    },

    models: {
      openai: {
        get gpt56Sol(): LanguageModelV1 {
          return chatModel("gpt-5.6-sol");
        },
        get gpt56Terra(): LanguageModelV1 {
          return chatModel("gpt-5.6-terra");
        },
        get gpt56Luna(): LanguageModelV1 {
          return chatModel("gpt-5.6-luna");
        },
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
        get claudeFable5(): LanguageModelV1 {
          return chatModel("claude-fable-5");
        },
        get claudeOpus48(): LanguageModelV1 {
          return chatModel("claude-opus-4-8");
        },
        get claudeSonnet5(): LanguageModelV1 {
          return chatModel("claude-sonnet-5");
        },
        get claudeHaiku45(): LanguageModelV1 {
          return chatModel("claude-haiku-4-5");
        },
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
      kimi: {
        get kimiK3(): LanguageModelV1 {
          return chatModel("kimi-k3");
        },
        get kimiK27Code(): LanguageModelV1 {
          return chatModel("kimi-k2.7-code");
        },
        get kimiK27CodeHighspeed(): LanguageModelV1 {
          return chatModel("kimi-k2.7-code-highspeed");
        },
        get kimiK26(): LanguageModelV1 {
          return chatModel("kimi-k2.6");
        },
        get kimiK25(): LanguageModelV1 {
          return chatModel("kimi-k2.5");
        },
      },
      deepseek: {
        get deepseekV4Flash(): LanguageModelV1 {
          return chatModel("deepseek-v4-flash");
        },
        get deepseekV4Pro(): LanguageModelV1 {
          return chatModel("deepseek-v4-pro");
        },
        get deepseekChat(): LanguageModelV1 {
          return chatModel("deepseek-chat");
        },
        get deepseekReasoner(): LanguageModelV1 {
          return chatModel("deepseek-reasoner");
        },
      },
      mistral: {
        get mistralMedium35(): LanguageModelV1 {
          return chatModel("mistral-medium-3.5");
        },
        get mistralLarge3(): LanguageModelV1 {
          return chatModel("mistral-large-3");
        },
        get mistralSmall4(): LanguageModelV1 {
          return chatModel("mistral-small-4");
        },
        get codestral2501(): LanguageModelV1 {
          return chatModel("codestral-2501");
        },
      },
      minimax: {
        get MiniMaxM3(): LanguageModelV1 {
          return chatModel("MiniMax-M3");
        },
        get MiniMaxM27(): LanguageModelV1 {
          return chatModel("MiniMax-M2.7");
        },
        get MiniMaxM27Highspeed(): LanguageModelV1 {
          return chatModel("MiniMax-M2.7-highspeed");
        },
      },
      xai: {
        get grok45(): LanguageModelV1 {
          return chatModel("grok-4.5");
        },
      },
      qwen: {
        get qwen3627b(): LanguageModelV1 {
          return chatModel("qwen3.6-27b");
        },
        get qwen38b(): LanguageModelV1 {
          return chatModel("qwen3-8b");
        },
        get qwen2514b(): LanguageModelV1 {
          return chatModel("qwen2.5-14b");
        },
        get qwen25Coder32b(): LanguageModelV1 {
          return chatModel("qwen2.5-coder-32b");
        },
        get qwen2Vl72b(): LanguageModelV1 {
          return chatModel("qwen2-vl-72b");
        },
      },
      gemini: {
        get gemini25Pro(): LanguageModelV1 {
          return chatModel("gemini-2.5-pro");
        },
        get gemini25Flash(): LanguageModelV1 {
          return chatModel("gemini-2.5-flash");
        },
        get gemini25FlashLite(): LanguageModelV1 {
          return chatModel("gemini-2.5-flash-lite");
        },
        get gemini31ProPreview(): LanguageModelV1 {
          return chatModel("gemini-3.1-pro-preview");
        },
        get gemini35Flash(): LanguageModelV1 {
          return chatModel("gemini-3.5-flash");
        },
      },
      nvidia: {
        get nemotron3Ultra550b(): LanguageModelV1 {
          return chatModel("nvidia/nemotron-3-ultra-550b");
        },
        get nemotron3Super120b(): LanguageModelV1 {
          return chatModel("nvidia/nemotron-3-super-120b");
        },
        get nemotron3Nano30b(): LanguageModelV1 {
          return chatModel("nvidia/nemotron-3-nano-30b");
        },
      },
    },

    /** List all configured provider keys. */
    listProviders(): string[] {
      return listProviders();
    },

    /** List models, optionally filtered by provider. */
    listModels(provider?: string): ModelDefinition[] {
      return provider ? listModelsByProvider(provider) : listModels();
    },

    /** Find models matching capability filters. */
    findModels,

    /** Resolve the best coding model to a language model. */
    bestCoding(options?: { provider?: string }): LanguageModelV1 {
      return toLanguageModel(bestCodingModel(options));
    },

    /** Resolve the fastest model to a language model. */
    fastest(options?: { provider?: string }): LanguageModelV1 {
      return toLanguageModel(fastestModel(options));
    },

    /** Resolve the highest reasoning model to a language model. */
    highestReasoning(options?: { provider?: string }): LanguageModelV1 {
      return toLanguageModel(highestReasoningModel(options));
    },

    /** Resolve the best vision model to a language model. */
    bestVision(options?: { provider?: string }): LanguageModelV1 {
      return toLanguageModel(bestVisionModel(options));
    },

    /** Resolve the cheapest model to a language model. */
    cheapest(options?: { provider?: string }): LanguageModelV1 {
      return toLanguageModel(cheapestModel(options));
    },

    /** Resolve the recommended model to a language model. */
    recommended(options?: { provider?: string }): LanguageModelV1 {
      return toLanguageModel(recommendedModel(options));
    },
  };
}
