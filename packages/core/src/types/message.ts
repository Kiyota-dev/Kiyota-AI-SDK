import type { MessageRole } from "../constants/roles.js";

export interface Message {
  role: MessageRole;
  content: string;
}

export interface SystemMessage extends Message {
  role: "system";
}

export interface UserMessage extends Message {
  role: "user";
}

export interface AssistantMessage extends Message {
  role: "assistant";
}
