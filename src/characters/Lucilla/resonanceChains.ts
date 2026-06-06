export const resonanceChains = [
  {
    key: "SequenceNode1DistantNoon",
    name: "Sequence Node 1: Distant Noon",
    details: `<div>While casting <span style="color:#f7ca2f"><strong>Resonance Skill - Phantom Frame</strong></span> to deploy <span style="color:#f7ca2f"><strong>Focus Ring</strong></span>, the first time landing the cursor within <span style="color:#f7ca2f"><strong>Perfect Focus</strong></span> will immediately expand <span style="color:#f7ca2f"><strong>Perfect Focus</strong></span> to fill up <span style="color:#f7ca2f"><strong>Focus Ring</strong></span>. <br>Lucilla's Crit. Rate increases by 20% for 10s when <span style="color:#f7ca2f"><strong>Resonance Skill - Spotlight</strong></span> is cast.<br>Lucilla is immune to interruptions while casting <span style="color:#f7ca2f"><strong>Resonance Skill - Phantom Frame</strong></span> and <span style="color:#f7ca2f"><strong>Basic Attack - Tracing Forms Stage 3</strong></span>.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackPolychromeLeap1",
          "BasicAttackPolychromeLeap2",
          "BasicAttackPolychromeLeap3",
        ],
        modifierValue: 1.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2SlumberingMoonlight",
    name: "Sequence Node 2: Slumbering Moonlight",
    details: `<div>While casting <span style="color:#f7ca2f"><strong>Resonance Liberation - Clear As Day</strong></span>, Lucilla grants the following enhancements based on her <span style="color:#f7ca2f"><strong>Resonance Mode</strong></span>:<br>- When in <span style="color:#f7ca2f"><strong>Resonance Mode - Glacio Chafe</strong></span>, <span style="color:#f7ca2f"><strong><a href="#WwLink850010" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="850010">Glacio Chafe</a></strong></span> DMG against targets within a certain range around the active Resonator is Amplified by 80%.<br>- When in <span style="color:#f7ca2f"><strong>Resonance Mode - Echo</strong></span>, grant 40% Echo Skill DMG Amplification to Resonators in the team.<br>These enhancements last as long as <span style="color:#f7ca2f"><strong><a href="#WwLink110905" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110905">Reminiscence</a></strong></span> is active and remain effective for 30s after <span style="color:#f7ca2f"><strong><a href="#WwLink110905" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110905">Reminiscence</a></strong></span> ends.<br>These effects end when Lucilla switches Resonance Modes.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen",
        modifierValue: 0.25,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3DaysFadeUnheard",
    name: "Sequence Node 3: Days Fade Unheard",
    details: `<div>The DMG Multiplier of <span style="color:#f7ca2f"><strong>Resonance Liberation - Letting It Go</strong></span> is increased by 100%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BasicAttackVisualImpactDMG",
          "BasicAttackIridescentSplashDMG",
        ],
        modifierValue: 0.9,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4ThePastFadesIntoSilence",
    name: "Sequence Node 4: The Past Fades Into Silence",
    details: `<div><span style="color:#f7ca2f"><strong>Oblivion</strong></span> pulls in nearby targets on hit. While casting <span style="color:#f7ca2f"><strong>Oblivion</strong></span>, Lucilla's ATK is increased by 10% for 6s, stacking up 3 times. All stacks are removed when the duration ends.<br>While casting <span style="color:#f7ca2f"><strong>Basic Attack - Tracing Forms Stage 3</strong></span>, Lucilla takes 30% less DMG.</div>`,
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
    key: "SequenceNode5TimeisLikeaStream",
    name: "Sequence Node 5: Time is Like a Stream",
    details: `<div>The DMG Multiplier of <span style="color:#f7ca2f"><strong>Resonance Skill - Oblivion</strong></span> is increased by 50%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: ["PrismaticOverblastDMG"],
        modifierValue: 0.7,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6GazingInTheMistOfTime",
    name: "Sequence Node 6: Gazing In the Mist of Time",
    details: `<div>When in <span style="color:#f7ca2f"><strong><a href="#WwLink110905" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110905">Reminiscence</a></strong></span>, each time Lucilla consumes <span style="color:#f7ca2f"><strong><a href="#WwLink110902" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110902">Photo</a></strong></span>, she gains 1 stack of <span style="color:#f7ca2f"><strong>Remembrance</strong></span>, stacking up to 3 times. Each stack of <span style="color:#f7ca2f"><strong>Remembrance</strong></span> increases <span style="color:#f7ca2f"><strong>Letting It Go</strong></span>'s DMG dealt to the target by 200%, up to 600%. Casting <span style="color:#f7ca2f"><strong>Letting It Go</strong></span> removes all stacks of <span style="color:#f7ca2f"><strong>Remembrance</strong></span>.<br>Lucilla gains <span style="color:#f7ca2f"><strong>Longing</strong></span> if she has defeated a target while in <span style="color:#f7ca2f"><strong><a href="#WwLink110905" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110905">Reminiscence</a></strong></span>: Upon ending <span style="color:#f7ca2f"><strong><a href="#WwLink110905" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110905">Reminiscence</a></strong></span> while not in combat, consume <span style="color:#f7ca2f"><strong>Longing</strong></span> to restore 150 points of <span style="color:#f7ca2f"><strong><a href="#WwLink110901" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="110901">Trace</a></strong></span>.</div>`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "specialMultiplier",
        modifySpecificTalents: [
          "BasicAttackIridescentSplashDMG",
          "BasicAttackVisualImpactDMG",
        ],
        modifierValue: 0.3,
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    alwaysEnabled: false,
  },
];
