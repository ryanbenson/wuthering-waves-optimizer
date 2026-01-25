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

// Import pixelmatch for perceptual image comparison
// Note: Install with: npm install pixelmatch
// @ts-ignore - pixelmatch types may not be available
import pixelmatch from "pixelmatch";

interface EchoReference {
  key: string;
  imageUrl: string;
  imageBitmap?: ImageBitmap;
}

interface ParseEchoMessage {
  type: "init" | "setSourceImage" | "parseEcho" | "matchSet" | "matchSetFirst";
  data?: {
    echoReferences?: EchoReference[];
    sourceImageBitmap?: ImageBitmap;
    echoCoords?: { x: number; y: number; width: number; height: number };
    setCoords?: { x: number; y: number; width: number; height: number };
    possibleSets?: string[];
    setImageUrls?: Record<string, string>;
    allSetImageUrls?: Record<string, string>; // All set URLs for matching set first
    filteredEchoKeys?: string[]; // Echo keys to filter by after set match
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
 * Extract image region from source image and mask out black background
 * Source images have black backgrounds while reference images are transparent
 */
function extractImageRegion(
  sourceBitmap: ImageBitmap,
  coords: { x: number; y: number; width: number; height: number },
): OffscreenCanvas {
  const canvas = new OffscreenCanvas(coords.width, coords.height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
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
  
  // Mask out black background pixels (source images have black bg, references are transparent)
  const imageData = ctx.getImageData(0, 0, coords.width, coords.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // If pixel is very dark (likely black background), make it transparent
    // Threshold: if all RGB values are below 40, consider it background
    // Increased from 30 to 40 to catch more edge cases
    if (r < 40 && g < 40 && b < 40) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Normalize brightness to reduce lighting differences (preserves color ratios)
 */
function normalizeBrightness(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Calculate average brightness using luminance formula
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    // Use luminance formula to calculate perceived brightness
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sum += luminance;
    count++;
  }
  const avgBrightness = sum / count;
  const targetBrightness = 128; // Target middle gray
  const adjustment = targetBrightness - avgBrightness;

  // Adjust all pixels while preserving color ratios
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate current luminance
    const currentLuminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Adjust each channel proportionally to maintain color ratios
    if (currentLuminance > 0) {
      const factor = (currentLuminance + adjustment) / currentLuminance;
      data[i] = Math.max(0, Math.min(255, r * factor)); // R
      data[i + 1] = Math.max(0, Math.min(255, g * factor)); // G
      data[i + 2] = Math.max(0, Math.min(255, b * factor)); // B
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Increase contrast on an image (preserves color information)
 */
function increaseContrast(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  factor: number = 2.5,
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Increase contrast by pushing values away from midpoint (128)
  // Apply to each RGB channel separately to preserve color information
  // Formula: newValue = ((value - 128) * factor) + 128
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Apply contrast to each channel separately to preserve color differences
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
 * Calculate shape/silhouette metrics to catch major structural differences
 * Returns difference score based on object shape characteristics
 * Enhanced to better distinguish characters from creatures
 */
function compareShape(
  ctxA: OffscreenCanvasRenderingContext2D,
  ctxB: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  const dataA = ctxA.getImageData(0, 0, width, height).data;
  const dataB = ctxB.getImageData(0, 0, width, height).data;
  
  // Find bounding boxes of non-background pixels
  let minXA = width, maxXA = 0, minYA = height, maxYA = 0;
  let minXB = width, maxXB = 0, minYB = height, maxYB = 0;
  let countA = 0, countB = 0;
  
  // Track pixel distribution (for compactness calculation)
  let sumXA = 0, sumYA = 0, sumXB = 0, sumYB = 0;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Check image A
      const alphaA = dataA[idx + 3];
      const rA = dataA[idx];
      const gA = dataA[idx + 1];
      const bA = dataA[idx + 2];
      const isBackgroundA = alphaA < 10 || (rA < 30 && gA < 30 && bA < 30);
      
      if (!isBackgroundA) {
        countA++;
        minXA = Math.min(minXA, x);
        maxXA = Math.max(maxXA, x);
        minYA = Math.min(minYA, y);
        maxYA = Math.max(maxYA, y);
        sumXA += x;
        sumYA += y;
      }
      
      // Check image B
      const alphaB = dataB[idx + 3];
      const rB = dataB[idx];
      const gB = dataB[idx + 1];
      const bB = dataB[idx + 2];
      const isBackgroundB = alphaB < 10 || (rB < 30 && gB < 30 && bB < 30);
      
      if (!isBackgroundB) {
        countB++;
        minXB = Math.min(minXB, x);
        maxXB = Math.max(maxXB, x);
        minYB = Math.min(minYB, y);
        maxYB = Math.max(maxYB, y);
        sumXB += x;
        sumYB += y;
      }
    }
  }
  
  if (countA === 0 || countB === 0) {
    return 1.0; // Very different if one has no content
  }
  
  // Calculate aspect ratios
  const widthA = maxXA - minXA + 1;
  const heightA = maxYA - minYA + 1;
  const aspectA = widthA / heightA;
  
  const widthB = maxXB - minXB + 1;
  const heightB = maxYB - minYB + 1;
  const aspectB = widthB / heightB;
  
  // Calculate centroid (center of mass) - more accurate than bounding box center
  const centroidXA = sumXA / countA;
  const centroidYA = sumYA / countA;
  const centroidXB = sumXB / countB;
  const centroidYB = sumYB / countB;
  
  // Calculate compactness (how spread out the pixels are)
  // Lower compactness = more spread out (like a character with elaborate headwear)
  // Higher compactness = more concentrated (like a creature)
  let compactnessA = 0, compactnessB = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alphaA = dataA[idx + 3];
      const rA = dataA[idx];
      const gA = dataA[idx + 1];
      const bA = dataA[idx + 2];
      const isBackgroundA = alphaA < 10 || (rA < 30 && gA < 30 && bA < 30);
      
      if (!isBackgroundA) {
        const dist = Math.sqrt((x - centroidXA) ** 2 + (y - centroidYA) ** 2);
        compactnessA += dist;
      }
      
      const alphaB = dataB[idx + 3];
      const rB = dataB[idx];
      const gB = dataB[idx + 1];
      const bB = dataB[idx + 2];
      const isBackgroundB = alphaB < 10 || (rB < 30 && gB < 30 && bB < 30);
      
      if (!isBackgroundB) {
        const dist = Math.sqrt((x - centroidXB) ** 2 + (y - centroidYB) ** 2);
        compactnessB += dist;
      }
    }
  }
  compactnessA = compactnessA / countA;
  compactnessB = compactnessB / countB;
  const maxCompactness = Math.sqrt(width * width + height * height);
  const normalizedCompactnessA = compactnessA / maxCompactness;
  const normalizedCompactnessB = compactnessB / maxCompactness;
  const compactnessDiff = Math.abs(normalizedCompactnessA - normalizedCompactnessB);
  
  // Calculate normalized differences
  const aspectDiff = Math.abs(aspectA - aspectB) / Math.max(aspectA, aspectB, 0.1);
  const centroidXDiff = Math.abs(centroidXA - centroidXB) / width;
  const centroidYDiff = Math.abs(centroidYA - centroidYB) / height;
  const sizeDiff = Math.abs(countA - countB) / Math.max(countA, countB);
  
  // Combined shape difference with weights
  // Compactness is important - characters with elaborate headwear are less compact
  // Aspect ratio catches tall vs wide differences
  // Increased weights on most distinguishing features
  const shapeDiff = (
    aspectDiff * 0.25 +           // Aspect ratio (25%)
    compactnessDiff * 0.35 +      // Compactness (35%) - Most important for character vs creature
    sizeDiff * 0.25 +             // Size (25%)
    centroidXDiff * 0.075 +       // Centroid X (7.5%)
    centroidYDiff * 0.075         // Centroid Y (7.5%)
  );
  
  // Square the result to heavily penalize larger differences
  // This makes it exponentially worse as shapes become more different
  return shapeDiff * shapeDiff;
}

/**
 * Pixel-based color comparison (preserves color information)
 * This was working well before, so we'll keep it as a primary metric
 */
function comparePixels(
  ctxA: OffscreenCanvasRenderingContext2D,
  ctxB: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  const dataA = ctxA.getImageData(0, 0, width, height).data;
  const dataB = ctxB.getImageData(0, 0, width, height).data;

  let diff = 0;
  let validPixels = 0;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Skip transparent or black background pixels
      const alphaA = dataA[idx + 3];
      const alphaB = dataB[idx + 3];
      const rA = dataA[idx];
      const gA = dataA[idx + 1];
      const bA = dataA[idx + 2];
      const rB = dataB[idx];
      const gB = dataB[idx + 1];
      const bB = dataB[idx + 2];
      
      // Skip if both pixels are transparent/background
      const isBackgroundA = alphaA < 10 || (rA < 30 && gA < 30 && bA < 30);
      const isBackgroundB = alphaB < 10 || (rB < 30 && gB < 30 && bB < 30);
      
      if (isBackgroundA && isBackgroundB) {
        continue;
      }
      
      // If one is background and other isn't, penalize heavily
      if (isBackgroundA !== isBackgroundB) {
        diff += 5000; // Penalty for mismatched backgrounds
        validPixels++;
        continue;
      }
      
      validPixels++;
      
      // Calculate distance from center
      const distX = x - centerX;
      const distY = y - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      
      // Weight: center pixels get weight 2.0, edge pixels get weight 1.0
      const weight = 1.0 + (1.0 - dist / maxDist);
      
      // Calculate color differences
      const rDiff = rA - rB;
      const gDiff = gA - gB;
      const bDiff = bA - bB;
      
      // Emphasize color differences - squared differences for RGB
      const pixelDiff = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
      
      // Additional emphasis on bright colors (like distinctive glows)
      const brightnessA = (rA + gA + bA) / 3;
      const brightnessB = (rB + gB + bB) / 3;
      const isBright = brightnessA > 150 || brightnessB > 150;
      const brightnessWeight = isBright ? 1.3 : 1.0;
      
      diff += pixelDiff * weight * brightnessWeight;
    }
  }

  // Normalize by valid pixel count
  if (validPixels === 0) {
    return Infinity;
  }
  return diff / validPixels;
}

/**
 * Convert canvas context to RGBA array for pixelmatch
 */
function canvasToRGBA(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): Uint8Array {
  const imageData = ctx.getImageData(0, 0, width, height);
  return new Uint8Array(imageData.data);
}

/**
 * Compare two image contexts using pixelmatch (perceptual diff) + shape comparison
 * pixelmatch provides much better perceptual comparison than raw pixel diff
 */
function compareImages(
  ctxA: OffscreenCanvasRenderingContext2D,
  ctxB: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  let pixelMatchDiff = 0;
  
  // Use pixelmatch if available (much better perceptual comparison)
  if (pixelmatch) {
    try {
      // Convert canvases to RGBA arrays for pixelmatch
      const imgA = canvasToRGBA(ctxA, width, height);
      const imgB = canvasToRGBA(ctxB, width, height);
      
      // Create output diff image (we don't need it, but pixelmatch requires it)
      const diff = new Uint8Array(width * height * 4);
      
      // Use pixelmatch for perceptual comparison
      // threshold: 0.03 = 3% difference threshold (very strict)
      // includeAA: false = don't count anti-aliasing as differences
      // alpha: 0.03 = alpha channel threshold (very strict)
      const numDiffPixels = pixelmatch(
        imgA,
        imgB,
        diff,
        width,
        height,
        {
          threshold: 0.03, // Very strict - was 0.05
          includeAA: false,
          alpha: 0.03, // Very strict - was 0.05
          diffColor: [255, 0, 0], // Red for differences (not used but required)
          diffColorAlt: [0, 255, 0], // Green for differences (not used but required)
        }
      );
      
      // Normalize by total pixels to get difference ratio (0-1)
      const totalPixels = width * height;
      pixelMatchDiff = numDiffPixels / totalPixels;
    } catch (error) {
      console.error("Error using pixelmatch, falling back:", error);
      // Fall back to pixel comparison
      pixelMatchDiff = comparePixels(ctxA, ctxB, width, height) / 10000;
    }
  } else {
    // Fallback to pixel comparison if pixelmatch not available
    pixelMatchDiff = comparePixels(ctxA, ctxB, width, height) / 10000;
  }
  
  // Shape comparison - catches major structural differences (sword vs creature, character vs creature)
  const shapeDiff = compareShape(ctxA, ctxB, width, height);
  
  // REJECTION THRESHOLD: If shape difference is too high, reject immediately
  // This catches major structural mismatches (character portrait vs creature, sword vs creature)
  // Threshold of 0.3 means if shapes are 30% different, it's likely a mismatch
  if (shapeDiff > 0.3) {
    // Heavily penalize - return a very high difference score
    return 50000 + (shapeDiff * 100000); // Base penalty + scaled shape diff
  }
  
  // Combined: 30% pixelmatch (perceptual diff), 70% shape diff
  // Heavily favor shape - if shapes are similar, then check colors
  // pixelmatch handles perceptual differences, shape catches structural mismatches
  const combinedDiff = 
    pixelMatchDiff * 10000 * 0.3 +  // pixelmatch diff (0-1 scale, reduced weight)
    shapeDiff * 20000 * 0.7;         // shape diff (0-1 scale, increased weight significantly)
  
  return combinedDiff;
}

/**
 * Calculate color histograms for RGB channels (for additional comparison metric)
 * Returns separate histograms for R, G, B channels to preserve color information
 * Ignores transparent/black background pixels
 */
function calculateColorHistograms(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): { r: number[]; g: number[]; b: number[] } {
  const imageData = ctx.getImageData(0, 0, width, height).data;
  const histR = new Array(256).fill(0);
  const histG = new Array(256).fill(0);
  const histB = new Array(256).fill(0);
  let validPixels = 0;

  for (let i = 0; i < imageData.length; i += 4) {
    const alpha = imageData[i + 3];
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    
    // Skip transparent or black background pixels
    const isBackground = alpha < 10 || (r < 30 && g < 30 && b < 30);
    if (isBackground) {
      continue;
    }
    
    validPixels++;
    histR[r]++;
    histG[g]++;
    histB[b]++;
  }

  // Normalize by valid pixel count (not total pixels)
  if (validPixels === 0) {
    return { r: histR, g: histG, b: histB };
  }
  
  return {
    r: histR.map((count) => count / validPixels),
    g: histG.map((count) => count / validPixels),
    b: histB.map((count) => count / validPixels),
  };
}

/**
 * Compare color histograms using chi-square distance for each RGB channel
 */
function compareColorHistograms(
  histA: { r: number[]; g: number[]; b: number[] },
  histB: { r: number[]; g: number[]; b: number[] },
): number {
  let diff = 0;
  
  // Compare R channel
  for (let i = 0; i < 256; i++) {
    const sum = histA.r[i] + histB.r[i];
    if (sum > 0) {
      const diffVal = histA.r[i] - histB.r[i];
      diff += (diffVal * diffVal) / sum;
    }
  }
  
  // Compare G channel
  for (let i = 0; i < 256; i++) {
    const sum = histA.g[i] + histB.g[i];
    if (sum > 0) {
      const diffVal = histA.g[i] - histB.g[i];
      diff += (diffVal * diffVal) / sum;
    }
  }
  
  // Compare B channel
  for (let i = 0; i < 256; i++) {
    const sum = histA.b[i] + histB.b[i];
    if (sum > 0) {
      const diffVal = histA.b[i] - histB.b[i];
      diff += (diffVal * diffVal) / sum;
    }
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
  filteredEchoKeys?: string[],
): Promise<{ echoKey: string; diff: number } | null> {
  // Extract the echo region
  const regionCanvas = extractImageRegion(sourceBitmap, echoCoords);
  const regionCtx = regionCanvas.getContext("2d", { willReadFrequently: true });
  if (!regionCtx) {
    throw new Error("Failed to get 2d context for region");
  }

  // Preprocess source image: normalize brightness -> increase contrast
  // NOTE: NOT converting to grayscale to preserve color information (purple vs green, etc.)
  normalizeBrightness(regionCtx, echoCoords.width, echoCoords.height);
  increaseContrast(regionCtx, echoCoords.width, echoCoords.height, 2.5);

  // Calculate color histograms for source image (RGB channels separately)
  const sourceHist = calculateColorHistograms(
    regionCtx,
    echoCoords.width,
    echoCoords.height,
  );

  let bestMatch: string | null = null;
  let lowestDiff = Infinity;

  // Filter echoes if filteredEchoKeys provided (from matched set)
  const echoesToCompare = filteredEchoKeys
    ? echoReferences.filter((ref) => filteredEchoKeys.includes(ref.key))
    : echoReferences; // Fallback to all if no filter

  // Compare against filtered echoes (or all if no filter)
  for (const echoRef of echoesToCompare) {
    if (!echoRef.imageBitmap) {
      continue;
    }

    // Create canvas for reference image with better scaling
    const refCanvas = new OffscreenCanvas(
      echoCoords.width,
      echoCoords.height,
    );
    const refCtx = refCanvas.getContext("2d", { willReadFrequently: true });
    if (!refCtx) {
      continue;
    }

    // Use imageSmoothingEnabled for better scaling quality
    refCtx.imageSmoothingEnabled = true;
    refCtx.imageSmoothingQuality = "high";

    // Draw and scale reference image
    refCtx.drawImage(
      echoRef.imageBitmap,
      0,
      0,
      echoCoords.width,
      echoCoords.height,
    );

    // Preprocess reference image identically: normalize brightness -> increase contrast
    // NOTE: NOT converting to grayscale to preserve color information
    normalizeBrightness(refCtx, echoCoords.width, echoCoords.height);
    increaseContrast(refCtx, echoCoords.width, echoCoords.height, 2.5);

    // Calculate color histograms for reference image (RGB channels separately)
    const refHist = calculateColorHistograms(
      refCtx,
      echoCoords.width,
      echoCoords.height,
    );

    // Compare using edge detection + SSIM (primary metric - catches structural differences)
    const structuralDiff = compareImages(
      regionCtx,
      refCtx,
      echoCoords.width,
      echoCoords.height,
    );

    // Compare using color histograms (secondary metric - catches color differences)
    const histDiff = compareColorHistograms(sourceHist, refHist);

    // Combined score: 50% structural (edge + SSIM), 50% color histogram
    // Increased color weight to better distinguish purple vs gray/blue echoes
    // Structural comparison catches shape differences (sword vs creature)
    // Color histogram catches color differences (purple vs green, gray vs blue)
    const combinedDiff = structuralDiff * 0.5 + histDiff * 1000 * 0.5;

    if (combinedDiff < lowestDiff) {
      lowestDiff = combinedDiff;
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
 * Compare set icons with heavy emphasis on color differences
 * Set icons are distinguished primarily by color (green vs yellow borders, etc.)
 */
function compareSetIcons(
  ctxA: OffscreenCanvasRenderingContext2D,
  ctxB: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  const dataA = ctxA.getImageData(0, 0, width, height).data;
  const dataB = ctxB.getImageData(0, 0, width, height).data;

  let diff = 0;
  let validPixels = 0;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

  // Calculate color histograms for color-based comparison
  const histA = { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0) };
  const histB = { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0) };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const alphaA = dataA[idx + 3];
      const alphaB = dataB[idx + 3];
      const rA = dataA[idx];
      const gA = dataA[idx + 1];
      const bA = dataA[idx + 2];
      const rB = dataB[idx];
      const gB = dataB[idx + 1];
      const bB = dataB[idx + 2];
      
      // Skip if both are transparent/background
      const isBackgroundA = alphaA < 10 || (rA < 30 && gA < 30 && bA < 30);
      const isBackgroundB = alphaB < 10 || (rB < 30 && gB < 30 && bB < 30);
      
      if (isBackgroundA && isBackgroundB) {
        continue;
      }
      
      // If one is background and other isn't, penalize heavily
      if (isBackgroundA !== isBackgroundB) {
        diff += 5000; // Large penalty for mismatched backgrounds
        validPixels++;
        continue;
      }
      
      validPixels++;
      
      // Calculate distance from center (center is more important for icons)
      const distX = x - centerX;
      const distY = y - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const weight = 1.0 + (2.0 * (1.0 - dist / maxDist)); // Center gets 3x weight
      
      // Calculate color differences with heavy emphasis
      const rDiff = rA - rB;
      const gDiff = gA - gB;
      const bDiff = bA - bB;
      
      // Emphasize color differences - use squared differences and multiply by weight
      // This heavily penalizes color mismatches (green vs yellow, etc.)
      const pixelDiff = (rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) * weight;
      
      diff += pixelDiff;
      
      // Build histograms for color distribution comparison
      histA.r[rA]++;
      histA.g[gA]++;
      histA.b[bA]++;
      histB.r[rB]++;
      histB.g[gB]++;
      histB.b[bB]++;
    }
  }

  if (validPixels === 0) {
    return Infinity;
  }
  
  // Normalize histograms
  const normalizedHistA = {
    r: histA.r.map(v => v / validPixels),
    g: histA.g.map(v => v / validPixels),
    b: histA.b.map(v => v / validPixels),
  };
  const normalizedHistB = {
    r: histB.r.map(v => v / validPixels),
    g: histB.g.map(v => v / validPixels),
    b: histB.b.map(v => v / validPixels),
  };
  
  // Compare color histograms (chi-square distance)
  let histDiff = 0;
  for (let i = 0; i < 256; i++) {
    // R channel
    const sumR = normalizedHistA.r[i] + normalizedHistB.r[i];
    if (sumR > 0) {
      const diffR = normalizedHistA.r[i] - normalizedHistB.r[i];
      histDiff += (diffR * diffR) / sumR;
    }
    // G channel
    const sumG = normalizedHistA.g[i] + normalizedHistB.g[i];
    if (sumG > 0) {
      const diffG = normalizedHistA.g[i] - normalizedHistB.g[i];
      histDiff += (diffG * diffG) / sumG;
    }
    // B channel
    const sumB = normalizedHistA.b[i] + normalizedHistB.b[i];
    if (sumB > 0) {
      const diffB = normalizedHistA.b[i] - normalizedHistB.b[i];
      histDiff += (diffB * diffB) / sumB;
    }
  }
  
  // Combine pixel difference (60%) with color histogram difference (40%)
  // Color histogram catches overall color distribution (green vs yellow overall)
  const pixelDiff = diff / validPixels;
  const combinedDiff = pixelDiff * 0.6 + histDiff * 1000 * 0.4;
  
  return combinedDiff;
}

/**
 * Get dominant colors from an image (for set icon comparison)
 * Returns the most common non-background colors, excluding black and white
 */
function getDominantColors(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  topN: number = 3,
): Array<{ r: number; g: number; b: number; count: number }> {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const colorMap = new Map<string, number>();
  
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Skip background (transparent or very dark)
    if (alpha < 10 || (r < 30 && g < 30 && b < 30)) {
      continue;
    }
    
    // Skip white and near-white (r, g, b all > 200)
    if (r > 200 && g > 200 && b > 200) {
      continue;
    }
    
    // Skip black and near-black (r, g, b all < 50)
    if (r < 50 && g < 50 && b < 50) {
      continue;
    }
    
    // Quantize colors to reduce noise (round to nearest 15 for better grouping)
    const qR = Math.round(r / 15) * 15;
    const qG = Math.round(g / 15) * 15;
    const qB = Math.round(b / 15) * 15;
    const key = `${qR},${qG},${qB}`;
    
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  
  // Get top N colors
  const colors = Array.from(colorMap.entries())
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { r, g, b, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
  
  return colors;
}

/**
 * Classify a color into a color family (green, yellow, blue, red, purple, etc.)
 */
function classifyColorFamily(r: number, g: number, b: number): string | null {
  // Green: high G, lower R and B
  if (g > r + 30 && g > b + 30 && g > 100) {
    return "green";
  }
  // Yellow: high R and G, low B
  if (r > 150 && g > 150 && b < r - 50 && b < g - 50) {
    return "yellow";
  }
  // Blue: high B, lower R and G
  if (b > r + 30 && b > g + 30 && b > 100) {
    return "blue";
  }
  // Red: high R, lower G and B
  if (r > g + 30 && r > b + 30 && r > 100) {
    return "red";
  }
  // Purple/Pink: high R and B, moderate G
  if (r > 120 && b > 120 && Math.abs(r - b) < 50 && g < Math.max(r, b) - 30) {
    return "purple";
  }
  // Orange: high R and G, moderate B
  if (r > 150 && g > 100 && b < r - 50 && b < 100) {
    return "orange";
  }
  return null;
}

/**
 * Detect shape patterns in set icons
 * Returns an object describing detected shapes
 */
function detectShapes(
  ctx: OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
): {
  hasShield: boolean;
  hasCross: boolean;
  hasPlus: boolean;
  hasFire: boolean;
  hasWildFire: boolean;
  hasArrow: boolean;
  hasStar: boolean;
} {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create a binary mask of white/light pixels (for shape detection)
  const whitePixels: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    whitePixels[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const alpha = data[idx + 3];
      
      // White or very light pixels (for detecting shapes)
      whitePixels[y][x] = alpha > 200 && r > 200 && g > 200 && b > 200;
    }
  }
  
  const shapes = {
    hasShield: false,
    hasCross: false,
    hasPlus: false,
    hasFire: false,
    hasWildFire: false,
    hasArrow: false,
    hasStar: false,
  };
  
  // Detect shield: curved top, pointed bottom, wider in middle
  // Look for white pixels forming a shield-like shape
  let shieldTop = 0, shieldBottom = height, shieldLeft = width, shieldRight = 0;
  let shieldPixels = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (whitePixels[y][x]) {
        shieldTop = Math.min(shieldTop, y);
        shieldBottom = Math.max(shieldBottom, y);
        shieldLeft = Math.min(shieldLeft, x);
        shieldRight = Math.max(shieldRight, x);
        shieldPixels++;
      }
    }
  }
  
  if (shieldPixels > 50) {
    const shieldWidth = shieldRight - shieldLeft;
    const shieldHeight = shieldBottom - shieldTop;
    const aspectRatio = shieldWidth / shieldHeight;
    
    // Shield is typically wider than tall, with curved top
    // Check if the top is more curved (narrower at top than middle)
    let topWidth = 0;
    let middleWidth = 0;
    for (let x = shieldLeft; x <= shieldRight; x++) {
      if (shieldTop >= 0 && shieldTop < height && whitePixels[shieldTop][x]) topWidth++;
      const middleY = Math.floor(shieldTop + shieldHeight / 2);
      if (middleY >= 0 && middleY < height && whitePixels[middleY][x]) middleWidth++;
    }
    
    if (aspectRatio > 0.7 && aspectRatio < 1.3 && topWidth < middleWidth * 0.8) {
      shapes.hasShield = true;
    }
  }
  
  // Detect plus/cross: horizontal and vertical lines intersecting
  // Check for horizontal line
  let horizontalLine = 0;
  let verticalLine = 0;
  for (let y = Math.floor(centerY - 3); y <= Math.floor(centerY + 3); y++) {
    let hCount = 0;
    for (let x = 0; x < width; x++) {
      if (y >= 0 && y < height && whitePixels[y][x]) hCount++;
    }
    if (hCount > width * 0.3) horizontalLine++;
  }
  
  for (let x = Math.floor(centerX - 3); x <= Math.floor(centerX + 3); x++) {
    let vCount = 0;
    for (let y = 0; y < height; y++) {
      if (x >= 0 && x < width && whitePixels[y][x]) vCount++;
    }
    if (vCount > height * 0.3) verticalLine++;
  }
  
  if (horizontalLine > 2 && verticalLine > 2) {
    shapes.hasPlus = true;
    shapes.hasCross = true; // Plus and cross are similar
  }
  
  // Detect arrow: diagonal lines pointing in a direction
  // Look for diagonal patterns
  let diagonalUpRight = 0;
  let diagonalUpLeft = 0;
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      if (whitePixels[y][x] && whitePixels[y + 1][x + 1]) diagonalUpRight++;
      if (whitePixels[y][x + 1] && whitePixels[y + 1][x]) diagonalUpLeft++;
    }
  }
  
  if (diagonalUpRight > 20 || diagonalUpLeft > 20) {
    shapes.hasArrow = true;
  }
  
  // Detect fire: wavy, upward-pointing shape
  // Look for irregular upward patterns
  let upwardPatterns = 0;
  for (let y = height / 2; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (whitePixels[y][x] && !whitePixels[y + 1][x] && 
          (whitePixels[y + 1][x - 1] || whitePixels[y + 1][x + 1])) {
        upwardPatterns++;
      }
    }
  }
  
  if (upwardPatterns > 30) {
    shapes.hasFire = true;
  }
  
  // Wild fire: more chaotic, multiple upward points
  if (upwardPatterns > 50) {
    shapes.hasWildFire = true;
  }
  
  return shapes;
}

