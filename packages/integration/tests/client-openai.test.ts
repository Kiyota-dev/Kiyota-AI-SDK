import { AI } from "@nurovia/client";
import { MessageRole } from "@nurovia/core";
import { OpenAIProvider } from "@nurovia/provider-openai";
import type { Transport, TransportResponse } from "@nurovia/transport";
import { describe, expect, it } from "vitest";

describe("integration: AI client + OpenAI provider", () => {
  it("end-to-end chat flow", async () => {
    const transport: Transport = {
      request: async <T>() =>
        ({
          status: 200,
          headers: {},
          data: {
            id: "chatcmpl-1",
            object: "chat.completion",
            created: 1,
            model: "gpt-4o",
            choices: [
              {
                index: 0,
                message: { role: "assistant", content: "Integrated!" },
                finish_reason: "stop",
              },
            ],
            usage: {
              prompt_tokens: 1,
              completion_tokens: 1,
              total_tokens: 2,
            },
          },
        }) as TransportResponse<T>,
      stream: async function* () {
        yield { bytes: new Uint8Array(0), done: true };
      },
    };

    const ai = new AI();
    ai.register(new OpenAIProvider({ apiKey: "sk-test", transport }));

    const result = await ai.chat({
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: MessageRole.User, content: "Hi" }],
    });

    if (Symbol.asyncIterator in result) {
      throw new Error("Expected non-streaming result");
    }

    expect(result.content).toBe("Integrated!");
    expect(result.provider).toBe("openai");
  });
});
