/**
 * Build vs. live stat split (V3 stat display — ADR 0051).
 *
 * "Build" is a character's equipment + permanent unlocks alone — exactly the
 * numbers the build card shows (`buildCharacterCalculationContext(...,
 * { alwaysEnabledOnly: true })`). "Live" is what the calculator uses for
 * damage, with every toggled buff on top. "Buffs" is always live minus
 * build, so the three numbers can never disagree with each other.
 *
 * The per-source rows (character base, weapon, echoes, self buffs, ...) are
 * derived by running the engine's own `calcCharStats` once per source and
 * subtracting an empty baseline, so every unit quirk (`addBuffs`' decimals vs.
 * `addEchoBuffs`' whole-number percents, AllAttributeBonus folding, weapon
 * main stat scaling, ...) comes from the same code that computes the real
 * stats. Anything the per-source sum can't reproduce (character-specific
 * post-processing like `applyCharacterStatEdgeCases`) shows up as an
 * explicit "Other" row instead of silently not adding up.
 *
 * Pure: no Vue, no stores.
 */
import { calcCharStats, getInitStats } from "./stats";
import { displayInt, displayPercentage } from "../utils/numbers";

export type StatSourceKey =
  | "base"
  | "weapon"
  | "selfBuffs"
  | "resonanceChains"
  | "echoes"
  | "teamBuffs"
  | "customBuffs"
  | "other";

type Bundle = Record<string, any> | null | undefined;

/** Everything one side (build or live) of the split needs, in the same shapes
 *  the stat pipeline itself consumes. */
export interface StatSourceInputs {
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  weaponData: {
    attack?: number;
    modifier?: string | null;
    modifierValue?: number;
    weaponPassiveStats?: Bundle;
  };
  /** Self buffs as the final pass summed them (`appliedSelfBuffsData`),
   *  including the echo set AdditionalBase part below. */
  selfBuffs: Bundle;
  resonanceChains: Bundle;
  echoStats: Bundle;
  /** The echo set AdditionalBase part folded into `selfBuffs` — reported
   *  under Echoes, the same way the classic breakdown does. */
  echoSetAdditionalBase: Bundle;
  customBuffs: Bundle;
  teamBuffs: Bundle;
  /** Tune Break Boost isn't part of `calcCharStats`; it's summed separately
   *  by `computeTotalTuneBreakBoost`, so its parts are passed explicitly. */
  tuneBreakBoost: {
    base: number;
    selfBuffs: number;
    resonanceChains: number;
    teamBuffs: number;
    /** Whole-number units, divided by 100 like computeTotalTuneBreakBoost. */
    echoes: number;
  };
}

export const STAT_SOURCE_LABELS: Record<StatSourceKey, string> = {
  base: "Character base",
  weapon: "Weapon",
  selfBuffs: "Self buffs",
  resonanceChains: "Resonance chains",
  echoes: "Echoes",
  teamBuffs: "Team buffs",
  customBuffs: "Custom buffs",
  other: "Other",
};

const SOURCE_ORDER: StatSourceKey[] = [
  "base",
  "weapon",
  "echoes",
  "selfBuffs",
  "resonanceChains",
  "teamBuffs",
  "customBuffs",
];

type ScaledSpec = {
  kind: "scaled";
  percent: "hpPercent" | "attackPercent" | "defPercent";
  flat: "hpFlat" | "attackFlat" | "defFlat";
};
type BucketSpec = { kind: "bucket"; bucket: string; scale: number };
type StatSpec = ScaledSpec | BucketSpec | { kind: "tuneBreakBoost" };

// Keyed by the STAT_KEYS vocabulary (pinnedStats.ts); values are in the same
// units as LiveResultStatSource / Calculator.vue's live refs (crit/ER/healing
// as decimals, DMG bonuses as whole-number percents).
const STAT_SPECS: Record<string, StatSpec> = {
  totalHp: { kind: "scaled", percent: "hpPercent", flat: "hpFlat" },
  totalAtk: { kind: "scaled", percent: "attackPercent", flat: "attackFlat" },
  totalDef: { kind: "scaled", percent: "defPercent", flat: "defFlat" },
  totalCritRate: { kind: "bucket", bucket: "critRate", scale: 1 / 100 },
  totalCritDMG: { kind: "bucket", bucket: "critDMG", scale: 1 / 100 },
  energyRegen: { kind: "bucket", bucket: "energyRegen", scale: 1 },
  basicAttackDmgBonus: { kind: "bucket", bucket: "basicAttackDMGBonus", scale: 1 },
  heavyAttackDmgBonus: { kind: "bucket", bucket: "heavyAttackDMGBonus", scale: 1 },
  resonanceSkillDmgBonus: { kind: "bucket", bucket: "resonanceSkillDMGBonus", scale: 1 },
  resonanceLiberationDmgBonus: { kind: "bucket", bucket: "resonanceLiberationDMGBonus", scale: 1 },
  healingBonus: { kind: "bucket", bucket: "healingBonus", scale: 1 },
  tuneBreakBoost: { kind: "tuneBreakBoost" },
};

