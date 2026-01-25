/**
 * Echo Parser Worker
 *
 * This web worker processes echo image matching from OCR screenshots.
 * It matches echo (monster) images first, then determines the echo set.
 * All image processing uses OffscreenCanvas to avoid blocking the main thread.
 *
 * Message Flow:
 * 1. Main thread sends "init" with echo reference images -> Worker responds with "ready"
 * 2. Main thread sends "parseEcho" with image data and coordinates -> Worker responds with match results
 * 3. Main thread sends "matchSet" with image data and possible sets -> Worker responds with set match
 */

interface EchoReference {
  key: string;
  imageUrl: string;
  imageBitmap?: ImageBitmap;
}

interface ParseEchoMessage {
  type: "init" | "setSourceImage" | "parseEcho" | "matchSet";
  data?: {
    echoReferences?: EchoReference[];
    sourceImageBitmap?: ImageBitmap;
    echoCoords?: { x: number; y: number; width: number; height: number };
    setCoords?: { x: number; y: number; width: number; height: number };
    possibleSets?: string[];
    setImageUrls?: Record<string, string>;
  };
}

interface ParseEchoResponse {
  type: "ready" | "echoMatch" | "setMatch" | "error";
  echoMatch?: {
    echoKey: string;
    diff: number;
  };
  setMatch?: {
    setKey: string;
    diff: number;
  };
  error?: string;
}

// Store echo references in the worker
let echoReferences: EchoReference[] = [];
let setImageBitmaps: Map<string, ImageBitmap> = new Map();
let sourceImageBitmap: ImageBitmap | null = null;

/**
 * Load an image from URL and convert to ImageBitmap
 */
async function loadImageBitmap(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  const blob = await response.blob();
  return await createImageBitmap(blob);
}

/**
 * Extract image region from source image
 */
function extractImageRegion(
  sourceBitmap: ImageBitmap,
  coords: { x: number; y: number; width: number; height: number },
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(coords.width, coords.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to get 2d context");
  }
  ctx.drawImage(
    sourceBitmap,
    coords.x,
    coords.y,
    coords.width,
    coords.height,
    0,
    0,
    coords.width,
    coords.height,
  );
  return canvas;
}

/**
 * Increase contrast on an image
 */
