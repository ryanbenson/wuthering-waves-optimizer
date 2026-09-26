/**
 * Shared mapping from OCR'd/parsed echo text to the inventory echo shape
 * (EchoObject-compatible). Extracted from CalculatorEchoImporter.vue so the
 * Discord-bot image importer (CalculatorEchoParser.vue) and the screen/video
 * scanner (src/scanner/) feed the exact same mapping logic — one place to
 * fix a parsing bug, both flows benefit.
 */
import { verboseStatLabelMap } from "./stats";
import { randomString } from "../utils/strings";

export type ParsedSubstat = { subStat?: string; subStatValue?: string };

export type ParsedEcho = {
  substats: ParsedSubstat[];
  cost?: unknown;
  rank?: number;
  mainStatLabel?: string;
  echo?: string | null;
  set?: string | null;
};

export type MappedEcho = {
  echo: string | null;
  type: number | null;
  rank: number;
  stat: string | null;
  echoId: string | null;
  echoSet: string | null | undefined;
  echoSubStatsType1: string | null;
  echoSubStatsValue1: number | null;
  echoSubStatsType2: string | null;
  echoSubStatsValue2: number | null;
  echoSubStatsType3: string | null;
  echoSubStatsValue3: number | null;
  echoSubStatsType4: string | null;
  echoSubStatsValue4: number | null;
  echoSubStatsType5: string | null;
  echoSubStatsValue5: number | null;
};

/** `undefined`/`null` value strings (e.g. an unpopulated substat row) map to `null`, not `NaN`. */
export function getSubstatValue(subStatValue: string | undefined): number | null {
  if (!subStatValue) {
    return null;
  }
  const valueWithoutPercent = subStatValue.replace("%", "");
  return Number(valueWithoutPercent);
}

/**
 * Maps a raw OCR'd substat label to its internal stat key. ATK/DEF/HP are
 * ambiguous between their flat and percent variants until the OCR'd value
 * is inspected for a "%" — WuWa echoes can and do carry both a flat and a
 * percent roll of the same base stat on one echo (confirmed in real
 * footage: an echo with both "ATK 7.9%" and "ATK 50" as separate substats).
 */
export function getSubstatType(subStatData: ParsedSubstat | undefined): string | null {
  const type = subStatData?.subStat;
  const value = subStatData?.subStatValue;
  if (!type || !value) {
    return null;
  }
  if (type === "DEF Y") {
    return "DEF";
  }
  if (["ATK", "DEF", "HP"].includes(type)) {
    if (value.includes("%")) {
      return type;
    }
    return `${type}_FLAT`;
  }
  return verboseStatLabelMap[type as keyof typeof verboseStatLabelMap] ?? null;
}

export function mapParsedEchoes(
  echoData: ParsedEcho[],
  isSavingToInventory: boolean,
): MappedEcho[] {
  return echoData.map((echo) => {
    const echoSubStatsType1 = getSubstatType(echo.substats[0]);
    const echoSubStatsValue1 = getSubstatValue(echo.substats[0]?.subStatValue);
    const echoSubStatsType2 = getSubstatType(echo.substats[1]);
    const echoSubStatsValue2 = getSubstatValue(echo.substats[1]?.subStatValue);
    const echoSubStatsType3 = getSubstatType(echo.substats[2]);
    const echoSubStatsValue3 = getSubstatValue(echo.substats[2]?.subStatValue);
    const echoSubStatsType4 = getSubstatType(echo.substats[3]);
    const echoSubStatsValue4 = getSubstatValue(echo.substats[3]?.subStatValue);
    const echoSubStatsType5 = getSubstatType(echo.substats[4]);
    const echoSubStatsValue5 = getSubstatValue(echo.substats[4]?.subStatValue);
    let echoId: string | null = null;
    if (isSavingToInventory) {
      echoId = randomString();
    }
    return {
      echo: echo.echo ?? null,
      type: Number(echo.cost) || null,
      rank: echo.rank ?? 5,
      stat: echo.mainStatLabel
        ? (verboseStatLabelMap[echo.mainStatLabel as keyof typeof verboseStatLabelMap] ??
          null)
        : null,
      echoId,
      echoSet: echo.set,
      echoSubStatsType1,
      echoSubStatsValue1,
      echoSubStatsType2,
      echoSubStatsValue2,
      echoSubStatsType3,
      echoSubStatsValue3,
      echoSubStatsType4,
      echoSubStatsValue4,
      echoSubStatsType5,
      echoSubStatsValue5,
    };
  });
}
