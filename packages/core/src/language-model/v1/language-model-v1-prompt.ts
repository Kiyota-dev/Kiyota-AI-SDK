export type JSONSchema7 = {
  type?: "string" | "number" | "integer" | "boolean" | "object" | "array" | "null" | string;
  properties?: Record<string, JSONSchema7>;
  required?: string[];
  items?: JSONSchema7 | JSONSchema7[];
  enum?: unknown[];
  description?: string;
  additionalProperties?: boolean | JSONSchema7;
  $ref?: string;
  anyOf?: JSONSchema7[];
  allOf?: JSONSchema7[];
  oneOf?: JSONSchema7[];
};

export type LanguageModelV1TextPart = {
  type: "text";
  text: string;
};

export type LanguageModelV1ImagePart = {
  type: "image";
  image: string | Uint8Array;
  mimeType?: string;
};

export type LanguageModelV1ToolCallPart = {
  type: "tool-call";
  toolCallId: string;
  toolName: string;
  args: unknown;
};

export type LanguageModelV1ToolResultPart = {
  type: "tool-result";
  toolCallId: string;
  toolName: string;
  result: unknown;
};

export type LanguageModelV1UserContentPart = LanguageModelV1TextPart | LanguageModelV1ImagePart;

export type LanguageModelV1AssistantContentPart =
  | LanguageModelV1TextPart
  | LanguageModelV1ToolCallPart;

export type LanguageModelV1Message =
  | {
      role: "system";
      content: string;
    }
  | {
      role: "user";
      content: LanguageModelV1UserContentPart[];
    }
  | {
      role: "assistant";
      content: LanguageModelV1AssistantContentPart[];
    }
  | {
      role: "tool";
      content: LanguageModelV1ToolResultPart[];
    };

export type LanguageModelV1Prompt = LanguageModelV1Message[];

export type LanguageModelV1Tool = {
  type: "function";
  name: string;
  description?: string;
  parameters: JSONSchema7;
};

export type LanguageModelV1ToolChoice =
  | "auto"
  | "required"
  | "none"
  | { type: "tool"; toolName: string };

export type LanguageModelV1ResponseFormat =
  | { type: "text" }
  | { type: "json"; schema?: JSONSchema7; name?: string; description?: string };
