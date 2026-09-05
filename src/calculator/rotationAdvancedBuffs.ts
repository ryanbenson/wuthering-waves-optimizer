import type { CharacterCalculationContext } from "./buildCharacterContext";
import { getMainEchoBuffs, isMainEchoBuffEnabled, getMainEchoBuffStacks, type MainEchoBuffSource } from "../echoes/mainEchoBuffs";

/**
 * Per-toggle override used by a rotation action's advanced buff editor.
 * `stacks`/`baseAttrValue` are only meaningful for buffs whose definition
 * has `hasStacks`/an `inputBase`-style config — harmless no-ops otherwise.
 */
export interface RotationBuffOverride {
  isEnabled?: boolean;
  stacks?: number;
  baseAttrValue?: number;
}

export interface RotationAdvancedConfig {
  buffs?: Record<string, RotationBuffOverride>;
  weaponPassives?: Record<string, RotationBuffOverride>;
  echoSetPassives?: Record<string, RotationBuffOverride>;
  mainEchoBuff?: RotationBuffOverride;
  teamBuffs?: Record<string, RotationBuffOverride>;
  resonanceChains?: Record<string, RotationBuffOverride>;
}

export type AdvancedConfigCategory =
  | "buffs"
  | "weaponPassives"
  | "echoSetPassives"
  | "teamBuffs"
  | "resonanceChains"
  | "mainEchoBuff";

/**
 * True when a config actually overrides something. Distinguishes an action
 * that's had its advanced buff panel opened-but-untouched (should stay on
 * the cheap shared-context path) from one with a real per-buff override
 * (needs its own rebuilt context).
 */
export function hasAdvancedConfigOverrides(config: RotationAdvancedConfig | undefined | null): boolean {
  if (!config) return false;
  if (config.mainEchoBuff) return true;
  return (
    Object.keys(config.buffs ?? {}).length > 0 ||
    Object.keys(config.weaponPassives ?? {}).length > 0 ||
    Object.keys(config.echoSetPassives ?? {}).length > 0 ||
    Object.keys(config.teamBuffs ?? {}).length > 0 ||
    Object.keys(config.resonanceChains ?? {}).length > 0
  );
}

/**
 * True when a persisted `mainEchoBuff` override's *value* would actually
 * change the Optimizer's result — not just whether the key is present.
 *
 * The buff panel promotes the character's entire current buff state
 * (including main echo) into an action's `advancedConfig` the moment any
 * single buff is first toggled (see `buildAdvancedConfigSnapshot`'s "current"
 * mode) — so `advancedConfig.mainEchoBuff` is present on almost every
 * customized action even when its value is identical to what the character's
 * own default would already produce. Used to gate the Optimizer's
 * main-echo-buff-override warning (see `CalculatorOptimizer.vue`) on a real
 * divergence instead of firing on every customized action.
 *
 * `mainEchoBuff` is a single flat `{isEnabled, stacks}` override — it can
 * only represent one buff — so it's compared against the character's
 * *first* buff (the only one for the common single-buff main echo; a
 * reasonable stand-in for multi-buff echoes, which the Optimizer already
 * can't honor precisely anyway — see the warning this gates). Reads the
 * character's current state via `isMainEchoBuffEnabled`/`getMainEchoBuffStacks`
 * rather than the mainEcho record's own `isEnabled`/`stacks` fields directly
 * — those are only the legacy pre-multi-buff shape; a migrated character
 * stores state in `mainEcho.buffs[key]` instead, which would otherwise read
 * as "disabled" here and make every enabled override look like a divergence.
 */
export function mainEchoBuffOverrideDiffersFromCharacter(
  mainEchoBuff: RotationBuffOverride | undefined | null,
  characterData: Record<string, any> | undefined | null,
  mainEchoDef?: MainEchoBuffSource | null,
): boolean {
  if (!mainEchoBuff) return false;
  const currentConfig = characterData?.mainEcho;
  const buffKey = getMainEchoBuffs(mainEchoDef)[0]?.key;
  const currentIsEnabled = buffKey
    ? isMainEchoBuffEnabled(currentConfig, buffKey)
    : Boolean(currentConfig?.isEnabled);
  const overrideIsEnabled = mainEchoBuff.isEnabled ?? false;
  if (overrideIsEnabled !== currentIsEnabled) return true;
  if (!overrideIsEnabled || mainEchoBuff.stacks === undefined) return false;
  const currentStacks = buffKey ? getMainEchoBuffStacks(currentConfig, buffKey) : currentConfig?.stacks;
  return mainEchoBuff.stacks !== currentStacks;
}

/**
 * Bulk-writes one buff override into every listed action's `advancedConfig`
 * — the mechanism behind "make this buff last for [x] actions": rather than
 * a persisted, order-tracking "span" that's re-evaluated at calc time, the
 * UI resolves the target action ids once (starting action + a count, or an
 * inclusive end action) and this just stamps the same concrete override into
 * each of them. Simpler than a new data model, and the existing per-action
 * advancedConfig pipeline needs no changes to support it.
 */
