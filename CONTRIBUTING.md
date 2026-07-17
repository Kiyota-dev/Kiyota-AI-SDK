# Contributing to Kiyota AI SDK

Thank you for your interest in contributing!

## Development Setup

1. Install Node.js 20 LTS (use `.nvmrc`).
2. Enable corepack: `corepack enable`.
3. Install dependencies: `pnpm install`.
4. Build all packages: `pnpm build`.
5. Run tests: `pnpm test`.

## Repository Structure

- `packages/core` — interfaces, types, errors, constants
- `packages/utils` — shared utilities
- `packages/transport` — HTTP transport layer
- `packages/retry` — retry policies
- `packages/normalizer` — response normalization
- `packages/middleware` — middleware types
- `packages/client` — AI client and provider registry
- `packages/providers/openai` — OpenAI provider adapter
- `apps/cli` — developer CLI
- `examples/` — usage examples

## Working Across Packages

pnpm workspaces automatically symlink local packages. After changing a dependency
package, run `pnpm build` in that package before its dependents can use the
updated types. For active development, use `pnpm dev` or `turbo run dev` with
watch mode.

## Branch Naming

- `feat/description` for features
- `fix/description` for bug fixes
- `docs/description` for documentation
- `chore/description` for maintenance

## Commit Conventions

We use conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `chore:` maintenance
- `test:` test changes
- `refactor:` code refactoring

## Pull Request Process

1. Ensure tests pass: `pnpm test`.
2. Ensure linting passes: `pnpm lint`.
3. Ensure types pass: `pnpm typecheck`.
4. Add a changeset if your change affects a publishable package: `pnpm changeset`.
5. Fill out the PR template.

## Testing Requirements

- Unit tests live next to source code in `tests/` directories.
- Integration tests live in `packages/integration/tests/`.
- CLI tests spawn the binary and assert on stdout/stderr/exit codes.

## Code Style

We use Biome for formatting and linting. Run `pnpm lint` before committing.
