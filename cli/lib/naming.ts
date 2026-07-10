const WEAPON_PLURAL_MAP: Record<string, string> = {
  Swords: "Swords",
  Sword: "Swords",
  Gauntlets: "Gauntlets",
  Gauntlet: "Gauntlets",
  Broadblades: "Broadblades",
  Broadblade: "Broadblades",
  Rectifiers: "Rectifiers",
  Rectifier: "Rectifiers",
  Pistols: "Pistols",
  Pistol: "Pistols",
};

const WEAPON_SINGULAR_MAP: Record<string, string> = {
  Swords: "Sword",
  Sword: "Sword",
  Gauntlets: "Gauntlet",
  Gauntlet: "Gauntlet",
  Broadblades: "Broadblade",
  Broadblade: "Broadblade",
  Rectifiers: "Rectifier",
  Rectifier: "Rectifier",
  Pistols: "Pistol",
  Pistol: "Pistol",
};

export function toCharacterKey(displayName: string): string {
  const parts = displayName.match(/[a-zA-Z0-9]+/g) ?? [];
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

export function toEchoKey(displayName: string): string {
  const normalized = displayName.normalize("NFD").replace(/\p{M}/gu, "");
  return toCharacterKey(normalized);
}

export function toAttackKey(attributeName: string): string {
  const parts = attributeName.match(/[a-zA-Z0-9]+/g) ?? [];
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toPluralWeapon(weaponTypeName: string): string {
  const weapon = WEAPON_PLURAL_MAP[weaponTypeName];
  if (!weapon) {
    throw new Error(`Unknown weapon type: ${weaponTypeName}`);
  }
  return weapon;
}

export function toSingularWeapon(weaponTypeName: string): string {
  const weapon = WEAPON_SINGULAR_MAP[weaponTypeName];
  if (!weapon) {
    throw new Error(`Unknown weapon type: ${weaponTypeName}`);
  }
  return weapon;
}
