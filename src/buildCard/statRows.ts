import { displayInt, displayPercentage } from "../utils/numbers";
import { ELEMENT_ICONS, ICON_BASE } from "./theme";

const SHORT_STAT_LABELS: Record<string, string> = {
  basicAttackDMGBonus: "Basic ATK DMG",
  heavyAttackDMGBonus: "Heavy ATK DMG",
  resonanceSkillDMGBonus: "Skill DMG",
  resonanceLiberationDMGBonus: "Liberation DMG",
};

export interface BuildCardStatRow {
  key: string;
  label: string;
  /** For narrow multi-column lists (Showcase). */
  shortLabel: string;
  icon: string;
  value: string;
  /** True when the stat is zero, so layouts can de-emphasize it. */
  isZero: boolean;
  group: "base" | "bonus";
}

// The build card's stat list, in display order. Values use the exact same
// units and formatters as CalculatorStats.vue did when the card rendered
// that table: crit rate/crit DMG arrive as whole percents, energy regen and
// healing as fractions, DMG bonuses as whole percents, tune break boost as
// a fraction shown as an integer. Crit is divided then re-multiplied by 100
// on purpose: that is the round trip the old table did, and keeping it
// keeps every exported number identical to before.
export function buildCardStatRows(
  stats: Record<string, number | undefined>,
  element: string | null | undefined,
  tuneBreakBoost: number,
): BuildCardStatRow[] {
  const n = (key: string) => Number(stats[key] ?? 0);
  const rows: BuildCardStatRow[] = [];
  const add = (
    key: string,
    label: string,
    icon: string,
    raw: number,
    value: string,
    group: BuildCardStatRow["group"],
  ) =>
    rows.push({
      key,
      label,
      shortLabel: SHORT_STAT_LABELS[key] ?? label.replace(/ Bonus$/, ""),
      icon,
      value,
      isZero: raw === 0,
      group,
    });

  add("hp", "HP", `${ICON_BASE}/hp.png`, n("totalHp"), displayInt(n("totalHp")), "base");
  add("atk", "ATK", `${ICON_BASE}/atk.png`, n("totalAtk"), displayInt(n("totalAtk")), "base");
  add("def", "DEF", `${ICON_BASE}/def.png`, n("totalDef"), displayInt(n("totalDef")), "base");
  add("critRate", "Crit Rate", `${ICON_BASE}/critrate.png`, n("critRate"), displayPercentage((n("critRate") / 100) * 100), "base");
  add("critDMG", "Crit DMG", `${ICON_BASE}/critdamage.png`, n("critDMG"), displayPercentage((n("critDMG") / 100) * 100), "base");
  add("energyRegen", "Energy Regen", `${ICON_BASE}/energyregen.png`, n("energyRegen"), displayPercentage(n("energyRegen") * 100), "base");

  if (element && ELEMENT_ICONS[element]) {
    const key = element.toLowerCase();
    add(key, `${element} DMG Bonus`, ELEMENT_ICONS[element], n(key), displayPercentage(n(key)), "bonus");
  }
  add("basicAttackDMGBonus", "Basic Attack DMG Bonus", `${ICON_BASE}/basicatkdmgbonus.png`, n("basicAttackDMGBonus"), displayPercentage(n("basicAttackDMGBonus")), "bonus");
  add("heavyAttackDMGBonus", "Heavy Attack DMG Bonus", `${ICON_BASE}/heavyatkdmgbonus.png`, n("heavyAttackDMGBonus"), displayPercentage(n("heavyAttackDMGBonus")), "bonus");
  add("resonanceSkillDMGBonus", "Resonance Skill DMG Bonus", `${ICON_BASE}/skilldmgbonus.png`, n("resonanceSkillDMGBonus"), displayPercentage(n("resonanceSkillDMGBonus")), "bonus");
  add("resonanceLiberationDMGBonus", "Resonance Liberation DMG Bonus", `${ICON_BASE}/liberationdmgbonus.png`, n("resonanceLiberationDMGBonus"), displayPercentage(n("resonanceLiberationDMGBonus")), "bonus");
  add("healingBonus", "Healing Bonus", `${ICON_BASE}/healingbonus.png`, n("healingBonus"), displayPercentage(n("healingBonus") * 100), "bonus");
  add("tuneBreakBoost", "Tune Break Boost", `${ICON_BASE}/tunebreakboost.png`, tuneBreakBoost || 0, displayInt((tuneBreakBoost || 0) * 100), "bonus");

  return rows;
}
