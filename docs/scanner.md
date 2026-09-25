# `src/scanner` — Echo screen scanner

Lets a user share their WuWa game window (or upload a video they already
recorded) and click through their in-game Echo inventory; the app detects
each newly displayed echo, OCRs it, and queues it for review instead of
requiring the Discord-bot image or manual entry. All client-side — no
server, no upload. See [ADR 0032](./adr/0032-echo-screen-scanner.md) for why.

## Mental model

```
capture.ts (FrameSource: live share or uploaded video)
  → grab a small crop of the detail panel + the stat rows every tick
  → fingerprint.ts + stability.ts: cheap "did the panel settle on
    something new?" gate — no OCR yet (coarse panel fingerprint AND a
    fine stat-rows fingerprint; see "Change detection" below)
  → on settle: snapshot every crop from that one frame (name, main-stat,
    fixed-secondary, both substat columns, set icon, fallback rows/block)
    and queue it — see "Capture queue" below; sampling never pauses for OCR
  → queue.ts runs one snapshot at a time, in capture order:
      → echoScanner.worker.ts: OCR each crop separately (tesseract.js,
        self-hosted), returning text plus each line's vertical position
      → echoParser.worker.ts: matchSetFirst (existing set-icon matcher, reused)
  → parse.ts pairs each substat value with the label line at its height
  → if that doesn't add up to all 5 substats: one more batch OCRs the 5
    per-row SUBSTAT_ROWS crops plus the wider SUBSTAT_BLOCK crop as
    fallback passes; whichever pass recovers the most wins
  → parse.ts: raw OCR text + matched set → ParsedEchoSlot candidate (echo
    identity: narrow mainEchoesData by the matched set first, same as
    CalculatorEchoParser.vue's filteredEchoKeys minus its cost half —
    this scanner doesn't read cost — then Levenshtein name-text match to
    break a tie within that narrowed pool; cost is then derived from the
    resolved echo's own class, not read as text at all; level isn't read
    either — every scanned echo is assumed max-level, since the app
    doesn't persist echo level today)
  → dedupe.ts: signature-based (getEchoIdentityKey) — identical echoes collapse
  → useEchoScanner.ts (composable) owns all of the above, exposes a
    reviewable candidate list
  → EchoScannerCapture.vue: UI, emits the same `echoes-parsed` event shape
    CalculatorEchoParser.vue already emits
  → EchoScannerModal.vue: its own standalone modal ("Scan echoes" button,
    inventory page) — shares the actual duplicate-review/save pipeline
    with CalculatorEchoImporter.vue's Discord-bot-image flow via
    useEchoDuplicateReview.ts + EchoDuplicateReviewList.vue, rather than
    being a tab inside that importer (an earlier design — see ADR 0032)
```

`src/scanner/*` is pure TS (no Vue/DOM beyond the browser APIs the capture
layer itself needs — `HTMLVideoElement`, `File`, canvas). `echoScanner.worker.ts`
is intentionally dumb: it never imports `src/echoes/*`, so it only ever
returns raw recognized strings — all game-data lookups happen on the main
thread in `parse.ts`, keeping the worker's messages plain and serializable.

## Change detection: two fingerprints, not one

Each tick produces two cheap luma fingerprints (`fingerprint.ts`), and
`stability.ts` treats two frames as "the same echo" only if **both** match:

- **Panel** — `PANEL_BOX` at 32x16, compared by mean distance. Tolerant of
  the animated portrait art; catches a different echo name/art/main stat.
- **Stats** — `STATS_BLOCK` (main stat row through `SUBSTAT_BLOCK`) at
  64x48, compared by *changed-cell count* (cells whose luma moved > 0.1).
  A changed substat digit is a handful of cells here.

Why both: WuWa's default inventory sort is by echo name, so a run of the
same echo (same art, name, and often main stat) sits back to back. Those
differ only in substat text, which the coarse panel mean dilutes to well
under its threshold — the original panel-only gate dropped every echo
after the first in such a run as a "repeat" before OCR ever ran (real
report: five Inferno Rider / Crit DMG echoes in a row scanned as one).

Thresholds lean toward re-scanning: a missed echo is silently lost, while
a spurious re-scan of the same echo is collapsed by `dedupe.ts`'s
signature check. Settling uses a looser stats bound (`statsSettleCells`)
than novelty (`statsNoveltyCells`) so a few noisy cells can't stall it.

## Two capture sources, one pipeline

`src/scanner/capture.ts` exposes `createScreenShareSource()` and
`createVideoFileSource(file)`, both resolving to the same `FrameSource`
shape (an `HTMLVideoElement` plus a `start`/`stop`). Only *how a tick is
driven* differs:

- **Live** (`getDisplayMedia`): a fixed ~8fps timer over real elapsed time.
  The tick itself never waits on OCR (see "Capture queue").
- **Video file**: a deterministic **seek-and-capture** loop — step
  `currentTime` forward, await `seeked`, capture, repeat — decoupled from
  real time. This is faster than live (a ~49s clip becomes ~100 sequential
  captures processed back-to-back, no live-decode frame drops) and needs no
  screen-share permission prompt. It exists because a user is likely to
  already record their click-through with existing capture software (OBS,
  GeForce Experience, a phone) rather than share live every time.

Everything downstream of `FrameSource` (fingerprint, stability, layout,
parse, dedupe) doesn't know or care which source is active.

### Video upload: open → trim → scan

