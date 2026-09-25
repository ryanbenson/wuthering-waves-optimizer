/**
 * FrameSource abstraction: both the live screen-share path and the
 * upload-a-video path resolve to the same thing downstream — an
 * HTMLVideoElement the caller can grab region crops from on each "tick".
 * Only *how* a tick is driven differs:
 *  - live: a fixed-interval timer (real time, ~8fps) over a getDisplayMedia
 *    MediaStream.
 *  - video-file: a deterministic seek-and-capture loop over an uploaded
 *    File, decoupled from real elapsed time — faster than live, and never
 *    drops a frame to decode/timer jitter the way a live capture can.
 * fingerprint.ts, stability.ts, layout.ts, parse.ts, dedupe.ts are
 * unaffected by which source is active.
 */
import type { FrameSize, RegionFrac } from "./types";
import { toPixelRegion } from "./layout";

export type FrameSourceMode = "live" | "video-file";

export type FrameTick = {
  frameIndex: number;
  /** Known upfront for video-file (duration / step); null for live (unbounded). */
  totalFrames: number | null;
};

export type FrameSource = {
  mode: FrameSourceMode;
  videoEl: HTMLVideoElement;
  frameSize(): FrameSize;
  start(onTick: (tick: FrameTick) => void | Promise<void>): void;
  stop(): void;
};

const LIVE_TICK_MS = 125; // ~8fps
const DEFAULT_VIDEO_STEP_MS = 250;

/**
 * Deliberately left detached from the document — decoding/drawImage works
 * fine on an unattached <video> in Chrome/Edge, and it keeps this module
 * DOM-tree-agnostic. The caller (EchoScannerCapture.vue) mounts this
 * element into a visible container for the live preview; canvas cropping
 * (grabRegionImageData/grabRegionBitmap below) doesn't need it mounted at all.
 */
function createVideoElement(): HTMLVideoElement {
  const videoEl = document.createElement("video");
  videoEl.muted = true;
  videoEl.playsInline = true;
  return videoEl;
}

export async function createScreenShareSource(): Promise<FrameSource> {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("Screen sharing isn't supported in this browser.");
  }
  const initialStream = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: { ideal: 8, max: 12 } },
    audio: false,
  });
  // Mutable/nullable from here so stop() can explicitly drop this module's
  // own reference to the MediaStream once it's done with it, not just rely
  // on the returned FrameSource object (and this whole closure) eventually
  // becoming unreachable once useEchoScanner.ts nulls its own frameSource
  // field — belt and suspenders for the thing that actually matters
  // (track.stop() below, which is what turns off the browser's own sharing
  // indicator), not the GC-eligibility itself.
  let stream: MediaStream | null = initialStream;

  const videoEl = createVideoElement();
  videoEl.srcObject = stream;
  await videoEl.play();

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let frameIndex = 0;
  let ticking = false;

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (stream) {
      for (const track of stream.getTracks()) track.stop();
      stream = null;
    }
    videoEl.srcObject = null;
    videoEl.remove();
  }

  // The user can end the share from the browser's own "Stop sharing" UI,
  // not just our Stop button — react to that the same way.
  initialStream.getVideoTracks()[0]?.addEventListener("ended", stop);

  function start(onTick: (tick: FrameTick) => void | Promise<void>) {
    intervalId = setInterval(() => {
      if (ticking) return; // skip a tick if the previous one's (async) onTick hasn't returned yet
      ticking = true;
      void Promise.resolve(onTick({ frameIndex: frameIndex++, totalFrames: null })).finally(
        () => {
          ticking = false;
        },
      );
    }, LIVE_TICK_MS);
  }

  return {
    mode: "live",
    videoEl,
    frameSize: () => ({ width: videoEl.videoWidth, height: videoEl.videoHeight }),
    start,
    stop,
  };
}

export function seekTo(videoEl: HTMLVideoElement, timeSeconds: number): Promise<void> {
  if (Math.abs(videoEl.currentTime - timeSeconds) < 0.001) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const onSeeked = () => {
      videoEl.removeEventListener("seeked", onSeeked);
      resolve();
    };
    videoEl.addEventListener("seeked", onSeeked);
    videoEl.currentTime = timeSeconds;
  });
}

/**
 * A loaded-but-not-yet-scanning video file: metadata is known and the first
 * frame is ready to preview, so the caller (EchoScannerCapture.vue) can show
 * a trim range + sample-rate picker before committing to a scan — same
 * open → preview/trim → scan split as the Tacet-Lab reference UI
 * (ScannerView.tsx's openVideo/scanVideo). Call seekPreview to scrub the
 * mounted preview while trimming, and either createVideoFileSource (to
 * start scanning) or closeVideoHandle (to abandon it) when done.
 */
