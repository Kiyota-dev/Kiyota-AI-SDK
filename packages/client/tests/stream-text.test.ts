import { describe, expect, it } from "vitest";
import { streamText } from "../src/generate-text/stream-text.js";
import { createMockLanguageModel } from "./mock-model.js";

describe("streamText", () => {
  it("streams text deltas and resolves final result", async () => {
    const model = createMockLanguageModel(
      async () => ({
        text: "Hello, world!",
        finishReason: "stop",
        usage: { promptTokens: 1, completionTokens: 3, totalTokens: 4 },
      }),
      async function* () {
        yield { type: "text" as const, text: "Hello" };
        yield { type: "text" as const, text: ", world!" };
        yield {
          type: "finish" as const,
          finishReason: "stop",
          usage: { promptTokens: 1, completionTokens: 3, totalTokens: 4 },
        };
      },
    );

    const { textStream, text, finishReason, usage } = await streamText({
      model,
      messages: [{ role: "user", content: "Hi" }],
    });

    const deltas: string[] = [];
    for await (const delta of textStream) {
      deltas.push(delta);
    }

    expect(deltas).toEqual(["Hello", ", world!"]);
    expect(await text).toBe("Hello, world!");
    expect(await finishReason).toBe("stop");
    expect(await usage).toEqual({
      promptTokens: 1,
      completionTokens: 3,
      totalTokens: 4,
    });
  });
});
