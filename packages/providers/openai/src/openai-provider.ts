import {
  type FetchFunction,
  loadApiKey,
  loadOptionalSetting,
  withUserAgentSuffix,
  withoutTrailingSlash,
} from "@nurovia/provider-utils";
import { OpenAIChatLanguageModel } from "./chat/openai-chat-language-model.js";
import type { OpenAIChatModelId } from "./chat/openai-chat-options.js";
import {
  OpenAIEmbeddingModel,
  type OpenAIEmbeddingModelId,
} from "./embedding/openai-embedding-model.js";

export interface OpenAIProviderSettings {
  apiKey?: string;
  baseURL?: string;
  organization?: string;
  project?: string;
  headers?: Record<string, string>;
  name?: string;
  fetch?: FetchFunction;
}

export function createOpenAI(options: OpenAIProviderSettings = {}) {
  const baseURL =
    withoutTrailingSlash(
      loadOptionalSetting({
        settingValue: options.baseURL,
        environmentVariableName: "OPENAI_BASE_URL",
      }),
    ) ?? "https://api.openai.com/v1";

  const providerName = options.name ?? "openai";

  const getHeaders = () =>
    withUserAgentSuffix(
      {
        Authorization: `Bearer ${loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: "OPENAI_API_KEY",
          description: "OpenAI",
        })}`,
        "OpenAI-Organization": options.organization,
        "OpenAI-Project": options.project,
        ...options.headers,
      },
      "nurovia-ai-sdk/0.2.0",
    );

  const createLanguageModel = (modelId: OpenAIChatModelId) =>
    new OpenAIChatLanguageModel(modelId, {
      provider: `${providerName}.chat`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
    });

  const createEmbeddingModel = (modelId: OpenAIEmbeddingModelId) =>
    new OpenAIEmbeddingModel(modelId, {
      provider: `${providerName}.embedding`,
      url: ({ path }) => `${baseURL}${path}`,
      headers: getHeaders,
      fetch: options.fetch,
    });

  return {
    languageModel: createLanguageModel,
    chat: createLanguageModel,
    embedding: createEmbeddingModel,
  };
}
