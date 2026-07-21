# Registry Guide

The `@kiyota/registry` package is the single source of truth for all AI
resources in the Kiyota AI SDK. It stores model metadata, capabilities,
pricing, context windows, families, and aliases.

## Core concepts

### Model definitions

Every model is described by a `ModelDefinition`:

```typescript
interface ModelDefinition {
  id: string;
  provider: string;
  name: string;
  description?: string;
  resourceType: "chat" | "embedding" | "image" | "audio" | "video" | "moderation" | "reranking" | "ocr";
  family?: string;
  status: "active" | "deprecated" | "preview";
  capabilities: ModelCapabilities;
  pricing?: ModelPricing;
  contextWindow?: number;
  maxOutputTokens?: number;
  aliases?: string[];
}
```

### Capabilities

Each model exposes a capability profile:

```typescript
interface ModelCapabilities {
  chat: boolean;
  streaming: boolean;
  vision: boolean;
  functionCalling: boolean;
  jsonMode: boolean;
  objectGeneration: boolean;
  reasoning: boolean;
  embedding: boolean;
  audio?: boolean;
  imageGeneration?: boolean;
  video?: boolean;
  structuredOutputs?: boolean;
  supportsJSON?: boolean;
}
```

## Registry APIs

### Listing

```typescript
import { listModels, listModelsByProvider, listProviders } from "@kiyota/registry";

const all = listModels();
const openaiModels = listModelsByProvider("openai");
const providers = listProviders();
```

### Lookup

```typescript
import { findModel, resolveModel } from "@kiyota/registry";

const model = findModel("gpt-5.6-sol");        // ModelDefinition | undefined
const resolved = resolveModel("gpt-5.6-sol");  // ModelDefinition (throws if missing)
```

### Metadata

```typescript
import {
  getModelPricing,
  getModelCapabilities,
  getContextWindow,
  getModelFamily,
  getProviderCapabilities,
} from "@kiyota/registry";

const pricing = getModelPricing("gpt-5.6-sol");
const caps = getModelCapabilities("gpt-5.6-sol");
const context = getContextWindow("gpt-5.6-sol");
const family = getModelFamily("gpt-5.6-sol");
const providerCaps = getProviderCapabilities("openai");
```

### Discovery

```typescript
import { findModels } from "@kiyota/registry";

const visionModels = findModels({ vision: true });
const reasoningModels = findModels({ reasoning: true, provider: "anthropic" });
```

### Aliases

```typescript
import {
  bestCoding,
  fastest,
  highestReasoning,
  bestVision,
  cheapest,
  recommended,
} from "@kiyota/registry";

const model = bestCoding();                    // best coding model
const fast = fastest({ provider: "openai" }); // fastest OpenAI model
```

## Model families

Models are grouped into families for easier navigation:

```typescript
import { modelFamilies, getModelFamily } from "@kiyota/registry";

const gpt56 = modelFamilies["gpt-5.6"];
console.log(gpt56.modelIds); // ["gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna"]

const family = getModelFamily("gpt-5.6-sol");
```

## Provider capabilities

Platform-level features are registered per provider:

```typescript
import { providerCapabilities, getProviderCapabilities } from "@kiyota/registry";

const openai = getProviderCapabilities("openai");
console.log(openai?.responsesApi);  // true
console.log(openai?.batchApi);      // true
```

## Versioning

The registry exposes `registryVersion` so consumers can detect schema changes:

```typescript
import { registryVersion } from "@kiyota/registry";

console.log(registryVersion); // 1
```

## Migration from `@kiyota/models`

`@kiyota/models` is now a deprecated compatibility wrapper. Update your
imports:

```typescript
// Before
import { models, listModels } from "@kiyota/models";

// After
import { models, listModels } from "@kiyota/registry";
```

The wrapper will be removed in the next major release.
