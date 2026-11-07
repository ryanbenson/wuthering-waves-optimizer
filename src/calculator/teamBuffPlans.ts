/**
 * Team buff plans (ADR 0053): who on the team provides which echo set or main
 * echo buff, and what that does to everyone's saved team buff toggles.
 *
 * Teammates only affect each other's damage through what they provide. So once
 * a plan fixes that, each character's search is independent again, and the best
 * team for the plan is still found by the normal per-character searches and
 * `combineTeamLoadouts`. Comparing plans covers the trade-off a single search
 * can't see: a support giving up personal damage for a bigger buff.
 *
 * Pure: no Vue, no stores.
 */
import { allEchoBuffs, buffsByCharacter } from "../buffs/index";
import type { TeamBuffDef } from "../buffs/teamBuffs";
import { mainEchoesData } from "../echoes/index";
import { setBonusEffectsOne, setBonusEffectsTwo } from "../echoes/sets";
import { echoSetLabelMap } from "../echoes/stats";
import { filterEchoesForOptimizer } from "./optimizer";

/** Plans within this share of the best estimate get a full search. */
export const BUFF_PLAN_SHORTLIST_MARGIN = 0.03;
/** At least this many plans get a full search, however far apart their estimates are. */
export const BUFF_PLAN_SHORTLIST_MIN = 3;
/** Past this many plans, the rest aren't compared and a result can't be called proven. */
export const MAX_BUFF_PLANS = 1000;

export type TeamBuffReach = "next" | "team";

interface TeamBuffSourceRule {
  /** Whether the buff reaches only the incoming Resonator, or the whole team. */
  reach: TeamBuffReach;
  /**
   * What has to be true beyond wearing it, in words for the setup screen. The
   * calculator can't check these, so the player opts in unless they've already
   * enabled the buff on a teammate.
   */
  condition?: string;
  /** Works by default only for a wearer whose kit heals. */
  needsHealer?: boolean;
}

/**
 * Reviewed by hand against each buff's in-game text. A buff that isn't listed
 * is still offered, but never ticked by default (see `isPreselected`).
 */
const TEAM_BUFF_SOURCE_RULES: Record<string, TeamBuffSourceRule> = {
  ImpermanenceHeron: { reach: "next" },
  BellBorneGeochelone: { reach: "team", condition: "Only while the shield holds" },
  FallacyOfNoReturn: { reach: "team" },
  Hyvatia: { reach: "next" },
  Glommoth: { reach: "next" },
  VoidwingMoth: { reach: "next" },
  ReminiscenceDenia: { reach: "next" },
  Soulfrayer: { reach: "next" },
  RejuvenatingGlow: { reach: "team", needsHealer: true },
  MoonlitClouds: { reach: "next" },
  MidnightVeil: { reach: "next" },
  EmpyreanAnthem: { reach: "team", condition: "Needs the wearer's Coordinated Attacks to crit" },
  GustsofWelkin: { reach: "team", condition: "Needs Aero Erosion on the enemy" },
  FlamingClawprint: { reach: "team" },
  LawofHarmony: { reach: "team", condition: "Stacks from casting different Echo Skills" },
  PactofNeonlightLeap: { reach: "next", condition: "Scales with the wearer's Tune Break Boost" },
  HaloofStarryRadiance: { reach: "team", condition: "Needs healing, and scales with Off-Tune Buildup Rate" },
  ChromaticFoam: { reach: "next", condition: "Needs the wearer to inflict Fusion Burst" },
  WishesofQuietSnowfall: { reach: "next", condition: "Needs Snowfall active when the Outro is cast" },
  ReelofSplicedMemories: { reach: "team", condition: "Needs Tune Rupture or Tune Strain - Shifting" },
  SongofFeatheredTrace: { reach: "team", condition: "Needs Glacio Chafe, and scales with the wearer's Energy Regen" },
  FlashofElectricReflection: { reach: "next", condition: "Needs the wearer to inflict Electro Flare" },
  FlowerofTingedYearning: { reach: "team", needsHealer: true },
  FlowerofTingedYearningUnison: { reach: "team", condition: "Needs Unison" },
};

