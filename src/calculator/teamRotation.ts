import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import { calcDamages } from "./attacks";
import { buildCharacterCalculationContext, type TeamEnemyConfig } from "./buildCharacterContext";

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
  excludeSelfBuffs?: boolean;
  excludeTeamBuffs?: boolean;
  excludeWeaponBuffs?: boolean;
  negativeStatusStacks?: number;
  electroRageStacks?: number;
  isDisabled?: boolean;
}

export interface TeamRotationInput {
  name?: string;
  characterIds: Array<string | null>;
  actions: TeamRotationAction[];
  duration: number | string | null;
}

export interface DamageAggregation {
  normalDamage: number | null;
  avgDamage: number | null;
  critDamage: number | null;
  healing: number | null;
  shield: number | null;
}

export interface RotationDps {
  normal: number;
  avg: number;
  crit: number;
}

const EMPTY_DAMAGE_AGGREGATION: DamageAggregation = {
  normalDamage: null,
  avgDamage: null,
  critDamage: null,
  healing: null,
  shield: null,
};

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
 * characters. Each character's actions are evaluated against that
 * character's own calculation context (their own build), then the
 * per-character damage aggregations are summed into a team total.
 *
 * No caching: builds fresh character contexts on every call.
 */
export async function calcTeamRotationDamage(
  team: TeamRotationInput,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
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

    const built = await buildCharacterCalculationContext(characterId, characters, enemyConfig);

    const resolvedPairs = slotActions
      .map((action) => ({
        action,
        attack: resolveRotationActionToAttackData(action, built.chosenChar, built.characterLevel),
      }))
      .filter((pair): pair is { action: TeamRotationAction; attack: any } => pair.attack != null);

    built.context.rotationsList = [
      {
        id: `slot-${slot}`,
        name: team.name ?? "Team Rotation",
        duration: team.duration,
        order: 0,
        attacks: resolvedPairs.map((pair) => pair.attack),
      },
    ];

    const damageData = calcDamages(built.context);
    // processAttacks preserves array order, so the Nth processed attack
    // corresponds to the Nth entry in resolvedPairs.
    const processedAttacks: any[] = damageData?.rotations?.[0]?.attacks ?? [];
    const damageAggregation: DamageAggregation =
      damageData?.rotations?.[0]?.damageAggregation ?? EMPTY_DAMAGE_AGGREGATION;

    perCharacter[characterId] = { damageAggregation, attacks: processedAttacks };

    processedAttacks.forEach((attack, index) => {
      actionResults.push({
        characterId,
        slot: slot as 0 | 1 | 2,
        order: resolvedPairs[index]?.action.order ?? 0,
        attack,
      });
    });

    total.normalDamage = (total.normalDamage ?? 0) + (damageAggregation.normalDamage ?? 0);
    total.avgDamage = (total.avgDamage ?? 0) + (damageAggregation.avgDamage ?? 0);
    total.critDamage = (total.critDamage ?? 0) + (damageAggregation.critDamage ?? 0);
    total.healing = (total.healing ?? 0) + (damageAggregation.healing ?? 0);
    total.shield = (total.shield ?? 0) + (damageAggregation.shield ?? 0);
  }

  actionResults.sort((a, b) => a.order - b.order);

  return {
    perCharacter,
    actionResults,
    total,
    dps: calcRotationDps(total, team.duration),
  };
}
