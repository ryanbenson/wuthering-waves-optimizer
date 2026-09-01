import { computed, type ComputedRef } from "vue";
import { displayPercentage, displayInt } from "../utils/numbers";

// Same asset host + filenames CalculatorStats.vue already uses for these
// rows — kept in sync manually since there's no shared icon registry.
const ASSET_BASE = "https://ryanbenson.github.io/wuthering-waves-assets/images";

const ELEMENT_META: Record<
  string,
  { prop: "glacio" | "fusion" | "electro" | "aero" | "spectro" | "havoc"; icon: string; label: string }
> = {
  Glacio: { prop: "glacio", icon: `${ASSET_BASE}/glaciodmgbonus.png`, label: "Glacio DMG Bonus" },
  Fusion: { prop: "fusion", icon: `${ASSET_BASE}/fusiondmgbonus.png`, label: "Fusion DMG Bonus" },
  Electro: { prop: "electro", icon: `${ASSET_BASE}/electrodmgbonus.png`, label: "Electro DMG Bonus" },
  Aero: { prop: "aero", icon: `${ASSET_BASE}/aerodmgbonus.png`, label: "Aero DMG Bonus" },
  Spectro: { prop: "spectro", icon: `${ASSET_BASE}/spectrodmgbonus.png`, label: "Spectro DMG Bonus" },
  Havoc: { prop: "havoc", icon: `${ASSET_BASE}/havocdmgbonus.png`, label: "Havoc DMG Bonus" },
};

export interface LiveResultStatSource {
  totalHp: number;
  totalAtk: number;
  totalDef: number;
  totalCritRate: number;
  totalCritDmg: number;
  energyRegen: number;
  basicAttackDmgBonus: number;
  heavyAttackDmgBonus: number;
  resonanceSkillDmgBonus: number;
  resonanceLiberationDmgBonus: number;
  healingBonus: number;
  tuneBreakBoost: number;
  glacio: number;
  fusion: number;
  electro: number;
  aero: number;
  spectro: number;
  havoc: number;
  elementFilter?: string | null;
}

export interface LiveResultStatRow {
  /** Canonical STAT_KEYS key (src/calculator/pinnedStats.ts) — matches
   *  LIVE_RESULT_BAR_STAT_META's key vocabulary, not the raw prop name. */
  key: string;
  icon: string;
  label: string;
  value: string;
}

/**
 * Builds the 13 pinnable stat rows (icon/label/formatted value) from the
 * same raw numeric values CalculatorStats.vue already renders, keyed by the
 * STAT_KEYS vocabulary (src/calculator/pinnedStats.ts) so both the pinned
 * chip strip and the grouped Overview tab read from one source. Formatting
 * per stat intentionally mirrors CalculatorStats.vue's existing (slightly
 * inconsistent — some multiply by 100, Tune Break Boost uses displayInt not
 * displayPercentage) expressions exactly; this is a display-layer reuse, not
 * a place to "fix" those game-math formatting choices.
 */
export function useLiveResultStatRows(
  source: () => LiveResultStatSource,
): ComputedRef<LiveResultStatRow[]> {
  return computed(() => {
    const s = source();
    const rows: LiveResultStatRow[] = [
      { key: "totalHp", icon: `${ASSET_BASE}/hp.png`, label: "HP", value: displayInt(s.totalHp) },
      { key: "totalAtk", icon: `${ASSET_BASE}/atk.png`, label: "ATK", value: displayInt(s.totalAtk) },
      { key: "totalDef", icon: `${ASSET_BASE}/def.png`, label: "DEF", value: displayInt(s.totalDef) },
      {
        key: "totalCritRate",
        icon: `${ASSET_BASE}/critrate.png`,
        label: "Crit Rate",
        value: displayPercentage(s.totalCritRate * 100),
      },
      {
        key: "totalCritDMG",
        icon: `${ASSET_BASE}/critdamage.png`,
        label: "Crit DMG",
        value: displayPercentage(s.totalCritDmg * 100),
      },
      {
        key: "energyRegen",
        icon: `${ASSET_BASE}/energyregen.png`,
        label: "Energy Regen",
        value: displayPercentage(s.energyRegen * 100),
      },
      {
        key: "basicAttackDmgBonus",
        icon: `${ASSET_BASE}/basicatkdmgbonus.png`,
        label: "Basic Attack DMG Bonus",
        value: displayPercentage(s.basicAttackDmgBonus),
      },
      {
        key: "heavyAttackDmgBonus",
        icon: `${ASSET_BASE}/heavyatkdmgbonus.png`,
        label: "Heavy Attack DMG Bonus",
        value: displayPercentage(s.heavyAttackDmgBonus),
      },
      {
        key: "resonanceSkillDmgBonus",
        icon: `${ASSET_BASE}/skilldmgbonus.png`,
        label: "Resonance Skill DMG Bonus",
        value: displayPercentage(s.resonanceSkillDmgBonus),
      },
      {
        key: "resonanceLiberationDmgBonus",
        icon: `${ASSET_BASE}/liberationdmgbonus.png`,
        label: "Resonance Liberation DMG Bonus",
        value: displayPercentage(s.resonanceLiberationDmgBonus),
      },
      {
        key: "healingBonus",
        icon: `${ASSET_BASE}/healingbonus.png`,
        label: "Healing Bonus",
        value: displayPercentage(s.healingBonus * 100),
      },
      {
        key: "tuneBreakBoost",
        icon: `${ASSET_BASE}/tunebreakboost.png`,
        label: "Tune Break Boost",
        value: displayInt((s.tuneBreakBoost || 0) * 100),
      },
    ];

    const element = s.elementFilter ? ELEMENT_META[s.elementFilter] : null;
    if (element) {
      rows.push({
        key: "elementDmgBonus",
        icon: element.icon,
        label: element.label,
        value: displayPercentage(s[element.prop]),
      });
    }

    return rows;
  });
}
