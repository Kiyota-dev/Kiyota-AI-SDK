import { describe, expect, it } from "vitest";
import { createAnthropic } from "../src/index.js";

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("Anthropic provider contract", () => {
  it("exposes LanguageModelV1 shape", () => {
    const anthropic = createAnthropic({ apiKey: "test" });
    const model = anthropic.languageModel("claude-3-5-sonnet-20241022");

    expect(model.specificationVersion).toBe("v1");
    expect(model.modelId).toBe("claude-3-5-sonnet-20241022");
    expect(model.provider).toBe("anthropic.chat");
    expect(model.doGenerate).toBeInstanceOf(Function);
    expect(model.doStream).toBeInstanceOf(Function);
  });

  it("matches snapshot for a simple generate call", async () => {
    const fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = JSON.parse((init?.body as string) ?? "{}") as Record<string, unknown>;

      expect(body).toMatchSnapshot("anthropic-request-body");

      return createResponse({
        id: "msg-snapshot",
        type: "message",
        role: "assistant",
        model: "claude-3-5-sonnet-20241022",
        content: [{ type: "text", text: "Snapshot response" }],
        stop_reason: "end_turn",
        usage: { input_tokens: 2, output_tokens: 3 },
      });
    };

    const anthropic = createAnthropic({ apiKey: "test", fetch });
    const model = anthropic.languageModel("claude-3-5-sonnet-20241022");

    const result = await model.doGenerate({
      prompt: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: [{ type: "text", text: "Hello" }] },
      ],
      temperature: 0.5,
      maxOutputTokens: 100,
    });

    expect(result).toMatchSnapshot("anthropic-generate-result");
  });
});
