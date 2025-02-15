export const resonanceChains = [
  {
    key: "Sequence1ByCurrentsandWinds",
    name: "Sequence Node 1: By Currents and Winds",
    details: `<span class="skilldescription"><span class="Highlight">Returned from Ashes</span> temporarily causes nearby targets to stagnate while casting. The stagnation effect is removed when Brant is switched off the field.<br>After casting Intro Skill <span class="Highlight">Applaud for Me!</span> or each <span class="Highlight">flip</span> following Mid-air Attack, Brant's DMG dealt is increased by 20% for 5s, stacking up to 3 times.</span>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2ForSmilesandCheers",
    name: "Sequence Node 2: For Smiles and Cheers",
    details: `<span class="skilldescription">Brant's Crit. Rate increases by 30% when <span class="Highlight">Mid-air Attack</span> and <span class="Highlight">Returned from Ashes</span>. <br>Brant's Outro Skill <span class="Highlight">The Course is Set!</span> gains new enhancement. Within 20s after Brant's Outro Skill:<br>When <span class="Highlight">Resonance Skill</span> cast by the incoming Resonator (or nearby Resonators who activate Brant's Outro Skill) hits a target, Brant blasts the target, dealing <span class="Fire">Fusion DMG</span> equal to 440% of Brant's ATK (considered Basic Attack DMG). Up to <saptag=3>1explosion per second, max 2 explosions.<br>- This effect remains active when Brant is switched off the field.</saptag=3></span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifySpecificTalents: [
          "MidairAttackStage1DMG",
          "MidAirAttackStage1ChargedAttackDMG",
          "MidAirAttackStage1FlipDMG",
          "MidAirAttackStage1SlashDMG",
          "MidAirAttackStage2DMG",
          "MidairAttackStage2ChargedAttackDMG",
          "MidairAttackStage2FlipDMG",
          "MidairAttackStage3DMG",
          "MidairAttackStage3FlipDMG",
          "MidairAttackStage4DMG",
        ],
        modifierValue: 0.3,
      },
      {
          modifier: "EnableAttack",
          modifierValue: ["SequenceNode2ForSmilesandCheers"],
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3ThroughStormsISail",
    name: "Sequence Node 3: Through Storms I Sail",
    details: `<span class="skilldescription">The multiplier of the DMG dealt by <span class="Highlight">Returned from Ashes</span> is increased by 42%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "ReturnedfromAshesDMG",
          "S6AlltheWorldsaCaptainsCarnevaleBlastDMG",
        ],
        modifierValue: 0.42,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ToFreedomISing",
    name: "Sequence Node 4: To Freedom I Sing",
    details: `<span class="skilldescription">The Shield obtained from <span class="Highlight">Returned from Ashes</span> is increased by 20%. Casting <span class="Highlight">Returned from Ashes</span> restores HP for all nearby Resonators in the team (6.60 HP for every 1% Energy Regen).</span>`,
    hasStacks: false,
    modifiers: [
      {
          modifier: "EnableAttack",
          modifierValue: ["SequenceNode4ToFreedomISing"],
      },
      {
        modifySpecificTalents: [
          "ReturnedfromAshesShield",
        ],
        modifierValue: 0.2,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5AlltheWorldsanActorsStage",
    name: "Sequence Node 5: All the World's an Actor's Stage",
    details: `<span class="skilldescription">When dealing Basic Attack DMG to the target, Brant's <span class="Highlight">Basic Attack DMG Bonus</span> is increased by 15% for 10s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6AlltheWorldsaCaptainsCarnevale",
    name: "Sequence Node 6: All the World's a Captain's Carnevale",
    details: `<span class="skilldescription"><span class="Highlight">Mid-air Attack's</span> multiplier is increased by 30%. Casting <span class="Highlight">Returned from Ashes</span> causes a secondary blast, dealing <span class="Fire">Fusion DMG</span>, considered Basic Attack DMG, equal to 30% of the DMG dealt by <span class="Highlight">Returned from Ashes</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "MidairAttackStage1DMG",
          "MidAirAttackStage1ChargedAttackDMG",
          "MidAirAttackStage1FlipDMG",
          "MidAirAttackStage1SlashDMG",
          "MidAirAttackStage2DMG",
          "MidairAttackStage2ChargedAttackDMG",
          "MidairAttackStage2FlipDMG",
          "MidairAttackStage3DMG",
          "MidairAttackStage3FlipDMG",
          "MidairAttackStage4DMG",
        ],
        modifierValue: 0.3,
      },
      {
          modifier: "EnableAttack",
          modifierValue: ["SequenceNode6AlltheWorldsaCaptainsCarnevale"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