/**
 * Match echo set from image region (matches against ALL sets first)
 * This is simpler since set icons are simpler (circular, limited colors)
 */
async function matchSetFirst(
  sourceBitmap: ImageBitmap,
  setCoords: { x: number; y: number; width: number; height: number },
  allSetImageUrls: Record<string, string>,
): Promise<{ setKey: string; diff: number } | null> {
  // Extract the set region
  const regionCanvas = extractImageRegion(sourceBitmap, setCoords);
  const regionCtx = regionCanvas.getContext("2d");
  if (!regionCtx) {
    throw new Error("Failed to get 2d context for set region");
  }

  // Resize to 32x32 for set comparison
  const resizedCanvas = new OffscreenCanvas(32, 32);
  const resizedCtx = resizedCanvas.getContext("2d", { willReadFrequently: true });
  if (!resizedCtx) {
    throw new Error("Failed to get 2d context for resized set");
  }
  
  // Fill with transparent background first
  resizedCtx.clearRect(0, 0, 32, 32);
  resizedCtx.drawImage(regionCanvas, 0, 0, 32, 32);
  
  // Mask out black background pixels (source has black bg, references are transparent)
  // This is critical - the black background can skew color comparisons
  const imageData = resizedCtx.getImageData(0, 0, 32, 32);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // If pixel is very dark (likely black background), make it transparent
    // Threshold: if all RGB values are below 50, consider it background
    // Increased threshold to catch more black background pixels
    // Also check if it's on the edges (more likely to be background)
    // For Echo 1, we need to be more aggressive with edge masking
    const x = (i / 4) % 32;
    const y = Math.floor((i / 4) / 32);
    const isEdge = x < 3 || x >= 29 || y < 3 || y >= 29; // Increased edge detection to 3 pixels
    
    // More aggressive masking: lower threshold for edges, and also mask very dark pixels in center
    // Increased edge threshold to 70 to catch more black background on edges
    // Also check if pixel is very dark in the center (might be background bleeding through)
    const isCenter = !isEdge;
    if ((r < 50 && g < 50 && b < 50) || (isEdge && r < 70 && g < 70 && b < 70) || (isCenter && r < 40 && g < 40 && b < 40)) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }
  
  resizedCtx.putImageData(imageData, 0, 0);

  // SIMPLIFIED APPROACH: Color family + Shape matching
  // 1. Extract 1-2 dominant colors (excluding black/white)
  // 2. Classify into color families (green, yellow, blue, red, purple, etc.)
  // 3. Use shape detection to distinguish between sets with similar colors

  // Get top 2 dominant colors (excluding black/white)
  const sourceDominantColors = getDominantColors(resizedCtx, 32, 32, 2);
  
  // Classify source color family
  const sourceColorFamilies = new Set<string>();
  for (const color of sourceDominantColors) {
    const family = classifyColorFamily(color.r, color.g, color.b);
    if (family) {
      sourceColorFamilies.add(family);
    }
  }
  
  // Detect shapes in source
  const sourceShapes = detectShapes(resizedCtx, 32, 32);

  let bestMatch: string | null = null;
  let lowestDiff = Infinity;

  // Compare against ALL sets
  for (const [setKey, imageUrl] of Object.entries(allSetImageUrls)) {
    let setBitmap = setImageBitmaps.get(setKey);
    if (!setBitmap) {
      // Load it if not cached
      try {
        setBitmap = await loadImageBitmap(imageUrl);
        setImageBitmaps.set(setKey, setBitmap);
      } catch (error) {
        console.error(`Failed to load set image for ${setKey}:`, error);
        continue;
      }
    }

    // Create canvas for reference set image
    const refCanvas = new OffscreenCanvas(32, 32);
    const refCtx = refCanvas.getContext("2d", { willReadFrequently: true });
    if (!refCtx) {
      continue;
    }

    // Use high-quality scaling
    refCtx.imageSmoothingEnabled = true;
    refCtx.imageSmoothingQuality = "high";
    refCtx.drawImage(setBitmap, 0, 0, 32, 32);

    // Get dominant colors from reference (top 2, excluding black/white)
    const refDominantColors = getDominantColors(refCtx, 32, 32, 2);
    
    // Classify reference color family
    const refColorFamilies = new Set<string>();
    for (const color of refDominantColors) {
      const family = classifyColorFamily(color.r, color.g, color.b);
      if (family) {
        refColorFamilies.add(family);
      }
    }
    
    // Check if color families match
    const colorFamilyMatch = sourceColorFamilies.size > 0 && refColorFamilies.size > 0 &&
      Array.from(sourceColorFamilies).some(f => refColorFamilies.has(f));
    
    // If color families don't match, huge penalty
    let colorFamilyPenalty = 0;
    if (!colorFamilyMatch && sourceColorFamilies.size > 0 && refColorFamilies.size > 0) {
      colorFamilyPenalty = 100000; // Massive penalty for different color families
    }
    
    // Detect shapes in reference
    const refShapes = detectShapes(refCtx, 32, 32);
    
    // Compare shapes (count matching shape detections)
    let shapeMatch = 0;
    const shapeKeys: (keyof typeof sourceShapes)[] = ['hasShield', 'hasCross', 'hasPlus', 'hasFire', 'hasWildFire', 'hasArrow', 'hasStar'];
    for (const key of shapeKeys) {
      if (sourceShapes[key] && refShapes[key]) {
        shapeMatch++;
      } else if (sourceShapes[key] !== refShapes[key]) {
        shapeMatch -= 0.5; // Penalty for mismatched shapes
      }
    }
    
    // Normalize shape match to 0-1 scale (max 7 shapes)
    const normalizedShapeMatch = Math.max(0, (shapeMatch + 7) / 14);
    const shapeDiff = 1 - normalizedShapeMatch; // Convert to difference (0 = perfect match, 1 = no match)
    
    // Also do simple pixel comparison as fallback
    const pixelDiff = compareSetIcons(resizedCtx, refCtx, 32, 32);
    
    // Combined score:
    // - Color family match is critical (huge penalty if mismatch)
    // - Shape matching is primary differentiator within same color family
    // - Pixel diff is fallback
    const combinedDiff = 
      colorFamilyPenalty +                    // Color family mismatch penalty
      shapeDiff * 5000 +                      // Shape difference (primary for same-color sets)
      pixelDiff * 0.1;                        // Pixel diff (small weight, just for fine-tuning)

    if (combinedDiff < lowestDiff) {
      lowestDiff = combinedDiff;
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

/**
 * Match echo set from image region (matches against filtered sets)
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
  const resizedCtx = resizedCanvas.getContext("2d", { willReadFrequently: true });
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
    const refCtx = refCanvas.getContext("2d", { willReadFrequently: true });
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
      const result = await matchEcho(
        sourceImageBitmap,
        data.echoCoords,
        data.filteredEchoKeys, // Pass filtered echo keys if provided
      );
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
      type === "matchSetFirst" &&
      data?.setCoords &&
      data?.allSetImageUrls
    ) {
      if (!sourceImageBitmap) {
        self.postMessage({
          type: "error",
          error: "Source image not set",
        } as ParseEchoResponse);
        return;
      }
      const result = await matchSetFirst(
        sourceImageBitmap,
        data.setCoords,
        data.allSetImageUrls,
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
