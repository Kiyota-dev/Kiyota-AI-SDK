import { describe, expect, it } from "vitest";
import { createKimi } from "../src/index.js";

describe("createKimi", () => {
  it("creates a provider with default settings", () => {
    const provider = createKimi({ apiKey: "test" });
    expect(typeof provider.languageModel).toBe("function");
    const model = provider.languageModel("kimi-k3");
    expect(model.modelId).toBe("kimi-k3");
  });
});
