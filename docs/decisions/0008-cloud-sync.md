# 0008 — Cloud sync: local-first, jsonb rows, last-write-wins

Date: 2026-07-20 · Status: accepted

## Context

Accounts exist ([ADR 0007](0007-optional-accounts.md)) but so far only prove identity. Users want their workouts and history backed up and available on more than one device — without giving up the offline-first behaviour that makes the active workout reliable.

## Decision

**Local stays the source of truth; sync is additive.** The Zustand + AsyncStorage stores remain authoritative. Sync pulls remote rows, merges them in, then pushes the merged set back up. A sync never deletes local data, and the app is fully usable whether sync succeeds, fails, or isn't configured.

**Two tables, nested data as jsonb** (migration `0002`): `workouts` and `workout_sessions`. A workout's exercises and a session's exercises+sets are stored as `jsonb`, mirroring the local model exactly, so sync is a plain row upsert rather than a multi-table transaction. Same per-owner RLS as profiles. Only *completed* sessions sync — the active session and rest timer stay device-local.

**Last-write-wins per row.** Workouts carry `updatedAt`; on merge the newer timestamp wins. Completed sessions are immutable, so they're a simple union by id. This is the pragmatic v1 conflict rule; it can lose a concurrent edit made offline on two devices, which is acceptable for a single-user MVP and documented here rather than solved with CRDTs.

**Guest-to-account adoption falls out for free.** Local rows have no user id; the id is attached only when pushed. So workouts logged before signing up are adopted into the account on the first sync after sign-in — no migration step, no orphaned data.

**Sync degrades, never blocks.** `syncAll` returns a typed outcome and never throws. If the tables don't exist yet (`PGRST205`), it reports `not-provisioned` and no-ops; Profile shows "Cloud backup isn't set up yet". Auto-sync runs on sign-in; a manual "Sync now" is on Profile.

## Consequences

- Offline-first is preserved end to end; sync is a background convenience.
- The jsonb choice means the server can't yet query *inside* sessions (e.g. "best bench press across all users") — fine for now, would need normalising later.
- Shared-device edge case: signing in on a device holding another user's local data would push that data into the new account. Acceptable under the single-user-per-device MVP assumption; noted for the multi-account pass.
- Deleting a workout locally does not yet delete it from the cloud (delete-sync / tombstones are deferred).

## Verified / not yet verified

Verified: typecheck, lint, web export (no static-render crash), and the live degradation path — a signed-in user with no tables sees "not set up yet" and the app stays stable with zero console errors. **Not yet verified:** the actual data round-trip, which requires migration `0002` to be applied to the database first.

## Revisit when

Multi-device conflict complaints appear (revisit LWW), delete-sync is needed (tombstones), or server-side queries over history are required (normalise out of jsonb).
