export const resonanceChains = [
  {
    key: "SequenceNode1WaxorWaneAllGildtheBough",
    name: "Sequence Node 1: Wax or Wane, All Gild the Bough",
    details: `<div>When Iuno is in <span class="ingame-Highlight"><a onclick="showTermExplan(141001)" class="ingame-term-desc">Lunar Cycle</a></span>, her ATK is increased by 40%.<br>When Iuno is inside the <span class="ingame-Highlight">Full Moon Domain</span>, she additionally restores 1 point of Resonance Energy per second.<br><span class="ingame-Highlight">Resonance Skill - Arc Beyond the Edge</span> and <span class="ingame-Highlight">Heavy Attack - Absolute Fullness</span> become immune to interruption.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2DayorNightLetThisBeEternal",
    name: "Sequence Node 2: Day or Night, Let This Be Eternal",
    details: `<div>Resonators in the team with 10 stacks of <span class="ingame-Highlight"><a onclick="showTermExplan(141002)" class="ingame-term-desc">Blessing of the Wan Light</a></span> gain an additional 40% all DMG Amplification.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3IDrinkDeepofTheirForgetting",
    name: "Sequence Node 3: I Drink Deep of Their Forgetting",
    details: `<div>When Iuno is in <span class="ingame-Highlight"><a onclick="showTermExplan(141001)" class="ingame-term-desc">Lunar Cycle</a></span>, DMG dealt by <span class="ingame-Highlight">Moonbow - Basic Attack</span>, <span class="ingame-Highlight">Resonance Skill - Arc Beyond the Edge</span>, and <span class="ingame-Highlight">Moonbow - Dodge Counter</span> is Amplified by 65%.<br>Within a certain period after performing <span class="ingame-Highlight">Moonbow - Basic Attack</span> or <span class="ingame-Highlight"> Moonbow - Dodge Counter</span>, casting <span class="ingame-Highlight">Resonance Skill - Arc Beyond the Edge</span> does not reset the cycle of <span class="ingame-Highlight">Moonbow - Basic Attack</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifySpecificTalents: [
          "MoonbowBasicAttack1DMG",
          "MoonbowBasicAttack2DMG",
          "MoonbowBasicAttack3DMG",
          "MoonbowDodgeCounterDMG",
          "ArcBeyondtheEdgeDMG",
          // enhanced versions
          "EnhancedMoonbowBasicAttack1DMG",
          "EnhancedMoonbowBasicAttack2DMG",
          "EnhancedMoonbowBasicAttack3DMG",
          "EnhancedMoonbowDodgeCounterDMG",
          "EnhancedArcBeyondtheEdgeDMG",
        ],
        modifierValue: 0.65,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4RainySeasonDwellinMyEyes",
    name: "Sequence Node 4: Rainy Season Dwell in My Eyes",
    details: `<div>Casting <span class="ingame-Highlight">Heavy Attack - Absolute Fullness</span> grants a Shield equal to 160% of Iuno's ATK to all Resonators in the team for 30s, which cannot be passed on to the incoming Resonator.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode4RainySeasonDwellinMyEyes"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5AThousandFutileGlimpses",
    name: "Sequence Node 5: A Thousand Futile Glimpses",
    details: `<div>Iuno gains 20% Resonance Liberation DMG Bonus.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6IAmtheConstantintheChaos",
    name: "Sequence Node 6: I Am the Constant in the Chaos",
    details: `<div>The DMG Multiplier of <span class="ingame-Highlight">Heavy Attack - Absolute Fullness</span> is increased by 1600%. Upon casting this skill, Iuno re-enters <span class="ingame-Highlight"><a onclick="showTermExplan(141001)" class="ingame-term-desc">Lunar Cycle</a> - New Moon</span>, gains 100 points of <span class="ingame-Highlight"><a onclick="showTermExplan(141003)" class="ingame-term-desc">Sentience</a></span>, and resets all the cooldown of <span class="ingame-Highlight">Resonance Skill - Arc Beyond the Edge</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["AbsoluteFullnessDMG"],
        modifierValue: 16,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
