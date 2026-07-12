# CLAUDE.md — project conventions

Working name **LiftFlow** (subject to change — never hard-code permanent branding, bundle identifiers, or store identities from it). A strength-training companion app; the active workout experience is the core product. Full product strategy: `docs/` and the founder handoff.

## Ground rules

- **Never commit, push, merge, or deploy without explicit founder approval.** Propose a commit message and wait.
- The founder (Alfonso) is learning software development — explain commands, errors, and concepts in plain language, but keep the engineering professional.
- One focused milestone at a time. No feature work outside the agreed milestone. Prevent scope creep (see "Out of scope" in the handoff/PRD).
- Warn before destructive operations.
- Document meaningful architectural decisions as ADRs in `docs/decisions/`.

## Repository layout

- `apps/mobile` — Expo app (SDK 57, Expo Router, TypeScript strict, `src/` layout, `@/*` alias).
- `apps/admin` — placeholder, out of MVP scope.
- `packages/ui` — `@fitness-app/ui`: design tokens (provisional palette). Shared components move here only when ≥2 consumers exist.
- `packages/types` — `@fitness-app/types`: shared domain types. No speculative types.
- `packages/config` — `@fitness-app/config`: shared tsconfig base.
- `supabase/` — placeholder until the backend milestone.

## Conventions

- npm workspaces; install from the repo root. No Turborepo/Nx.
- Styling: React Native StyleSheet + typed tokens from `@fitness-app/ui`. No hard-coded colors/spacing in screens. NativeWind deliberately deferred (ADR 0002).
- Lint/format: Biome only (`npm run lint`, `npm run format`). No ESLint/Prettier.
- Typecheck everything: `npm run typecheck` (strict mode; keep it passing).
- Approved stack for later milestones: Supabase, Zustand, TanStack Query, React Hook Form, Zod — add each dependency only when its milestone starts.
- Internal package scope is `@fitness-app/*` (brand-neutral on purpose).
