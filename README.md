# fitness-app

Working name **LiftFlow** — a fast, visual strength-training companion. Follow, log, and improve your workouts with minimal interaction.

This is a private monorepo:

| Path | What it is |
| --- | --- |
| `apps/mobile` | The Expo (React Native + TypeScript) mobile app |
| `apps/admin` | Placeholder for a future admin app |
| `packages/ui` | Design tokens (colors, spacing, typography) shared across apps |
| `packages/types` | Shared TypeScript domain types |
| `packages/config` | Shared tooling configuration |
| `supabase/` | Placeholder for the backend (database, auth) |
| `docs/` | Product and architecture documentation, including `docs/decisions/` (why we chose what we chose) |

## Prerequisites

- **Node.js 20 or newer.** LTS versions (20, 22, 24) are recommended — Expo is tested against those. Check yours with `node --version`.
- **npm** (comes with Node).
- To run the app on your phone: the **Expo Go** app (App Store / Play Store).

## Getting started

All commands run from the repository root:

```bash
npm install        # 1. install all dependencies (one install for the whole monorepo)
npm run mobile     # 2. start the Expo development server
```

When the dev server starts it shows a QR code — scan it with your phone's camera (iOS) or the Expo Go app (Android) to open the app. Or press `i` in the terminal to open the iOS simulator, `a` for the Android emulator.

## Everyday commands

```bash
npm run typecheck   # verify TypeScript across all workspaces
npm run lint        # check code style and common mistakes (Biome)
npm run format      # auto-format all code (Biome)
```

## Project conventions

- Colors, spacing, and text styles always come from `@fitness-app/ui` tokens — never hard-code them in screens.
- Significant technical decisions are recorded in `docs/decisions/`.
- See `CLAUDE.md` for the full working conventions and `ATLAS.md` for the architecture map.
