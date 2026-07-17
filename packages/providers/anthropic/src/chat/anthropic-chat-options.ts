export type AnthropicChatModelId =
  | "claude-3-5-sonnet-20241022"
  | "claude-3-5-haiku-20241022"
  | "claude-3-opus-20240229"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307"
  | (string & {});

export interface AnthropicChatSettings {
  /** A custom top-k sampling value. */
  topK?: number;
  /** A custom user ID for tracking. */
  metadata?: Record<string, unknown>;
}
