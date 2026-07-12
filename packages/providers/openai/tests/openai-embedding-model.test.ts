import { describe, expect, it } from "vitest";
import { createOpenAI } from "../src/index.js";

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("OpenAIEmbeddingModel", () => {
  it("returns embeddings in input order", async () => {
    const fetch = async () =>
      createResponse({
        data: [
          { index: 1, embedding: [0.2, 0.3] },
          { index: 0, embedding: [0.0, 0.1] },
        ],
        usage: { prompt_tokens: 4, total_tokens: 4 },
      });

    const openai = createOpenAI({ apiKey: "sk-test", fetch });
    const model = openai.embedding("text-embedding-3-small");

    const result = await model.doEmbed({ values: ["a", "b"] });

    expect(result.embeddings).toEqual([
      [0.0, 0.1],
      [0.2, 0.3],
    ]);
    expect(result.usage).toEqual({ tokens: 4 });
  });
});
