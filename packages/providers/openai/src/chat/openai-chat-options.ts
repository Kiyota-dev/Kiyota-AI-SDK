export type OpenAIChatModelId =
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "gpt-4"
  | "gpt-3.5-turbo"
  | (string & {});

export interface OpenAIChatSettings {
  logitBias?: Record<string, number>;
  logprobs?: boolean | number;
  parallelToolCalls?: boolean;
  reasoningEffort?: "low" | "medium" | "high";
  serviceTier?: string;
  store?: boolean;
  user?: string;
  systemMessageMode?: "system" | "developer";
  forceReasoning?: boolean;
  maxCompletionTokens?: number;
}
