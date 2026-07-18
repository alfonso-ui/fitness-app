# 0004 — Exercise catalog ships as local seed data first

Date: 2026-07-12 · Status: accepted

## Context

Every upcoming feature (workout builder, active workout, history) is built on exercises, but the Supabase backend doesn't exist yet. Options: stand up the database first, or ship the catalog as typed local data and promote it to a database seed later.

## Decision

The exercise catalog lives in `apps/mobile/src/data/exercises/` as typed TypeScript objects (34 curated exercises, original written content). `@fitness-app/types` defines the `Exercise` model. Dev-only integrity checks warn on duplicate slugs and dangling `alternatives` references.

Exercise **media is deliberately absent**: the model reserves an `ExerciseMedia` record (provider-agnostic, per handoff §20) and the UI renders a "demonstration coming soon" placeholder. No scraped or unlicensed assets.

## Consequences

- Product screens iterate immediately, offline by definition, with no backend dependency.
- The data shape gets validated by real UI before it hardens into a database schema — schema mistakes are cheap to fix now.
- When Supabase lands, this file becomes the seed script and `id` switches from slug to database UUID; consumers already read exercises through `@/data/exercises`, so the swap is contained.
- All exercise text is written for this project — no licensing risk.

## Revisit when

The Supabase milestone starts (promote to seed + repository layer), or the catalog needs server-side editing.
