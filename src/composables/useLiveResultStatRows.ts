import { computed, type ComputedRef } from "vue";
import { formatLiveStatValue, statShare, type StatShare } from "../calculator/statSplit";
import type { LiveStatValues } from "../calculator/buildOnlyStats";

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

export interface LiveResultStatSource extends LiveStatValues {
  elementFilter?: string | null;
}

export interface LiveResultStatRow {
  /** Canonical STAT_KEYS key (src/calculator/pinnedStats.ts) — matches
   *  LIVE_RESULT_BAR_STAT_META's key vocabulary, not the raw prop name. */
  key: string;
  icon: string;
  label: string;
  value: string;
  /** Build-vs-live split for the two-tone bar (ADR 0051); null when no
   *  build stats were given yet or there's nothing to draw. */
  share: StatShare | null;
}

type RawRow = { key: string; icon: string; label: string; raw: (s: LiveStatValues) => number };

const RAW_ROWS: RawRow[] = [
  { key: "totalHp", icon: `${ASSET_BASE}/hp.png`, label: "HP", raw: (s) => s.totalHp },
  { key: "totalAtk", icon: `${ASSET_BASE}/atk.png`, label: "ATK", raw: (s) => s.totalAtk },
  { key: "totalDef", icon: `${ASSET_BASE}/def.png`, label: "DEF", raw: (s) => s.totalDef },
  { key: "totalCritRate", icon: `${ASSET_BASE}/critrate.png`, label: "Crit Rate", raw: (s) => s.totalCritRate },
  { key: "totalCritDMG", icon: `${ASSET_BASE}/critdamage.png`, label: "Crit DMG", raw: (s) => s.totalCritDmg },
  { key: "energyRegen", icon: `${ASSET_BASE}/energyregen.png`, label: "Energy Regen", raw: (s) => s.energyRegen },
  {
    key: "basicAttackDmgBonus",
    icon: `${ASSET_BASE}/basicatkdmgbonus.png`,
    label: "Basic Attack DMG Bonus",
    raw: (s) => s.basicAttackDmgBonus,
  },
  {
    key: "heavyAttackDmgBonus",
    icon: `${ASSET_BASE}/heavyatkdmgbonus.png`,
    label: "Heavy Attack DMG Bonus",
    raw: (s) => s.heavyAttackDmgBonus,
  },
  {
    key: "resonanceSkillDmgBonus",
    icon: `${ASSET_BASE}/skilldmgbonus.png`,
    label: "Resonance Skill DMG Bonus",
    raw: (s) => s.resonanceSkillDmgBonus,
  },
  {
    key: "resonanceLiberationDmgBonus",
    icon: `${ASSET_BASE}/liberationdmgbonus.png`,
    label: "Resonance Liberation DMG Bonus",
    raw: (s) => s.resonanceLiberationDmgBonus,
  },
  { key: "healingBonus", icon: `${ASSET_BASE}/healingbonus.png`, label: "Healing Bonus", raw: (s) => s.healingBonus },
  {
    key: "tuneBreakBoost",
    icon: `${ASSET_BASE}/tunebreakboost.png`,
    label: "Tune Break Boost",
    raw: (s) => s.tuneBreakBoost || 0,
  },
];

/**
 * Builds the 13 pinnable stat rows (icon/label/formatted value) from the
 * same raw numeric values CalculatorStats.vue already renders, keyed by the
 * STAT_KEYS vocabulary (src/calculator/pinnedStats.ts) so both the pinned
 * chip strip and the grouped Overview tab read from one source. Formatting
 * per stat intentionally mirrors CalculatorStats.vue's existing (slightly
 * inconsistent — some multiply by 100, Tune Break Boost uses displayInt not
 * displayPercentage) expressions exactly, via `formatLiveStatValue`; this is a
 * display-layer reuse, not a place to "fix" those game-math formatting
 * choices.
 *
 * `buildSource` (optional) is the same shape for the character's build-only
 * stats (`computeBuildOnlyStats`); when given, each row gets a `share` for the
 * build-vs-live bar.
 */
export function useLiveResultStatRows(
  source: () => LiveResultStatSource,
  buildSource: () => LiveStatValues | null | undefined = () => null,
): ComputedRef<LiveResultStatRow[]> {
  return computed(() => {
    const s = source();
    const b = buildSource();
    const toRow = (key: string, icon: string, label: string, live: number, build: number | null) => ({
      key,
      icon,
      label,
      value: formatLiveStatValue(key, live),
      share: build === null ? null : statShare(key, build, live),
    });
    const rows: LiveResultStatRow[] = RAW_ROWS.map((row) =>
      toRow(row.key, row.icon, row.label, row.raw(s), b ? row.raw(b) : null),
    );

    const element = s.elementFilter ? ELEMENT_META[s.elementFilter] : null;
    if (element) {
      rows.push(
        toRow("elementDmgBonus", element.icon, element.label, s[element.prop], b ? b[element.prop] : null),
      );
    }

    return rows;
  });
}
