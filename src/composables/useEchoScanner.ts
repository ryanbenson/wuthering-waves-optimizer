/**
 * Orchestrates the echo screen scanner: owns whichever FrameSource is
 * active (live share or uploaded video — see src/scanner/capture.ts),
 * drives the fingerprint/stability gate, calls out to the OCR worker
 * (echoScanner.worker.ts) and the existing echo-set-icon matcher
 * (echoParser.worker.ts) on a "stable-novel" tick, and turns the result
 * into a reviewable candidate list. Vue-only glue — all matching/parsing
 * logic lives in src/scanner/*, which stays pure and unit-testable.
 */
import { onBeforeUnmount, ref, computed } from "vue";
import { trackEvent } from "../utils/analytics";
import {
  createScreenShareSource,
  createVideoFileSource,
  openVideoFile,
  seekPreview,
  closeVideoHandle,
  grabRegionImageData,
  grabRegionBitmap,
  grabRegionWithPreview,
  grabFullFrameSnapshot,
  grabCircularMaskedBitmap,
  type FrameSource,
  type VideoFileHandle,
  type VideoScanOptions,
} from "../scanner/capture";
import { computeFingerprint, STATS_FINGERPRINT_GRID } from "../scanner/fingerprint";
import { createStableFrameDetector } from "../scanner/stability";
import { createDedupeSet, computeSignature } from "../scanner/dedupe";
import { parseEchoCandidate, resolveEchoByNameAndCost } from "../scanner/parse";
import {
  PANEL_BOX,
  STATS_BLOCK,
  NAME_BLOCK,
  MAIN_STAT_ROW,
  SECONDARY_STAT_ROW,
  SUBSTAT_ROWS,
  SUBSTAT_BLOCK,
  SET_ICON_BOX,
  DEBUG_REGIONS,
  isSupportedAspect,
} from "../scanner/layout";
import { echoSetImageMap, getEchoSetLabelByType } from "../echoes/stats";
import { mainEchoesData } from "../echoes/index";
import { mapParsedEchoes } from "../echoes/parsedEchoMapping";
import { useInventoryStore } from "../stores/inventory";
import { randomString } from "../utils/strings";
import type { ScanCandidate } from "../scanner/types";
import EchoScannerWorker from "../workers/echoScanner.worker?worker";
import EchoParserWorker from "../workers/echoParser.worker?worker";

/**
 * echoParser.worker.ts's matchSetFirst combines three signals into one
 * score: a color-family match/mismatch, a crude shape-heuristic diff, and
 * compareSetIcons's per-pixel diff. Its *default* weights (used by the
 * Discord-bot import flow, unchanged here) treat a color-family mismatch
 * as an absolute veto (100000 — nothing else can outweigh it) and give
 * compareSetIcons only 10% of the vote, as "fine-tuning."
 *
 * That default makes sense for the Discord-bot flow's clean, uncompressed
 * rendered source images, where color-family classification rarely
 * misfires. It's the wrong tradeoff here: a live/video-compressed capture
 * is a much rougher input (chroma-subsampled compression bleeds and shifts
 * hue at icon edges in a way a bot-rendered image never does), so the same
 * veto is a real, observed source of consistently-wrong matches — one
 * misclassified dominant color throws out the correct set regardless of
 * how well shape/pixel matching would have scored it. Meanwhile
 * compareSetIcons's pixel-level comparison — the piece confirmed to work
 * well elsewhere — is now much more trustworthy for this path than it
 * used to be, since capture.ts's detectIconBounds keeps the crop at the
 * same scale/alignment convention as the (margin-free) reference icons.
 *
 * These weights turn the color-family signal into a strong nudge instead
 * of a veto, de-emphasize the shape heuristics (built and tuned against
 * clean renders, so likely noisier here too), and make the pixel-level
 * comparison the primary signal. Passed only on the scanner's own
 * matchSetFirst calls — see SetMatchWeights's doc comment in
 * echoParser.worker.ts for why the Discord-bot flow's own calls
 * (which don't pass this) are completely unaffected.
 *
 * dominantColorDistanceWeight (0 by default, i.e. off, for every other
 * caller) turns on a fourth signal added specifically for a real
 * mismatch: a gray/white "Song of Feathered Trace" icon matched to a
 * dark-maroon "Dream of the Lost" reference. Neither classifyColorFamily
 * bucket (green/yellow/blue/red/purple/orange) fits a gray icon, so
 * colorFamilyPenalty silently never engaged — and compareSetIcons's raw,
 * unaligned per-pixel diff turned out to *favor the wrong one* on that
 * exact pair (confirmed by replaying both real icons through the same
 * math outside the worker). A plain Euclidean distance between the two
 * images' single most-dominant colors isn't gated by the six-bucket
 * classifier at all, and correctly separated this pair (distance ~78 for
 * the right match, ~113 for the wrong one) where the bucketed check saw
 * nothing.
 */
