import type { EchoSlotRegions } from "./types.js";

/** Build cards are exported at exactly this size; other sizes aren't supported. */
export const BUILD_CARD_WIDTH = 1920;
export const BUILD_CARD_HEIGHT = 1080;

/** Number of echo slots on a card, left to right. */
export const BUILD_CARD_SLOT_COUNT = 5;

/** Horizontal distance between one slot and the next. */
const SLOT_SPACING_X = 374;

export function isBuildCardSize(width: number, height: number): boolean {
  return width === BUILD_CARD_WIDTH && height === BUILD_CARD_HEIGHT;
}

/** The regions for one slot (0–4, left to right). */
export function slotRegions(slotIndex: number): EchoSlotRegions {
  const offsetX = slotIndex * SLOT_SPACING_X;
  return {
    cost: { x: 336 + offsetX, y: 674, width: 18, height: 24 },
    mainStatLabel: { x: 215 + offsetX, y: 720, width: 173, height: 40 },
    substats: [
      { x: 64 + offsetX, y: 880, width: 320, height: 38 },
      { x: 64 + offsetX, y: 918, width: 320, height: 38 },
      { x: 64 + offsetX, y: 950, width: 320, height: 38 },
      { x: 64 + offsetX, y: 984, width: 320, height: 38 },
      { x: 64 + offsetX, y: 1019, width: 320, height: 38 },
    ],
    echoImage: { x: 22 + offsetX, y: 650, width: 192, height: 182 },
    set: { x: 264 + offsetX, y: 660, width: 56, height: 56 },
  };
}

/** The regions for all five slots, left to right. */
export function buildCardRegions(): EchoSlotRegions[] {
  return Array.from({ length: BUILD_CARD_SLOT_COUNT }, (_, i) => slotRegions(i));
}
