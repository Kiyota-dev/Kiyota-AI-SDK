# Nurovia AI SDK

A provider-agnostic AI runtime for building AI applications with a single,
unified API.

## Vision

Build once. Run on every AI model.

## Installation

```bash
npm install @nurovia/client @nurovia/provider-openai
```

## Quickstart (v0.2.0 model-first API)

```typescript
import { generateText, embed } from "@nurovia/client";
import { createOpenAI } from "@nurovia/provider-openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const { text } = await generateText({
  model: openai.languageModel("gpt-4o"),
  messages: [{ role: "user", content: "Hello, Nurovia!" }],
});

console.log(text);
```

### Embeddings

```typescript
const { embedding } = await embed({
  model: openai.embedding("text-embedding-3-small"),
  value: "Hello, Nurovia!",
});
```

### Streaming text

```typescript
import { streamText } from "@nurovia/client";

const { textStream, text } = await streamText({
  model: openai.languageModel("gpt-4o"),
  messages: [{ role: "user", content: "Count to 10" }],
});

for await (const delta of textStream) {
  process.stdout.write(delta);
}

console.log("\nFull text:", await text);
```

### Structured output

```typescript
import { generateObject } from "@nurovia/client";
import { zodSchema } from "@nurovia/provider-utils/zod";
import { z } from "zod";

const schema = z.object({
  answer: z.string(),
  confidence: z.number(),
});

const { object } = await generateObject({
  model: openai.languageModel("gpt-4o"),
  messages: [{ role: "user", content: "What is 2+2?" }],
  schema: zodSchema(schema),
});

console.log(object);
```

## v0.1.0 compatibility

The registry-based `AI` class still works in v0.2.0 but emits a deprecation
warning. It will be removed in v0.3.0. See the [migration guide](docs/migrate-v0.1-to-v0.2.md).

## Architecture

The SDK is organized into focused packages with strict dependency boundaries:

- `@nurovia/core` — interfaces, types, errors, constants
- `@nurovia/utils` — shared utilities
- `@nurovia/transport` — HTTP transport layer
- `@nurovia/retry` — retry policies
- `@nurovia/normalizer` — response normalization
- `@nurovia/middleware` — middleware types
- `@nurovia/provider-utils` — shared provider utilities and optional Zod adapter
- `@nurovia/client` — model-first AI functions (`generateText`, `streamText`, `embed`, `embedMany`, `generateObject`, `streamObject`)
- `@nurovia/provider-openai` — OpenAI provider adapter

## Documentation

- [API Guidelines](docs/api-guidelines.md)
- [Security](docs/security.md)
- [Migrating from v0.1 to v0.2](docs/migrate-v0.1-to-v0.2.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT © Nurovia