export type VideoFileHandle = {
  videoEl: HTMLVideoElement;
  duration: number;
  objectUrl: string;
};

export async function openVideoFile(file: File): Promise<VideoFileHandle> {
  const objectUrl = URL.createObjectURL(file);
  const videoEl = createVideoElement();
  videoEl.src = objectUrl;

  await new Promise<void>((resolve, reject) => {
    videoEl.addEventListener("loadedmetadata", () => resolve(), { once: true });
    videoEl.addEventListener(
      "error",
      () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Couldn't read this video file. Try exporting it as mp4."));
      },
      { once: true },
    );
  });

  return { videoEl, duration: videoEl.duration, objectUrl };
}

/** Scrubs the handle's (already-mounted-for-preview) video element to a timestamp, without starting a scan. */
export function seekPreview(handle: VideoFileHandle, timeSeconds: number): Promise<void> {
  return seekTo(handle.videoEl, Math.max(0, Math.min(handle.duration, timeSeconds)));
}

export function closeVideoHandle(handle: VideoFileHandle): void {
  handle.videoEl.pause();
  URL.revokeObjectURL(handle.objectUrl);
  handle.videoEl.remove();
}

export type VideoScanOptions = {
  /** Defaults to the whole clip. */
  startSeconds?: number;
  endSeconds?: number;
  /** Samples per second of video, converted to a seek step. Defaults to 4fps: stability.ts needs 3 consecutive matching samples to call a frame settled, so 2fps missed echoes clicked through every 1-2s. */
  fps?: number;
};

const DEFAULT_VIDEO_FPS = 1000 / DEFAULT_VIDEO_STEP_MS; // 4, if fps isn't given

/** Starts scanning an already-open handle over [startSeconds, endSeconds] at the given sample rate — the "scanVideo" half of the open/trim/scan split. */
export function createVideoFileSource(
  handle: VideoFileHandle,
  options: VideoScanOptions = {},
): FrameSource {
  const { videoEl } = handle;
  const stepSeconds = 1 / (options.fps ?? DEFAULT_VIDEO_FPS);
  const startSeconds = Math.max(0, Math.min(handle.duration, options.startSeconds ?? 0));
  const endSeconds = Math.max(startSeconds, Math.min(handle.duration, options.endSeconds ?? handle.duration));

  let stopped = false;

  function stop() {
    stopped = true;
    closeVideoHandle(handle);
  }

  async function start(onTick: (tick: FrameTick) => void | Promise<void>) {
    const totalFrames = Math.max(1, Math.ceil((endSeconds - startSeconds) / stepSeconds));
    let frameIndex = 0;
    let t = startSeconds;
    while (!stopped && t <= endSeconds) {
      await seekTo(videoEl, t);
      if (stopped) break;
      await onTick({ frameIndex, totalFrames });
      frameIndex++;
      t += stepSeconds;
    }
    stopped = true;
  }

  return {
    mode: "video-file",
    videoEl,
    frameSize: () => ({ width: videoEl.videoWidth, height: videoEl.videoHeight }),
    start,
    stop,
  };
}

/** Draws one region of the current video frame to a right-sized canvas and reads it back as ImageData — used for the cheap fingerprint gate. */
export function grabRegionImageData(
  videoEl: HTMLVideoElement,
  regionFrac: RegionFrac,
): ImageData {
  const frame: FrameSize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
  const region = toPixelRegion(regionFrac, frame);
  const canvas = document.createElement("canvas");
  canvas.width = region.width;
  canvas.height = region.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Couldn't get a 2d canvas context.");
  ctx.drawImage(
    videoEl,
    region.x,
    region.y,
    region.width,
    region.height,
    0,
    0,
    region.width,
    region.height,
  );
  return ctx.getImageData(0, 0, region.width, region.height);
}

/** Same crop, but as a transferable ImageBitmap — for handing a region off to the OCR worker. */
export async function grabRegionBitmap(
  videoEl: HTMLVideoElement,
  regionFrac: RegionFrac,
): Promise<ImageBitmap> {
  const frame: FrameSize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
  const region = toPixelRegion(regionFrac, frame);
  const canvas = document.createElement("canvas");
  canvas.width = region.width;
  canvas.height = region.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't get a 2d canvas context.");
  ctx.drawImage(
    videoEl,
    region.x,
    region.y,
    region.width,
    region.height,
    0,
    0,
    region.width,
    region.height,
  );
  return createImageBitmap(canvas);
}

