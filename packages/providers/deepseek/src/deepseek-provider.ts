import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type DeepSeekProviderSettings = OpenAICompatibleProviderSettings;
export type DeepSeekProvider = OpenAICompatibleProvider;

/** Create a DeepSeek provider. */
export function createDeepSeek(options: DeepSeekProviderSettings = {}): DeepSeekProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://api.deepseek.com/v1",
    name: options.name ?? "deepseek",
    ...options,
  });
}
