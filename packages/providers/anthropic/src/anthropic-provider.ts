import type { LanguageModelV1 } from "@kiyota/core";
import {
  type FetchFunction,
  loadApiKey,
  loadOptionalSetting,
  withUserAgentSuffix,
  withoutTrailingSlash,
} from "@kiyota/provider-utils";
import { AnthropicChatLanguageModel } from "./chat/anthropic-chat-language-model.js";
import type { AnthropicChatModelId } from "./chat/anthropic-chat-options.js";

export interface AnthropicProviderSettings {
  apiKey?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  name?: string;
  fetch?: FetchFunction;
}

export interface AnthropicProvider {
  languageModel: (modelId: AnthropicChatModelId) => LanguageModelV1;
  chat: (modelId: AnthropicChatModelId) => LanguageModelV1;
}

export function createAnthropic(options: AnthropicProviderSettings = {}): AnthropicProvider {
  const baseURL =
    withoutTrailingSlash(
      loadOptionalSetting({
        settingValue: options.baseURL,
        environmentVariableName: "ANTHROPIC_BASE_URL",
      }),
    ) ?? "https://api.anthropic.com/v1";

  const providerName = options.name ?? "anthropic";

  const getHeaders = () =>
    withUserAgentSuffix(
      {
        "x-api-key": loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: "ANTHROPIC_API_KEY",
          description: "Anthropic",
        }),
        "anthropic-version": "2023-06-01",
        ...options.headers,
      },
      "kiyota-ai-sdk/0.2.1",
    );

  const createLanguageModel = (modelId: AnthropicChatModelId) =>
    new AnthropicChatLanguageModel(modelId, {
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
