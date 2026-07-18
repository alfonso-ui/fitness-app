# HANDOFF — Instructions for the next engineering agent

You are joining the LiftFlow project as Lead Software Engineer, taking over from a previous agent. Behave like a pragmatic senior engineer working with a founder (Alfonso Lavergne) who is learning software development: explain commands, errors, and decisions in plain language, but keep the engineering professional.

Read these before writing any code, in this order:

1. `CLAUDE.md` — working conventions (loaded automatically, but read it deliberately)
2. `ATLAS.md` — current architecture map
3. `docs/decisions/` — the five ADRs; do not re-litigate settled decisions
4. This file — current state and what to build next

The full product strategy lives in the founder's original handoff (vision, personas, UX requirements, out-of-scope list). Its operative constraints are restated here and in `CLAUDE.md`.

---

## 1. Non-negotiable working rules

- **Never commit, push, merge, or deploy without explicit founder approval.** Build, verify, then propose a commit message and wait. The founder merges PRs himself on GitHub.
- **One milestone at a time.** No feature work outside the current milestone. When you finish, report and stop.
- **Verify by running the app, not just compiling it.** Every milestone ends with: `npm run typecheck` clean, `npm run lint` clean (Biome), `npx expo export --platform web` succeeds, and a manual click-through of the new flow in the browser preview (`.claude/launch.json` has a `mobile-web` config; on web, RN `Alert` is a no-op — the repo has `src/lib/confirm.ts` for that reason). Report results honestly, including failures.
- **Tokens, not hard-coded styles.** All colors/spacing/radii/type come from `@fitness-app/ui`. If you need a new token, add it to the package, don't inline a value.
- **No new dependencies without justification.** Approved-but-not-yet-installed stack: Supabase JS, TanStack Query, React Hook Form, Zod. Install each only when its milestone starts, via `npx expo install` for anything Expo-managed. Everything else needs founder approval.
- **Document meaningful decisions** as ADRs in `docs/decisions/` (numbered, same format as 0001–0005), in the same change as the code.
- **Keep `ATLAS.md` current** when the architecture changes.
- Working name "LiftFlow" is provisional — no permanent branding, bundle IDs, or store identities. Internal package scope stays `@fitness-app/*`.

## 2. Current state (as of 2026-07-17)

Three milestones are complete, each verified end-to-end:

