---
name: pr-review
description: Review a pull request or the local branch against this repo's rules — security and injection risks, calculation/persistence risk, package and dependency changes, docs and ADR changes, consistency with CLAUDE.md and docs/ standards, unit-test coverage and Cypress E2E coverage. Reports only Blockers, Should fix items and Nitpicks, in plain English, as one body comment (never inline comments). Use whenever the user asks to review a PR, review their branch/changes before opening a PR, or check someone else's PR.
---

# PR review

Produces **one plain-English review body**, grouped by severity, containing **only Blockers, Should fix items and Nitpicks**. No praise, no "looks good", no informational notes, no summaries of what the PR does, no inline/line comments.

## 0. Pick the target

| Invocation | Target | Base |
|------------|--------|------|
| no args | current branch, including uncommitted changes | `master` (merge-base) |
| `<PR number>` or PR URL | that GitHub PR | the PR's base branch |
| `<branch>` | that branch | `master` (merge-base) |

Optional flag: `--post` — post the finished review to the PR without asking first (PR targets only).

Get the diff:

```bash
# Local / branch
git fetch origin master
BASE=$(git merge-base origin/master HEAD)       # or <branch> instead of HEAD
git diff --stat $BASE                           # add HEAD/<branch> when not reviewing the working tree
git diff $BASE
git log --format='%h %s' $BASE..HEAD

# PR (prefer gh; if gh is missing, fall back to git)
gh pr view <N> --json title,body,baseRefName,headRefName,author,files,commits
gh pr diff <N>
# fallback:
git fetch origin pull/<N>/head:pr-<N> && git diff $(git merge-base origin/master pr-<N>) pr-<N>
```

Never check out someone else's PR branch over the user's working tree — diff it by ref. Never run scripts, `npm i`, or install hooks from an untrusted PR's code; for external PRs, only read the diff unless the user says it's safe to run.

Read the full current version of every changed file that's not trivially small — a diff hunk alone hides the surrounding context (missing migration, wrong caller, a test that no longer asserts anything).

## 1. Review checklist

Work through every section. Each finding must point at a specific file (and line when it helps) and say concretely what's wrong and what to do instead. If you can't say what breaks, it's not a Blocker.

### Security and injection

