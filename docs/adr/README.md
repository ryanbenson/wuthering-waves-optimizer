# Architecture Decision Records (ADRs)

Short, immutable records of **important** technical and product decisions. Written so both humans and coding agents can apply them without re-deriving the debate.

## How to use

1. Skim the index below for anything touching your change.
2. Read the ADR body — especially **Decision** and **Guidance**.
3. If you need to reverse a decision, **do not rewrite** the old ADR. Add a new one with `status: accepted` that supersedes it, and set the old one to `superseded`.

## Format

Files: `NNNN-kebab-title.md` (monotonic numbers).

Each ADR uses YAML frontmatter + MADR-style sections:

| Section | Purpose |
|---------|---------|
| Frontmatter | `status`, `date`, `tags` — machine-friendly filters |
| Context | Problem and forces |
| Decision | What we chose (past tense, concrete) |
| Consequences | Good and bad outcomes |
| Guidance | Do / don’t for implementers and agents |
| Related | Links to code and docs |

Statuses: `proposed` · `accepted` · `deprecated` · `superseded`.

## Index

| ADR | Title | Status | Tags |
|-----|-------|--------|------|
| [0001](./0001-record-architecture-decisions.md) | Record architecture decisions as ADRs | accepted | process |
| [0002](./0002-accuracy-before-performance.md) | Prioritize calculation accuracy over performance | accepted | calculator, priorities |
| [0003](./0003-pure-calculator-engine.md) | Keep calculator logic pure TypeScript | accepted | calculator, workers |
| [0004](./0004-web-workers-for-heavy-work.md) | Run heavy work in web workers | accepted | performance, workers |
| [0005](./0005-stores-hold-user-data-only.md) | Pinia stores hold user data only | accepted | stores, persistence |
| [0006](./0006-no-classes-for-domain-logic.md) | Prefer modules over classes | accepted | style |
| [0007](./0007-daisyui-and-tailwind.md) | DaisyUI + Tailwind for UI | accepted | ui |
| [0008](./0008-per-character-modules.md) | One folder module per character | accepted | characters, data |
| [0009](./0009-released-content-only.md) | Ship only officially released content | accepted | product, content |
| [0010](./0010-persisted-data-migrations.md) | Version and migrate persisted user data | accepted | persistence, migrations |
| [0011](./0011-headless-character-calculation-context.md) | Headless character calculation context for non-active-character consumers | accepted | calculator, stores, team-rotations |
| [0012](./0012-echo-substat-ratings.md) | Echo & character substat ratings | accepted | echoes, characters, stores |
| [0013](./0013-live-result-bar-labs-flag.md) | Live Result Bar (Labs-flagged layout) | accepted | calculator, components, stores |
| [0014](./0014-echo-editor-redesign.md) | Echo display/edit redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | calculator, components, composables, inventory |
| [0015](./0015-rotation-flow-labs-flag.md) | Rotation Flow (Labs-flagged, shares the `liveResultBar` flag) | accepted | calculator, components, composables, stores |
| [0016](./0016-weapons-workspace-redesign.md) | Weapons workspace redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | calculator, components, weapons, characters |
| [0017](./0017-team-buffs-workspace-redesign.md) | Team Buffs workspace redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | calculator, components, buffs, characters |
| [0018](./0018-live-result-panel-tabs-redesign.md) | Full breakdown panel — Overview/Attacks/Rotations redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | calculator, components, stores |
| [0019](./0019-command-bar-merged-live-result-bar-and-identity.md) | Command Bar (merged live result bar + character identity) | accepted | calculator, components |
| [0020](./0020-enemy-workspace-redesign.md) | Enemy workspace redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | calculator, components, enemies |
| [0021](./0021-utility-nav-dropdown-redesign.md) | Utility nav dropdown redesign (Labs-flagged, shares the `liveResultBar` flag) | accepted | components, navigation |

## When to write a new ADR

Write one when the choice is **hard to reverse**, **cross-cutting**, or **frequently rediscovered** (e.g. “why don’t we put X in the store?”). Skip ADRs for local refactors, one-off bugfixes, and style nits already covered by [architecture.md](../architecture.md).
