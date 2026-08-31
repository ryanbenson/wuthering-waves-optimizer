import { displayDamage, displayInt, displayPercentage } from "../../utils/numbers";

const STAT_LABELS: Record<string, string> = {
  totalHp: "HP",
  totalAtk: "ATK",
  totalDef: "DEF",
  totalCritRate: "Crit Rate",
  totalCritDMG: "Crit DMG",
  energyRegen: "Energy Regen",
};

const PERCENT_STATS = new Set(["totalCritRate", "totalCritDMG", "energyRegen"]);

/** Human label for the optimization target — a stat name, rotation name, or attack label. */
export function getTargetLabel(
  targetType: string,
  targetValue: string,
  context: Record<string, unknown> | undefined,
): string {
  if (targetType === "Stat") {
    return STAT_LABELS[targetValue] ?? targetValue;
  }
  const ctx = context ?? {};
  if (targetType === "Rotation") {
    return (ctx.rotation as { name?: string } | undefined)?.name ?? "Rotation damage";
  }
  const attacks = ctx.attacks as Array<{ label?: string }> | undefined;
  return attacks?.[0]?.label ?? "Attack damage";
}

/** Formats a raw targetValue number the way its target type expects. */
export function formatTargetValue(
  targetType: string,
  targetValue: string,
  rawValue: number,
): string {
  if (targetType === "Stat") {
    if (PERCENT_STATS.has(targetValue)) return displayPercentage(rawValue * 100);
    return displayInt(rawValue);
  }
  return String(displayDamage(rawValue));
}
