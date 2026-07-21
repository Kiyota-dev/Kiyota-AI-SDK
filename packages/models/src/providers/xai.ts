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

export const xaiModels: Record<string, ModelDefinition> = {
  "grok-4.5": {
    id: "grok-4.5",
    provider: "xai",
    name: "Grok 4.5",
    description: "xAI's Grok 4.5 model for reasoning and real-time information tasks.",
    resourceType: "chat",
    family: "grok-4",
    status: "active",
    capabilities: {
      ...chatCapabilities,
      vision: true,
      reasoning: true,
    },
    contextWindow: 256_000,
    maxOutputTokens: 16_384,
    aliases: ["grok-latest"],
  },
};

export type XAIModelId = keyof typeof xaiModels;
