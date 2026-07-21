import { describe, expect, it } from "vitest";
import { createDeepSeek } from "../src/index.js";

describe("createDeepSeek", () => {
  it("creates a provider with default settings", () => {
    const provider = createDeepSeek({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("deepseek-v4-flash");
    expect(model.modelId).toBe("deepseek-v4-flash");
  });
});