const SCANNER_SET_MATCH_WEIGHTS = {
  colorFamilyMismatchPenalty: 3000,
  shapeDiffWeight: 1500,
  pixelDiffWeight: 1,
  dominantColorDistanceWeight: 100,
};

export type ScannerStatus =
  | "idle"
  | "trimming" // a video file is open and previewable, waiting for the user to confirm a range/rate and start scanning
  | "starting"
  | "running"
  | "stopping"
  | "stopped"
  | "error";

export function useEchoScanner() {
  const status = ref<ScannerStatus>("idle");
  const errorMessage = ref<string | null>(null);
  const candidates = ref<ScanCandidate[]>([]);
  const skippedCount = ref(0);
  const duplicateCount = ref(0);
  const progress = ref<{ current: number; total: number | null }>({ current: 0, total: null });
  const unsupportedAspect = ref(false);
  /** The FrameSource's <video> element, for the component to mount as a live preview. Not reactive data — just a handle. */
  const previewVideoEl = ref<HTMLVideoElement | null>(null);
  /** Set once a video file is open (status "trimming") — lets the trim UI show/scrub a range before scanning starts. */
  const videoDuration = ref<number | null>(null);
  /**
   * Set (by the component, before starting) to capture a labeled crop
   * thumbnail + text for every named ROI on every candidate, and to expose
   * the live preview's ROI boxes — see DEBUG_REGIONS in layout.ts. Off by
   * default: the extra canvas encode per region isn't free, and most
   * sessions don't need it.
   */
  const debugMode = ref(false);

  const reviewNeededCount = computed(
    () =>
      candidates.value.filter(
        (c) =>
          c.confidence.name === "low" ||
          c.confidence.cost === "low" ||
          c.confidence.mainStat === "low" ||
          c.confidence.set === "low" ||
          c.confidence.substats.some((s) => s === "low"),
      ).length,
  );

  let frameSource: FrameSource | null = null;
  let openVideoHandle: VideoFileHandle | null = null;
  let ocrWorker: Worker | null = null;
  let setWorker: Worker | null = null;
  let setWorkerReady: Promise<void> | null = null;
  const stability = createStableFrameDetector();
  const dedupe = createDedupeSet();

  // Usage analytics (Umami, see utils/analytics.ts) — one "scanner-started"
  // and at most one "scanner-finished" per scan session. Mode/outcome/timing
  // only — no echo counts, contents, or frames.
  let trackedMode: "live" | "video" | null = null;
  let trackedStartedAt = 0;
  let trackedAspect = false;

  function trackSessionStart(mode: "live" | "video", data: Record<string, unknown> = {}) {
    trackedMode = mode;
    trackedStartedAt = Date.now();
    trackedAspect = false;
    trackEvent("scanner-started", { mode, ...data });
  }

  /** No-op unless a session is being tracked, so stop()-then-loop-exit (video) only reports once. */
  function trackSessionEnd(outcome: "completed" | "stopped") {
    if (!trackedMode) return;
    trackEvent("scanner-finished", {
      mode: trackedMode,
      outcome,
      durationSeconds: Math.round((Date.now() - trackedStartedAt) / 1000),
    });
    trackedMode = null;
  }

  function trackError(mode: "live" | "video", stage: "start" | "open" | "scan", err: unknown) {
    trackEvent("scanner-error", {
      mode,
      stage,
      error: err instanceof Error ? err.name : "unknown",
    });
    trackedMode = null;
  }

  function resetState() {
    candidates.value = [];
    skippedCount.value = 0;
    duplicateCount.value = 0;
    progress.value = { current: 0, total: null };
    errorMessage.value = null;
    unsupportedAspect.value = false;
    stability.reset();
  }

  async function initWorkers() {
    ocrWorker = new EchoScannerWorker();
    const ocrReady = new Promise<void>((resolve) => {
      const handler = (e: MessageEvent) => {
        if (e.data?.type === "ready") {
          ocrWorker?.removeEventListener("message", handler);
          resolve();
        }
      };
      ocrWorker?.addEventListener("message", handler);
    });
    ocrWorker.postMessage({ type: "init" });

    setWorker = new EchoParserWorker();
    setWorkerReady = new Promise<void>((resolve) => {
      const handler = (e: MessageEvent) => {
        if (e.data?.type === "ready") {
          setWorker?.removeEventListener("message", handler);
          resolve();
        }
      };
      setWorker?.addEventListener("message", handler);
    });
    setWorker.postMessage({ type: "init", data: { echoReferences: [] } });

    await Promise.all([ocrReady, setWorkerReady]);
  }

/**
 * OCR's a named set of crops in one round-trip to echoScanner.worker.ts.
 * Named regions (rather than two big blocks) mirror CalculatorEchoParser.vue's
 * per-row Discord-bot-image crops — see layout.ts and parse.ts's top doc
 * comments for why this replaced the original whole-block design.
 */
  function recognizeCandidate(regions: Record<string, ImageBitmap>) {
    const id = randomString();
    const keys = Object.keys(regions);
    const bitmaps = keys.map((key) => regions[key]);
    return new Promise<Record<string, string>>((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data?.id !== id) return;
        ocrWorker?.removeEventListener("message", handler);
        if (e.data.type === "candidateResult") {
          resolve(e.data.texts as Record<string, string>);
        } else {
          reject(new Error(e.data.error ?? "OCR failed"));
        }
      };
      ocrWorker?.addEventListener("message", handler);
      ocrWorker?.postMessage(
        {
          type: "recognizeCandidate",
          id,
          regions: keys.map((key) => ({ key, bitmap: regions[key] })),
        },
        bitmaps,
      );
    });
  }

  /**
   * Shared plumbing for both set-matching calls below: grab and circularly
   * mask the icon crop (see capture.ts's grabCircularMaskedBitmap — the
   * worker's own black-only masking is wrong for this scanner's actual
   * game-UI background, so the crop is pre-masked before it ever reaches
   * the worker), send it as the source image, then post whichever match
   * message the caller wants against it. setCoords covers the whole
   * already-cropped, already-masked bitmap (no further cropping needed
   * from the worker's own — now effectively no-op for this path —
   * masking pass).
   */
  async function runSetMatch(
    videoEl: HTMLVideoElement,
    message: { type: "matchSetFirst" | "matchSet"; data: Record<string, unknown> },
  ): Promise<string | null> {
    if (!setWorker) return null;
    await setWorkerReady;
    const maskedBitmap = await grabCircularMaskedBitmap(videoEl, SET_ICON_BOX);
    const setCoords = { x: 0, y: 0, width: maskedBitmap.width, height: maskedBitmap.height };
    return new Promise<string | null>((resolve) => {
      const readyHandler = (e: MessageEvent) => {
        if (e.data?.type !== "ready") return;
        setWorker?.removeEventListener("message", readyHandler);
        const resultHandler = (ev: MessageEvent) => {
          if (ev.data?.type === "setMatch") {
            setWorker?.removeEventListener("message", resultHandler);
            resolve(ev.data.setMatch.setKey as string);
          } else if (ev.data?.type === "error") {
            setWorker?.removeEventListener("message", resultHandler);
            resolve(null);
          }
        };
        setWorker?.addEventListener("message", resultHandler);
        setWorker?.postMessage({ type: message.type, data: { ...message.data, setCoords } });
      };
      setWorker?.addEventListener("message", readyHandler);
      setWorker?.postMessage(
        { type: "setSourceImage", data: { sourceImageBitmap: maskedBitmap } },
        [maskedBitmap],
      );
    });
  }

  /**
   * Full-pool set-icon match (all ~30 sets) via echoParser.worker.ts's
   * matchSetFirst, reused as-is (untouched by this scanner's changes) —
   * now only the *fallback* path, used when resolveEchoIdentity's primary
   * name+cost matching can't confidently resolve an echo at all. See this
   * file's SCANNER_SET_MATCH_WEIGHTS doc comment and docs/scanner.md's
   * "Echo identification" section for why this stopped being primary.
   */
  async function matchSetIcon(videoEl: HTMLVideoElement): Promise<string | null> {
    return runSetMatch(videoEl, {
      type: "matchSetFirst",
      data: { allSetImageUrls: echoSetImageMap, setMatchWeights: SCANNER_SET_MATCH_WEIGHTS },
    });
  }

  /**
   * Narrowed set-icon match — just the resolved echo's own 2-3 possible
   * sets, via echoParser.worker.ts's matchSet (also reused as-is; it
   * already uses a different, more robust comparison — compareImages,
   * structural/edge-based — than matchSetFirst's color/shape scoring, the
   * same one the Discord-bot flow already relies on for this exact
   * disambiguation job). A far easier problem than picking correctly out
   * of all 30 sets: the candidates are already known to be few and
   * (usually) visually distinct, since the echo itself is already resolved
   * by name.
   */
  async function matchSetNarrowed(videoEl: HTMLVideoElement, candidateSets: string[]): Promise<string | null> {
    const setImageUrls: Record<string, string> = {};
    for (const key of candidateSets) {
      if (echoSetImageMap[key]) setImageUrls[key] = echoSetImageMap[key];
    }
    return runSetMatch(videoEl, { type: "matchSet", data: { possibleSets: candidateSets, setImageUrls } });
  }

  /**
   * Resolves which echo (and, where needed, which set) a candidate is —
   * name+cost text matching first (resolveEchoByNameAndCost, pure/sync),
   * set-icon image matching only where text alone can't finish the job:
   * narrowed to the resolved echo's own candidates when it supports more
   * than one set, or a full-pool fallback match when name+cost couldn't
   * confidently resolve an echo at all. See docs/scanner.md's "Echo
   * identification" section for the full reasoning (name uniqueness vs.
   * set ambiguity across the real echo pool) behind this priority order.
   *
   * debugLabel is shown in the debug view in place of the old blunt
   * "Matched: <name>" / "No set match" text, since which *path* produced
   * the result (no image match needed at all / narrowed among N
   * candidates / full-pool fallback) is itself useful diagnostic
   * information now that there's more than one path.
   */
  async function resolveEchoIdentity(
    videoEl: HTMLVideoElement,
    nameText: string,
    secondaryStatText: string,
  ): Promise<{ preResolvedEcho: string | null; matchedSet: string | null; debugLabel: string }> {
    const byName = resolveEchoByNameAndCost(nameText, secondaryStatText);

    if (byName.echo) {
      if (byName.candidateSets.length <= 1) {
        const set = byName.candidateSets[0] ?? null;
        return {
          preResolvedEcho: byName.echo,
          matchedSet: set,
          debugLabel: set
            ? `Resolved by name (single possible set): ${getEchoSetLabelByType(set) ?? set}`
            : "Resolved by name (no set on file for this echo)",
        };
      }
      const narrowedSet = await matchSetNarrowed(videoEl, byName.candidateSets);
      return {
        preResolvedEcho: byName.echo,
        matchedSet: narrowedSet,
        debugLabel: narrowedSet
          ? `Resolved by name; narrowed image match (${byName.candidateSets.length} candidates): ${getEchoSetLabelByType(narrowedSet) ?? narrowedSet}`
          : `Resolved by name, but narrowed image match failed among ${byName.candidateSets.length} candidates`,
      };
    }

    // Name+cost couldn't confidently resolve an echo at all — fall back to
    // the old set-icon-first path (full 30-set image match, then name
    // breaks ties within that set).
    const fallbackSet = await matchSetIcon(videoEl);
    return {
      preResolvedEcho: null,
      matchedSet: fallbackSet,
      debugLabel: fallbackSet
        ? `Name unresolved — fell back to full image match: ${getEchoSetLabelByType(fallbackSet) ?? fallbackSet}`
        : "Name unresolved, and no set match either",
    };
  }

  /**
   * Grabs a labeled crop thumbnail for every DEBUG_REGIONS entry, plus a
   * whole-frame snapshot to draw all of them on top of as one reviewable
   * image (EchoScannerCapture.vue), from the current (stable,
   * about-to-be-scanned) frame. Independent of the OCR-dedicated
   * grabRegionBitmap calls in handleTick — these are their own draws, so
   * nothing here competes with what the worker actually OCR's. Text is
   * filled in by the caller once `texts`/`matchedSet` are known; `panel`
   * (fingerprint-only, not OCR'd or matched) keeps a placeholder.
   *
   * `setIcon`'s thumbnail is the actual circularly-masked crop
   * (grabCircularMaskedBitmap) that gets sent to matchSetFirst, not the
   * plain rectangle every other region shows — the mask is the fix for
   * the background-color contamination bug (see capture.ts's doc
   * comment), so the debug view should make it visible that it's really
   * being applied, not just describe it.
   */
  async function captureDebugCrops(videoEl: HTMLVideoElement) {
    const [crops, fullFrame] = await Promise.all([
      Promise.all(
        DEBUG_REGIONS.map(async ({ key, label, region }) => {
          if (key === "setIcon") {
            const masked = await grabCircularMaskedBitmap(videoEl, region);
            const canvas = document.createElement("canvas");
            canvas.width = masked.width;
            canvas.height = masked.height;
            const ctx = canvas.getContext("2d");
            // A mid-gray backdrop so the masked-out (transparent) corners
            // are visibly different from the page background either theme.
            if (ctx) {
              ctx.fillStyle = "#80808080";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(masked, 0, 0);
            }
            return { key, label, dataUrl: canvas.toDataURL("image/png"), text: "(image-matched, not OCR'd)" };
          }
          const { dataUrl } = await grabRegionWithPreview(videoEl, region);
          return { key, label, dataUrl, text: key === "panel" ? "(image-matched, not OCR'd)" : "" };
        }),
      ),
      grabFullFrameSnapshot(videoEl),
    ]);
    return { crops, fullFrame };
  }

  async function handleTick() {
    if (!frameSource) return;
    const videoEl = frameSource.videoEl;
    const frame = frameSource.frameSize();
    if (frame.width === 0 || frame.height === 0) return;

    if (!isSupportedAspect(frame)) {
      unsupportedAspect.value = true;
      if (trackedMode && !trackedAspect) {
        trackedAspect = true;
        trackEvent("scanner-unsupported-aspect", {
          mode: trackedMode,
          aspect: (frame.width / frame.height).toFixed(2),
        });
      }
      return;
    }

    const fingerprint = {
      panel: computeFingerprint(grabRegionImageData(videoEl, PANEL_BOX)),
      stats: computeFingerprint(grabRegionImageData(videoEl, STATS_BLOCK), STATS_FINGERPRINT_GRID),
    };
    const event = stability.observe(fingerprint);
    if (event !== "stable-novel") return;

    try {
      const substatKeys = SUBSTAT_ROWS.map((_, i) => `sub${i}`);
      const [nameBitmap, mainBitmap, secondaryBitmap, ...substatBitmaps] = await Promise.all([
        grabRegionBitmap(videoEl, NAME_BLOCK),
        grabRegionBitmap(videoEl, MAIN_STAT_ROW),
        grabRegionBitmap(videoEl, SECONDARY_STAT_ROW),
        ...SUBSTAT_ROWS.map((region) => grabRegionBitmap(videoEl, region)),
      ]);

      const regions: Record<string, ImageBitmap> = {
        name: nameBitmap,
        main: mainBitmap,
        secondary: secondaryBitmap,
      };
      substatKeys.forEach((key, i) => {
        regions[key] = substatBitmaps[i];
      });

      // Debug crops don't depend on OCR text, so they still run in
      // parallel with it — but echo/set identity now does (name+cost
      // matching needs the name and secondary-stat text first, and only
      // *sometimes* needs a follow-up image-match call after that), so it
      // can no longer run alongside OCR the way the old unconditional
      // matchSetIcon call did. See resolveEchoIdentity's doc comment.
      const [texts, debugCrops] = await Promise.all([
        recognizeCandidate(regions),
        debugMode.value ? captureDebugCrops(videoEl) : Promise.resolve(undefined),
      ]);

      const identity = await resolveEchoIdentity(videoEl, texts.name ?? "", texts.secondary ?? "");

      let parsed = parseEchoCandidate({
        nameText: texts.name ?? "",
        mainStatText: texts.main ?? "",
        secondaryStatText: texts.secondary ?? "",
        substatTexts: substatKeys.map((key) => texts[key] ?? ""),
        matchedSet: identity.matchedSet,
        preResolvedEcho: identity.preResolvedEcho,
      });

      // The 5 per-row crops didn't add up to all 5 substats — most often a
      // wrapped label upstream having shifted every row below it down by
      // an amount the fixed-position crops didn't anticipate. Re-OCR one
      // wider block spanning all 5 rows (+ wrap allowance) and re-parse
      // with that as a fallback — see parse.ts's parseEchoCandidate and
      // layout.ts's SUBSTAT_BLOCK doc comments.
      if (parsed.slot.substats.some((s) => !s.subStat)) {
        const blockBitmap = await grabRegionBitmap(videoEl, SUBSTAT_BLOCK);
        const blockTexts = await recognizeCandidate({ substatBlock: blockBitmap });
        parsed = parseEchoCandidate({
          nameText: texts.name ?? "",
          mainStatText: texts.main ?? "",
          secondaryStatText: texts.secondary ?? "",
          substatTexts: substatKeys.map((key) => texts[key] ?? ""),
          substatBlockText: blockTexts.substatBlock ?? "",
          matchedSet: identity.matchedSet,
          preResolvedEcho: identity.preResolvedEcho,
        });
        if (debugCrops && parsed.usedSubstatBlockFallback) {
          const blockCrop = debugCrops.crops.find((c) => c.key === "substatBlock");
          if (blockCrop) blockCrop.text = blockTexts.substatBlock ?? "";
        }
      }
      stability.commitScan(fingerprint);

      if (parsed.needsMainStatSelection) {
        skippedCount.value++;
        return;
      }

      const signature = computeSignature(parsed.slot);
      if (dedupe.has(signature)) {
        duplicateCount.value++;
        return;
      }
      dedupe.add(signature);

      candidates.value.push({
        id: randomString(),
        slot: parsed.slot,
        confidence: parsed.confidence,
        needsMainStatSelection: false,
        usedSubstatBlockFallback: parsed.usedSubstatBlockFallback,
        signature,
        rawHeaderText: parsed.rawHeaderText,
        rawStatsText: parsed.rawStatsText,
        debugCrops: debugCrops?.crops.map((crop) => ({
          ...crop,
          text: crop.key === "setIcon" ? identity.debugLabel : (texts[crop.key] ?? crop.text),
        })),
        debugFullFrame: debugCrops?.fullFrame,
      });
    } catch (err) {
      // One bad OCR shouldn't kill the whole session — surface it via the
      // low-confidence path implicitly (candidate just won't appear) and
      // keep going. Log for diagnosis.
      console.error("Echo scanner: failed to process a candidate frame", err);
    }
  }

  function releaseResources() {
    frameSource?.stop();
    frameSource = null;
    if (openVideoHandle) {
      closeVideoHandle(openVideoHandle);
      openVideoHandle = null;
    }
    previewVideoEl.value = null;
    videoDuration.value = null;
    ocrWorker?.postMessage({ type: "terminate" });
    ocrWorker?.terminate();
    ocrWorker = null;
    setWorker?.terminate();
    setWorker = null;
  }

  function stop() {
    trackSessionEnd("stopped");
    status.value = "stopping";
    releaseResources();
    status.value = "stopped";
  }

  async function startLive() {
    resetState();
    status.value = "starting";
    try {
      await initWorkers();
      frameSource = await createScreenShareSource();
      previewVideoEl.value = frameSource.videoEl;
      status.value = "running";
      trackSessionStart("live");
      frameSource.start((tick) => {
        progress.value = { current: tick.frameIndex, total: null };
        return handleTick();
      });
    } catch (err) {
      trackError("live", "start", err);
      errorMessage.value = err instanceof Error ? err.message : String(err);
      status.value = "error";
    }
  }

  /** Opens a video file and shows a preview so the user can trim a range and pick a sample rate before scanning — see docs/scanner.md. */
  async function openVideo(file: File) {
    resetState();
    status.value = "starting";
    try {
      const handle = await openVideoFile(file);
      openVideoHandle = handle;
      previewVideoEl.value = handle.videoEl;
      videoDuration.value = handle.duration;
      status.value = "trimming";
    } catch (err) {
      trackError("video", "open", err);
      errorMessage.value = err instanceof Error ? err.message : String(err);
      status.value = "error";
    }
  }

  /** Scrubs the trim preview to a timestamp without starting a scan. Only valid while status is "trimming". */
  async function previewSeek(timeSeconds: number) {
    if (!openVideoHandle) return;
    await seekPreview(openVideoHandle, timeSeconds);
  }

  /** Discards an opened-but-not-yet-scanned video file (the trim step's "Cancel"). */
  function cancelVideo() {
    if (openVideoHandle) {
      closeVideoHandle(openVideoHandle);
      openVideoHandle = null;
    }
    previewVideoEl.value = null;
    videoDuration.value = null;
    status.value = "idle";
  }

  /** Starts scanning the already-open, already-trimmed video — the "scanVideo" half. */
  async function startVideoScan(options: VideoScanOptions = {}) {
    if (!openVideoHandle) return;
    const handle = openVideoHandle;
    status.value = "starting";
    try {
      await initWorkers();
      frameSource = createVideoFileSource(handle, options);
      openVideoHandle = null; // ownership moves to frameSource — its own stop() closes the handle
      status.value = "running";
      const start = options.startSeconds ?? 0;
      const end = options.endSeconds ?? handle.duration;
      trackSessionStart("video", {
        fps: options.fps ?? null,
        scanSeconds: Math.round(Math.max(0, end - start)),
      });
      await frameSource.start(async (tick) => {
        progress.value = { current: tick.frameIndex, total: tick.totalFrames };
        await handleTick();
      });
      trackSessionEnd("completed");
      releaseResources();
      status.value = "stopped";
    } catch (err) {
      trackError("video", trackedMode ? "scan" : "start", err);
      errorMessage.value = err instanceof Error ? err.message : String(err);
      status.value = "error";
    }
  }

  function removeCandidate(id: string) {
    candidates.value = candidates.value.filter((c) => c.id !== id);
  }

  const inventoryStore = useInventoryStore();

  /**
   * Saves one candidate straight to the inventory (same mapping the
   * duplicate-review "Continue" step would eventually use) and drops it
   * from the pending list, so it isn't saved a second time when the rest
   * of the session finishes. Used by "Edit" — see EchoScannerCapture.vue —
   * so editing can reuse the real InventoryEchoEdit.vue/EditPanel (which
   * only knows how to edit an echo that already exists in the store)
   * instead of a second, parallel edit UI. Returns the assigned echoId, or
   * null if the candidate is gone already.
   */
  function saveCandidateNow(id: string): string | null {
    const candidate = candidates.value.find((c) => c.id === id);
    if (!candidate) return null;
    const [mapped] = mapParsedEchoes([candidate.slot], true);
    inventoryStore.saveEcho(mapped);
    removeCandidate(id);
    return mapped.echoId;
  }

  function updateCandidate(id: string, updater: (candidate: ScanCandidate) => ScanCandidate) {
    candidates.value = candidates.value.map((c) => (c.id === id ? updater(c) : c));
  }

  onBeforeUnmount(() => {
    if (status.value === "running" || status.value === "starting" || status.value === "trimming") {
      stop();
    }
  });

  return {
    status,
    errorMessage,
    candidates,
    skippedCount,
    duplicateCount,
    reviewNeededCount,
    progress,
    unsupportedAspect,
    previewVideoEl,
    videoDuration,
    debugMode,
    debugRegions: DEBUG_REGIONS,
    isEchoNameKnown: (key: string) => Boolean(mainEchoesData?.[key]),
    startLive,
    openVideo,
    previewSeek,
    cancelVideo,
    startVideoScan,
    stop,
    removeCandidate,
    updateCandidate,
    saveCandidateNow,
  };
}
