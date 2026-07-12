export * from "./ai.js";
export * from "./registry.js";
export * from "./config.js";

// v0.2.0 model-first AI functions
export * from "./generate-text/generate-text.js";
export * from "./generate-text/stream-text.js";
export * from "./embed/embed.js";
export * from "./embed/embed-many.js";
export * from "./generate-object/generate-object.js";
export * from "./generate-object/stream-object.js";

// Re-export core model specs for convenience
export type {
  LanguageModelV1,
  EmbeddingModelV1,
  LanguageModelV1GenerateResult,
  LanguageModelV1StreamResult,
  LanguageModelV1StreamPart,
  LanguageModelV1Usage,
  Warning,
} from "@nurovia/core";