/**
 * Same crop as grabRegionBitmap, but also returns a `data:` URL preview of
 * exactly the same pixels — for the scanner's debug view (see
 * EchoScannerCapture.vue), so what the user sees is provably the same crop
 * the worker actually OCR's, not a re-derived approximation. Only called
 * when debug mode is on — the extra `toDataURL()` encode isn't free, so
 * normal scanning stays on the plain grabRegionBitmap path.
 */
export async function grabRegionWithPreview(
  videoEl: HTMLVideoElement,
  regionFrac: RegionFrac,
): Promise<{ bitmap: ImageBitmap; dataUrl: string }> {
  const frame: FrameSize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
  const region = toPixelRegion(regionFrac, frame);
  const canvas = document.createElement("canvas");
  canvas.width = region.width;
  canvas.height = region.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't get a 2d canvas context.");
  ctx.drawImage(
    videoEl,
    region.x,
    region.y,
    region.width,
    region.height,
    0,
    0,
    region.width,
    region.height,
  );
  // createImageBitmap doesn't consume the canvas, so both come from one draw.
  const bitmap = await createImageBitmap(canvas);
  const dataUrl = canvas.toDataURL("image/png");
  return { bitmap, dataUrl };
}

/**
 * A downscaled JPEG of one region — the review list's "in-game capture"
 * of each echo's detail panel (PANEL_BOX), kept for every candidate, not
 * only in debug mode, so a flagged echo can be checked against what the
 * game actually showed. JPEG at maxWidth keeps one at ~30-50KB; they live
 * only in memory and are dropped with the candidate list.
 *
 * Draws synchronously before returning, like the other grab* helpers, so
 * a caller starting it alongside them gets the same frame.
 */
