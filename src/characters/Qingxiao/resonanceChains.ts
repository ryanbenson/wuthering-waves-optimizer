export const resonanceChains = [
  {
    key: `SequenceNode1LikeCloudsThatMeetAndDriftApart`,
    name: `Sequence Node 1: Like Clouds That Meet and Drift Apart`,
    details: `<div>Crit. Rate is increased by 16%.<br></span><br><br>The max stack limit of <span style="color:#ffd12f;" class="font-bold">Swordlight Ward</span> is increased to 2. Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span> additionally grants 1 stacks of <span style="color:#ffd12f;" class="font-bold">Swordlight Ward</span>.<br></span><br><br>Upon entering combat, gain 25 stack of <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span>.<br>After <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringblade</span>, <span style="color:#ffd12f;" class="font-bold">Mid-air Attack - Stringblade</span>, or <span style="color:#ffd12f;" class="font-bold">Basic Attack - Ephemeral Transcendence</span> deals damage, if Qingxiao has <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span>, remove <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> and trigger <span style="color:#ffd12f;" class="font-bold">Juque Perdition</span>, dealing <span style="color:#c7ffed";>Aero DMG</span> equal to 400% of Qingxiao's ATK, considered Basic Attack DMG. This effect can be triggered up to once per second. For each stack of <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> removed, the target takes 4% more DMG from <span style="color:#ffd12f;" class="font-bold">Juque Perdition</span> for 1s.<br><span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> stacks up to 25 times.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.16,
      },
      {
        modifier: "EnableAttack",
        modifierValue: [
          "SequenceNode1LikeCloudsThatMeetAndDriftApart",
        ],
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode2LikePetalsThatFallWithoutASound`,
    name: `Sequence Node 2: Like Petals That Fall Without a Sound`,
    details: `<div>The DMG Multiplier of <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span> is increased by 40%.<br></span><br><br>The max stack limit of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on nearby enemies is increased to 25.<br>The max stack limit of <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> for <span style="color:#ffd12f;" class="font-bold">Inherent Skill - Sea of Thought, World of Dust</span> is increased to 25.<br></span><br><br><span style="color:#ffd12f;" class="font-bold">Heaven's Clarity</span> is enhanced:<br>Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span> now inflicts 6 stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on nearby targets.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "HeavyAttackStringbladeDMG",
        ],
        modifierValue: 0.4,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode3DreamsFadeSwordAbides`,
    name: `Sequence Node 3: Dreams Fade, Sword Abides`,
    details: `<div>The Crit. DMG of <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Billows Beneath Heaven</span> is increased by 100%.<br></span><br><br>During <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, gain <span style="color:#ffd12f;" class="font-bold">World in Chorus</span> stacks equal to the highest <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stack count present among nearby enemies.<br><span style="color:#ffd12f;" class="font-bold">World in Chorus</span>: Each stack increases the DMG Multiplier of <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span> by 3%. <span style="color:#ffd12f;" class="font-bold">World in Chorus</span> is removed after casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span>.<br></span><br><br>The <span style="color:#ffd12f;" class="font-bold">Gathered Mind</span> effect of <span style="color:#ffd12f;" class="font-bold">Inherent Skill - Sea of Thought, World of Dust</span> now inflicts 2 stacks of <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifySpecificTalents: [
          "BillowsBeneathHeavenDMG",
        ],
        modifierValue: 1,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode4WhereverTheRoadLeadsSideBySide`,
    name: `Sequence Node 4: Wherever the Road Leads, Side by Side`,
    details: `<div>After a Resonator in the team inflicts <span style="color:#ffd12f;" class="font-bold">Tune Strain - Shifting</span>, that Resonator's ATK is increased by 20% for 8s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.2,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode5ColdSteelThatLongsToWarmTheSnow`,
    name: `Sequence Node 5: Cold Steel That Longs to Warm the Snow`,
    details: `<div>The DMG Multiplier of <span style="color:#ffd12f;" class="font-bold">Resonance Skill - Severing Note: Judgement</span> is increased by 100%.<br></span><br><br>While moving in <span style="color:#ffd12f;" class="font-bold">Sword Flight</span>, <span style="color:#ffd12f;" class="font-bold">Flight Qi</span> cost is reduced by 30%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "SeveringNoteJudgementDMG",
        ],
        modifierValue: 1,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: `SequenceNode6CleanseThisTarnishedAgeTillAllRunsClear`,
    name: `Sequence Node 6: Cleanse This Tarnished Age, Till All Runs Clear`,
    details: `<div>Targets take 40% more DMG from Qingxiao's <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span>, and <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Billows Beneath Heaven</span>.<br></span><br><br>During <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, gain <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> stacks equal to the highest <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stack count present among nearby enemies.<br></span><br><br>For each stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on the target, the DMG of <span style="color:#ffd12f;" class="font-bold">Juque Perdition</span> taken by the target is Amplified by 2%. The first 7 stack additionally grant 5% DMG Amplification.<br></span><br><br>When <span style="color:#ffd12f;" class="font-bold">Inherent Skill - To Know, To Banish</span> is unlocked, the DMG of <span style="color:#ffd12f;" class="font-bold">Juque Perdition</span> on targets with <span style="color:#ffd12f;" class="font-bold">Mindlock</span> is increased by 2% for each stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span>. The first 7 stacks additionally grant 5% DMG increase.<br></span><br><br>The effect of Qingxiao's response to <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span> is increased by 20%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "HeavyAttackStringbladeDMG",
          "HeavenSReckoningEphemeralTranscendenceDMG",
          "BillowsBeneathHeavenDMG",
        ],
        modifierValue: 0.4,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
