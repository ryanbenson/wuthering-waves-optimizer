import type { StatDisplay } from "../../utils/statDelta";

/** One stat line in the trade-off chart tooltip, read from a result's finalStats. */
export type TooltipStatLine = StatDisplay & { label: string; key: string };

const ELEMENTS = ["Glacio", "Fusion", "Electro", "Aero", "Spectro", "Havoc"];

const ER: TooltipStatLine = { label: "ER", key: "energyRegen", kind: "pct", scale: 100 };

// Fixed order; a line shows when any of its substats has a weight above 0.
const WEIGHTED: Array<{ substats: string[]; line: TooltipStatLine }> = [
  { substats: ["CritRate"], line: { label: "CR", key: "totalCritRate", kind: "pct", scale: 100 } },
  { substats: ["CritDMG"], line: { label: "CD", key: "totalCritDMG", kind: "pct", scale: 100 } },
  { substats: ["ATK", "ATK_FLAT"], line: { label: "ATK", key: "totalAtk", kind: "int" } },
  { substats: ["HP", "HP_FLAT"], line: { label: "HP", key: "totalHp", kind: "int" } },
  { substats: ["DEF", "DEF_FLAT"], line: { label: "DEF", key: "totalDef", kind: "int" } },
  { substats: ["BasicAttackDMGBonus"], line: { label: "Basic DMG", key: "basicAttackDMGBonus", kind: "pct" } },
  { substats: ["HeavyAttackDMGBonus"], line: { label: "Heavy DMG", key: "heavyAttackDMGBonus", kind: "pct" } },
  { substats: ["ResonanceSkillDMGBonus"], line: { label: "Skill DMG", key: "resonanceSkillDMGBonus", kind: "pct" } },
  { substats: ["ResonanceLiberationDMGBonus"], line: { label: "Lib DMG", key: "resonanceLiberationDMGBonus", kind: "pct" } },
];

// For characters the app has no substat weights for.
const FALLBACK = new Set(["CR", "CD", "ATK"]);

/**
 * ER (the chart's X axis), then the stats this character's substat weights
 * value above 0, then the character's element DMG Bonus (an echo main stat,
 * so never in the substat weights, but it applies to all their damage).
 * `weights` is null when the character has no curated or user weights.
 */
export function getTooltipStatLines(
  weights: Record<string, number> | null,
  element: string | null | undefined,
): TooltipStatLine[] {
  const picked = WEIGHTED.filter(({ substats, line }) =>
    weights ? substats.some((stat) => (weights[stat] ?? 0) > 0) : FALLBACK.has(line.label),
  ).map(({ line }) => line);
  const elementLine: TooltipStatLine[] =
    element && ELEMENTS.includes(element)
      ? [{ label: `${element} DMG`, key: element.toLowerCase(), kind: "pct" }]
      : [];
  return [ER, ...picked, ...elementLine];
}

/**
 * Where to put a tooltip of size width x height next to the mouse: right of it, else left,
 * else below, else above; clamped inside the window. The pointer arrow extends right and
 * down from its tip, so those sides get more room.
 */
export function placeTooltip(
  mouse: { x: number; y: number },
  size: { width: number; height: number },
  viewport: { width: number; height: number },
): { left: number; top: number } {
  const margin = 8;
  const { width: w, height: h } = size;
  const clampX = (x: number) => Math.min(Math.max(margin, x), viewport.width - w - margin);
  const clampY = (y: number) => Math.min(Math.max(margin, y), viewport.height - h - margin);
  const right = mouse.x + 20;
  const left = mouse.x - 12 - w;
  const below = mouse.y + 28;
  const above = mouse.y - 12 - h;
  if (right + w <= viewport.width - margin) return { left: right, top: clampY(mouse.y - h / 2) };
  if (left >= margin) return { left, top: clampY(mouse.y - h / 2) };
  if (below + h <= viewport.height - margin) return { left: clampX(mouse.x - w / 2), top: below };
  if (above >= margin) return { left: clampX(mouse.x - w / 2), top: above };
  return { left: clampX(mouse.x - w / 2), top: clampY(below) };
}
