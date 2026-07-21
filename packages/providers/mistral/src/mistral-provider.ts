import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type MistralProviderSettings = OpenAICompatibleProviderSettings;
export type MistralProvider = OpenAICompatibleProvider;

/** Create a Mistral provider. */
export function createMistral(options: MistralProviderSettings = {}): MistralProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://api.mistral.ai/v1",
    name: options.name ?? "mistral",
    ...options,
  });
}
