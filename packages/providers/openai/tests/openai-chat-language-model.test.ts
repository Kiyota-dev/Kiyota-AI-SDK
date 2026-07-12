import { describe, expect, it } from "vitest";
import { createOpenAI } from "../src/index.js";

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("OpenAIChatLanguageModel", () => {
  it("generates text", async () => {
    const fetch = async () =>
      createResponse({
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
      });

    const openai = createOpenAI({ apiKey: "sk-test", fetch });
    const model = openai.languageModel("gpt-4o");

    const result = await model.doGenerate({
      prompt: [{ role: "user", content: [{ type: "text", text: "Hi" }] }],
    });

    expect(result.text).toBe("Hello!");
    expect(result.finishReason).toBe("stop");
    expect(result.usage).toEqual({
      promptTokens: 1,
      completionTokens: 2,
      totalTokens: 3,
    });
    expect(result.response?.modelId).toBe("gpt-4o");
  });

  it("streams text", async () => {
    const encoder = new TextEncoder();
    const fetch = async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                'data: {"id":"1","object":"chat.completion.chunk","created":1,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}\n\n',
              ),
            );
            controller.enqueue(
              encoder.encode(
                'data: {"id":"1","object":"chat.completion.chunk","created":1,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":"stop"}]}\n\n',
              ),
            );
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          },
        }),
        {
          headers: { "content-type": "text/event-stream" },
        },
      );

    const openai = createOpenAI({ apiKey: "sk-test", fetch });
    const model = openai.languageModel("gpt-4o");

    const { stream } = await model.doStream({
      prompt: [{ role: "user", content: [{ type: "text", text: "Hi" }] }],
    });

    const chunks: string[] = [];
    for await (const part of stream) {
      if (part.type === "text") chunks.push(part.text);
    }

    expect(chunks).toEqual(["Hello", "!"]);
  });

  it("emits unsupported warnings for topK", async () => {
    const fetch = async () =>
      createResponse({
        id: "chatcmpl-1",
        object: "chat.completion",
        created: 1,
        model: "gpt-4o",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "" },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      });

    const openai = createOpenAI({ apiKey: "sk-test", fetch });
    const model = openai.languageModel("gpt-4o");

    const result = await model.doGenerate({
      prompt: [{ role: "user", content: [{ type: "text", text: "Hi" }] }],
      topK: 5,
    });

    expect(result.warnings).toEqual([
      {
        type: "unsupported",
        feature: "topK",
        details: "OpenAI does not support topK sampling.",
      },
    ]);
  });

  it("aborts on signal", async () => {
    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.signal?.aborted) {
        throw new Error("AbortError");
      }
      return createResponse({
        id: "chatcmpl-1",
        object: "chat.completion",
        created: 1,
        model: "gpt-4o",
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: "" },
            finish_reason: "stop",
          },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      });
    };

    const openai = createOpenAI({ apiKey: "sk-test", fetch });
    const model = openai.languageModel("gpt-4o");

    const controller = new AbortController();
    controller.abort();

    await expect(
      model.doGenerate({
        prompt: [{ role: "user", content: [{ type: "text", text: "Hi" }] }],
        abortSignal: controller.signal,
      }),
    ).rejects.toThrow();
  });
});
