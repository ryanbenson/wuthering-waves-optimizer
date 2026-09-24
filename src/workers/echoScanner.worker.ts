/**
 * Echo Scanner OCR Worker
 *
 * Purely mechanical: given a named list of ImageBitmap crops, preprocess
 * and recognize each and return the raw text per key. All echo-data
 * lookups, name/stat matching, and value snapping happen on the main
 * thread in src/scanner/parse.ts — this worker doesn't import
 * src/echoes/*, keeping the "workers receive/return plain serializable
 * objects only" rule simple to hold to.
 *
 * One region per named crop (name, main stat, fixed secondary, the substat
 * label and value columns, and — only as a fallback — the per-row substat
 * crops and the substat block; see layout.ts) rather than one big
 * multi-line block, mirroring CalculatorEchoParser.vue's
 * proven-reliable per-row Discord-bot-image approach: a crop that can only
 * contain one row's text can't have that row's text merged into or lost
 * behind a neighboring row the way a whole block's line segmentation can.
 *
 * Uses a small pool of self-hosted tesseract.js workers (public/tesseract/)
 * so a candidate's several row crops OCR in parallel, and so scanning
 * works without depending on a CDN.
 *
 * Message flow:
 *  {type:"init"} -> {type:"ready"}
 *  {type:"recognizeCandidate", id, regions: {key, bitmap}[]} ->
 *    {type:"candidateResult", id, texts: Record<key, string>, lines: Record<key, OcrLine[]>}
 *  {type:"terminate"}
 */
import { createWorker, type Worker as TesseractWorker } from "tesseract.js";

const CHAR_WHITELIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäåèéêëìíîïòóôõöùúûü0123456789.:,-'+% ";
const PSM_SINGLE_BLOCK = 6;
/** Name + main + secondary + the two substat columns = 5 crops per candidate normally (up to 11 when the per-row/block fallbacks run) — a pool keeps per-candidate latency down. */
const POOL_SIZE = 3;

type Region = { key: string; bitmap: ImageBitmap };
/** One recognized line plus its vertical extent within its own (preprocessed) crop — parse.ts's parseSubstatColumns pairs label and value lines by position. */
type OcrLine = { text: string; y0: number; y1: number };

type RecognizeCandidateMessage = {
  type: "init" | "recognizeCandidate" | "terminate";
  id?: string;
  regions?: Region[];
};

let pool: TesseractWorker[] = [];
let nextWorkerIndex = 0;

// tesseract.js spawns its own nested worker by wrapping workerPath in a
// `Blob` and calling `importScripts()` from *inside* that blob's own
// `blob:` context (its `workerBlobURL` default). A path-absolute URL like
// "/tesseract/worker.min.js" fails to resolve against a blob: base in that
// nested context ("Failed to execute 'importScripts' ... URL is invalid"),
// even though it resolves fine as a normal fetch from this worker itself —
// self.location.origin is unaffected by that nesting, so build fully
// qualified URLs instead. (The Discord-bot importer's tesseract.js usage
// never hit this because it uses tesseract's default CDN path, which is
// already a full https:// URL.)
const TESSERACT_ASSET_ORIGIN = self.location.origin;

async function createPooledWorker(): Promise<TesseractWorker> {
  const worker = await createWorker("eng", 1, {
    workerPath: `${TESSERACT_ASSET_ORIGIN}/tesseract/worker.min.js`,
    corePath: `${TESSERACT_ASSET_ORIGIN}/tesseract/tesseract-core-simd-lstm.wasm.js`,
    langPath: `${TESSERACT_ASSET_ORIGIN}/tesseract`,
    gzip: true,
  });
  await worker.setParameters({
    tessedit_char_whitelist: CHAR_WHITELIST,
    tessedit_pageseg_mode: PSM_SINGLE_BLOCK as never,
  });
  return worker;
}

async function initPool() {
  pool = await Promise.all(Array.from({ length: POOL_SIZE }, createPooledWorker));
}

function nextWorker(): TesseractWorker {
  const worker = pool[nextWorkerIndex % pool.length];
  nextWorkerIndex++;
  return worker;
}

/** Grayscale + contrast stretch + 3x upscale — same recipe CalculatorEchoParser.vue already uses for the Discord-bot flow, just on OffscreenCanvas. */
function preprocess(bitmap: ImageBitmap): OffscreenCanvas {
  const scale = 3;
  const canvas = new OffscreenCanvas(bitmap.width * scale, bitmap.height * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Couldn't get an OffscreenCanvas 2d context.");
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const contrasted = Math.max(0, Math.min(255, (gray - 128) * 1.5 + 128));
    data[i] = contrasted;
    data[i + 1] = contrasted;
    data[i + 2] = contrasted;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

async function recognizeBitmap(bitmap: ImageBitmap): Promise<{ text: string; lines: OcrLine[] }> {
  const canvas = preprocess(bitmap);
  const worker = nextWorker();
  const blob = await canvas.convertToBlob();
  // tesseract.js v6 only returns the block/line tree when asked for it.
  const result = await worker.recognize(blob, {}, { text: true, blocks: true });
  const lines = (result.data.blocks ?? [])
    .flatMap((block) => block.paragraphs.flatMap((paragraph) => paragraph.lines))
    .map((line) => ({ text: line.text.trim(), y0: line.bbox.y0, y1: line.bbox.y1 }))
    .filter((line) => line.text);
  return { text: result.data.text.trim(), lines };
}

self.addEventListener("message", (event: MessageEvent<RecognizeCandidateMessage>) => {
  const { data } = event;
  void handleMessage(data);
});

async function handleMessage(data: RecognizeCandidateMessage) {
  try {
    if (data.type === "init") {
      await initPool();
      self.postMessage({ type: "ready" });
      return;
    }

    if (data.type === "recognizeCandidate") {
      if (!data.regions?.length) {
        throw new Error("Missing regions for recognizeCandidate");
      }
      const regions = data.regions;
      const recognized = await Promise.all(
        regions.map((region) => recognizeBitmap(region.bitmap)),
      );
      for (const region of regions) region.bitmap.close();

      const texts: Record<string, string> = {};
      const lines: Record<string, OcrLine[]> = {};
      regions.forEach((region, i) => {
        texts[region.key] = recognized[i].text;
        lines[region.key] = recognized[i].lines;
      });
      self.postMessage({ type: "candidateResult", id: data.id, texts, lines });
      return;
    }

    if (data.type === "terminate") {
      await Promise.all(pool.map((worker) => worker.terminate()));
      pool = [];
      return;
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      id: data.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
