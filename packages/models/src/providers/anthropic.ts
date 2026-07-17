import type { ModelDefinition } from "../types.js";

const capabilities = {
  chat: true,
  streaming: true,
  vision: false,
  functionCalling: false,
  jsonMode: true,
  objectGeneration: true,
  reasoning: false,
  embedding: false,
} as const;

export const anthropicModels: Record<string, ModelDefinition> = {
  "claude-3-5-sonnet-20241022": {
    id: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic's balanced model for complex reasoning and coding.",
    capabilities: {
      ...capabilities,
      vision: true,
      functionCalling: true,
    },
    pricing: {
      inputTokensPerMillion: 3.0,
      outputTokensPerMillion: 15.0,
    },
    contextWindow: 200_000,
    maxOutputTokens: 8192,
  },
  "claude-3-5-haiku-20241022": {
    id: "claude-3-5-haiku-20241022",
    provider: "anthropic",
    name: "Claude 3.5 Haiku",
    description: "Fast, cost-effective Anthropic model for everyday tasks.",
    capabilities: {
      ...capabilities,
      vision: false,
      functionCalling: true,
    },
    pricing: {
      inputTokensPerMillion: 1.0,
      outputTokensPerMillion: 5.0,
    },
    contextWindow: 200_000,
    maxOutputTokens: 8192,
  },
  "claude-3-opus-20240229": {
    id: "claude-3-opus-20240229",
    provider: "anthropic",
    name: "Claude 3 Opus",
    description: "Anthropic's most capable model for highly complex tasks.",
    capabilities: {
      ...capabilities,
      vision: true,
      functionCalling: true,
    },
    pricing: {
      inputTokensPerMillion: 15.0,
      outputTokensPerMillion: 75.0,
    },
    contextWindow: 200_000,
    maxOutputTokens: 4096,
  },
  "claude-3-sonnet-20240229": {
    id: "claude-3-sonnet-20240229",
    provider: "anthropic",
    name: "Claude 3 Sonnet",
    description: "Previous-generation balanced Anthropic model.",
    capabilities: {
      ...capabilities,
      vision: true,
      functionCalling: true,
    },
    pricing: {
      inputTokensPerMillion: 3.0,
      outputTokensPerMillion: 15.0,
    },
    contextWindow: 200_000,
    maxOutputTokens: 4096,
  },
  "claude-3-haiku-20240307": {
    id: "claude-3-haiku-20240307",
    provider: "anthropic",
    name: "Claude 3 Haiku",
    description: "Previous-generation fast Anthropic model.",
    capabilities: {
      ...capabilities,
      vision: true,
      functionCalling: true,
    },
    pricing: {
      inputTokensPerMillion: 0.25,
      outputTokensPerMillion: 1.25,
    },
    contextWindow: 200_000,
    maxOutputTokens: 4096,
  },
};

export type AnthropicModelId = keyof typeof anthropicModels;
