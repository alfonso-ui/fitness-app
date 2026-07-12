# mobile

The LiftFlow mobile app (Expo + Expo Router + TypeScript).

Setup and day-to-day commands are documented in the [root README](../../README.md). Quick reference:

```bash
# from the repository root
npm install       # install everything (workspaces)
npm run mobile    # start the Expo dev server
```

Routes live in `src/app/` (file-based routing). Design tokens come from the shared `@fitness-app/ui` package — never hard-code colors or spacing in screens.
