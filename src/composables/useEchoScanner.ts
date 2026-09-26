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
import { describeAspect, describeError } from "../scanner/analytics";
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
  grabRegionPreviewJpeg,
  type FrameSource,
  type VideoFileHandle,
  type VideoScanOptions,
} from "../scanner/capture";
import { computeFingerprint, STATS_FINGERPRINT_GRID } from "../scanner/fingerprint";
import { createStableFrameDetector } from "../scanner/stability";
import { createDedupeSet, computeSignature } from "../scanner/dedupe";
import { createSerialQueue, type SerialQueue } from "../scanner/queue";
import { createCaptureCue } from "../scanner/captureCue";
import { needsAttention } from "../scanner/review";
import { parseEchoCandidate, resolveEchoByNameAndCost } from "../scanner/parse";
import {
  PANEL_BOX,
  STATS_BLOCK,
  NAME_BLOCK,
  MAIN_STAT_ROW,
  SECONDARY_STAT_ROW,
  SUBSTAT_ROWS,
  SUBSTAT_BLOCK,
  SUBSTAT_LABEL_COLUMN,
  SUBSTAT_VALUE_COLUMN,
  SET_ICON_BOX,
  DEBUG_REGIONS,
  isSupportedAspect,
} from "../scanner/layout";
import { echoSetImageMap, getEchoSetLabelByType } from "../echoes/stats";
import { mainEchoesData } from "../echoes/index";
import { mapParsedEchoes } from "../echoes/parsedEchoMapping";
import { useInventoryStore } from "../stores/inventory";
import { randomString } from "../utils/strings";
import type { OcrLine, ScanCandidate } from "../scanner/types";
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
  | "stopping" // capture has ended; still OCR'ing whatever was queued before it did
  | "stopped"
  | "error";

/**
 * A video file can simply wait for OCR to catch up, so its seek loop pauses
 * once this many snapshots are queued — keeps memory bounded on a long clip.
 * A live share can't wait (the user is still clicking), so it has no cap;
 * each snapshot is only a few MB of small crops. See docs/scanner.md's
 * "Capture queue".
 */
const VIDEO_MAX_PENDING = 3;

/**
 * Every crop one candidate could need, all drawn from the *same* frame at
 * the tick it settled — see snapshotFrame. The set icon and fallback crops
 * are only sometimes used, but grabbing them later would read whatever
 * echo the user has clicked to since.
 */
type FrameSnapshot = {
  primary: Record<"name" | "main" | "secondary" | "substatLabels" | "substatValues", ImageBitmap>;
  setIcon: ImageBitmap;
  /** substatBlock + sub0..sub4 — the per-row/block fallback passes. */
  fallback: Record<string, ImageBitmap>;
  /** The review list's "in-game capture" — see capture.ts's grabRegionPreviewJpeg. */
  panelPreview: string;
  debug?: Awaited<ReturnType<typeof captureDebugCropsFromVideo>>;
};

type ScanJob = {
  snapshot: Promise<FrameSnapshot>;
  capturedAt: number;
  /** 1-based capture order within the session — see ScanCandidate.captureIndex. */
  captureIndex: number;
  session: number;
};

/** Running min/avg/max of a series of millisecond samples — for the debug view's timing readout. */
type TimingStat = { count: number; avgMs: number; maxMs: number };

export type ScannerTimings = {
  /** Gap between live ticks while this page was visible vs. hidden (e.g. the game full screen on top). The live timer targets 125ms; a hidden page's timers get throttled by the browser. */
  tickGap: { visible: TimingStat; hidden: TimingStat };
  /** Settle → queued job starts processing. */
  queueWait: TimingStat;
  /** One job's OCR + matching + parsing. */
  process: TimingStat;
  /** Most jobs queued at once this session. */
  maxPending: number;
};

function emptyStat(): TimingStat {
  return { count: 0, avgMs: 0, maxMs: 0 };
}

function recordStat(stat: TimingStat, ms: number) {
  stat.avgMs = (stat.avgMs * stat.count + ms) / (stat.count + 1);
  stat.count++;
  stat.maxMs = Math.max(stat.maxMs, ms);
}

function emptyTimings(): ScannerTimings {
  return {
    tickGap: { visible: emptyStat(), hidden: emptyStat() },
    queueWait: emptyStat(),
    process: emptyStat(),
    maxPending: 0,
  };
}

function closeSnapshot(snapshot: FrameSnapshot) {
  // Transferred bitmaps are already detached; close() on them is a no-op.
  for (const bitmap of Object.values(snapshot.primary)) bitmap.close();
  for (const bitmap of Object.values(snapshot.fallback)) bitmap.close();
  snapshot.setIcon.close();
}