const ELEMENT_BUCKETS: Record<string, string> = {
  Glacio: "glacio",
  Fusion: "fusion",
  Electro: "electro",
  Aero: "aero",
  Spectro: "spectro",
  Havoc: "havoc",
};

// Labels as the UI emits them on stat-selected → STAT_KEYS key.
const LABEL_TO_STAT_KEY: Record<string, string> = {
  HP: "totalHp",
  ATK: "totalAtk",
  DEF: "totalDef",
  "Crit Rate": "totalCritRate",
  "Crit DMG": "totalCritDMG",
  "Energy Regen": "energyRegen",
  "Basic Attack DMG Bonus": "basicAttackDmgBonus",
  "Heavy Attack DMG Bonus": "heavyAttackDmgBonus",
  "Resonance Skill DMG Bonus": "resonanceSkillDmgBonus",
  "Resonance Liberation DMG Bonus": "resonanceLiberationDmgBonus",
  "Healing Bonus": "healingBonus",
  "Tune Break Boost": "tuneBreakBoost",
};

/** Resolves a stat label ("ATK", "Fusion DMG Bonus", ...) to its STAT_KEYS
 *  key plus, for the element row, which element it is. */
export function resolveStatSelection(
  label: string | null | undefined,
): { statKey: string; element: string | null } | null {
  if (!label) return null;
  if (LABEL_TO_STAT_KEY[label]) {
    return { statKey: LABEL_TO_STAT_KEY[label], element: null };
  }
  const element = /^(\w+) DMG Bonus$/.exec(label)?.[1];
  if (element && ELEMENT_BUCKETS[element]) {
    return { statKey: "elementDmgBonus", element };
  }
  return null;
}

type Buckets = Record<string, number>;

type WeaponArgs = {
  weaponAtk: number;
  weaponModifier: string | null;
  weaponModifierValue: number;
  weaponPassiveData: Bundle;
};

const EMPTY_WEAPON: WeaponArgs = {
  weaponAtk: 0,
  weaponModifier: null,
  weaponModifierValue: 0,
  weaponPassiveData: {},
};

// One calcCharStats pass with only the given parts filled in. Base stats are
// zero so totals don't matter here — only the percent/flat/bonus buckets.
function runBuckets(parts: {
  weapon?: WeaponArgs;
  self?: Bundle;
  resonanceChains?: Bundle;
  echoes?: Bundle;
  custom?: Bundle;
  team?: Bundle;
}): Buckets {
  return calcCharStats(
    false,
    null,
    {},
    null,
    null,
    { baseHp: 0, baseAtk: 0, baseDef: 0 },
    parts.weapon ?? EMPTY_WEAPON,
    parts.self ?? {},
    parts.resonanceChains ?? {},
    parts.echoes ?? {},
    parts.custom ?? {},
    parts.team ?? {},
  );
}

const BUCKET_KEYS = Object.keys(getInitStats(null));

function diff(a: Buckets, b: Buckets): Buckets {
  const out: Buckets = {};
  for (const key of BUCKET_KEYS) {
    out[key] = (a[key] || 0) - (b[key] || 0);
  }
  return out;
}

function add(a: Buckets, b: Buckets): Buckets {
  const out: Buckets = {};
  for (const key of BUCKET_KEYS) {
    out[key] = (a[key] || 0) + (b[key] || 0);
  }
  return out;
}

/** Each source's contribution to every stat bucket, in calcCharStats units.
 *  `base` is the engine's starting values (5% crit rate, 150% crit DMG,
 *  100% energy regen). The sources sum to the full pipeline's buckets. */
