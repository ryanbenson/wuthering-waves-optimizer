export const resonanceChains = [
  {
    key: "SequenceNode1BeautyorDeathBrillianceFadesintoWithering",
    name: "Sequence Node 1: Beauty or Death, Brilliance Fades into Withering",
    details: `<span class="skilldescription">When Carlotta casts the Resonance Skill Aesthetics of Violence, her <span class="Ice">Glacio</span> damage is increased by 25% for 15 seconds.<br>
When the Resonance Skill Brilliant Will is cast and hits a target in the Chroma state, an additional 30 points of 【Spiritual Extract】 are restored.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2SilenceandDeathDecayBecomesRebirth",
    name: "Sequence Node 2: Silence and Death, Decay Becomes Rebirth",
    details: `<span class="skilldescription">When Carlotta attacks a target affected by the Dissociation effect, the critical rate of that attack is increased by 25%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3StepForwardEleganceinProgression",
    name: "Sequence Node 3: Step Forward, Elegance in Progression",
    details: `<span class="skilldescription">Outro Skill: Shattered Mirror Blossoms
After casting the Outro Skill Final Address, an additional attack is made, dealing <span class="Ice">Glacio</span> damage equal to 1032.18% of Carlotta's Attack.
The damage multiplier for the Resonance Skills Aesthetics of Violence and Brilliant Will is increased by 70%.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode3StepForwardEleganceinProgression"],
      },
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["AestheticsofViolenceDMG", "BrilliantWillDMG"],
        modifierValue: 0.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4WithOldRainaHymnofBitterWine",
    name: "Sequence Node 4: With Old Rain, a Hymn of Bitter Wine",
    details: `<span class="skilldescription">When Carlotta casts a Heavy Attack, the Heavy Attack Restrictive Strategy, or the Heavy Attack End of the Road, Resonance Skill damage for all characters in the team is increased by 25% for 30 seconds.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5SalutingtheNightPastTodayandThatMoment",
    name: "Sequence Node 5: Saluting the Night Past, Today, and That Moment",
    details: `<span class="skilldescription">The DMG Multiplier of Heavy Attack <span class="Highlight">End of the Road</span> is increased by <span class="Param">40%</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["EndoftheRoadDMG"],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6IRemaintheSameAttheEndoftheCurtain",
    name: "Sequence Node 6: I Remain the Same, At the End of the Curtain",
    details: `<span class="skilldescription">The Resonance Liberation Death Omen shot deals significantly higher damage, and the number of generated crystals is doubled, with a total multiplier increase of 145.6%.
When the Resonance Liberation Death Omen shot hits a target, it applies the Iridescent effect: the target cannot perform any actions during the effect's duration. The effect is cleared if the target takes damage or after 1.5 seconds.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["DeathOmenDMG"],
        modifierValue: 1.456,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
