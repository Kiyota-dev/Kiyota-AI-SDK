import type { OpenAIProviderSettings } from "@kiyota/provider-openai";

export interface KiyotaConfig {
  /** OpenAI provider configuration. */
  openai?: OpenAIProviderSettings;
}
