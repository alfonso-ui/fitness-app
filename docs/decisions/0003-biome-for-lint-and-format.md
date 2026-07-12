# 0003 — Biome for linting and formatting

Date: 2026-07-12 · Status: accepted

## Context

The handoff prefers one clear lint/format workflow, with Biome where compatible. The Expo SDK 57 template ships **without** an ESLint dependency (its `lint` script would install it on first run), so adopting Biome does not create a duplicate system to maintain.

## Decision

**Biome** is the single formatter + linter, configured once at the repo root (`biome.json`) and run via `npm run lint` / `npm run format`.

## Consequences

- One tool, one config file, one command — no ESLint/Prettier interplay to explain or keep in sync.
- Biome is fast and covers formatting plus the common correctness lints.
- We give up Expo's `expo lint` preset and the broader ESLint plugin ecosystem (e.g. react-hooks-specific rules beyond what Biome ships). Biome's React rules cover the essentials today.

## Revisit when

A rule we genuinely need (or an Expo tooling requirement) exists only as an ESLint plugin.
