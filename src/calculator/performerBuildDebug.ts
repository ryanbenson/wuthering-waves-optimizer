import type { EchoObject } from "../echoes/stats";
import {
  echoSlotHasInlineBuildData,
  getEchoSlotsFromCharacterStore,
} from "./rotationPerformer";

export type WeaponStatsSnapshot = {
  attack: number;
  modifier: string | null;
  modifierValue: number;
  weaponPassiveStats: Record<string, unknown>;
};

export type PerformerBuildDebug = {
  performerCharacterKey: string;
  echoStatsSource: "computed";
  weaponStatsSource: "computed";
  resolvedEchoSlotCount: number;
  inventoryEchoLookups: number;
  totalAtk: number;
  totalCritRate: number;
  totalCritDMG: number;
  havocBonus: number;
  echoStatsATK: number;
  echoStatsATKFlat: number;
  weaponBaseAtk: number;
  weaponPassiveATK: number;
  selfBuffATK: number;
  resonanceChainATK: number;
  teamBuffATK: number;
  weaponAllElementBonus: number;
  teamBuffsEmpty: boolean;
};

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function buildPerformerBuildDebug(args: {
  performerCharacterKey: string;
  echoStatsSource: "computed";
  weaponStatsSource: "computed";
  resolvedEchoSlotCount: number;
  inventoryEchoLookups: number;
  finalStats: Record<string, unknown>;
  echoStats: Record<string, unknown>;
  weaponData: WeaponStatsSnapshot;
  selfBuffsData: Record<string, unknown>;
  resonanceChainsBuffsData: Record<string, unknown>;
  teamBuffsData: Record<string, unknown>;
}): PerformerBuildDebug {
  const weaponPassiveStats = args.weaponData.weaponPassiveStats ?? {};
  return {
    performerCharacterKey: args.performerCharacterKey,
    echoStatsSource: args.echoStatsSource,
    weaponStatsSource: args.weaponStatsSource,
    resolvedEchoSlotCount: args.resolvedEchoSlotCount,
    inventoryEchoLookups: args.inventoryEchoLookups,
    totalAtk: readNumber(args.finalStats.totalAtk),
    totalCritRate: readNumber(args.finalStats.totalCritRate),
    totalCritDMG: readNumber(args.finalStats.totalCritDMG),
    havocBonus: readNumber(args.finalStats.havoc),
    echoStatsATK: readNumber(args.echoStats.ATK),
    echoStatsATKFlat: readNumber(args.echoStats.ATK_FLAT),
    weaponBaseAtk: args.weaponData.attack,
    weaponPassiveATK: readNumber(weaponPassiveStats.ATK) * 100,
    selfBuffATK: readNumber(args.selfBuffsData.ATK) * 100,
    resonanceChainATK: readNumber(args.resonanceChainsBuffsData.ATK) * 100,
    teamBuffATK: readNumber(args.teamBuffsData.ATK) * 100,
    weaponAllElementBonus:
      readNumber(weaponPassiveStats.AllElementAttributeBonus) * 100,
    teamBuffsEmpty: Object.keys(args.teamBuffsData).length === 0,
  };
}

export function countResolvedEchoSlots(
  charStore: Record<string, unknown>,
  getEchoById?: (echoId: string) => EchoObject | undefined,
): { resolvedEchoSlotCount: number; inventoryEchoLookups: number } {
  const slots = getEchoSlotsFromCharacterStore(charStore);
  let resolvedEchoSlotCount = 0;
  let inventoryEchoLookups = 0;
  for (const slot of slots) {
    if (slot.echoId && getEchoById?.(String(slot.echoId))) {
      inventoryEchoLookups += 1;
      resolvedEchoSlotCount += 1;
      continue;
    }
    if (echoSlotHasInlineBuildData(slot)) {
      resolvedEchoSlotCount += 1;
    }
  }
  return { resolvedEchoSlotCount, inventoryEchoLookups };
}
