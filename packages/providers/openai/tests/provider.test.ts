import { ProviderError } from "@nurovia/core";
import { describe, expect, it } from "vitest";
import { OpenAIProvider } from "../src/index.js";

describe("OpenAIProvider", () => {
  it("requires an API key", () => {
    expect(() => new OpenAIProvider({ apiKey: "" })).toThrow(ProviderError);
  });

  it("exposes identity and capabilities", () => {
    const provider = new OpenAIProvider({ apiKey: "sk-test" });
    expect(provider.id).toBe("openai");
    expect(provider.name).toBe("OpenAI");
    expect(provider.version).toBe("0.1.0");
    expect(provider.capabilities()).toEqual({
      streaming: true,
      functionCalling: false,
      vision: false,
      jsonMode: false,
      systemMessages: true,
      maxTokens: true,
    });
  });
});
