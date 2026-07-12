# 0002 — Typed design tokens + StyleSheet; NativeWind deferred

Date: 2026-07-12 · Status: accepted

## Context

The handoff approves NativeWind *if* it is compatible with the current stable Expo environment and doesn't create avoidable configuration problems — otherwise React Native StyleSheet with typed design tokens. We scaffolded on Expo SDK 57 / React Native 0.86 / React 19.2, all very recent. NativeWind adds a Babel plugin, Metro transformer, and Tailwind config whose supported version ranges typically lag new SDK releases.

## Decision

Style with **React Native `StyleSheet` + typed tokens** from `@fitness-app/ui` (colors, spacing, radii, typography, light + dark). No NativeWind for now.

## Consequences

- Zero styling-related build configuration; nothing to break on SDK upgrades.
- Theming is enforced by types: screens reference token names (`colors.primary`, `spacing.md`), never raw values, so the provisional palette can be swapped in one file when branding is approved.
- Styles are more verbose than Tailwind classes.
- If we adopt NativeWind later, the token file maps directly onto a Tailwind config — screens built against tokens migrate mechanically.

## Revisit when

NativeWind officially supports our Expo SDK and styling verbosity is actually slowing feature work down.
