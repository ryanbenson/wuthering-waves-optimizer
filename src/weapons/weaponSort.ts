interface WeaponRowLike {
  key: string;
  [k: string]: unknown;
}

/**
 * Moves the signature weapon (if present in the list) to the front, preserving
 * the relative order of everything else.
 */
export function sortWeaponsWithSignatureFirst<T extends WeaponRowLike>(
  weapons: T[],
  signatureWeapon?: string | null,
): T[] {
  if (!signatureWeapon) {
    return weapons;
  }
  const signatureIndex = weapons.findIndex((weapon) => weapon.key === signatureWeapon);
  if (signatureIndex <= 0) {
    return weapons;
  }
  const sorted = [...weapons];
  const [signature] = sorted.splice(signatureIndex, 1);
  sorted.unshift(signature);
  return sorted;
}
