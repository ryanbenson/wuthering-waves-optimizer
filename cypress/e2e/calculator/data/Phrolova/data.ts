export const config = {
  meta: { version: "2", source: "WutheringTools" },
  data: {
    character:
      '{"characters":{"Augusta":{"echoes":{"0":{},"1":{},"2":{},"3":{},"4":{}},"mainEcho":{"echo":null,"rank":5}},"Phrolova":{"echoes":{"0":{"type":4,"echo":"NightmareHecate","echoSet":"DreamoftheLost","echoSubStatsType1":"CritRate","echoSubStatsValue1":8.1,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":16.2,"echoSubStatsType3":"ATK","echoSubStatsValue3":8.6,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":50,"echoSubStatsType5":"ResonanceSkillDMGBonus","echoSubStatsValue5":8.6,"stat":"CritDMG"},"1":{"type":3,"echo":"NightmareTambourinist","echoSet":"DreamoftheLost","stat":"Havoc","echoSubStatsType1":"CritRate","echoSubStatsValue1":8.1,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":16.2,"echoSubStatsType3":"ATK","echoSubStatsValue3":8.6,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":50,"echoSubStatsType5":"ResonanceSkillDMGBonus","echoSubStatsValue5":8.6},"2":{"type":3,"echo":"Tambourinist","echoSet":"SunSinkingEclipse","stat":"Havoc","echoSubStatsType1":"CritRate","echoSubStatsValue1":8.1,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":16.2,"echoSubStatsType3":"EnergyRegen","echoSubStatsValue3":7.6,"echoSubStatsType4":"DEF","echoSubStatsValue4":10.9,"echoSubStatsType5":"HP","echoSubStatsValue5":8.6},"3":{"type":1,"echo":"NightmareHavocWarrior","echoSet":"DreamoftheLost","stat":"ATK","echoSubStatsType1":"CritRate","echoSubStatsValue1":8.1,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":16.2,"echoSubStatsType3":"EnergyRegen","echoSubStatsValue3":7.6,"echoSubStatsType4":"HP","echoSubStatsValue4":8.6,"echoSubStatsType5":"DEF","echoSubStatsValue5":10.9},"4":{"type":1,"echo":"HavocWarrior","echoSet":"SunSinkingEclipse","stat":"ATK","echoSubStatsType1":"CritRate","echoSubStatsValue1":8.1,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":16.2,"echoSubStatsType3":"HP_FLAT","echoSubStatsValue3":430,"echoSubStatsType4":"DEF","echoSubStatsValue4":10.9,"echoSubStatsType5":"DEF_FLAT","echoSubStatsValue5":60}},"mainEcho":{"echo":"NightmareHecate","rank":5,"isEnabled":true},"buffs":{"Aftersound":{"isEnabled":true,"stacks":24},"Maestro":{"isEnabled":true},"InherentSkillAccidental":{"isEnabled":true},"InherentSkillOctet":{"isEnabled":true,"stacks":24},"InherentSkillOctetAdditionalStacks":{"isEnabled":true,"stacks":100},"StatBonusCritRate1":{"isEnabled":true},"StatBonusCritRate2":{"isEnabled":true},"StatBonusCritRate4":{"isEnabled":true},"StatBonusCritRate3":{"isEnabled":true},"StatBonusATK1":{"isEnabled":true},"StatBonusATK2":{"isEnabled":true},"StatBonusATK3":{"isEnabled":true},"StatBonusATK4":{"isEnabled":true}},"weapon":"LetheanElegy","weaponPassives":{"LetheanElegyATK":{"isEnabled":true},"LetheanElegySkillDMGBonus":{"isEnabled":true},"LetheanElegyEchoDMGAmplification":{"isEnabled":true},"LetheanElegyDefIgnore":{"isEnabled":true}},"echoSetBonus":{"setBonusOne":"Sun-sinking Eclipse 2 Set","setBonusTwo":"Dream of the Lost 3 Set"},"echoSetPassives":{"SunSinkingEclipse2SetHavoc":{"isEnabled":true},"DreamoftheLostCritRateEchoSkill":{"isEnabled":true}},"resonanceChains":{"SequenceNode1AKeytoNetherworldsSecrets":{"isEnabled":true},"SequenceNode2ARopeTiedtoaLifeBeyond":{"isEnabled":true},"SequenceNode3ADaggertoCutCleanObsessions":{"isEnabled":true},"SequenceNode5AForkedRoadinFatesHeartland":{"isEnabled":true},"SequenceNode6ANighttoDepartFromEternalRest":{"isEnabled":true},"SequenceNode6ANighttoDepartFromEternalRestOffField":{"isEnabled":false},"SequenceNode6ANighttoDepartFromEternalRestOnField":{"isEnabled":true}},"teamBuffs":{"selectedCharacter1":"Roccia","selectedCharacter2":"Cantarella","buffs":{"InherentSkillSuperAttractiveMagicBox":{"isEnabled":true},"CommediaImprovvisoATK":{"isEnabled":true,"baseAttrValue":100},"OutroSkillApplausePlease!":{"isEnabled":true},"SequenceNode2WhentheLuceaniteGleamsHavoc":{"isEnabled":true,"stacks":3},"SequenceNode2WhentheLuceaniteGleamsHavocMaxed":{"isEnabled":true},"OutroSkillGentleTentacles":{"isEnabled":true},"RejuvenatingGlow":{"isEnabled":false},"MoonlitClouds":{"isEnabled":true},"ImpermanenceHeron":{"isEnabled":true},"MidnightVeil":{"isEnabled":true}}},"customBuffs":{"ATK":2,"ATK_FLAT":2,"HP":2,"HP_FLAT":2,"DEF":2,"DEF_FLAT":2,"CritRate":2,"CritDMG":2,"EnergyRegen":2,"BasicAttackDMGBonus":2,"HeavyAttackDMGBonus":2,"ResonanceSkillDMGBonus":2,"ResonanceLiberationDMGBonus":2,"Glacio":2,"Fusion":2,"Electro":2,"Aero":2,"Spectro":2,"Havoc":2,"HealingBonus":2,"CoordinatedDMGBonus":2,"EchoDMGBonus":2,"DamageAmplify":2,"ResistShred":2,"DefIgnore":2},"enemyLevel":"100","enemyResist":"0.2"}},"activeCharacter":"Phrolova"}',
    inventory: null,
  },
};