function applyAdvancedConfigPatch(
  existing: RotationAdvancedConfig,
  category: AdvancedConfigCategory,
  key: string | null,
  override: RotationBuffOverride,
): RotationAdvancedConfig {
  if (category === "mainEchoBuff") {
    return { ...existing, mainEchoBuff: { ...override } };
  }
  const nextCategory = { ...(existing[category] ?? {}), [key as string]: { ...override } };
  return { ...existing, [category]: nextCategory };
}

export function applyBulkAdvancedConfigOverride<T extends { id: string; advancedConfig?: RotationAdvancedConfig }>(
  actions: T[],
  actionIds: string[],
  category: AdvancedConfigCategory,
  key: string | null,
  override: RotationBuffOverride,
): T[] {
  const idSet = new Set(actionIds);
  return actions.map((action) =>
    idSet.has(action.id)
      ? { ...action, advancedConfig: applyAdvancedConfigPatch(action.advancedConfig ?? {}, category, key, override) }
      : action,
  );
}

/**
 * Adds/updates exactly one field (a category+key, or the lone mainEchoBuff
 * value) inside a REAL persisted `advancedConfig` — the write-path
 * counterpart to `mergeAdvancedConfigForDisplay` below. Callers must pass the
 * action's actual `advancedConfig` (never a merged/displayed value) as
 * `existing`, so every other key that wasn't already explicitly persisted
 * stays absent and keeps resolving live at both calc time
 * (`applyAdvancedOverrides`) and display time (`mergeAdvancedConfigForDisplay`).
 */
export function applyAdvancedConfigOverride(
  existing: RotationAdvancedConfig | undefined,
  category: AdvancedConfigCategory,
  key: string | null,
  override: RotationBuffOverride,
): RotationAdvancedConfig {
  return applyAdvancedConfigPatch(existing ?? {}, category, key, override);
}

/**
 * Removes exactly one persisted override field, letting it fall back to the
 * character's live value again — the per-field counterpart to resetting an
 * action's entire `advancedConfig` to `undefined`. Returns `undefined` (not
 * `{}`) once the last override is removed, so `hasAdvancedConfigOverrides`
 * correctly reports "synced" again instead of "customized with an empty
 * config".
 */
export function removeAdvancedConfigOverride(
  existing: RotationAdvancedConfig | undefined,
  category: AdvancedConfigCategory,
  key: string | null,
): RotationAdvancedConfig | undefined {
  if (!existing) return undefined;
  let next: RotationAdvancedConfig;
  if (category === "mainEchoBuff") {
    const { mainEchoBuff, ...rest } = existing;
    next = rest;
  } else {
    const categoryMap = { ...(existing[category] ?? {}) };
    delete categoryMap[key as string];
    next = { ...existing, [category]: categoryMap };
    if (Object.keys(categoryMap).length === 0) {
      delete next[category];
    }
  }
  return hasAdvancedConfigOverrides(next) ? next : undefined;
}

/**
 * Overlays an advanced-mode per-action buff override onto a plain
 * `key -> {isEnabled, stacks}` config object (self buffs, weapon passives,
 * echo set passives, team buffs, resonance chains all share this shape).
 * Keys not present in `overrides` fall through to the character's own
 * stored config unchanged.
 */
export function mergeBuffConfig(
  base: Record<string, RotationBuffOverride> | undefined,
  overrides: Record<string, RotationBuffOverride> | undefined,
): Record<string, RotationBuffOverride> {
  if (!overrides) return base ?? {};
  const merged: Record<string, RotationBuffOverride> = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(overrides)) {
    merged[key] = { ...(merged[key] ?? {}), ...value };
  }
  return merged;
}

/**
 * Builds what the advanced buff panel should show: the character's live
 * current state (a full snapshot, so every known key has a concrete value)
 * with any *persisted* per-field overrides layered on top, key by key.
 * Unlike a top-level `action.advancedConfig ?? snapshot` fallback, this
 * always merges — a persisted override for one key never hides the live
 * value for every other key in the same or another category. Uses the exact
 * same per-key `mergeBuffConfig` semantics that `applyAdvancedOverrides` uses
 * at calc time, so what's displayed and what's calculated never diverge.
 */
export function mergeAdvancedConfigForDisplay(
  snapshot: RotationAdvancedConfig,
  overrides: RotationAdvancedConfig | undefined | null,
): RotationAdvancedConfig {
  return {
    buffs: mergeBuffConfig(snapshot.buffs, overrides?.buffs),
    weaponPassives: mergeBuffConfig(snapshot.weaponPassives, overrides?.weaponPassives),
    echoSetPassives: mergeBuffConfig(snapshot.echoSetPassives, overrides?.echoSetPassives),
    mainEchoBuff: overrides?.mainEchoBuff
      ? { ...(snapshot.mainEchoBuff ?? {}), ...overrides.mainEchoBuff }
      : snapshot.mainEchoBuff,
    teamBuffs: mergeBuffConfig(snapshot.teamBuffs, overrides?.teamBuffs),
    resonanceChains: mergeBuffConfig(snapshot.resonanceChains, overrides?.resonanceChains),
  };
}

