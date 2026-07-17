# Kiyota AI SDK

A provider-agnostic AI runtime for building AI applications with a single,
unified API.

## Vision

Build once. Run on every AI model.

## Installation

```bash
npm install kiyota
```

## Quickstart

```typescript
import { kiyota } from "kiyota";

const ai = kiyota({
  openai: { apiKey: process.env.OPENAI_API_KEY },
});

const { text } = await ai.generateText({
  model: ai.models.openai.gpt4o,
  messages: [{ role: "user", content: "Hello, Kiyota!" }],
});

console.log(text);
```

### Streaming

```typescript
const { textStream, text } = await ai.streamText({
  model: ai.models.openai.gpt4o,
  messages: [{ role: "user", content: "Count to 10" }],
});

for await (const delta of textStream) {
  process.stdout.write(delta);
}

console.log("\nFull text:", await text);
```

### Embeddings

```typescript
const { embedding } = await ai.embed({
  model: ai.models.openai.textEmbedding3Small,
  value: "Hello, Kiyota!",
});
```

### Structured output

```typescript
import { zodSchema } from "kiyota/models";
import { z } from "zod";

const schema = z.object({
  answer: z.string(),
  confidence: z.number(),
});

const { object } = await ai.generateObject({
  model: ai.models.openai.gpt4o,
  messages: [{ role: "user", content: "What is 2+2?" }],
  schema: zodSchema(schema),
});

console.log(object);
```

### Model registry

```typescript
import { models, estimateCost, supports } from "kiyota/models";

const model = models.openai.gpt4o;
console.log(model.capabilities.vision); // true
console.log(supports(model, "functionCalling")); // true
console.log(estimateCost(model, 1_000_000, 500_000)); // ~7.5 USD
```

## Modular installs

If you prefer smaller packages, install only what you need:

```bash
npm install @kiyota/client @kiyota/provider-openai
```

```typescript
import { generateText } from "@kiyota/client";
import { createOpenAI } from "@kiyota/provider-openai";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { text } = await generateText({
  model: openai.languageModel("gpt-4o"),
  messages: [{ role: "user", content: "Hello!" }],
});
```

## v0.1.0 compatibility

The registry-based `AI` class still works in v0.2.x but emits a deprecation
warning. It will be removed in v0.3.0. See the [migration guide](docs/migrate-v0.1-to-v0.2.md).

## Architecture

The SDK is organized into focused packages with strict dependency boundaries:

- `kiyota` — single-install meta-package with providers and model registry
- `@kiyota/models` — unified model registry, capabilities, and pricing
- `@kiyota/client` — model-first AI functions (`generateText`, `streamText`, `embed`, `embedMany`, `generateObject`, `streamObject`)
- `@kiyota/core` — interfaces, types, errors, constants
- `@kiyota/provider-openai` — OpenAI provider adapter
- `@kiyota/provider-utils` — shared provider utilities and optional Zod adapter
- `@kiyota/utils` — shared utilities
- `@kiyota/transport` — HTTP transport layer
- `@kiyota/retry` — retry policies
- `@kiyota/normalizer` — response normalization
- `@kiyota/middleware` — middleware types

## Documentation

- [API Guidelines](docs/api-guidelines.md)
- [Security](docs/security.md)
- [Migrating from v0.1 to v0.2](docs/migrate-v0.1-to-v0.2.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT © Kiyota