function increaseContrast(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  factor: number = 2.0,
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Increase contrast by pushing values away from midpoint (128)
  // Formula: newValue = ((value - 128) * factor) + 128
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Apply contrast to each channel
    const rAdjusted = Math.max(
      0,
      Math.min(255, (r - 128) * factor + 128),
    );
    const gAdjusted = Math.max(
      0,
      Math.min(255, (g - 128) * factor + 128),
    );
    const bAdjusted = Math.max(
      0,
      Math.min(255, (b - 128) * factor + 128),
    );
    data[i] = rAdjusted; // R
    data[i + 1] = gAdjusted; // G
    data[i + 2] = bAdjusted; // B
    // Alpha channel (data[i + 3]) remains unchanged
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Compare two image contexts using pixel difference
 */
function compareImages(
  ctxA: OffscreenCanvasRenderingContext2D,
  ctxB: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  const dataA = ctxA.getImageData(0, 0, width, height).data;
  const dataB = ctxB.getImageData(0, 0, width, height).data;

  let diff = 0;
  for (let i = 0; i < dataA.length; i += 4) {
    const rDiff = dataA[i] - dataB[i];
    const gDiff = dataA[i + 1] - dataB[i + 1];
    const bDiff = dataA[i + 2] - dataB[i + 2];
    diff += rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
  }

  return diff;
}

/**
 * Match echo from image region
 * This matches against ALL echoes (not filtered by cost) and applies contrast increase
 */
async function matchEcho(
  sourceBitmap: ImageBitmap,
  echoCoords: { x: number; y: number; width: number; height: number },
): Promise<{ echoKey: string; diff: number } | null> {
  // Extract the echo region
  const regionCanvas = extractImageRegion(sourceBitmap, echoCoords);
  const regionCtx = regionCanvas.getContext("2d");
  if (!regionCtx) {
    throw new Error("Failed to get 2d context for region");
  }

  // Apply contrast increase ONLY for echo comparison
  increaseContrast(
    regionCtx,
    echoCoords.width,
    echoCoords.height,
    2.0,
  );

  let bestMatch: string | null = null;
  let lowestDiff = Infinity;

  // Compare against ALL echoes (not filtered by cost)
  for (const echoRef of echoReferences) {
    if (!echoRef.imageBitmap) {
      continue;
    }

    // Create canvas for reference image
    const refCanvas = new OffscreenCanvas(
      echoCoords.width,
      echoCoords.height,
    );
    const refCtx = refCanvas.getContext("2d");
    if (!refCtx) {
      continue;
    }

    // Draw and scale reference image
    refCtx.drawImage(
      echoRef.imageBitmap,
      0,
      0,
      echoCoords.width,
      echoCoords.height,
    );

    // Apply contrast increase to reference image as well
    increaseContrast(refCtx, echoCoords.width, echoCoords.height, 2.0);

    // Compare images
    const diff = compareImages(
      regionCtx,
      refCtx,
      echoCoords.width,
      echoCoords.height,
    );

    if (diff < lowestDiff) {
      lowestDiff = diff;
      bestMatch = echoRef.key;
    }
  }

  if (bestMatch === null) {
    return null;
  }

  return {
    echoKey: bestMatch,
    diff: lowestDiff,
  };
}

/**
 * Match echo set from image region
 * This matches against possible sets for the matched echo
 */
async function matchSet(
  sourceBitmap: ImageBitmap,
  setCoords: { x: number; y: number; width: number; height: number },
  possibleSets: string[],
  setImageUrls: Record<string, string>,
): Promise<{ setKey: string; diff: number } | null> {
  // Extract the set region
  const regionCanvas = extractImageRegion(sourceBitmap, setCoords);
  const regionCtx = regionCanvas.getContext("2d");
  if (!regionCtx) {
    throw new Error("Failed to get 2d context for set region");
  }

  // Resize to 32x32 for set comparison
  const resizedCanvas = new OffscreenCanvas(32, 32);
  const resizedCtx = resizedCanvas.getContext("2d");
  if (!resizedCtx) {
    throw new Error("Failed to get 2d context for resized set");
  }
  resizedCtx.drawImage(regionCanvas, 0, 0, 32, 32);

  let bestMatch: string | null = null;
  let lowestDiff = Infinity;

  // Compare against possible sets
  for (const setKey of possibleSets) {
    const setBitmap = setImageBitmaps.get(setKey);
    if (!setBitmap) {
      // Try to load it if not cached
      const imageUrl = setImageUrls[setKey];
      if (imageUrl) {
        try {
          const bitmap = await loadImageBitmap(imageUrl);
          setImageBitmaps.set(setKey, bitmap);
          const refCanvas = new OffscreenCanvas(32, 32);
          const refCtx = refCanvas.getContext("2d");
          if (!refCtx) {
            continue;
          }
          refCtx.drawImage(bitmap, 0, 0, 32, 32);
          const diff = compareImages(resizedCtx, refCtx, 32, 32);
          if (diff < lowestDiff) {
            lowestDiff = diff;
            bestMatch = setKey;
          }
        } catch (error) {
          console.error(`Failed to load set image for ${setKey}:`, error);
          continue;
        }
      }
      continue;
    }

    // Create canvas for reference set image
    const refCanvas = new OffscreenCanvas(32, 32);
    const refCtx = refCanvas.getContext("2d");
    if (!refCtx) {
      continue;
    }

    refCtx.drawImage(setBitmap, 0, 0, 32, 32);

    // Compare images (no contrast increase for set matching)
    const diff = compareImages(resizedCtx, refCtx, 32, 32);

    if (diff < lowestDiff) {
      lowestDiff = diff;
      bestMatch = setKey;
    }
  }

  if (bestMatch === null) {
    return null;
  }

  return {
    setKey: bestMatch,
    diff: lowestDiff,
  };
}

// Cleanup function
function cleanup() {
  if (sourceImageBitmap) {
    sourceImageBitmap.close();
    sourceImageBitmap = null;
  }
  echoReferences.forEach((ref) => {
    if (ref.imageBitmap) {
      ref.imageBitmap.close();
    }
  });
  echoReferences = [];
  setImageBitmaps.forEach((bitmap) => {
    bitmap.close();
  });
  setImageBitmaps.clear();
}

// Handle messages from main thread
self.onmessage = async (e: MessageEvent<ParseEchoMessage>) => {
  try {
    const { type, data } = e.data;

    if (type === "init" && data?.echoReferences) {
      // Load all echo reference images
      echoReferences = [];
      for (const echoRef of data.echoReferences) {
        try {
          const bitmap = await loadImageBitmap(echoRef.imageUrl);
          echoReferences.push({
            key: echoRef.key,
            imageUrl: echoRef.imageUrl,
            imageBitmap: bitmap,
          });
        } catch (error) {
          console.error(
            `Failed to load echo image for ${echoRef.key}:`,
            error,
          );
        }
      }
      self.postMessage({ type: "ready" } as ParseEchoResponse);
      return;
    }

    if (type === "setSourceImage" && data?.sourceImageBitmap) {
      // Store the source image bitmap in the worker
      if (sourceImageBitmap) {
        sourceImageBitmap.close();
      }
      sourceImageBitmap = data.sourceImageBitmap;
      self.postMessage({ type: "ready" } as ParseEchoResponse);
      return;
    }

    if (type === "parseEcho" && data?.echoCoords) {
      if (!sourceImageBitmap) {
        self.postMessage({
          type: "error",
          error: "Source image not set",
        } as ParseEchoResponse);
        return;
      }
      const result = await matchEcho(sourceImageBitmap, data.echoCoords);
      if (result) {
        self.postMessage({
          type: "echoMatch",
          echoMatch: result,
        } as ParseEchoResponse);
      } else {
        self.postMessage({
          type: "error",
          error: "No echo match found",
        } as ParseEchoResponse);
      }
      return;
    }

    if (
      type === "matchSet" &&
      data?.setCoords &&
      data?.possibleSets &&
      data?.setImageUrls
    ) {
      if (!sourceImageBitmap) {
        self.postMessage({
          type: "error",
          error: "Source image not set",
        } as ParseEchoResponse);
        return;
      }
      const result = await matchSet(
        sourceImageBitmap,
        data.setCoords,
        data.possibleSets,
        data.setImageUrls,
      );
      if (result) {
        self.postMessage({
          type: "setMatch",
          setMatch: result,
        } as ParseEchoResponse);
      } else {
        self.postMessage({
          type: "error",
          error: "No set match found",
        } as ParseEchoResponse);
      }
      return;
    }

    self.postMessage({
      type: "error",
      error: "Unknown message type or missing data",
    } as ParseEchoResponse);
  } catch (error: any) {
    console.error("Error in echo parser worker:", error);
    self.postMessage({
      type: "error",
      error: error?.message || "Unknown error",
    } as ParseEchoResponse);
  }
};
