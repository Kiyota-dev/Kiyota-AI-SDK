import type { LanguageModelV1CallOptions } from "./language-model-v1-call-options.js";
import type { LanguageModelV1Capabilities } from "./language-model-v1-capabilities.js";
import type { LanguageModelV1GenerateResult } from "./language-model-v1-generate-result.js";
import type { LanguageModelV1StreamResult } from "./language-model-v1-stream-result.js";

export interface LanguageModelV1 {
  readonly specificationVersion: "v1";
  readonly provider: string;
  readonly modelId: string;
  readonly defaultObjectGenerationMode?: "json" | "tool" | "undefined";
  readonly capabilities?: LanguageModelV1Capabilities;

  doGenerate(options: LanguageModelV1CallOptions): Promise<LanguageModelV1GenerateResult>;
  doStream(options: LanguageModelV1CallOptions): Promise<LanguageModelV1StreamResult>;
}
