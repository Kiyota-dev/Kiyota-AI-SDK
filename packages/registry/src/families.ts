import type { ModelFamily } from "./types.js";

export const modelFamilies: Record<string, ModelFamily> = {
  "gpt-5.6": {
    id: "gpt-5.6",
    name: "GPT-5.6",
    provider: "openai",
    modelIds: ["gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna"],
  },
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    modelIds: ["gpt-4o", "gpt-4o-mini"],
  },
  "gpt-4": {
    id: "gpt-4",
    name: "GPT-4",
    provider: "openai",
    modelIds: ["gpt-4", "gpt-4-turbo"],
  },
  "claude-5": {
    id: "claude-5",
    name: "Claude 5",
    provider: "anthropic",
    modelIds: ["claude-fable-5", "claude-opus-4-8", "claude-sonnet-5", "claude-haiku-4-5"],
  },
  "claude-3": {
    id: "claude-3",
    name: "Claude 3",
    provider: "anthropic",
    modelIds: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ],
  },
  "kimi-k3": {
    id: "kimi-k3",
    name: "Kimi K3",
    provider: "kimi",
    modelIds: ["kimi-k3"],
  },
  "kimi-k2.7": {
    id: "kimi-k2.7",
    name: "Kimi K2.7",
    provider: "kimi",
    modelIds: ["kimi-k2.7-code", "kimi-k2.7-code-highspeed"],
  },
  "deepseek-v4": {
    id: "deepseek-v4",
    name: "DeepSeek V4",
    provider: "deepseek",
    modelIds: ["deepseek-v4-flash", "deepseek-v4-pro"],
  },
  "mistral-medium": {
    id: "mistral-medium",
    name: "Mistral Medium",
    provider: "mistral",
    modelIds: ["mistral-medium-3.5"],
  },
  "mistral-large": {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "mistral",
    modelIds: ["mistral-large-3"],
  },
  "mistral-small": {
    id: "mistral-small",
    name: "Mistral Small",
    provider: "mistral",
    modelIds: ["mistral-small-4"],
  },
  "minimax-m3": {
    id: "minimax-m3",
    name: "MiniMax M3",
    provider: "minimax",
    modelIds: ["MiniMax-M3"],
  },
  "minimax-m2.7": {
    id: "minimax-m2.7",
    name: "MiniMax M2.7",
    provider: "minimax",
    modelIds: ["MiniMax-M2.7", "MiniMax-M2.7-highspeed"],
  },
  "grok-4": {
    id: "grok-4",
    name: "Grok 4",
    provider: "xai",
    modelIds: ["grok-4.5"],
  },
  qwen3: {
    id: "qwen3",
    name: "Qwen 3",
    provider: "qwen",
    modelIds: [
      "qwen3-0.6b",
      "qwen3-1.7b",
      "qwen3-4b",
      "qwen3-8b",
      "qwen3-14b",
      "qwen3-32b",
    ],
  },
  "qwen2.5": {
    id: "qwen2.5",
    name: "Qwen 2.5",
    provider: "qwen",
    modelIds: [
      "qwen2.5-0.5b",
      "qwen2.5-1.5b",
      "qwen2.5-3b",
      "qwen2.5-7b",
      "qwen2.5-14b",
      "qwen2.5-32b",
      "qwen2.5-72b",
    ],
  },
  "qwen2.5-coder": {
    id: "qwen2.5-coder",
    name: "Qwen 2.5 Coder",
    provider: "qwen",
    modelIds: [
      "qwen2.5-coder-1.5b",
      "qwen2.5-coder-7b",
      "qwen2.5-coder-14b",
      "qwen2.5-coder-32b",
    ],
  },
  "qwen2-vl": {
    id: "qwen2-vl",
    name: "Qwen 2 VL",
    provider: "qwen",
    modelIds: ["qwen2-vl-2b", "qwen2-vl-7b", "qwen2-vl-72b"],
  },
  "gemini-2.5": {
    id: "gemini-2.5",
    name: "Gemini 2.5",
    provider: "gemini",
    modelIds: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite"],
  },
  "gemini-3": {
    id: "gemini-3",
    name: "Gemini 3",
    provider: "gemini",
    modelIds: [
      "gemini-3.1-pro-preview",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-3-flash-preview",
    ],
  },
  "nemotron-3": {
    id: "nemotron-3",
    name: "Nemotron 3",
    provider: "nvidia",
    modelIds: [
      "nvidia/nemotron-3-ultra-550b",
      "nvidia/nemotron-3-super-120b",
      "nvidia/nemotron-3-nano-30b",
    ],
  },
};

/** Get the family a model belongs to. */
export function getModelFamily(modelId: string): ModelFamily | undefined {
  return Object.values(modelFamilies).find((family) => family.modelIds.includes(modelId));
}
