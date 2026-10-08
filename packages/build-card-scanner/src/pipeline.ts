import { buildCardRegions } from "./layout.js";
import { parseCostText, parseSubstatLine } from "./parse.js";
import type {
  BuildCardAdapters,
  BuildCardEchoSlot,
  BuildCardGameData,
  EchoSlotRegions,
  ParsedSubstat,
} from "./types.js";

/** Echoes that can roll `set`, narrowed to `cost` when it's known. */
export function echoCandidates(
  data: BuildCardGameData,
  set: string,
  cost: number | null,
): string[] {
  let keys = Object.values(data.echoes)
    .filter((echo) => echo.sets?.includes(set))
    .map((echo) => echo.key);
  if (cost) {
    keys = keys.filter((key) => data.echoCostByClass[data.echoes[key].class] === cost);
  }
  return keys;
}

/**
 * Reads one echo slot.
 *
 * Text first (cost, main stat, substats), then images. The set icon is matched against
 * every set first, because a confident set narrows the echo portrait match to a handful of
 * candidates. If no set matches, the portrait is matched against every echo instead, and
 * the set is taken from that echo (or matched among its sets when it has several).
 */
export async function parseEchoSlot(
  regions: EchoSlotRegions,
  adapters: BuildCardAdapters,
  data: BuildCardGameData,
): Promise<BuildCardEchoSlot> {
  let cost = parseCostText(await adapters.readText(regions.cost));
  const mainStatLabel = await adapters.readText(regions.mainStatLabel);

  const substats: ParsedSubstat[] = [];
  for (const region of regions.substats) {
    const substat = parseSubstatLine(await adapters.readText(region));
    if (substat) substats.push(substat);
  }

  const costOf = (echoKey: string) => data.echoCostByClass[data.echoes[echoKey]?.class];

  let set = await adapters.matchSet(regions.set, null);
  let echo: string | null;

  if (set) {
    echo = await adapters.matchEcho(regions.echoImage, echoCandidates(data, set, cost));
    if (echo && !cost) cost = costOf(echo) ?? null;
  } else {
    echo = await adapters.matchEcho(regions.echoImage, null);
    if (echo) {
      if (!cost) cost = costOf(echo) ?? null;
      const echoSets = data.echoes[echo]?.sets ?? [];
      set = echoSets.length === 1 ? echoSets[0] : await adapters.matchSet(regions.set, echoSets);
    }
  }

  return { cost, mainStatLabel: mainStatLabel.trim(), substats, echo, set };
}

/**
 * Reads all five echo slots off a build card, left to right.
 *
 * The caller must have checked the image is 1920×1080 (`isBuildCardSize`); regions are
 * fixed pixel positions.
 */
export async function parseBuildCard(
  adapters: BuildCardAdapters,
  data: BuildCardGameData,
): Promise<BuildCardEchoSlot[]> {
  const results: BuildCardEchoSlot[] = [];
  for (const regions of buildCardRegions()) {
    results.push(await parseEchoSlot(regions, adapters, data));
  }
  return results;
}
