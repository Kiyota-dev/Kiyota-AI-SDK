# Nurovia AI SDK

A provider-agnostic AI runtime for building AI applications with a single,
unified API.

## Vision

Build once. Run on every AI model.

## Installation

```bash
npm install @nurovia/client @nurovia/provider-openai
```

## Quickstart

```typescript
import { AI } from "@nurovia/client";
import { OpenAIProvider } from "@nurovia/provider-openai";

const ai = new AI({
  logger: console,
});

ai.register(
  new OpenAIProvider({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const result = await ai.chat({
  model: "gpt-4o",
  messages: [
    { role: "user", content: "Hello, Nurovia!" },
  ],
});

console.log(result.content);
```

## Architecture

The SDK is organized into focused packages with strict dependency boundaries:

- `@nurovia/core` — interfaces, types, errors, constants
- `@nurovia/utils` — shared utilities
- `@nurovia/transport` — HTTP transport layer
- `@nurovia/retry` — retry policies
- `@nurovia/normalizer` — response normalization
- `@nurovia/middleware` — middleware types
- `@nurovia/client` — AI client and provider registry
- `@nurovia/provider-openai` — OpenAI provider adapter

## Documentation

- [API Guidelines](docs/api-guidelines.md)
- [Security](docs/security.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT © Nurovia
