import { describe, expect, it } from "vitest";
import { normalizeChatResult, normalizeStreamChunk } from "../src/index.js";

describe("normalizer", () => {
  it("normalizes chat result", () => {
    const result = normalizeChatResult({
      content: "hello",
      model: "gpt-4o",
      provider: "openai",
      usage: { prompt: 1, completion: 2, total: 3 },
      finishReason: "stop",
    });

    expect(result).toEqual({
      content: "hello",
      model: "gpt-4o",
      provider: "openai",
      usage: { prompt: 1, completion: 2, total: 3 },
      finishReason: "stop",
    });
  });

  it("normalizes stream chunk", () => {
    const chunk = normalizeStreamChunk({
      content: "hello",
      model: "gpt-4o",
      provider: "openai",
      finishReason: "stop",
    });

    expect(chunk).toEqual({
      content: "hello",
      model: "gpt-4o",
      provider: "openai",
      finishReason: "stop",
    });
  });
});
