export const resonanceChains = [
  {
    key: `SequenceNode1AtTheWindSBreathTheBlossomsWake`,
    name: `Sequence Node 1: At the wind's breath, the blossoms wake`,
    details: `<div>Casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Azure</span> or <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Feather</span> summons a <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling: Unfaltering</span> to attack the target, dealing <span style="color:#fcc4db;">Havoc DMG</span> equal to 337.98% of Yangyang: Xuanling's ATK. This DMG is considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>.<br>Casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Azure</span> or <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Feather</span> Stagnates nearby enemies.<br><size=10></span><br><span style="color:#ffd12f;" class="font-bold">Heavy Attack - Azure Sword Stance</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Havoc in Bloom</span> and <span style="color:#ffd12f;" class="font-bold">Dodge Counter - Havoc in Bloom</span> are immune to interruption.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode1AtTheWindSBreathTheBlossomsWake"],
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode2RiverCarriesHerSongAway`,
    name: `Sequence Node 2: River carries her song away`,
    details: `<div>The DMG dealt by <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Azure Sword Stance</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Feather Sword Stance</span>, <span style="color:#ffd12f;" class="font-bold">Mid-air Attack - Feather Fall</span>,  <span style="color:#ffd12f;" class="font-bold">Basic Attack - Havoc in Bloom</span>, and <span style="color:#ffd12f;" class="font-bold">Dodge Counterk - Havoc in Bloom</span> is increased by 100%.<br><size=10></span><br>Every time when Yangyang: Xuanling remains out of combat for more than 4s after she leaves the combat state or regains consciousness, she gains the following effects once:<br>- Gain <span style="color:#ffd12f;" class="font-bold">Strung Notes</span>, up to 1 stack. Casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Azure Sword Stance</span> or <span style="color:#ffd12f;" class="font-bold">Basic Attack - Feather Sword Stance</span> summons <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling: Strung Notes</span> to attack the target, dealing <span style="color:#fcc4db;">Havoc DMG</span> equal to 337.98% of Yangyang: Xuanling's ATK, considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span>. <span style="color:#ffd12f;" class="font-bold">Strung Notes</span> is removed after <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling: Strung Notes</span> is summoned.<br>- Restore 2 points of <span style="color:#ffd12f;" class="font-bold">Azure Plume</span>.<br>- Reset the Cooldown of gaining <span style="color:#ffd12f;" class="font-bold">Bated Breath</span> and <span style="color:#ffd12f;" class="font-bold">Streaming Storm</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackAzureSwordStanceStage1DMG",
          "BasicAttackAzureSwordStanceStage2DMG",
          "BasicAttackAzureSwordStanceStage3DMG",
          "BasicAttackAzureSwordStanceStage4DMG",
          "BasicAttackFeatherSwordStanceStage1DMG",
          "BasicAttackFeatherSwordStanceStage2DMG",
          "BasicAttackFeatherSwordStanceStage3DMG",
          "BasicAttackFeatherSwordStanceStage4DMG",
        ],
        modifierValue: 1,
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode2RiverCarriesHerSongAway"],
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode3MyGriefFollowsYouIntoTheClouds`,
    name: `Sequence Node 3: My grief follows you into the clouds`,
    details: `<div>The DMG dealt via Resonance Liberation <span style="color:#ffd12f;" class="font-bold">Hush of a Thousand Voices</span> is Amplified by 175%.<br><size=10></span><br>After casting <span style="color:#ffd12f;" class="font-bold">Intro Skill - Skybound Feather</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Azure</span>, or <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Feather</span>, increase the maximum <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> stacks of targets within a certain range by 3, lasting 20s. This effect does not stack.<br><size=10></span><br><span style="color:#ffd12f;" class="font-bold">Basic Attack - Azure Sword Stance Stage 4</span>, <span style="color:#ffd12f;" class="font-bold">Basic Attack - Feather Sword Stance Stage 4</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Azure Sword Stance</span>, and <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Feather Sword Stance</span> apply 1 additional stack of <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> to the target.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: ["HushOfAThousandVoicesDMG"],
        modifierValue: 1.75,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode4AcrossTheMilesALetterAndMyLonging`,
    name: `Sequence Node 4: Across the miles, a letter and my longing`,
    details: `<div>When casting <span style="color:#ffd12f;" class="font-bold">Intro Skill - Skybound Feather</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Switch: Azure</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Switch: Feather</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Azure</span>, or <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Feather</span>, the ATK of Resonators in the team is increased by 20% for 20s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode5TakeWingTakeWing`,
    name: `Sequence Node 5: Take wing. Take wing.`,
    details: `<div>When Yangyang: Xuanling takes a fatal blow, she will not be downed, but instead recover HP equal to 50% of her Max HP while becoming immune to DMG and interruption for 3s. This effect can be triggered once every 10 min.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode6LetTheAzureKeepItsLight`,
    name: `Sequence Node 6: Let the azure keep its light`,
    details: `<div>When Yangyang: Xuanling applies <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span> to a target, gain <span style="color:#ffd12f;" class="font-bold">Voice Flux</span> for 30s. While <span style="color:#ffd12f;" class="font-bold">Voice Flux</span> is active, the Heavy Attack DMG from Yangyang: Xuanling is increased by 40%.<br><size=10></span><br>After casting <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Azure</span> or <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Sword Stance Flow: Feather</span>, gain <span style="color:#ffd12f;" class="font-bold">Still as Withered Wood</span> for 30s. While <span style="color:#ffd12f;" class="font-bold">Still as Withered Wood</span> is active, if Yangyang: Xuanling is on the field, then when nearby Resonators in the team inflict <span style="color:#ffd12f;" class="font-bold">Glacio Chafe</span>, <span style="color:#ffd12f;" class="font-bold">Fusion Burst</span>, <span style="color:#ffd12f;" class="font-bold">Electro Flare</span>, <span style="color:#ffd12f;" class="font-bold">Aero Erosion</span>, <span style="color:#ffd12f;" class="font-bold">Spectro Frazzle</span>, or <span style="color:#ffd12f;" class="font-bold">Havoc Bane</span>, Yangyang: Xuanling summons <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling: Still as Withered Wood</span> to attack the target, dealing <span style="color:#fcc4db;">Havoc DMG</span> equal to 337.98% of Yangyang: Xuanling's ATK. The DMG of <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling: Still as Withered Wood</span> is considered <span style="color:#ffd12f;" class="font-bold">Heavy Attack DMG</span> and is guranteed to be a critical hit.<br><size=10></span><br><span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling: Still as Withered Wood</span> can be summoned once every 1s and expires after being summoned 5 times. When <span style="color:#ffd12f;" class="font-bold">Still as Withered Wood</span> expires or is removed, reset the available summon charges of <span style="color:#ffd12f;" class="font-bold">Shadow of Xuanling: Still as Withered Wood</span>. <span style="color:#ffd12f;" class="font-bold">Still as Withered Wood</span> has a Cooldown of 25s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "SequenceNode2RiverCarriesHerSongAway",
          "SwordStanceSwitchFeatherDMG",
          "SwordStanceSwitchAzureDMG",
          "HushOfAThousandVoicesDMG",
          "ShadowOfXuanlingDMG",
          "HeavyAttackAzureSwordStanceDMG",
          "ResonanceSkillSwordStanceFlowFeatherDMG",
          "HeavyAttackFeatherSwordStanceDMG",
          "MidAirAttackFeatherSwordStanceFeatherFallDMG",
          "BasicAttackHavocInBloomStage1DMG",
          "BasicAttackHavocInBloomStage2DMG",
          "BasicAttackHavocInBloomStage3DMG",
          "ResonanceSkillSwordStanceFlowAzureDMG",
          "DodgeCounterBasicAttackHavocInBloomStage1DMG",
          "DodgeCounterBasicAttackHavocInBloomStage2DMG",
          "DodgeCounterBasicAttackHavocInBloomStage3DMG",
          "SequenceNode1AtTheWindSBreathTheBlossomsWake",
          "SequenceNode6LetTheAzureKeepItsLight",
        ],
        modifierValue: 0.4,
      },
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6LetTheAzureKeepItsLight"],
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
