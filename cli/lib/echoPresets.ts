import fs from "fs";
import { loadEchoSetLabelToKeyMap } from "./echoes.js";
import { parseEchoEntries } from "./parseEchoEntries.js";

export const ECHO_COST_CLASS_MAP: Record<string, number> = {
  Calamity: 4,
  Overlord: 4,
  Elite: 3,
  Common: 1,
};

export const SUBSTAT_VALUES = {
  critRate: 8.1,
  critDmg: 16.2,
  mainPercent: 8.6,
  attackType: 8.6,
  energyRegen: 9.2,
  fillerHp: 8.6,
  fillerDef: 10.9,
  atkFlat: 50,
  defFlat: 50,
  hpFlat4Cost: 430,
  hpFlatFiller: 50,
} as const;

export type SetCombo = "5" | "23" | "221" | "25";
export type SetStyle = "43311" | "44111";
export type MainStatFocus = "atk" | "hp" | "def";
export type AttackTypeChoice =
  | "basic"
  | "heavy"
  | "skill"
  | "liberation"
  | "none";

export type ThreeCostMainStat =
  | "element"
  | "ATK"
  | "EnergyRegen"
  | "HP"
  | "DEF";

export const ELEMENT_MAIN_STATS = [
  "Glacio",
  "Fusion",
  "Electro",
  "Aero",
  "Spectro",
  "Havoc",
] as const;

export type ElementMainStat = (typeof ELEMENT_MAIN_STATS)[number];

export interface EchoCandidate {
  key: string;
  name: string;
  echoClass: string;
  cost: number;
  sets: string[];
}

export interface CharacterOption {
  key: string;
  name: string;
  element: string;
  presetCount: number;
}

export interface EchoPresetInput {
  characterKey: string;
  characterElement: string;
  presetName: string;
  author: string;
  setCombo: SetCombo;
  setKeys: string[];
  setStyle: SetStyle;
  targetEr: number;
  fourCostMains: Array<
    "CritRate" | "CritDMG" | "ATK" | "HP" | "DEF" | "HealingBonus"
  >;
  threeCostMain: ThreeCostMainStat | null;
  threeCostMainCount: 0 | 1 | 2;
  threeCostElement?: ElementMainStat;
  mainStatFocus: MainStatFocus;
  attackType: AttackTypeChoice;
}

export interface EchoSlotData {
  type: number;
  echo: string;
  echoSet: string;
  stat: string;
  echoSubStatsType1: string;
  echoSubStatsValue1: number;
  echoSubStatsType2: string;
  echoSubStatsValue2: number;
  echoSubStatsType3: string;
  echoSubStatsValue3: number;
  echoSubStatsType4: string;
  echoSubStatsValue4: number;
  echoSubStatsType5: string;
  echoSubStatsValue5: number;
}

export interface GeneratedEchoPreset {
  name: string;
  description: string;
  author: string;
  data: { echoes: Record<string, EchoSlotData> };
}

const ATTACK_TYPE_MAP: Record<Exclude<AttackTypeChoice, "none">, string> = {
  basic: "BasicAttackDMGBonus",
  heavy: "HeavyAttackDMGBonus",
  skill: "ResonanceSkillDMGBonus",
  liberation: "ResonanceLiberationDMGBonus",
};

const MAIN_STAT_MAP: Record<
  MainStatFocus,
  { percent: string; flat: string; flat4Cost: number; flatFiller: number }
> = {
  atk: {
    percent: "ATK",
    flat: "ATK_FLAT",
    flat4Cost: SUBSTAT_VALUES.atkFlat,
    flatFiller: SUBSTAT_VALUES.atkFlat,
  },
  hp: {
    percent: "HP",
    flat: "HP_FLAT",
    flat4Cost: SUBSTAT_VALUES.hpFlat4Cost,
    flatFiller: SUBSTAT_VALUES.hpFlatFiller,
  },
  def: {
    percent: "DEF",
    flat: "DEF_FLAT",
    flat4Cost: SUBSTAT_VALUES.defFlat,
    flatFiller: SUBSTAT_VALUES.defFlat,
  },
};

const SET_STYLE_COSTS: Record<SetStyle, number[]> = {
  "43311": [4, 3, 3, 1, 1],
  "44111": [4, 4, 1, 1, 1],
};

