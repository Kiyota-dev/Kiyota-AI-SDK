import { ConfigurationError, MessageRole } from "@nurovia/core";
import type { Provider } from "@nurovia/core";
import { describe, expect, it } from "vitest";
import { AI } from "../src/index.js";

function createMockProvider(): Provider {
  return {
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
    chat: async () => ({
      content: "Hello!",
      model: "mock-model",
      provider: "mock",
    }),
    stream: async function* () {
      yield { content: "Hello!" };
    },
  };
}

describe("AI", () => {
  it("requires a provider", async () => {
    const ai = new AI();
    await expect(
      ai.chat({
        model: "mock-model",
        messages: [{ role: MessageRole.User, content: "Hi" }],
      }),
    ).rejects.toBeInstanceOf(ConfigurationError);
  });

  it("delegates chat to registered provider", async () => {
    const ai = new AI();
    ai.register(createMockProvider());

    const result = await ai.chat({
      provider: "mock",
      model: "mock-model",
      messages: [{ role: MessageRole.User, content: "Hi" }],
    });

    if (Symbol.asyncIterator in result) {
      throw new Error("Expected non-streaming result");
    }

    expect(result.content).toBe("Hello!");
    expect(result.provider).toBe("mock");
  });

  it("streams from registered provider", async () => {
    const ai = new AI();
    ai.register(createMockProvider());

    const result = await ai.chat({
      provider: "mock",
      model: "mock-model",
      messages: [{ role: MessageRole.User, content: "Hi" }],
      stream: true,
    });

    if (!(Symbol.asyncIterator in result)) {
      throw new Error("Expected streaming result");
    }

    const chunks: string[] = [];
    for await (const chunk of result) {
      chunks.push(chunk.content);
    }
    expect(chunks).toEqual(["Hello!"]);
  });

  it("resolves provider from ModelRef", async () => {
    const ai = new AI();
    ai.register(createMockProvider());

    const result = await ai.chat({
      model: { provider: "mock", model: "mock-model" },
      messages: [{ role: MessageRole.User, content: "Hi" }],
    });

    if (Symbol.asyncIterator in result) {
      throw new Error("Expected non-streaming result");
    }

    expect(result.provider).toBe("mock");
  });
});