Uploading a video is an explicit three-step flow (`capture.ts`'s
`openVideoFile` / `seekPreview` / `createVideoFileSource`,
`useEchoScanner.ts`'s `openVideo` / `previewSeek` / `startVideoScan`,
`EchoScannerCapture.vue`'s "trimming" status), matching the reference
project [Tacet-Lab](https://github.com/DJ12421/Tacet-Lab)'s actual
`ScannerView.tsx` (`openVideo`/`scanVideo`, backed by a `LocalVideoSource`)
rather than scanning a whole file blind:

1. **Open**: load metadata and a scrubbable preview frame, no scanning yet.
2. **Trim**: the user picks a start/end range (skip past menu navigation
   before reaching the Echo screen) and a sample rate — 1/2/4/8 frames/sec,
   default 4fps (2fps missed echoes clicked through every 1-2s, since the
   settle gate needs 3 matching samples in a row). Scrubbing the range calls
   `seekPreview` so the mounted `<video>` preview updates live.
3. **Scan**: `createVideoFileSource` runs the seek-and-capture loop only
   over the chosen window at the chosen rate.

(An earlier pass at this doc/ADR incorrectly concluded, from a README-only
check, that Tacet-Lab didn't support video upload at all — it does, and
this flow was built to match its actual approach once that was corrected.)

## Capture queue: sampling never waits for OCR

Before this, the live tick loop skipped every tick while the previous
echo was still being OCR'd (one echo is 5-11 OCR crops plus a set-icon
match, often a couple of seconds). An echo clicked past during that window
was never seen at all. Real report: 36 echoes clicked every ~5s scanned
33; clicked every ~2s, only 25.

Now `handleTick` is synchronous. On `stable-novel` it:

1. calls `snapshotFrame`, which starts **every** crop the candidate could
   need from the current frame: the five primary crops, the masked set
   icon, the five `SUBSTAT_ROWS` plus `SUBSTAT_BLOCK` fallbacks, and the
   debug crops if debug mode is on. Each `grab*` helper in `capture.ts`
   draws to its own canvas synchronously before its first `await`, so
   starting them all in one synchronous block pins them to the same frame;
2. calls `stability.commitScan` right away, not after OCR, or the next
   ticks would queue the same echo again;
3. enqueues the snapshot on `queue.ts`'s `createSerialQueue`.

`processJob` then OCRs, matches, and parses one snapshot at a time, in
capture order (the OCR worker already spreads one job's crops over its
tesseract pool, so running two jobs at once would only split that pool).

This also fixed a mixed-echo bug. The set icon and the fallback crops
used to be grabbed from the live video *after* the first OCR pass
returned. If the user had clicked on by then, echo A's name and main
stat could be paired with echo B's set or substats. The fallback and
set-icon crops are now always grabbed up front, even though they're
only sometimes used (unused bitmaps are closed after the job).

Memory: a snapshot is a few MB of small crops. A live share has no cap,
since the user is still clicking and can't be made to wait. A video file
can wait, so its seek loop pauses while `VIDEO_MAX_PENDING` (3) snapshots
are queued.

Stopping: **Stop** (and a video reaching its end) ends capture at once
(the screen share indicator goes away right then), then status stays
`stopping` while the queue drains, with a "still reading N more" line in
the results view. Continue and Scan again are disabled until it finishes.
Workers are released only after that. Unmounting the component instead
calls `abort()`: it drops queued snapshots and tears everything down
immediately. Each session gets a fresh queue and a `session` number, so a
job still in flight from an aborted session drops its result instead of
writing into the next one.

Debug mode adds a timing table (`EchoScannerTimings.vue`): the gap between
live ticks, split by whether the page was visible or hidden (the game full
screen on top), how long each snapshot waited in the queue, OCR + parse
time, and the deepest the queue got. The live timer targets 125ms. A
hidden-page gap near 1000ms means the browser is throttling the timer,
which is the next thing to fix (driving ticks from a worker timer or
`MediaStreamTrackProcessor` instead of a main-thread `setInterval`).

### Cleanup: nothing keeps running once you're done

Nothing here ever leaves the browser (see `EchoScannerCapture.vue`'s
intro-screen callout — no server, no upload), which makes cleanup a real
promise, not just a data-handling one: a screen-share stream or an open
video file left running in the background *is* the privacy problem, not
just a resource leak, if the app doesn't reliably stop it once the user is
done. Every capture path releases the same way:

- **Live share**: `createScreenShareSource`'s `stop()` calls
  `track.stop()` on every `MediaStreamTrack` (this is what actually turns
  off the browser's own "you are sharing your screen" indicator, not just
  detaching the `<video>`), clears `srcObject`, removes the element, and
  drops this module's own reference to the `MediaStream` (`stream = null`)
  rather than relying only on the returned `FrameSource` closure eventually
  becoming unreachable — `track.stop()` is what actually matters here, the
  explicit null is just defense-in-depth so there's no lingering local
  reference to the stream at all once `stop()` has run. It's also wired to
  the *track's own* `ended` event, so ending the share from the browser's
  native "Stop sharing" UI (not just this app's own Stop button) is caught
  the same way — the composable's state doesn't stay out of sync with a
  stream the user already stopped through Chrome/Edge's own
  chrome.
- **Video upload**: `closeVideoHandle` pauses the element,
  `URL.revokeObjectURL`s the blob URL, and removes the element — same
  whether the video finished scanning normally, the user hits Cancel
  during trim, or hits Stop mid-scan.
- **Component unmount**: `useEchoScanner.ts` registers an `onBeforeUnmount`
  that calls `abort()` whenever the composable's owning component
  (`EchoScannerCapture.vue`) disappears while a session was still
  `starting`/`running`/`trimming`/`stopping`. That's the safety net for
  "the modal closed out from under an active session," not just the
  explicit Stop/Cancel buttons. Unlike Stop, it doesn't let the capture
  queue drain first (see "Capture queue").
- **The `<dialog>` itself**: `EchoScannerModal.vue`/`CalculatorEchoImporter.vue`
  wire `@close` on the `<dialog>` element itself, not just `@click` on the
  backdrop and ✕ button — a real gap found from asking "does this actually
  cover every way to close it": a native `<dialog>` shown via `showModal()`
  closes on **Escape** directly, bypassing both click handlers entirely.
  Without the `@close` listener, Escape left the modal's own `isOpen` state
  stuck `true` (dialog visually gone, `EchoScannerCapture.vue` still
  mounted underneath, its unmount cleanup never firing) — exactly the
  wrong failure mode for a feature whose whole pitch is "nothing keeps
  running once you're done." `triggerCloseModal` is idempotent (closing an
  already-closed dialog, or resetting empty state, are no-ops), so it's
  safe that both the click path and the native close event can end up
  calling it.

If a future change adds another way to dismiss either modal (a keyboard
shortcut, a route change, etc.), route it through the same
`triggerCloseModal`/`onBeforeUnmount` machinery rather than adding a new
one-off close path — that's exactly the kind of path the Escape-key gap
above shows is easy to miss.

## ROI layout — how the numbers in `layout.ts` were derived

All regions are **fractions of the full captured frame**, not fixed pixels —
required because the live stream, an uploaded video, and a future
calibration screenshot can each arrive at a different resolution. The
fractions in `layout.ts` are **measured, not guessed**, off real
screenshots and a real gameplay video the user provided, using simple
Python/PIL luma-variance and brightness-threshold scans (row/column bands,
bounding boxes) rather than eyeballing crops — every constant's doc
comment says what was actually measured.

- Row bands: the main-stat row starts at a fixed fraction of frame height
  (~0.384) with a consistent ~0.0373 pitch between single-line rows,
  **regardless of capture resolution** — checked against three real
  resolutions that share the 16:10 reference aspect: 2880x1800,
  2304x1440, and 2800x1752.
- **No cost or level OCR.** The app doesn't persist echo level (every
  scanned echo is assumed max-level), and cost is derived from the
  resolved echo's own class once name+set narrow it down — the same
  fallback `CalculatorEchoParser.vue` already has for when its own cost
  OCR misses, just always taken here. That means the old multi-purpose
  header crop shrank to `NAME_BLOCK`: the name line only, single-line,
  fixed height — WuWa shrinks the font for a long name rather than
  wrapping it, checked against both a short name ("Thousand-Puppet
  Pavilion") and a long one ("Reminiscence - Nightmare: Adam Smasher").
- **Stat-row crops exclude the leading stat-type icon glyph** (the small
  icon matching `subStatIconMap`, e.g. a sword for ATK, that sits before
  every row's label). A real debug-crop capture showed tesseract reading
  that icon as garbage text ahead of the real label ("QQ HP 957", "% DEF")
  — measured the icon/text gap directly (a column-variance scan across a
  real row) and shifted every stat row's left edge past it, rather than
  relying only on `parseStatRow`'s noise-tolerance to work around it.
- `SET_ICON_BOX` has had three revisions, all from real usage — see "Set
  icon matching" below for the geometry history and the (larger) separate
  fix to how the crop is matched, not just how tightly it's cropped.
- `SUBSTAT_BLOCK` spans all 5 substat rows plus wrap allowance. The
  primary substat regions, `SUBSTAT_LABEL_COLUMN` and `SUBSTAT_VALUE_COLUMN`,
  split that same span at x = 0.905. That split was measured with a
  bright-text column scan over 11 real 2880x1800 Echo screenshots: label
  text always ends at or before 0.887 (the longest one-line label, "Heavy
  Attack DMG Bonus"), and the right-aligned values always start at or after
  0.922. The split sits in the middle of that gap. See "Substat OCR" below.
- 16:10 is the measured reference; 16:9 is mapped onto it (next section).
  Any other aspect ratio is rejected up front (`isSupportedAspect`) rather
  than silently producing garbage; a calibration UI for ultrawide and other
  aspects is a known follow-up, not built here.

### Aspect ratios

Every `RegionFrac` in `layout.ts` is a fraction of a **16:10** frame
(`REFERENCE_ASPECT`). WuWa scales the Echo Management UI with the frame's
**width** and anchors it to the top, so on a 16:9 frame the panel sits at
the same x fractions but every y/height fraction is 10/9 larger ((16/9) /
(16/10)). `regionForFrame` applies that mapping, and `toPixelRegion` (every
crop) and `regionPercentStyle` (every debug overlay) go through it, so no
caller needs a second ROI table. It snaps to the matched supported aspect
(`SUPPORTED_ASPECTS`, ±0.05) rather than the frame's exact ratio, so 16:10
captures a few pixels off (2800x1752) resolve exactly as they did before.

Verified against a real 16:9 Echo Management screenshot (1400x788, a
downscaled JPEG): the mapped boxes landed on their targets, including the
tight `SET_ICON_BOX` and the `SUBSTAT_COLUMN_SPLIT_X` gap. Tesseract read
the mapped name, main/secondary rows, and label/value columns correctly,
including a wrapped "Resonance Liberation / DMG Bonus". A full-resolution
16:9 capture (1920x1080 or 2560x1440) is still worth checking in-app with
debug mode on.

Not handled: a 16:9 game **letterboxed** inside a 16:10 capture (e.g. a 16:9
window on a 16:10 laptop shared as the whole screen). The frame reads as
16:10 but the content is offset by the black bars. The guide's "share the
Window, not the screen" step avoids this.

If a future WuWa UI update moves the panel, re-run the same kind of
measurement against a fresh screenshot before touching the fractions by feel.

## Substat OCR: label and value columns first, per-row and block as fallbacks

Substats are the part of the panel that shifts from echo to echo. A long
label ("Resonance Skill DMG Bonus", "Resonance Liberation DMG Bonus") wraps
to a second line, and WuWa doesn't reserve space for the wrap, so every row
below it moves down by a varying amount. The scanner has had three designs
for this:

1. **One multi-line block** (the first version). Tesseract's own line
   segmentation sometimes merged two rows or dropped one, with no way to
   recover it afterward.
2. **Five fixed per-row crops** (`SUBSTAT_ROWS`), mirroring
   `CalculatorEchoParser.vue`'s Discord-bot approach, with `SUBSTAT_BLOCK`
   as a fallback. A wrap above a row pushes that row's text out of its
   fixed crop. Crops were made taller than one line to compensate, which
   then caught a neighboring row's text. Resonance Skill/Liberation rows were
   the main source of EMPTY substats, and some shifted rows were read with
   another row's value without any warning.
3. **Label and value columns** (current primary pass, the user's idea). The
   substat span is split into `SUBSTAT_LABEL_COLUMN` and
   `SUBSTAT_VALUE_COLUMN` (see "ROI layout" for the measured split). Each
   is OCR'd once, and the worker returns every line's vertical bounds
   along with its text.

Why columns work: values never wrap, so the value column always reads one
clean line per row. A wrap only adds a line to the *label* column, and the
value is right-aligned to the label's *first* line. `parse.ts`'s
`parseSubstatColumns`:

- keeps value lines that are numbers after trimming punctuation around them;
- pairs each value with the unpaired label line whose vertical center is
  closest, within half a line height;
- appends the unpaired label line directly below a paired one as its
  continuation ("Resonance Skill DMG" + "Bonus", "Resonance Liberation" +
  "DMG Bonus"), but only when it starts within 1.85x a value line's height
  (top to top) and the merged text reads as one known label. Measured on
  real crops: a continuation starts ~1.65-1.75x below, the next row ~2.05x,
  and the Echo Skill text below the last substat ≥ 3x;
- drops any pair whose label isn't a plausible stat name. The columns run
  past the last substat into the Echo Skill description, which otherwise
  pairs stray digits with description text.

Pairing by position rather than list index means one dropped or garbled
line only costs its own row. ATK vs ATK% (and HP/DEF) still comes from the
paired value's `%`, the same as every other path.

Measured against the old per-row + block pipeline on the same 11 real
screenshots (real tesseract.js output, same preprocessing), the column pass
read every substat correctly. The old pipeline garbled one row
("Cl IL. RdlC 0.970" for "Crit. Rate 6.3%"), and on one echo it assigned
two values to the wrong rows (6.4% / 11.6% for a real 8.6% / 8.6%) without
any warning. The second case is worse than an empty slot.

**Fallbacks.** If the column pass finds fewer than 5 substats (every echo is
assumed max-level, so fewer than 5 counts as a miss), a second OCR batch
reads the 5 `SUBSTAT_ROWS` crops plus `SUBSTAT_BLOCK`. `parseEchoCandidate`
keeps whichever pass recovered the most rows (ties go to the earlier pass,
columns first), and replaces the result outright rather than merging partial
views row by row. `substatSource` (`"columns" | "rows" | "block"`) on the
parse result and on the `ScanCandidate` records which pass won, and the
debug view shows it. An echo below +25 legitimately has fewer than 5
substats, so it always triggers the fallback batch; the column result still
wins unless a fallback does better.

The common case is now 5 OCR calls per candidate (name, main, secondary,
two columns), down from 8. The fallback case costs 11, run in two batches
through the 3-worker pool. The fallbacks stay in place as a safety net
until the column pass has held up across more real scans; after that they
can be removed in a small follow-up.

### Row parsing (fallback passes): what a wrapped/split row's text actually looks like

`parse.ts`'s `scanStatRows` (shared by `parseStatRow` and `splitStatBlock`,
i.e. the per-row and block fallbacks — not the column pass)
has to reassemble a row's label from however tesseract split it across
lines. Real debug-crop footage confirmed three distinct shapes, not just
the one originally assumed:

- **Normal**: label and value on one line — `"Healing Bonus 26.4%"`.
- **Value-only continuation**: the label is alone on its own line, and the
  value lands alone on the *next* line — `"% DEF"` / `"11.3%"`.
- **Wrapped label, value on its first line**: `"Resonance Liberation
  10.9%"` / `"DMG Bonus"` — the value is right-aligned to the label's
  *first* visual line, and the rest of the label continues below it with
  no value of its own. This is the game's actual layout (confirmed by
  comparing two real debug-crop screenshots side by side), and it's the
  *opposite* of what an original version assumed (value after the label's
  *last* line) — that version could never recover a wrapped row at all: a
  crop that was clearly legible in the debug view still came back with 0
  substats, because the value was already sitting correctly on line 1, but
  the partial label without the word(s) pushed to line 2 didn't look
  plausible, and the code was looking *behind* itself for more label text
  instead of *ahead*.

`scanStatRows` accumulates label text from both directions around
whichever line the value turns up on, and only settles a row once it hits
a real boundary (a new value line starting a different row, or the end of
input) or an *exact* known label. That last part matters on its own:
`verboseStatLabelMap` deliberately carries multiple aliases per stat for
fuzzy-matching elsewhere ("Resonance Liberation DMG Bonus", "Resonance
Liberation DMG", and "Resonance Liberation" all resolve to the same stat)
— treating *any* registered key as "this label is complete, stop
extending" was a second real bug, since "Resonance Liberation" alone is
already a registered alias and kept committing the truncated label before
ever reading the next line. `CANONICAL_COMPLETE_LABELS` picks out only the
*longest* alias per stat — the one WuWa actually displays in full — as
the signal that a label is really finished.

## Echo identification: name + cost first, set-icon image matching narrowed or last-resort

This has gone through three real designs. The first matched by OCR'd name
alone (Levenshtein-fuzzy against all ~150 echoes). The second (documented
in this section for a while) switched to set-icon-first — match the icon
against all ~30 sets (`matchSetFirst`), narrow `mainEchoesData` to that
set, then resolve the specific echo — mirroring `CalculatorEchoParser.vue`'s
Discord-bot flow. That second design is what every set-icon-matching fix
earlier in this doc (background masking, scale, scoring weights, the
gray-icon color-distance fix) was in service of — and after all of them,
matching was *still* inconsistent enough that it was worth checking
whether set-icon-first was ever the right primary signal to begin with.

It wasn't, for a fact-checkable reason: of the 182 echoes in
`mainEchoesData`, **none share a name**, but **122 (67%) support more than
one set**. Name text is sufficient on its own to identify the echo, for
*any* echo, once OCR reads it well enough — it has no structural ceiling
the way set-icon matching does. Set-icon matching, even a hypothetically
*perfect* one, still can't identify the echo by itself for two-thirds of
the pool, since knowing "this is a `SongofFeatheredTrace` echo" doesn't
say *which* `SongofFeatheredTrace` echo when 8 of them share that set.
Set-icon matching's real, necessary job is answering a different
question — *which* of an already-identified echo's few legal sets did the
player equip it into — not identifying the echo in the first place.

The current design, in `parse.ts`'s `resolveEchoByNameAndCost` +
`useEchoScanner.ts`'s `resolveEchoIdentity`:

1. **Infer cost from the fixed secondary stat's value** (`inferCostFromSecondaryStat`)
   — at max level (always assumed), the fixed secondary is entirely
   determined by cost: 2280 (HP) for cost-1, 100 (ATK) for cost-3, 150
   (ATK) for cost-4, straight from `flatBonusesByRankByType`'s own rank-5
   entries. No image matching, no dependency on the echo being known yet.
   An earlier attempt at this same idea only checked the rank-5 table
   without accounting for lower ranks at all (a real bug, since it assumed
   every echo was always at rank 5) — moot now that level is fixed at
   max, but worth remembering if that assumption ever changes.
2. **Narrow the name-match candidate pool by that cost**, if inferred —
   purely a soft optimization, never a hard filter: `resolveEchoByNameAndCost`
   always retries against the *full* unfiltered pool if the narrowed
   search doesn't turn up a confident match, so a wrong cost inference (or
   none at all) can only cost some discriminating power, never silently
   exclude the right answer.
3. **Levenshtein-match the name** (`bestNameMatch`) against that pool —
   `NAME_BLOCK`'s single-line, no-wrap crop exists specifically to make
   this read reliable, since it now carries the primary identification
   burden rather than a secondary tie-break role.
   The match tolerates **trailing OCR junk** (`prefixTolerantSimilarity`,
   `TRAILING_DROP_WEIGHT` in `parse.ts`): `NAME_BLOCK` is sized for the
   longest names, so a short one ("Dreamless") leaves background art in
   the rest of the crop that tesseract reads as junk ("Dreamless LQ Va A").
   Whole-string similarity charged each junk char as a full edit, so the
   same echo passed or failed depending on how much junk a frame produced.
   Trailing chars can now be dropped at half the cost of an edit. They
   still cost *something*, so a lightly garbled longer name ("Chop Chop:
   Headlss", "Fog Lionarch: Bdy") keeps beating its prefix echo ("Chop
   Chop", "Fog Lionarch"), the only prefix families in the pool.
   **Whole-word rule for short names:** when the OCR text *starts with an
   echo's complete name as whole words* followed by more words, that echo
   scores at least `NAME_MATCH_THRESHOLD` (`matchesWholeNamePrefix`). A real
   Jué read as "Jue wll" otherwise scored 1 − 1.5 / (3 + 1.5) = 0.667 and
   came back "Unknown echo": with a 3-letter name, 3 junk chars were
   enough. It's a floor, not an override, so a stronger fuzzy match to
   another echo still wins, and it needs an exact whole word plus a word
   break ("Juewll" and "Jux wll" don't qualify). It never applies to a
   name that is the leading words of another echo's name (Chop Chop, Fog
   Lionarch), so a junk-trailed read of "Chop Chop: Leftless" can't fall
   back to plain Chop Chop.
4. **If an echo resolves**, look up its own `sets`:
   - **Exactly one** (33% of the pool): done — the set is known directly,
     with *no image matching at all*, not even attempted.
   - **More than one** (67%): `useEchoScanner.ts` calls the shared
     worker's `matchSet` — narrowed to just that echo's own 2-3 candidate
     sets, via `setImageUrls` built from only those keys — to disambiguate.
     This is a fundamentally easier problem than picking correctly out of
     all 30: few candidates, and `matchSet` uses a different, more robust
     comparison (`compareImages`, structural/edge-based) than
     `matchSetFirst`'s bucketed-color/shape-heuristic scoring — the same
     narrowed-comparison function the Discord-bot flow already relies on
     for this exact job.
5. **If no echo resolves at all** (name OCR too garbled to clear
   `NAME_MATCH_THRESHOLD` even unfiltered): falls back to the *old*
   design in full — full-pool `matchSetFirst` (still with the tuned
   `SCANNER_SET_MATCH_WEIGHTS` from the fixes above, since this path still
   exercises it), then the old set-narrows-pool/name-breaks-ties logic
   (`resolveEchoBySet`, the renamed original `resolveEcho`) to resolve an
   echo from that. Every earlier set-icon-matching fix in this doc still
   matters here — this fallback is hit far less often now, but not never.

`parseEchoCandidate` takes the result of whichever path ran as a
`preResolvedEcho` (when name+cost succeeded) or falls through to
`resolveEchoBySet` internally (when it didn't) — see its doc comment for
the exact contract. `matchedSet` is always the *final* resolved set
regardless of which path produced it, and is what ends up in the saved
`ParsedEchoSlot`.

Once the echo is resolved, **cost is derived from its class**
(`getCostByClass`) for the saved result — never read as OCR text for that
purpose. The secondary-stat value above is used only for the *narrowing*
step; it isn't re-used as the final cost output, so a narrowing miss can't
propagate into a wrong saved cost the way a hard filter would.

This hasn't been validated against a large batch of real captures yet —
like the set-icon scoring weights, it's a design change reasoned from real
data (the 182/122 counts above, checked directly against
`src/echoes/index.ts`, not estimated) rather than exhaustively tuned. The
debug view's per-candidate label (`identity.debugLabel` in
`useEchoScanner.ts`) now says which of the paths above actually ran and
what it found, specifically so that's checkable from real usage.

### Name OCR: next options if misses return

The trailing-junk tolerance above fixed the inconsistent short-name
matches seen on real footage (e.g. Dreamless). If more testing turns up
name misses, these were identified but held back until needed, in order:

1. **OCR tuning for the name crop only** (`echoScanner.worker.ts`):
   - Drop low-confidence words. Tesseract reports a confidence per word,
     and junk read from background art usually scores low.
   - Read the name as a single line (`PSM 7`) instead of a block (`PSM 6`).
   - Use a letters-only whitelist for the name: letters, space, `: - '`
     and accents, with no digits, `%` or `+`.
2. **Preprocessing for the name crop:**
   - Binarize instead of the current grayscale + 1.5× contrast stretch.
     Names are near-white, so keep bright, low-saturation pixels as text,
     make everything else background, then invert to dark text on white.
   - Trim the crop at the first wide empty column gap after the text, so
     the background art never reaches OCR.
3. **Other:**
   - Vote on the name across the frames `stability.ts` already groups for
     one echo, so a single bad frame can't decide it.
   - Require a margin between the best and runner-up match before trusting
     it, so a wrong echo can't win by a hair.

Known limit of the current matcher: a very short name (Jué, 3 chars) only
tolerates about 2 junk chars when the junk isn't separated by a space.
The whole-word rule covers the common case (junk after a word break).
Options 1 and 2 would reduce junk at the source instead.

## Set icon matching: shape-mask the background, not just crop tighter

`SET_ICON_BOX`'s geometry alone (see "ROI layout" above) wasn't the whole
accuracy problem — a tight crop still fed `echoParser.worker.ts`'s
`matchSetFirst` a wrong result most of the time. The actual cause: that
worker's background handling (`extractImageRegion`'s masking, and
`matchSetFirst`'s own second pass) only clears pixels close to *black*.
That's correct for the Discord-bot flow, whose source image is rendered
onto a black canvas specifically so that convention works — but wrong for
a live capture, where the icon sits on the game's own reddish panel
background, nowhere near black. None of that background was ever being
masked, so `getDominantColors` (which `matchSetFirst` leans on most
heavily, ahead of shape detection and a small-weight pixel diff) picked up
the *background's* color as one of the crop's "dominant colors" alongside
or instead of the icon's own — corrupting the color-family comparison the
whole match is built on. Confirmed by comparing a captured crop against a
reference icon image (transparent background) side by side.

`capture.ts`'s `grabCircularMaskedBitmap` fixes this by masking by *shape*
instead of *color*: since the icon is circular and (now cropped tight)
fills nearly the whole crop, everything outside a centered circle is made
fully transparent before the crop is ever sent to `matchSetFirst` —
removing the background regardless of what color it actually is.
`useEchoScanner.ts`'s `matchSetIcon` grabs and masks this crop itself,
then sends *that* (not the full frame + pixel coordinates, the earlier
approach) as `sourceImageBitmap`, with `setCoords` covering the whole
already-cropped, already-masked bitmap — so `echoParser.worker.ts`'s own
black-only masking pass, still used unmodified by the Discord-bot flow
too, is never relied on here and stays untouched. The debug view's
`setIcon` crop thumbnail shows this exact masked bitmap (on a gray
backdrop so the transparent corners are visible), not a plain rectangle,
so the mask being applied is something you can actually see, not just
take on faith.

### Second bug, same symptom: a scale mismatch, not just a color one

Fixing the background color didn't fully fix match accuracy either — a
side-by-side debug-view screenshot (the captured crop next to the
reference icon it was being compared against) showed the captured icon
reading visibly *smaller* than the reference, even after masking. Cause:
`matchSetFirst` stretches both images onto the same 32x32 comparison
canvas before comparing, and the reference set images (e.g.
`CelestialLight.webp`) are cropped with essentially no margin around their
content. `SET_ICON_BOX`'s own bounds, however tightly hand-measured, still
leave *some* slack around the icon's real edge — and the original circular
mask was inscribed in the *box's* dimensions, not the icon's, so that
slack became a ring of true background color sitting just inside the
mask. Stretched to 32x32 alongside a reference with no such ring, the
real icon content ends up occupying a smaller fraction of the comparison
canvas than the reference's does — a scale mismatch that throws off both
the color-family signal and the pixel-diff one.

`capture.ts`'s `detectIconBounds` fixes this at capture time rather than
by chasing an ever-tighter fixed fraction in `layout.ts`: it samples the
crop's four corners (guaranteed background, since a crop with any margin
has plain background in its corners) as a reference color, thresholds
every pixel in the crop by distance from that color, and returns the
tight bounding box of whatever doesn't match — i.e. the icon's own real
edge, not the configured box's edge. `grabCircularMaskedBitmap` re-crops
to that detected box before inscribing the circular mask, so the result
matches the reference convention (icon fills the bitmap, no ring) however
loose `SET_ICON_BOX` actually is. It falls back to the full configured
crop (previous behavior) if nothing in the crop is distinguishable from
its own corners, so a bad detection never makes things worse than before.
Unit-tested directly in `tests/scanner/capture.test.ts` with synthetic
crops (centered icon block, flat crop, icon already filling the whole
box, a too-small noise speck, minor per-pixel color noise) since it's a
plain function over pixel data with no canvas/DOM dependency.

### Third bug: matchSetFirst's own scoring buries the signal that works

Fixing color and scale still left matching inconsistent, and it turned out
the algorithm itself was the remaining cause, not the crop. `matchSetFirst`
combines three signals into one score: a binary color-family match/mismatch,
a crude shape heuristic (`detectShapes`'s `hasShield`/`hasCross`/etc., built
by literally counting edge-pixel patterns), and `compareSetIcons`'s
per-pixel diff — the same comparison the Discord-bot flow relies on and
that reliably works well there. But the *combining weights* treat a
color-family mismatch as a flat **100000** penalty (an absolute veto —
nothing else can outweigh it) and give `compareSetIcons` only **0.1x**
("just for fine-tuning"), with the shape heuristic at 5000x in between.
One misclassified dominant color — far more likely from a
chroma-subsampled, video-compressed live capture (which bleeds/shifts hue
at edges) than from the Discord-bot flow's clean, uncompressed rendered
source images — silently disqualifies the correct set regardless of how
well `compareSetIcons` would have scored it. That's why the same shared
algorithm can be reliable for one input and inconsistent for the other:
it's the same code and the same weights, but a live capture trips the
harsh veto far more often than a bot-rendered image does.

Rather than change those weights globally (which would also change the
Discord-bot flow's results — the flow this scanner explicitly avoids
touching), `matchSetFirst` now takes an optional `weights` parameter
(`SetMatchWeights`) defaulting to the exact original hardcoded values, so
every caller that doesn't pass it — every existing Discord-bot call site —
sees byte-identical scoring. `useEchoScanner.ts` defines its own
`SCANNER_SET_MATCH_WEIGHTS` and passes it on the scanner's `matchSetFirst`
message only: the color-family penalty drops from a 100000 veto to a 3000
nudge, the shape weight drops from 5000 to 1500 (crude heuristics tuned
against clean renders, likely noisier here too), and `compareSetIcons`'s
weight rises from 0.1 to 1 — making it the primary signal now that its
input (thanks to the shape/scale fixes above) actually matches the
reference convention it needs to compare well.

The debug view's crop grid also now shows the *matched reference icon*
directly beside the captured `setIcon` crop (`echoSetImageMap[candidate.slot.set]`),
not just a "Matched: <name>" label — a literal side-by-side, so a bad
match (or a still-off scale/crop) is visible without a separate lookup.
These weights are a reasoned starting point from the scoring math, not
something validated against a large batch of real captures yet — the
debug view is exactly the tool to tune them further from here if matches
are still inconsistent.

### Fourth bug: color-family's six buckets have no bucket for gray

Boosting `compareSetIcons`'s weight assumed it was reliable once given a
properly scaled/aligned crop — a real mismatch showed that assumption was
only partly true. A gray/white "Song of Feathered Trace" icon (a light
ring, dark gray fill, white feather glyph — no real hue anywhere) matched
to "Dream of the Lost" (pink ring, dark maroon fill) instead. Replaying
both real icons through the same math outside the worker (same resize,
same dominant-color extraction) found *both* remaining signals failed on
this exact pair:

- `classifyColorFamily`'s six hardcoded buckets (green/yellow/blue/red/
  purple/orange) all require real separation between channels — a gray
  color (r≈g≈b) can't fit any of them, so it classifies as *no family at
  all*. `colorFamilyPenalty` only applies when **both** sides have a
  nonempty family set, so for a gray source icon it silently never
  engages, no matter how different a candidate's actual color is.
- `compareSetIcons`'s per-pixel diff, with nothing else to check it,
  turned out to slightly *favor the wrong icon* (30499 vs. 32783 for the
  correct one) — it's a raw, position-by-position comparison with no
  alignment/registration step, so it's sensitive to exactly where each
  icon's internal detail (the feather glyph vs. the tribal glyph) happens
  to land after both get stretched to 32x32, not just to overall color or
  shape.

What *did* cleanly separate this pair: a plain Euclidean distance between
the two images' single most-dominant colors — no bucketing, so a gray
source and a maroon reference just compute a large, real distance instead
of "no signal." For this exact pair it came out ~78 for the correct match
vs. ~113 for the wrong one, a clean separation the bucketed check
couldn't see at all. Added as `dominantColorDistance` in
`echoParser.worker.ts`, gated by a new `dominantColorDistanceWeight` in
`SetMatchWeights` — **0 by default** (a true no-op; the Discord-bot flow's
calls are completely unaffected, same as every other weight here), and
`SCANNER_SET_MATCH_WEIGHTS` turns it on (100) for the scanner's own calls.
It's additive with `colorFamilyPenalty`, not a replacement — the bucketed
check still helps when it *does* fire (a definitively green icon vs. a
definitively blue one), this just stops it going silent exactly when the
source icon has no real hue to bucket.

## Accuracy

Per `docs/accuracy-verification.md` and the project's priority order,
nothing here auto-saves silently:

- Every candidate carries per-field confidence (name, cost, main stat, set,
  each substat) computed in `parse.ts`; low-confidence fields are flagged in
  `EchoScannerCapture.vue`'s review list.
- Echo identity is resolved by name text first, narrowed by a cost inferred
  from the fixed secondary stat's value — never a hard filter, always
  retries unfiltered on a miss. Set-icon image matching only runs where
  text alone can't finish the job: narrowed to a resolved echo's own 2-3
  candidate sets, or full-pool as a last resort when name+cost can't
  resolve an echo at all — see "Echo identification" above (this was a
  set-icon-first design originally; ADR 0032 has the full history of why
  it flipped). A name below threshold with nothing to resolve is left
  unresolved (`echo: null`) rather than guessed. Cost is then derived from
  the resolved echo's own class for the saved result, never guessed from
  OCR'd cost text.
- Substat values are snapped to the nearest legal roll in `subStatsTable`
  (`src/echoes/stats.ts`) — the same table the Discord-bot importer trusts.
- A freshly-acquired echo with no main stat chosen yet (`needsMainStatSelection`)
  is skipped, not misparsed.
- Truly identical echoes (same name/set/cost/main/substats) collapse to one
  via `dedupe.ts`'s signature (`getEchoIdentityKey`) — no grid-position
  tracking.
- The scanner's result is handed to `useEchoDuplicateReview.ts` +
  `EchoDuplicateReviewList.vue` — the same duplicate-review → save pipeline
  `CalculatorEchoImporter.vue`'s Discord-bot-image flow uses, shared via
  that composable/component pair rather than duplicated — reviewing and
  confirming before anything is saved is not new UI, it's the same UI the
  Discord-bot import flow already uses.

**Preprocessing is scoped to text OCR only, never to set-icon matching.**
`echoScanner.worker.ts`'s `preprocess` (grayscale, contrast stretch, 3x
upscale — the same recipe `CalculatorEchoParser.vue` already uses for the
Discord-bot flow) runs on every crop that goes to that worker (name, main,
secondary, substat rows, the substat-block fallback) — text OCR genuinely
benefits from it. The set icon never goes through that worker or that
preprocessing at all: it's matched by `echoParser.worker.ts`'s
`matchSetFirst`, a color-based pixelmatch against the *raw* captured
bitmap, in a completely separate worker. Grayscaling would destroy the
color signal that comparison depends on, so the two pipelines are kept
architecturally apart rather than relying on a preprocessing flag to skip
it correctly in one path.

