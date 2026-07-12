# 0005 — Zustand + AsyncStorage for local-first workout data

Date: 2026-07-12 · Status: accepted

## Context

The workout builder creates user data that must survive app restarts and work fully offline — before any backend exists. The approved stack names Zustand for client state; the open question was persistence and shape.

## Decision

User workouts live in a **Zustand store persisted to AsyncStorage** (`apps/mobile/src/stores/workouts.ts`, storage key `workouts-v1`). Every mutation goes through named store actions (`createWorkout`, `addExercise`, `moveExercise`, …) that also stamp `updatedAt`. Edits in the builder write directly to the store, so saving is automatic — there is no unsaved-draft state to lose.

IDs come from `expo-crypto`'s `randomUUID` so they remain globally unique when rows later sync to Postgres.

## Consequences

- Offline-first falls out for free; there is no loading state for local data.
- The store's action set is the exact list of mutations a future sync layer must replay — when Supabase arrives, these actions gain a queued-sync side channel and TanStack Query takes over *server*-owned data (exercise catalog), while user-owned drafts stay local-first.
- The versioned storage key (`workouts-v1`) gives us an explicit migration point if the shape changes.
- AsyncStorage is fine at this scale (a user's workout list is a few KB). If active-workout session logging needs something stronger, that milestone can introduce it deliberately.

## Revisit when

The active-workout milestone defines session logging, or Supabase sync lands.
