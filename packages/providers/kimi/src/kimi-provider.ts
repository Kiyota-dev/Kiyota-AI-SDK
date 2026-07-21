import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type KimiProviderSettings = OpenAICompatibleProviderSettings;
export type KimiProvider = OpenAICompatibleProvider;

/** Create a Kimi (Moonshot AI) provider. */
export function createKimi(options: KimiProviderSettings = {}): KimiProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://api.moonshot.cn/v1",
    name: options.name ?? "kimi",
    ...options,
  });
}
