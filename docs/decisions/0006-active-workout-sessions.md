# 0006 — Active workout sessions: snapshot, local store, timestamp rest timer

Date: 2026-07-17 · Status: accepted

## Context

Focus Mode is the core product: log sets with minimal taps, rest automatically, and never lose progress — including offline and after the app is killed mid-workout. Three design questions needed settling: how a session relates to its source workout, where session state lives, and how the rest timer stays correct across interruptions.

## Decision

**Snapshot the plan.** Starting a session copies the workout's exercises and targets into a new `WorkoutSession` (`sessionFromWorkout`). The session keeps `workoutId` only as a reference for "repeat this workout". Editing or deleting the source workout afterward never mutates a historical session.

**A dedicated persisted store.** `useSessionStore` (Zustand + AsyncStorage, same pattern as [ADR 0005](0005-zustand-asyncstorage-persistence.md)) holds `activeSession`, `completedSessions`, and `restEndsAt`. Every set edit persists immediately, so an interrupted workout is always resumable — surfaced via a Home banner and the workout detail "Resume" button. Finishing moves the session into `completedSessions`; this list is the read model the history/progress milestone will build on. A `hasHydrated` flag (set in `onRehydrateStorage`, kept out of `partialize`) lets session screens wait for storage to load instead of falsely reporting "no active workout" on a cold deep-link load.

**Rest timer as an end-timestamp.** `restEndsAt` stores when rest ends, not a decrementing counter. The display counts down by re-reading the timestamp each tick (`useCountdown`), and auto-dismiss is a single `setTimeout` scheduled from the timestamp — so backgrounding, reloads, and re-renders can't drift or fire a false dismiss.

## Consequences

- History is immutable and offline-first for free; volume and duration derive from the snapshot.
- Set prefill (last time's weight/reps) reads `completedSessions`, so logging is mostly confirmation, not typing.
- One active session at a time (starting another prompts to discard) — a deliberate MVP simplification.
- Duration/distance exercises reuse the reps field (labelled "Seconds"); a richer measurement model can come with warm-up sets and supersets later.

## Revisit when

Supabase sync lands (these stores gain a sync side-channel, completed sessions upsert by UUID), or session logging needs supersets / warm-up sets / per-side loads.
