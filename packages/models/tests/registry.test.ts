import { describe, expect, it } from "vitest";
import {
  estimateCost,
  findModel,
  listModels,
  listModelsByProvider,
  models,
  requireCapability,
  resolveModel,
  supports,
} from "../src/index.js";

describe("model registry", () => {
  it("contains openai models", () => {
    expect(models.openai.gpt4o.id).toBe("gpt-4o");
    expect(models.openai.gpt4o.provider).toBe("openai");
    expect(models.openai.gpt4o.capabilities.chat).toBe(true);
    expect(models.openai.gpt4o.capabilities.embedding).toBe(false);
  });

  it("lists all models", () => {
    const all = listModels();
    expect(all.length).toBeGreaterThan(0);
    expect(all.some((m) => m.id === "gpt-4o")).toBe(true);
    expect(all.some((m) => m.id === "text-embedding-3-small")).toBe(true);
  });

  it("filters by provider", () => {
    const openai = listModelsByProvider("openai");
    expect(openai.length).toBeGreaterThan(0);
    expect(openai.every((m) => m.provider === "openai")).toBe(true);
  });

  it("finds models by string id", () => {
    expect(findModel("gpt-4o")?.id).toBe("gpt-4o");
    expect(findModel("unknown-model")).toBeUndefined();
  });

  it("finds models by ref", () => {
    expect(findModel({ provider: "openai", id: "gpt-4o" })?.id).toBe("gpt-4o");
  });

  it("resolves or throws", () => {
    expect(resolveModel("gpt-4o").id).toBe("gpt-4o");
    expect(() => resolveModel("unknown")).toThrow(/Unknown model/);
  });

  it("checks capabilities", () => {
    expect(supports(models.openai.gpt4o, "vision")).toBe(true);
    expect(supports(models.openai.textEmbedding3Small, "chat")).toBe(false);
    expect(supports(models.openai.textEmbedding3Small, "embedding")).toBe(true);
  });

  it("requires capabilities", () => {
    expect(() => requireCapability(models.openai.textEmbedding3Small, "chat")).toThrow(
      /does not support chat/,
    );
  });

  it("estimates cost", () => {
    const cost = estimateCost(models.openai.gpt4o, 1_000_000, 500_000);
    expect(cost).toBe(7.5); // 2.5 input + 5 output
  });

  it("estimates cost with cached tokens", () => {
    const cost = estimateCost(models.openai.gpt4o, 1_000_000, 0, {
      cachedInputTokens: 1_000_000,
    });
    expect(cost).toBe(1.25);
  });
});
