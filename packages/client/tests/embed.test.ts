import { describe, expect, it } from "vitest";
import { embed, embedMany } from "../src/embed/index.js";
import { createMockEmbeddingModel } from "./mock-model.js";

describe("embed", () => {
  it("returns a single embedding", async () => {
    const model = createMockEmbeddingModel(async (values) => ({
      embeddings: values.map((_, index) => [index, index + 1]),
      usage: { tokens: values.length * 2 },
    }));

    const result = await embed({ model, value: "hello" });

    expect(result.embedding).toEqual([0, 1]);
    expect(result.usage).toEqual({ tokens: 2 });
  });
});

describe("embedMany", () => {
  it("returns embeddings for multiple values", async () => {
    const model = createMockEmbeddingModel(async (values) => ({
      embeddings: values.map((_, index) => [index, index + 1, index + 2]),
      usage: { tokens: values.length * 3 },
    }));

    const result = await embedMany({ model, values: ["a", "b"] });

    expect(result.embeddings).toEqual([
      [0, 1, 2],
      [1, 2, 3],
    ]);
    expect(result.usage).toEqual({ tokens: 6 });
  });
});
