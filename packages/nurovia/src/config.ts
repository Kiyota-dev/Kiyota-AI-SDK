import type { OpenAIProviderSettings } from "@nurovia/provider-openai";

export interface NuroviaConfig {
  /** OpenAI provider configuration. */
  openai?: OpenAIProviderSettings;
}
