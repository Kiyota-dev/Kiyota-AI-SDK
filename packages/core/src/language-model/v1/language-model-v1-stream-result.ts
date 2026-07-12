import type { LanguageModelV1StreamPart } from "./language-model-v1-stream-part.js";

export interface LanguageModelV1StreamResult {
  stream: AsyncIterable<LanguageModelV1StreamPart>;
}