export type TeamBuffSource =
  | { kind: "set"; defKey: string; setKey: string }
  | { kind: "main"; defKey: string; echoKey: string };

/** What in a loadout provides this team buff, or null if it isn't an echo buff. */
export function teamBuffSource(defKey: string): TeamBuffSource | null {
  if ((mainEchoesData as Record<string, unknown>)[defKey]) {
    return { kind: "main", defKey, echoKey: defKey };
  }
  // Variants like FlowerofTingedYearningUnison share their set's key as a prefix.
  const setKey = Object.keys(echoSetLabelMap).find((set) => defKey === set || defKey.startsWith(set));
  return setKey ? { kind: "set", defKey, setKey } : null;
}

const SOURCED_DEFS = (allEchoBuffs as TeamBuffDef[]).filter((def) => teamBuffSource(def.key));

/** The bonus that provides a set's team buff, and how many pieces it takes. */
export function teamBuffSetBonus(setKey: string): { label: string; pieces: number } | null {
  const label = echoSetLabelMap[setKey];
  if (!label) return null;
  const all = { ...setBonusEffectsOne, ...setBonusEffectsTwo } as Record<string, unknown>;
  if (all[`${label} 5 Set`]) return { label: `${label} 5 Set`, pieces: 5 };
  if (all[`${label} 3 Set`]) return { label: `${label} 3 Set`, pieces: 3 };
  return null;
}

export function characterCanHeal(character: Record<string, any> | null | undefined): boolean {
  return Object.values(character ?? {}).some(
    (value) => Array.isArray(value) && value.some((attack) => attack?.type === "Healing"),
  );
}

// --- Offers: what a character could provide ------------------------------

export interface TeamBuffOffer {
  defKey: string;
  source: TeamBuffSource;
  reach: TeamBuffReach;
  condition: string | null;
  hasStacks: boolean;
  isPreselected: boolean;
}

/** Enough different echoes to activate it, which is all the generator will wear. */
function canProvide(source: TeamBuffSource, usableEchoes: any[]): boolean {
  if (source.kind === "main") return usableEchoes.some((echo) => echo.echo === source.echoKey);
  const bonus = teamBuffSetBonus(source.setKey);
  if (!bonus) return false;
  const distinct = new Set(usableEchoes.filter((echo) => echo.echoSet === source.setKey).map((echo) => echo.echo));
  return distinct.size >= bonus.pieces;
}

/**
 * Ticked by default only when the calculator can assume it works: the player
 * already enabled it on a teammate, or it has no condition the calculator can't
 * check. A buff that scales or has conditions stays an explicit choice, because
 * crediting it wrongly would make a worse team look better.
 */
function isPreselected(input: {
  rule: TeamBuffSourceRule | undefined;
  hasStacks: boolean;
  isEnabledOnTeammate: boolean;
  canHeal: boolean;
}): boolean {
  const { rule, hasStacks, isEnabledOnTeammate, canHeal } = input;
  if (isEnabledOnTeammate) return true;
  if (!rule || hasStacks || rule.condition) return false;
  return rule.needsHealer ? canHeal : true;
}

export function listTeamBuffOffers(input: {
  usableEchoes: any[];
  /** Saved `teamBuffs.buffs` of each teammate. */
  teammateBuffConfigs: Array<Record<string, { isEnabled?: boolean }> | undefined>;
  canHeal: boolean;
}): TeamBuffOffer[] {
  const usable = filterEchoesForOptimizer(input.usableEchoes) as any[];
  const offers: TeamBuffOffer[] = [];
  for (const def of SOURCED_DEFS) {
    const source = teamBuffSource(def.key)!;
    if (!canProvide(source, usable)) continue;
    const rule = TEAM_BUFF_SOURCE_RULES[def.key];
    const hasStacks = Boolean(def.hasStacks);
    offers.push({
      defKey: def.key,
      source,
      reach: rule?.reach ?? "team",
      condition: rule?.condition ?? (rule?.needsHealer ? "Needs the wearer to heal" : null),
      hasStacks,
      isPreselected: isPreselected({
        rule,
        hasStacks,
        isEnabledOnTeammate: input.teammateBuffConfigs.some((config) => config?.[def.key]?.isEnabled),
        canHeal: input.canHeal,
      }),
    });
  }
  return offers;
}

