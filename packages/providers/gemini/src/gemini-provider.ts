import {
  createOpenAICompatibleProvider,
  type OpenAICompatibleProvider,
  type OpenAICompatibleProviderSettings,
} from "@kiyota/provider-openai-compatible";

export type GeminiProviderSettings = OpenAICompatibleProviderSettings;
export type GeminiProvider = OpenAICompatibleProvider;

/** Create a Google Gemini provider (OpenAI-compatible mode). */
export function createGemini(options: GeminiProviderSettings = {}): GeminiProvider {
  return createOpenAICompatibleProvider({
    baseURL: options.baseURL ?? "https://generativelanguage.googleapis.com/v1beta/openai/",
    name: options.name ?? "gemini",
    ...options,
  });
}
