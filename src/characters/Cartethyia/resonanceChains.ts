export const resonanceChains = [
  {
    key: "SequenceNode1CrownDestinedbyFate",
    name: "Sequence Node 1: Crown Destined by Fate",
    details: `<span class="skilldescription">Defeating targets with <span class="Wind"></span> as <span class="Highlight">Cartethyia</span> and <span class="Highlight">Fleurdelys</span> grants <span class="Highlight">Zeal</span> that lasts for 10s.<br>In the <span class="Highlight">Zeal</span> state, the highest stack count of <span class="Wind"></span> among the targets defeated will be recorded and inflicted upon the targets hit by her next move. This will not exceed the current max <span class="Wind"></span> stacks. <span class="Highlight">Zeal</span> is removed afterwards and enter a 1s cooldown.<br>Each time when <span class="Highlight">Fleurdelys's</span> <span class="Highlight">Resolve</span> hits 30/60/90/120, her Crit. DMG is increased by 25% for 15s. The duration of this effect does not reset upon gaining new stacks. After casting <span class="Highlight">Resonance Liberation - Blade of Howling Squall</span>, the increased Crit. DMG is removed.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2BladeBrokenbyTempest",
    name: "Sequence Node 2: Blade Broken by Tempest",
    details: `<span class="skilldescription">Casting <span class="Highlight">Resonance Liberation - A Knight's Heartfelt Prayers</span> increases the max stack limit of <span class="Wind">Aero Erosion</span> on targets within a certain range by <saptag=0>3 stack. The next attack inflicts <saptag=1>3 stack of <span class="Wind">Aero Erosion</span> on all targets hit and immediately trigger the <span class="Wind">Aero Erosion</span> DMG on the targets once without consuming the <span class="Wind">Aero Erosion</span> stacks.<br>The DMG Multipliers of <span class="Highlight">Cartethyia's</span> Basic Attack, Heavy Attack, Dodge Counter, and Intro Skill are increased by 50% and the DMG Multiplier of her Mid-air Attack is increased by 200%.<br>After casting <span class="Highlight">Mid-air Attack - Cartethyia</span>, every 1 type of Sword Shadow recalled reduces the cooldown of <span class="Highlight">Resonance Skill - Cartethyia</span> by 1s.</saptag=1></saptag=0></span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "Stage1DMG",
          "Stage2DMG",
          "Stage3DMG",
          "Stage4DMG",
          "DodgeCounterDMG",
          "HeavyAttackDMG",
          "SwordtoMarkTidesTraceDMG",
        ],
        modifierValue: 0.5,
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "MidairAttackDMG",
          "MidairAttack1SwordShadowRecalledDMG",
          "MidairAttack2SwordShadowsRecalledDMG",
          "MidairAttack3SwordShadowsRecalledDMG",
        ],
        modifierValue: 2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3PrisonerHangedintheTower",
    name: "Sequence Node 3: Prisoner Hanged in the Tower",
    details: `<span class="skilldescription"><span class="Highlight">Basic Attack - Fleurdelys Stage 5</span>, <span class="Highlight">Mid-air Attack - Fleurdelys Stage 5</span>, <span class="Highlight">Enhanced Heavy Attack - Fleurdelys</span>, and <span class="Highlight">Resonance Skill - May Tempest Break the Tides</span> now inflict <saptag=0>2 stack of <span class="Wind">Aero Erosion</span> on the targets hit.<br>The DMG Multiplier of <span class="Highlight">Resonance Skill - Blade of Howling Squall</span> is increased by 100%.</saptag=0></span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["BladeofHowlingSquallDMG"],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4SacrificeMadeforSalvation",
    name: "Sequence Node 4: Sacrifice Made for Salvation",
    details: `<span class="skilldescription">When Resonators in the team inflict <span class="Highlight">Havoc Bane</span>, <span class="Highlight">Fusion Burst</span>, <span class="Highlight">Spectro Frazzle</span>, <span class="Highlight">Electro Flare</span>, <span class="Highlight">Glacio Chafe</span> and <span class="Highlight">Aero Erosion</span>, all Resonators in the team gain 20% DMG Bonus for all Attributes for 20s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.2,
      },
      {
        modifier: "Glacio",
        modifierValue: 0.2,
      },
      {
        modifier: "Electro",
        modifierValue: 0.2,
      },
      {
        modifier: "Aero",
        modifierValue: 0.2,
      },
      {
        modifier: "Havoc",
        modifierValue: 0.2,
      },
      {
        modifier: "Spectro",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5HopeReshapedinStorms",
    name: "Sequence Node 5: Hope Reshaped in Storms",
    details: `<span class="skilldescription">When <span class="Highlight">Cartethyia</span> or <span class="Highlight">Fleurdelys</span> takes a fatal blow, they will not be downed by this instance of damage, but instead gain a Shield equal to 20% of <span class="Highlight">Cartethyia</span>'s Max HP for 10s. This effect can be triggered once every 10 min.<br>The HP cost for casting <span class="Highlight">Resonance Liberation - A Knight's Heartfelt Prayers</span> is reduced to 25% of Max HP.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["Sequence5HopeReshapedinStormsShield"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6FreedomFoundinStormsWake",
    name: "Sequence Node 6: Freedom Found in Storm's Wake",
    details: `<span class="skilldescription">After casting <span class="Highlight">Resonance Liberation - Blade of Howling Squall</span>, raise the <span class="Wind">Aero Erosion</span> stacks on the target hit to the max. <br>After casting <span class="Highlight">Intro Skill - Sword to Mark Tide's Trace</span>, <span class="Highlight">Intro Skill - Sword to Call for Freedom</span>, <span class="Highlight">Resonance Liberation - A Knight's Heartfelt Prayers</span>, and <span class="Highlight">Resonance Liberation - Blade of Howling Squall</span>,  <span class="Highlight">Fleurdelys</span> gains new abilities: For 30s, when any Resonator in the team inflicts <span class="Wind">Aero Erosion</span> on the targets with max stacks of <span class="Wind">Aero Erosion</span>, immediately trigger the <span class="Wind">Aero Erosion</span> DMG once.<br>The targets take 40% more DMG from <span class="Highlight">Fleurdelys</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
