import { describe, expect, it } from "vitest";
import { createAnthropic } from "../src/index.js";

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("AnthropicChatLanguageModel", () => {
  it("generates text", async () => {
    const fetch = async () =>
      createResponse({
        id: "msg-1",
        type: "message",
        role: "assistant",
        model: "claude-3-5-sonnet-20241022",
        content: [{ type: "text", text: "Hello!" }],
        stop_reason: "end_turn",
        usage: { input_tokens: 1, output_tokens: 2 },
      });

    const anthropic = createAnthropic({ apiKey: "sk-test", fetch });
    const model = anthropic.languageModel("claude-3-5-sonnet-20241022");

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
    expect(result.response?.modelId).toBe("claude-3-5-sonnet-20241022");
  });

  it("streams text", async () => {
    const encoder = new TextEncoder();
    const fetch = async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(
              encoder.encode(
                'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}\n\n',
              ),
            );
            controller.enqueue(
              encoder.encode(
                'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"!"}}\n\n',
              ),
            );
            controller.enqueue(
              encoder.encode(
                'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"input_tokens":1,"output_tokens":2}}\n\n',
              ),
            );
            controller.enqueue(
              encoder.encode('event: message_stop\ndata: {"type":"message_stop"}\n\n'),
            );
            controller.close();
          },
        }),
        {
          headers: { "content-type": "text/event-stream" },
        },
      );

    const anthropic = createAnthropic({ apiKey: "sk-test", fetch });
    const model = anthropic.languageModel("claude-3-5-sonnet-20241022");

    const { stream } = await model.doStream({
      prompt: [{ role: "user", content: [{ type: "text", text: "Hi" }] }],
    });

    const chunks: string[] = [];
    for await (const part of stream) {
      if (part.type === "text") chunks.push(part.text);
    }

    expect(chunks).toEqual(["Hello", "!"]);
  });

  it("emits unsupported warnings for tools", async () => {
    const fetch = async () =>
      createResponse({
        id: "msg-1",
        type: "message",
        role: "assistant",
        model: "claude-3-5-sonnet-20241022",
        content: [{ type: "text", text: "" }],
        stop_reason: "end_turn",
        usage: { input_tokens: 1, output_tokens: 1 },
      });

    const anthropic = createAnthropic({ apiKey: "sk-test", fetch });
    const model = anthropic.languageModel("claude-3-5-sonnet-20241022");

    const result = await model.doGenerate({
      prompt: [{ role: "user", content: [{ type: "text", text: "Hi" }] }],
      tools: [{ type: "function", name: "test", parameters: { type: "object" } }],
    });

    expect(result.warnings).toEqual([
      {
        type: "unsupported",
        feature: "tools",
        details: "Tool calling is not yet supported for Anthropic in v0.2.1.",
      },
    ]);
  });

  it("sends the anthropic-version header", async () => {
    let capturedHeaders: Record<string, string> = {};

    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      headers.forEach((value, key) => {
        capturedHeaders[key] = value;
      });
      return createResponse({
        id: "msg-1",
        type: "message",
        role: "assistant",
        model: "claude-3-5-sonnet-20241022",
        content: [{ type: "text", text: "" }],
        stop_reason: "end_turn",
        usage: { input_tokens: 1, output_tokens: 1 },
      });
    };

    const anthropic = createAnthropic({ apiKey: "sk-test", fetch });
    const model = anthropic.languageModel("claude-3-5-sonnet-20241022");

    await model.doGenerate({
      prompt: [{ role: "user", content: [{ type: "text", text: "Hi" }] }],
    });

    expect(capturedHeaders["anthropic-version"]).toBe("2023-06-01");
    expect(capturedHeaders["x-api-key"]).toBe("sk-test");
  });
});
