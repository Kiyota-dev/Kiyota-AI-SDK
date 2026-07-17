export type {
  ModelCapabilities,
  ModelDefinition,
  ModelPricing,
  ModelRef,
} from "./types.js";
export { ModelNotSupportedError } from "./types.js";
export {
  registry,
  listModels,
  listModelsByProvider,
  findModel,
  resolveModel,
  supports,
  requireCapability,
  estimateCost,
} from "./registry.js";
export { openaiModels } from "./providers/openai.js";
export type { OpenAIModelId } from "./providers/openai.js";

import { openaiModels } from "./providers/openai.js";

/**
 * Convenience accessors for known models.
 *
 * @example
 * ```ts
 * import { models } from "@kiyota/models";
 *
 * const model = models.openai.gpt4o;
 * console.log(model.capabilities.vision); // true
 * ```
 */
export const models = {
  openai: {
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
};
