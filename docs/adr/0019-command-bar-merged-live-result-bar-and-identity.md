---
status: accepted
date: 2026-09-01
tags: [calculator, components]
---

# 19. Command Bar (merged live result bar + character identity)

## Context

With the `liveResultBar` Labs flag ("UI Overhaul 3.0") on, the calculator
home page rendered the active resonator's avatar three times in close
proximity: the small nav icon in `Nav.vue`, `CalculatorLiveResultBar.vue`'s
own avatar, and `WorkspaceIdentityBar.vue`'s avatar (the first child of
`CalculatorCharacterWorkspace.vue`, on the Character screen only). The
mode/stance switcher similarly existed as two separate implementations: an
inline, self-contained copy inside `CalculatorLiveResultBar.vue` (its own
`resolveActiveStance`/`getStanceIconConfig` calls and its own
`characterStore.setCharacterData` write), and a second instance —
`CalculatorCharacterStance.vue` reused with `:deep()` CSS overrides — inside
`WorkspaceIdentityBar.vue`. The damage monitor, the number people actually
watch (with its `useAnimatedNumber` tween/delta-flash), sat visually
equal-weight with everything else in that stack rather than pinned and
prominent.

This was reviewed and iterated as an HTML design mockup (an Artifact, not
checked in) across three rounds with the maintainer: an initial merged
layout, a fix for a `margin-left:auto` on the damage monitor that stranded
it in dead space on wide screens, and a final condensing pass that split
the bar into an "inputs" cluster (avatar/name/level/build/mode — config
about the character) and an "outputs" cluster (stat chips/target-damage-type
settings/damage monitor — the calculation result), collapsing what were two
stacked components into one thin row. This ADR builds that approved layout.

## Decision

1. **One component replaces two.** `CalculatorCommandBar.vue`
   (`src/components/`, not `characterWorkspace/`) absorbs
   `CalculatorLiveResultBar.vue`'s full contents and the identity-bar
   responsibilities `WorkspaceIdentityBar.vue` used to own. It mounts where
   the old live bar did — a sticky sibling of `.calculations__body` in
   `Calculator.vue`, gated by the same `isLiveResultBarEnabled` flag — so
   it's visible page-wide across every screen (Weapon, Echoes, Optimizer,
   ...), not scoped to the Character tab the way the old identity bar was.
   Both predecessors are deleted outright; every `data-test-live-result-bar*`
   selector is preserved verbatim in the new file, so the rename carries no
   cypress risk (selectors target attributes, not file/component names).

2. **Character-browser and manage-builds modals moved up to
   `Calculator.vue`.** `CalculatorCharacterWorkspace.vue` used to own
   `characterBrowserRef`/`manageBuildsRef` and mount
   `CalculatorCharacterBrowser.vue`/`CalculatorManageBuilds.vue` itself,
   since the identity bar (their trigger UI) lived inside it. Now that the
   avatar and build-switcher triggers live in `CalculatorCommandBar.vue`,
   which renders page-wide, the modals moved to `Calculator.vue` alongside
   it. This is an intentional behavior change, not incidental: clicking the
   avatar to switch character, or opening "Manage builds," now works from
   any tab, not only the Character tab.

3. **The build-switcher chip reuses `CalculatorBuildSelect.vue`** (already
   existed for the legacy, flag-off character-select flow — an
   `AppRichSelect` bound to `getActiveBuildId`/`equipBuild`) instead of
   `WorkspaceBuildSwitcher.vue`'s always-expanded multi-chip row, which had
   exactly one consumer (the now-deleted identity bar). `AppRichSelect`
   already supports a compact, content-sized "fit width" mode (any
   `w-fit`/`w-max`/`w-min`/`w-auto` class in its `class` attribute skips its
   default `w-full` stretch and skips label truncation) — used elsewhere for
   filter-style selects — so `CalculatorBuildSelect.vue` only needed its
   `variant`/`size`/root class hardcoding turned into optional props
   (defaults unchanged) to fit inline in the bar. `WorkspaceBuildSwitcher.vue`
   is deleted; one build-picker implementation now serves both flag states.

4. **The stance switcher stays `CalculatorCharacterStance.vue`, reused, not
   forked again.** The old live bar's duplicated inline stance
   implementation is deleted as part of this merge, not added to — the
   merged bar wraps the shared component in a small `:deep()` override block
   (hide the "Mode" label, shrink the toggle buttons) copied from the same
   pattern the deleted `WorkspaceIdentityBar.vue` already used, since it
   now sits inline after a "·" separator instead of needing its own label.

5. **Sticky positioning (`sticky top-20 z-30`, matching the existing
   `TeamRotationSummaryHeader.vue` convention) is a mobile-only functional
   fix, not cosmetic everywhere.** On desktop, `.calculations__screens` (not
   the page) is the actual scroll container — the bar, as a sibling of
   `.calculations__body`, was already permanently visible via layout before
   this change; `position: sticky` is a no-op safety net there. On mobile
   (`≤768px`), the whole page becomes window-scrolled and the bar would
   scroll away without it — that's the real fix.

6. **Mobile's stat-chip accordion deliberately doesn't share state with the
   full-breakdown detail panel.** A new local `isMobileStatsExpanded` ref,
   not persisted and not wired to `isDetailOpen`/its persisted pin
   (`settingsStore.config.liveResultBarPinned`), toggles only the stat-chip
   row below `lg:`. Conflating the two would mean pinning the detail panel
   open also force-expanding this accordion, or the reverse — different
   surfaces with different lifetimes. Level, build, and mode stay
   always-visible inline in the identity block on mobile too; only the
   stat-chip row is gated, since it's the one element dense enough to
   justify hiding by default.

7. **`CharacterBuildStatus.vue`'s farming-status pill relocated to
   `WorkspaceBuildMeta.vue`.** It sat next to Level in the old identity bar,
   but the approved Command Bar layout doesn't have room for a fourth inline
   element there. `WorkspaceBuildMeta.vue` already sits directly under the
   bar and shows other per-build metadata (weapon chip, build-score chip,
   notes) — a natural home that keeps the bar itself thin.

## Not done here

- **The legacy (flag-off) `screen--character` path is untouched.** It keeps
  its own separate `CalculatorCharacterStance` instance inline, exactly as
  before — see ADR [0013](./0013-live-result-bar-labs-flag.md) point 5's
  "byte-for-byte identical" guarantee for the flag-off DOM, which this
  change does not touch.
- **Mobile's separate `results` sub-nav tab** (`CalculatorMobileSubNav.vue`/
  `CalculatorSubNav.vue`) still exists and still works, made redundant by
  the bar but not removed — deferred again, same as ADR 0013's own "Not
  done here" list.
- **`Nav.vue`'s small Home-icon avatar is explicitly kept**, not folded into
  this merge — it's the only wayfinding cue for the active character on
  Inventory/Convene/Team Rotations, pages the Command Bar never renders on.
  **Superseded 2026-09-03:** the flag-on tuning icon now replaces this
  avatar on every page, not just "home" — the icon-click affordances added
  elsewhere in v3 (weapon panel, party page, Command Bar avatar) made the
  nav's own character-swap click redundant, and per-page inconsistency
  read as a bug rather than an intentional cue.
