import { describe, expect, it } from "vitest";
import {
  bestCoding,
  findModel,
  findModels,
  getContextWindow,
  getModelCapabilities,
  getModelFamily,
  getModelPricing,
  getProviderCapabilities,
  listModels,
  listModelsByProvider,
  listProviders,
  recommended,
} from "../src/index.js";

describe("AI Resource Registry", () => {
  it("lists models from all providers", () => {
    const models = listModels();
    expect(models.length).toBeGreaterThan(50);
    const providers = listProviders();
    expect(providers).toContain("openai");
    expect(providers).toContain("anthropic");
    expect(providers).toContain("kimi");
    expect(providers).toContain("deepseek");
    expect(providers).toContain("mistral");
    expect(providers).toContain("minimax");
    expect(providers).toContain("xai");
    expect(providers).toContain("qwen");
    expect(providers).toContain("gemini");
    expect(providers).toContain("nvidia");
  });

  it("finds a model by id", () => {
    const model = findModel("gpt-5.6-sol");
    expect(model).toBeDefined();
    expect(model?.provider).toBe("openai");
    expect(model?.capabilities.vision).toBe(true);
  });

  it("gets model capabilities", () => {
    const caps = getModelCapabilities("gpt-5.6-sol");
    expect(caps?.chat).toBe(true);
    expect(caps?.reasoning).toBe(true);
  });

  it("gets model pricing", () => {
    const pricing = getModelPricing("gpt-4o-mini");
    expect(pricing?.inputTokensPerMillion).toBe(0.15);
  });

  it("gets context window", () => {
    expect(getContextWindow("gpt-5.6-sol")).toBe(256_000);
  });

  it("gets model family", () => {
    const family = getModelFamily("gpt-5.6-sol");
    expect(family?.name).toBe("GPT-5.6");
    expect(family?.modelIds).toContain("gpt-5.6-sol");
  });

  it("gets provider capabilities", () => {
    const caps = getProviderCapabilities("openai");
    expect(caps?.responsesApi).toBe(true);
    expect(caps?.batchApi).toBe(true);
  });

  it("filters models by capability", () => {
    const visionModels = findModels({ vision: true });
    expect(visionModels.length).toBeGreaterThan(0);
    expect(visionModels.every((m) => m.capabilities.vision)).toBe(true);
  });

  it("filters models by provider", () => {
    const openaiModels = listModelsByProvider("openai");
    expect(openaiModels.length).toBeGreaterThan(0);
    expect(openaiModels.every((m) => m.provider === "openai")).toBe(true);
  });

  it("resolves aliases", () => {
    expect(bestCoding()).toBeDefined();
    expect(recommended()).toBeDefined();
    expect(bestCoding({ provider: "anthropic" }).provider).toBe("anthropic");
  });
});
