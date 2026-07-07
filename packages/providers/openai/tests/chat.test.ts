import { MessageRole } from "@nurovia/core";
import type { Transport, TransportResponse } from "@nurovia/transport";
import { describe, expect, it } from "vitest";
import { OpenAIChat } from "../src/index.js";

describe("OpenAIChat", () => {
  it("returns normalized chat result", async () => {
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
                message: { role: "assistant", content: "Hello!" },
                finish_reason: "stop",
              },
            ],
            usage: {
              prompt_tokens: 1,
              completion_tokens: 2,
              total_tokens: 3,
            },
          },
        }) as TransportResponse<T>,
      stream: async function* () {
        yield { bytes: new Uint8Array(0), done: true };
      },
    };

    const chat = new OpenAIChat({ apiKey: "sk-test", transport });
    const result = await chat.chat({
      model: "gpt-4o",
      messages: [{ role: MessageRole.User, content: "Hi" }],
    });

    expect(result.content).toBe("Hello!");
    expect(result.model).toBe("gpt-4o");
    expect(result.provider).toBe("openai");
    expect(result.finishReason).toBe("stop");
    expect(result.usage).toEqual({ prompt: 1, completion: 2, total: 3 });
  });

  it("streams normalized chunks", async () => {
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
            'data: {"id":"1","object":"chat.completion.chunk","created":1,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}\n\n',
          ),
          done: false,
        };
        yield {
          bytes: encoder.encode("data: [DONE]\n\n"),
          done: false,
        };
      },
    };

    const chat = new OpenAIChat({ apiKey: "sk-test", transport });
    const chunks: string[] = [];
    for await (const chunk of chat.stream({
      model: "gpt-4o",
      messages: [{ role: MessageRole.User, content: "Hi" }],
    })) {
      chunks.push(chunk.content);
    }

    expect(chunks).toEqual(["Hello"]);
  });
});
