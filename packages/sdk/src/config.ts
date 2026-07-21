import type { AnthropicProviderSettings } from "@kiyota/provider-anthropic";
import type { DeepSeekProviderSettings } from "@kiyota/provider-deepseek";
import type { GeminiProviderSettings } from "@kiyota/provider-gemini";
import type { KimiProviderSettings } from "@kiyota/provider-kimi";
import type { MiniMaxProviderSettings } from "@kiyota/provider-minimax";
import type { MistralProviderSettings } from "@kiyota/provider-mistral";
import type { NVIDIAProviderSettings } from "@kiyota/provider-nvidia";
import type { OpenAIProviderSettings } from "@kiyota/provider-openai";
import type { QwenProviderSettings } from "@kiyota/provider-qwen";
import type { XAIProviderSettings } from "@kiyota/provider-xai";

export interface KiyotaConfig {
  /** OpenAI provider configuration. */
  openai?: OpenAIProviderSettings;
  /** Anthropic provider configuration. */
  anthropic?: AnthropicProviderSettings;
  /** Kimi (Moonshot AI) provider configuration. */
  kimi?: KimiProviderSettings;
  /** DeepSeek provider configuration. */
  deepseek?: DeepSeekProviderSettings;
  /** Mistral provider configuration. */
  mistral?: MistralProviderSettings;
  /** MiniMax provider configuration. */
  minimax?: MiniMaxProviderSettings;
  /** xAI provider configuration. */
  xai?: XAIProviderSettings;
  /** Qwen provider configuration. */
  qwen?: QwenProviderSettings;
  /** Google Gemini provider configuration. */
  gemini?: GeminiProviderSettings;
  /** NVIDIA NIM provider configuration. */
  nvidia?: NVIDIAProviderSettings;
}
