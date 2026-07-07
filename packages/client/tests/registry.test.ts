import { describe, expect, it } from "vitest";
import { ProviderRegistry } from "../src/index.js";

describe("ProviderRegistry", () => {
  it("registers and retrieves providers", () => {
    const registry = new ProviderRegistry();
    const provider = {
      id: "mock",
      name: "Mock",
      version: "0.1.0",
      capabilities: () => ({
        streaming: true,
        functionCalling: false,
        vision: false,
        jsonMode: false,
        systemMessages: true,
        maxTokens: false,
      }),
      chat: async () => ({ content: "", model: "", provider: "mock" }),
      stream: async function* () {},
    };

    registry.register("mock", provider);
    expect(registry.get("mock")).toBe(provider);
    expect(registry.list()).toEqual(["mock"]);
  });

  it("throws for unregistered providers", () => {
    const registry = new ProviderRegistry();
    expect(() => registry.get("missing")).toThrow('Provider "missing" is not registered');
  });
});