export function grabRegionPreviewJpeg(
  videoEl: HTMLVideoElement,
  regionFrac: RegionFrac,
  maxWidth = 480,
): string {
  const frame: FrameSize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
  const region = toPixelRegion(regionFrac, frame);
  const scale = Math.min(1, maxWidth / region.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(region.width * scale));
  canvas.height = Math.max(1, Math.round(region.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't get a 2d canvas context.");
  ctx.drawImage(videoEl, region.x, region.y, region.width, region.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

/**
 * A downscaled snapshot of the *whole* frame — for the scanner's debug
 * view (EchoScannerCapture.vue) to draw every ROI box on top of, as one
 * reviewable image per candidate rather than only the small per-region
 * crops. Downscaled (default 960px wide, matching the source's aspect) so
 * a long debug session's candidate list doesn't hold a full-resolution PNG
 * per echo — the boxes are still perfectly placeable on it since they're
 * positioned by CSS percentage, not pixels.
 */
export async function grabFullFrameSnapshot(
  videoEl: HTMLVideoElement,
  maxWidth = 960,
): Promise<string> {
  const frame: FrameSize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
  const scale = Math.min(1, maxWidth / frame.width);
  const width = Math.round(frame.width * scale);
  const height = Math.round(frame.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't get a 2d canvas context.");
  ctx.drawImage(videoEl, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * Finds the tight bounding box of "icon" content within a generously-sized
 * crop, by sampling the crop's four corners as a background reference (a
 * crop with any margin around a centered circular icon is guaranteed to
 * have plain background in its corners) and thresholding every pixel by
 * color distance from that sample.
 *
 * This exists because SET_ICON_BOX's own measured bounds — hand-tuned
 * against a couple of real screenshots — can't be pixel-perfect for every
 * capture, and a *inscribed-circle* mask sized to the box (not to the
 * icon's real edge) silently bakes in whatever slack remains as a ring of
 * true background color just inside the mask. That ring is invisible at a
 * glance but matters a lot downstream: echoParser.worker.ts's matchSetFirst
 * stretches both the captured crop and the (tightly-cropped, no-margin)
 * reference set image to the same 32x32 canvas before comparing — so a
 * crop with a lingering background ring makes the real icon content
 * occupy less of that 32x32 square than the reference's icon does, a
 * scale mismatch that throws off both the color-family and pixel-diff
 * signals matchSetFirst uses. (Confirmed from a side-by-side debug-view
 * screenshot: the captured icon visibly smaller than the reference it was
 * being compared against.) Detecting the icon's real bounds and cropping
 * to *that* — rather than trusting the configured box's own bounds —
 * keeps the two at the same relative scale regardless of how loose the
 * box's margin actually is.
 *
 * Returns null (caller falls back to the full crop) if nothing in the
 * crop is distinguishable from its own corners — e.g. a solid-color crop,
 * or one where the "icon" already fills the entire box with no margin to
 * sample a background from.
 */
export function detectIconBounds(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): { x: number; y: number; width: number; height: number } | null {
  if (width < 2 || height < 2) return null;

  const sampleAt = (x: number, y: number): [number, number, number] => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  // Average a few corner pixels each, not just one, for some robustness
  // against video-compression noise in a real capture.
  const corners: [number, number][] = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let br = 0;
  let bg = 0;
  let bb = 0;
  for (const [cx, cy] of corners) {
    const [r, g, b] = sampleAt(cx, cy);
    br += r;
    bg += g;
    bb += b;
  }
  br /= corners.length;
  bg /= corners.length;
  bb /= corners.length;

  const BACKGROUND_DISTANCE_THRESHOLD = 28; // empirically enough to separate icon art from a flat panel background
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = sampleAt(x, y);
      const dist = Math.sqrt((r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2);
      if (dist > BACKGROUND_DISTANCE_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX || maxY < minY) return null;

  const foundWidth = maxX - minX + 1;
  const foundHeight = maxY - minY + 1;
  // Guard against a degenerate detection: too small to be the icon (noise)
  // or so close to the full box that nothing was really distinguished.
  if (foundWidth < width * 0.5 || foundHeight < height * 0.5) return null;
  if (foundWidth >= width - 1 && foundHeight >= height - 1) return null;

  return { x: minX, y: minY, width: foundWidth, height: foundHeight };
}

/**
 * Crops one region and makes every pixel outside a centered circle fully
 * transparent — used only for the set-icon crop, before handing it to
 * echoParser.worker.ts's matchSetFirst.
 *
 * That worker's own background handling (extractImageRegion, and
 * matchSetFirst's own second masking pass) only clears pixels close to
 * *black* — correct for the Discord-bot flow, whose reference image is
 * rendered on a black canvas specifically so that convention works, but
 * wrong for a live capture: the set icon sits on the game's own reddish
 * panel background, which is nowhere near black, so none of it gets
 * masked. getDominantColors then picks up that background color as one of
 * the crop's "dominant colors" alongside (or instead of) the icon's own
 * color, which corrupts the color-family comparison matchSetFirst leans
 * on most heavily — a real cause of consistently wrong set matches,
 * confirmed by comparing a captured crop against a reference icon image
 * (transparent background) side by side.
 *
 * Masking by *shape* instead of *color* sidesteps that: the icon is
 * circular, so a centered circular alpha mask removes the background
 * regardless of what color it actually is, without needing to touch
 * echoParser.worker.ts's shared masking logic (used by the Discord-bot
 * flow too) at all. The circle is inscribed in the *detected icon bounds*
 * (detectIconBounds), not just SET_ICON_BOX's own configured bounds — see
 * that function's doc comment for why that distinction is what actually
 * fixes the scale-mismatch-vs-reference problem, on top of the color fix.
 */
export async function grabCircularMaskedBitmap(
  videoEl: HTMLVideoElement,
  regionFrac: RegionFrac,
): Promise<ImageBitmap> {
  const frame: FrameSize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
  const region = toPixelRegion(regionFrac, frame);
  const canvas = document.createElement("canvas");
  canvas.width = region.width;
  canvas.height = region.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Couldn't get a 2d canvas context.");
  ctx.drawImage(
    videoEl,
    region.x,
    region.y,
    region.width,
    region.height,
    0,
    0,
    region.width,
    region.height,
  );

  const rawImageData = ctx.getImageData(0, 0, region.width, region.height);
  const bounds = detectIconBounds(rawImageData.data, region.width, region.height) ?? {
    x: 0,
    y: 0,
    width: region.width,
    height: region.height,
  };

  // Re-crop tight to the detected bounds before masking, onto a fresh
  // canvas, so the circle cut out matches the icon's own real edge rather
  // than whatever margin SET_ICON_BOX happened to leave around it.
  const tightCanvas = document.createElement("canvas");
  tightCanvas.width = bounds.width;
  tightCanvas.height = bounds.height;
  const tightCtx = tightCanvas.getContext("2d", { willReadFrequently: true });
  if (!tightCtx) throw new Error("Couldn't get a 2d canvas context.");
  tightCtx.drawImage(
    canvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    0,
    0,
    bounds.width,
    bounds.height,
  );

  const imageData = tightCtx.getImageData(0, 0, bounds.width, bounds.height);
  const data = imageData.data;
  const cx = bounds.width / 2;
  const cy = bounds.height / 2;
  const radius = Math.min(bounds.width, bounds.height) / 2;
  const radiusSquared = radius * radius;
  for (let y = 0; y < bounds.height; y++) {
    for (let x = 0; x < bounds.width; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      if (dx * dx + dy * dy > radiusSquared) {
        data[(y * bounds.width + x) * 4 + 3] = 0;
      }
    }
  }
  tightCtx.putImageData(imageData, 0, 0);
  return createImageBitmap(tightCanvas);
}
