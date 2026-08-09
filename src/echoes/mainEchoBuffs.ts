export type EchoBuffEffect = {
  modifier?: string;
  modifySpecificTalents?: string[];
  modifierValue?: number;
  specificCharacters?: string[];
  modifierValueTalentRef?: string;
  modifierTalentKey?: string;
};

export type EchoModifier = {
  key?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifier?: string;
  modifySpecificTalents?: string[];
  modifierValue?: number;
  specificCharacters?: string[];
  modifierValueTalentRef?: string;
  modifierTalentKey?: string;
  effects?: EchoBuffEffect[];
};

export type MainEchoBuffSource = {
  key: string;
  details: string;
  modifiers?: EchoModifier[];
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
};

export type MainEchoBuff = {
  key: string;
  details: string;
  alwaysEnabled: boolean;
  hasStacks: boolean;
  minStacks: number;
  maxStacks: number;
  effects: EchoBuffEffect[];
};

export type MainEchoBuffState = {
  isEnabled?: boolean;
  stacks?: number;
};

export type MainEchoState = {
  echo?: string | null;
  rank?: number | string;
  isEnabled?: boolean;
  stacks?: number;
  buffs?: Record<string, MainEchoBuffState>;
};

export type OptimizerMainEchoBuffEntry = MainEchoBuffState & {
  buffs?: Record<string, MainEchoBuffState>;
};

function effectFromModifier(mod: EchoModifier): EchoBuffEffect {
  return {
    modifier: mod.modifier,
    modifySpecificTalents: mod.modifySpecificTalents,
    modifierValue: mod.modifierValue,
    specificCharacters: mod.specificCharacters,
    modifierValueTalentRef: mod.modifierValueTalentRef,
    modifierTalentKey: mod.modifierTalentKey,
  };
}

/** Resolve a buff entry into the list of stat effects it applies. */
export function getEchoBuffEffects(
  buff: EchoModifier | MainEchoBuff,
): EchoBuffEffect[] {
  if ("effects" in buff && buff.effects?.length) {
    return buff.effects;
  }
  const asModifier = buff as EchoModifier;
  if (
    asModifier.modifier != null ||
    asModifier.modifySpecificTalents != null ||
    asModifier.modifierValue != null
  ) {
    return [effectFromModifier(asModifier)];
  }
  return [];
}

/**
 * Normalize echo modifiers into independently toggleable buffs.
 * Unkeyed modifier arrays stay as one synthesized buff (key = echo.key).
 */
export function getMainEchoBuffs(
  echo: MainEchoBuffSource | null | undefined,
): MainEchoBuff[] {
  if (!echo) {
    return [];
  }
  const mods = echo.modifiers ?? [];
  if (mods.length === 0) {
    return [];
  }

  const allHaveKeys = mods.every((mod) => Boolean(mod.key));
  if (allHaveKeys) {
    return mods.map((mod) => ({
      key: mod.key as string,
      details: mod.details ?? echo.details,
      alwaysEnabled: mod.alwaysEnabled ?? false,
      hasStacks: mod.hasStacks ?? false,
      minStacks: mod.minStacks ?? 0,
      maxStacks: mod.maxStacks ?? 0,
      effects: getEchoBuffEffects(mod),
    }));
  }

  return [
    {
      key: echo.key,
      details: echo.details,
      alwaysEnabled: false,
      hasStacks: echo.hasStacks ?? false,
      minStacks: echo.minStacks ?? 0,
      maxStacks: echo.maxStacks ?? 0,
      effects: mods.flatMap((mod) => getEchoBuffEffects(mod)),
    },
  ];
}

/**
 * Merges each enabled main-echo buff's resolved stats (keyed by buff key,
 * as produced by applyMainEchoBuffEffects) into a single stats object.
 * Mirrors CalculatorEchoes.vue's `updateTotalStats` main-echo-buff loop
 * exactly, so the Calculator UI and non-Vue calculation paths (Team
 * Rotations' buildCharacterContext) stay in sync.
 */
export function mergeMainEchoBuffStats(
  buffStatsByKey: Record<string, Record<string, unknown>>,
  target: Record<string, unknown> = {},
): Record<string, unknown> {
  const stats = target;
  for (const buffStats of Object.values(buffStatsByKey)) {
    Object.entries(buffStats || {}).forEach(([stat, value]) => {
      if (stat === "EnableAttack" || stat === "specificTalentBuffs") {
        stats[stat] =
          stat === "specificTalentBuffs"
            ? { ...((stats[stat] as Record<string, unknown>) || {}), ...(value as Record<string, unknown>) }
            : value;
        return;
      }
      if (stat === "modifySpecificTalents" || stat === "talentModifierMultiply") {
        if (!stats[stat]) stats[stat] = [];
        (stats[stat] as unknown[]).push(...(value as unknown[]));
        return;
      }
      if (typeof value === "number") {
        stats[stat] = ((stats[stat] as number) || 0) + value;
      } else {
        stats[stat] = value;
      }
    });
  }
  return stats;
}

function hasBuffMap(
  buffs: Record<string, MainEchoBuffState> | undefined,
): boolean {
  return Boolean(buffs && Object.keys(buffs).length > 0);
}

/** Read enable state with legacy mainEcho.isEnabled fallback. */
export function isMainEchoBuffEnabled(
  state: MainEchoState | OptimizerMainEchoBuffEntry | null | undefined,
  buffKey: string,
): boolean {
  if (!state) {
    return false;
  }
  if (hasBuffMap(state.buffs)) {
    return Boolean(state.buffs?.[buffKey]?.isEnabled);
  }
  return Boolean(state.isEnabled);
}

/** Read stacks with legacy mainEcho.stacks fallback. */
export function getMainEchoBuffStacks(
  state: MainEchoState | OptimizerMainEchoBuffEntry | null | undefined,
  buffKey: string,
): number {
  if (!state) {
    return 0;
  }
  if (hasBuffMap(state.buffs)) {
    return state.buffs?.[buffKey]?.stacks ?? 0;
  }
  return state.stacks ?? 0;
}

/**
 * Expand legacy isEnabled/stacks into a per-buff map for the given echo buffs.
 * Returns null when there is nothing to migrate.
 */
export function migrateLegacyMainEchoBuffState(
  state: MainEchoState | OptimizerMainEchoBuffEntry | null | undefined,
  buffs: MainEchoBuff[],
): Record<string, MainEchoBuffState> | null {
  if (!state) {
    return null;
  }
  if (hasBuffMap(state.buffs)) {
    return null;
  }
  if (!state.isEnabled && state.stacks == null) {
    return null;
  }
  if (buffs.length === 0) {
    return null;
  }

  const next: Record<string, MainEchoBuffState> = {};
  for (const buff of buffs) {
    const entry: MainEchoBuffState = {};
    if (state.isEnabled) {
      entry.isEnabled = true;
    }
    if (buff.hasStacks && state.stacks != null) {
      entry.stacks = state.stacks;
    }
    if (entry.isEnabled != null || entry.stacks != null) {
      next[buff.key] = entry;
    }
  }
  return Object.keys(next).length > 0 ? next : null;
}
