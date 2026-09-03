---
status: accepted
date: 2026-09-03
tags: [components, navigation]
---

# 21. Utility nav dropdown redesign (Labs-flagged, shares the `liveResultBar` flag)

## Context

The top-right utility dropdown in `Nav.vue` (the `<details class="options-menu">`
block) is a flat list of six links — Settings, Info, Updates, Privacy, Legal,
Discord — with no grouping and no visual distinction between an interactive
workspace (Settings), static reference pages (Info/Updates/Privacy/Legal),
and an external community link (Discord). A design review covering this
dropdown alongside the Settings, Updates, and Info pages (mockups published
as an Artifact, not checked in) proposed grouping it to match the
header/card vocabulary already established elsewhere in the v3.0 redesign.

During that same review, an unread indicator (a dot on the trigger icon plus
a "N new" badge on Updates, driven by a stored last-visited timestamp) was
also proposed and then explicitly rejected — see the Decision below.

Ships behind the existing `liveResultBar` Labs flag
(`settingsStore.labs.liveResultBar.isEnabled`, labeled "UI Overhaul 3.0" in
`SettingsLabs.vue`) rather than a flag of its own, the same choice ADRs
[0013](./0013-live-result-bar-labs-flag.md)–[0020](./0020-enemy-workspace-redesign.md)
made for this whole redesign wave.

## Decision

1. **Grouped into three labeled sections.** With the flag on, `Nav.vue`
   renders a second version of the dropdown's `<ul>` (`v-if`/`v-else` on
   `isLiveResultBarEnabled`, same pattern as `showTuningIcon` in this same
   file) grouping the six links under eyebrow labels: "Workspace" (Settings),
   "Resources" (Info/Updates/Privacy/Legal), "Community" (Discord). Each
   link gets an inline SVG icon, hand-drawn to match this file's existing
   convention of inlining icons directly rather than pulling in an icon
   library. The flag-off `<ul>` is untouched, byte-for-byte.

2. **No unread indicator of any kind — deliberately.** Updates and Info get
   ~1% and ~2% of site traffic respectively. A "new since last visit" badge
   would mean tracking a per-visitor last-seen timestamp and rendering an
   indicator in global nav chrome — visible on every session, for every
   page — in service of a destination almost nobody opens. The
   state/maintenance cost wasn't judged worth it for this traffic profile,
   and a stale or wrong badge (e.g. after a long gap between visits) is
   worse than no badge. If usage patterns change later this can be
   revisited, but it should be re-proposed deliberately, not silently
   readded.

## Consequences

- Pros: the grouping gives the dropdown the same visual hierarchy already
  established for the redesigned Calculator tabs, at zero cost to the
  flag-off path. The rejection is written down here specifically so it
  isn't rediscovered and re-implemented without reading this first.
- Cons: none identified — this is a template-only change with no new state,
  no new store fields, and no interaction with any other page's logic.

## Related

- `src/components/navigation/Nav.vue` — `.options-menu` block
- `cypress/e2e/navUtilityMenuFlagged.cy.ts` (new)
- ADRs [0013](./0013-live-result-bar-labs-flag.md)–[0020](./0020-enemy-workspace-redesign.md)
  — the shared-flag pattern this follows
