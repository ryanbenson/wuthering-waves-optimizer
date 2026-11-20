/**
 * Pure helpers for the Attacks tab of the Full breakdown panel
 * (`CalculatorLiveResultAttacks.vue`, ADR 0060): per-character pinned
 * attacks and per-character remembered open/closed attack groups.
 *
 * Persisted shapes, both inside the free-form `settingsStore.config`:
 * - `pinnedAttacksByCharacter[character]` — `{ "<group>|<attackKey>": true }`.
 *   An object map, never an array, for the same reason as
 *   `pinnedStatsByCharacter` (see pinnedStats.ts): `addToConfig`'s lodash
 *   `merge` can't shrink an array, so unpinning is a real key delete and the
 *   caller writes the whole next config via `setConfig`.
 * - `attackGroupsOpenByCharacter[character]` — `{ [groupKey]: boolean }`.
 *   Only groups the user has explicitly opened or closed get a key; every
 *   other group falls back to the default (target group open, rest closed).
 *
 * The pin id is `<group>|<attackKey>` — the same shape as the optimizer's
 * `Attack:<group>|<attackKey>` target (liveResultBar.ts) — so an attack key
 * that happens to repeat across groups can't collide.
 */

type Config = Record<string, any> | null | undefined;

export function attackPinId(groupKey: string, attackKey: string): string {
  return `${groupKey}|${attackKey}`;
}

/** The pin ids saved for `character`, in no particular order. */
export function resolvePinnedAttacks(config: Config, character: string): Set<string> {
  const forChar = config?.pinnedAttacksByCharacter?.[character];
  if (!forChar || typeof forChar !== "object") return new Set();
  return new Set(Object.keys(forChar).filter((id) => forChar[id] === true));
}

/** Next settings config with `pinId` toggled for `character`; doesn't touch the store. */
export function withAttackPinToggled(
  config: Config,
  character: string,
  pinId: string,
): Record<string, any> {
  const current = config ?? {};
  const pinned = resolvePinnedAttacks(current, character);
  if (pinned.has(pinId)) pinned.delete(pinId);
  else pinned.add(pinId);

  const forChar: Record<string, true> = {};
  for (const id of pinned) forChar[id] = true;

  return {
    ...current,
    pinnedAttacksByCharacter: {
      ...(current.pinnedAttacksByCharacter ?? {}),
      [character]: forChar,
    },
  };
}

/** Group key the Pinned section saves its open/closed state under. */
export const PINNED_ATTACKS_GROUP_KEY = "pinnedAttacks";

/**
 * Whether an attack group is open: the user's saved choice for this
 * character when there is one, otherwise open for the optimizer's target
 * group or when `defaultOpen` is set (the Pinned section). A saved "closed"
 * therefore wins over either default.
 */
export function isAttackGroupOpen(
  config: Config,
  character: string,
  groupKey: string,
  targetGroupKey: string | null,
  defaultOpen = false,
): boolean {
  const saved = config?.attackGroupsOpenByCharacter?.[character]?.[groupKey];
  if (typeof saved === "boolean") return saved;
  return defaultOpen || groupKey === targetGroupKey;
}

/** Next settings config with the given groups saved as open/closed for `character`. */
export function withAttackGroupsOpen(
  config: Config,
  character: string,
  groupKeys: string[],
  open: boolean,
): Record<string, any> {
  const current = config ?? {};
  const forChar = { ...(current.attackGroupsOpenByCharacter?.[character] ?? {}) };
  for (const key of groupKeys) forChar[key] = open;

  return {
    ...current,
    attackGroupsOpenByCharacter: {
      ...(current.attackGroupsOpenByCharacter ?? {}),
      [character]: forChar,
    },
  };
}

/**
 * Which side of an attack row the pin button sits on. Global (not per
 * character) and saved as `config.attackPinSide`; anything other than
 * "right" — including nothing saved — means the default, "left".
 */
export type AttackPinSide = "left" | "right";

export function resolveAttackPinSide(config: Config): AttackPinSide {
  return config?.attackPinSide === "right" ? "right" : "left";
}

/** Next settings config with the pin side set; doesn't touch the store. */
export function withAttackPinSide(config: Config, side: AttackPinSide): Record<string, any> {
  return { ...(config ?? {}), attackPinSide: side };
}
