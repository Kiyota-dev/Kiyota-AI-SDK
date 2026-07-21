import { describe, expect, it } from "vitest";
import { createQwen } from "../src/index.js";

describe("createQwen", () => {
  it("creates a provider with default settings", () => {
    const provider = createQwen({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("qwen3.6-27b");
    expect(model.modelId).toBe("qwen3.6-27b");
  });
});
