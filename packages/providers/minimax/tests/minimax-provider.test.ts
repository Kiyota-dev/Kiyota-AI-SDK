import { describe, expect, it } from "vitest";
import { createMiniMax } from "../src/index.js";

describe("createMiniMax", () => {
  it("creates a provider with default settings", () => {
    const provider = createMiniMax({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("MiniMax-M3");
    expect(model.modelId).toBe("MiniMax-M3");
  });
});