// --- Options: one way a character can be built within a plan ---------------

export interface TeamBuffOption {
  id: string;
  /** Team buffs this option provides. */
  provides: string[];
  sets: string[];
  mainEchoes: string[];
  requiredSetBonusLabels: string[];
  requiredMainEcho: string | null;
}

/** The main echoes worth trying from a pool, when no particular one is required. */
function poolMainEchoes(pool: any[], excluded: ReadonlySet<string>, preferred: string[]): string[] {
  const inPool = (cost: number) =>
    [...new Set(pool.filter((echo) => echo.type === cost).map((echo) => echo.echo))].filter((key) => !excluded.has(key));
  const mains = new Set([...preferred.filter((key) => pool.some((echo) => echo.echo === key)), ...inPool(4)]);
  return mains.size ? [...mains] : inPool(3);
}

/**
 * Every way this character can provide (or not provide) the ticked buffs.
 * A set that provides a buff has to be worn in full, so it's searched alone, and
 * it can only take a main echo buff if a copy of that main echo is in the set.
 */
export function buildTeamBuffOptions(input: {
  choiceSets: string[];
  choiceMainEchoes: string[];
  offers: TeamBuffOffer[];
  usableEchoes: any[];
}): TeamBuffOption[] {
  const { choiceSets, choiceMainEchoes, offers } = input;
  const usable = filterEchoesForOptimizer(input.usableEchoes) as any[];
  const defsBySet = new Map<string, string[]>();
  const offeredMains: string[] = [];
  for (const offer of offers) {
    if (offer.source.kind === "set") {
      defsBySet.set(offer.source.setKey, [...(defsBySet.get(offer.source.setKey) ?? []), offer.defKey]);
    } else {
      offeredMains.push(offer.source.echoKey);
    }
  }
  const mainsNotProvided = new Set(offeredMains);
  const plainSets = choiceSets.filter((set) => !defsBySet.has(set));
  const options: TeamBuffOption[] = [];

  const addOption = (option: Omit<TeamBuffOption, "id">) => {
    if (!option.mainEchoes.length) return;
    const id = JSON.stringify([option.provides, option.sets, option.mainEchoes]);
    options.push({ ...option, id });
  };

  // No set buff: the player's own sets, without the ones that would provide one.
  if (plainSets.length) {
    const pool = usable.filter((echo) => plainSets.includes(echo.echoSet));
    if (pool.length) {
      addOption({
        provides: [],
        sets: plainSets,
        mainEchoes: choiceMainEchoes.filter((key) => !mainsNotProvided.has(key)),
        requiredSetBonusLabels: [],
        requiredMainEcho: null,
      });
      for (const main of offeredMains) {
        addOption({
          provides: [main],
          sets: plainSets,
          mainEchoes: [main],
          requiredSetBonusLabels: [],
          requiredMainEcho: main,
        });
      }
    }
  }

  for (const [setKey, defKeys] of defsBySet) {
    const bonus = teamBuffSetBonus(setKey);
    if (!bonus) continue;
    const pool = usable.filter((echo) => echo.echoSet === setKey);
    // A full 5-piece set leaves no room for others; a 3-piece can mix with the player's sets.
    const sets = bonus.pieces === 5 ? [setKey] : [setKey, ...plainSets];
    addOption({
      provides: defKeys,
      sets,
      mainEchoes: poolMainEchoes(pool, mainsNotProvided, choiceMainEchoes),
      requiredSetBonusLabels: [bonus.label],
      requiredMainEcho: null,
    });
    for (const main of offeredMains) {
      if (!pool.some((echo) => echo.echo === main)) continue;
      addOption({
        provides: [...defKeys, main],
        sets,
        mainEchoes: [main],
        requiredSetBonusLabels: [bonus.label],
        requiredMainEcho: main,
      });
    }
  }
  return options;
}

