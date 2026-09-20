/**
 * Shared mechanism for buffs/passives/resonance-chain nodes that can't be
 * active at the same time in-game (e.g. Rime-Draped Sprouts' two Basic
 * Attack DMG Bonus passives, or Brant's "My"/Theatrical Moment self buffs).
 * A definition opts in with `mutuallyExclusiveWith`; everything else here
 * enforces it so the UI never lets two conflicting keys both be enabled.
 */

export type BuffCategory = "buffs" | "weaponPassives" | "resonanceChains";

/**
 * A key this definition can't be active alongside. A plain string means
 * "the same category as the definition declaring it" (the common case: two
 * weapon passives, or two character buffs, conflicting with each other). An
 * object crosses into a different category — e.g. a resonance chain node
 * that supersedes one of the character's own self buffs.
 */
export type MutuallyExclusiveRef = string | { key: string; category: BuffCategory };

export interface MutuallyExclusiveDef {
  key: string;
  mutuallyExclusiveWith?: MutuallyExclusiveRef[];
}

export type CategoryToggleUpdates = Partial<
  Record<BuffCategory, Record<string, { isEnabled: boolean }>>
>;

function resolveRef(
  ownCategory: BuffCategory,
  ref: MutuallyExclusiveRef,
): { category: BuffCategory; key: string } {
  return typeof ref === "string"
    ? { category: ownCategory, key: ref }
    : { category: ref.category, key: ref.key };
}

function setUpdate(
  updates: CategoryToggleUpdates,
  category: BuffCategory,
  key: string,
  isEnabled: boolean,
): void {
  updates[category] = { ...(updates[category] ?? {}), [key]: { isEnabled } };
}

/**
 * The store update for one buff/passive/resonance-chain toggle, disabling
 * everything it declares mutually exclusive with in the same stroke.
 * Disabling never cascades — only enabling does, mirroring how the in-game
 * effects supersede each other. Pass the result straight to
 * `characterStore.setCharacterData`.
 */
export function buildBuffToggleUpdate(
  ownCategory: BuffCategory,
  ownKey: string,
  isEnabled: boolean,
  mutuallyExclusiveWith?: MutuallyExclusiveRef[],
): CategoryToggleUpdates {
  const updates: CategoryToggleUpdates = {};
  setUpdate(updates, ownCategory, ownKey, isEnabled);

  if (isEnabled) {
    for (const ref of mutuallyExclusiveWith ?? []) {
      const { category, key } = resolveRef(ownCategory, ref);
      setUpdate(updates, category, key, false);
    }
  }

  return updates;
}

/**
 * The store update for a bulk "enable all"/"max all" pass over one
 * category's definitions: walks them in order, skipping (leaving alone)
 * anything that would conflict with a key already won — either earlier in
 * this same pass, or already enabled in another category via
 * `isEnabledElsewhere` — and disabling the losing side of any conflict this
 * pass creates. First definition in the list wins a same-category conflict;
 * an already-enabled foreign-category key always wins over this pass.
 */
export function buildBulkEnableUpdate(
  ownCategory: BuffCategory,
  definitions: MutuallyExclusiveDef[],
  isEnabledElsewhere: (category: BuffCategory, key: string) => boolean,
  extraForKey?: (key: string) => Record<string, unknown>,
): CategoryToggleUpdates {
  const updates: CategoryToggleUpdates = {};
  const blocked = new Set<string>();
  const blockedKey = (category: BuffCategory, key: string) => `${category}:${key}`;

  for (const def of definitions) {
    if (blocked.has(blockedKey(ownCategory, def.key))) {
      continue;
    }

    const refs = def.mutuallyExclusiveWith ?? [];
    const losesToForeign = refs.some((ref) => {
      const { category, key } = resolveRef(ownCategory, ref);
      return (
        category !== ownCategory &&
        isEnabledElsewhere(category, key) &&
        !blocked.has(blockedKey(category, key))
      );
    });
    if (losesToForeign) {
      continue;
    }

    updates[ownCategory] = {
      ...(updates[ownCategory] ?? {}),
      [def.key]: { isEnabled: true, ...extraForKey?.(def.key) },
    };

    for (const ref of refs) {
      const { category, key } = resolveRef(ownCategory, ref);
      blocked.add(blockedKey(category, key));
      setUpdate(updates, category, key, false);
    }
  }

  return updates;
}
