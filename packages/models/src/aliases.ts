import { findModel } from "./registry.js";
import type { ModelDefinition } from "./types.js";

/** Options for alias resolution. */
export interface AliasOptions {
  /** Restrict aliases to a specific provider. */
  provider?: string;
}

function resolveAlias(candidates: string[], options: AliasOptions = {}): ModelDefinition {
  for (const id of candidates) {
    const model = findModel(id);
    if (model && (!options.provider || model.provider === options.provider)) {
      return model;
    }
  }
  throw new Error(`No model found for alias. Candidates: ${candidates.join(", ")}`);
}

/** Best model for coding tasks. */
export function bestCoding(options: AliasOptions = {}): ModelDefinition {
  return resolveAlias(
    ["gpt-5.6-terra", "claude-opus-4-8", "qwen2.5-coder-32b", "codestral-2501"],
    options,
  );
}

/** Fastest / lowest-latency model. */
export function fastest(options: AliasOptions = {}): ModelDefinition {
  return resolveAlias(
    ["gpt-4o-mini", "gemini-2.5-flash-lite", "mistral-small-4", "deepseek-v4-flash"],
    options,
  );
}

/** Highest reasoning capability. */
export function highestReasoning(options: AliasOptions = {}): ModelDefinition {
  return resolveAlias(
    ["gpt-5.6-sol", "claude-opus-4-8", "deepseek-v4-pro", "gemini-2.5-pro"],
    options,
  );
}

/** Best model for vision tasks. */
export function bestVision(options: AliasOptions = {}): ModelDefinition {
  return resolveAlias(
    ["gpt-5.6-sol", "gemini-2.5-pro", "claude-opus-4-8", "qwen2-vl-72b"],
    options,
  );
}

/** Cheapest capable model. */
export function cheapest(options: AliasOptions = {}): ModelDefinition {
  return resolveAlias(
    ["gpt-4o-mini", "deepseek-v4-flash", "mistral-small-4", "gemini-2.5-flash-lite"],
    options,
  );
}

/** Recommended balanced model. */
export function recommended(options: AliasOptions = {}): ModelDefinition {
  return resolveAlias(
    ["gpt-5.6-terra", "claude-sonnet-5", "gemini-2.5-flash", "kimi-k3"],
    options,
  );
}
