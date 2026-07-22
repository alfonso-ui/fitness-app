# 0007 — Accounts are optional, and RLS is the security boundary

Date: 2026-07-19 · Status: accepted

## Context

The app already works completely offline: workouts, Focus Mode, and history all live on the device. Adding Supabase auth raised two questions — whether to gate the app behind a login wall, and what actually protects user data once a database exists.

## Decision

**Accounts are optional.** There is no login wall. A new user can install the app and train immediately; signing in only adds backup and multi-device access. The entry point lives in the Profile tab, framed as "back up your workouts" rather than "sign in to continue". `isSupabaseConfigured` gates every auth call, so a build with no credentials still runs — account features simply stay unavailable.

**Row Level Security is the security boundary, not the API key.** The anon key ships inside the app and is extractable by anyone; that is by design. Every table therefore enables RLS with per-action policies keyed on `auth.uid()`, starting with `profiles` (migration `0001`). A database trigger creates the profile row on sign-up so the app never encounters a signed-in user without one.

**Sessions persist via Supabase's own AsyncStorage integration**, not our Zustand persistence — one owner for session state avoids the two disagreeing. The auth store mirrors Supabase through `onAuthStateChange`.

## Consequences

- The offline-first behaviour built in milestones 2–5 is untouched; sync will layer on top rather than replace it.
- Guest data will need an explicit migration path when a user signs up after already training — the sync milestone must decide whether local data adopts the new user id.
- Email confirmation is **on** in production and off in the dev project; the sign-up screen handles both, so re-enabling it needs no code change.
- Supabase's built-in email service is rate-limited and not production-grade — a custom SMTP provider is required before launch.
- The client must never see the `service_role` key; anything needing it belongs in an Edge Function.

## Revisit when

Sync lands (guest-to-account data adoption), or social sign-in (Apple/Google) is added.