1. **Foundation** — npm-workspaces monorepo, Expo SDK 57 app (TypeScript strict, Expo Router, `src/` layout, `@/*` alias), token-driven light/dark theme in `packages/ui`, Biome, ADRs 0001–0003. Merged to `main` (PR #1).
2. **Exercise library** — `Exercise` domain model in `packages/types`; 34-exercise seed catalog with original written content in `apps/mobile/src/data/exercises/` (ADR 0004); Exercises tab with search + muscle/equipment filters; exercise detail screen with media placeholder ("demonstration coming soon" — no licensed media yet, and do not scrape any). **PR #2 — check whether it is merged before you start.**
3. **Workout templates + builder** — `Workout`/`WorkoutExercise`/`WorkoutTemplate` types; Zustand store persisted to AsyncStorage, auto-saving, UUIDs via expo-crypto (ADR 0005); 4 starter templates; Workouts tab, workout detail (duplicate/delete-with-confirm, disabled "Start workout" button), builder (steppers, reorder, notes), add-exercise picker sharing `ExercisePickerList` with the Exercises tab. Committed as `e19d2f6` on `feature/workout-builder`, **not yet pushed / no PR yet**.

First actions: run `git status`, `git log --oneline -5`, and `gh pr list` to confirm where things stand; get PRs #2 and #3 merged with the founder before building on top. Branch each milestone as `feature/<name>` off the latest merged state (stacking on an unmerged branch is acceptable if the founder hasn't merged yet — the previous agent did this).

Environment notes: Node 25 (non-LTS — works, but if tooling misbehaves, suggest Node 22/24 LTS). Typed routes are enabled; after adding route files, the generated types refresh when the dev server or export runs — a stale-route-type TS error right after creating a route is normal until then.

## 3. What to build next

### Milestone 4 — Active workout ("Focus Mode") ← START HERE

This is the core product. It deserves more care than everything built so far. Design before coding; write the session domain model first.

**Domain model** (in `packages/types`, new `session.ts`): `WorkoutSession` (id, workoutId snapshot or embedded plan copy, status: active/completed/cancelled, startedAt/endedAt), `SessionExercise`, `SetLog` (weight, reps, completed, timestamp, optional note; reserve warm-up flag and each-side fields per the original handoff). Snapshot the workout plan into the session at start — later edits to the workout must not mutate historical sessions.

**Persistence**: a dedicated Zustand+AsyncStorage store (`activeSession` + `completedSessions`), same pattern as ADR 0005. Every set completion persists immediately. On app launch, an unfinished session must be detectable and resumable (resume prompt). Completed sessions feed the history/progress milestone.

**Focus Mode UX** (a stack route outside the tabs, e.g. `/session/[id]`, so bottom navigation disappears):
- Current exercise prominent: name, set x of y, target reps, media placeholder
- Previous performance for this exercise visible without navigating (from `completedSessions`; empty state on first use)
- Weight + reps inputs as large steppers pre-filled from the previous set (or last session), one obvious "Complete set" action
- Completing a set saves, confirms visually, and starts the rest timer automatically
- Rest timer: countdown from the exercise's `restSeconds`, skip / +15s controls; it must survive backgrounding — store the timer's end timestamp, not a ticking counter
- Undo/correct the most recent completed set
- Next/previous exercise navigation and visible workout progress
- Exercise substitution mid-workout via the existing `ExercisePickerList` (alternatives first if easy, but don't over-build)
- Finish → completion summary screen (duration, exercises, completed sets, total volume when meaningful, simple positive message — no confetti)
- Cancel requires confirmation (`src/lib/confirm.ts`); accidental back-navigation must not kill the session
- Wire the workout detail screen's "Start workout" button to launch the session

**In-milestone scope guards**: no supersets, no warm-up set UI (model reserves it), no personal-record detection (that's milestone 6), no notifications/haptics yet. Timer accuracy on web preview is fine for verification; test on a phone for the real feel and tell the founder how.

### Milestone 5 — Workout history + basic progress

Read model over `completedSessions`: history list (date, duration, workout name), completed-workout detail (sets/weights/reps), repeat a past workout (creates a session from its snapshot), Progress tab minimum: workouts per week, per-exercise best weight and recent history. Avoid dashboard sprawl — the handoff explicitly warns against it.

### Milestone 6 — Supabase: auth + sync

Only after the offline flow is solid. Stand up `supabase/` (schema mirroring the local models, RLS from day one), email/password auth first, then background sync: local is source of truth for drafts and active sessions; completed data upserts by UUID (they're already UUIDs for this reason). Conflicts: last-write-wins per row is acceptable for v1; document it in an ADR. Add TanStack Query only when server state actually enters the client. Never put keys in source — `.env` + `.env.example`.

### Later (founder-prioritized)

Onboarding flow, real exercise media (licensed only — see original handoff §20), dark-mode visual QA pass, settings/units, Apple/Google sign-in, EAS/TestFlight setup. Everything in the "out of scope" list of `CLAUDE.md` still requires explicit founder approval.

## 4. Definition of done, every milestone

1. Typecheck + Biome clean from repo root; web export succeeds.
2. New flow manually exercised in the browser preview, including one full reload to prove persistence where relevant; zero console warnings.
3. ADR written if an architectural decision was made; `ATLAS.md` updated.
4. Plain-language report to the founder: what was built, how it was verified, any risks.
5. Proposed commit message — then **wait for approval**. After approval: conventional commit on the feature branch, push, `gh pr create` (founder is authenticated via `gh`), report the PR URL, founder merges.
