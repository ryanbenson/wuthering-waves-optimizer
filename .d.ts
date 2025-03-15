interface CharacterBasicInfo {
  name: string;
  rarity: number;
  weapon: string;
  avatarUrl: string;
  gender: string;
  element: string;
  spectroFrazzle?: boolean;
}
interface WeaponInfo {
  key?: string;
  name: string;
  description: string;
  image: string;
  type: string;
  rarity: number;
  passiveName: string;
  passiveValue?: string;
  passiveData?: WeaponPassiveData[];
  maxLevel?: string;
  weaponLevelOverride?: string[];
}

interface WeaponPassiveData {
  key: string;
  hasStacks: boolean;
  modifier: string | null;
  modifierByRefinement: WeaponPassiveModifierByRefinement;
  minStacks?: number;
  maxStacks?: number;
  details?: string;
  alwaysEnabled?: boolean;
}

interface WeaponPassiveModifierByRefinement {
  [refinement: string]: number;
}

interface WeaponLevelData {
  attack: number;
  modifier: string;
  modifierValue: number;
}

interface WeaponData {
  [level: string]: WeaponLevelData;
}
enum ActionType {
  basic = "basic",
  skill = "skill",
  forte = "forte",
  liberation = "liberation",
  intro = "intro",
}

enum Modifier {
  ATK = "ATK",
  ATK_FLAT = "ATK_FLAT",
  HP = "HP",
  HP_FLAT = "HP_FLAT",
  DEF = "DEF",
  DEF_FLAT = "DEF_FLAT",
  DamageDeepen = "DamageDeepen",
  CritRate = "CritRate",
  CritDMG = "CritDMG",
  BasicAttackDMGBonus = "BasicAttackDMGBonus",
  HeavyAttackDMGBonus = "HeavyAttackDMGBonus",
  ResonanceSkillDMGBonus = "ResonanceSkillDMGBonus",
  ResonanceLiberationDMGBonus = "ResonanceLiberationDMGBonus",
  EnergyRegen = "EnergyRegen",
  Glacio = "Glacio",
  Fusion = "Fusion",
  Electro = "Electro",
  Aero = "Aero",
  Spectro = "Spectro",
  Havoc = "Havoc",
  HealingBonus = "HealingBonus",
}

interface ActionBuff {
  modifier: Modifier;
  modifierValue: number; // full value (e.g. 10 for 10% CritRate)
}

interface Action {
  order: number; // the sequence number of the action
  key: string; // the key that maps to the action key for the character attack
  type: ActionType; // the type of attack
  count: number; // how many hits
  buffs: ActionBuff[]; // any buffs for this specific action
}

type RotationPreset = {
  name: string;
  description: string;
  author?: string;
  data: any; // this is a rotation config, we can build this out later
}