/**
 * Grabs a labeled crop thumbnail for every DEBUG_REGIONS entry, plus a
 * whole-frame snapshot to draw all of them on top of as one reviewable
 * image (EchoScannerCapture.vue), from the current (stable,
 * about-to-be-scanned) frame. Independent of the OCR-dedicated
 * grabRegionBitmap calls in snapshotFrame — these are their own draws, so
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
 *
 * Every draw here happens synchronously on call (before any await), so
 * snapshotFrame can start this alongside its own grabs and get the same frame.
 */
async function captureDebugCropsFromVideo(videoEl: HTMLVideoElement) {
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
          masked.close();
          return { key, label, dataUrl: canvas.toDataURL("image/png"), text: "(image-matched, not OCR'd)" };
        }
        const { bitmap, dataUrl } = await grabRegionWithPreview(videoEl, region);
        bitmap.close();
        return { key, label, dataUrl, text: key === "panel" ? "(image-matched, not OCR'd)" : "" };
      }),
    ),
    grabFullFrameSnapshot(videoEl),
  ]);
  return { crops, fullFrame };
}

/**
 * Starts every crop a candidate could need from the video's *current*
 * frame. Each grab* helper in capture.ts draws to its own canvas
 * synchronously before its first await, so starting them all in this one
 * synchronous call pins every crop to the same frame, even though the
 * returned promise settles later. The caller must not await anything
 * between the stability check and this call.
 */