export function attributeStatBuckets(
  inputs: StatSourceInputs,
): Record<Exclude<StatSourceKey, "other">, Buckets> {
  const baseline = runBuckets({});
  const of = (parts: Parameters<typeof runBuckets>[0]) => diff(runBuckets(parts), baseline);
  const weapon = of({
    weapon: {
      weaponAtk: 0,
      weaponModifier: inputs.weaponData?.modifier ?? null,
      weaponModifierValue: inputs.weaponData?.modifierValue ?? 0,
      weaponPassiveData: inputs.weaponData?.weaponPassiveStats ?? {},
    },
  });
  const echoSetAdditionalBase = of({ self: inputs.echoSetAdditionalBase });
  const selfAll = of({ self: inputs.selfBuffs });
  return {
    base: baseline,
    weapon,
    echoes: add(of({ echoes: inputs.echoStats }), echoSetAdditionalBase),
    selfBuffs: diff(selfAll, echoSetAdditionalBase),
    resonanceChains: of({ resonanceChains: inputs.resonanceChains }),
    teamBuffs: of({ team: inputs.teamBuffs }),
    customBuffs: of({ custom: inputs.customBuffs }),
  };
}

export interface StatSplitRow {
  source: StatSourceKey;
  label: string;
  /** For HP/ATK/DEF: percent points of the stat's % bucket (the "+68.0%"
   *  part); otherwise the contribution in the stat's live units. */
  amount: number;
  /** HP/ATK/DEF only: flat contribution. */
  flat?: number;
  /** True when `amount` is an absolute stat value (base ATK, weapon ATK,
   *  Other) rather than a percent-bucket share. */
  isAbsolute?: boolean;
}

export interface StatSplit {
  statKey: string;
  build: number;
  live: number;
  buffs: number;
  buildRows: StatSplitRow[];
  buffRows: StatSplitRow[];
  /** HP/ATK/DEF only — the parts of `(base + weapon) × (1 + %) + flat`. */
  formula?: {
    base: number;
    weaponAtk: number;
    buildPercent: number;
    buffPercent: number;
    flat: number;
  };
}

const EPSILON = 1e-6;

function scaledTotal(base: number, percent: number, flat: number): number {
  return base * (1 + percent / 100) + flat;
}

function scaledBase(statKey: string, inputs: StatSourceInputs) {
  switch (statKey) {
    case "totalHp":
      return { base: inputs.baseHp, weaponAtk: 0 };
    case "totalDef":
      return { base: inputs.baseDef, weaponAtk: 0 };
    default:
      return { base: inputs.baseAtk, weaponAtk: inputs.weaponData?.attack ?? 0 };
  }
}

function tuneBreakParts(inputs: StatSourceInputs): Partial<Record<StatSourceKey, number>> {
  const t = inputs.tuneBreakBoost;
  return {
    base: t.base,
    selfBuffs: t.selfBuffs,
    resonanceChains: t.resonanceChains,
    teamBuffs: t.teamBuffs,
    echoes: t.echoes / 100,
  };
}

function bucketParts(
  inputs: StatSourceInputs,
  spec: BucketSpec,
): Partial<Record<StatSourceKey, number>> {
  const attributed = attributeStatBuckets(inputs);
  const out: Partial<Record<StatSourceKey, number>> = {};
  for (const source of SOURCE_ORDER) {
    out[source] = (attributed[source as Exclude<StatSourceKey, "other">][spec.bucket] || 0) * spec.scale;
  }
  return out;
}

function nonZero(row: StatSplitRow): boolean {
  return Math.abs(row.amount) > EPSILON || Math.abs(row.flat ?? 0) > EPSILON;
}

/**
 * Splits one stat into build and buffs.
 *
 * `build`/`live` are the authoritative final values (the build card's and the
 * calculator's own numbers); the rows explain them. Each source's build row is
 * its value in the build pipeline and its buff row is live minus build, so a
 * source like self buffs can appear in both groups (Stat Bonus tiers under
 * build, conditional buffs under buffs). When the rows don't add up to the
 * header (character-specific post-processing), the gap becomes an "Other" row.
 */
