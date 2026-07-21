import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type XAIProviderSettings = OpenAICompatibleProviderSettings;
export type XAIProvider = OpenAICompatibleProvider;

/** Create an xAI provider. */
export function createXAI(options: XAIProviderSettings = {}): XAIProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://api.x.ai/v1",
    name: options.name ?? "xai",
    ...options,
  });
}
