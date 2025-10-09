export const resonanceChains = [
  {
    key: "SequenceNode1SwordSheathedMindUnclouded",
    name: "Sequence Node 1: Sword Sheathed, Mind Unclouded",
    details: `<div><span class="ingame-Highlight">Thus Spoke the Blade: To Teach</span>, <span class="ingame-Highlight">Thus Spoke the Blade: To Save</span>, and <span class="ingame-Highlight">Thus Spoke the Blade: To Sacrifice</span> can no longer be interrupted.<br>Qiuyuan gains 20% Crit. Rate increase.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritRate",
        modifierValue: 0.2,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2OBladeIWhoTeachNoMore",
    name: "Sequence Node 2: O Blade, I, Who Teach No More",
    details: `<span class="skilldescription">Bamboo's Shade now grants an additional 30% Echo Skill DMG Amplification to all nearby active Resonators in the team.</span>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3OBladeIWhoSaveNoMore",
    name: "Sequence Node 3: O Blade, I, Who Save No More",
    details: `<div>The DMG Multiplier of Resonance Liberation <span class="ingame-Highlight">Sundering Strike</span> is increased by 500%.<br>If Concerto Energy is full when not in the Inksplash of Mind state, Qiuyuan's <span class="ingame-Highlight">Resonance Skill</span> is replaced with Resonance Skill <span class="ingame-Highlight">Straw Cape in Drizzly Rain</span>, available once every 20s.<br>Upon casting <span class="ingame-Highlight">Straw Cape in Drizzly Rain</span>, the <span class="ingame-Highlight">Quietude Within</span> effect immediately ends and 60 Concerto Energy is consumed to deal <span class="ingame-Wind">Aero DMG</span> equal to 500% of Qiuyuan's ATK, considered Echo Skill DMG, and restore 400 points of <a onclick="showTermExplan(141101,event)" class="ingame-term-desc">Swordster's Soliloquy</a>. The next <span class="ingame-Highlight">Basic Attack</span> is replaced with <span class="ingame-Highlight">Thus Spoke the Blade: Inkwash</span> Stage 3. When not in Co-op mode, upon casting <span class="ingame-Highlight">Straw Cape in Drizzly Rain</span>, the next <span class="ingame-Highlight">Outro Skill</span> is replaced with Outro Skill <span class="ingame-Highlight">Sheath Fallen, New Shoots Revealed</span>, which deals <span class="ingame-Wind">Aero DMG</span> equal to 500% of Qiuyuan's ATK, considered Echo Skill DMG.</saptag=5></div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiplyAdd",
        modifySpecificTalents: ["SunderingStrikeDMG"],
        modifierValue: 5,
      },
      {
        modifier: "EnableAttack",
        modifierValue: [
          "SequenceNode3OBladeIWhoSaveNoMore",
          "SequenceNode3OBladeIWhoSaveNoMore2",
        ],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3OBladeIWhoSaveNoMoreInksplashofMind",
    name: "Sequence Node 3: O Blade, I, Who Save No More - Inksplash of Mind",
    details: `<div>Upon casting <span class="ingame-Highlight">Straw Cape in Drizzly Rain</span>, Qiuyuan cannot gain the <span class="ingame-Highlight">Quietude Within</span> effect the next time he enters <a onclick="showTermExplan(141102,event)" class="ingame-term-desc">Inksplash of Mind</a>. <span class="ingame-Highlight">Thus Spoke the Blade: To Teach</span>, <span class="ingame-Highlight">Thus Spoke the Blade: To Save</span>, and <span class="ingame-Highlight">Thus Spoke the Blade: To Sacrifice</span> gain 600% DMG Multiplier increase and additionally restore <saptag=5>30 points of Concerto Energy on hit.<br></div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiplyAdd",
        modifySpecificTalents: [
          "ThusSpoketheBladeToTeachDMG",
          "ThusSpoketheBladeToSaveDMG",
          "ThusSpoketheBladeToSacrificeDMG",
        ],
        modifierValue: 6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4OBladeIWhoSacrificeNoMore",
    name: "Sequence Node 4: O Blade, I, Who Sacrifice No More",
    details: `<span class="skilldescription">ATK is increased by 20%.</span>`,
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
    key: "SequenceNode5OBladeIWhoAwaittobeWielded",
    name: "Sequence Node 5: O Blade, I, Who Await to be Wielded",
    details: `<span class="skilldescription">Qiuyuan now ignores 15% of the target's DEF when dealing damage.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DEFIgnore",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ThusIHeardThusISawThusISpoke",
    name: "Sequence Node 6: Thus I Heard, Thus I Saw, Thus I Spoke",
    details: `<div>Casting Heavy Attack <span class="ingame-Highlight">Thus Spoke the Blade: To Sacrifice</span> stagnates nearby targets for 3s or until the targets are damaged or until Qiuyuan is switched off the field.<br>When Qiuyuan is the active Resonator in the team, upon exiting <a onclick="showTermExplan(141102,event)" class="ingame-term-desc">Inksplash of Mind</a>, he deals <span class="ingame-Wind">Aero DMG</span> equal to 600% of his ATK to all targets within range, considered Echo Skill DMG.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "EnableAttack",
        modifierValue: ["SequenceNode6ThusIHeardThusISawThusISpoke"],
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6ThusIHeardThusISawThusISpokeStrawCapeinDrizzlyRain",
    name: "Sequence Node 6: Thus I Heard, Thus I Saw, Thus I Spoke - Straw Cape in Drizzly Rain",
    details: `<div>Casting Resonance Skill <span class="ingame-Highlight">Straw Cape in Drizzly Rain</span> increases Qiuyuan's Crit. DMG by 100% for 6s. Switching to another Resonator ends this effect early.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
