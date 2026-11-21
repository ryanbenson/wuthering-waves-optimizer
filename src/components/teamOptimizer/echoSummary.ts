/**
 * One echo in a line or two of text, for comparing a team optimizer result
 * with the current build (#737). Pure: game data lookups only.
 */
import { getEchoData } from "../../echoes/index";
import { getSetBonusEffects, getSetsFromEchoes } from "../../echoes/sets";
import {
  getEchoSetLabelByType,
  getReadableSubStatLabel,
} from "../../echoes/stats";

export interface EchoSummary {
  name: string;
  /** "4-cost · Moonlit Clouds · Crit. DMG" */
  meta: string;
  /** "Crit. Rate 8.1% · ATK 50", empty when it has no substats. */
  substats: string;
}

function statLabel(key: string | undefined): string {
  if (!key || key === "none") return "";
  return getReadableSubStatLabel(key) ?? key;
}

function statValue(key: string, value: unknown): string {
  return key.includes("FLAT") ? String(value) : `${value}%`;
}

export function summarizeEcho(
  echo: Record<string, any> | null | undefined,
): EchoSummary {
  const name = getEchoData(echo?.echo)?.name ?? echo?.echo ?? "Unknown echo";
  const meta = [
    echo?.type ? `${echo.type}-cost` : "",
    echo?.echoSet ? (getEchoSetLabelByType(echo.echoSet) ?? echo.echoSet) : "",
    statLabel(echo?.stat),
  ]
    .filter(Boolean)
    .join(" · ");
  const substats: string[] = [];
  for (let index = 1; index <= 5; index++) {
    const type = echo?.[`echoSubStatsType${index}`];
    const value = echo?.[`echoSubStatsValue${index}`];
    if (!type || type === "none" || !value) continue;
    substats.push(`${statLabel(type)} ${statValue(type, value)}`);
  }
  return { name, meta, substats: substats.join(" · ") };
}

export interface SetBonusSummary {
  /** "Trailblazing Star 5 Set" */
  label: string;
  /** The set's key, for its icon. */
  setKey: string;
}

/** The set bonuses a loadout activates, largest first. */
export function summarizeSetBonuses(
  loadout: any[] | null | undefined,
): SetBonusSummary[] {
  if (!loadout?.length) return [];
  const bonuses = getSetBonusEffects(getSetsFromEchoes(loadout as any));
  const labels = [
    bonuses.setBonusTwo,
    bonuses.setBonusOne,
    bonuses.setBonusOnePiece,
  ].filter((label): label is string => Boolean(label));
  const setKeys = [
    ...new Set(loadout.map((echo) => echo?.echoSet).filter(Boolean)),
  ] as string[];
  return labels.map((label) => ({
    label,
    setKey:
      setKeys.find((key) =>
        label.startsWith(`${getEchoSetLabelByType(key) ?? key} `),
      ) ?? "",
  }));
}
