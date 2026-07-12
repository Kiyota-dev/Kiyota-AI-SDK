import type { LanguageModelV1Prompt } from "@nurovia/core";

export interface SimpleMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function convertToLanguageModelPrompt(messages: SimpleMessage[]): LanguageModelV1Prompt {
  return messages.map((message): LanguageModelV1Prompt[number] => {
    if (message.role === "system") {
      return { role: "system", content: message.content };
    }

    if (message.role === "assistant") {
      return {
        role: "assistant",
        content: [{ type: "text", text: message.content }],
      };
    }

    return {
      role: "user",
      content: [{ type: "text", text: message.content }],
    };
  });
}
