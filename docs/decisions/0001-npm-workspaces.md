# 0001 — npm workspaces, no monorepo orchestrator

Date: 2026-07-12 · Status: accepted

## Context

The repo hosts a mobile app plus shared packages (`ui`, `types`, `config`) and, later, an admin app and Supabase config. We needed a way to install and link them together. Options: npm workspaces, pnpm/yarn workspaces, or adding an orchestrator (Turborepo, Nx).

## Decision

Plain **npm workspaces**, installed from the repo root. No Turborepo/Nx.

## Consequences

- One `npm install` handles everything; shared packages are symlinked automatically, and Expo SDK ≥52 auto-configures Metro for monorepos — no custom bundler config.
- npm is the tool the founder already uses; nothing new to learn.
- No task-graph caching. With one app and three tiny packages, there is nothing to cache — scripts fan out with `npm run <script> --workspaces`.
- Shared packages ship raw TypeScript (`main: src/index.ts`); Metro and tsc consume the source directly, so there is no package build step to maintain.

## Revisit when

Builds get slow enough to want caching, or a second real app (admin) creates cross-app task dependencies.
