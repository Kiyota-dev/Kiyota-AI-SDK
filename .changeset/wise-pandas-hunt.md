---
"@kiyota/models": minor
"@kiyota/sdk": minor
"@kiyota/provider-openai-compatible": patch
"@kiyota/provider-kimi": patch
"@kiyota/provider-deepseek": patch
"@kiyota/provider-mistral": patch
"@kiyota/provider-minimax": patch
"@kiyota/provider-xai": patch
"@kiyota/provider-qwen": patch
"@kiyota/provider-gemini": patch
"@kiyota/provider-nvidia": patch
---

Add AI Resource Registry with ten providers and discovery APIs

- Expanded `@kiyota/models` into a full AI Resource Registry with model families, provider capabilities, pricing/context registries, and versioned metadata.
- Added current models from OpenAI, Anthropic, Kimi, DeepSeek, Mistral, MiniMax, xAI, Qwen, Google Gemini, and NVIDIA NIM.
- Introduced registry APIs: `getModelPricing`, `getModelCapabilities`, `getContextWindow`, `getModelFamily`, `getProviderCapabilities`, `listProviders`, `findModels`.
- Added model aliases: `bestCoding()`, `fastest()`, `highestReasoning()`, `bestVision()`, `cheapest()`, `recommended()`.
- Created shared `@kiyota/provider-openai-compatible` core and eight new provider packages.
- Wired all providers and discovery APIs into `@kiyota/sdk`.
