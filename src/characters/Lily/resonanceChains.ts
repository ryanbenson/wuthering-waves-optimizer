export const resonanceChains = [
  {
    key: `SequenceNode1LookWhiteFlowersFromTheRuinsOfDreams`,
    name: `Sequence Node 1: Look, White Flowers from the Ruins of Dreams`,
    details: `<div>Lily is immune to interruption while casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Fairytale</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Phantasm</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Fairytale's Finale</span>, or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Phantasm's End</span>.<br>While <span style="color:#ffd12f;" class="font-bold">Cradle Lullaby</span> is active, each <span style="color:#ffd12f;" class="font-bold">Intro Skill</span> cast by a Resonator in the team other than Lily now grants 2 stacks of <span style="color:#ffd12f;" class="font-bold">Dream Aroma</span>.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_LiliM1_UI.webp`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode2ListenARequiemFromTheDreamCradle`,
    name: `Sequence Node 2: Listen, a Requiem from the Dream Cradle`,
    details: `<div>While <span style="color:#ffd12f;" class="font-bold">Cradle Lullaby</span> is active, when a Resonator in the team other than Lily casts an <span style="color:#ffd12f;" class="font-bold">Intro Skill</span>, each stack of <span style="color:#ffd12f;" class="font-bold">Dream Aroma</span> additionally increases Crit. Rate by 2% and Crit. DMG by 6%.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_LiliM2_UI.webp`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.02,
      },
      {
        modifier: "CritDMG",
        modifierValue: 0.06,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode3MayYourSoulWanderNoMore`,
    name: `Sequence Node 3: May Your Soul Wander No More`,
    details: `<div>Lily additionally gains 170 points of <span style="color:#ffd12f;" class="font-bold">Dream Perfume</span> upon entering combat, triggered once every 12s. When Lily deals DMG with <span style="color:#ffd12f;" class="font-bold">Intro Skill - Eternal Bloom</span>, she additionally gains 170 points of <span style="color:#ffd12f;" class="font-bold">Dream Perfume</span>.<br>Casting <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Into the Dream Cradle</span> additionally restores 10 points of Concerto Energy.<br>Dealing DMG with <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Fairytale's Finale</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Phantasm's End</span> additionally restores 10 points of Resonance Energy.<br>During <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Fairytale</span> or <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Woven Phantasm</span>, Lily gains <span style="color:#ffd12f;" class="font-bold">Dreambell Chime</span> faster.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_LiliM3_UI.webp`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode4MayYourPastSinkIntoSilence`,
    name: `Sequence Node 4: May Your Past Sink into Silence`,
    details: `<div><span style="color:#ffd12f;" class="font-bold">Slumberland</span>'s healing is increased by 30%.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_LiliM4_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        // The game's data lists a separate Slumberland heal at exactly 1.3x the
        // base multiplier, so this scales the multiplier rather than adding
        // Healing Bonus.
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["SlumberlandHealing"],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode5MayYouFindPeaceInEndlessLight`,
    name: `Sequence Node 5: May You Find Peace in Endless Light`,
    details: `<div>While Lily is in <span style="color:#ffd12f;" class="font-bold">Slumberland</span>, the pull-in effect range is increased by 50% when a Resonator in the team casts <span style="color:#ffd12f;" class="font-bold">Intro Skill</span>.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_LiliM5_UI.webp`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode6MayMyReverieNeverEnd`,
    name: `Sequence Node 6: May My Reverie Never End`,
    details: `<div>The <span style="color:#f8e56cff;">Spectro DMG</span> dealt by <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Fairytale's Finale</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Phantasm's End</span> is additionally increased by 100%.<br>The <span style="color:#f8e56cff;">Spectro DMG</span> dealt by <span style="color:#ffd12f;" class="font-bold">Intro Skill - Eternal Bloom</span> is additionally increased by 700%.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_LiliM6_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifySpecificTalents: [
          "HeavyAttackFairytaleSFinaleDMG",
          "HeavyAttackPhantasmSEndDMG",
        ],
        modifierValue: 1,
      },
      {
        modifySpecificTalents: ["IntroSkillEternalBloomDMG"],
        modifierValue: 7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
