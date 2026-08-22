import { randomString } from "../utils/strings";
import type { TeamEnemyConfig } from "./buildCharacterContext";
import type { RotationAdvancedConfig } from "./rotationAdvancedBuffs";
import {
  calcCharacterRotationDamage,
  addDamageAggregation,
  type DamageAggregation,
} from "./characterRotation";

// Re-exported for existing consumers — the implementation lives in
// characterRotation.ts (see its own comment) so calcTeamRotationDamage can
// delegate to calcCharacterRotationDamage without a circular import.
export { addDamageAggregation, type DamageAggregation };

export interface TeamRotationAction {
  id: string;
  slot: 0 | 1 | 2;
  order: number;
  key: string;
  type: string;
  count?: number;
  mainEcho?: string | null;
  mainEchoRank?: number | null;
  buffs?: Array<{ id: string; modifier: string; modifierValue: number }>;
  negativeStatusStacks?: number;
  electroRageStacks?: number;
  isDisabled?: boolean;
  advancedConfig?: RotationAdvancedConfig;
}

/**
 * The shape of an action inside a single-character rotation (either one of
 * the character's own saved rotations from `characters[id].rotations`, or a
 * character-authored preset from `characters/<Name>/presets.ts`). Lacks
 * `slot` — that's assigned on import — and its `id`/`buffs[].id` are stale
 * (copied from wherever the source rotation lives), so they're regenerated
 * rather than reused, matching `addIdsToImportedRotation` in
 * CalculatorRotations.vue.
 */
export interface SourceRotationAction {
  id?: string;
  order?: number;
  key: string;
  type: string;
  count?: number;
  mainEcho?: string | null;
  mainEchoRank?: number | null;
  buffs?: Array<{ id?: string; modifier: string; modifierValue: number }>;
  negativeStatusStacks?: number;
  electroRageStacks?: number;
  isDisabled?: boolean;
}

/**
 * Converts a single-character rotation's actions into team actions pinned to
 * one slot, for importing a saved rotation/preset into a Team Rotation.
 * `startOrder` continues the team's own order sequence — order only needs to
 * increase *within a slot* (see `calcTeamRotationDamage`'s per-slot sort), so
 * a simple offset per source action is sufficient.
 */
export function convertRotationActionsForSlot(
  sourceActions: SourceRotationAction[],
  slot: 0 | 1 | 2,
  startOrder: number,
): TeamRotationAction[] {
  return sourceActions.map((sourceAction, index) => {
    const { id: _sourceId, ...rest } = sourceAction;
    return {
      ...rest,
      id: randomString(),
      slot,
      order: startOrder + index,
      buffs: sourceAction.buffs?.map((buff) => ({ ...buff, id: randomString() })),
    };
  });
}

/**
 * Splits a team's existing actions into the ones an import should keep
 * ("append" keeps all of them, "overwrite" drops the target slot's own
 * actions) and the order the imported actions should start at. Order must
 * be derived from the *kept* actions, not the pre-import total — otherwise
 * overwriting a slot leaves the new actions numbered as if the replaced
 * ones were still there.
 */
export function computeTeamImportBase(
  currentActions: TeamRotationAction[],
  slot: 0 | 1 | 2,
  mode: "overwrite" | "append",
): { base: TeamRotationAction[]; startOrder: number } {
  const base =
    mode === "overwrite" ? currentActions.filter((action) => action.slot !== slot) : currentActions;
  return { base, startOrder: base.length + 1 };
}

export interface TeamRotationInput {
  name?: string;
  characterIds: Array<string | null>;
  /**
   * Per-slot build override (issue #278): `buildIds[slot]` pins that slot's
   * calculation to a specific saved build instead of whatever build is
   * currently active for that character. `null`/absent (including a
   * missing array entirely, for teams saved before this field existed)
   * means "use the active build" — see `resolveCharactersForBuild`.
   */
  buildIds?: Array<string | null>;
  actions: TeamRotationAction[];
  duration: number | string | null;
}

export interface RotationDps {
  normal: number;
  avg: number;
  crit: number;
}

/**
 * Computes DPS from a damage aggregation + a total rotation duration in
 * seconds. Mirrors CalculatorDamages.vue's inline
 * `damageAggregation.normalDamage / Number(rotation.duration)` math exactly
 * (including its lack of a zero/NaN guard — callers gate display on
 * `duration` being truthy, same as the existing single-character UI).
 */
export function calcRotationDps(
  damageAggregation: DamageAggregation,
  duration: number | string | null | undefined,
): RotationDps {
  const durationNum = Number(duration);
  return {
    normal: (damageAggregation.normalDamage as number) / durationNum,
    avg: (damageAggregation.avgDamage as number) / durationNum,
    crit: (damageAggregation.critDamage as number) / durationNum,
  };
}

export interface TeamRotationActionResult {
  characterId: string;
  slot: 0 | 1 | 2;
  order: number;
  attack: any;
}

export interface TeamRotationCharacterResult {
  damageAggregation: DamageAggregation;
  attacks: any[];
}

/**
 * Computes total team damage/DPS for a rotation spanning up to 3
 * characters, by delegating each slot's actions to
 * `calcCharacterRotationDamage` (`characterRotation.ts`) — the same
 * plain/override per-action split the single-character Character Rotation
 * display already uses, with no team-wide "mode" to gate it: an action with
 * no `advancedConfig` shares one batched context with the rest of that
 * slot's plain actions; an action with a real per-buff override gets its own
 * freshly-rebuilt context. No caching: builds fresh character contexts on
 * every call.
 */
