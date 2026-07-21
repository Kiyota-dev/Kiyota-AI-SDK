# Provider Guide

The Kiyota AI SDK supports ten providers through a mix of native and
OpenAI-compatible adapters.

## Supported providers

| Provider  | Package                    | Type              | Default base URL |
|-----------|----------------------------|-------------------|------------------|
| OpenAI    | `@kiyota/provider-openai`  | Native            | `https://api.openai.com/v1` |
| Anthropic | `@kiyota/provider-anthropic` | Native          | `https://api.anthropic.com/v1` |
| Kimi      | `@kiyota/provider-kimi`    | OpenAI-compatible | `https://api.moonshot.cn/v1` |
| DeepSeek  | `@kiyota/provider-deepseek`| OpenAI-compatible | `https://api.deepseek.com/v1` |
| Mistral   | `@kiyota/provider-mistral` | OpenAI-compatible | `https://api.mistral.ai/v1` |
| MiniMax   | `@kiyota/provider-minimax` | OpenAI-compatible | `https://api.minimax.chat/v1` |
| xAI       | `@kiyota/provider-xai`     | OpenAI-compatible | `https://api.x.ai/v1` |
| Qwen      | `@kiyota/provider-qwen`    | OpenAI-compatible | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Gemini    | `@kiyota/provider-gemini`  | OpenAI-compatible | `https://generativelanguage.googleapis.com/v1beta/openai/` |
| NVIDIA    | `@kiyota/provider-nvidia`  | OpenAI-compatible | `https://integrate.api.nvidia.com/v1` |

## Configuration

All providers accept the same base settings:

```typescript
interface ProviderSettings {
  apiKey?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
}
```

Example:

```typescript
import { kiyota } from "@kiyota/sdk";

const ai = kiyota({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.openai.com/v1",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  gemini: {
    apiKey: process.env.GOOGLE_API_KEY,
  },
});
```

## Using providers directly

You can also use provider packages standalone:

```typescript
import { createOpenAI } from "@kiyota/provider-openai";
import { generateText } from "@kiyota/client";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { text } = await generateText({
  model: openai.languageModel("gpt-5.6-terra"),
  messages: [{ role: "user", content: "Hello!" }],
});
```

## OpenAI-compatible providers

Eight providers share the OpenAI-compatible core. They expose the same
interface:

```typescript
import { createKimi } from "@kiyota/provider-kimi";
import { createDeepSeek } from "@kiyota/provider-deepseek";

const kimi = createKimi({ apiKey: process.env.KIMI_API_KEY });
const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY });

const model = kimi.languageModel("kimi-k3");
```

## Environment variables

Each provider reads its API key from a conventional environment variable when
`apiKey` is not passed explicitly:

| Provider  | Environment variable      |
|-----------|---------------------------|
| OpenAI    | `OPENAI_API_KEY`          |
| Anthropic | `ANTHROPIC_API_KEY`       |
| Kimi      | `KIMI_API_KEY`            |
| DeepSeek  | `DEEPSEEK_API_KEY`        |
| Mistral   | `MISTRAL_API_KEY`         |
| MiniMax   | `MINIMAX_API_KEY`         |
| xAI       | `XAI_API_KEY`             |
| Qwen      | `QWEN_API_KEY`            |
| Gemini    | `GOOGLE_API_KEY`          |
| NVIDIA    | `NVIDIA_API_KEY`          |

Base URLs can be overridden with `<PROVIDER>_BASE_URL`.

## Adding a new provider

To add a new OpenAI-compatible provider:

1. Create a package under `packages/providers/<name>/`.
2. Wrap `createOpenAICompatibleProvider` with the provider's default base URL
   and name.
3. Register the provider's models in `@kiyota/registry`.
4. Add the provider to `@kiyota/sdk`.

See `packages/providers/kimi/` for a minimal example.