## Self-hosted tesseract.js

`public/tesseract/` holds `worker.min.js`, the SIMD+LSTM wasm core, and
`eng.traineddata.gz`, copied/downloaded from the `tesseract.js`/
`tesseract.js-core` packages and the `tessdata` distribution respectively.
`echoScanner.worker.ts`'s `createWorker` points at these paths instead of
the default CDN, so scanning doesn't depend on a third party being up. These
are only fetched lazily when a scan session actually starts (not on normal
app load), so they don't affect the app's regular load time.

**The paths must be fully-qualified absolute URLs** (`${self.location.origin}/tesseract/...`),
not path-absolute strings (`/tesseract/...`). tesseract.js spawns its own
nested worker by wrapping `workerPath` in a `Blob` and calling
`importScripts()` from *inside* that blob's own `blob:` context
(`workerBlobURL`, default `true`) — a path-absolute URL fails to resolve
against a `blob:` base there ("Failed to execute 'importScripts' ... URL is
invalid"), even though the exact same string resolves fine as a normal
fetch from this worker itself. The Discord-bot importer's tesseract.js
usage never hits this because it uses tesseract's default CDN path, which
is already a full `https://` URL — self-hosting is what exposes it.

## Using the scanner (the in-app guide)

`EchoScannerGuide.vue` is the "How to scan" walkthrough on the start
screen. It opens automatically the first time (a per-browser
`localStorage` flag, `echoScanner.guideSeen`, wrapped in try/catch; it
isn't user data, so no store or migration), then from the **How to scan**
button. It's text only on purpose: screenshots would be large and go stale
with each game UI update. Keep its steps in line with this list:

1. Desktop Chrome/Edge, English client, game at 16:10 or 16:9 (full screen
   or windowed).
2. In game: Backpack → Echoes, click the first echo.
3. In the app: Inventory → Scan echoes → Share screen (live), then pick the
   game on the picker's **Window** tab.
4. Click an echo → wait ~2s → click the next. Keep the panel unobstructed.
5. Stop scanning; queued echoes still finish.
6. Review (below), then save.

While scanning, a short "Click → wait ~2s → click next → Stop" strip
replaces the old one-line hint.

**Beep on each capture** (toggle on the start screen, off by default,
remembered in `localStorage` as `echoScanner.captureCue`):
`captureCue.ts` plays a ~80ms WebAudio blip on each `stable-novel`
capture. The user is usually full screen in the game and can't see the
counter, so the beep says it's safe to click on. The `AudioContext` is
created inside the Start click (browsers keep one created without a
gesture suspended) and closed in `releaseCapture`. Only live shares open
it, so a video scan never beeps.

## Reviewing results

Every candidate now carries:

- `captureIndex`: 1-based capture order, assigned in `handleTick` at
  capture time rather than after OCR, so "#137" matches the order the
  user clicked.
- `panelPreviewUrl`: a ~480px-wide JPEG of `PANEL_BOX` from the same
  frame (`grabRegionPreviewJpeg`), always kept, not only in debug mode.
  At ~30-50KB each, a 200-echo scan holds under ~10MB in memory. It's
  never persisted and goes away with the candidate list when the modal
  closes.

`src/scanner/review.ts` holds the pure rules (unit-tested in
`tests/scanner/review.test.ts`):

- **Needs attention** = a low-confidence field or no echo match, minus
  echoes the user marked **Looks right**. That mark is UI-only (a set of
  ids in `EchoScannerCapture.vue`) and never changes the slot or its
  confidence. An unknown echo can't be marked, since there's no echo to
  save.
- **Already in inventory** uses the same exact identity-key rule as the
  duplicate step (`useEchoDuplicateReview`), via `buildIdentityKeySet`
  (`src/utils/echoIdentity.ts`), a set lookup instead of scanning the
  inventory for each echo.

The results view (`EchoScannerCapture.vue` + `EchoScannerResultCard.vue`):

- filter tabs **All / Needs attention / Unknown echo / Already in
  inventory** with counts, opening on Needs attention when anything is
  flagged;
- a two-column grid (one column below `lg`);
- a **Show in-game capture** toggle per echo, open by default on flagged
  ones, with a click-to-enlarge dialog.

**Edit** still saves the echo right away and opens the inventory editor
(see `saveCandidateNow`). It now passes the capture along (`edit-candidate`
→ `{ echoId, referenceImageUrl }`), and both editors
(`InventoryEchoEdit.vue` and the labs `InventoryEchoEditPanel.vue` →
`CalculatorEchoEditPanel.vue`) show it through `EchoScanReferenceImage.vue`.
They clear it on close, so it never appears on a later, unrelated edit.

**Save button.** It used to say "Continue" whatever came next. It now says
what will happen:

- **Save N echoes** when nothing matches the inventory. This saves
  directly and closes.
- **Review K duplicates →** when something does. This opens
  `EchoDuplicateReviewList.vue`, with duplicates unchecked; its button
  now reads "Save N selected".

A summary line above the button shows the new / already-in-inventory /
still-flagged / unknown counts. After saving, `onFinalized(savedCount)`
drives a "Saved N echoes to your inventory" toast.

## Debug view

`EchoScannerCapture.vue` has a "Debug mode" checkbox on the start screen
(binds to `useEchoScanner`'s `debugMode` ref). When on, three things
become visible that are otherwise invisible even when something's clearly
wrong:

- **Live preview overlay**: every `DEBUG_REGIONS` entry (`layout.ts`) drawn
  as a labeled dashed box over the live/trimming preview, positioned by
  simple percentage CSS (`region.x * 100%`, etc. — the crop fractions
  double as overlay positions for free, no separate pixel math). Confirms
  at a glance whether a region actually lands on what it's supposed to.
- **Per-candidate full-frame snapshot with boxes**: a downscaled
  (`capture.ts`'s `grabFullFrameSnapshot`, ~960px wide — kept small so a
  long debug session's candidate list doesn't hold a full-res PNG per
  echo) whole-frame image with every ROI box overlaid the same way as the
  live preview, one per captured candidate, sitting in the review list
  where it can be inspected at your own pace rather than only during the
  live/moving scan.
- **Per-candidate crop grid**: every captured candidate also carries
  `debugCrops` — a labeled `data:` URL thumbnail of exactly what was
  cropped for each region (including `substatBlock`, the fallback region),
  plus that region's own OCR text. `substatLabels`/`substatValues` are
  the primary substat crops; `sub0`-`sub4` and `substatBlock` only show OCR
  text when the fallback batch actually ran. The `setIcon` entry shows
  `resolveEchoIdentity`'s `debugLabel` instead of a generic placeholder —
  which of the identification paths actually ran ("Resolved by name
  (single possible set): …", "Resolved by name; narrowed image match (N
  candidates): …", "Name unresolved — fell back to full image match: …",
  etc. — see "Echo identification" above), not just a flat "Matched: X" /
  "No set match", since *which path* produced the result is itself useful
  diagnostic information now that there's more than one. It also shows the
  matched reference icon directly beside the captured crop (only
  meaningful when a path actually did an image comparison — see "Set icon
  matching" above); `panel` (fingerprint-only, not OCR'd or matched) keeps
  a placeholder. `capture.ts`'s `grabRegionWithPreview` produces both the
  bitmap sent to the worker and the thumbnail from one canvas draw, so
  what's shown is provably the same pixels that were actually
  OCR'd/matched, not a re-derived approximation. A candidate whose substats
  came from a fallback pass instead of the columns shows a small note
  saying which one (`substatSource`).

This is what caught `SET_ICON_BOX` being badly mispositioned (see its doc
comment) — every scan confidently returning the same wrong set is exactly
what a fixed-but-wrong crop landing on background art looks like — and led
directly to several fixes from real debug-crop text a user reported: an
earlier cost-inference helper only checking the rank-5 flat value (fixed
by deriving cost from the resolved echo instead, see "Echo identification"
above); `parseStatRow`/`splitStatBlock` greedily accepting the *first*
line that happened to end in a number, including obvious OCR garbage,
instead of continuing to look for a line that actually resembled a real
stat label further down; the set-icon crop being too loose around the
actual icon; and the stat-type icon glyph itself being read as text noise
(see "ROI layout" and "Substat OCR" above for all of these). If
substat/set accuracy regresses again, debug mode first: check the
full-frame snapshot to confirm the boxes actually sit on the right UI
elements, and check a few candidates' crop grids and raw text to see
whether OCR is misreading text it *did* capture correctly, versus not
capturing the right pixels at all, versus capturing the right pixels but
the parser rejecting real content — those each need a different kind of fix.

Debug mode costs an extra canvas encode per region per candidate (not
free), so it's opt-in and off by default — leave it off for normal scanning.

## Usage analytics

Scanner usage is reported to Umami via `trackEvent` (`src/utils/analytics.ts`;
a no-op when `VITE_UMAMI_WEBSITE_ID` is unset or under Cypress). Only
modes, outcomes, and timings are sent — no echo counts, echo contents, OCR
text, or frames.

| Event | Where | Data |
|-------|-------|------|
| `scanner-opened` | `EchoScannerModal.vue` | — |
| `scanner-started` | `useEchoScanner` | `mode` (`live`/`video`); video adds `fps`, `scanSeconds` |
| `scanner-finished` | `useEchoScanner` | `mode`, `outcome` (`completed` = video reached the end, `stopped` = user stop/close), `durationSeconds` |
| `scanner-error` | `useEchoScanner` | `mode`, `stage` (`start`/`open`/`scan`), `error` (the `Error.name`, e.g. `NotAllowedError` for a declined screen share) |
| `scanner-unsupported-aspect` | `useEchoScanner` | `mode`, `aspect` (width/height, 2dp) — once per session |

`scanner-finished` fires at most once per session: for video, `stop()`
reports `stopped` and clears the session, so the scan loop's own exit
afterward doesn't double-report. `durationSeconds` is measured when
capture ends, not after the capture queue finishes draining.

## Extending / debugging

- `src/echoes/parsedEchoMapping.ts` (`mapParsedEchoes`, `getSubstatType`,
  `getSubstatValue`) is shared between the Discord-bot importer and this
  scanner — fix a mapping bug once, both flows benefit. Don't re-duplicate
  it back into a component.
- Unit tests: `tests/scanner/*` (fingerprint/stability with synthetic
  frames, the capture queue's ordering/backpressure/clear, layout at the three measured real resolutions, parse against real
  transcripts read off the provided screenshots) and
  `tests/echoes/parsedEchoMapping.test.ts`. There is deliberately no
  end-to-end tesseract-in-CI test — OCR accuracy against real captures is a
  manual verification step (upload the reviewer's own recorded clip through
  the "Upload a video" path in `npm run dev`), not a unit test.
- See `src/workers/DEBUGGING.md` for general worker debugging tips.
