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

export const nvidiaModels: Record<string, ModelDefinition> = {
  "nvidia/nemotron-3-ultra-550b": {
    id: "nvidia/nemotron-3-ultra-550b",
    provider: "nvidia",
    name: "Nemotron 3 Ultra 550B",
    description: "NVIDIA's largest Nemotron 3 model for complex reasoning.",
    resourceType: "chat",
    family: "nemotron-3",
    status: "active",
    capabilities: {
      ...chatCapabilities,
      reasoning: true,
    },
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
  },
  "nvidia/nemotron-3-super-120b": {
    id: "nvidia/nemotron-3-super-120b",
    provider: "nvidia",
    name: "Nemotron 3 Super 120B",
    description: "NVIDIA Nemotron 3 Super model for general-purpose reasoning.",
    resourceType: "chat",
    family: "nemotron-3",
    status: "active",
    capabilities: {
      ...chatCapabilities,
      reasoning: true,
    },
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
  },
  "nvidia/nemotron-3-nano-30b": {
    id: "nvidia/nemotron-3-nano-30b",
    provider: "nvidia",
    name: "Nemotron 3 Nano 30B",
    description: "Compact Nemotron 3 model for edge and low-latency tasks.",
    resourceType: "chat",
    family: "nemotron-3",
    status: "active",
    capabilities: chatCapabilities,
    contextWindow: 128_000,
    maxOutputTokens: 8192,
  },
  "nvidia/llama-3.1-nemotron-ultra-253b": {
    id: "nvidia/llama-3.1-nemotron-ultra-253b",
    provider: "nvidia",
    name: "Llama 3.1 Nemotron Ultra 253B",
    description: "NVIDIA-tuned Llama 3.1 Nemotron Ultra model.",
    resourceType: "chat",
    family: "llama-nemotron",
    status: "active",
    capabilities: {
      ...chatCapabilities,
      reasoning: true,
    },
    contextWindow: 128_000,
    maxOutputTokens: 16_384,
  },
  "nvidia/llama-3.3-nemotron-super-49b": {
    id: "nvidia/llama-3.3-nemotron-super-49b",
    provider: "nvidia",
    name: "Llama 3.3 Nemotron Super 49B",
    description: "NVIDIA-tuned Llama 3.3 Nemotron Super model.",
    resourceType: "chat",
    family: "llama-nemotron",
    status: "active",
    capabilities: chatCapabilities,
    contextWindow: 128_000,
    maxOutputTokens: 8192,
  },
};

export type NVIDIAModelId = keyof typeof nvidiaModels;
