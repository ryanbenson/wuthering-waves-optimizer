const WEAPON_SINGULAR_MAP: Record<string, string> = {
  Swords: "Sword",
  Gauntlets: "Gauntlet",
  Broadblades: "Broadblade",
  Rectifiers: "Rectifier",
  Pistols: "Pistol",
};

export function toCharacterKey(displayName: string): string {
  const parts = displayName.match(/[a-zA-Z0-9]+/g) ?? [];
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

export function toAttackKey(attributeName: string): string {
  const parts = attributeName.match(/[a-zA-Z0-9]+/g) ?? [];
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toSingularWeapon(weaponTypeName: string): string {
  const weapon = WEAPON_SINGULAR_MAP[weaponTypeName];
  if (!weapon) {
    throw new Error(`Unknown weapon type: ${weaponTypeName}`);
  }
  return weapon;
}
