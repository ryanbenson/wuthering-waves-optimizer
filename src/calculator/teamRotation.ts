import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import { calcDamages } from "./attacks";
import { buildCharacterCalculationContext, type TeamEnemyConfig } from "./buildCharacterContext";

/**
 * Per-toggle override used by Advanced mode's per-action buff editor.
 * `stacks`/`baseAttrValue` are only meaningful for buffs whose definition
 * has `hasStacks`/an `inputBase`-style config — harmless no-ops otherwise.
 */
export interface TeamRotationBuffOverride {
  isEnabled?: boolean;
  stacks?: number;
  baseAttrValue?: number;
}

export interface TeamRotationAdvancedConfig {
  buffs?: Record<string, TeamRotationBuffOverride>;
  weaponPassives?: Record<string, TeamRotationBuffOverride>;
  echoSetPassives?: Record<string, TeamRotationBuffOverride>;
  mainEchoBuff?: TeamRotationBuffOverride;
  teamBuffs?: Record<string, TeamRotationBuffOverride>;
  resonanceChains?: Record<string, TeamRotationBuffOverride>;
}

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
  /** Only consulted when the team's mode is "advanced". */
  advancedConfig?: TeamRotationAdvancedConfig;
}

export interface TeamRotationInput {
  name?: string;
  characterIds: Array<string | null>;
  actions: TeamRotationAction[];
  duration: number | string | null;
  /** "basic" (default) uses one shared context per character, exactly like
   * today. "advanced" builds a fresh, independently-overridable context per
   * action from that action's `advancedConfig`. */
  mode?: "basic" | "advanced";
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

function addDamageAggregation(a: DamageAggregation, b: DamageAggregation): DamageAggregation {
  return {
    normalDamage: (a.normalDamage ?? 0) + (b.normalDamage ?? 0),
    avgDamage: (a.avgDamage ?? 0) + (b.avgDamage ?? 0),
    critDamage: (a.critDamage ?? 0) + (b.critDamage ?? 0),
    healing: (a.healing ?? 0) + (b.healing ?? 0),
    shield: (a.shield ?? 0) + (b.shield ?? 0),
  };
}

/**
 * Overlays an advanced-mode per-action buff override onto a plain
 * `key -> {isEnabled, stacks}` config object (self buffs, weapon passives,
 * echo set passives, team buffs, resonance chains all share this shape).
 * Keys not present in `overrides` fall through to the character's own
 * stored config unchanged.
 */
function mergeBuffConfig(
  base: Record<string, TeamRotationBuffOverride> | undefined,
  overrides: Record<string, TeamRotationBuffOverride> | undefined,
): Record<string, TeamRotationBuffOverride> {
  if (!overrides) return base ?? {};
  const merged: Record<string, TeamRotationBuffOverride> = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(overrides)) {
    merged[key] = { ...(merged[key] ?? {}), ...value };
  }
  return merged;
}

/**
 * Clones a character's stored build data with an advanced-mode action's
 * overrides applied, so the existing (unmodified) buildCharacterContext.ts
 * pipeline can be reused as-is for a single action instead of the whole
 * character — no per-action-aware branching needed inside the pure
 * calculator itself.
 */
function applyAdvancedOverrides(
  characterData: Record<string, any>,
  overrides: TeamRotationAdvancedConfig | undefined,
): Record<string, any> {
  if (!overrides) return characterData;
  return {
    ...characterData,
    buffs: mergeBuffConfig(characterData.buffs, overrides.buffs),
    weaponPassives: mergeBuffConfig(characterData.weaponPassives, overrides.weaponPassives),
    echoSetPassives: mergeBuffConfig(characterData.echoSetPassives, overrides.echoSetPassives),
    mainEcho: overrides.mainEchoBuff
      ? { ...(characterData.mainEcho ?? {}), ...overrides.mainEchoBuff }
      : characterData.mainEcho,
    teamBuffs: {
      ...(characterData.teamBuffs ?? {}),
      buffs: mergeBuffConfig(characterData.teamBuffs?.buffs, overrides.teamBuffs),
    },
    resonanceChains: mergeBuffConfig(characterData.resonanceChains, overrides.resonanceChains),
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

    let slotDamageAggregation: DamageAggregation = { ...EMPTY_DAMAGE_AGGREGATION };
    let slotAttacks: any[] = [];

    if (team.mode === "advanced") {
      // Advanced mode: each action can override the character's buffs, so
      // every action gets its own freshly-built context and its own
      // single-attack calcDamages call, then the results are summed.
      for (const action of slotActions) {
        const overriddenCharacters = {
          ...characters,
          [characterId]: applyAdvancedOverrides(characters?.[characterId] ?? {}, action.advancedConfig),
        };
        const built = await buildCharacterCalculationContext(
          characterId,
          overriddenCharacters,
          enemyConfig,
          inventoryEchoes,
        );
        const attack = resolveRotationActionToAttackData(action, built.chosenChar, built.characterLevel);
        if (attack == null) continue;

        built.context.rotationsList = [
          {
            id: `slot-${slot}-action-${action.id}`,
            name: team.name ?? "Team Rotation",
            duration: team.duration,
            order: 0,
            attacks: [attack],
          },
        ];
        const damageData = calcDamages(built.context);
        const processedAttacks: any[] = damageData?.rotations?.[0]?.attacks ?? [];
        const damageAggregation: DamageAggregation =
          damageData?.rotations?.[0]?.damageAggregation ?? EMPTY_DAMAGE_AGGREGATION;

        slotAttacks = slotAttacks.concat(processedAttacks);
        slotDamageAggregation = addDamageAggregation(slotDamageAggregation, damageAggregation);
        processedAttacks.forEach((processedAttack) => {
          actionResults.push({
            characterId,
            slot: slot as 0 | 1 | 2,
            order: action.order ?? 0,
            attack: processedAttack,
          });
        });
      }
    } else {
      // Basic mode (default): one shared context/calcDamages call for all
      // of this character's actions, exactly like before Advanced mode.
      const built = await buildCharacterCalculationContext(characterId, characters, enemyConfig, inventoryEchoes);

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
      slotDamageAggregation = damageData?.rotations?.[0]?.damageAggregation ?? EMPTY_DAMAGE_AGGREGATION;
      slotAttacks = processedAttacks;

      processedAttacks.forEach((attack, index) => {
        actionResults.push({
          characterId,
          slot: slot as 0 | 1 | 2,
          order: resolvedPairs[index]?.action.order ?? 0,
          attack,
        });
      });
    }

    perCharacter[characterId] = { damageAggregation: slotDamageAggregation, attacks: slotAttacks };
    total.normalDamage = (total.normalDamage ?? 0) + (slotDamageAggregation.normalDamage ?? 0);
    total.avgDamage = (total.avgDamage ?? 0) + (slotDamageAggregation.avgDamage ?? 0);
    total.critDamage = (total.critDamage ?? 0) + (slotDamageAggregation.critDamage ?? 0);
    total.healing = (total.healing ?? 0) + (slotDamageAggregation.healing ?? 0);
    total.shield = (total.shield ?? 0) + (slotDamageAggregation.shield ?? 0);
  }

  actionResults.sort((a, b) => a.order - b.order);

  return {
    perCharacter,
    actionResults,
    total,
    dps: calcRotationDps(total, team.duration),
  };
}
