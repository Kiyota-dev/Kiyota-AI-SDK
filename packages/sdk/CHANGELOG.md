# @kiyota/sdk

## 0.3.0

### Minor Changes

- 4474467: Implement the first wave of SDK improvement suggestions:

  - Renamed the meta-package to `@kiyota/sdk`.
  - Added a plugin-based provider architecture with a new `@kiyota/provider-anthropic` package.
  - Registered Anthropic models in `@kiyota/models`.
  - Exposed OpenAI and Anthropic providers via `@kiyota/sdk/providers/openai` and `@kiyota/sdk/providers/anthropic`.
  - Introduced `@kiyota/events`, a versioned event bus, and wired `request:*` / `stream:*` events into `generateText` and `streamText`.
  - Introduced `@kiyota/cache` with in-memory and Redis backends.
  - Expanded `@kiyota/middleware` with model-first middleware, a middleware runner, and built-in logging, retry, and cache middleware.
  - Added provider contract and snapshot tests for Anthropic.

### Patch Changes

- Updated dependencies [4474467]
  - @kiyota/provider-anthropic@0.3.0
  - @kiyota/events@0.3.0
  - @kiyota/models@0.2.2
  - @kiyota/client@0.2.2
