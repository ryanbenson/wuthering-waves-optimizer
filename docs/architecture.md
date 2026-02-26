# Architecture and conventions

High-level technical choices and conventions for the app. Follow these when adding or changing code.

## Vue 3 and Options API

- **Vue 3** is used throughout.
- **Prefer the Options API** over the Composition API. New components and logic should use `defineComponent` with `data`, `computed`, `methods`, and optionally `setup()` only where needed (e.g. for `watch` or store refs). The main Calculator and many components use a hybrid: Options-style structure with a `setup()` that returns state and handlers.

## TypeScript and types

- **Use types** where possible. The codebase is gradually being typed; when you touch a file, add or improve types (interfaces, function signatures, generics) rather than leaving `any` or `@ts-nocheck` long-term.
- Types live alongside the code (e.g. in `characters/`, `echoes/`, `calculator/`). Prefer local interfaces and shared types in obvious places over a single global types file.

## Performance and data structures

- **Every user action can trigger many calculations** (stats, buffs, damage, rotations). Performance is critical.
- **Use optimal data structures**: avoid unnecessary arrays of objects when a map/record is better; avoid repeated work in hot paths; prefer O(1) lookups where it matters.
- **Avoid blocking the main thread**: see Workers below.

## No classes

- **Avoid classes.** This is an author/owner preference. Use plain objects, factory functions, and modules instead of class instances for domain logic and data.

## Testing

- **Add tests** when building something new:
  - **E2E**: Prefer Cypress (or the project’s e2e framework) for critical user flows.
  - **Unit tests**: Use for pure logic (calculator, stats, attacks, echoes, etc.) so regressions are caught without running the full app.
- The app is sensitive to “one change causing an effect elsewhere”; tests are the safety net. If there’s no test setup yet, introduce a minimal one (e.g. Vitest/Jest for unit, Cypress for e2e) and add at least one test for the area you’re changing.

## Refactoring

- The codebase is **slowly refactoring**. Prefer small, incremental improvements (better types, extracted functions, clearer names) over big rewrites. Keep behavior unchanged and covered by tests where possible.

## Workers for costly work

- **Use web workers** for any costly operations so the main thread stays responsive.
- **Current workers:**
  - **Optimizer** (`processor.worker.ts`, `generator.worker.ts`): heavy combo/loadout and damage calculations.
  - **Echo parser** (`echoParser.worker.ts`): OCR and image recognition for character/echo imports.
- Rule of thumb: if an operation can take hundreds of milliseconds or more, or uses heavy CPU, move it to a worker and pass serializable data (no functions).

## UI: DaisyUI and Tailwind

- **Use DaisyUI** for all UI (buttons, cards, modals, forms, etc.). Do not introduce a second component library for general UI.
- **Use Tailwind** where needed for layout and one-off styling.
- **Support all themes** (e.g. light, dark). Ensure new UI works in both; use semantic DaisyUI/Tailwind tokens (e.g. `bg-base-100`, `text-base-content`) rather than hard-coded light/dark colors.

## Stores: user data only

- **Pinia stores** (`src/stores/`) hold **user input and user state only**. No app config, character settings, calculations, or constants that belong in code.
- Stores are **auto-synced to the user’s storage** (e.g. localStorage). This allows fixing misconfiguration or bugs via a code patch without migrating or fixing stored user settings.
