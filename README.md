# Kiyota AI SDK

A provider-agnostic AI runtime for building AI applications with a single,
unified API.

## Vision

Build once. Run on every AI model.

## Installation

```bash
npm install @kiyota/sdk
```

## Quickstart

```typescript
import { kiyota } from "@kiyota/sdk";

const ai = kiyota({
  openai: { apiKey: process.env.OPENAI_API_KEY },
  anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
});

const { text } = await ai.generateText({
  model: ai.models.openai.gpt56Terra,
  messages: [{ role: "user", content: "Hello, Kiyota!" }],
});

console.log(text);
```

### Streaming

```typescript
const { textStream, text } = await ai.streamText({
  model: ai.models.anthropic.claudeSonnet5,
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
import { zodSchema } from "@kiyota/sdk/models";
import { z } from "zod";

const schema = z.object({
  answer: z.string(),
  confidence: z.number(),
});

const { object } = await ai.generateObject({
  model: ai.models.openai.gpt56Terra,
  messages: [{ role: "user", content: "What is 2+2?" }],
  schema: zodSchema(schema),
});

console.log(object);
```

### Model registry

```typescript
import { models, estimateCost, supports } from "@kiyota/sdk/models";

const model = models.openai.gpt56Sol;
console.log(model.capabilities.vision); // true
console.log(supports(model, "functionCalling")); // true
console.log(estimateCost(model, 1_000_000, 500_000)); // ~12.5 USD
```

### Discovery & aliases

```typescript
const providers = ai.listProviders();
const visionModels = ai.findModels({ vision: true });
const codingModel = ai.bestCoding();
const fastModel = ai.fastest();
```

## Supported providers

- **OpenAI** — GPT-5.6 Sol/Terra/Luna, GPT-4o, embeddings
- **Anthropic** — Claude Fable 5, Opus 4.8, Sonnet 5, Haiku 4.5
- **Kimi** — K3, K2.7 Code, K2.6, K2.5, Moonshot v1
- **DeepSeek** — V4 Flash, V4 Pro
- **Mistral** — Medium 3.5, Large 3, Small 4, Codestral
- **MiniMax** — M3, M2.7, M2.5, M2.1, M2
- **xAI** — Grok 4.5
- **Qwen** — 3.6 27B, Qwen3 series, Qwen2.5 series, Coder, VL
- **Google Gemini** — 2.5 Pro/Flash/Lite, 3.1 Pro Preview, 3.5 Flash
- **NVIDIA NIM** — Nemotron 3 Ultra/Super/Nano

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
  model: openai.languageModel("gpt-5.6-terra"),
  messages: [{ role: "user", content: "Hello!" }],
});
```

## Architecture

The SDK is organized into focused packages with strict dependency boundaries:

- `@kiyota/sdk` — single-install meta-package with providers and registry
- `@kiyota/registry` — AI Resource Registry: models, capabilities, pricing, context, families, aliases
- `@kiyota/models` — deprecated compatibility wrapper for `@kiyota/registry`
- `@kiyota/client` — model-first AI functions (`generateText`, `streamText`, `embed`, `embedMany`, `generateObject`, `streamObject`)
- `@kiyota/core` — interfaces, types, errors, constants
- `@kiyota/provider-openai` — OpenAI provider adapter
- `@kiyota/provider-anthropic` — Anthropic provider adapter
- `@kiyota/provider-openai-compatible` — shared OpenAI-compatible core
- `@kiyota/provider-{kimi,deepseek,mistral,minimax,xai,qwen,gemini,nvidia}` — provider adapters
- `@kiyota/provider-utils` — shared provider utilities and optional Zod adapter
- `@kiyota/utils` — shared utilities
- `@kiyota/transport` — HTTP transport layer
- `@kiyota/retry` — retry policies
- `@kiyota/normalizer` — response normalization
- `@kiyota/middleware` — middleware types
- `@kiyota/events` — event bus
- `@kiyota/cache` — caching layer

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Getting Started](docs/getting-started.md)
- [Registry Guide](docs/registry.md)
- [Provider Guide](docs/providers.md)
- [API Guidelines](docs/api-guidelines.md)
- [Security](docs/security.md)
- [Migrating from v0.1 to v0.2](docs/migrate-v0.1-to-v0.2.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT © Kiyota
