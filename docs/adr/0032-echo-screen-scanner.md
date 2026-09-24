---
status: accepted
date: 2026-09-22
tags: [echoes, workers, components, inventory]
---

# 32. Echo screen scanner (live share + video upload), OCR in a dedicated worker

## Context

Echoes get into the app today via manual entry or a Discord-bot generated
1920x1080 image (5 echoes per image, OCR + pixelmatch in
`CalculatorEchoParser.vue`/`echoParser.worker.ts`). A user with hundreds or
thousands of echoes (a real account reviewed for this feature had
2969/3000) has no faster path than clicking through the bot 5 at a time.

The user requested a scanner: share the WuWa game window (or upload a video
they already recorded doing this — they'd already made one), click through
the in-game Echo inventory, and have the app detect each newly-displayed
echo, OCR it, and queue it for review. A reference open-source project,
[Tacet-Lab](https://github.com/DJ12421/Tacet-Lab) (React, tesseract.js,
GPL-3.0), does both halves of this: live share and a video-file upload with
a trim range + adjustable sample rate (`ScannerView.tsx`'s
`openVideo`/`scanVideo`, backed by a `LocalVideoSource` that seeks and
samples frames). An initial pass at this ADR under-researched that — a
README-only check missed the video-upload path entirely and wrongly
concluded it needed to be designed from scratch; corrected once the user
pointed at the actual source.

Real footage was provided to ground the design instead of guessing ROIs:
11 screenshots (2880x1800) and a 49s gameplay video (2304x1440, itself a
different resolution than the screenshots, both 16:10) of a real Echo
Management click-through.

## Decision

Built `src/scanner/` (pure TS) + `src/workers/echoScanner.worker.ts` +
`src/composables/useEchoScanner.ts` + `EchoScannerCapture.vue`, wired into
`CalculatorEchoImporter.vue` as a second mode tab alongside the existing
Discord-bot image importer, both feeding the same
`mapParsedEchoes`/duplicate-review/save pipeline (extracted the mapping
functions to `src/echoes/parsedEchoMapping.ts` so both flows share one
implementation instead of drifting). **Stale as of a later revision** —
the tab was split into its own standalone modal/button; see the bottom of
this ADR for what replaced it and why.

Key choices, each with a reason:

- **ROI table is measured, not guessed.** The panel's ROI fractions were
  derived by profiling luma variance across the real screenshots (row/column
  band detection), then cross-checked against three different real capture
  resolutions that all share WuWa's 16:10 UI aspect (2880x1800, 2304x1440,
  and an earlier session's 2800x1752 sample) — same fractions held at all
  three, confirming the resolution-independent design. See
  `docs/scanner.md` and `src/scanner/layout.ts`.
- **Substat rows are individually cropped, one OCR call each** — not one
  multi-line block, and not the originally-shipped design either (see
  **Revised** below). The measurement surfaced two things a fixed row
  table has to handle: an echo below +25 reveals fewer than 5 substats
  with no reserved blank space (confirmed: a cost-3 +15 echo showed only 3
  of 5, represented as empty slots, not a shorter array), and a long stat
  label wraps to a second line. Each `SUBSTAT_ROWS` crop is taller than one
  line to still catch a wrap, and `parse.ts`'s `parseStatRow` takes only
  the first complete match per crop so that overlap never leaks a
  neighboring row in.
  **Revised:** the first shipped version of this ADR instead OCR'd the
  whole stats area as one multi-line block and had tesseract segment it
  into rows. Real usage reported missing substats — block-level line
  segmentation can silently merge or drop a row with no way to recover it.
  Reverted to individually-cropped rows (mirroring
  `CalculatorEchoParser.vue`'s own 5-separate-crop approach, which is what
  should have been followed from the start) once that was diagnosed. See
  `docs/scanner.md`'s "Substat OCR" section.
  **Superseded 2026-09-23:** per-row crops are now a fallback. The
  primary substat pass OCRs a label column and a value column separately
  and pairs them by line position, because wrapped Resonance
  Skill/Liberation labels kept pushing rows out of their fixed crops. See
  `docs/scanner.md`'s "Substat OCR" section.
- **Echo identity is narrowed by matched set + cost first, the same way
  `CalculatorEchoParser.vue`'s `filteredEchoKeys` narrowing works** — name
  text (Levenshtein vs. `mainEchoesData`) only breaks a tie within that
  narrowed pool, or serves as the fallback when the narrowing comes up
  empty; it never matches against image data, since the name is printed as
  text in the panel. Only the small **set icon** (not printed as text
  anywhere in the panel) goes through the existing `echoParser.worker.ts`
  `matchSetFirst` pixelmatch path.
  **Revised:** the first shipped version matched the name against *all*
  ~150 echoes (narrowed only by cost), never using the set match it had
  already computed to narrow further. That's a materially weaker version
  of the Discord-bot flow's own accuracy driver, and it directly
  contributed to a real "Jué" (a real, short, accented 4-cost echo name)
  coming back "Unknown echo" — set+cost alone narrows to that one echo
  with no name OCR needed at all. See `docs/scanner.md`'s "Echo
  identification" section.
- **OCR runs in its own worker** (`echoScanner.worker.ts`), unlike the
  Discord-bot flow where tesseract.js runs on the main thread — a scanning
  session can trigger OCR many times a minute and must not compete with the
  live capture/preview loop. The worker is deliberately "dumb": no
  `src/echoes/*` imports, it only preprocesses and returns raw text; all
  game-data matching happens on the main thread in `parse.ts`, keeping its
  messages plain and serializable per `docs/src-workers.md`'s conventions.
- **tesseract.js is self-hosted** (`public/tesseract/`: worker script, SIMD
  wasm core, `eng.traineddata.gz`) instead of the CDN the Discord-bot flow
  currently loads from, so a scanning session (which can run tens of OCR
  calls) isn't dependent on a third party.
- **Video upload and live share share one `FrameSource` abstraction**
  (`src/scanner/capture.ts`). Both resolve to the same `HTMLVideoElement`
  frame-grab code; only *how a tick is driven* differs — live uses a
  ~8fps real-time timer, video-file uses a deterministic seek-and-capture
  loop decoupled from real time (faster, never drops a frame to decode
  jitter, and needs no screen-share permission — useful since capture
  software the user already has is a lower-friction path than live sharing
  every time). Fingerprint/stability/layout/parse/dedupe are unaffected by
  which source is active.
- **Video upload is an explicit open → trim → scan flow**, matching
  Tacet-Lab's actual `openVideo`/`scanVideo` split rather than scanning the
  whole file blind: `capture.ts`'s `openVideoFile` loads metadata and a
  scrubbable preview frame, the user picks a start/end range and a sample
  rate (1/2/4/8 fps, default 2fps — matching Tacet-Lab's default), then
  `createVideoFileSource` runs the seek-and-capture loop only over that
  window. Lets a long recording skip past menu navigation before reaching
  the Echo screen, and trades scan thoroughness for speed deliberately
  instead of a single fixed step for every video.
- **Signature dedupe only, no grid-position tracking.** Truly identical
  echoes (same name/set/cost/main/substats) collapse to one via
  `getEchoIdentityKey`, reused from the existing Discord-bot flow.
- **Nothing auto-saves.** Every field carries per-candidate confidence;
  low-confidence fields are flagged in the review list
  (`EchoScannerCapture.vue`) before the result is handed to the existing,
  already-tested duplicate-review/save step — originally
  `CalculatorEchoImporter.vue`'s own logic directly, now
  `useEchoDuplicateReview.ts`/`EchoDuplicateReviewList.vue` shared by both
  it and `EchoScannerModal.vue` (see the bottom of this ADR).
- **Debug mode**: an opt-in checkbox that overlays every named ROI on the
  live preview and, per captured candidate, shows a thumbnail crop + OCR
  text for each region. Added after real usage reported every scanned
  echo coming back with the same wrong set — with no way to see what was
  actually being cropped, that was a guessing exercise. It immediately
  showed the cause: `SET_ICON_BOX` was badly mispositioned (an unmeasured
  guess, unlike the header/stats blocks) and was landing on background art
  instead of the icon, so `matchSetFirst` was confidently matching a muted
  background blur against all 30 set icons and always winning with the
  same one. Re-measured it the same way as the row positions (threshold a
  real screenshot's header region for bright pixels, take the bounding
  box) — see `SET_ICON_BOX`'s doc comment and `docs/scanner.md`'s "Debug
  view" section.

Shipped as one PR rather than the smaller incremental PRs a change this
size would normally be split into (per `CLAUDE.md`'s usual preference) —
explicit user direction for this feature.

## Consequences

- Pros: one capture pipeline serves both entry points; the Discord-bot
  importer and the scanner now share one mapping implementation instead of
  two that can silently drift; ROIs are grounded in real measurement instead
  of guesswork, with the measurement method documented so it can be redone
  if a UI update moves the panel; video upload gives a faster, permission-free,
  deterministic alternative to live sharing.
- Cons: only 16:10 is supported today (`isSupportedAspect`
  rejects other aspects up front rather than silently misreading them) — a
  calibration UI for non-16:10/ultrawide is a known, explicitly deferred
  follow-up, not built here; `public/tesseract/` adds ~19MB of static assets
  to the repo (fetched lazily, only when a scan session starts, so it
  doesn't affect normal app load); individually-cropped substat rows mean
  up to 8 OCR calls per candidate instead of 2, a deliberate
  accuracy-over-speed tradeoff (offset by a bigger, 3-worker OCR pool) that
  makes each candidate slower to process.

## Guidance

- Read `docs/scanner.md` for the mental model and how the ROI numbers were
  derived before changing `src/scanner/layout.ts` — don't hand-tune a
  fraction without re-measuring against a real screenshot the same way.
- Changing echo-mapping logic (flat-vs-percent substat resolution, main
  stat mapping, rank default): edit `src/echoes/parsedEchoMapping.ts`, not a
  copy inside a component — both the Discord-bot importer and the scanner
  depend on it.
- `echoScanner.worker.ts` must stay free of `src/echoes/*` imports (keeps
  its messages plain/serializable, per `docs/src-workers.md`) — add new
  game-data matching in `src/scanner/parse.ts` on the main thread instead.

## Related

- `docs/scanner.md`, `docs/src-workers.md`
- `src/scanner/*`, `src/workers/echoScanner.worker.ts`,
  `src/composables/useEchoScanner.ts`, `src/components/EchoScannerCapture.vue`
- `src/components/EchoScannerModal.vue`,
  `src/composables/useEchoDuplicateReview.ts`,
  `src/components/EchoDuplicateReviewList.vue`
- `src/echoes/parsedEchoMapping.ts`
- `tests/scanner/*`, `tests/echoes/parsedEchoMapping.test.ts`

**Revised (same rollout, before this ADR was ever marked as shipped
history):** several patterns the user spotted directly in the debug view's
real crop images led to a further round of changes, detailed in
`docs/scanner.md` rather than duplicated here — no cost or level OCR at
all (cost derived from the resolved echo's class, level unused since the
app doesn't persist it, so `NAME_BLOCK` shrank to a single-line name-only
crop); stat-row crops now exclude the leading stat-type icon glyph (real
noise source: tesseract reading it as garbage text); `SET_ICON_BOX`
tightened further after a direct screenshot comparison against a reference
icon image showed it was still too loose; and substat OCR gained a
`SUBSTAT_BLOCK` fallback pass for when the 5 per-row crops don't add up to
all 5 (their real cause: a wrap earlier in the panel shifts every row
below it down by an amount no fixed-position crop's height alone can
account for). Echo identification's narrowing is now set-only, not
set+cost, since cost is no longer read as text.

**Revised again (same rollout):** two more real-usage bugs, both found
from the user's own debug-view screenshots rather than guessed at blind.

First, set-icon matching was still unreliable even after `SET_ICON_BOX`
was tightened — because tight cropping was never the whole problem.
`matchSetFirst`/`extractImageRegion` (`echoParser.worker.ts`, shared with
the Discord-bot importer) mask background by color: any near-black pixel
is treated as transparent and ignored before `getDominantColors` runs. That
assumption holds for the Discord-bot flow's source images, which are
rendered onto a black canvas, but not for a live capture, whose panel
background behind the icon is a reddish-brown game-UI color that never
gets masked. The unmasked background pixels were corrupting the
color-family signal `matchSetFirst` weighs most heavily — exactly the
"OCR has a background, the reference icons don't" mismatch the user
suspected. Fixed in `src/scanner/capture.ts` with a new
`grabCircularMaskedBitmap`, which masks by *shape* instead of color
(alpha=0 outside a centered circle matching the icon's own round bounds)
before the crop is ever handed to the shared worker — `echoParser.worker.ts`
itself stays untouched, so the Discord-bot flow this ADR didn't intend to
touch carries zero regression risk. The debug view's set-icon thumbnail
now renders this same masked bitmap over a visible gray backdrop, so the
mask is checkable by eye, not just asserted.

Second, the `SUBSTAT_BLOCK` fallback could come back completely empty on
a block that was, by eye, clearly legible — traced to the wrap-direction
assumption in `parse.ts` being backwards from the real game layout. The
code assumed a wrapped label's value follows its *last* line (e.g.
"Resonance Skill DMG" / "Bonus 8.6%"); real captures instead put the value
on the label's *first* line, with the bare continuation word(s) trailing
on the next line ("Resonance Liberation 10.9%" / "DMG Bonus"). Confirmed
by direct comparison of a user-supplied empty-fallback crop against the
full-panel reference image. `parseStatRow`/`splitStatBlock` were rewritten
around one shared `scanStatRows()` that accumulates label text from
whichever line the value lands on, handling all three real shapes seen in
footage (single-line, value-only continuation, and label-continues-after
wrap). A second bug surfaced while fixing the first: the "is this label
already complete, stop extending it" check used `verboseStatLabelMap`
key-lookup directly, which also matches intentional *partial* aliases the
map keeps for fuzzy-matching elsewhere (e.g. `"Resonance Liberation"` is a
registered alias short of the full `"Resonance Liberation DMG Bonus"`
label) — so extension stopped one line too early. Fixed with a derived
`CANONICAL_COMPLETE_LABELS` set (the longest alias per canonical stat key)
used only for that stop condition. Regression tests in
`tests/scanner/parse.test.ts` use the user's real "Inferno Rider" OCR text
verbatim, both at the `splitStatBlock` level and end-to-end through
`parseEchoCandidate`.

**Revised a third time (same rollout):** the circular shape-mask fixed set
icons picking up the wrong *color* signal, but a side-by-side debug-view
screenshot (captured crop next to the reference icon it was matched
against) showed a second, separate problem — the captured icon read
visibly *smaller* than the reference. Cause: `matchSetFirst` stretches
both images onto the same 32x32 canvas before comparing; reference set
images are cropped with essentially no margin, but `SET_ICON_BOX`'s own
hand-measured bounds still leave some slack around the icon's real edge,
and the circular mask was inscribed in the *box's* dimensions rather than
the icon's — baking that slack in as a ring of true background color just
inside the mask. Stretched to 32x32 next to a margin-free reference, the
real icon ends up occupying a smaller fraction of the canvas, throwing off
both the color-family and pixel-diff signals. Fixed with a new
`detectIconBounds` in `capture.ts`: samples the crop's four corners
(guaranteed background in a crop with any margin) as a reference color,
thresholds every pixel by distance from it, and returns the tight
bounding box of whatever doesn't match — the icon's real edge, not the
box's. `grabCircularMaskedBitmap` re-crops to that detected box before
masking, matching the reference convention regardless of how loose
`SET_ICON_BOX` actually is, falling back to the full configured crop if
nothing is distinguishable from the corners. Unlike the rest of
`capture.ts`, `detectIconBounds` is a plain function over pixel data (no
canvas/DOM), so it's directly unit-tested in
`tests/scanner/capture.test.ts` with synthetic crops.

**Revised a fourth time (same rollout):** color and scale were both fixed,
but matching stayed inconsistent — the remaining cause was
`matchSetFirst`'s own combining weights, not the crop. It merges a
color-family match/mismatch, a crude shape heuristic, and
`compareSetIcons`'s per-pixel diff (the same comparison the Discord-bot
flow already relies on, confirmed to work well there) into one score —
but weights a color-family mismatch as a flat 100000 (an absolute veto)
and `compareSetIcons` at only 0.1x ("fine-tuning"). A live capture trips
that veto far more than the Discord-bot flow's clean rendered source
images do (video compression bleeds/shifts hue at edges in a way a
bot-rendered image never does), so one misclassified dominant color
silently disqualifies the correct set regardless of how well the
per-pixel comparison would have scored it. Rather than change the shared
weights globally — which would also change the Discord-bot flow's
results, the flow this scanner deliberately avoids touching — added an
optional `weights` parameter (`SetMatchWeights`) to `matchSetFirst`,
defaulting to the exact original hardcoded values so every caller that
omits it (every Discord-bot call site) is unaffected. `useEchoScanner.ts`
passes its own `SCANNER_SET_MATCH_WEIGHTS` on the scanner's calls only:
color-family mismatch drops from a 100000 veto to a 3000 nudge, the shape
weight drops from 5000 to 1500, and `compareSetIcons`'s weight rises from
0.1 to 1, making it primary now that the shape/scale fixes above make its
input actually match the reference convention it needs. The debug view's
crop grid now also shows the matched reference icon directly beside the
captured crop, not just a "Matched: <name>" label, for a literal
side-by-side. These particular weight values are a reasoned starting
point from the scoring math, not yet validated against a large batch of
real captures — expect further tuning from real debug-view use.

**Revised a fifth time (same rollout):** boosting `compareSetIcons`'s
weight assumed it was reliable given a properly scaled/aligned crop — a
real mismatch (a gray/white "Song of Feathered Trace" icon matched to a
dark-maroon "Dream of the Lost" reference) showed both remaining signals
can fail together on a gray/neutral icon specifically.
`classifyColorFamily`'s six hardcoded buckets all require real channel
separation, so a gray color fits none of them — `colorFamilyPenalty` only
applies when *both* sides have a nonempty family, so it silently never
engages for a gray source regardless of how different a candidate's real
color is. With that check disengaged, `compareSetIcons`'s own per-pixel
diff (confirmed by replaying both real icons through the same math outside
the worker) turned out to slightly favor the *wrong* icon — it's a raw,
unaligned position-by-position comparison, sensitive to exactly where each
icon's internal glyph lands after both get stretched to 32x32, not a
holistic color or shape check. Added `dominantColorDistance`: a plain
Euclidean distance between the two images' single most-dominant colors,
not gated by any bucket, which cleanly separated this exact pair (~78 for
the correct match, ~113 for the wrong one) where the bucketed check saw
nothing. Gated by a new `dominantColorDistanceWeight` in `SetMatchWeights`,
0 by default (true no-op for the Discord-bot flow and every other existing
caller), turned on (100) only in `SCANNER_SET_MATCH_WEIGHTS`. Additive
with `colorFamilyPenalty`, not a replacement.

**Revised a sixth time (same rollout) — a design pivot, not another
scoring tweak:** after four straight rounds of set-icon-matching fixes
(background masking, scale/alignment, scoring weights, a gray-icon color
gap) still left matching inconsistent, it was worth checking whether
set-icon-first identification was ever the right primary signal, rather
than continuing to patch the comparison algorithm. It wasn't, for a
fact-checkable reason: of the 182 echoes in `mainEchoesData`, none share a
name, but 122 (67%) support more than one set. Name text is sufficient on
its own to identify the echo, for any echo, once OCR reads it well
enough — it has no structural ceiling the way set-icon matching does.
Set-icon matching, even a hypothetically perfect one, still can't
identify the echo by itself for two-thirds of the pool, since knowing
*which set* doesn't say *which echo* when several share that set.
Set-icon matching's real, necessary job is answering a different, smaller
question — which of an already-identified echo's few legal sets did the
player equip it into — not identifying the echo in the first place.

Flipped the priority: `parse.ts`'s new `resolveEchoByNameAndCost` matches
by name (Levenshtein) first, narrowed (as a soft optimization, never a
hard filter — always retries unfiltered on a narrowed miss) by cost
inferred from the fixed secondary stat's value (`inferCostFromSecondaryStat`
— deterministic at max level, no image matching, no dependency on the
echo being known yet: 2280/100/150 for cost 1/3/4, from
`flatBonusesByRankByType`'s own rank-5 entries). Once an echo resolves,
`useEchoScanner.ts`'s `resolveEchoIdentity` checks its own `sets`: exactly
one (33% of the pool) needs no image matching *at all*; more than one
(67%) gets a *narrowed* `matchSet` call (just that echo's 2-3 real
candidates, via the same structural `compareImages` comparison the
Discord-bot flow already trusts for this exact job — not
`matchSetFirst`'s bucketed scoring). The old set-icon-first path
(`matchSetFirst` full-pool, then set-narrows-pool/name-breaks-ties,
renamed `resolveEchoBySet`) is kept as the last-resort fallback for when
name+cost can't confidently resolve an echo at all — every fix from the
four rounds above still matters there, just exercised less often.

`parseEchoCandidate` gained an optional `preResolvedEcho` input rather
than a signature rewrite: when given (name+cost succeeded), it's trusted
directly, cross-checked against the resolved `matchedSet` only for a
confidence flag; when omitted (name+cost failed), the function falls
through to the exact original set-narrows-pool logic unchanged. This kept
every one of the ~30 pre-existing `parseEchoCandidate` tests passing
byte-for-byte with zero changes — they all exercise the omitted-param
path — while 15 new tests cover `inferCostFromSecondaryStat`,
`resolveEchoByNameAndCost` (single-set, multi-set, OCR-noise-tolerant, and
cost-inference-miss-falls-back-unfiltered cases, using real echo data
checked against `src/echoes/index.ts`, not invented), and
`preResolvedEcho`'s three branches. Not yet validated against a large
batch of real captures — like every scoring-weight change above, reasoned
from checked data (the 182/122 counts), not exhaustively tuned; the debug
view's per-candidate label now names which path actually ran so that's
checkable from real usage going forward.

**Revised a seventh time (same rollout) — split out of the importer, gated
behind a labs flag, explicit privacy messaging:** with accuracy validated
against real footage at last, three product changes landed together:

- **Separate entry point, not a tab.** The scanner used to be a second
  mode tab inside `CalculatorEchoImporter.vue`'s "Import echoes" modal —
  easy to miss, and conceptually mismatched (most people looking for this
  kind of feature look for something literally called a "scanner," not a
  tab buried inside an unrelated import flow). Split into its own
  component, `EchoScannerModal.vue`, with its own "Scan echoes" button on
  the inventory page (styled `btn-secondary` to stand out next to the
  plain "Import echoes" button) and its own dialog. Inventory-only by
  design — no `character` prop, unlike `CalculatorEchoImporter.vue` — since
  scanning is naturally a "build up my inventory" action, not an
  "assign echoes to this one character" action; that also meant the split
  didn't need to preserve the old tab UI's "apply to character" path for
  the scanner side.
- **Shared duplicate-review/save logic, not copy-pasted.** Splitting the
  entry point risked duplicating `CalculatorEchoImporter.vue`'s ~250 lines
  of duplicate-detection/save/apply-to-character logic and its ~100-line
  review-list template into a second component that could silently drift
  from the first. Extracted both instead: `useEchoDuplicateReview.ts`
  (state + business logic — `handleEchoesParsed`, duplicate detection,
  `finalizeImport`, character-apply) and `EchoDuplicateReviewList.vue` (the
  review-list markup + its display-only helpers). Both
  `CalculatorEchoImporter.vue` (now Discord-bot-image only, tab UI removed)
  and `EchoScannerModal.vue` compose the same two pieces with their own
  thin modal wrapper around them — a fix to duplicate detection or the
  save pipeline now can't land in only one of the two entry points.
- **Gated behind a new `echoScanning` labs flag** (`SettingsLabs.vue`),
  same on/off-by-default mechanism as `liveResultBar`
  (`settingsStore.labs.<key>.isEnabled`, no migration needed since `labs`
  is already a generic record) — explicit ask, so the feature can keep
  iterating without every user seeing it by default while it does. The
  "Scan echoes" button and `EchoScannerModal.vue` itself are both
  `v-if`-gated on the flag; the old ungated tab access point is gone
  (replaced by this gated one), so there's no second, ungated way in.
- **Explicit, prominent privacy messaging.** The intro screen already had
  a one-line "processed in your browser" mention; added a dedicated
  `alert-info` callout ahead of the feature description stating plainly
  that neither screen sharing nor video upload ever sends anything to a
  server — no upload, no account, nothing stored beyond the current
  session, on either path — specifically so hesitant users don't have to
  infer that from the code or take it on faith from a buried sentence.

## Related (updated)

- `src/components/EchoScannerModal.vue`,
  `src/composables/useEchoDuplicateReview.ts`,
  `src/components/EchoDuplicateReviewList.vue`, `src/components/SettingsLabs.vue`