function snapshotFrame(videoEl: HTMLVideoElement, withDebug: boolean): Promise<FrameSnapshot> {
  const primary = Promise.all([
    grabRegionBitmap(videoEl, NAME_BLOCK),
    grabRegionBitmap(videoEl, MAIN_STAT_ROW),
    grabRegionBitmap(videoEl, SECONDARY_STAT_ROW),
    grabRegionBitmap(videoEl, SUBSTAT_LABEL_COLUMN),
    grabRegionBitmap(videoEl, SUBSTAT_VALUE_COLUMN),
  ]);
  const setIcon = grabCircularMaskedBitmap(videoEl, SET_ICON_BOX);
  const fallback = Promise.all([
    grabRegionBitmap(videoEl, SUBSTAT_BLOCK),
    ...SUBSTAT_ROWS.map((region) => grabRegionBitmap(videoEl, region)),
  ]);
  const debug = withDebug ? captureDebugCropsFromVideo(videoEl) : Promise.resolve(undefined);
  const panelPreview = grabRegionPreviewJpeg(videoEl, PANEL_BOX);

  return Promise.all([primary, setIcon, fallback, debug]).then(
    ([[name, main, secondary, substatLabels, substatValues], setIconBitmap, [block, ...rows], debugCrops]) => {
      const fallbackBitmaps: Record<string, ImageBitmap> = { substatBlock: block };
      rows.forEach((bitmap, i) => {
        fallbackBitmaps[`sub${i}`] = bitmap;
      });
      return {
        primary: { name, main, secondary, substatLabels, substatValues },
        setIcon: setIconBitmap,
        fallback: fallbackBitmaps,
        panelPreview,
        debug: debugCrops,
      };
    },
  );
}

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
  /** Settled echoes captured but not yet OCR'd (queued + in flight). */
  const pendingCount = ref(0);
  /** Tick/queue/OCR timings for the debug view — see ScannerTimings. */
  const timings = ref<ScannerTimings>(emptyTimings());

  const reviewNeededCount = computed(() => candidates.value.filter((c) => needsAttention(c)).length);
  /**
   * Play a short blip on each live capture — see captureCue.ts. Set by the
   * component before starting; only live shares use it (a video scan has
   * no one clicking along).
   */
  const captureCueEnabled = ref(false);
  const captureCue = createCaptureCue();

  let frameSource: FrameSource | null = null;
  let openVideoHandle: VideoFileHandle | null = null;
  let ocrWorker: Worker | null = null;
  let setWorker: Worker | null = null;
  let setWorkerReady: Promise<void> | null = null;
  const stability = createStableFrameDetector();
  const dedupe = createDedupeSet();
  /**
   * Bumped whenever a session is reset or aborted, so a job still in
   * flight from an older session can tell it's stale and drop its result.
   */
  let session = 0;
  let lastTickAt: number | null = null;
  let captureCount = 0;
  // A fresh queue per session: aborting terminates the OCR worker, which
  // can leave the in-flight job's promise unresolved forever — it must not
  // block the next session's queue.
  let queue: SerialQueue<ScanJob> = createScanQueue();

  function createScanQueue() {
    return createSerialQueue<ScanJob>(processJob, {
      onDiscard: (job) => void job.snapshot.then(closeSnapshot, () => {}),
      onPendingChange: (pending) => {
        pendingCount.value = pending;
        if (pending > timings.value.maxPending) timings.value.maxPending = pending;
      },
    });
  }

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
      ...describeError(err),
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
    session++;
    queue.clear();
    queue = createScanQueue();
    pendingCount.value = 0;
    timings.value = emptyTimings();
    lastTickAt = null;
    captureCount = 0;
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
    return new Promise<{ texts: Record<string, string>; lines: Record<string, OcrLine[]> }>((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data?.id !== id) return;
        ocrWorker?.removeEventListener("message", handler);
        if (e.data.type === "candidateResult") {
          resolve({ texts: e.data.texts, lines: e.data.lines });
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
   * Shared plumbing for both set-matching calls below: send the snapshot's
   * circularly-masked icon crop (see capture.ts's grabCircularMaskedBitmap
   * — the worker's own black-only masking is wrong for this scanner's
   * actual game-UI background, so the crop is pre-masked before it ever
   * reaches the worker) as the source image, then post whichever match
   * message the caller wants against it. setCoords covers the whole
   * already-cropped, already-masked bitmap (no further cropping needed
   * from the worker's own — now effectively no-op for this path —
   * masking pass). Transfers maskedBitmap to the worker.
   */
  async function runSetMatch(
    maskedBitmap: ImageBitmap,
    message: { type: "matchSetFirst" | "matchSet"; data: Record<string, unknown> },
  ): Promise<string | null> {
    if (!setWorker) return null;
    await setWorkerReady;
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
  async function matchSetIcon(maskedBitmap: ImageBitmap): Promise<string | null> {
    return runSetMatch(maskedBitmap, {
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
  async function matchSetNarrowed(maskedBitmap: ImageBitmap, candidateSets: string[]): Promise<string | null> {
    const setImageUrls: Record<string, string> = {};
    for (const key of candidateSets) {
      if (echoSetImageMap[key]) setImageUrls[key] = echoSetImageMap[key];
    }
    return runSetMatch(maskedBitmap, { type: "matchSet", data: { possibleSets: candidateSets, setImageUrls } });
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
    setIconBitmap: ImageBitmap,
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
      const narrowedSet = await matchSetNarrowed(setIconBitmap, byName.candidateSets);
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
    const fallbackSet = await matchSetIcon(setIconBitmap);
    return {
      preResolvedEcho: null,
      matchedSet: fallbackSet,
      debugLabel: fallbackSet
        ? `Name unresolved — fell back to full image match: ${getEchoSetLabelByType(fallbackSet) ?? fallbackSet}`
        : "Name unresolved, and no set match either",
    };
  }

  function recordTickGap() {
    const now = performance.now();
    if (lastTickAt !== null) {
      const hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
      recordStat(hidden ? timings.value.tickGap.hidden : timings.value.tickGap.visible, now - lastTickAt);
    }
    lastTickAt = now;
  }

  /**
   * The per-tick gate: fingerprint the frame, and once it settles on a new
   * echo, snapshot every crop from that frame and queue it. Never awaits
   * OCR, so the live tick loop keeps sampling while earlier echoes are
   * still being read — see docs/scanner.md's "Capture queue".
   */
  function handleTick() {
    if (!frameSource) return;
    recordTickGap();
    const videoEl = frameSource.videoEl;
    const frame = frameSource.frameSize();
    if (frame.width === 0 || frame.height === 0) return;

    if (!isSupportedAspect(frame)) {
      unsupportedAspect.value = true;
      if (trackedMode && !trackedAspect) {
        trackedAspect = true;
        trackEvent("scanner-unsupported-aspect", {
          mode: trackedMode,
          ...describeAspect(frame),
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

    // No await between observe() and here — the snapshot must be this frame.
    const snapshot = snapshotFrame(videoEl, debugMode.value);
    // processJob awaits it later; this only stops an early rejection from
    // being reported as unhandled while the job waits its turn.
    snapshot.catch(() => {});
    // Committed at capture, not after OCR: the next ticks must see this
    // echo as already taken, or it would be queued again on every tick
    // until its OCR finished.
    stability.commitScan(fingerprint);
    captureCount++;
    queue.enqueue({ snapshot, capturedAt: performance.now(), captureIndex: captureCount, session });
    captureCue.play();
  }

  /** OCR + match + parse one queued snapshot, then add it to the candidate list. Runs one at a time, in capture order (see queue.ts). */
  async function processJob(job: ScanJob) {
    const snapshot = await job.snapshot;
    if (job.session !== session) {
      closeSnapshot(snapshot);
      return;
    }
    const startedAt = performance.now();
    recordStat(timings.value.queueWait, startedAt - job.capturedAt);
    try {
      const { primary, fallback, debug } = snapshot;
      const { texts, lines } = await recognizeCandidate({ ...primary });
      if (job.session !== session) return;

      const identity = await resolveEchoIdentity(snapshot.setIcon, texts.name ?? "", texts.secondary ?? "");
      if (job.session !== session) return;

      const candidateInput = {
        nameText: texts.name ?? "",
        mainStatText: texts.main ?? "",
        secondaryStatText: texts.secondary ?? "",
        substatLabelLines: lines.substatLabels ?? [],
        substatValueLines: lines.substatValues ?? [],
        matchedSet: identity.matchedSet,
        preResolvedEcho: identity.preResolvedEcho,
      };
      let parsed = parseEchoCandidate(candidateInput);

      // The label/value column pass didn't add up to all 5 substats. OCR
      // the older per-row crops and the whole substat block in one batch
      // and let parseEchoCandidate keep whichever pass recovers the most —
      // see its doc comment and docs/scanner.md's "Substat OCR".
      if (parsed.slot.substats.some((s) => !s.subStat)) {
        const substatKeys = SUBSTAT_ROWS.map((_, i) => `sub${i}`);
        const fallbackResult = await recognizeCandidate({ ...fallback });
        if (job.session !== session) return;
        Object.assign(texts, fallbackResult.texts);
        parsed = parseEchoCandidate({
          ...candidateInput,
          substatTexts: substatKeys.map((key) => fallbackResult.texts[key] ?? ""),
          substatBlockText: fallbackResult.texts.substatBlock ?? "",
        });
      }
      recordStat(timings.value.process, performance.now() - startedAt);

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
        captureIndex: job.captureIndex,
        panelPreviewUrl: snapshot.panelPreview,
        substatSource: parsed.substatSource,
        signature,
        rawHeaderText: parsed.rawHeaderText,
        rawStatsText: parsed.rawStatsText,
        debugCrops: debug?.crops.map((crop) => ({
          ...crop,
          text: crop.key === "setIcon" ? identity.debugLabel : (texts[crop.key] ?? crop.text),
        })),
        debugFullFrame: debug?.fullFrame,
      });
    } catch (err) {
      // One bad OCR shouldn't kill the whole session — surface it via the
      // low-confidence path implicitly (candidate just won't appear) and
      // keep going. Log for diagnosis.
      console.error("Echo scanner: failed to process a candidate frame", err);
    } finally {
      closeSnapshot(snapshot);
    }
  }

  /** Ends capture (and with it the screen share / video file) without touching the OCR workers — queued snapshots can still finish. */
  function releaseCapture() {
    captureCue.close();
    frameSource?.stop();
    frameSource = null;
    if (openVideoHandle) {
      closeVideoHandle(openVideoHandle);
      openVideoHandle = null;
    }
    previewVideoEl.value = null;
    videoDuration.value = null;
  }

  function releaseWorkers() {
    ocrWorker?.postMessage({ type: "terminate" });
    ocrWorker?.terminate();
    ocrWorker = null;
    setWorker?.terminate();
    setWorker = null;
  }

  /**
   * Stops capturing immediately, then finishes OCR'ing whatever was
   * already queued (status "stopping") before releasing the workers.
   * Shared by the Stop button and a video scan reaching its end; a no-op
   * if a finish is already under way.
   */
  async function finishSession(outcome: "completed" | "stopped") {
    if (status.value === "stopping" || status.value === "stopped") return;
    trackSessionEnd(outcome);
    status.value = "stopping";
    releaseCapture();
    const finishing = session;
    await queue.onIdle();
    if (finishing !== session) return; // aborted or restarted meanwhile
    releaseWorkers();
    status.value = "stopped";
  }

  function stop() {
    return finishSession("stopped");
  }

  /** Tears everything down right away, dropping queued snapshots — for when the component itself is going away. */
  function abort() {
    trackSessionEnd("stopped");
    session++;
    queue.clear();
    releaseCapture();
    releaseWorkers();
    status.value = "stopped";
  }

  async function startLive() {
    resetState();
    status.value = "starting";
    // Opened here, inside the Start click, or the browser keeps it suspended.
    if (captureCueEnabled.value) captureCue.open();
    try {
      await initWorkers();
      frameSource = await createScreenShareSource();
      previewVideoEl.value = frameSource.videoEl;
      status.value = "running";
      trackSessionStart("live");
      frameSource.start((tick) => {
        progress.value = { current: tick.frameIndex, total: null };
        handleTick();
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
        handleTick();
        // Unlike a live share, a video can wait for OCR to catch up.
        await queue.waitForRoom(VIDEO_MAX_PENDING);
      });
      // No-op if Stop was already pressed mid-scan (it owns the finish then).
      await finishSession("completed");
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
    // Includes "stopping": a Stop that's still draining the queue has
    // nowhere to deliver its results once the component is gone.
    if (["running", "starting", "trimming", "stopping"].includes(status.value)) {
      abort();
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
    captureCueEnabled,
    pendingCount,
    timings,
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