export function splitStat(
  statKey: string,
  side: {
    build: { inputs: StatSourceInputs; value: number };
    live: { inputs: StatSourceInputs; value: number };
  },
  element: string | null = null,
): StatSplit | null {
  const spec: StatSpec | undefined =
    statKey === "elementDmgBonus"
      ? element && ELEMENT_BUCKETS[element]
        ? { kind: "bucket", bucket: ELEMENT_BUCKETS[element], scale: 1 }
        : undefined
      : STAT_SPECS[statKey];
  if (!spec) return null;

  const build = side.build.value;
  const live = side.live.value;
  const result: StatSplit = {
    statKey,
    build,
    live,
    buffs: live - build,
    buildRows: [],
    buffRows: [],
  };

  if (spec.kind === "scaled") {
    const buildAttr = attributeStatBuckets(side.build.inputs);
    const liveAttr = attributeStatBuckets(side.live.inputs);
    const { base, weaponAtk } = scaledBase(statKey, side.build.inputs);
    const scaledFrom = scaledBase(statKey, side.live.inputs);
    let buildPercent = 0;
    let buildFlat = 0;
    let livePercent = 0;
    let liveFlat = 0;

    result.buildRows.push({ source: "base", label: `Character base ${statLabel(statKey)}`, amount: base, isAbsolute: true });
    if (statKey === "totalAtk") {
      result.buildRows.push({ source: "weapon", label: "Weapon ATK", amount: weaponAtk, isAbsolute: true });
    }
    for (const source of SOURCE_ORDER) {
      const key = source as Exclude<StatSourceKey, "other">;
      const bp = buildAttr[key][spec.percent] || 0;
      const bf = buildAttr[key][spec.flat] || 0;
      const lp = liveAttr[key][spec.percent] || 0;
      const lf = liveAttr[key][spec.flat] || 0;
      buildPercent += bp;
      buildFlat += bf;
      livePercent += lp;
      liveFlat += lf;
      result.buildRows.push({ source, label: STAT_SOURCE_LABELS[source], amount: bp, flat: bf });
      result.buffRows.push({ source, label: STAT_SOURCE_LABELS[source], amount: lp - bp, flat: lf - bf });
    }

    const buildOther = build - scaledTotal(base + weaponAtk, buildPercent, buildFlat);
    const liveOther =
      live - scaledTotal(scaledFrom.base + scaledFrom.weaponAtk, livePercent, liveFlat);
    pushOther(result.buildRows, buildOther);
    pushOther(result.buffRows, liveOther - buildOther);

    result.formula = {
      base,
      weaponAtk,
      buildPercent,
      buffPercent: livePercent - buildPercent,
      flat: liveFlat,
    };
  } else {
    const buildParts =
      spec.kind === "tuneBreakBoost" ? tuneBreakParts(side.build.inputs) : bucketParts(side.build.inputs, spec);
    const liveParts =
      spec.kind === "tuneBreakBoost" ? tuneBreakParts(side.live.inputs) : bucketParts(side.live.inputs, spec);
    let buildSum = 0;
    let liveSum = 0;
    for (const source of SOURCE_ORDER) {
      const b = buildParts[source] ?? 0;
      const l = liveParts[source] ?? 0;
      buildSum += b;
      liveSum += l;
      result.buildRows.push({ source, label: STAT_SOURCE_LABELS[source], amount: b });
      if (source !== "base") {
        result.buffRows.push({ source, label: STAT_SOURCE_LABELS[source], amount: l - b });
      }
    }
    const buildOther = build - buildSum;
    pushOther(result.buildRows, buildOther);
    pushOther(result.buffRows, live - liveSum - buildOther);
  }

  // Base rows always show (they anchor the build total); other zero rows are
  // dropped so each list only names what actually contributes.
  result.buildRows = result.buildRows.filter((row) => row.isAbsolute || row.source === "base" || nonZero(row));
  result.buffRows = result.buffRows.filter(nonZero);
  return result;
}

function pushOther(rows: StatSplitRow[], amount: number) {
  // Rounding noise from float math isn't a real source.
  if (Math.abs(amount) > 1e-4) {
    rows.push({ source: "other", label: STAT_SOURCE_LABELS.other, amount, isAbsolute: true });
  }
}

function statLabel(statKey: string): string {
  return statKey === "totalHp" ? "HP" : statKey === "totalDef" ? "DEF" : "ATK";
}

// ---------------------------------------------------------------------------
// Formatting — mirrors useLiveResultStatRows' per-stat expressions exactly.

type StatFormat = "int" | "percentDecimal" | "percentWhole" | "tuneBreak";

function statFormat(statKey: string): StatFormat {
  switch (statKey) {
    case "totalHp":
    case "totalAtk":
    case "totalDef":
      return "int";
    case "totalCritRate":
    case "totalCritDMG":
    case "energyRegen":
    case "healingBonus":
      return "percentDecimal";
    case "tuneBreakBoost":
      return "tuneBreak";
    default:
      return "percentWhole";
  }
}

/** Formats a live-unit stat value the same way the Overview rows do. */
export function formatLiveStatValue(statKey: string, value: number): string {
  switch (statFormat(statKey)) {
    case "int":
      return displayInt(value);
    case "percentDecimal":
      return displayPercentage(value * 100);
    case "tuneBreak":
      return displayInt((value || 0) * 100);
    default:
      return displayPercentage(value);
  }
}

// The number as it reads on screen (displayInt floors, displayPercentage
// rounds to one decimal), so a displayed "build + buffs" always adds up to the
// displayed live value instead of drifting by a rounding unit.
function displayedNumber(statKey: string, value: number): number {
  switch (statFormat(statKey)) {
    case "int":
      return Math.floor(value);
    case "percentDecimal":
      return Math.round(value * 1000) / 10;
    case "tuneBreak":
      return Math.floor((value || 0) * 100);
    default:
      return Math.round(value * 10) / 10;
  }
}

