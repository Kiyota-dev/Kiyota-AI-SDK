# API Guidelines

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- `v0.x` — experimental API
- `v1.x` — stable API

## Breaking Changes

A breaking change requires a Changeset and a minor/major version bump:

- Removing or renaming exported types, interfaces, functions, or classes from `@kiyota/core` or `@kiyota/client`.
- Changing the return type of `Provider.chat()` or `Provider.stream()`.
- Modifying `AIConfig` in a way that invalidates existing configurations.
- Changing error class hierarchies in a way that breaks `instanceof` checks.

Non-breaking changes include adding optional fields, adding new packages, and
adding new methods to interfaces that already have implementations.

## Deprecation

Deprecated APIs are marked with `@deprecated` JSDoc and remain available for at
least one minor release before removal.

## Public API Rules

- Only exports from `src/index.ts` are considered public.
- Internal modules must not be imported by consumers.
- All public APIs must have TypeScript declarations.
