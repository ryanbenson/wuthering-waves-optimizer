import { resolveRotationActionToAttackData } from "./resolveRotationAction";
import { calcDamages } from "./attacks";
import { randomString } from "../utils/strings";
import {
  buildCharacterCalculationContext,
  type CharacterCalculationContext,
  type TeamEnemyConfig,
} from "./buildCharacterContext";

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
  excludeSelfBuffs?: boolean;
  excludeTeamBuffs?: boolean;
  excludeWeaponBuffs?: boolean;
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

export type AdvancedConfigCategory =
  | "buffs"
  | "weaponPassives"
  | "echoSetPassives"
  | "teamBuffs"
  | "resonanceChains"
  | "mainEchoBuff";

/**
 * Bulk-writes one buff override into every listed action's `advancedConfig`
 * — the mechanism behind "make this buff last for [x] actions": rather than
 * a persisted, order-tracking "span" that's re-evaluated at calc time, the
 * UI resolves the target action ids once (starting action + a count, or an
 * inclusive end action) and this just stamps the same concrete override into
 * each of them. Simpler than a new data model, and the existing per-action
 * advancedConfig pipeline needs no changes to support it.
 */
export function applyBulkAdvancedConfigOverride(
  actions: TeamRotationAction[],
  actionIds: string[],
  category: AdvancedConfigCategory,
  key: string | null,
  override: TeamRotationBuffOverride,
): TeamRotationAction[] {
  const idSet = new Set(actionIds);
  return actions.map((action) => {
    if (!idSet.has(action.id)) return action;
    const advancedConfig = action.advancedConfig ?? {};
    if (category === "mainEchoBuff") {
      return { ...action, advancedConfig: { ...advancedConfig, mainEchoBuff: { ...override } } };
    }
    const nextCategory = { ...(advancedConfig[category] ?? {}), [key as string]: { ...override } };
    return { ...action, advancedConfig: { ...advancedConfig, [category]: nextCategory } };
  });
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

/**
 * Builds a full `advancedConfig` for one action, either as a snapshot of the
 * character's *current* real buff/passive/resonance-chain state (so the
 * Advanced-mode checkboxes reflect reality immediately instead of appearing
 * all off with no visible explanation) or fully disabled (a deliberate
 * blank slate the user builds up from scratch). Used when a team first
 * switches from Basic to Advanced mode, and as the default for any action
 * added while already in Advanced mode.
 */
export function buildAdvancedConfigSnapshot(
  characterData: Record<string, any>,
  definitions: CharacterCalculationContext["definitions"] | null | undefined,
  mode: "current" | "blank",
): TeamRotationAdvancedConfig {
  const snapshotCategory = (
    defs: Array<{ key: string; hasStacks?: boolean }> | undefined,
    currentConfig: Record<string, TeamRotationBuffOverride> | undefined,
  ): Record<string, TeamRotationBuffOverride> => {
    const out: Record<string, TeamRotationBuffOverride> = {};
    for (const def of defs ?? []) {
      out[def.key] =
        mode === "blank"
          ? { isEnabled: false }
          : {
              isEnabled: currentConfig?.[def.key]?.isEnabled ?? false,
              stacks: currentConfig?.[def.key]?.stacks,
              baseAttrValue: currentConfig?.[def.key]?.baseAttrValue,
            };
    }
    return out;
  };

  const mainEchoConfig = characterData?.mainEcho;
  const mainEchoBuff: TeamRotationBuffOverride | undefined = definitions?.mainEchoDef
    ? mode === "blank"
      ? { isEnabled: false }
      : { isEnabled: mainEchoConfig?.isEnabled ?? false, stacks: mainEchoConfig?.stacks }
    : undefined;

  return {
    buffs: snapshotCategory(definitions?.buffs, characterData?.buffs),
    weaponPassives: snapshotCategory(definitions?.weaponPassives, characterData?.weaponPassives),
    echoSetPassives: snapshotCategory(
      [
        ...(definitions?.echoSetPassivesOnePiece ?? []),
        ...(definitions?.echoSetPassivesOne ?? []),
        ...(definitions?.echoSetPassivesTwo ?? []),
      ],
      characterData?.echoSetPassives,
    ),
    mainEchoBuff,
    teamBuffs: snapshotCategory(definitions?.teamBuffs, characterData?.teamBuffs?.buffs),
    resonanceChains: snapshotCategory(definitions?.resonanceChains, characterData?.resonanceChains),
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
