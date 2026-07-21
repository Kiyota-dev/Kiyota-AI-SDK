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
    expect(ai.models.openai.gpt56Sol.modelId).toBe("gpt-5.6-sol");
    expect(ai.models.openai.gpt56Terra.modelId).toBe("gpt-5.6-terra");
    expect(ai.models.openai.gpt56Luna.modelId).toBe("gpt-5.6-luna");
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

  it("supports all new providers", () => {
    const ai = kiyota({
      kimi: { apiKey: "test" },
      deepseek: { apiKey: "test" },
      mistral: { apiKey: "test" },
      minimax: { apiKey: "test" },
      xai: { apiKey: "test" },
      qwen: { apiKey: "test" },
      gemini: { apiKey: "test" },
      nvidia: { apiKey: "test" },
    });

    expect(ai.models.kimi.kimiK3.modelId).toBe("kimi-k3");
    expect(ai.models.deepseek.deepseekV4Flash.modelId).toBe("deepseek-v4-flash");
    expect(ai.models.mistral.mistralLarge3.modelId).toBe("mistral-large-3");
    expect(ai.models.minimax.MiniMaxM3.modelId).toBe("MiniMax-M3");
    expect(ai.models.xai.grok45.modelId).toBe("grok-4.5");
    expect(ai.models.qwen.qwen3627b.modelId).toBe("qwen3.6-27b");
    expect(ai.models.gemini.gemini25Pro.modelId).toBe("gemini-2.5-pro");
    expect(ai.models.nvidia.nemotron3Ultra550b.modelId).toBe("nvidia/nemotron-3-ultra-550b");
  });

  it("exposes discovery APIs", () => {
    const ai = kiyota({ openai: { apiKey: "test-key" } });

    expect(ai.listProviders()).toContain("openai");
    expect(ai.listProviders()).toContain("anthropic");
    expect(ai.listModels().length).toBeGreaterThan(50);
    expect(ai.listModels("openai").every((m) => m.provider === "openai")).toBe(true);
    expect(ai.findModels({ vision: true }).length).toBeGreaterThan(0);
  });

  it("exposes model aliases", () => {
    const ai = kiyota({ openai: { apiKey: "test-key" } });

    expect(ai.bestCoding()).toBeDefined();
    expect(ai.fastest()).toBeDefined();
    expect(ai.highestReasoning()).toBeDefined();
    expect(ai.bestVision()).toBeDefined();
    expect(ai.cheapest()).toBeDefined();
    expect(ai.recommended()).toBeDefined();
  });
});
