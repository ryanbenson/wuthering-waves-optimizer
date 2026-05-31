import type { EchoObject } from "../echoes/stats";

export type CachedWeaponStats = {
  attack: number;
  modifier: string | null;
  modifierValue: number;
  weaponPassiveStats: Record<string, unknown>;
};

export type PerformerBuildDebug = {
  performerCharacterKey: string;
  echoStatsSource: "cached" | "computed";
  weaponStatsSource: "cached" | "computed";
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

export function readCachedEchoStats(
  charStore: Record<string, unknown>,
): Record<string, number> | null {
  const cached = charStore.cachedEchoStats as Record<string, unknown> | undefined;
  if (!cached || typeof cached !== "object") {
    return null;
  }
  const stats: Record<string, number> = {};
  Object.entries(cached).forEach(([key, value]) => {
    if (key === "specificTalentBuffs" || key === "modifySpecificTalents") {
      return;
    }
    if (typeof value === "number") {
      stats[key] = value;
    }
  });
  return Object.keys(stats).length > 0 ? stats : null;
}

export function readCachedWeaponStats(
  charStore: Record<string, unknown>,
): CachedWeaponStats | null {
  const cached = charStore.cachedWeaponStats as CachedWeaponStats | undefined;
  if (!cached || typeof cached !== "object") {
    return null;
  }
  if (typeof cached.attack !== "number") {
    return null;
  }
  return {
    attack: cached.attack,
    modifier: cached.modifier ?? null,
    modifierValue: readNumber(cached.modifierValue),
    weaponPassiveStats: (cached.weaponPassiveStats ?? {}) as Record<
      string,
      unknown
    >,
  };
}

export function buildPerformerBuildDebug(args: {
  performerCharacterKey: string;
  echoStatsSource: "cached" | "computed";
  weaponStatsSource: "cached" | "computed";
  resolvedEchoSlotCount: number;
  inventoryEchoLookups: number;
  finalStats: Record<string, unknown>;
  echoStats: Record<string, unknown>;
  weaponData: CachedWeaponStats;
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

export type EchoSlotRow = Record<string, unknown> & { echoId?: string | null };

export function countResolvedEchoSlots(
  charStore: Record<string, unknown>,
  getEchoById?: (echoId: string) => EchoObject | undefined,
): { resolvedEchoSlotCount: number; inventoryEchoLookups: number } {
  const raw = charStore.echoes;
  let slots: EchoSlotRow[] = [];
  if (Array.isArray(raw)) {
    slots = raw as EchoSlotRow[];
  } else if (raw && typeof raw === "object") {
    const record = raw as Record<string, EchoSlotRow>;
    for (let i = 0; i < 5; i++) {
      const slot = record[i] ?? record[String(i)];
      if (slot) {
        slots.push(slot);
      }
    }
  }
  let resolvedEchoSlotCount = 0;
  let inventoryEchoLookups = 0;
  for (const slot of slots) {
    if (slot.echoId && getEchoById?.(String(slot.echoId))) {
      inventoryEchoLookups += 1;
      resolvedEchoSlotCount += 1;
      continue;
    }
    if (slot.echo && slot.stat && slot.type && slot.rank) {
      resolvedEchoSlotCount += 1;
    }
  }
  return { resolvedEchoSlotCount, inventoryEchoLookups };
}