export const dataAttacks: AttackTests = [
  {
    selector: ".stage-1-dmg",
    values: ["Stage 1 DMG", "6410", "27966", "28010"],
  },
  {
    selector: ".stage-2-dmg",
    values: ["Stage 2 DMG", "5722", "24966", "25004"],
  },
  {
    selector: ".stage-3-dmg",
    values: ["Stage 3 DMG", "11760", "51312", "51391"],
  },
  {
    selector: ".heavy-attack-dmg",
    values: ["Heavy Attack DMG", "8142", "35525", "35580"],
  },
  {
    selector: ".scarlet-coda-dmg",
    values: ["Scarlet Coda DMG", "320708", "1399330", "1401491"],
  },
  {
    selector: ".mid-air-attack-dmg",
    values: ["Mid-air Attack DMG", "7629", "33287", "33339"],
  },
  {
    selector: ".dodge-counter-dmg",
    values: ["Dodge Counter DMG", "7315", "31914", "31963"],
  },
  {
    selector: ".whispers-in-a-fleeting-dream-dmg",
    values: ["Whispers in a Fleeting Dream DMG", "14705", "64161", "64260"],
  },
  {
    selector: ".basic-attack-hecate-stage-1-dmg",
    values: ["Basic Attack - Hecate Stage 1 DMG", "4335", "18914", "18943"],
  },
  {
    selector: ".basic-attack-hecate-stage-2-dmg",
    values: ["Basic Attack - Hecate Stage 2 DMG", "4335", "18914", "18943"],
  },
  {
    selector: ".enhanced-attack-hecate-strings-dmg",
    values: [
      "Enhanced Attack - Hecate: Strings DMG",
      "67174",
      "293096",
      "293549",
    ],
  },
  {
    selector: ".enhanced-attack-hecate-winds-dmg",
    values: [
      "Enhanced Attack - Hecate: Winds DMG",
      "63815",
      "278439",
      "278869",
    ],
  },
  {
    selector: ".enhanced-attack-hecate-cadenza-dmg",
    values: [
      "Enhanced Attack - Hecate: Cadenza DMG",
      "67174",
      "293096",
      "293549",
    ],
  },
  {
    selector: ".curtain-call-hecate-dmg",
    values: ["Curtain Call - Hecate DMG", "23718", "103486", "103646"],
  },
  {
    selector: ".movement-of-fate-and-finality-dmg",
    values: ["Movement of Fate and Finality DMG", "63069", "275187", "275612"],
  },
  {
    selector: ".murmurs-in-a-haunting-dream-dmg",
    values: ["Murmurs in a Haunting Dream DMG", "57957", "252878", "253269"],
  },
  {
    selector: ".s6-apparition-of-beyond-hecate",
    values: ["S6 Apparition of Beyond - Hecate", "23204", "101244", "101401"],
  },
  {
    selector: ".suite-of-quietus-dmg",
    values: ["Suite of Quietus DMG", "10209", "44541", "44610"],
  },
  {
    selector: ".suite-of-immortality-dmg",
    values: ["Suite of Immortality DMG", "74487", "325003", "325505"],
  },
  {
    selector: ".magic-box-dmg",
    values: ["Magic Box DMG", "100", "100", "100"],
  },
  {
    selector: ".nightmare-hecate-dmg",
    values: ["Nightmare: Hecate DMG", "49016", "213870", "214200"],
  },
];
export const dataStats: StatTests = [
  { selector: ".stat-atk", value: "2,717" },
  { selector: ".stat-hp", value: "17,835" },
  { selector: ".stat-def", value: "1,592" },
  { selector: ".stat-cr", value: "99.8%" },
  { selector: ".stat-cd", value: "437.0%" },
  { selector: ".stat-er", value: "117.2%" },
  { selector: ".stat-basic", value: "2.0%" },
  { selector: ".stat-heavy", value: "2.0%" },
  { selector: ".stat-skill", value: "51.2%" },
  { selector: ".stat-liberation", value: "2.0%" },
  { selector: ".stat-glacio", value: "2.0%" },
  { selector: ".stat-fusion", value: "2.0%" },
  { selector: ".stat-electro", value: "2.0%" },
  { selector: ".stat-aero", value: "2.0%" },
  { selector: ".stat-spectro", value: "2.0%" },
  { selector: ".stat-havoc", value: "199.0%" },
  { selector: ".stat-healing", value: "2.0%" },
];