/**
 * Counts how many individual fields an action's `advancedConfig` actually
 * overrides, and how many it *could* override given the character's
 * definitions — used to derive whether an action is synced, partially
 * synced, or fully customized (see `getAdvancedConfigSyncState`) without a
 * separate persisted "mode" field.
 */
export function countOverriddenAdvancedConfigFields(config: RotationAdvancedConfig | undefined | null): number {
  if (!config) return 0;
  let count = config.mainEchoBuff ? 1 : 0;
  count += Object.keys(config.buffs ?? {}).length;
  count += Object.keys(config.weaponPassives ?? {}).length;
  count += Object.keys(config.echoSetPassives ?? {}).length;
  count += Object.keys(config.teamBuffs ?? {}).length;
  count += Object.keys(config.resonanceChains ?? {}).length;
  return count;
}

export function countPossibleAdvancedConfigFields(
  definitions: CharacterCalculationContext["definitions"] | null | undefined,
): number {
  if (!definitions) return 0;
  const echoSetPassiveCount =
    (definitions.echoSetPassivesOnePiece?.length ?? 0) +
    (definitions.echoSetPassivesOne?.length ?? 0) +
    (definitions.echoSetPassivesTwo?.length ?? 0);
  return (
    (definitions.buffs?.length ?? 0) +
    (definitions.weaponPassives?.length ?? 0) +
    echoSetPassiveCount +
    (definitions.teamBuffs?.length ?? 0) +
    (definitions.resonanceChains?.length ?? 0) +
    (definitions.mainEchoDef ? 1 : 0)
  );
}

export type AdvancedConfigSyncState = "synced" | "partial" | "full-custom";

/**
 * Derives an action's sync state from its actual override count rather than
 * a stored mode flag: 0 overrides is "synced", every possible field
 * overridden is "full-custom" (typically via the "Detach completely" action,
 * which bakes a full `buildAdvancedConfigSnapshot`), anything in between is
 * "partial".
 */
export function getAdvancedConfigSyncState(
  config: RotationAdvancedConfig | undefined | null,
  definitions: CharacterCalculationContext["definitions"] | null | undefined,
): AdvancedConfigSyncState {
  const overridden = countOverriddenAdvancedConfigFields(config);
  if (overridden === 0) return "synced";
  const possible = countPossibleAdvancedConfigFields(definitions);
  return possible > 0 && overridden >= possible ? "full-custom" : "partial";
}

/**
 * Clones a character's stored build data with an advanced-mode action's
 * overrides applied, so the existing (unmodified) buildCharacterContext.ts
 * pipeline can be reused as-is for a single action instead of the whole
 * character — no per-action-aware branching needed inside the pure
 * calculator itself.
 */
export function applyAdvancedOverrides(
  characterData: Record<string, any>,
  overrides: RotationAdvancedConfig | undefined,
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
 * blank slate the user builds up from scratch). Used when a Team Rotation
 * first switches from Basic to Advanced mode (and as the default for any
 * action added while already in Advanced mode), and for display-only
 * fallback when a Character Rotation action's buff panel is opened before
 * it has its own persisted `advancedConfig`.
 */
export function buildAdvancedConfigSnapshot(
  characterData: Record<string, any>,
  definitions: CharacterCalculationContext["definitions"] | null | undefined,
  mode: "current" | "blank",
): RotationAdvancedConfig {
  const snapshotCategory = (
    defs: Array<{ key: string; hasStacks?: boolean }> | undefined,
    currentConfig: Record<string, RotationBuffOverride> | undefined,
  ): Record<string, RotationBuffOverride> => {
    const out: Record<string, RotationBuffOverride> = {};
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
  // Same single-buff stand-in as mainEchoBuffOverrideDiffersFromCharacter
  // above, and the same reason for reading via isMainEchoBuffEnabled/
  // getMainEchoBuffStacks instead of mainEchoConfig's own isEnabled/stacks
  // fields directly — a migrated character stores state in
  // mainEcho.buffs[key], not those legacy flat fields.
  const mainEchoBuffKey = getMainEchoBuffs(definitions?.mainEchoDef)[0]?.key;
  const mainEchoBuff: RotationBuffOverride | undefined = definitions?.mainEchoDef
    ? mode === "blank"
      ? { isEnabled: false }
      : {
          isEnabled: mainEchoBuffKey ? isMainEchoBuffEnabled(mainEchoConfig, mainEchoBuffKey) : Boolean(mainEchoConfig?.isEnabled),
          stacks: mainEchoBuffKey ? getMainEchoBuffStacks(mainEchoConfig, mainEchoBuffKey) : mainEchoConfig?.stacks,
        }
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
