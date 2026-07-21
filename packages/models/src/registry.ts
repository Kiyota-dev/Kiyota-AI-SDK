import { anthropicModels } from "./providers/anthropic.js";
import { deepseekModels } from "./providers/deepseek.js";
import { geminiModels } from "./providers/gemini.js";
import { kimiModels } from "./providers/kimi.js";
import { minimaxModels } from "./providers/minimax.js";
import { mistralModels } from "./providers/mistral.js";
import { nvidiaModels } from "./providers/nvidia.js";
import { openaiModels } from "./providers/openai.js";
import { qwenModels } from "./providers/qwen.js";
import { xaiModels } from "./providers/xai.js";
import { getModelFamily } from "./families.js";
import { getProviderCapabilities } from "./provider-capabilities.js";
import type {
  ModelCapabilities,
  ModelDefinition,
  ModelPricing,
  ModelRef,
} from "./types.js";
import { ModelNotSupportedError } from "./types.js";

export const registryVersion = 1;

export const registry: Record<string, ModelDefinition> = {
  ...openaiModels,
  ...anthropicModels,
  ...kimiModels,
  ...deepseekModels,
  ...mistralModels,
  ...minimaxModels,
  ...xaiModels,
  ...qwenModels,
  ...geminiModels,
  ...nvidiaModels,
};

/** List every registered model. */
export function listModels(): ModelDefinition[] {
  return Object.values(registry);
}

/** List models for a specific provider. */
export function listModelsByProvider(provider: string): ModelDefinition[] {
  return listModels().filter((model) => model.provider === provider);
}

/** List all registered provider keys. */
export function listProviders(): string[] {
  return [...new Set(listModels().map((model) => model.provider))].sort();
}

/** Resolve a model reference to its full definition. */
export function findModel(ref: ModelRef): ModelDefinition | undefined {
  if (typeof ref === "string") {
    return registry[ref];
  }
  return registry[ref.id] ?? undefined;
}

/** Resolve a model reference or throw a helpful error. */
export function resolveModel(ref: ModelRef): ModelDefinition {
  const model = findModel(ref);
  if (!model) {
    throw new ModelNotSupportedError(
      typeof ref === "string"
        ? `Unknown model "${ref}". Use listModels() to see supported models.`
        : `Unknown model "${ref.id}" for provider "${ref.provider}".`,
      ref,
    );
  }
  return model;
}

/** Check whether a model supports a specific capability. */
export function supports(model: ModelDefinition, capability: keyof ModelCapabilities): boolean {
  return model.capabilities[capability] === true;
}

/** Assert that a model supports a specific capability. */
export function requireCapability(
  model: ModelDefinition,
  capability: keyof ModelCapabilities,
): void {
  if (!supports(model, capability)) {
    throw new ModelNotSupportedError(`Model "${model.id}" does not support ${capability}.`, model);
  }
}

/** Estimate cost in USD for a given input/output token count. */
export function estimateCost(
  model: ModelDefinition,
  inputTokens: number,
  outputTokens: number,
  options: { cachedInputTokens?: number } = {},
): number {
  if (!model.pricing) {
    return 0;
  }

  const cached = options.cachedInputTokens ?? 0;
  const uncached = Math.max(0, inputTokens - cached);

  const inputCost = (uncached * (model.pricing.inputTokensPerMillion ?? 0)) / 1_000_000;
  const cachedInputCost =
    (cached *
      (model.pricing.cachedInputTokensPerMillion ?? model.pricing.inputTokensPerMillion ?? 0)) /
    1_000_000;
  const outputCost = (outputTokens * (model.pricing.outputTokensPerMillion ?? 0)) / 1_000_000;

  return inputCost + cachedInputCost + outputCost;
}

/** Get pricing metadata for a model. */
export function getModelPricing(modelId: string): ModelPricing | undefined {
  return registry[modelId]?.pricing;
}

/** Get capability metadata for a model. */
export function getModelCapabilities(modelId: string): ModelCapabilities | undefined {
  return registry[modelId]?.capabilities;
}

/** Get the context window size for a model. */
export function getContextWindow(modelId: string): number | undefined {
  return registry[modelId]?.contextWindow;
}

/** Get the family a model belongs to. */
export { getModelFamily };

/** Get platform-level capabilities for a provider. */
export { getProviderCapabilities };

/** Find models matching the given capability filters. */
export function findModels(filter: {
  vision?: boolean;
  reasoning?: boolean;
  tools?: boolean;
  provider?: string;
  resourceType?: string;
}): ModelDefinition[] {
  return listModels().filter((model) => {
    if (filter.provider && model.provider !== filter.provider) {
      return false;
    }
    if (filter.resourceType && model.resourceType !== filter.resourceType) {
      return false;
    }
    if (filter.vision !== undefined && model.capabilities.vision !== filter.vision) {
      return false;
    }
    if (filter.reasoning !== undefined && model.capabilities.reasoning !== filter.reasoning) {
      return false;
    }
    if (filter.tools !== undefined && model.capabilities.functionCalling !== filter.tools) {
      return false;
    }
    return true;
  });
}
