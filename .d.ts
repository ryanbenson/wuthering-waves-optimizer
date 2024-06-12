interface WeaponInfo {
  name: string;
  description: string;
  type: string;
  rarity: number;
  passiveName: string;
  passiveValue?: string;
  passiveData?: WeaponPassiveData[];
}

interface WeaponPassiveData {
  hasStacks: boolean;
  modifier: string;
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
