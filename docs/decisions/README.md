# Architecture Decision Records (ADRs)

Short documents explaining **why** we made important technical choices. When you wonder "why is the project set up this way?", the answer should be here.

Each record follows the same shape:

- **Context** — the situation and the options we had
- **Decision** — what we chose
- **Consequences** — what this makes easier or harder
- **Revisit when** — the signal that should make us reconsider

## Index

| # | Decision | Date |
| --- | --- | --- |
| [0001](0001-npm-workspaces.md) | npm workspaces, no monorepo orchestrator | 2026-07-12 |
| [0002](0002-styling-tokens-over-nativewind.md) | Typed design tokens + StyleSheet; NativeWind deferred | 2026-07-12 |
| [0003](0003-biome-for-lint-and-format.md) | Biome for linting and formatting | 2026-07-12 |
| [0004](0004-local-exercise-seed-data.md) | Exercise catalog ships as local seed data first | 2026-07-12 |
| [0005](0005-zustand-asyncstorage-persistence.md) | Zustand + AsyncStorage for local-first workout data | 2026-07-12 |
| [0006](0006-active-workout-sessions.md) | Active workout sessions: snapshot, local store, timestamp rest timer | 2026-07-17 |
| [0007](0007-optional-accounts.md) | Accounts are optional, and RLS is the security boundary | 2026-07-19 |
| [0008](0008-cloud-sync.md) | Cloud sync: local-first, jsonb rows, last-write-wins | 2026-07-20 |

Add new records with the next number, in the same format, in the same pull request as the change they explain.
