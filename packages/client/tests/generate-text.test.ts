import { describe, expect, it } from "vitest";
import { generateText } from "../src/generate-text/generate-text.js";
import { createMockLanguageModel } from "./mock-model.js";

describe("generateText", () => {
  it("returns generated text and usage", async () => {
    const model = createMockLanguageModel(async () => ({
      text: "Hello, world!",
      finishReason: "stop",
      usage: { promptTokens: 3, completionTokens: 5, totalTokens: 8 },
    }));

    const result = await generateText({
      model,
      messages: [{ role: "user", content: "Hi" }],
    });

    expect(result.text).toBe("Hello, world!");
    expect(result.finishReason).toBe("stop");
    expect(result.usage).toEqual({
      promptTokens: 3,
      completionTokens: 5,
      totalTokens: 8,
    });
  });

  it("passes options to the model", async () => {
    let received: unknown;

    const model = createMockLanguageModel(async (options) => {
      received = options;
      return {
        text: "ok",
        finishReason: "stop",
        usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
      };
    });

    await generateText({
      model,
      messages: [
        { role: "system", content: "You are helpful" },
        { role: "user", content: "Hi" },
      ],
      maxTokens: 100,
      temperature: 0.5,
      topP: 0.9,
    });

    expect(received).toMatchObject({
      prompt: [
        { role: "system", content: "You are helpful" },
        { role: "user", content: [{ type: "text", text: "Hi" }] },
      ],
      maxOutputTokens: 100,
      temperature: 0.5,
      topP: 0.9,
    });
  });
});
