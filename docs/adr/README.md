# Architecture Decision Records (ADRs)

Short, immutable records of **important** technical and product decisions. Written so both humans and coding agents can apply them without re-deriving the debate.

**Two kinds live here — read the right one for what you need:**

- **Architecture ADRs** (0001–0012, 0029) — durable, cross-cutting, rarely reversed (pure calculator, workers, no classes, stores-hold-user-data, etc.). Read these for **why** a lasting constraint exists.
- **Redesign ADRs** (0013+, currently the "UI Overhaul 3.0" chapters behind the `liveResultBar` Labs flag) — a dated log of one evolving surface being rebuilt in steps. Each is real and useful as **archaeology** (why a specific layout/behavior exists), but a later chapter routinely rewrites part of an earlier one's Decision without making the earlier one wrong to *cite*, just wrong to *trust wholesale*.

**For current behavior, don't reconstruct it from the redesign-ADR chain.** Start at the relevant area doc (`docs/src-components.md`, etc.) — it describes what's true today and links the ADR(s) for rationale. Read a redesign ADR end-to-end when you need the *why*, are about to touch that surface, or are about to reverse something — not to figure out current state from scratch.

## How to use

1. Skim the index below for anything touching your change. The **Superseded by** column tells you which rows have known-stale parts — for those, trust the newer ADR's Decision over the older one's.
2. Read the ADR body — especially **Decision** and **Guidance**.
3. If you need to reverse a decision:
   - **Architecture ADR:** do not rewrite it. Add a new one that supersedes it, and set the old one's `status` to `superseded`.
   - **Redesign ADR, fully replaced:** same — flip `status` to `superseded`.
   - **Redesign ADR, only partly replaced** (the common case — most of a UI chapter survives, one bullet or section doesn't): don't flip the whole ADR's status. Instead, in the *same PR* that ships the change, add an inline `**Superseded YYYY-MM-DD:**` note directly under the stale bullet in the old ADR (see ADR 0019's "Not done here" section for the pattern already in use), and add that ADR's number to the new ADR's `supersedes` frontmatter and the old ADR's `superseded_by` frontmatter. This is what keeps the index's **Superseded by** column accurate — do it as part of the change, not as later cleanup.
4. **When the `liveResultBar` flag is finally removed and its behavior becomes the only path:** write one closing ADR ("UI Overhaul 3.0 shipped") summarizing final state, and only then flip every chapter ADR's `status` to `superseded` in bulk. Don't do this bulk flip early — mid-rollout, most chapters are still the live description of a Labs-flagged path.

## Format

Files: `NNNN-kebab-title.md` (monotonic numbers).

Each ADR uses YAML frontmatter + MADR-style sections:

| Section | Purpose |
|---------|---------|
| Frontmatter | `status`, `date`, `tags`, optional `supersedes`/`superseded_by` (ADR number lists) — machine-friendly filters |
| Context | Problem and forces |
| Decision | What we chose (past tense, concrete) |
| Consequences | Good and bad outcomes |
| Guidance | Do / don’t for implementers and agents |
| Related | Links to code and docs |

Statuses: `proposed` · `accepted` · `deprecated` · `superseded`.

## Index

Architecture ADRs (0001–0012, 0029) first, then redesign-chapter ADRs (0013+) in the order they shipped. **Superseded by** is blank unless a later ADR is known to replace part of that row's Decision — see that ADR for exactly which part.

