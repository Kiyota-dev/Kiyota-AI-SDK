import { describe, expect, it } from "vitest";
import { createNVIDIA } from "../src/index.js";

describe("createNVIDIA", () => {
  it("creates a provider with default settings", () => {
    const provider = createNVIDIA({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("nvidia/nemotron-3-ultra-550b");
    expect(model.modelId).toBe("nvidia/nemotron-3-ultra-550b");
  });
});
