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
}

export interface ModelPricing {
  /** Input token cost in USD per 1 million tokens. */
  inputTokensPerMillion: number;
  /** Output token cost in USD per 1 million tokens. */
  outputTokensPerMillion: number;
  /** Cached/prompt token cost in USD per 1 million tokens, if available. */
  cachedInputTokensPerMillion?: number;
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
  /** Capability flags. */
  capabilities: ModelCapabilities;
  /** Approximate pricing. Prices change; verify with the provider. */
  pricing?: ModelPricing;
  /** Context window in tokens. */
  contextWindow?: number;
  /** Maximum output tokens the model supports. */
  maxOutputTokens?: number;
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
