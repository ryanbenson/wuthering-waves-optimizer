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

export function getWeaponsByType(type: string): string[] {
  if (type === "sword") {
    return swordsList;
  }
  return [];
}
