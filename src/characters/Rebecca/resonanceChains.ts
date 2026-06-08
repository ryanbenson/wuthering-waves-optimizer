export const resonanceChains = [
  {
    key: "SequenceNode1TryNottoGetintheWay",
    name: "Sequence Node 1: Try Not to Get in the Way!",
    details: `<div>The DMG Multipliers of the following skills are increased by 50%: <br>- <span style="color:#f7ca2f"><strong>Basic Attack - Huntress</strong></span>, <span style="color:#f7ca2f"><strong>Heavy Attack - Huntress</strong></span>, <span style="color:#f7ca2f"><strong>Tactical Dodge - Huntress</strong></span>, and <span style="color:#f7ca2f"><strong>Dodge Counter - Huntress</strong></span><br>- <span style="color:#f7ca2f"><strong>Basic Attack - Guts</strong></span>, <span style="color:#f7ca2f"><strong>Tactical Dodge - Guts</strong></span>, <span style="color:#f7ca2f"><strong>Dodge Counter - Guts</strong></span>.<br>When <span style="color:#f7ca2f"><strong><a href="#WwLink130804" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130804">A Girl Gets What She Wants!</a></strong></span> is triggered, Rebecca gains 3 additional stacks of Street Smarts for 12s. Upon performing <span style="color:#f7ca2f"><strong>Tactical Dodge - Huntress</strong></span> or <span style="color:#f7ca2f"><strong>Tactical Dodge - Guts</strong></span>, if Rebecca has sufficient Street Smarts stacks, 1 stack will be consumed to restore 20 STA.<br>Resonance Liberation <span style="color:#f7ca2f"><strong>BOOM! Fireworks!</strong></span> is immune to interruption.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackHuntressStage1DMG",
          "BasicAttackHuntressStage2DMG",
          "BasicAttackHuntressStage3DMG",
          "HeavyAttackHuntressDMG",
          "TacticalDodgeHuntressDMG",
          "TacticalDodgeHuntressSuccessfulDodgeDMG",
          "DodgeCounterHuntressDMG",
          "BasicAttackGutsStage1DMG",
          "BasicAttackGutsStage2DMG",
          "BasicAttackGutsStage3DMG",
          "TacticalDodgeGutsDMG",
          "TacticalDodgeGutsSuccessfulDodgeDMG",
          "DodgeCounterGutsDMG",
        ],
        modifierValue: 0.5,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2OhHeyChoom",
    name: "Sequence Node 2: Oh, Hey Choom! - All-Attribute",
    details: `<div>Casting <span style="color:#f7ca2f"><strong>Intro Skill - Yo, It's Big Boomin' Time!</strong></span>, <span style="color:#f7ca2f"><strong>Intro Skill - Hey, Leadhead, Come 'n' Get Me!</strong></span>, or <span style="color:#f7ca2f"><strong>Resonance Liberation - Party 'til Dawn!</strong></span> grants 20% All-Attribute DMG Bonus for all Resonators in the team for 30s.<br><span style="color:#f7ca2f"><strong><a href="#WwLink130806" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130806">Hot Hand</a></strong></span> regenerates twice as fast when Rebecca is out of combat.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.2,
      },
      {
        modifier: "Electro",
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
      {
        modifier: "Aero",
        modifierValue: 0.2,
      },
      {
        modifier: "Glacio",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2OhHeyChoomDMGDeepen",
    name: "Sequence Node 2: Oh, Hey Choom! - DMG Deepen",
    details: `<div>When Resonators in the team inflict <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span>, they gain 15% All DMG Amplification for 30s.<br><span style="color:#f7ca2f"><strong><a href="#WwLink130806" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130806">Hot Hand</a></strong></span> regenerates twice as fast when Rebecca is out of combat.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3DontSweatYourSix",
    name: "Sequence Node 3: Don't Sweat Your Six!",
    details: `<div>Rebecca's <span style="color:#f7ca2f"><strong>Resonance Liberation - Party 'til Dawn!</strong></span>, and <span style="color:#f7ca2f"><strong>Resonance Liberation - BOOM! Fireworks!</strong></span> gain 60% DMG Multiplier increase.<br>Rebecca's <span style="color:#f7ca2f"><strong>Resonance Liberation - Party 'til Dawn!</strong></span> gains 30% more explosion range.<br>Casting <span style="color:#f7ca2f"><strong>Intro Skill - Yo, It's Big Boomin' Time!</strong></span> or <span style="color:#f7ca2f"><strong>Intro Skill - Hey, Leadhead, Come 'n' Get Me!</strong></span> grants 120 points of <span style="color:#f7ca2f"><strong><a href="#WwLink130806" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130806">Hot Hand</a></strong></span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "Mk31HMGDMG",
          "Mk31HMG1stEnhancementDMG",
          "Mk31HMG2ndEnhancementDMG",
          "BOOMFireworksDMG",
        ],
        modifierValue: 0.6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4GotYaCovered",
    name: "Sequence Node 4: Got Ya Covered!",
    details: `<div>Rebecca gains an additional 60% Stat Bonus increase from the <span style="color:#f7ca2f"><strong><a href="#WwLink130804" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130804">A Girl Gets What She Wants!</a></strong></span> effect.</div>`,
    hasStacks: false,
    modifiers: [
      // handled in the stats system
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5DreaminontheEdge",
    name: "Sequence Node 5: Dreamin' on the Edge",
    details: `<div>Rebecca gains 20% Basic Attack DMG Bonus for 8s when she inflicts <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6MaybeJustMaybe",
    name: "Sequence Node 6: Maybe, Just Maybe...",
    details: `<div>Rebecca's Basic Attack DMG Bonus from every source is increased by 40%.<br>During <span style="color:#f7ca2f"><strong>Heavy Attack - Rat-tat-tat!: Huntress</strong></span> or <span style="color:#f7ca2f"><strong>Heavy Attack - Bang-bang-bang!: Guts</strong></span>, Rebecca deals an additional instance of <span style="color:#b45bff"><strong>Electro DMG</strong></span> equal to 900% of her ATK, considered Basic Attack DMG.<br>Rebecca recovers an additional 20 points of <span style="color:#f7ca2f"><strong><a href="#WwLink130806" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130806">Hot Hand</a></strong></span> when she is casting <span style="color:#f7ca2f"><strong>Heavy Attack - Rat-tat-tat!: Huntress</strong></span> or <span style="color:#f7ca2f"><strong>Heavy Attack - Bang-bang-bang!: Guts</strong></span>.<br>When Rebecca takes a fatal blow, she does not fall to the damage and instead restores fixed 2077 HP for 5 times immediately. This effect is triggered once every 10 min.<br>When Rebecca stays out of combat for more than 4s, she restores 120 points of <span style="color:#f7ca2f"><strong><a href="#WwLink130805" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="130805">Fervor</a></strong></span>. This effect is triggered once every 4s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6MaybeJustMaybe"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
