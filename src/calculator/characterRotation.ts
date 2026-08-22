import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import { calcDamages } from "./attacks";
import { buildCharacterCalculationContext, type CalculationContext, type TeamEnemyConfig } from "./buildCharacterContext";
import { applyAdvancedOverrides, hasAdvancedConfigOverrides, type RotationAdvancedConfig } from "./rotationAdvancedBuffs";
import { resolveCharactersForBuild } from "./buildOverride";

// Lives here (rather than teamRotation.ts) so calcTeamRotationDamage can
// delegate to calcCharacterRotationDamage per slot without a circular
// import — this module has no dependency on teamRotation.ts.
// teamRotation.ts re-exports both for existing consumers.
export interface DamageAggregation {
  normalDamage: number | null;
  avgDamage: number | null;
  critDamage: number | null;
  healing: number | null;
  shield: number | null;
}

export function addDamageAggregation(a: DamageAggregation, b: DamageAggregation): DamageAggregation {
  return {
    normalDamage: (a.normalDamage ?? 0) + (b.normalDamage ?? 0),
    avgDamage: (a.avgDamage ?? 0) + (b.avgDamage ?? 0),
    critDamage: (a.critDamage ?? 0) + (b.critDamage ?? 0),
    healing: (a.healing ?? 0) + (b.healing ?? 0),
    shield: (a.shield ?? 0) + (b.shield ?? 0),
  };
}

const EMPTY_DAMAGE_AGGREGATION: DamageAggregation = {
  normalDamage: null,
  avgDamage: null,
  critDamage: null,
  healing: null,
  shield: null,
};

export interface CharacterRotationAction {
  id: string;
  order?: number;
  key: string;
  type: string;
  count?: number;
  mainEcho?: string | null;
  mainEchoRank?: number | null;
  buffs?: Array<{ id: string; modifier: string; modifierValue: number }>;
  isDisabled?: boolean;
  negativeStatusStacks?: number;
  electroRageStacks?: number;
  advancedConfig?: RotationAdvancedConfig;
}

export interface CharacterRotationInput {
  id: string;
  name: string;
  description?: string | null;
  duration?: number | string | null;
  mainEcho?: string | null;
  mainEchoRank?: number | null;
  actions: CharacterRotationAction[];
}

export interface CharacterRotationDamageResult {
  id: string;
  name: string;
  description?: string | null;
  duration?: number | string | null;
  mainEcho: string | null;
  mainEchoRank: number | null;
  attacks: any[];
  damageAggregation: DamageAggregation;
}

/**
 * A calculation context already built for the active character (reused
 * as-is by Calculator.vue for its stat cards / echo damage / elemental
 * reactions) — reusing it here for the fast path avoids paying
 * `buildCharacterCalculationContext`'s async character/weapon re-fetch cost
 * for the common case where no action in the rotation overrides any buffs.
 */
export interface CharacterRotationBaseContext {
  chosenChar: any;
  characterLevel: string | number;
  context: CalculationContext;
}

/**
 * Computes one rotation's damage: actions with no `advancedConfig` share a
 * base context (a single batched `calcDamages` call, exactly like before
 * this feature existed); actions with a real per-buff override each get
 * their own freshly-rebuilt context via `buildCharacterCalculationContext`.
 * Results from both paths are merged back into the rotation's original
 * action order.
 *
 * `baseContext` lets a caller that already has one built (Calculator.vue,
 * reusing its own live, reactively-maintained context so the common
 * no-override case pays no extra cost) pass it in directly. Pass `null` to
 * have this function build one itself — used by `calcTeamRotationDamage`,
 * which has no single "active character" context to reuse per slot.
 *
 * `buildId` (Team Rotations' per-slot build override, issue #278) swaps in
 * a specific saved build's data for `characterId` instead of its currently
 * active build, via `resolveCharactersForBuild` — the same
 * synthetic-characters-map trick `applyAdvancedOverrides` already uses for
 * per-action buff overrides below, so both can compose (an override action
 * layers its `advancedConfig` on top of the *targeted build's* data, not the
 * active build's). Don't pass both a non-null `baseContext` and a `buildId`
 * together — `baseContext` already encodes a specific (normally the active)
 * build's stats and bypasses `characters` entirely for the plain-actions
 * path, so combining them would silently ignore `buildId` for most actions.
 * `calcTeamRotationDamage` always passes `baseContext: null`, so this never
 * arises there.
 */
