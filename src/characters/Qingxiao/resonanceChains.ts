export const resonanceChains = [
  {
    key: `SequenceNode1LikeCloudsThatMeetAndDriftApart`,
    name: `Sequence Node 1: Like Clouds That Meet and Drift Apart`,
    details: `<div>Crit. Rate is increased by 16%.<br><size=10></span><br><br><span style="color:#ffd12f;" class="font-bold">Swordlight Ward</span> max stack limit is increased to 2. Casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span> additionally grants 1 stack(s) of <span style="color:#ffd12f;" class="font-bold">Swordlight Ward</span>.</div>`,
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
    details: `<div><span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span> DMG Multiplier is increased by 40%.<br><size=10></span><br><br><span style="color:#ffd12f;" class="font-bold">Heaven's Clarity</span> is now enhanced:<br>When casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, Qingxiao now applies 5 stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on nearby targets.<br><size=10></span><br><br>During <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, gain stacks of <span style="color:#ffd12f;" class="font-bold">World in Chorus</span> equal to the highest <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stack count among nearby enemies.<br><span style="color:#ffd12f;" class="font-bold">World in Chorus</span>: Each stack increases <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span> DMG Multiplier by 3%. Removed after casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span>.</div>`,
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
    details: `<div><span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Billows Beneath Heaven</span> Crit. DMG is increased by 100%.<br><size=10></span><br><br>The max stack limit of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> on nearby targets is increased to 25.<br><size=10></span><br><br><span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> of <span style="color:#ffd12f;" class="font-bold">Inherent Skill - Sea of Thought, World of Dust</span> is now enhanced:<br>When Resonators in the team deals <span style="color:#ffd12f;" class="font-bold">Tune Break DMG</span> to <span style="color:#ffd12f;" class="font-bold">Mistuned</span> targets affected by <span style="color:#ffd12f;" class="font-bold">Tune Strain - Shifting</span>, apply <span style="color:#ffd12f;" class="font-bold">Mindlock</span> equal to Qingxiao's <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> stacks and 2 stacks of <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span>. This effect can be triggered 1 time per target.<br>When Qingxiao is knocked out, she will not gain <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> and all current <span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> effects are removed.<br><span style="color:#ffd12f;" class="font-bold">Mind Coalescence</span> has a maximum of 25 stacks, lasting for 30s.</div>`,
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
    details: `<div>When Resonators in the team apply <span style="color:#ffd12f;" class="font-bold">Tune Strain - Shifting</span>, ATK is increased by 20%, lasting 8s.</div>`,
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
    details: `<div><span style="color:#ffd12f;" class="font-bold">Resonance Skill - Severing Note: Judgement</span> DMG Multiplier is increased by 100%.<br><size=10></span><br><br>The <span style="color:#ffd12f;" class="font-bold">Flight Qi</span> consumption of <span style="color:#ffd12f;" class="font-bold">Sword Flight</span> is reduced by 30%.</div>`,
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
    details: `<div>Targets take 30% more DMG from Qingxiao's <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Heaven's Reckoning: Ephemeral Transcendence</span>, and <span style="color:#ffd12f;" class="font-bold">Resonance Liberation - Billows Beneath Heaven</span>.<br><size=10></span><br><br>The buff effect provided by Qingxiao responding to <span style="color:#ffd12f;" class="font-bold">Tune Strain - Interfered</span> is increased by 60%.<br><size=10></span><br><br>When casting <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span>, gain stacks of <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> equal to the highest <span style="color:#ffd12f;" class="font-bold">Mindlock</span> stack count among nearby targets. When casting <span style="color:#ffd12f;" class="font-bold">Basic Attack - Stringblade</span> or <span style="color:#ffd12f;" class="font-bold">Mid-air Attack - Stringblade</span>, or <span style="color:#ffd12f;" class="font-bold">Basic Attack - Ephemeral Transcendence</span>, if <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> has reached 10 stacks, <span style="color:#ffd12f;" class="font-bold">Juque Perdition</span> will be triggered, dealing <span style="color:#c7ffed";>Aero DMG</span> equal to 400% of Qingxiao's ATK, considered Basic Attack DMG. This effect can trigger up to once per second.<br><span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> has a maximum of 50 stacks. Triggering <span style="color:#ffd12f;" class="font-bold">Juque Perdition</span> reduces <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span> stacks by 10<br><size=10></span><br><br>Upon entering combat, gain 50 stacks of <span style="color:#ffd12f;" class="font-bold">Exorcising Seal</span>. The first cast of <span style="color:#ffd12f;" class="font-bold">Heavy Attack - Stringblade</span> additionally applies 7 stack of <span style="color:#ffd12f;" class="font-bold">Mindlock</span> to nearby targets.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "HeavyAttackStringbladeDMG",
          "HeavenSReckoningEphemeralTranscendenceDMG",
          "BillowsBeneathHeavenDMG",
        ],
        modifierValue: 0.3,
      },
      {
        modifier: "EnableAttack",
        modifierValue: [
          "SequenceNode6CleanseThisTarnishedAgeTillAllRunsClear",
        ],
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  }
];
