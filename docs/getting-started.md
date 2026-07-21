# Getting Started

This guide walks you through installing the Kiyota AI SDK and making your
first API call.

## Prerequisites

- Node.js 20 or later
- An API key from at least one supported provider

## Installation

Install the meta-package:

```bash
npm install @kiyota/sdk
```

Or install individual packages for a smaller footprint:

```bash
npm install @kiyota/client @kiyota/provider-openai
```

## Configuration

Create an SDK instance with your provider credentials:

```typescript
import { kiyota } from "@kiyota/sdk";

const ai = kiyota({
  openai: { apiKey: process.env.OPENAI_API_KEY },
  anthropic: { apiKey: process.env.ANTHROPIC_API_KEY },
  gemini: { apiKey: process.env.GOOGLE_API_KEY },
});
```

You can configure any subset of the ten supported providers.

## Your first request

```typescript
const { text } = await ai.generateText({
  model: ai.models.openai.gpt56Terra,
  messages: [{ role: "user", content: "Explain quantum computing in one paragraph." }],
});

console.log(text);
```

## Streaming

```typescript
const { textStream, text } = await ai.streamText({
  model: ai.models.anthropic.claudeSonnet5,
  messages: [{ role: "user", content: "Write a haiku about the ocean." }],
});

for await (const delta of textStream) {
  process.stdout.write(delta);
}

console.log("\n---\nFull poem:", await text);
```

## Using model aliases

Instead of hardcoding model IDs, use aliases that automatically select the
best available model:

```typescript
const codingModel = ai.bestCoding();
const visionModel = ai.bestVision();
const fastModel = ai.fastest();

const { text } = await ai.generateText({
  model: codingModel,
  messages: [{ role: "user", content: "Refactor this function." }],
});
```

## Discovering models

```typescript
// List all configured providers
const providers = ai.listProviders();

// List all models
const allModels = ai.listModels();

// List models for a specific provider
const openaiModels = ai.listModels("openai");

// Find models by capability
const visionModels = ai.findModels({ vision: true, reasoning: true });
```

## Next steps

- Read the [Architecture Overview](architecture.md)
- Explore the [Registry Guide](registry.md)
- See the [Provider Guide](providers.md) for provider-specific options