// --- Plans ---------------------------------------------------------------

export interface TeamBuffPlanSlot {
  slot: number;
  characterId: string;
  options: TeamBuffOption[];
}

export interface TeamBuffPlan {
  id: string;
  /** Option chosen for each entry of the slots passed in, in order. */
  options: TeamBuffOption[];
}

export function enumerateTeamBuffPlans(
  slots: TeamBuffPlanSlot[],
  limit: number = MAX_BUFF_PLANS,
): { plans: TeamBuffPlan[]; isCapped: boolean } {
  const plans: TeamBuffPlan[] = [];
  let isCapped = false;
  const walk = (index: number, picked: TeamBuffOption[]) => {
    if (isCapped) return;
    if (index === slots.length) {
      if (plans.length >= limit) {
        isCapped = true;
        return;
      }
      plans.push({ id: JSON.stringify(picked.map((option) => option.id)), options: picked });
      return;
    }
    for (const option of slots[index].options) walk(index + 1, [...picked, option]);
  };
  if (slots.length && slots.every((slot) => slot.options.length)) walk(0, []);
  return { plans, isCapped };
}

/**
 * Who a "next Resonator" buff reaches: whoever the rotation most often swaps to
 * from the provider. With no swap to go on, the first teammate with actions.
 */
export function incomingSlot(
  actions: Array<{ slot?: number; order?: number; isDisabled?: boolean }>,
  providerSlot: number,
  occupiedSlots: number[],
): number | null {
  const ordered = actions
    .filter((action) => !action.isDisabled && typeof action.slot === "number")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const swaps = new Map<number, number>();
  for (let index = 1; index < ordered.length; index++) {
    const from = ordered[index - 1].slot!;
    const to = ordered[index].slot!;
    if (from === providerSlot && to !== providerSlot) swaps.set(to, (swaps.get(to) ?? 0) + 1);
  }
  let best: number | null = null;
  for (const [slot, count] of swaps) {
    if (best === null || count > swaps.get(best)!) best = slot;
  }
  if (best !== null) return best;
  const others = occupiedSlots.filter((slot) => slot !== providerSlot);
  return others.find((slot) => ordered.some((action) => action.slot === slot)) ?? others[0] ?? null;
}

export type TeamBuffConfig = Record<string, any>;

export interface TeamBuffProvision {
  slot: number;
  defKey: string;
}

/** Which slots a provision reaches. */
export function provisionReceivers(
  provision: TeamBuffProvision,
  actions: Array<{ slot?: number; order?: number; isDisabled?: boolean }>,
  occupiedSlots: number[],
): number[] {
  const reach = TEAM_BUFF_SOURCE_RULES[provision.defKey]?.reach ?? "team";
  if (reach === "team") return occupiedSlots.filter((slot) => slot !== provision.slot);
  const next = incomingSlot(actions, provision.slot, occupiedSlots);
  return next === null ? [] : [next];
}

/**
 * A receiver's team buff settings under a plan: echo buffs on only if a teammate
 * actually provides them. A team with an empty slot leaves other echo buffs on,
 * since they may stand in for the missing teammate. Everything else (kit and
 * weapon buffs, typed values, stacks already set) stays as the player saved it.
 */
