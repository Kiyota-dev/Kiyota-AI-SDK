import type { ProviderCapabilities } from "./types.js";

export const providerCapabilities: Record<string, ProviderCapabilities> = {
  openai: {
    provider: "openai",
    responsesApi: true,
    realtimeApi: true,
    batchApi: true,
    promptCaching: true,
  },
  anthropic: {
    provider: "anthropic",
    promptCaching: true,
    extendedThinking: true,
  },
  gemini: {
    provider: "gemini",
    filesApi: true,
    grounding: true,
    safetySettings: true,
  },
  kimi: {
    provider: "kimi",
  },
  deepseek: {
    provider: "deepseek",
    promptCaching: true,
  },
  mistral: {
    provider: "mistral",
  },
  minimax: {
    provider: "minimax",
  },
  xai: {
    provider: "xai",
  },
  qwen: {
    provider: "qwen",
  },
  nvidia: {
    provider: "nvidia",
  },
};

/** Get platform-level capabilities for a provider. */
export function getProviderCapabilities(provider: string): ProviderCapabilities | undefined {
  return providerCapabilities[provider];
}