const ELEMENT_LABELS: Record<string, string> = {
  Glacio: "Glacio",
  Fusion: "Fusion",
  Electro: "Electro",
  Aero: "Aero",
  Spectro: "Spectro",
  Havoc: "Havoc",
};

export function getElementLabel(element: string): string {
  return ELEMENT_LABELS[element] ?? element;
}

const FILLER_STAT_POOL = [
  "HP",
  "DEF",
  "ATK",
  "HP_FLAT",
  "DEF_FLAT",
  "ATK_FLAT",
] as const;

const FILLER_STAT_VALUES: Record<string, number> = {
  HP: SUBSTAT_VALUES.fillerHp,
  DEF: SUBSTAT_VALUES.fillerDef,
  ATK: SUBSTAT_VALUES.mainPercent,
  HP_FLAT: SUBSTAT_VALUES.hpFlatFiller,
  DEF_FLAT: SUBSTAT_VALUES.defFlat,
  ATK_FLAT: SUBSTAT_VALUES.atkFlat,
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex]!, copy[index]!];
  }
  return copy;
}

export function getDeclaredSubstats(input: EchoPresetInput): Set<string> {
  const main = MAIN_STAT_MAP[input.mainStatFocus];
  const declared = new Set<string>([
    "CritRate",
    "CritDMG",
    main.percent,
    main.flat,
  ]);

  if (input.attackType !== "none") {
    declared.add(ATTACK_TYPE_MAP[input.attackType]);
  }

  const threeCostMain = resolveThreeCostMainStat(input);
  if (threeCostMain === "ATK") {
    declared.add("ATK");
  }
  if (threeCostMain === "HP") {
    declared.add("HP");
  }
  if (threeCostMain === "DEF") {
    declared.add("DEF");
  }

  return declared;
}

function getRandomFillerPool(excluded: Set<string>): string[] {
  return FILLER_STAT_POOL.filter(
    (stat) => !excluded.has(stat) && stat !== "EnergyRegen",
  );
}

function pickRandomFillerStats(
  count: number,
  excluded: Set<string>,
  requireFlat: boolean,
): Array<{ type: string; value: number }> {
  const pool = getRandomFillerPool(excluded);
  if (pool.length === 0) {
    throw new Error("No filler substat options available for this build");
  }

  const shuffled = shuffle(pool);
  const flats = shuffled.filter((stat) => stat.endsWith("_FLAT"));
  const picked: string[] = [];

  if (requireFlat && flats.length > 0) {
    picked.push(flats[0]!);
  }

  for (const stat of shuffled) {
    if (picked.length >= count) {
      break;
    }
    if (!picked.includes(stat)) {
      picked.push(stat);
    }
  }

  while (picked.length < count) {
    picked.push(shuffled[picked.length % shuffled.length]!);
  }

  return picked.slice(0, count).map((type) => ({
    type,
    value: FILLER_STAT_VALUES[type] ?? SUBSTAT_VALUES.fillerHp,
  }));
}

export function loadEchoCandidates(echoesFilePath: string): EchoCandidate[] {
  const content = fs.readFileSync(echoesFilePath, "utf8");
  const parsed = parseEchoEntries(content);

  return parsed.entriesInOrder.map((entry) => {
    const classMatch = entry.rawEntry.match(/class:\s*"([^"]+)"/);
    const setsMatch = entry.rawEntry.match(/sets:\s*\[([\s\S]*?)\]/);
    const echoClass = classMatch?.[1] ?? "Common";
    const sets = setsMatch
      ? [...setsMatch[1]!.matchAll(/"([^"]+)"/g)].map((match) => match[1]!)
      : [];

    return {
      key: entry.objectKey,
      name: entry.name,
      echoClass,
      cost: ECHO_COST_CLASS_MAP[echoClass] ?? 1,
      sets,
    };
  });
}

export function loadEchoSetLabels(statsFilePath: string): Map<string, string> {
  const labelToKey = loadEchoSetLabelToKeyMap(statsFilePath);
  const keyToLabel = new Map<string, string>();
  for (const [label, key] of labelToKey.entries()) {
    keyToLabel.set(key, label);
  }
  return keyToLabel;
}

