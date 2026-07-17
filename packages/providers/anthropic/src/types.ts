export interface AnthropicErrorResponse {
  type: "error";
  error?: {
    type?: string;
    message?: string;
  };
}

export interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnthropicTextContentBlock {
  type: "text";
  text: string;
}

export interface AnthropicUsage {
  input_tokens: number;
  output_tokens: number;
}

export interface AnthropicMessageResponse {
  id: string;
  type: "message";
  role: "assistant";
  model: string;
  content: AnthropicTextContentBlock[];
  stop_reason: string | null;
  stop_sequence?: string | null;
  usage: AnthropicUsage;
}

export interface AnthropicStreamMessageStart {
  type: "message_start";
  message: AnthropicMessageResponse;
}

export interface AnthropicStreamContentBlockDelta {
  type: "content_block_delta";
  index: number;
  delta: {
    type: "text_delta";
    text: string;
  };
}

export interface AnthropicStreamMessageDelta {
  type: "message_delta";
  delta: {
    stop_reason?: string | null;
    stop_sequence?: string | null;
  };
  usage: AnthropicUsage;
}

export interface AnthropicStreamMessageStop {
  type: "message_stop";
}

export type AnthropicStreamChunk =
  | AnthropicStreamMessageStart
  | AnthropicStreamContentBlockDelta
  | AnthropicStreamMessageDelta
  | AnthropicStreamMessageStop;
