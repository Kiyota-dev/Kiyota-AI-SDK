export type AIResourceType =
  | "chat"
  | "embedding"
  | "image"
  | "audio"
  | "video"
  | "moderation"
  | "reranking"
  | "ocr";

export type ModelStatus = "active" | "deprecated" | "preview";

export interface ModelCapabilities {
  /** Supports chat/completion requests. */
  chat: boolean;
  /** Supports streaming responses. */
  streaming: boolean;
  /** Supports image/video input. */
  vision: boolean;
  /** Supports tool/function calling. */
  functionCalling: boolean;
  /** Supports constrained JSON output. */
  jsonMode: boolean;
  /** Supports structured object generation via schemas. */
  objectGeneration: boolean;
  /** Supports reasoning / chain-of-thought modes. */
  reasoning: boolean;
  /** Supports text embeddings. */
  embedding: boolean;
  /** Supports audio input or output. */
  audio?: boolean;
  /** Supports image generation. */
  imageGeneration?: boolean;
  /** Supports video generation or understanding. */
  video?: boolean;
  /** Supports provider-native structured outputs. */
  structuredOutputs?: boolean;
  /** Supports strict JSON schema outputs. */
  supportsJSON?: boolean;
}

export interface ModelPricing {
  /** Input token cost in USD per 1 million tokens. */
  inputTokensPerMillion: number;
  /** Output token cost in USD per 1 million tokens. */
  outputTokensPerMillion: number;
  /** Cached/prompt token cost in USD per 1 million tokens, if available. */
  cachedInputTokensPerMillion?: number;
}

export interface ModelFamily {
  /** Stable family identifier, e.g. "gpt-5.6". */
  id: string;
  /** Human-readable family name, e.g. "GPT-5.6". */
  name: string;
  /** Provider key, e.g. "openai". */
  provider: string;
  /** Model IDs that belong to this family. */
  modelIds: string[];
}

export interface ProviderCapabilities {
  /** Provider key, e.g. "openai". */
  provider: string;
  /** Supports the OpenAI Responses API. */
  responsesApi?: boolean;
  /** Supports realtime/streaming APIs. */
  realtimeApi?: boolean;
  /** Supports batch inference. */
  batchApi?: boolean;
  /** Supports file upload/management APIs. */
  filesApi?: boolean;
  /** Supports grounding/retrieval-augmented generation. */
  grounding?: boolean;
  /** Supports configurable safety settings. */
  safetySettings?: boolean;
  /** Supports prompt caching. */
  promptCaching?: boolean;
  /** Supports extended thinking / reasoning traces. */
  extendedThinking?: boolean;
}

export interface ModelDefinition {
  /** Provider-specific model ID used in API calls. */
  id: string;
  /** Provider key, e.g. "openai". */
  provider: string;
  /** Human-readable display name. */
  name: string;
  /** Short description of the model. */
  description?: string;
  /** High-level resource type. */
  resourceType: AIResourceType;
  /** Optional family identifier. */
  family?: string;
  /** Lifecycle status. */
  status: ModelStatus;
  /** Capability flags. */
  capabilities: ModelCapabilities;
  /** Approximate pricing. Prices change; verify with the provider. */
  pricing?: ModelPricing;
  /** Context window in tokens. */
  contextWindow?: number;
  /** Maximum output tokens the model supports. */
  maxOutputTokens?: number;
  /** Alternative names or shorthand aliases. */
  aliases?: string[];
}

export type ModelRef =
  | string
  | {
      provider: string;
      id: string;
    };

export class ModelNotSupportedError extends Error {
  constructor(
    message: string,
    public readonly model?: ModelDefinition | ModelRef,
  ) {
    super(message);
    this.name = "ModelNotSupportedError";
  }
}
