---
"@kiyota/registry": minor
"@kiyota/models": patch
"@kiyota/sdk": minor
---

Promote registry to a first-class package

- Created `@kiyota/registry` as the canonical AI Resource Registry package.
- `@kiyota/models` is now a deprecated compatibility wrapper that re-exports from `@kiyota/registry`.
- Updated `@kiyota/sdk` to consume `@kiyota/registry` directly.
- Added comprehensive documentation: architecture overview, getting started guide, registry guide, and provider guide.
- Bumped `@kiyota/sdk` to v0.5.0 to reflect the new registry integration.
