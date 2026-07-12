export type LanguageModelV1StreamPart =
  | { type: "text"; text: string }
  | { type: "reasoning"; reasoning: string }
  | {
      type: "tool-call";
      toolCallId: string;
      toolName: string;
      args: string;
    }
  | { type: "tool-call-result"; toolCallId: string; result: unknown }
  | {
      type: "finish";
      finishReason:
        | "stop"
        | "length"
        | "content-filter"
        | "tool-calls"
        | "error"
        | "other"
        | string;
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
    }
  | { type: "error"; error: unknown };
