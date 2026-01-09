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

export const configOptimizer = {
  meta: { version: "2", source: "WutheringTools" },
  data: {
    character:
      '{"characters":{"Augusta":{"echoes":{"0":{},"1":{},"2":{},"3":{},"4":{}},"mainEcho":{"echo":null,"rank":5},"optimizer":{"mainEchoes":[],"echoSets":[],"minStats":[],"optimizationTarget":[],"damageType":"Average","ignoreOtherResonantorEchoes":false}},"Phrolova":{"echoes":{"0":{"echo":null,"type":null,"rank":null,"stat":null,"echoId":"5n36rmy6x3","echoSet":null,"echoSubStatsType1":null,"echoSubStatsValue1":null,"echoSubStatsType2":null,"echoSubStatsValue2":null,"echoSubStatsType3":null,"echoSubStatsValue3":null,"echoSubStatsType4":null,"echoSubStatsValue4":null,"echoSubStatsType5":null,"echoSubStatsValue5":null},"1":{"echo":null,"type":null,"rank":null,"stat":null,"echoId":"rr8jn3ciw4","echoSet":null,"echoSubStatsType1":null,"echoSubStatsValue1":null,"echoSubStatsType2":null,"echoSubStatsValue2":null,"echoSubStatsType3":null,"echoSubStatsValue3":null,"echoSubStatsType4":null,"echoSubStatsValue4":null,"echoSubStatsType5":null,"echoSubStatsValue5":null},"2":{"echo":null,"type":null,"rank":null,"stat":null,"echoId":"xhywue7co3","echoSet":null,"echoSubStatsType1":null,"echoSubStatsValue1":null,"echoSubStatsType2":null,"echoSubStatsValue2":null,"echoSubStatsType3":null,"echoSubStatsValue3":null,"echoSubStatsType4":null,"echoSubStatsValue4":null,"echoSubStatsType5":null,"echoSubStatsValue5":null},"3":{"echo":null,"type":null,"rank":null,"stat":null,"echoId":"k6b4iokk38","echoSet":null,"echoSubStatsType1":null,"echoSubStatsValue1":null,"echoSubStatsType2":null,"echoSubStatsValue2":null,"echoSubStatsType3":null,"echoSubStatsValue3":null,"echoSubStatsType4":null,"echoSubStatsValue4":null,"echoSubStatsType5":null,"echoSubStatsValue5":null},"4":{"echo":null,"type":null,"rank":null,"stat":null,"echoId":"tkw0ve6v4h","echoSet":null,"echoSubStatsType1":null,"echoSubStatsValue1":null,"echoSubStatsType2":null,"echoSubStatsValue2":null,"echoSubStatsType3":null,"echoSubStatsValue3":null,"echoSubStatsType4":null,"echoSubStatsValue4":null,"echoSubStatsType5":null,"echoSubStatsValue5":null}},"mainEcho":{"echo":"NightmareHecate","rank":5,"isEnabled":true},"optimizer":{"mainEchoes":["NightmareHecate"],"echoSets":["DreamoftheLost","SunSinkingEclipse"],"minStats":[],"optimizationTarget":"Rotation:4aslmocsay","damageType":"Average","ignoreOtherResonantorEchoes":false,"echoSetPassives":{"DreamoftheLostCritRateEchoSkill":{"isEnabled":true},"SunSinkingEclipse2SetHavoc":{"isEnabled":true},"SunSinkingEclipse5SetHavoc":{"isEnabled":true,"stacks":4}},"mainEchoBuffs":{"NightmareHecate":{"isEnabled":true}}},"buffs":{"Aftersound":{"isEnabled":true,"stacks":24},"Maestro":{"isEnabled":true},"InherentSkillAccidental":{"isEnabled":true},"InherentSkillOctet":{"isEnabled":true,"stacks":24},"InherentSkillOctetAdditionalStacks":{"isEnabled":true,"stacks":100},"StatBonusCritRate1":{"isEnabled":true},"StatBonusCritRate2":{"isEnabled":true},"StatBonusCritRate3":{"isEnabled":true},"StatBonusCritRate4":{"isEnabled":true},"StatBonusATK1":{"isEnabled":true},"StatBonusATK2":{"isEnabled":true},"StatBonusATK3":{"isEnabled":true},"StatBonusATK4":{"isEnabled":true}},"weapon":"LetheanElegy","weaponPassives":{"LetheanElegyATK":{"isEnabled":true},"LetheanElegyEchoDMGAmplification":{"isEnabled":true},"LetheanElegyDefIgnore":{"isEnabled":true},"LetheanElegySkillDMGBonus":{"isEnabled":true}},"resonanceChains":{"SequenceNode1AKeytoNetherworldsSecrets":{"isEnabled":true},"SequenceNode2ARopeTiedtoaLifeBeyond":{"isEnabled":true},"SequenceNode3ADaggertoCutCleanObsessions":{"isEnabled":true},"SequenceNode4ATorchIlluminatingthePath":{"isEnabled":true},"SequenceNode5AForkedRoadinFatesHeartland":{"isEnabled":true},"SequenceNode6ANighttoDepartFromEternalRest":{"isEnabled":true},"SequenceNode6ANighttoDepartFromEternalRestOffField":{"isEnabled":true},"SequenceNode6ANighttoDepartFromEternalRestOnField":{"isEnabled":true}},"teamBuffs":{"selectedCharacter1":"Cantarella","selectedCharacter2":"Shorekeeper","buffs":{"OutroSkillGentleTentacles":{"isEnabled":true},"SophisticatedStellarealmCritRate":{"isEnabled":true,"baseAttrValue":250},"ReleasedStellarealmCritDMG":{"isEnabled":true,"baseAttrValue":250},"OutroSkillBinaryButterfly":{"isEnabled":true},"InherentSkillSelfGravitation":{"isEnabled":true},"SequenceNode2NightsGiftandRefusal":{"isEnabled":true},"RejuvenatingGlow":{"isEnabled":true},"FallacyOfNoReturn":{"isEnabled":true},"EmpyreanAnthem":{"isEnabled":true},"StellarSymphonyATK":{"isEnabled":true}}},"rotations":[{"id":"4aslmocsay","name":"Standard Rotation","description":"From Prydwen","duration":"9.45","echo":"NightmareHecate","echoRank":5,"actions":[{"id":"l8xud2fsj3","order":1,"key":"SuiteofQuietusDMG","type":"intro","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"y6anny33d0","order":2,"key":"Stage3DMG","type":"basic","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"acps6zz12r","order":3,"key":"MovementOfFateAndFinalityDMG","type":"forteCircuit","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"80u0rou52o","order":4,"key":"WhispersinaFleetingDreamDMG","type":"skill","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"0tqtit1617","order":5,"key":"MovementOfFateAndFinalityDMG","type":"forteCircuit","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"194eix6y64","order":6,"key":"NightmareHecateSmashDMG","type":"echoAttacks","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false,"mainEcho":"NightmareHecate","mainEchoRank":5},{"id":"7jc8h5hpo1","order":7,"key":"Stage1DMG","type":"basic","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"ue65nyd8ik","order":8,"key":"Stage2DMG","type":"basic","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"7ro2vyakqm","order":9,"key":"Stage3DMG","type":"basic","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"b7iwkxdwrd","order":10,"key":"MovementOfFateAndFinalityDMG","type":"forteCircuit","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"urg4hxvj0f","order":11,"key":"ScarletCodaDMG","type":"basic","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"jt6rwnvys1","order":12,"key":"EnhancedAttackHecateCadenzaDMG","type":"liberation","count":"2","buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"k4ajp5qhc5","order":13,"key":"BasicAttackHecateStage1DMG","type":"liberation","count":"2","buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"0wqdsf4dm1","order":14,"key":"BasicAttackHecateStage2DMG","type":"liberation","count":"2","buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"o0cjlmc6ff","order":15,"key":"EnhancedAttackHecateStringsDMG","type":"liberation","count":"4","buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"jkvvdfbvwn","order":16,"key":"BasicAttackHecateStage1DMG","type":"liberation","count":"2","buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"79qtdxx0xw","order":17,"key":"BasicAttackHecateStage2DMG","type":"liberation","count":1,"buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false},{"id":"3a7dz756ax","order":18,"key":"EnhancedAttackHecateStringsDMG","type":"liberation","count":"2","buffs":[],"excludeSelfBuffs":false,"excludeTeamBuffs":false,"excludeWeaponBuffs":false,"isDisabled":false}]}],"echoSetBonus":{"setBonusOne":"Sun-sinking Eclipse 2 Set","setBonusTwo":"Dream of the Lost 3 Set"},"echoPresetId":null,"echoSetPassives":{"SunSinkingEclipse2SetHavoc":{"isEnabled":true},"DreamoftheLostCritRateEchoSkill":{"isEnabled":true}},"customBuffs":{"ATK":2,"ATK_FLAT":2,"HP":2,"HP_FLAT":2,"DEF":2,"DEF_FLAT":2,"CritRate":2,"CritDMG":2,"EnergyRegen":2,"BasicAttackDMGBonus":2,"HeavyAttackDMGBonus":2,"ResonanceSkillDMGBonus":2,"ResonanceLiberationDMGBonus":2,"Glacio":2,"Fusion":2,"Electro":2,"Aero":2,"Spectro":2,"Havoc":2,"HealingBonus":2,"CoordinatedDMGBonus":2,"EchoDMGBonus":2,"TuneBreakDMGBonus":2,"DamageAmplify":2,"ResistShred":2,"DefIgnore":2,"DefReduction":2,"SpecialMultiplier":2}}},"activeCharacter":"Phrolova"}',
    inventory:
      '{"echoes":[{"echo":"NightmareHecate","type":4,"rank":5,"stat":"CritDMG","echoId":"5n36rmy6x3","echoSet":"DreamoftheLost","echoSubStatsType1":"CritRate","echoSubStatsValue1":6.3,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":12.6,"echoSubStatsType3":"ATK","echoSubStatsValue3":6.4,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":30,"echoSubStatsType5":"HP","echoSubStatsValue5":6.4},{"echo":"NightmareHecate","type":4,"rank":5,"stat":"CritDMG","echoId":"6n8u1g5j0g","echoSet":"DreamoftheLost","echoSubStatsType1":"CritRate","echoSubStatsValue1":10.5,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":21,"echoSubStatsType3":"ATK","echoSubStatsValue3":11.6,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":60,"echoSubStatsType5":"ResonanceSkillDMGBonus","echoSubStatsValue5":11.6},{"echo":"ChopChop","type":3,"rank":5,"stat":"Havoc","echoId":"rr8jn3ciw4","echoSet":"DreamoftheLost","echoSubStatsType1":"CritRate","echoSubStatsValue1":6.3,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":12.6,"echoSubStatsType3":"ATK","echoSubStatsValue3":6.4,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":30,"echoSubStatsType5":"HP","echoSubStatsValue5":6.4},{"echo":"FaeIgnis","type":1,"rank":5,"stat":"ATK","echoId":"xhywue7co3","echoSet":"DreamoftheLost","echoSubStatsType1":"CritRate","echoSubStatsValue1":7.5,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":15,"echoSubStatsType3":"ATK","echoSubStatsValue3":7.9,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":40,"echoSubStatsType5":"ResonanceSkillDMGBonus","echoSubStatsValue5":7.1},{"echo":"Tambourinist","type":3,"rank":5,"stat":"Havoc","echoId":"k6b4iokk38","echoSet":"SunSinkingEclipse","echoSubStatsType1":"CritRate","echoSubStatsValue1":6.3,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":12.6,"echoSubStatsType3":"ATK","echoSubStatsValue3":6.4,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":30,"echoSubStatsType5":"HP","echoSubStatsValue5":6.4},{"echo":"YoungRoseshroom","type":1,"rank":5,"stat":"ATK","echoId":"tkw0ve6v4h","echoSet":"SunSinkingEclipse","echoSubStatsType1":"CritRate","echoSubStatsValue1":7.5,"echoSubStatsType2":"CritDMG","echoSubStatsValue2":15,"echoSubStatsType3":"ATK","echoSubStatsValue3":7.9,"echoSubStatsType4":"ATK_FLAT","echoSubStatsValue4":40,"echoSubStatsType5":"ResonanceSkillDMGBonus","echoSubStatsValue5":7.9}],"equipped":{"5n36rmy6x3":{"Phrolova":0},"null":{},"rr8jn3ciw4":{"Phrolova":1},"xhywue7co3":{"Phrolova":2},"k6b4iokk38":{"Phrolova":3},"tkw0ve6v4h":{"Phrolova":4}},"echoPresets":[],"equippedPresets":{}}',
  },
};

export const optimizerResults: Record<string, string> = {
  totalNormal: `1828453`,
  totalAverage: `8359684`,
  totalCrit: `8359684`,
  totalNormalAfterEquip: `1828453`,
  totalAverageAfterEquip: `8359684`,
  totalCritAfterEquip: `8359684`,
  percentNormal: `(+3.5%)`,
  percentAvg: `(+5.4%)`,
  percentCrit: `(+5.4%)`,
  percentNormalAfterEquip: `(+0.0%)`,
  percentAvgAfterEquip: `(+0.0%)`,
  percentCritAfterEquip: `(+0.0%)`,
};
