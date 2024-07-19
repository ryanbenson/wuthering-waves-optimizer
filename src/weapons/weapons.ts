export const swordsList = [
  "BlazingBrilliance",
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

const broadbladesList = [
  "AgesOfHarvest",
  "Autumntrace",
  "Broadblade41",
  "BroadbladeOfNight",
  "BroadbladeOfVoyager",
  "DauntlessEvernight",
  "Discord",
  "GuardianBroadblade",
  "HeliosCleaver",
  "LustrousRazor",
  "OriginiteTypeI",
  "TrainingBroadblade",
  "TyroBroadblade",
  "VerdantSummit",
];

const rectifiersList = [
  "Augment",
  "CometFlare",
  "CosmicRipples",
  "GuardianRectifier",
  "JinzhouKeeper",
  "OriginiteTypeV",
  "Rectifier25",
  "RectifierOfNights",
  "RectifierOfVoyager",
  "Stringmaster",
  "TrainingRectifier",
  "TyroRectifier",
  "Variation",
];

const pistolsList = [
  "Cadenza",
  "GuardianPistols",
  "Novaburst",
  "OriginiteTypeIII",
  "Pistols26",
  "PistolsOfNight",
  "PistolsOfVoyager",
  "StaticMist",
  "Thunderbolt",
  "TrainingPistols",
  "TyroPistols",
  "UndyingFlame",
];

export function getWeaponsByType(type: string) {
  if (type === "Swords") {
    return swordsList;
  }
  if (type === "Broadblades") {
    return broadbladesList;
  }
  if (type === "Rectifiers") {
    return rectifiersList;
  }
  if (type === "Pistols") {
    return pistolsList;
  }
  return [];
}

async function loadModule(type: string, weaponName: string) {
  try {
    const module = await import(`@/weapons/${type}/${weaponName}.ts`);
    return module.getWeapon();
  } catch (error) {
    // console.error("Error loading weapon");
  }
}

export async function getWeaponByName(type: string, weaponName: string) {
  try {
    const weaponData = await loadModule(type, weaponName);
    return weaponData;
  } catch (error) {
    // throw "Unable to find weapon";
  }
}
