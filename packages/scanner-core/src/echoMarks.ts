/**
 * The detail panel's discard (heart, "Z") and lock (padlock, "C") toggles, read from
 * their icons (layout.ts DISCARD_ICON_BOX / LOCK_ICON_BOX). In game the two exclude each
 * other: locking a discarded echo un-discards it, and discarding a locked one unlocks it.
 */
export type IconPixels = {
  data: ArrayLike<number>;
  width: number;
  height: number;
  /** 4 for canvas ImageData (RGBA), 3 for raw RGB. */
  channels?: number;
};

const isLight = (r: number, g: number, b: number) => r > 170 && g > 170 && b > 170;

/** Discarded: the heart is drawn red instead of white. */
export function isDiscardMarked({ data, width, height, channels = 4 }: IconPixels): boolean {
  let red = 0;
  let white = 0;
  for (let i = 0; i < width * height * channels; i += channels) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (r > 170 && g < 110 && b < 110) red++;
    else if (isLight(r, g, b)) white++;
  }
  return red > white;
}

/**
 * Locked: the closed padlock's shackle reaches the body on both sides; the open one lifts
 * its right leg. Compares light pixels right vs left of centre in the band just above the
 * body (27-36% of the box height), where only the shackle legs are.
 */
export function isLockClosed({ data, width, height, channels = 4 }: IconPixels): boolean {
  let left = 0;
  let right = 0;
  for (let y = Math.floor(height * 0.27); y <= Math.floor(height * 0.36); y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (isLight(data[i], data[i + 1], data[i + 2])) {
        if (x < width / 2) left++;
        else right++;
      }
    }
  }
  return left > 0 && right >= left / 2;
}

/** Both marks from one frame. The game can't show both; if both ever read true, locked wins. */
export function readEchoMarks(discardIcon: IconPixels, lockIcon: IconPixels): { locked: boolean; trash: boolean } {
  const locked = isLockClosed(lockIcon);
  return { locked, trash: !locked && isDiscardMarked(discardIcon) };
}
