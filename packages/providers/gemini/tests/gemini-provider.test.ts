import { describe, expect, it } from "vitest";
import { createGemini } from "../src/index.js";

describe("createGemini", () => {
  it("creates a provider with default settings", () => {
    const provider = createGemini({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("gemini-2.5-pro");
    expect(model.modelId).toBe("gemini-2.5-pro");
  });
});
