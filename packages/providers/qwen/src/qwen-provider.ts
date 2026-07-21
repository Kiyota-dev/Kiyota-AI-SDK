import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type QwenProviderSettings = OpenAICompatibleProviderSettings;
export type QwenProvider = OpenAICompatibleProvider;

/** Create a Qwen provider. */
export function createQwen(options: QwenProviderSettings = {}): QwenProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1",
    name: options.name ?? "qwen",
    ...options,
  });
}
