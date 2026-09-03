---
status: accepted
date: 2026-09-03
tags: [components, settings, stores]
---

# 22. Settings page redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

`Settings.vue` was a flat 5-tab strip (Preferences / Export / Import /
Advanced / Labs) driven by local `ref<SettingsTab>` state, each tab its own
component. It had no grouping, no icons, "Advanced" was really just a
single destructive delete action with a generic label, and the destructive
overwrite-import path (`SettingsImport.vue`) had no warning copy in front of
it — just a plain `btn-error` button. A design review covering this page
alongside the utility nav, Updates, and Info (mockups published as an
Artifact, not checked in) proposed a grouped sidebar matching the
header/card vocabulary already established for Enemy/Weapon/Team
Buffs/Custom Buffs.

Ships behind the existing `liveResultBar` Labs flag
(`settingsStore.labs.liveResultBar.isEnabled`, labeled "UI Overhaul 3.0" in
`SettingsLabs.vue`) rather than a flag of its own, the same choice ADRs
[0013](./0013-live-result-bar-labs-flag.md)–[0021](./0021-utility-nav-dropdown-redesign.md)
made for this whole redesign wave.

## Decision

1. **Grouped sidebar, three sections instead of five flat tabs.**
   `SettingsWorkspace.vue` (new, mounted from `SettingsView.vue` via
   `isLiveResultBarEnabled ? <SettingsWorkspace> : <Settings>` — the same
   swap-at-the-mount-point shape `InventoryEchoesBrowser.vue` already uses
   to pick between `InventoryEchoEdit.vue`/`InventoryEchoEditPanel.vue`)
   groups into **General → Preferences**, **Your Data → Backup & Restore +
   Danger Zone**, **Labs → Labs**. The sidebar itself — desktop column and
   mobile tap-to-open dropdown alike (the dropdown originally copied
   `InventoryMobileSubNav.vue`'s markup pattern inline) — was extracted
   into `WorkspaceSideNav.vue` (see ADR
   [0024](./0024-info-page-nested-routes-redesign.md)) once Info needed
   the identical look and interaction, so post-review this is a genuinely
   shared component between Settings and Info, not two independently
   hand-rolled copies. It supports both a route-driven item (`to`, for
   Info's real `RouterLink`s) and a click-driven one (no `to`, emits
   `select`, for Settings' local section state). The header bar
   (`bg-base-200 p-1 pl-3 rounded-lg`) stays local to `SettingsWorkspace.vue`.

2. **Export + Import merged into one "Backup & Restore" panel, with an
   explicit warning banner before the destructive path.** This is the one
   genuinely new *behavior* in this redesign, not just a re-layout: legacy
   had zero warning copy in front of the raw-text/file overwrite-import
   controls. `SettingsBackupRestore.vue` (new) is built entirely on
   `src/utils/settingsBackup.ts` (the shared export/import/version logic
   extracted from legacy `SettingsExport.vue`/`SettingsImport.vue`, no
   duplication) plus a `role="alert" class="alert alert-warning"` directly
   above the "Import & overwrite" controls.

3. **Danger Zone (renamed from "Advanced") and Labs restyled in place via a
   `variant` prop, not new files.** `SettingsDelete.vue`, `SettingsLab.vue`,
   and `SettingsLabs.vue` each gained an optional `variant?: "legacy" |
   "v3"` prop (default `"legacy"`) that swaps only wrapper/card classes —
   the underlying delete/toggle logic is identical either way. This avoided
   three near-duplicate wrapper components for what is, in each case, a
   handful of class-string differences around unchanged logic. Labs (v3)
   renders the same `labsFeatures` array as legacy, one feature card per
   entry, plus a dashed "more experiments will land here" placeholder card
   instead of legacy's empty-state alert (which only shows when the array
   is empty — not reachable today since one lab already exists, but kept
   for the flag-off path).

## Consequences

- Pros: the destructive-import warning is a real safety improvement that
  benefits every user who reaches that panel, not just a visual refresh.
  Sharing `settingsBackup.ts` between legacy and v3 means the two UIs can't
  drift apart on data-correctness-critical logic (CLAUDE.md priority #3) —
  verified by the pre-existing `tests/components/SettingsExportImport.test.ts`
  passing unmodified after the extraction.
- Cons: `SettingsPreferences.vue`, `SettingsDelete.vue`, and `SettingsLab.vue`
  /`SettingsLabs.vue` now carry a `variant` prop and conditional class
  strings instead of being single-purpose — a reasonable tradeoff given how
  small the visual delta is, but worth revisiting if a future redesign
  wave needs a bigger structural difference than classes alone can express.

## Related

- `src/components/SettingsWorkspace.vue`, `SettingsBackupRestore.vue` (new)
- `src/components/WorkspaceSideNav.vue` (new) — the shared sidebar, also
  used by `InfoView.vue` (ADR [0024](./0024-info-page-nested-routes-redesign.md))
- `src/utils/settingsBackup.ts`, `src/utils/downloadFile.ts` — shared logic
  this panel is built on
- `src/components/SettingsPreferences.vue`, `SettingsDelete.vue`,
  `SettingsLab.vue`, `SettingsLabs.vue` — gained `variant` prop
- `src/pages/SettingsView.vue` — the flag swap
- `cypress/e2e/settingsWorkspaceFlagged.cy.ts` (new) — covers both flag
  states
- `src/components/navigation/InventoryMobileSubNav.vue` — the mobile
  dropdown pattern `WorkspaceSideNav.vue`'s mobile switcher originates from
- ADRs [0013](./0013-live-result-bar-labs-flag.md)–[0021](./0021-utility-nav-dropdown-redesign.md)
  — the shared-flag pattern this follows
