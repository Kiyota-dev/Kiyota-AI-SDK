import { describe, expect, it } from "vitest";
import { createOpenAICompatibleProvider } from "../src/index.js";

describe("createOpenAICompatibleProvider", () => {
  it("returns languageModel and chat factories", () => {
    const provider = createOpenAICompatibleProvider({
      baseURL: "https://api.example.com/v1",
      apiKey: "test-key",
    });
    expect(typeof provider.languageModel).toBe("function");
    expect(typeof provider.chat).toBe("function");
  });

  it("creates a language model instance", () => {
    const provider = createOpenAICompatibleProvider({
      baseURL: "https://api.example.com/v1",
      apiKey: "test-key",
    });
    const model = provider.languageModel("test-model");
    expect(model).toBeDefined();
    expect(model.modelId).toBe("test-model");
  });

  it("throws when baseURL is missing", () => {
    expect(() => createOpenAICompatibleProvider({ apiKey: "test-key" })).toThrow(
      /baseURL is required/,
    );
  });
});
