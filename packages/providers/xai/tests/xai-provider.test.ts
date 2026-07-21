import { describe, expect, it } from "vitest";
import { createXAI } from "../src/index.js";

describe("createXAI", () => {
  it("creates a provider with default settings", () => {
    const provider = createXAI({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("grok-4.5");
    expect(model.modelId).toBe("grok-4.5");
  });
});
