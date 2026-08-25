---
status: accepted
date: 2026-08-25
tags: [calculator, components, stores]
---

# 13. Live Result Bar (Labs-flagged layout)

## Context

The calculator's homepage is a fixed 50/50 split: whatever sub-nav tab is
active (Character, Weapon, Echoes, Optimizer, ...) on the left, and a
permanent stat table + full damage breakdown on the right — unconditionally,
on every tab, even ones (the Optimizer's own config, echo browsing) where
that column adds nothing and just squeezes the actual content into half the
screen. A design proposal (published as an Artifact, not checked in) explored
replacing this with a pinned "Live Result Bar" under the top nav — character,
a handful of stat chips, one target/damage number, and a chevron for the full
detail on demand — with full-width content underneath. This ADR is for
actually building that, not the proposal itself.

Because this replaces the top-level layout of the app's main page, it ships
behind the existing (previously unused) Labs mechanism — `settingsStore.labs`
+ `SettingsLab.vue`'s toggle — rather than as the new default. `labsFeatures`
in `SettingsLabs.vue` had never had an entry registered; this is the first.

## Decision

1. **Target resolution reuses the Optimizer's own vocabulary.** The
   Optimizer's target picker (`CalculatorOptimizerTarget.vue`) already
   encodes a target as `"Stat:key"` / `"Attack:group|key"` /
   `"Rotation:id"` and lists every one of a character's actions plus their
   saved rotations. The bar reuses that exact component and string format
   instead of inventing a second target vocabulary — "same idea as the
   Optimizer's own target dropdown" was the actual design brief. What didn't
   exist: a way to resolve one of these strings against data that's *already
   been computed* (`allDamages`, the live stat refs) rather than recomputing
   from scratch the way the Optimizer's own `optimize()` does per loadout.
   `src/calculator/liveResultBar.ts` is that resolver — a small pure module,
   not folded into `attacks.ts` or `optimizer.ts`, covered by
   `tests/calculator/liveResultBar.test.ts`.

   Reusing `CalculatorOptimizerTarget.vue` surfaced two real bugs in it, not
   just integration friction, both fixed rather than worked around:
   - Its `currentOptimizationTarget` prop was only ever read once in
     `onMounted`, not watched — fine for the Optimizer, where that value is
     available synchronously at mount from the store, but wrong for the bar,
     which resolves its default target *after* mount once `calcAllDamages`
     finishes. Fixed with a `watch()` alongside the existing one-time read.
   - Its `characterData` (the attack list backing the dropdown's options) was
     also only ever fetched once in `onMounted`, with no reaction to the
     `character` prop changing. The Optimizer's own usage happens to dodge
     this because `CalculatorOptimizer.vue` already keys it on `:key="character"`,
     forcing a remount on every character switch — undocumented, easy to miss
     when reusing the component elsewhere. The bar's own usage now carries
     the same `:key="character"`, and this is worth remembering if this
     component grows a third consumer.

2. **Default target and bar stats are per-character config, not hardcoded.**
   `CharacterBasicInfo` (the global `.d.ts`) gained two optional fields:
   `liveResultBarDefaultTarget` (`{ type: "rotation" }` — prefer this
   character's first saved rotation — or `{ type: "action", group, key }`
   for a specific attack) and `liveResultBarStats` (which stat keys get a
   chip; defaults to `[ATK, CritRate, CritDMG, EnergyRegen]` when omitted).
   Only `Brant/basic.ts` sets these for now, as a worked example — every
   other character falls back to the defaults, and to
   `fallbackLiveResultBarTarget()` (first attack in priority order
   Liberation → Skill → Forte Circuit → Basic → Intro → Tune Break → Outro)
   when no rotation exists yet for a `"rotation"`-type default. Extending
   this to more characters is intentionally left for a follow-up rather than
   done in bulk here.

3. **The resolved target is self-healing, not just reset-on-character-change.**
   `liveResultBarTarget` resets to `null` when `character` changes, then gets
   filled in once `calcAllDamages` actually has data for the new character.
   But `CalculatorRotations.vue` also only remounts (and thus reloads its
   rotation list) via its own `:key="characterBuildKey"`, on a timeline not
   strictly ordered relative to `calcAllDamages` — so a `"rotation"`-type
   default resolved right after a character switch could momentarily target
   the *previous* character's rotation id. Rather than chase that ordering,
   `liveResultBarTarget` is re-validated against current `allDamages` on
   every `calcAllDamages` pass and cleared (then re-resolved) if it no longer
   resolves — safe because rotation ids don't collide across characters, so
   a stale id can never coincidentally look valid for the new one.

4. **The detail panel is a real flex column, not a modal overlay.** An
   earlier sketch (in the design proposal) had it slide in over the content
   with a scrim, closer to a drawer. Once actually wired into the page's
   existing `.calculations` CSS grid, there was no real reason to keep it
   modal — `CalculatorLiveResultDetail.vue` sits beside
   `.calculations__screens` in a flex row (content `flex:1`, detail
   `flex:0 0 380px`), non-blocking in both the pinned and unpinned case. The
   only thing "pinned" actually changes is persistence: `isDetailOpen` is a
   session ref that happens to be *initialized* from the persisted
   `liveResultBarPinned` config value on load, and toggling pin writes that
   value back (`settingsStore.addToConfig`, the same mechanism
   `useTheme.ts` already uses) — not a second modal-vs-docked visual mode.

5. **The legacy (flag-off) layout is untouched at the DOM level, not just
   visually similar.** `.calculations` stays a 2-column grid by default;
   `.calculations--live-bar` (flag-on) switches it to `grid-template-rows:
   auto 1fr` with the bar as its own row and a `.calculations__body` flex
   wrapper for content + optional detail column. Rather than branch the
   whole template, `.calculations__body--legacy` sets `display: contents`
   when the flag is off, making that wrapper transparent to the grid so
   `.calculations__screens` and `.results` end up exactly the same two grid
   items they always were. Confirmed via `calculator.cy.ts`'s existing full
   suite (including the responsive-sizing test) passing unmodified with the
   flag off, byte-for-byte identical screenshots against the pre-change
   layout.

## Not done here

- **The optimizer badge** ("Optimizer found +N, click to equip") from the
  design proposal — a real feature, deliberately passive (reuses the last
  explicit optimizer run's result, never triggers a new one automatically)
  rather than a live-updating background search, which the search space
  makes infeasible. Not built in this pass; the resolver and bar have no
  dependency on it existing later.
- **Mobile's separate `results` sub-nav tab** still exists and still works
  identically regardless of the flag — the bar makes it redundant when
  enabled, but removing it means touching `CalculatorMobileSubNav.vue` and
  `CalculatorSubNav.vue`'s hardcoded tab lists, deferred to keep this change
  scoped to the bar itself.
- **Extending `liveResultBarDefaultTarget`/`liveResultBarStats` beyond
  Brant** to the rest of the roster.