- `v-html`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` with anything not a hard-coded constant — XSS. User-imported data (build exports, Wavescan JSON, OCR text, URL params, localStorage) is untrusted.
- `eval`, `new Function`, `setTimeout`/`setInterval` with a string argument, dynamic `import()` of a computed path.
- Unvalidated JSON imports (`JSON.parse` of user files/clipboard/URL) that are spread into stores or objects without shape checks — prototype pollution (`__proto__`, `constructor`), and keys used to index objects.
- URLs built from user input (`href`, `src`, `window.open`, `fetch`) — `javascript:` URLs, open redirects, missing `rel="noopener noreferrer"` on `target="_blank"`.
- `postMessage` without an origin check; worker messages that carry functions or non-serializable objects.
- Secrets, tokens, API keys, `.env` content, or personal data committed anywhere (code, fixtures, docs, test snapshots).
- CLI (`cli/`): shell commands built by string concatenation (`exec`, `execSync` with interpolation), file paths from API data written without sanitising (path traversal).
- GitHub Actions changes: `pull_request_target`, untrusted `${{ github.event.* }}` interpolated into `run:`, widened `permissions:`, unpinned third-party actions, new publish/secret usage.
- Third-party requests: new external hosts, analytics, or tracking added to the shipped app.

### Risk to the non-negotiable priorities (CLAUDE.md order)

1. **Calculation accuracy** — any change under `src/calculator/`, `packages/formulas/`, `src/characters/`, `src/weapons/`, `src/echoes/`, `src/buffs/` that changes numbers. Check: unit tests updated under `tests/calculator/` (or the matching `tests/` area); both main-thread and worker paths if the code is shared; buff/modifier key changes followed through character buffs, team buffs, resonance chains and weapon passives; values anchored to real numbers per `docs/accuracy-verification.md`.
2. **Performance** — new work in hot paths (stat/damage recalcs, optimizer loops, computed properties re-run on every change); O(n²) where a map would do; heavy work on the main thread that belongs in a worker.
3. **Persisted user data** — any change to a Pinia store's shape, persisted keys, or export/import format **must** bump the version and add a migration in `src/migrations/` with a test. Renamed/removed keys without a migration silently corrupt saved builds = Blocker.
4. **Incremental change** — PR is doing several unrelated things, or a rewrite where a small change would do.

### Repo hard rules (CLAUDE.md, docs/architecture.md)

- No Vue, DOM, or Pinia imports inside `src/calculator/` or `src/workers/`. Workers receive plain objects only.
- Stores hold user input only — no game data, constants or computed results in Pinia.
- No classes for domain logic.
- New Vue code uses `<script setup>` / Composition API and TypeScript; no new `any`/`@ts-nocheck` without reason.
- DaisyUI + Tailwind only; semantic theme tokens (`bg-base-100`, `text-base-content`), no hard-coded light/dark colours; works in both themes.
- Heavy work (OCR, optimizer batches) in workers.
- **No unreleased content reachable in production**, and no links/citations to third-party datamine sites (e.g. encore.moe) in user-facing UI or copy.
- Packages (`packages/*`): logic changed without a version bump in that package's `package.json` when it needs publishing; app-side re-export shims (`src/calculator/calculator.ts`, `src/scanner/*`) out of sync.
- `src/scanner/scannerData.ts` changes alter the public `/scanner-data.json` contract used by Wavescan — breaking shape changes need a note in `docs/scanner.md` / the ADR.
- New character/weapon/echo: registered in the registry (`characters.ts`, `weapons.ts`, etc.) and follows the matching skill's checklist.
- Consistency with surrounding code: naming, file placement, comment density, existing helpers reused instead of duplicated.
- Branch and PR title follow `docs/conventions.md` (`<type>: <description>`, lowercase, no trailing period; branch `<type>/[issue-]<slug>`).

### Package and dependency changes

Always call out every change to `package.json`, `package-lock.json`, `packages/*/package.json`:

- Added/removed/upgraded dependencies — is it needed, is it a dev vs runtime dependency in the right section, bundle-size impact for runtime deps, licence compatible with GPL-3.0-or-later, well-maintained.
- Major version bumps — breaking changes handled?
- Lockfile changed with no `package.json` change (or vice versa) — unexplained.
- New `postinstall`/`prepare` scripts or changed `scripts` entries.
- `engines` changes.

Unexplained or unjustified dependency additions are Blockers; justified ones with a real concern (wrong section, heavy for what it does) are Should fix.

### Docs and ADRs

- Behaviour or architecture changed but the matching `docs/src-*.md` area doc wasn't updated → Blocker for architectural changes, Should fix for small behaviour changes.
- New/changed ADR (`docs/adr/`):
  - Number is next in sequence and **not already used on `master`** (`git ls-tree origin/master docs/adr/`) — parallel branches collide.
  - Has frontmatter (`status`, `date`, `tags`, optional `supersedes`/`superseded_by`) and Context / Decision / Consequences / Guidance / Related sections.
  - Added to the index in `docs/adr/README.md` (correct table section, no duplicate rows).
  - If it partly or fully replaces an older ADR: old ADR annotated in the same PR (`**Superseded YYYY-MM-DD:**` note or `status: superseded`) and both `supersedes`/`superseded_by` frontmatter + the index's **Superseded by** column updated.
  - An existing accepted ADR's Decision was rewritten in place instead of superseded, or a lasting decision shipped with no ADR at all → Blocker. Wrong annotation format, missing index/frontmatter updates, or stale references in an ADR → Should fix.
- Links in changed docs point at files that exist.
- `CLAUDE.md` / skills changed — still accurate against the code?

### Test coverage

Run unit tests with coverage scoped to the changed source files (skip for untrusted external PRs unless the user approves running them):

```bash
npx vitest run --coverage --coverage.include='src/path/changed.ts' --coverage.include='packages/x/src/changed.ts'
```

Also run the related test files directly if quicker (`npx vitest run tests/<area>`). Report:

- New or changed logic with no unit test exercising it (especially calculator, migrations, stores, parsers, scanner) → Blocker for calculator/migration/import logic, Should fix otherwise.
- Changed-file line coverage noticeably low for new branches (name the uncovered functions/branches, not just a percentage).
- Tests that were deleted, skipped (`.skip`, `.only`, `xit`), or weakened (assertions removed, snapshot blindly updated).
- Failing tests or type-check (`npx vue-tsc --noEmit`) → Blocker; include the failing test name and the one-line reason.

### E2E coverage

Don't run Cypress by default (slow, needs the dev server). Instead, check `cypress/e2e/` for specs covering the changed user flow (grep for the component's `data-testid`s, route, or feature name):

- New user-facing flow or significant UI change with no Cypress spec added/updated → Should fix (Blocker if it's a critical flow: calculator results, optimizer, import/export, migrations of saved builds).
- Changed `data-testid`/selectors that existing specs rely on but weren't updated → Blocker.
- Mention the exact `npm run cypress:run:<suite>` the author should run when a suite is clearly affected.

### Anything else worth catching

- Bugs: off-by-one, null/undefined not handled, wrong condition, stale reactive state, missing `await`, unhandled promise rejections, leaked event listeners/workers/timers.
- Leftover `console.log`, `debugger`, commented-out code, TODOs without an issue.
- Accessibility regressions in new UI (missing labels, non-button clickable divs, no keyboard access).
- Files that look accidentally committed (build output, screenshots, local config, large binaries).

## 2. Severity

- **Blocker** — must be fixed before merge: security issue, wrong numbers, user data loss/corruption, broken build/tests, hard-rule violation, unreleased content shipped, unjustified dependency, missing migration, missing tests for calculator/migration logic, ADR process violations.
- **Should fix** — a real problem that wouldn't break anything today but will mislead someone or cost something later, so it belongs in this PR: docs/ADRs out of sync with the code, misleading names (including analytics event/source names), accessibility issues, test gaps in non-critical code, a pre-existing problem the PR makes worse, a dependency in the wrong section.
- **Nitpick** — purely cosmetic, fine to skip: formatting/indentation, comment wording, minor naming preference, small cleanup with no behavioural or reader impact.

When a finding sits between two levels, pick the lower one unless you can say concretely what goes wrong. Nothing else. If a finding is neither, drop it. Verify each finding against the actual code before including it — a wrong Blocker costs more than a missed Nitpick.

## 3. Output format

One markdown body, exactly this shape. Omit a section if it has no findings. If there are no findings at all, the whole body is: `No blockers, should-fix items or nitpicks found.`

```markdown
## Blockers

1. **<short title>** — `path/to/file.ts:123`
   <Plain-English explanation of what's wrong and what happens because of it, then what to do instead. 1–4 sentences.>

## Should fix

1. **<short title>** — `path/to/file.ts`
   <Plain-English explanation and suggested fix.>

## Nitpicks

1. **<short title>** — `path/to/file.vue`
   <Plain-English explanation and suggested fix.>
```

Writing rules:

- Plain English, written for a person — no jargon dumps, no "LGTM", no praise, no restating the PR description, no "consider maybe possibly".
- One finding per item; group repeated instances of the same issue into one item listing every location.
- Order within each section: most severe/impactful first.

## 4. Delivering it

- **Local / branch review:** print the body in the terminal. Don't post anything.
- **PR review:** show the body, then ask before posting unless `--post` was given. Post it as a single body comment — never inline/line comments, never an approve/request-changes verdict unless the user asks:

  ```bash
  # write the body to a file in the scratchpad, then
  gh pr comment <N> --body-file <path>
  ```

  If `gh` isn't installed or authenticated, give the user the body to paste and say so.
