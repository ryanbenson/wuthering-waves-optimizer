export const swordsList = [
  "CommandoOfConviction",
  "EmeraldOfGenesis",
  "GuardianSword",
  "Lumingloss",
  "LunarCutter",
  "OriginiteTypeII",
  "ScaleSlasher",
  "Sword18",
  "SwordOfNight",
  "SwordOfVoyager",
  "TrainingSword",
  "TyroSword",
];

export function getWeaponsByType(type: string) {
  if (type === "Swords") {
    return swordsList;
  }
  return [];
}

async function loadModule(type: string, weaponName: string) {
  try {
    const module = await import(`@/weapons/${type}/${weaponName}.ts`);
    return module.getWeapon();
  } catch (error) {
    console.error("Error loading module:", error);
  }
}

export async function getWeaponByName(type: string, weaponName: string) {
  const weaponData = await loadModule(type, weaponName);
  return weaponData;
}
