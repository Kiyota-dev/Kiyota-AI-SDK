export type {
  AIResourceType,
  ModelCapabilities,
  ModelDefinition,
  ModelFamily,
  ModelPricing,
  ModelRef,
  ModelStatus,
  ProviderCapabilities,
} from "./types.js";
export { ModelNotSupportedError } from "./types.js";
export {
  registry,
  registryVersion,
  listModels,
  listModelsByProvider,
  listProviders,
  findModel,
  resolveModel,
  supports,
  requireCapability,
  estimateCost,
  getModelPricing,
  getModelCapabilities,
  getContextWindow,
  getModelFamily,
  getProviderCapabilities,
  findModels,
} from "./registry.js";
export { openaiModels } from "./providers/openai.js";
export type { OpenAIModelId } from "./providers/openai.js";
export { anthropicModels } from "./providers/anthropic.js";
export type { AnthropicModelId } from "./providers/anthropic.js";
export { kimiModels } from "./providers/kimi.js";
export type { KimiModelId } from "./providers/kimi.js";
export { deepseekModels } from "./providers/deepseek.js";
export type { DeepSeekModelId } from "./providers/deepseek.js";
export { mistralModels } from "./providers/mistral.js";
export type { MistralModelId } from "./providers/mistral.js";
export { minimaxModels } from "./providers/minimax.js";
export type { MiniMaxModelId } from "./providers/minimax.js";
export { xaiModels } from "./providers/xai.js";
export type { XAIModelId } from "./providers/xai.js";
export { qwenModels } from "./providers/qwen.js";
export type { QwenModelId } from "./providers/qwen.js";
export { geminiModels } from "./providers/gemini.js";
export type { GeminiModelId } from "./providers/gemini.js";
export { nvidiaModels } from "./providers/nvidia.js";
export type { NVIDIAModelId } from "./providers/nvidia.js";
export { modelFamilies } from "./families.js";
export { providerCapabilities } from "./provider-capabilities.js";
export {
  bestCoding,
  fastest,
  highestReasoning,
  bestVision,
  cheapest,
  recommended,
} from "./aliases.js";

import { anthropicModels } from "./providers/anthropic.js";
import { deepseekModels } from "./providers/deepseek.js";
import { geminiModels } from "./providers/gemini.js";
import { kimiModels } from "./providers/kimi.js";
import { minimaxModels } from "./providers/minimax.js";
import { mistralModels } from "./providers/mistral.js";
import { nvidiaModels } from "./providers/nvidia.js";
import { openaiModels } from "./providers/openai.js";
import { qwenModels } from "./providers/qwen.js";
import { xaiModels } from "./providers/xai.js";

/**
 * Convenience accessors for known models.
 *
 * @example
 * ```ts
 * import { models } from "@kiyota/models";
 *
 * const model = models.openai.gpt56Sol;
 * console.log(model.capabilities.vision); // true
 * ```
 */
