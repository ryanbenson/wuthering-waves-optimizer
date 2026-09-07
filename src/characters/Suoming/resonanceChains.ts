export const resonanceChains = [
  {
    key: `SequenceNode1IntoTheBlightRain`,
    name: `Sequence Node 1: Into the Blight Rain`,
    details: `<div><span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Unfurled Canopy: Unforsaken Mind</span> is immune to interruption.<br>The DMG Multipliers of <span style="color:#ffd12f;" class="font-bold">Intro Skill - Furled Canopy: Flash Rift</span>, <span style="color:#ffd12f;" class="font-bold">Intro Skill - Unfurled Canopy: Thunder Rending</span>, <span style="color:#ffd12f;" class="font-bold">Intro Skill - Furled Canopy: Sealed Delusion (Unison)</span>, and <span style="color:#ffd12f;" class="font-bold">Intro Skill - Unfurled Canopy: Whirling Thunder (Unison)</span> are increased by 60%.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_SuomingM1_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "IntroSkillFurledCanopyFlashRiftDMG",
          "IntroSkillUnfurledCanopyThunderRendingDMG",
          "IntroSkillFurledCanopySealedDelusionUnisonDMG",
          "IntroSkillUnfurledCanopyWhirlingThunderUnisonDMG",
        ],
        modifierValue: 0.6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode2BreakingThunderSlayingEvil`,
    name: `Sequence Node 2: Breaking Thunder, Slaying Evil`,
    details: `<div>Crit. DMG is increased by 40%.<br>Casting <span style="color:#ffd12f;" class="font-bold">Outro Skill</span> increases the incoming Resonator's Crit. DMG by 10%, plus an additional 6% for each stack of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span> they have, up to 24%. This effect lasts for 30s or until the Resonator is switched out.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_SuomingM2_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode3LoneCanopySolitaryRoad`,
    name: `Sequence Node 3: Lone Canopy, Solitary Road`,
    details: `<div>Casting <span style="color:#ffd12f;" class="font-bold">Intro Skill - Furled Canopy: Flash Rift</span> or <span style="color:#ffd12f;" class="font-bold">Intro Skill - Unfurled Canopy: Thunder Rending</span> grants 1 stacks of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span>. This effect can be triggered once every 25s.<br>- If Suoming has already granted <span style="color:#ffd12f;" class="font-bold">Unison Boon</span> and it still exists, triggering this effect only resets the duration of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span>.<br><br>Casting <span style="color:#ffd12f;" class="font-bold">Resonance Liberation</span> grants Suoming 30% Basic Attack DMG Amplification for 25s.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_SuomingM3_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:Basic",
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode4CovenantBorneUponTheHeart`,
    name: `Sequence Node 4: Covenant Borne Upon the Heart`,
    details: `<div>Suoming's ATK is increased by 20%.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_SuomingM4_UI.webp`,
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
    key: `SequenceNode5SealDeepNeverForgotten`,
    name: `Sequence Node 5: Seal Deep, Never Forgotten`,
    details: `<div>The DMG Multiplier of <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Umbral Canopy: Miasma Lock</span> is increased by 40%.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_SuomingM5_UI.webp`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["ResonanceLiberationUmbralCanopyMiasmaLockDMG"],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode6NineShadowsAtHerSide`,
    name: `Sequence Node 6: Nine Shadows at Her Side`,
    details: `<div>The effect of each stack of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span> is increased by 50%, up to 4 stacks of <span style="color:#ffd12f;" class="font-bold">Unison Boon</span>.<br>The DMG Multiplier of <span style="color:#ffd12f;" class="font-bold">Basic Attack - Umbral Canopy: Engraved Heart</span> is increased by 50%.<br>When Suoming has <span style="color:#ffd12f;" class="font-bold">Seal Master</span>, her Crit. DMG is further increased by 80%.</div>`,
    icon: `https://api.encore.moe/resource/Data/Game/Aki/UI/UIResources/Common/Image/IconDevice/T_IconDevice_SuomingM6_UI.webp`,
    hasStacks: false,
    // The Unison Boon max-stacks increase (2 -> 4) and per-stack value
    // increase (+50%), and the conditional +80% Crit. DMG while Seal Master
    // is active, are stack/state-dependent and are handled in
    // effectiveBuffStacks.ts and stats.ts (computeSelfBuffs), mirroring
    // Hsin's SequenceNode6TheMoonOwesItsLightToTheLiving UnisonBoon handling.
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["BasicAttackUmbralCanopyEngravedHeartDMG"],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
