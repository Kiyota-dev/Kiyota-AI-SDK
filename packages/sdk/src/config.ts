import type { AnthropicProviderSettings } from "@kiyota/provider-anthropic";
import type { OpenAIProviderSettings } from "@kiyota/provider-openai";

export interface KiyotaConfig {
  /** OpenAI provider configuration. */
  openai?: OpenAIProviderSettings;
  /** Anthropic provider configuration. */
  anthropic?: AnthropicProviderSettings;
}
