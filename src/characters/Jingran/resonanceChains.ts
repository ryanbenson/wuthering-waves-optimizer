export const resonanceChains = [
  {
    key: `SequenceNode1YinAndYangInHarmonyTheUltimateLawOfBeing`,
    name: `Sequence Node 1: Yin and Yang in Harmony, the Ultimate Law of Being`,
    details: `<div>The DMG Multipliers of <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Encroaching Yin</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Netherworld Traverse</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Scorching Yang</span>, and <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Afterlife's Guide</span> are increased by 80%.<br><span style="color:#ffd12f;" class="font-bold">Resonance Skill - Encroaching Yin</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Netherworld Traverse</span>, <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Scorching Yang</span>, and <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Afterlife's Guide</span> are now immune to interruption.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_JingranM1_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "GroundEncroachingYinDMG",
          "AerialEncroachingYinDMG",
          "NetherworldTraverseDMG",
          "GroundScorchingYangDMG",
          "AerialScorchingYangDMG",
          "AfterlifeSGuideDMG",
        ],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode2ASolitaryLanternAcrossLandsShadeTrodden`,
    name: `Sequence Node 2: A Solitary Lantern, Across Lands Shade-Trodden`,
    details: `<div>The DMG Multipliers of <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> and <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> are increased by 46%. While in the <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> state, the DMG Multiplier increase effect via <span style="color:#ffd12f;" class="font-bold">Fire of Life</span> on <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> and <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> is increased by 46%.</span></div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_JingranM2_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "HeavyAttackSoulRaidDMG",
          "HeavyAttackStardomeMeanderDMG",
        ],
        modifierValue: 0.46,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode2ASolitaryLanternAcrossLandsShadeTroddenNether`,
    name: `Sequence Node 2: A Solitary Lantern, Across Lands Shade-Trodden`,
    details: `<div>Upon entering combat, Jingran gains the following effects, triggered once every 4s:<br>- Gains 300 point of <span style="color:#ffd12f;" class="font-bold">Qi</span>.<br>- Gains <span style="color:#ffd12f;" class="font-bold">Netherworld's Boon</span>.</span><br><br><span class="Title">Netherworld's Boon</span></span><br><br>Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> restores 25% of Max Resonance Energy and grants <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span> 180% DMG Amplification for 4s.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_JingranM2_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        // Netherworld's Boon: 180% DMG Amplification on the Heavy Attack that triggered it
        modifier: "DMGDeepen",
        modifySpecificTalents: [
          "HeavyAttackSoulRaidDMG",
          "HeavyAttackStardomeMeanderDMG",
        ],
        modifierValue: 1.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode3WorldSCourseShiftsEachToTheirRightfulPaths`,
    name: `Sequence Node 3: World's Course Shifts, Each to Their Rightful Paths`,
    details: `<div>When Jingran casts <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Soul Raid</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stardome Meander</span>, gain 5 points of <span style="color:#ffd12f;" class="font-bold">Ghost Shroud</span>.</span><br><br>When Jingran casts <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Burial of Thousand Souls</span>,<span style="color:#ffd12f;" class="font-bold">Yang Changes, Yin Unites</span> is replaced by <span style="color:#ffd12f;" class="font-bold">Yin-Yang Everflow</span>.</span><br><br><span class="Title">Yin-Yang Everflow</span></span><br><br>Jingran gains additional ATK based on Max HP: For every 1000 points of Jingran's Max HP,  gain 50 additional ATK, up to 2500.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_JingranM3_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK_FLAT:AdditionalBase",
        modifierBasedOn: "HP",
        minStatValue: 0,
        modifierStep: 1000,
        modifierValue: 50,
        maximumValue: 2500,
        modifierTargetAttr: "ATK_FLAT",
        // modifySpecificTalents: ["HeavyAttackSoulRaidDMG", "HeavyAttackStardomeMeanderDMG"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode4WhereRealityMeetsIllusionWhereLivingMeetDead`,
    name: `Sequence Node 4: Where Reality Meets Illusion, Where Living Meet Dead`,
    details: `<div>When a Resonator in the team gains a Shield, all Resonators in the team gain 20% All-Attribute DMG Bonus for 30s.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_JingranM4_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "AllElementAttributeBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode5EndsReturnToBeginningsTruthOfLifeLaidBare`,
    name: `Sequence Node 5: Ends Return to Beginnings, Truth of Life Laid Bare`,
    details: `<div>When Jingran takes a fatal blow, he will not fall and will instead gain a Shield equal to 50% of Max HP for 15s. This effect can be triggered once every 10 min. This Shield will not be passed on to the incoming Resonator.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_JingranM5_UI.webp`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode6AsFavorsAndFeudsFadeNewStoriesAwait`,
    name: `Sequence Node 6: As Favors and Feuds Fade, New Stories Await`,
    details: `<div>Targets take 40% more Heavy Attack DMG from Jingran.</span><br><br>The DMG Multiplier of <span style="color:#ffd12f;" class="font-bold">Chimei Wangliang</span> is increased by 80%.</span><br><br>Upon entering the <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> state, Jingran gains the <span style="color:#ffd12f;" class="font-bold">Parade of Thousand Souls</span> effect for 15s. During this effect, if Jingran is the active Resonator in the team, upon dealing damage, Jingran summons <span style="color:#ffd12f;" class="font-bold">Chimei Wangliang</span> to attack the targets, dealing <span style="color:#fbcaad;">Fusion DMG</span>, considered Heavy Attack DMG.</span><br><br><span style="color:#ffd12f;" class="font-bold">Chimei Wangliang</span> can be summoned this way at an interval of 1s for up to 8 times. <span style="color:#ffd12f;" class="font-bold">Parade of Thousand Souls</span> ends and the available summon charges of <span style="color:#ffd12f;" class="font-bold">Chimei Wangliang</span> reset when either of the following conditions is met:<br>- Cast <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Burial of Thousand Souls</span>.<br>- <span style="color:#ffd12f;" class="font-bold">Yinghuo</span> ends or is removed.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_JingranM6_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier:Heavy",
        modifierValue: 0.4,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "ChimeiWangliangDMG",
        ],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
