import { describe, expect, it } from "vitest";
import { createMistral } from "../src/index.js";

describe("createMistral", () => {
  it("creates a provider with default settings", () => {
    const provider = createMistral({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("mistral-large-3");
    expect(model.modelId).toBe("mistral-large-3");
  });
});
