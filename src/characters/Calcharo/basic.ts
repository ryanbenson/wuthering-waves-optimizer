interface CharacterBasicInfo {
  name: string;
  rarity: number;
  weapon: string;
  avatarUrl: string;
  basicAttackName: string;
  skillName: string;
  liberationName: string;
  introSkillName: string;
  outroSkillName: string;
  forteCircuitName: string;
}

export function getCharacterBasicInfo(): CharacterBasicInfo {
  return {
    name: "Calcharo",
    rarity: 5,
    weapon: "Broadblade",
    avatarUrl: "test.jpg",
    basicAttackName: "Gnawing Fangs",
    skillName: "Extermination Order",
    liberationName: "Extermination Order",
    introSkillName: "Wanted Outlaw",
    outroSkillName: "Shadowy Raid",
    forteCircuitName: "Hunting Mission",
  };
}
