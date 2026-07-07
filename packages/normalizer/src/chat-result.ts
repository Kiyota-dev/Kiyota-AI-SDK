import type { ChatResult, TokenUsage } from "@nurovia/core";

export interface ChatResultInput {
  content: string;
  model: string;
  provider: string;
  usage?: TokenUsage;
  finishReason?: string;
}

export function normalizeChatResult(input: ChatResultInput): ChatResult {
  return {
    content: input.content,
    model: input.model,
    provider: input.provider,
    usage: input.usage,
    finishReason: input.finishReason,
  };
}