export interface StatShare {
  /** 0–1 share of the live value that comes from the build. */
  build: number;
  /** 0–1 share added by buffs (0 when buffs lowered the stat). */
  buffs: number;
  hasBuffs: boolean;
  /** "2,000" — build value as displayed. */
  buildText: string;
  /** "+1,500" / "−12.0%" — difference as displayed, or "" when none. */
  buffsText: string;
}

/**
 * The two-tone bar's widths plus its "build + buffs" text, or null when
 * there's nothing to draw (live value is zero/negative).
 */
export function statShare(statKey: string, build: number, live: number): StatShare | null {
  if (!(live > EPSILON)) return null;
  const shownBuild = displayedNumber(statKey, build);
  const shownLive = displayedNumber(statKey, live);
  const delta = shownLive - shownBuild;
  const ratio = Math.min(1, Math.max(0, build / live));
  const hasBuffs = Math.abs(delta) > EPSILON;
  return {
    build: hasBuffs ? ratio : 1,
    buffs: hasBuffs && delta > 0 ? 1 - ratio : 0,
    hasBuffs,
    buildText: formatLiveStatValue(statKey, build),
    buffsText: hasBuffs ? formatDelta(statKey, delta) : "",
  };
}

function formatDelta(statKey: string, shownDelta: number): string {
  const sign = shownDelta < 0 ? "−" : "+";
  const abs = Math.abs(shownDelta);
  const format = statFormat(statKey);
  if (format === "int" || format === "tuneBreak") {
    return `${sign}${displayInt(abs)}`;
  }
  return `${sign}${displayPercentage(abs)}`;
}

/** Formats one split row's amount for the stat detail ("+68.0% · +200",
 *  "412", "+12.0%"). */
export function formatSplitRow(statKey: string, row: StatSplitRow): string {
  if (row.isAbsolute) {
    if (row.source === "other") {
      return signed(formatLiveStatValue(statKey, Math.abs(row.amount)), row.amount);
    }
    return formatLiveStatValue(statKey, row.amount);
  }
  if (STAT_SPECS[statKey]?.kind === "scaled") {
    const parts: string[] = [];
    const percentText = displayPercentage(Math.abs(row.amount));
    const flatText = displayInt(Math.abs(row.flat ?? 0));
    if (!isZeroText(percentText)) parts.push(signed(percentText, row.amount));
    if (!isZeroText(flatText)) parts.push(signed(flatText, row.flat ?? 0));
    return parts.join(" · ") || "0.0%";
  }
  const text = formatLiveStatValue(statKey, Math.abs(row.amount));
  return row.source === "base" ? text : signed(text, row.amount);
}

/** True when a formatted magnitude shows as zero ("0", "0.0%", "0.00"). */
function isZeroText(text: string): boolean {
  return !/[1-9]/.test(text);
}

/**
 * Prefixes a formatted magnitude with its sign — none when it shows as zero,
 * so a tiny amount never reads "+0.0%" or "−0" (#703).
 */
function signed(text: string, value: number): string {
  if (isZeroText(text)) return text;
  return `${value < 0 ? "−" : "+"}${text}`;
}

const LIVE_VALUE_FIELDS: Record<string, string> = {
  totalHp: "totalHp",
  totalAtk: "totalAtk",
  totalDef: "totalDef",
  totalCritRate: "totalCritRate",
  totalCritDMG: "totalCritDmg",
  energyRegen: "energyRegen",
  basicAttackDmgBonus: "basicAttackDmgBonus",
  heavyAttackDmgBonus: "heavyAttackDmgBonus",
  resonanceSkillDmgBonus: "resonanceSkillDmgBonus",
  resonanceLiberationDmgBonus: "resonanceLiberationDmgBonus",
  healingBonus: "healingBonus",
  tuneBreakBoost: "tuneBreakBoost",
};

/** Reads one STAT_KEYS stat out of a `LiveStatValues`-shaped object. */
export function liveStatValueFor(
  values: Record<string, number> | null | undefined,
  statKey: string,
  element: string | null = null,
): number {
  if (!values) return 0;
  if (statKey === "elementDmgBonus") {
    return element && ELEMENT_BUCKETS[element] ? values[ELEMENT_BUCKETS[element]] ?? 0 : 0;
  }
  const field = LIVE_VALUE_FIELDS[statKey];
  return field ? values[field] ?? 0 : 0;
}
