import type { EmbeddingModelV1, LanguageModelV1 } from "@nurovia/core";
import { describe, expectTypeOf, it } from "vitest";
import { embed, embedMany, generateText, streamText } from "../src/index.js";

describe("types", () => {
  it("generateText requires a LanguageModelV1", () => {
    expectTypeOf(generateText).parameter(0).toMatchTypeOf<{
      model: LanguageModelV1;
      messages: { role: "system" | "user" | "assistant"; content: string }[];
    }>();
  });

  it("streamText requires a LanguageModelV1", () => {
    expectTypeOf(streamText).parameter(0).toMatchTypeOf<{
      model: LanguageModelV1;
      messages: { role: "system" | "user" | "assistant"; content: string }[];
    }>();
  });

  it("embed requires an EmbeddingModelV1", () => {
    expectTypeOf(embed).parameter(0).toMatchTypeOf<{
      model: EmbeddingModelV1;
      value: string;
    }>();
  });

  it("embedMany requires an EmbeddingModelV1", () => {
    expectTypeOf(embedMany).parameter(0).toMatchTypeOf<{
      model: EmbeddingModelV1;
      values: string[];
    }>();
  });
});
