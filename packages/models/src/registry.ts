import { openaiModels } from "./providers/openai.js";
import type { ModelCapabilities, ModelDefinition, ModelRef } from "./types.js";
import { ModelNotSupportedError } from "./types.js";

export const registry: Record<string, ModelDefinition> = {
  ...openaiModels,
};

/** List every registered model. */
export function listModels(): ModelDefinition[] {
  return Object.values(registry);
}

/** List models for a specific provider. */
export function listModelsByProvider(provider: string): ModelDefinition[] {
  return listModels().filter((model) => model.provider === provider);
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
