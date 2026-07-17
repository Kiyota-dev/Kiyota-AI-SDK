# Migrating from v0.1 to v0.2

Kiyota AI SDK v0.2.0 introduces a model-first architecture inspired by the
Vercel AI SDK. Instead of registering providers on an `AI` instance and calling
`ai.chat(...)`, you now create a model object and pass it directly to an AI
function.

The old registry-based API is still available in v0.2.0 but prints a runtime
deprecation warning and will be removed in v0.3.0.

## Before (v0.1.0)

```typescript
import { AI } from "@kiyota/client";
import { OpenAIProvider } from "@kiyota/provider-openai";

const ai = new AI({ logger: console });

ai.register(
  new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

const result = await ai.chat({
  provider: "openai",
  model: "gpt-4o",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(result.content);
```

## After (v0.2.0)

```typescript
import { generateText } from "@kiyota/client";
import { createOpenAI } from "@kiyota/provider-openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { text } = await generateText({
  model: openai.languageModel("gpt-4o"),
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(text);
```

## What changed

- `new AI()` and `ai.register(...)` are deprecated.
- Provider factories such as `createOpenAI` return model objects.
- AI functions (`generateText`, `streamText`, `embed`, `embedMany`,
  `generateObject`, `streamObject`) accept a `model` and options.
- `OpenAIProvider` is replaced by `createOpenAI`.
- `@kiyota/provider-utils` is the shared utility layer for building providers.
- Zod is optional; use the `@kiyota/provider-utils/zod` subpath export.

## Provider factory methods

| Model type | Factory method |
|------------|----------------|
| Chat / text | `openai.languageModel(modelId)` |
| Embeddings | `openai.embedding(modelId)` |

## Migrating streaming

```typescript
import { streamText } from "@kiyota/client";

const { textStream, text } = await streamText({
  model: openai.languageModel("gpt-4o"),
  messages: [{ role: "user", content: "Tell me a story" }],
});

for await (const delta of textStream) {
  process.stdout.write(delta);
}

console.log("\nFull text:", await text);
```

## Migrating embeddings

```typescript
import { embed, embedMany } from "@kiyota/client";

const { embedding } = await embed({
  model: openai.embedding("text-embedding-3-small"),
  value: "hello",
});

const { embeddings } = await embedMany({
  model: openai.embedding("text-embedding-3-small"),
  values: ["hello", "world"],
});
```

## What's not included yet

The following features are planned for v0.3.0:

- Image generation
- Speech / audio transcription
- Vision
- Memory
- Router / caching
- Plugins

## Need help?

Open an issue on GitHub or refer to the [README](../README.md) for the latest
examples.
