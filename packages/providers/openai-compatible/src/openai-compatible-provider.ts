import type { LanguageModelV1 } from "@kiyota/core";
import {
  type FetchFunction,
  loadApiKey,
  loadOptionalSetting,
  withUserAgentSuffix,
  withoutTrailingSlash,
} from "@kiyota/provider-utils";
import { OpenAIChatLanguageModel } from "@kiyota/provider-openai";

export interface OpenAICompatibleProviderSettings {
  /** API key for the provider. Falls back to the provider-specific env var. */
  apiKey?: string;
  /** Base URL for the API. Defaults to the provider's public endpoint. */
  baseURL?: string;
  /** Additional headers to send with every request. */
  headers?: Record<string, string>;
  /** Provider name used in model metadata. Defaults to the package name. */
  name?: string;
  /** Custom fetch implementation. */
  fetch?: FetchFunction;
  /** OpenAI organization header, if applicable. */
  organization?: string;
  /** OpenAI project header, if applicable. */
  project?: string;
}

export interface OpenAICompatibleProvider {
  languageModel: (modelId: string) => LanguageModelV1;
  chat: (modelId: string) => LanguageModelV1;
}

/**
 * Create a provider for any OpenAI-compatible chat endpoint.
 *
 * This factory reuses the OpenAI chat implementation and allows callers to
 * override the base URL, API key, headers, and provider name. It is suitable
 * for providers such as Kimi, DeepSeek, Mistral, MiniMax, xAI, Qwen, Gemini,
 * and NVIDIA NIM.
 */
export function createOpenAICompatibleProvider(
  options: OpenAICompatibleProviderSettings = {},
): OpenAICompatibleProvider {
  const baseURL = withoutTrailingSlash(
    loadOptionalSetting({
      settingValue: options.baseURL,
      environmentVariableName: "OPENAI_COMPATIBLE_BASE_URL",
    }),
  );

  if (!baseURL) {
    throw new Error(
      "baseURL is required for an OpenAI-compatible provider. Pass it in options.baseURL or set OPENAI_COMPATIBLE_BASE_URL.",
    );
  }

  const providerName = options.name ?? "openai-compatible";

  const getHeaders = () =>
    withUserAgentSuffix(
      {
        Authorization: `Bearer ${loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: "OPENAI_COMPATIBLE_API_KEY",
          description: providerName,
        })}`,
        "OpenAI-Organization": options.organization,
        "OpenAI-Project": options.project,
        ...options.headers,
      },
      "kiyota-ai-sdk/0.3.0",
    );

  const createLanguageModel = (modelId: string) =>
    new OpenAIChatLanguageModel(modelId, {
      provider: `${providerName}.chat`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
    });

  return {
    languageModel: createLanguageModel,
    chat: createLanguageModel,
  };
}
