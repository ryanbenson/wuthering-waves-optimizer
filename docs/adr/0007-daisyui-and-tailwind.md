---
status: accepted
date: 2026-08-05
tags: [ui, daisyui, tailwind]
---

# 7. Use DaisyUI and Tailwind for UI

## Context

The app needs a cohesive, themeable UI (light/dark and DaisyUI themes) without maintaining a custom design system or pulling multiple component libraries.

## Decision

**DaisyUI** is the component/styling layer for interactive UI (buttons, modals, forms, alerts, etc.). **Tailwind** handles layout and one-off utilities. New general-purpose UI libraries should not be introduced alongside them.

Use semantic tokens (`bg-base-100`, `text-base-content`, `btn`, …) so all themes work. Prefer Composition API with `<script setup>` for new Vue SFCs.

## Consequences

- Pros: Fast UI iteration; consistent theming; one stack to learn.
- Cons: Custom visuals must fit DaisyUI patterns; upgrading DaisyUI major versions can be disruptive.

## Guidance

- **Do** build new controls with DaisyUI classes + Tailwind layout.
- **Do** verify light and dark (and other themes) for new UI.
- **Don’t** hard-code light-only colors when a semantic token exists.
- **Don’t** add Material / Vuetify / etc. for routine UI.

## Related

- [docs/architecture.md](../architecture.md)
- [docs/src-components.md](../src-components.md)