export const models = {
  openai: {
    get gpt56Sol() {
      return openaiModels["gpt-5.6-sol"];
    },
    get gpt56Terra() {
      return openaiModels["gpt-5.6-terra"];
    },
    get gpt56Luna() {
      return openaiModels["gpt-5.6-luna"];
    },
    get gpt4o() {
      return openaiModels["gpt-4o"];
    },
    get gpt4oMini() {
      return openaiModels["gpt-4o-mini"];
    },
    get gpt4Turbo() {
      return openaiModels["gpt-4-turbo"];
    },
    get gpt4() {
      return openaiModels["gpt-4"];
    },
    get gpt35Turbo() {
      return openaiModels["gpt-3.5-turbo"];
    },
    get o1() {
      return openaiModels.o1;
    },
    get o3Mini() {
      return openaiModels["o3-mini"];
    },
    get textEmbedding3Small() {
      return openaiModels["text-embedding-3-small"];
    },
    get textEmbedding3Large() {
      return openaiModels["text-embedding-3-large"];
    },
    get textEmbeddingAda002() {
      return openaiModels["text-embedding-ada-002"];
    },
  },
  anthropic: {
    get claudeFable5() {
      return anthropicModels["claude-fable-5"];
    },
    get claudeOpus48() {
      return anthropicModels["claude-opus-4-8"];
    },
    get claudeSonnet5() {
      return anthropicModels["claude-sonnet-5"];
    },
    get claudeHaiku45() {
      return anthropicModels["claude-haiku-4-5"];
    },
    get claude35Sonnet() {
      return anthropicModels["claude-3-5-sonnet-20241022"];
    },
    get claude35Haiku() {
      return anthropicModels["claude-3-5-haiku-20241022"];
    },
    get claude3Opus() {
      return anthropicModels["claude-3-opus-20240229"];
    },
    get claude3Sonnet() {
      return anthropicModels["claude-3-sonnet-20240229"];
    },
    get claude3Haiku() {
      return anthropicModels["claude-3-haiku-20240307"];
    },
  },
  kimi: {
    get kimiK3() {
      return kimiModels["kimi-k3"];
    },
    get kimiK27Code() {
      return kimiModels["kimi-k2.7-code"];
    },
    get kimiK27CodeHighspeed() {
      return kimiModels["kimi-k2.7-code-highspeed"];
    },
    get kimiK26() {
      return kimiModels["kimi-k2.6"];
    },
    get kimiK25() {
      return kimiModels["kimi-k2.5"];
    },
  },
  deepseek: {
    get deepseekV4Flash() {
      return deepseekModels["deepseek-v4-flash"];
    },
    get deepseekV4Pro() {
      return deepseekModels["deepseek-v4-pro"];
    },
    get deepseekChat() {
      return deepseekModels["deepseek-chat"];
    },
    get deepseekReasoner() {
      return deepseekModels["deepseek-reasoner"];
    },
  },
  mistral: {
    get mistralMedium35() {
      return mistralModels["mistral-medium-3.5"];
    },
    get mistralLarge3() {
      return mistralModels["mistral-large-3"];
    },
    get mistralSmall4() {
      return mistralModels["mistral-small-4"];
    },
    get codestral2501() {
      return mistralModels["codestral-2501"];
    },
  },
  minimax: {
    get MiniMaxM3() {
      return minimaxModels["MiniMax-M3"];
    },
    get MiniMaxM27() {
      return minimaxModels["MiniMax-M2.7"];
    },
    get MiniMaxM27Highspeed() {
      return minimaxModels["MiniMax-M2.7-highspeed"];
    },
  },
  xai: {
    get grok45() {
      return xaiModels["grok-4.5"];
    },
  },
  qwen: {
    get qwen3627b() {
      return qwenModels["qwen3.6-27b"];
    },
    get qwen38b() {
      return qwenModels["qwen3-8b"];
    },
    get qwen2514b() {
      return qwenModels["qwen2.5-14b"];
    },
    get qwen25Coder32b() {
      return qwenModels["qwen2.5-coder-32b"];
    },
    get qwen2Vl72b() {
      return qwenModels["qwen2-vl-72b"];
    },
  },
  gemini: {
    get gemini25Pro() {
      return geminiModels["gemini-2.5-pro"];
    },
    get gemini25Flash() {
      return geminiModels["gemini-2.5-flash"];
    },
    get gemini25FlashLite() {
      return geminiModels["gemini-2.5-flash-lite"];
    },
    get gemini31ProPreview() {
      return geminiModels["gemini-3.1-pro-preview"];
    },
    get gemini35Flash() {
      return geminiModels["gemini-3.5-flash"];
    },
  },
  nvidia: {
    get nemotron3Ultra550b() {
      return nvidiaModels["nvidia/nemotron-3-ultra-550b"];
    },
    get nemotron3Super120b() {
      return nvidiaModels["nvidia/nemotron-3-super-120b"];
    },
    get nemotron3Nano30b() {
      return nvidiaModels["nvidia/nemotron-3-nano-30b"];
    },
  },
};