export async function calcCharacterRotationDamage(
  rotation: CharacterRotationInput,
  baseContext: CharacterRotationBaseContext | null,
  characterId: string,
  characters: Record<string, any>,
  enemyConfig: TeamEnemyConfig,
  inventoryEchoes: any[] = [],
  buildId: string | null = null,
): Promise<CharacterRotationDamageResult> {
  const effectiveCharacters = resolveCharactersForBuild(characters, characterId, buildId);
  const characterData = effectiveCharacters?.[characterId] ?? {};
  const activeActions = rotation.actions.filter((action) => !action.isDisabled);
  const overrideActions = activeActions.filter((action) => hasAdvancedConfigOverrides(action.advancedConfig));
  const plainActions = activeActions.filter((action) => !hasAdvancedConfigOverrides(action.advancedConfig));

  let attacks: any[] = [];
  let damageAggregation: DamageAggregation = { ...EMPTY_DAMAGE_AGGREGATION };

  if (plainActions.length) {
    let sharedContext: CharacterRotationBaseContext;
    if (baseContext) {
      sharedContext = baseContext;
    } else {
      const built = await buildCharacterCalculationContext(characterId, effectiveCharacters, enemyConfig, inventoryEchoes);
      sharedContext = { chosenChar: built.chosenChar, characterLevel: built.characterLevel, context: built.context };
    }
    const plainAttacks = plainActions
      .map((action) => resolveRotationActionToAttackData(action, sharedContext.chosenChar, sharedContext.characterLevel))
      .filter((attack) => attack != null);
    sharedContext.context.rotationsList = [
      { id: rotation.id, name: rotation.name, duration: rotation.duration, order: 0, attacks: plainAttacks },
    ];
    const damageData = calcDamages(sharedContext.context);
    attacks = attacks.concat(damageData?.rotations?.[0]?.attacks ?? []);
    damageAggregation = addDamageAggregation(
      damageAggregation,
      damageData?.rotations?.[0]?.damageAggregation ?? EMPTY_DAMAGE_AGGREGATION,
    );
  }

  for (const action of overrideActions) {
    const overriddenCharacters = {
      ...effectiveCharacters,
      [characterId]: applyAdvancedOverrides(characterData, action.advancedConfig),
    };
    const built = await buildCharacterCalculationContext(characterId, overriddenCharacters, enemyConfig, inventoryEchoes);
    const attack = resolveRotationActionToAttackData(action, built.chosenChar, built.characterLevel);
    if (attack == null) continue;
    built.context.rotationsList = [
      { id: rotation.id, name: rotation.name, duration: rotation.duration, order: 0, attacks: [attack] },
    ];
    const damageData = calcDamages(built.context);
    attacks = attacks.concat(damageData?.rotations?.[0]?.attacks ?? []);
    damageAggregation = addDamageAggregation(
      damageAggregation,
      damageData?.rotations?.[0]?.damageAggregation ?? EMPTY_DAMAGE_AGGREGATION,
    );
  }

  // Restore the rotation's original action order — the two passes above ran
  // independently, so attacks came back grouped by path, not by action order.
  const attacksById = new Map(attacks.map((attack) => [attack.id, attack]));
  const orderedAttacks = activeActions
    .map((action) => attacksById.get(action.id))
    .filter((attack) => attack !== undefined);

  return {
    id: rotation.id,
    name: rotation.name,
    description: rotation.description ?? null,
    duration: rotation.duration ?? null,
    mainEcho: rotation.mainEcho ?? null,
    mainEchoRank: rotation.mainEchoRank ?? null,
    attacks: orderedAttacks,
    damageAggregation,
  };
}
