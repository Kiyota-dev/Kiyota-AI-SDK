import type { ModelDefinition } from "../types.js";

const chatCapabilities = {
  chat: true,
  streaming: true,
  vision: false,
  functionCalling: true,
  jsonMode: true,
  objectGeneration: true,
  reasoning: false,
  embedding: false,
  structuredOutputs: true,
  supportsJSON: true,
} as const;

export const deepseekModels: Record<string, ModelDefinition> = {
  "deepseek-v4-flash": {
    id: "deepseek-v4-flash",
    provider: "deepseek",
    name: "DeepSeek V4 Flash",
    description: "Fast, cost-efficient DeepSeek V4 model for high-throughput tasks.",
    resourceType: "chat",
    family: "deepseek-v4",
    status: "active",
    capabilities: chatCapabilities,
    contextWindow: 128_000,
    maxOutputTokens: 8192,
    aliases: ["deepseek-fast"],
  },
  "deepseek-v4-pro": {
    id: "deepseek-v4-pro",
    provider: "deepseek",
    name: "DeepSeek V4 Pro",
    description: "DeepSeek V4 Pro for complex reasoning and coding tasks.",
    resourceType: "chat",
    family: "deepseek-v4",
    status: "active",
    capabilities: {
      ...chatCapabilities,
      reasoning: true,
    },
    contextWindow: 256_000,
    maxOutputTokens: 16_384,
    aliases: ["deepseek-pro"],
  },
  "deepseek-chat": {
    id: "deepseek-chat",
    provider: "deepseek",
    name: "DeepSeek Chat",
    description: "Legacy DeepSeek chat model.",
    resourceType: "chat",
    family: "deepseek-v3",
    status: "deprecated",
    capabilities: chatCapabilities,
    contextWindow: 64_000,
    maxOutputTokens: 8192,
  },
  "deepseek-reasoner": {
    id: "deepseek-reasoner",
    provider: "deepseek",
    name: "DeepSeek Reasoner",
    description: "Legacy DeepSeek reasoning model.",
    resourceType: "chat",
    family: "deepseek-v3",
    status: "deprecated",
    capabilities: {
      ...chatCapabilities,
      reasoning: true,
    },
    contextWindow: 64_000,
    maxOutputTokens: 8192,
  },
};

export type DeepSeekModelId = keyof typeof deepseekModels;
