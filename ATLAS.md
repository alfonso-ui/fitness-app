# ATLAS — architecture map

A living map of what actually exists in this repository. Update it when the architecture changes, not for every commit.

_Last updated: 2026-07-20 (cloud sync milestone)._

## Current state

```text
fitness-app/                 npm-workspaces monorepo
├── apps/
│   ├── mobile/              Expo SDK 57 · Expo Router · TypeScript strict
│   │   └── src/
│   │       ├── app/         file-based routes
│   │       │   ├── _layout.tsx        root Stack + theme wiring
│   │       │   ├── (tabs)/            Home · Workouts · Exercises · Progress · Profile
│   │       │   ├── exercise/[slug]    exercise detail (stack screen with header)
│   │       │   ├── workout/[id]/      detail (+ Start/Resume) · edit · add-exercise
│   │       │   ├── session/[id]/      Focus Mode · summary · substitute (ADR 0006)
│   │       │   ├── history/[id]       completed workout detail (+ repeat)
│   │       │   └── auth/              sign-in · sign-up · forgot-password (ADR 0007)
│   │       ├── components/  ThemedText, ThemedView, ScreenPlaceholder, Button, Stepper,
│   │       │                ExerciseCard, ExercisePickerList, FilterChip, SearchInput,
│   │       │                RestTimerBar
│   │       ├── data/        exercises/ — 34-exercise seed catalog (ADR 0004);
│   │       │                templates — 4 starter workout templates
│   │       ├── stores/      workouts (ADR 0005) · session (ADR 0006) — Zustand +
│   │       │                AsyncStorage, local-first · auth — mirrors Supabase ·
│   │       │                sync — status + auto-sync on sign-in (ADR 0008)
│   │       ├── hooks/       useTheme, useColorScheme, useCountdown
│   │       └── lib/         labels, format, confirm, id, session, history,
│   │                        supabase, sync (push/pull, last-write-wins)
│   └── admin/               placeholder — out of MVP scope
├── packages/
│   ├── ui/                  @fitness-app/ui — design tokens (colors/spacing/radii/typography), light+dark
│   ├── types/               @fitness-app/types — starter domain types
│   └── config/              @fitness-app/config — shared tsconfig base
├── supabase/
│   └── migrations/          0001_profiles (ADR 0007) · 0002_workouts_sessions —
│                            workouts + sessions tables, RLS, jsonb rows (ADR 0008)
└── docs/
    └── decisions/           ADRs 0001–0006 (workspaces, styling, Biome,
                             seed data, local persistence, active sessions)
```

## How things connect

- The mobile app consumes theme tokens from `@fitness-app/ui`; Metro resolves workspace packages' TypeScript source directly (standard Expo monorepo setup — no build step for packages).
- Light/dark theming: `useColorScheme` → `useTheme()` returns the token set; React Navigation's theme is derived from the same tokens in `src/app/_layout.tsx`.
- Lint/format (Biome) and typecheck run from the repo root across all workspaces.

## Planned shape (from the product handoff — not built yet)

- **Backend:** Supabase (Postgres, Auth, Storage, RLS); schema lives in `supabase/`.
- **Client state:** Zustand (local/UI), TanStack Query (server state), React Hook Form + Zod (forms/validation).
- **Active workout ("Focus Mode"):** a stack route outside the tab navigator so bottom navigation disappears during training; offline-first with local persistence and background sync.
- **Exercise media:** short looping MP4 + poster via CDN, abstracted behind internal media records (never provider URLs in the domain model).
- **CI/CD:** GitHub Actions + EAS → TestFlight / Play internal testing (not configured yet).

## Deliberate non-goals right now

Monetization, analytics (PostHog), error monitoring (Sentry), social features, AI programming, wearables — see the handoff §13 for the full out-of-scope list.
