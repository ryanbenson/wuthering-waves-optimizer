export const resonanceChains = [
  {
    key: "SequenceNode1WarmLightandBedsideWishesAbsolution",
    name: "Sequence Node 1: Warm Light and Bedside Wishes - Absolution",
    details: `<span class="skilldescription">When in <span class="Highlight">Absolution</span>, Resonance Liberation <span class="Highlight">Dawn of Enlightenment</span> now increases DMG Multiplier by 480% instead of 255%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiplySetValue",
        modifySpecificTalents: ["DawnofEnlightenmentDMG"],
        modifierValue: 4.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode1WarmLightandBedsideWishesConfession",
    name: "Sequence Node 1: Warm Light and Bedside Wishes - Confession",
    details: `<span class="skilldescription">When in <span class="Highlight">Confession</span>, Resonance Liberation <span class="Highlight">Dawn of Enlightenment </span> increases DMG Multiplier by 90% and applies <span class="Highlight">Spectro Frazzle</span> to the targets with the maximum stack the targets can receive.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DawnofEnlightenmentDMG"],
        modifierValue: 0.9,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ABoatAdriftinTearsAbsolution",
    name: "Sequence Node 2: A Boat Adrift in Tears - Absolution",
    details: `<span class="skilldescription">When in <span class="Highlight">Absolution</span>, DMG dealt by Outro Skills to targets with <span class="Highlight">Spectro Frazzle</span> is Amplified by 120%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:Outro",
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ABoatAdriftinTearsConfession",
    name: "Sequence Node 2: A Boat Adrift in Tears - Confession",
    details: `<span class="skilldescription">When in <span class="Highlight">Confession</span>, <span class="Highlight">Silent Prayer</span> grants 120% more DMG Amplification for <span class="Highlight">Spectro Frazzle</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:SpectroFrazzle",
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3DaisyWreathsandDreamsAbsolution",
    name: "Sequence Node 3: Daisy Wreaths and Dreams - Absolution",
    details: `<span class="skilldescription">When in <span class="Highlight">Absolution</span>, the DMG Multiplier of Heavy Attack <span class="Highlight">Starflash</span> is increased by 91%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["HeavyAttackStarflashDMG"],
        modifierValue: 0.91,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3DaisyWreathsandDreamsConfession",
    name: "Sequence Node 3: Daisy Wreaths and Dreams - Confession",
    details: `<span class="skilldescription">When in <span class="Highlight">Confession</span>, the DMG Multiplier of Heavy Attack <span class="Highlight">Starflash</span> is increased by 249%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["HeavyAttackStarflashDMG"],
        modifierValue: 2.49,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4RingingBellsonWingsAloft",
    name: "Sequence Node 4: Ringing Bells on Wings Aloft",
    details: `<span class="skilldescription">When <span class="Highlight">Basic Attack</span>, Basic Attack <span class="Highlight">Chamuel's Star</span>, <span class="Highlight">Dodge Counter</span>, or <span class="Highlight">Chamuel‘s Star: Dodge Counter</span> hits, the target's Spectro RES is reduced by 10% for 30s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResistShred:Spectro",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5PrayertotheDistantLight",
    name: "Sequence Node 5: Prayer to the Distant Light",
    details: `<span class="skilldescription">Casting Intro Skill <span class="Highlight">Golden Grace</span> increases Phoebe's Spectro DMG Bonus by 12% for 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6WhisperingChirpsinSilence",
    name: "Sequence Node 6: Whispering Chirps in Silence",
    details: `<span class="skilldescription">Targets entering the Ring of Mirrors are stagnated for an additional 2s. The stagnation effect affects all targets entering the Ring of Mirrors and can be applied to 12 targets max for each Ring of Mirrors. Each target will only be affected by this effect once.<br>When in <span class="Highlight">Absolution</span> or <span class="Highlight">Confession</span>, summoning a Ring of Mirrors with <span class="Highlight">Resonance Skill</span> increases Pheobe's ATK by 10% for 20s, and triggers an extra Heavy Attack <span class="Highlight">Starflash</span> at the Ring of Mirrors' location. This Heavy Attack <span class="Highlight">Starflash</span> does not consume Divine Voice and is not considered as casting a <span class="Highlight">Heavy Attack</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