export function countEchoPresets(presetsFileContent: string): number {
  const match = presetsFileContent.match(
    /export const echoes\s*=\s*\[([\s\S]*?)\];/,
  );
  if (!match) {
    return 0;
  }

  const body = match[1]!.trim();
  if (!body) {
    return 0;
  }

  return (body.match(/\bname:\s*`/g) ?? []).length;
}

export function parseCharacterOptions(
  charactersFileContent: string,
  charactersDir: string,
): CharacterOption[] {
  const rosterMatch = charactersFileContent.match(
    /export const characterPickerRoster: CharacterList = \{([\s\S]*?)\};/,
  );
  if (!rosterMatch) {
    return [];
  }

  const metaMatch = charactersFileContent.match(
    /export const allCharactersList = \[([\s\S]*?)\];/,
  );
  const elementByKey = new Map<string, string>();
  if (metaMatch) {
    for (const [, key, , element] of metaMatch[1]!.matchAll(
      /\{\s*key:\s*"([^"]+)",\s*name:\s*"[^"]+",\s*element:\s*"([^"]+)"/g,
    )) {
      elementByKey.set(key!, element!);
    }
  }

  const entries = [
    ...rosterMatch[1]!.matchAll(
      /\{\s*key:\s*"([^"]+)",\s*name:\s*"([^"]+)"\s*\}/g,
    ),
  ].map(([, key, name]) => ({
    key: key!,
    name: name!,
    element: elementByKey.get(key!) ?? "Spectro",
    presetCount: 0,
  }));

  for (const entry of entries) {
    const presetsPath = `${charactersDir}/${entry.key}/presets.ts`;
    if (!fs.existsSync(presetsPath)) {
      continue;
    }
    entry.presetCount = countEchoPresets(fs.readFileSync(presetsPath, "utf8"));
  }

  return entries.sort((left, right) => left.name.localeCompare(right.name));
}

function resolveThreeCostMainStat(
  input: EchoPresetInput,
): ThreeCostMainStat | null {
  if (input.threeCostMainCount === 0) {
    return null;
  }
  if (input.threeCostMain) {
    return input.threeCostMain;
  }
  return "element";
}

function resolveThreeCostMainKey(input: EchoPresetInput): string | null {
  const stat = resolveThreeCostMainStat(input);
  if (!stat) {
    return null;
  }
  if (stat === "element") {
    return input.threeCostElement ?? input.characterElement;
  }
  return stat;
}

function assignSetKeys(input: EchoPresetInput): string[] {
  const [primary, secondary, tertiary] = input.setKeys;

  switch (input.setCombo) {
    case "5":
    case "25":
      return Array.from({ length: 5 }, () => primary!);
    case "23":
      return [primary!, primary!, primary!, secondary!, secondary!];
    case "221":
      return [
        primary!,
        primary!,
        secondary!,
        secondary!,
        tertiary ?? secondary!,
      ];
    default:
      return Array.from({ length: 5 }, () => primary!);
  }
}

function pickEcho(
  candidates: EchoCandidate[],
  cost: number,
  setKey: string,
  usedKeys: Set<string>,
): string {
  const matches = candidates.filter(
    (candidate) =>
      candidate.cost === cost &&
      candidate.sets.includes(setKey) &&
      !usedKeys.has(candidate.key),
  );

  if (matches.length === 0) {
    throw new Error(
      `No available ${cost}-cost echo found for set "${setKey}"`,
    );
  }

  const [picked] = shuffle(matches);
  usedKeys.add(picked!.key);
  return picked!.key;
}

function buildPrimarySubstats43311(options: {
  mainStat: MainStatFocus;
  attackType: AttackTypeChoice;
  includeFlat: boolean;
  cost: number;
}): Array<{ type: string; value: number }> {
  const main = MAIN_STAT_MAP[options.mainStat];
  const substats: Array<{ type: string; value: number }> = [
    { type: "CritRate", value: SUBSTAT_VALUES.critRate },
    { type: "CritDMG", value: SUBSTAT_VALUES.critDmg },
    { type: main.percent, value: SUBSTAT_VALUES.mainPercent },
  ];

  if (options.includeFlat) {
    substats.push({
      type: main.flat,
      value:
        options.cost === 4 ? main.flat4Cost : main.flatFiller,
    });
  }

  if (options.attackType !== "none") {
    substats.push({
      type: ATTACK_TYPE_MAP[options.attackType],
      value: SUBSTAT_VALUES.attackType,
    });
  }

  return substats.slice(0, 5);
}

function buildPrimarySubstats44111(options: {
  mainStat: MainStatFocus;
  attackType: AttackTypeChoice;
  cost: number;
  flatBeforeAttack: boolean;
}): Array<{ type: string; value: number }> {
  const main = MAIN_STAT_MAP[options.mainStat];
  const attack =
    options.attackType === "none"
      ? []
      : [
          {
            type: ATTACK_TYPE_MAP[options.attackType],
            value: SUBSTAT_VALUES.attackType,
          },
        ];
  const flat = {
    type: main.flat,
    value: options.cost === 4 ? main.flat4Cost : main.flatFiller,
  };
  const percent = {
    type: main.percent,
    value: SUBSTAT_VALUES.mainPercent,
  };

  const tail = options.flatBeforeAttack
    ? [percent, ...attack, flat]
    : [percent, flat, ...attack];

  return [
    { type: "CritRate", value: SUBSTAT_VALUES.critRate },
    { type: "CritDMG", value: SUBSTAT_VALUES.critDmg },
    ...tail,
  ].slice(0, 5);
}

function buildFillerSubstats(options: {
  erRolls: number;
  isLastSlot: boolean;
  excludedStats: Set<string>;
}): Array<{ type: string; value: number }> {
  const substats: Array<{ type: string; value: number }> = [
    { type: "CritRate", value: SUBSTAT_VALUES.critRate },
    { type: "CritDMG", value: SUBSTAT_VALUES.critDmg },
  ];

  for (let index = 0; index < options.erRolls; index += 1) {
    substats.push({
      type: "EnergyRegen",
      value: SUBSTAT_VALUES.energyRegen,
    });
  }

  const remainingSlots = 5 - substats.length;
  if (remainingSlots > 0) {
    substats.push(
      ...pickRandomFillerStats(
        remainingSlots,
        options.excludedStats,
        options.isLastSlot,
      ),
    );
  }

  return substats.slice(0, 5);
}

function buildTwoAtkSubstats(options: {
  attackType: AttackTypeChoice;
  erRolls: number;
  excludedStats: Set<string>;
}): Array<{ type: string; value: number }> {
  const substats: Array<{ type: string; value: number }> = [
    { type: "CritRate", value: SUBSTAT_VALUES.critRate },
    { type: "CritDMG", value: SUBSTAT_VALUES.critDmg },
  ];

  if (options.attackType !== "none") {
    substats.push({
      type: ATTACK_TYPE_MAP[options.attackType],
      value: SUBSTAT_VALUES.attackType,
    });
  }

  for (let index = 0; index < options.erRolls; index += 1) {
    substats.push({
      type: "EnergyRegen",
      value: SUBSTAT_VALUES.energyRegen,
    });
  }

  const remainingSlots = 5 - substats.length;
  if (remainingSlots > 0) {
    substats.push(
      ...pickRandomFillerStats(remainingSlots, options.excludedStats, false),
    );
  }

  return substats.slice(0, 5);
}

function toSlotData(
  cost: number,
  echoKey: string,
  setKey: string,
  mainStat: string,
  substats: Array<{ type: string; value: number }>,
  excludedStats: Set<string>,
): EchoSlotData {
  const padded = [...substats];
  while (padded.length < 5) {
    padded.push(...pickRandomFillerStats(1, excludedStats, false));
  }

  return {
    type: cost,
    echo: echoKey,
    echoSet: setKey,
    stat: mainStat,
    echoSubStatsType1: padded[0]!.type,
    echoSubStatsValue1: padded[0]!.value,
    echoSubStatsType2: padded[1]!.type,
    echoSubStatsValue2: padded[1]!.value,
    echoSubStatsType3: padded[2]!.type,
    echoSubStatsValue3: padded[2]!.value,
    echoSubStatsType4: padded[3]!.type,
    echoSubStatsValue4: padded[3]!.value,
    echoSubStatsType5: padded[4]!.type,
    echoSubStatsValue5: padded[4]!.value,
  };
}

function calculateErRolls(targetEr: number): number {
  if (targetEr <= 0) {
    return 0;
  }
  return Math.max(1, Math.round(targetEr / SUBSTAT_VALUES.energyRegen));
}

function distributeErRolls(
  totalRolls: number,
  fillerSlotIndexes: number[],
): Map<number, number> {
  const distribution = new Map<number, number>();
  const orderedSlots = [...fillerSlotIndexes];
  const lastSlot = orderedSlots[orderedSlots.length - 1];
  const slotsWithoutLast = orderedSlots.filter((slot) => slot !== lastSlot);

  let remaining = totalRolls;
  for (const slot of slotsWithoutLast) {
    if (remaining <= 0) {
      break;
    }
    distribution.set(slot, 1);
    remaining -= 1;
  }

  if (remaining > 0 && lastSlot !== undefined) {
    distribution.set(lastSlot, (distribution.get(lastSlot) ?? 0) + remaining);
  }

  return distribution;
}

function getAttackLabel(attackType: AttackTypeChoice): string | null {
  switch (attackType) {
    case "basic":
      return "Basic";
    case "heavy":
      return "Heavy";
    case "skill":
      return "Skill";
    case "liberation":
      return "Liberation";
    default:
      return null;
  }
}

function getThreeCostDescriptionLabel(input: EchoPresetInput): string | null {
  const stat = resolveThreeCostMainStat(input);
  if (!stat) {
    return null;
  }
  if (stat === "element") {
    const element = input.threeCostElement ?? input.characterElement;
    return ELEMENT_LABELS[element] ?? element;
  }
  if (stat === "EnergyRegen") {
    return "ER";
  }
  return stat;
}

function formatSetNames(
  setKeys: string[],
  setLabels: Map<string, string>,
): string {
  const uniqueKeys = [...new Set(setKeys)];
  const labels = uniqueKeys.map((key) => setLabels.get(key) ?? key);

  if (labels.length === 1) {
    return `${labels[0]} Build`;
  }

  return `${labels.join(" + ")}.`;
}

function formatDescription(
  input: EchoPresetInput,
  totals: {
    critRate: number;
    critDmg: number;
    mainPercent: number;
    attackPercent: number;
    mainFlat: number;
    energyRegen: number;
  },
  setLabels: Map<string, string>,
  threeCostLabel: string | null,
): string {
  const main = MAIN_STAT_MAP[input.mainStatFocus];
  const attackLabel = getAttackLabel(input.attackType);
  const setPart = formatSetNames(input.setKeys, setLabels);

  let header = `${input.setStyle}`;
  if (input.setStyle === "43311" && input.fourCostMains.length === 1) {
    const main = input.fourCostMains[0]!;
    const label =
      main === "CritRate" ? "CR" : main === "CritDMG" ? "CD" : main;
    header += ` ${label}`;
  }

  if (input.threeCostMainCount === 2 && threeCostLabel) {
    header += ` / 2x ${threeCostLabel}`;
  } else if (
    input.threeCostMainCount === 1 &&
    input.threeCostMain === "EnergyRegen"
  ) {
    header += " 2x ER";
  }

  header += ` ${setPart}`;

  const mainLabel =
    input.mainStatFocus === "atk"
      ? "ATK"
      : input.mainStatFocus === "hp"
        ? "HP"
        : "DEF";
  const flatLabel =
    input.mainStatFocus === "atk"
      ? "ATK"
      : input.mainStatFocus === "hp"
        ? "HP"
        : "DEF";

  const statParts = [
    `${roundStat(totals.critRate)}% CR`,
    `${roundStat(totals.critDmg)}% CD`,
    `${roundStat(totals.mainPercent)}% ${mainLabel}`,
  ];

  if (attackLabel) {
    statParts.push(`${roundStat(totals.attackPercent)}% ${attackLabel}`);
  }

  statParts.push(`${roundStat(totals.mainFlat)} ${flatLabel}`);
  statParts.push(`${roundStat(totals.energyRegen)}% ER`);

  return `${header} ${statParts.join(", ")}`;
}

function roundStat(value: number): number {
  return Math.round(value * 10) / 10;
}

function sumSubstats(
  echoes: Record<string, EchoSlotData>,
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const echo of Object.values(echoes)) {
    for (let index = 1; index <= 5; index += 1) {
      const type = echo[`echoSubStatsType${index}` as keyof EchoSlotData];
      const value = echo[`echoSubStatsValue${index}` as keyof EchoSlotData];
      if (typeof type === "string" && typeof value === "number") {
        totals[type] = (totals[type] ?? 0) + value;
      }
    }
  }

  return totals;
}

export function buildEchoPreset(
  input: EchoPresetInput,
  candidates: EchoCandidate[],
  setLabels: Map<string, string>,
): GeneratedEchoPreset {
  const costs = SET_STYLE_COSTS[input.setStyle];
  const assignedSets = assignSetKeys(input);
  const usedEchoKeys = new Set<string>();
  const echoes: Record<string, EchoSlotData> = {};
  const threeCostMain = resolveThreeCostMainStat(input);
  const threeCostMainKey = resolveThreeCostMainKey(input);
  const main = MAIN_STAT_MAP[input.mainStatFocus];
  const erRolls = calculateErRolls(input.targetEr);
  const declaredSubstats = getDeclaredSubstats(input);

  const fillerSlotIndexes =
    input.setStyle === "43311" ? [2, 3, 4] : [2, 3, 4];
  const erDistribution = distributeErRolls(erRolls, fillerSlotIndexes);

  for (let slot = 0; slot < 5; slot += 1) {
    const cost = costs[slot]!;
    const setKey = assignedSets[slot]!;
    const echoKey = pickEcho(candidates, cost, setKey, usedEchoKeys);

    if (input.setStyle === "44111") {
      if (slot <= 1) {
        const substats = buildPrimarySubstats44111({
          mainStat: input.mainStatFocus,
          attackType: input.attackType,
          cost,
          flatBeforeAttack: slot === 1,
        });
        echoes[String(slot)] = toSlotData(
          cost,
          echoKey,
          setKey,
          input.fourCostMains[slot] ?? "CritRate",
          substats,
          declaredSubstats,
        );
        continue;
      }

      const isLast = slot === 4;
      const substats = buildFillerSubstats({
        erRolls: erDistribution.get(slot) ?? 0,
        isLastSlot: isLast,
        excludedStats: declaredSubstats,
      });
      echoes[String(slot)] = toSlotData(
        cost,
        echoKey,
        setKey,
        main.percent,
        substats,
        declaredSubstats,
      );
      continue;
    }

    if (slot === 0) {
      const substats =
        input.threeCostMainCount === 2 && threeCostMain === "ATK"
          ? [
              { type: "CritRate", value: SUBSTAT_VALUES.critRate },
              { type: "CritDMG", value: SUBSTAT_VALUES.critDmg },
              { type: main.percent, value: SUBSTAT_VALUES.mainPercent },
              {
                type: main.flat,
                value: main.flat4Cost,
              },
              {
                type: "EnergyRegen",
                value: SUBSTAT_VALUES.energyRegen,
              },
            ]
          : buildPrimarySubstats43311({
              mainStat: input.mainStatFocus,
              attackType: input.attackType,
              includeFlat: true,
              cost,
            });

      echoes[String(slot)] = toSlotData(
        cost,
        echoKey,
        setKey,
        input.fourCostMains[0] ?? "CritRate",
        substats,
        declaredSubstats,
      );
      continue;
    }

    if (slot === 1) {
      const isPrimary =
        input.threeCostMainCount > 0 ||
        threeCostMainKey === "ATK" ||
        threeCostMainKey === "EnergyRegen";

      if (isPrimary) {
        const primaryMain = threeCostMainKey ?? main.percent;
        const substats =
          input.threeCostMainCount === 2 && threeCostMain === "ATK"
            ? [
                { type: "CritRate", value: SUBSTAT_VALUES.critRate },
                { type: "CritDMG", value: SUBSTAT_VALUES.critDmg },
                { type: main.percent, value: SUBSTAT_VALUES.mainPercent },
                {
                  type: main.flat,
                  value: main.flatFiller,
                },
                {
                  type: "EnergyRegen",
                  value: SUBSTAT_VALUES.energyRegen,
                },
              ]
            : buildPrimarySubstats43311({
                mainStat: input.mainStatFocus,
                attackType: input.attackType,
                includeFlat: true,
                cost,
              });

        echoes[String(slot)] = toSlotData(
          cost,
          echoKey,
          setKey,
          primaryMain,
          substats,
          declaredSubstats,
        );
        continue;
      }

      const fillerMain = threeCostMainKey ?? input.characterElement;
      const substats = buildFillerSubstats({
        erRolls: erDistribution.get(slot) ?? 0,
        isLastSlot: false,
        excludedStats: declaredSubstats,
      });
      echoes[String(slot)] = toSlotData(
        cost,
        echoKey,
        setKey,
        fillerMain,
        substats,
        declaredSubstats,
      );
      continue;
    }

    if (
      slot === 2 &&
      input.threeCostMainCount === 2 &&
      threeCostMain === "ATK" &&
      threeCostMainKey
    ) {
      const substats = buildTwoAtkSubstats({
        attackType: input.attackType,
        erRolls: erDistribution.get(slot) ?? 0,
        excludedStats: declaredSubstats,
      });
      echoes[String(slot)] = toSlotData(
        cost,
        echoKey,
        setKey,
        threeCostMainKey,
        substats,
        declaredSubstats,
      );
      continue;
    }

    if (
      slot === 2 &&
      input.threeCostMainCount === 2 &&
      threeCostMain === "element" &&
      threeCostMainKey
    ) {
      const substats = buildFillerSubstats({
        erRolls: erDistribution.get(slot) ?? 0,
        isLastSlot: false,
        excludedStats: declaredSubstats,
      });
      echoes[String(slot)] = toSlotData(
        cost,
        echoKey,
        setKey,
        threeCostMainKey,
        substats,
        declaredSubstats,
      );
      continue;
    }

    const fillerMain =
      cost === 1
        ? main.percent
        : threeCostMainKey ?? input.characterElement;
    const substats = buildFillerSubstats({
      erRolls: erDistribution.get(slot) ?? 0,
      isLastSlot: slot === 4,
      excludedStats: declaredSubstats,
    });
    echoes[String(slot)] = toSlotData(
      cost,
      echoKey,
      setKey,
      fillerMain,
      substats,
      declaredSubstats,
    );
  }

  const totals = sumSubstats(echoes);
  const threeCostLabel = getThreeCostDescriptionLabel(input);
  const description = formatDescription(
    input,
    {
      critRate: totals.CritRate ?? 0,
      critDmg: totals.CritDMG ?? 0,
      mainPercent: totals[main.percent] ?? 0,
      attackPercent:
        input.attackType === "none"
          ? 0
          : (totals[ATTACK_TYPE_MAP[input.attackType]] ?? 0),
      mainFlat: totals[main.flat] ?? 0,
      energyRegen: totals.EnergyRegen ?? 0,
    },
    setLabels,
    threeCostLabel,
  );

  return {
    name: input.presetName,
    description,
    author: input.author,
    data: { echoes },
  };
}

export function formatPresetEntry(preset: GeneratedEchoPreset): string {
  const dataJson = JSON.stringify(preset.data);
  return `    {
        name: \`${preset.name}\`,
        description: \`${preset.description}\`,
        author: \`${preset.author}\`,
        data: ${dataJson}
    }`;
}

export function appendEchoPreset(
  presetsFilePath: string,
  preset: GeneratedEchoPreset,
): void {
  const content = fs.readFileSync(presetsFilePath, "utf8");
  const match = content.match(/export const echoes\s*=\s*\[([\s\S]*?)\];/);

  if (!match || match.index === undefined) {
    throw new Error(`Could not find echoes export in ${presetsFilePath}`);
  }

  const body = match[1]!;
  const entry = formatPresetEntry(preset);
  const trimmedBody = body.trim();
  const nextBody = trimmedBody
    ? `${body.replace(/\s*$/, "")},\n${entry}\n`
    : `\n${entry}\n`;

  const updated = `${content.slice(0, match.index)}export const echoes = [${nextBody}];${content.slice(match.index + match[0].length)}`;
  fs.writeFileSync(presetsFilePath, updated);
}
