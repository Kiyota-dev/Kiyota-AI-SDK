# Architecture Overview

The Kiyota AI SDK is a provider-agnostic runtime for building AI applications.
It is organized into layered packages with strict dependency boundaries.

## Layered architecture

```text
┌─────────────────────────────────────┐
│  @kiyota/sdk                        │  High-level developer experience
│  (config, aliases, discovery)       │
├─────────────────────────────────────┤
│  @kiyota/client                     │  Model-first AI functions
│  (generateText, streamText, embed)  │
├─────────────────────────────────────┤
│  @kiyota/registry                   │  AI Resource Registry
│  (models, pricing, capabilities)    │
├─────────────────────────────────────┤
│  Providers                          │  Provider adapters
│  (@kiyota/provider-*)               │
├─────────────────────────────────────┤
│  @kiyota/core                       │  Types, interfaces, errors
├─────────────────────────────────────┤
│  @kiyota/transport                  │  HTTP transport
│  @kiyota/retry                      │  Retry policies
│  @kiyota/utils                      │  Shared utilities
└─────────────────────────────────────┘
```

## Package responsibilities

### `@kiyota/core`

Foundation package containing shared types, interfaces, errors, and constants.
It has no runtime dependencies and is consumed by every other package.

### `@kiyota/registry`

The AI Resource Registry — the single source of truth for all AI resources.
It stores:

- Model definitions and metadata
- Model capabilities (vision, tools, reasoning, JSON, etc.)
- Pricing information
- Context window sizes
- Model families
- Provider capabilities
- Aliases and discovery helpers

All SDK packages consume the registry rather than maintaining their own
metadata.

### `@kiyota/client`

Model-first AI functions. This package handles the low-level request/response
lifecycle, streaming, and provider interaction. It is intentionally minimal
and focused on API communication.

### `@kiyota/sdk`

High-level developer experience package. It wires providers, exposes the
registry through convenience accessors, and provides discovery and alias
helpers. Most users should install only this package.

### Providers (`@kiyota/provider-*`)

Provider adapters translate between the SDK's unified API and each vendor's
HTTP API. There are two kinds:

- **Native adapters** (e.g., `@kiyota/provider-anthropic`) for providers with
  unique APIs.
- **OpenAI-compatible adapters** built on `@kiyota/provider-openai-compatible`
  for providers that expose `/v1/chat/completions` endpoints.

## Data flow

1. User calls `ai.generateText({ model, messages })` via `@kiyota/sdk`.
2. The SDK resolves the model through `@kiyota/registry` and selects the
   configured provider.
3. The provider adapter builds the vendor-specific request.
4. `@kiyota/client` sends the request via `@kiyota/transport`.
5. The response is normalized and returned to the user.

## Design principles

- **Provider-agnostic**: Adding a new provider should not require changes to
  the core runtime.
- **Registry-driven**: Model metadata lives in one place and is consumed by
  all packages.
- **Layered**: Each package has a single, well-defined responsibility.
- **Backward-compatible**: Public APIs evolve through deprecation, not
  breaking changes.
