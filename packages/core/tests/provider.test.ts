import { describe, expect, it } from "vitest";
import type { Provider, ProviderCapabilities } from "../src/index.js";
import { MessageRole } from "../src/index.js";

describe("Provider contract", () => {
  it("roles are constants", () => {
    expect(MessageRole.User).toBe("user");
    expect(MessageRole.Assistant).toBe("assistant");
    expect(MessageRole.System).toBe("system");
  });

  it("provider shape can be implemented", async () => {
    const capabilities = (): ProviderCapabilities => ({
      streaming: true,
      functionCalling: false,
      vision: false,
      jsonMode: false,
      systemMessages: true,
      maxTokens: false,
    });

    const provider: Provider = {
      id: "mock",
      name: "Mock Provider",
      version: "0.1.0",
      capabilities,
      chat: async () => ({
        content: "hello",
        model: "mock-model",
        provider: "mock",
      }),
      stream: async function* () {
        yield { content: "hello" };
      },
    };

    expect(provider.id).toBe("mock");
    expect(provider.capabilities().streaming).toBe(true);

    const result = await provider.chat({
      model: "mock-model",
      messages: [{ role: MessageRole.User, content: "hi" }],
    });
    expect(result.content).toBe("hello");

    const chunks: string[] = [];
    for await (const chunk of provider.stream({
      model: "mock-model",
      messages: [{ role: MessageRole.User, content: "hi" }],
    })) {
      chunks.push(chunk.content);
    }
    expect(chunks).toEqual(["hello"]);
  });
});
