---
status: accepted
date: 2026-10-10
tags: [components, stores, analytics, release]
supersedes: [0013]
---

# 38. Make the v3 UI the default, with classic as an opt-in

## Context

"UI Overhaul 3.0" (ADRs 0013–0030) shipped screen by screen behind the `labs.liveResultBar` Labs flag, off by default. It's ready to become what everyone sees. The classic UI still has users and will stay available for about six months, after which it's planned for removal (with notice to users).

To decide when to retire classic, we need to know how many people still choose it.

## Decision

1. **v3 is the default; classic is an opt-in preference.** It's stored as `settings.config.useClassicUi` (`true` = classic). Absent or `false` means v3.
2. **The old Labs flag is ignored.** Its "UI Overhaul 3.0" entry is removed from `SettingsLabs.vue`, and nothing reads `labs.liveResultBar` any more. Anyone who tried the beta and turned it off still lands on v3 at launch; they can opt into classic like everyone else. The stale `labs.liveResultBar` value is left in storage (harmless, and settings aren't migrated, see `src-stores.md`).
3. **One place decides.** All 23 former `labs?.liveResultBar?.isEnabled ?? false` reads go through `isV3UiEnabled(settingsStore)` in `src/utils/uiVersion.ts`. Switching goes through `useClassicUi().setClassicUi(enabled, source)`.
4. **Two ways to switch, both in both UIs:**
   - an "Interface" section in the theme menu (`ThemeChooser.vue`, next to Theme and Density), and
   - a "Use the classic UI" toggle at the top of Settings → Preferences (`SettingsPreferences.vue`, shared by classic and v3 settings).

   The "What's new" modal also offers the switch.
5. **Analytics (Umami):**
   - `classic-ui-enabled` / `classic-ui-disabled`, with `source: "theme-menu" | "settings" | "whats-new"`, on each switch.
   - `classic-ui-session`, once per browser session while classic is on, from `main.ts`. Switch events count decisions; this counts people actually *using* classic, which is what matters for retiring it. It's queued until Umami's deferred script loads (`trackEventWhenReady`) so it isn't lost on startup.
6. **Launch announcement.** `currentAnnouncement` (dated 2026-10-10, which also resets earlier dismissals) carries `whatsNew: true`, which shows the existing "See what's new" button and v3 highlights modal. The banner itself has no call to action. The `showActions` prop it replaces is gone, along with the banner's beta "Try the v3 UI" buttons and their `v3-ui-enabled`/`v3-ui-disabled` events.
7. **Tests keep covering classic.** `cypress/support/e2e.ts` seeds `useClassicUi: true` for specs that don't seed their own settings, so the existing classic e2e suite still runs against classic. v3 specs seed their own settings. Unit tests for classic-only markup set `config.useClassicUi` explicitly. `cypress/e2e/uiVersion.cy.ts` covers the default and both switches.

## Consequences

- Pros:
  - Every user gets v3 with no action, and anyone can switch back in two clicks from any page.
  - Retirement can be decided from real usage (`classic-ui-session`), not guesses.
  - Removing classic later is mechanical: delete the `!isV3UiEnabled(...)` branches, then the helper.
- Cons:
  - Beta users who deliberately turned v3 off get it anyway at launch. Accepted, because v3 is now the supported experience and switching back is easy.
  - Many comments and docs still say "behind the `liveResultBar` flag". Read that as "in the v3 UI" (see the note in `src-components.md`). They'll be cleaned up when classic is removed.

## Guidance

- **Do** branch on `isV3UiEnabled(settingsStore)` (or `useClassicUi().isClassicUi`). Never read `config.useClassicUi` or `labs.liveResultBar` directly.
- **Do** build new UI for v3 only. Classic gets fixes, not features.
- **Don't** reuse the `classic-ui-*` event names for anything else; they're the retirement metric.
- **When classic is removed:** write the closing "UI Overhaul 3.0 shipped" ADR described in `docs/adr/README.md`, bulk-supersede the redesign chapters, and drop the Cypress classic seed.

## Related

- `src/utils/uiVersion.ts`, `src/composables/useClassicUi.ts`, `src/utils/analytics.ts`, `src/components/ThemeChooser.vue`, `src/components/SettingsPreferences.vue`, `src/components/AppUpdateBanner.vue`, `src/content/updates.ts`
- [ADR 0013](./0013-live-result-bar-labs-flag.md) (the original Labs flag)