export async function calcTeamRotationDamage(
  team: TeamRotationInput,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
): Promise<{
  perCharacter: Record<string, TeamRotationCharacterResult>;
  actionResults: TeamRotationActionResult[];
  total: DamageAggregation;
  dps: RotationDps;
}> {
  const perCharacter: Record<string, TeamRotationCharacterResult> = {};
  const actionResults: TeamRotationActionResult[] = [];
  const total: DamageAggregation = { normalDamage: 0, avgDamage: 0, critDamage: 0, healing: 0, shield: 0 };

  for (let slot = 0; slot < team.characterIds.length; slot++) {
    const characterId = team.characterIds[slot];
    if (!characterId) {
      continue;
    }
    const slotActions = team.actions
      .filter((action) => action.slot === slot && !action.isDisabled)
      .sort((a, b) => a.order - b.order);
    if (slotActions.length === 0) {
      continue;
    }

    const slotResult = await calcCharacterRotationDamage(
      { id: `slot-${slot}`, name: team.name ?? "Team Rotation", duration: team.duration, actions: slotActions },
      null,
      characterId,
      characters,
      enemyConfig,
      inventoryEchoes,
      team.buildIds?.[slot] ?? null,
    );

    perCharacter[characterId] = { damageAggregation: slotResult.damageAggregation, attacks: slotResult.attacks };

    const orderByActionId = new Map(slotActions.map((action) => [action.id, action.order]));
    slotResult.attacks.forEach((attack) => {
      actionResults.push({
        characterId,
        slot: slot as 0 | 1 | 2,
        order: orderByActionId.get(attack.id) ?? 0,
        attack,
      });
    });

    total.normalDamage = (total.normalDamage ?? 0) + (slotResult.damageAggregation.normalDamage ?? 0);
    total.avgDamage = (total.avgDamage ?? 0) + (slotResult.damageAggregation.avgDamage ?? 0);
    total.critDamage = (total.critDamage ?? 0) + (slotResult.damageAggregation.critDamage ?? 0);
    total.healing = (total.healing ?? 0) + (slotResult.damageAggregation.healing ?? 0);
    total.shield = (total.shield ?? 0) + (slotResult.damageAggregation.shield ?? 0);
  }

  actionResults.sort((a, b) => a.order - b.order);

  return {
    perCharacter,
    actionResults,
    total,
    dps: calcRotationDps(total, team.duration),
  };
}

export interface StrongestHit {
  normal: number;
  avg: number;
  crit: number;
  strongestAction: TeamRotationActionResult | null;
}

function isDamageAction(actionResult: TeamRotationActionResult): boolean {
  return actionResult.attack?.type !== "Healing" && actionResult.attack?.type !== "Shield";
}

/**
 * The single biggest hit across every action, reported as a normal/avg/crit
 * triple (matching this app's existing damage-display convention, rather
 * than a single headline number) — each field is the max of that metric
 * independently, so they don't necessarily all come from the same action.
 * `strongestAction` names the action behind the biggest *crit* hit, for an
 * optional "biggest hit was X's Y" caption.
 */
export function calcStrongestHit(actionResults: TeamRotationActionResult[]): StrongestHit {
  const damageActions = actionResults.filter(isDamageAction);
  const normal = damageActions.reduce((max, a) => Math.max(max, a.attack?.damage?.totalDamage ?? 0), 0);
  const avg = damageActions.reduce((max, a) => Math.max(max, a.attack?.damage?.avgDamage ?? 0), 0);
  const crit = damageActions.reduce((max, a) => Math.max(max, a.attack?.damage?.critDamage ?? 0), 0);
  const strongestAction = damageActions.reduce<TeamRotationActionResult | null>((best, a) => {
    const value = a.attack?.damage?.critDamage ?? 0;
    const bestValue = best?.attack?.damage?.critDamage ?? -Infinity;
    return value > bestValue ? a : best;
  }, null);
  return { normal, avg, crit, strongestAction };
}

export interface TimelinePoint {
  time: number;
  characterId: string;
  order: number;
  normalDamage: number;
  avgDamage: number;
  critDamage: number;
  label: string;
}

/**
 * Rough per-action timeline: exact per-action timing isn't tracked, so this
 * evenly distributes the N damage actions (Healing/Shield excluded) across
 * `duration` seconds, centering each action within its even slice
 * (`((index + 0.5) / n) * duration`). Operates on `actionResults` as-is,
 * which `calcTeamRotationDamage` already globally sorts by `order` across
 * all three slots — so points follow real interleaved execution order.
 */
export function calcRotationTimeline(
  actionResults: TeamRotationActionResult[],
  duration: number | string | null,
): TimelinePoint[] {
  const damageActions = actionResults.filter(isDamageAction);
  const durationNum = Number(duration);
  const n = damageActions.length;
  if (!n || !durationNum || durationNum <= 0) return [];
  return damageActions.map((actionResult, index) => ({
    time: ((index + 0.5) / n) * durationNum,
    characterId: actionResult.characterId,
    order: actionResult.order,
    normalDamage: actionResult.attack?.damage?.totalDamage ?? 0,
    avgDamage: actionResult.attack?.damage?.avgDamage ?? 0,
    critDamage: actionResult.attack?.damage?.critDamage ?? 0,
    label: actionResult.attack?.label ?? "Action",
  }));
}
