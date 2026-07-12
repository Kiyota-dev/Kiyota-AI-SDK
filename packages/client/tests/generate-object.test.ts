import { describe, expect, it } from "vitest";
import { generateObject } from "../src/generate-object/generate-object.js";
import { createMockLanguageModel } from "./mock-model.js";

describe("generateObject", () => {
  it("parses JSON output", async () => {
    const model = createMockLanguageModel(async () => ({
      text: '{"name":"Nurovia","version":2}',
      finishReason: "stop",
      usage: { promptTokens: 5, completionTokens: 8, totalTokens: 13 },
    }));

    const result = await generateObject<{ name: string; version: number }>({
      model,
      messages: [{ role: "user", content: "Give me JSON" }],
    });

    expect(result.object).toEqual({ name: "Nurovia", version: 2 });
    expect(result.usage).toEqual({
      promptTokens: 5,
      completionTokens: 8,
      totalTokens: 13,
    });
  });

  it("validates with a schema", async () => {
    const model = createMockLanguageModel(async () => ({
      text: '{"value":42}',
      finishReason: "stop",
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
    }));

    const result = await generateObject({
      model,
      messages: [{ role: "user", content: "Number" }],
      schema: {
        parse: (value) => {
          if (
            value != null &&
            typeof value === "object" &&
            "value" in value &&
            typeof value.value === "number"
          ) {
            return value as { value: number };
          }
          throw new Error("Invalid schema");
        },
      },
    });

    expect(result.object).toEqual({ value: 42 });
  });
});
