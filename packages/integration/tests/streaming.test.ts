import { AI } from "@nurovia/client";
import { MessageRole } from "@nurovia/core";
import { OpenAIProvider } from "@nurovia/provider-openai";
import type { Transport, TransportResponse } from "@nurovia/transport";
import { describe, expect, it } from "vitest";

describe("integration: streaming", () => {
  it("end-to-end streaming flow", async () => {
    const encoder = new TextEncoder();
    const transport: Transport = {
      request: async <T>() =>
        ({
          status: 200,
          headers: {},
          data: {},
        }) as TransportResponse<T>,
      stream: async function* () {
        yield {
          bytes: encoder.encode(
            'data: {"id":"1","object":"chat.completion.chunk","created":1,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Streaming"},"finish_reason":null}]}\n\n',
          ),
          done: false,
        };
        yield {
          bytes: encoder.encode("data: [DONE]\n\n"),
          done: false,
        };
      },
    };

    const ai = new AI();
    ai.register(new OpenAIProvider({ apiKey: "sk-test", transport }));

    const result = await ai.chat({
      provider: "openai",
      model: "gpt-4o",
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

    expect(chunks).toEqual(["Streaming"]);
  });
});
