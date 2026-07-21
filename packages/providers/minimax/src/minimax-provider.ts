import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type MiniMaxProviderSettings = OpenAICompatibleProviderSettings;
export type MiniMaxProvider = OpenAICompatibleProvider;

/** Create a MiniMax provider. */
export function createMiniMax(options: MiniMaxProviderSettings = {}): MiniMaxProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://api.minimax.chat/v1",
    name: options.name ?? "minimax",
    ...options,
  });
}
