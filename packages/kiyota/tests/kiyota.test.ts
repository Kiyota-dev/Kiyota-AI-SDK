import { describe, expect, it } from "vitest";
import { kiyota } from "../src/index.js";

describe("kiyota", () => {
  it("throws when accessing models without configuring the provider", () => {
    const ai = kiyota();
    expect(() => ai.models.openai.gpt4o).toThrow(/Provider "openai" is not configured/);
  });

  it("returns language models when openai is configured", () => {
    const ai = kiyota({ openai: { apiKey: "test-key" } });

    expect(ai.models.openai.gpt4o.modelId).toBe("gpt-4o");
    expect(ai.models.openai.gpt4oMini.modelId).toBe("gpt-4o-mini");
    expect(ai.models.openai.gpt4Turbo.modelId).toBe("gpt-4-turbo");
  });

  it("returns embedding models when openai is configured", () => {
    const ai = kiyota({ openai: { apiKey: "test-key" } });

    expect(ai.models.openai.textEmbedding3Small.modelId).toBe("text-embedding-3-small");
    expect(ai.models.openai.textEmbedding3Large.modelId).toBe("text-embedding-3-large");
  });

  it("exposes provider factories", () => {
    const ai = kiyota({ openai: { apiKey: "test-key" } });

    expect(typeof ai.providers.openai.languageModel).toBe("function");
    expect(typeof ai.providers.openai.embedding).toBe("function");
  });

  it("re-exports AI functions", () => {
    const ai = kiyota({ openai: { apiKey: "test-key" } });

    expect(typeof ai.generateText).toBe("function");
    expect(typeof ai.streamText).toBe("function");
    expect(typeof ai.embed).toBe("function");
    expect(typeof ai.embedMany).toBe("function");
    expect(typeof ai.generateObject).toBe("function");
    expect(typeof ai.streamObject).toBe("function");
  });
});