export function applyProvisionsToTeamBuffs(input: {
  teamBuffs: TeamBuffConfig | undefined;
  provided: string[];
  isTeamFull: boolean;
}): TeamBuffConfig {
  const { teamBuffs, provided, isTeamFull } = input;
  const buffs: Record<string, any> = { ...(teamBuffs?.buffs ?? {}) };
  if (isTeamFull) {
    for (const def of SOURCED_DEFS) {
      if (buffs[def.key]?.isEnabled && !provided.includes(def.key)) {
        buffs[def.key] = { ...buffs[def.key], isEnabled: false };
      }
    }
  }
  for (const defKey of provided) {
    const def = SOURCED_DEFS.find((candidate) => candidate.key === defKey);
    const existing = buffs[defKey] ?? {};
    const stacks = existing.stacks || (def as { maxStacks?: number } | undefined)?.maxStacks || 0;
    buffs[defKey] = { ...existing, isEnabled: true, stacks };
  }
  return { ...(teamBuffs ?? {}), buffs };
}

/** Identifies what a receiver's search depends on, so identical searches run once. */
export function teamBuffsSignature(teamBuffs: TeamBuffConfig | undefined): string {
  const buffs = teamBuffs?.buffs ?? {};
  return JSON.stringify(
    SOURCED_DEFS.filter((def) => buffs[def.key]?.isEnabled).map((def) => [def.key, buffs[def.key].stacks ?? 0]),
  );
}

export interface TeamBuffChange {
  characterId: string;
  defKey: string;
  isOn: boolean;
}

/** What a plan changes from a receiver's saved toggles, for the results to spell out. */
export function diffTeamBuffs(
  characterId: string,
  saved: TeamBuffConfig | undefined,
  next: TeamBuffConfig,
): TeamBuffChange[] {
  const changes: TeamBuffChange[] = [];
  for (const def of SOURCED_DEFS) {
    const before = Boolean(saved?.buffs?.[def.key]?.isEnabled);
    const after = Boolean(next.buffs?.[def.key]?.isEnabled);
    if (before !== after) changes.push({ characterId, defKey: def.key, isOn: after });
  }
  return changes;
}

/**
 * Plans worth a full search: anything close to the best estimate, plus a minimum
 * number. An estimate is a real build's real total, but the estimate doesn't
 * re-search anyone for the buffs they'd get, so a close second can still win.
 */
export function shortlistPlans<Plan extends { estimate: number }>(
  plans: Plan[],
  margin: number = BUFF_PLAN_SHORTLIST_MARGIN,
  minimum: number = BUFF_PLAN_SHORTLIST_MIN,
): Plan[] {
  const sorted = [...plans].sort((a, b) => b.estimate - a.estimate);
  if (!sorted.length) return [];
  const cutoff = sorted[0].estimate * (1 - margin);
  return sorted.filter((plan, index) => index < minimum || plan.estimate >= cutoff);
}

/**
 * Keeps the best row of each plan first, so the list shows real alternatives
 * rather than one plan's near-identical builds, then fills up by total.
 */
export function pickVariedResults<Row extends { planId: string; total: number }>(rows: Row[], limit: number): Row[] {
  const sorted = [...rows].sort((a, b) => b.total - a.total);
  const seenPlans = new Set<string>();
  const leaders: Row[] = [];
  const rest: Row[] = [];
  for (const row of sorted) {
    if (seenPlans.has(row.planId)) rest.push(row);
    else {
      seenPlans.add(row.planId);
      leaders.push(row);
    }
  }
  return [...leaders.slice(0, limit), ...rest]
    .slice(0, limit)
    .sort((a, b) => b.total - a.total);
}

/** Team buffs a character has on from someone who isn't on this team. */
export function teamBuffsFromAbsentCharacters(
  characterData: Record<string, any> | undefined,
  teamCharacterIds: Array<string | null>,
): string[] {
  const teamBuffs = characterData?.teamBuffs;
  const absent: string[] = [];
  for (const selected of [teamBuffs?.selectedCharacter1, teamBuffs?.selectedCharacter2]) {
    if (!selected || teamCharacterIds.includes(selected)) continue;
    const defs = (buffsByCharacter as Record<string, TeamBuffDef[]>)[selected] ?? [];
    if (defs.some((def) => teamBuffs?.buffs?.[def.key]?.isEnabled)) absent.push(selected);
  }
  return absent;
}