| ADR | Title | Status | Superseded by | Tags |
|-----|-------|--------|----------------|------|
| [0001](./0001-record-architecture-decisions.md) | Record architecture decisions as ADRs | accepted | | process |
| [0002](./0002-accuracy-before-performance.md) | Prioritize calculation accuracy over performance | accepted | | calculator, priorities |
| [0003](./0003-pure-calculator-engine.md) | Keep calculator logic pure TypeScript | accepted | | calculator, workers |
| [0004](./0004-web-workers-for-heavy-work.md) | Run heavy work in web workers | accepted | | performance, workers |
| [0005](./0005-stores-hold-user-data-only.md) | Pinia stores hold user data only | accepted | | stores, persistence |
| [0006](./0006-no-classes-for-domain-logic.md) | Prefer modules over classes | accepted | | style |
| [0007](./0007-daisyui-and-tailwind.md) | DaisyUI + Tailwind for UI | accepted | | ui |
| [0008](./0008-per-character-modules.md) | One folder module per character | accepted | | characters, data |
| [0009](./0009-released-content-only.md) | Ship only officially released content | accepted | | product, content |
| [0010](./0010-persisted-data-migrations.md) | Version and migrate persisted user data | accepted | | persistence, migrations |
| [0011](./0011-headless-character-calculation-context.md) | Headless character calculation context for non-active-character consumers | accepted | | calculator, stores, team-rotations |
| [0012](./0012-echo-substat-ratings.md) | Echo & character substat ratings | accepted | | echoes, characters, stores |
| [0029](./0029-buff-realistic-max-stacks.md) | `realisticMaxStacks`/`realisticBaseAttrValue` are manually-authored fields, not a computed soft cap | accepted | | calculator, characters, buffs |
| [0013](./0013-live-result-bar-labs-flag.md) | Live Result Bar (Labs-flagged layout) | accepted | 0019 (bar/identity component merged into Command Bar) | calculator, components, stores |
| [0014](./0014-echo-editor-redesign.md) | Echo display/edit redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | 0028 (Set Bonus/Main Echo Buff), 0030 (build-context panel → inline tile) | calculator, components, composables, inventory |
| [0015](./0015-rotation-flow-labs-flag.md) | Rotation Flow (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, composables, stores |
| [0016](./0016-weapons-workspace-redesign.md) | Weapons workspace redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, weapons, characters |
| [0017](./0017-team-buffs-workspace-redesign.md) | Team Buffs workspace redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, buffs, characters |
| [0018](./0018-live-result-panel-tabs-redesign.md) | Full breakdown panel — Overview/Attacks/Rotations redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, stores |
| [0019](./0019-command-bar-merged-live-result-bar-and-identity.md) | Command Bar (merged live result bar + character identity) | accepted | | calculator, components |
| [0020](./0020-enemy-workspace-redesign.md) | Enemy workspace redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, enemies |
| [0021](./0021-utility-nav-dropdown-redesign.md) | Utility nav dropdown redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | components, navigation |
| [0022](./0022-settings-page-redesign.md) | Settings page redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | components, settings, stores |
| [0023](./0023-updates-page-search-and-grouping-redesign.md) | Updates page search and grouping redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | components, content |
| [0024](./0024-info-page-nested-routes-redesign.md) | Info page nested routes redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | components, routing, content |
| [0025](./0025-privacy-legal-formatting-consistency.md) | Privacy & Legal formatting consistency (Labs-flagged, shares the `liveResultBar` flag) | accepted | | components, content |
| [0026](./0026-chooser-modals-redesign.md) | Chooser modal redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, echoes, weapons, enemies |
| [0027](./0027-team-presets-browser-redesign.md) | Team presets browser redesign | accepted | | team-rotations, components |
| [0028](./0028-echo-set-bonus-v3-redesign.md) | Echo Set Bonus / Main Echo Buff redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, echoes |
| [0030](./0030-echoes-tab-v3-redesign.md) | Echoes tab v3 redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | | calculator, components, composables, echoes |

## When to write a new ADR

Write one when the choice is **hard to reverse**, **cross-cutting**, or **frequently rediscovered** (e.g. “why don’t we put X in the store?”). Skip ADRs for local refactors, one-off bugfixes, and style nits already covered by [architecture.md](../architecture.md).

**Redesign chapters specifically:** a new ADR is still the right call for each shipped chapter of an in-flight redesign (the engineering rationale is genuinely worth keeping) — the fix isn't fewer of these, it's keeping the **Superseded by** column and the old ADR's inline annotations current so a later reader doesn't have to re-derive which chapter is live. Two things to actually do, not skip:

1. Before writing the new ADR, check whether it fully or partly replaces an earlier redesign ADR's Decision. If it does, annotate the old one (see "How to use" above) in the same PR.
2. Update the area doc (`docs/src-*.md`) that describes the surface you're changing, so it reflects current behavior directly — it should never require a reader to open more than one ADR to find out what's true today. The ADR is for *why*; the area doc is for *what*.
