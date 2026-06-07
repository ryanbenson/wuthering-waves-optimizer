export const resonanceChains = [
  {
    key: "SequenceNode1TheMoonaTicketandaDream",
    name: "Sequence Node 1: The Moon, a Ticket, and a Dream",
    details: `<div>Lucy is now immune to interruptions during <span style="color:#f7ca2f"><strong>Resonance Skill - Payload</strong></span>, <span style="color:#f7ca2f"><strong>Resonance Skill - Pulse Inteference</strong></span>, <span style="color:#f7ca2f"><strong>Heavy Attack - Dual Threading</strong></span>, and <span style="color:#f7ca2f"><strong>Heavy Attack - Multi-Threading</strong></span><br>Casting <span style="color:#f7ca2f"><strong>Intro Skill - Outdated Hallucination</strong></span> increases ATK by 20% for 14s.<br>When a Resonator in the team defeats a target affected by <span style="color:#f7ca2f"><strong><a href="#WwLink151107" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151107">Spoofing Program</a></strong></span> with direct damage, Lucy records the effect triggered and activates the corresponding <span style="color:#f7ca2f"><strong>Quick Action</strong></span> on that Resonator for 6s. The record expires when Lucy is knocked out.<br><span style="color:#f7ca2f"><strong>Quick Action</strong></span>: When activated, inflict the recorded <span style="color:#f7ca2f"><strong><a href="#WwLink151107" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151107">Spoofing Program</a></strong></span> effects on targets within a certain distance from the active Resonator in the team, effective once only on each target.<br>The following <span style="color:#f7ca2f"><strong><a href="#WwLink151107" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151107">Spoofing Program</a></strong></span> effects can be recorded: <span style="color:#f7ca2f"><strong>Spoofing Program: Cyberware Malfunction</strong></span>, <span style="color:#f7ca2f"><strong>Spoofing Program: Breach Protocol</strong></span>, <span style="color:#f7ca2f"><strong>Spoofing Program: Cripple Movement</strong></span>, <span style="color:#f7ca2f"><strong>Spoofing Program: Weapon Glitch</strong></span>, and <span style="color:#f7ca2f"><strong>Spoofing Program: Cyberpsychosis</strong></span>. When applying <span style="color:#f7ca2f"><strong><a href="#WwLink151107" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151107">Spoofing Program</a></strong></span> effects via <span style="color:#f7ca2f"><strong>Quick Action</strong></span>, only the continuous status effects are applied.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierValue: 0.3,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode2TheBlackwallthePasttheEscape",
    name: "Sequence Node 2: The Blackwall, the Past, the Escape",
    details: `<div>While casting <span style="color:#f7ca2f"><strong>Resonance Liberation - Netrunner</strong></span> and <span style="color:#f7ca2f"><strong>Resonance Liberation - Old Net Deep Dive</strong></span>, Lucy's starting <span style="color:#f7ca2f"><strong>RAM</strong></span> is increased to 32.<br>After casting <span style="color:#f7ca2f"><strong>Resonance Skill - Pulse Interference</strong></span>, deal 1 additional instance of <span style="color:#f8e56c"><strong>Spectro DMG</strong></span> equal to 450% of Lucy's ATK, considered Heavy Attack DMG.<br>When this instance of damage hits the target, apply all of the following <span style="color:#f7ca2f"><strong><a href="#WwLink151107" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151107">Spoofing Program</a></strong></span> effects: <span style="color:#f7ca2f"><strong>Spoofing Program: Cyberware Malfunction</strong></span>, <br><span style="color:#f7ca2f"><strong>Spoofing Program: Breach Protocol</strong></span>, <span style="color:#f7ca2f"><strong>Spoofing Program: Cripple Movement</strong></span>, <span style="color:#f7ca2f"><strong>Spoofing Program: Weapon Glitch</strong></span>, and <span style="color:#f7ca2f"><strong>Spoofing Program: Cyberpsychosis</strong></span>. Only the continuous status effects are applied.<br><span style="color:#f7ca2f"><strong>Forte Circuit - Depths of Blackwall</strong></span> is enhanced: When casting <span style="color:#f7ca2f"><strong>Heavy Attack - Multi-threading</strong></span>, if Lucy has <span style="color:#f7ca2f"><strong><a href="#WwLink151106" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151106">SQL</a></strong></span>, the DMG Multiplier increase is raised from 270% to 560%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "BanishBreakdownFormStage1DMG",
          "BanishBreakdownFormStage2DMG",
        ],
        modifierValue: 0.4,
      }
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode3Cyberpunk",
    name: "Sequence Node 3: Cyberpunk",
    details: `<div>The DMG Multiplier of Override from <span style="color:#f7ca2f"><strong>Resonance Liberation - Netrunner</strong></span> and <span style="color:#f7ca2f"><strong>Resonance Liberation - Old Net Deep Dive</strong></span> is increased by 50%, and its Crit. DMG is increased by 100%.<br>The DMG Multiplier of <span style="color:#f7ca2f"><strong>Spoofing Program: Cripple Movement</strong></span> is increased by 65%.<br>The DMG Multiplier of <span style="color:#f7ca2f"><strong>Hack Response - Data Crash</strong></span> is increased by 65%.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "FinalActBreakdownFormDMG",
        ],
        modifierValue: 0.8,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode4NoLivingLegendsinNightCity",
    name: "Sequence Node 4: No Living Legends in Night City",
    details: `<div>When Resonators in the team inflict <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span>, Resonators in the team gain 20% All-Attribute DMG Bonus for 20s.</div>`,
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode5APBrokenPathtoHell",
    name: "Sequence Node 5: A Broken Path to Hell'",
    details: `<div>The stack limit of <span style="color:#f7ca2f"><strong>Optical Illusion</strong></span> obtainable via <span style="color:#f7ca2f"><strong>Inherent Skill - Ghost Cyberware</strong></span> is increased to 2.<br><span style="color:#f7ca2f"><strong>Inherent Skill - Ghost Cyberware</strong></span> is now enhanced: When Lucy's HP falls below 50%, she immediately gains 1 stack of <span style="color:#f7ca2f"><strong>Optical Illusion</strong></span> upon being hit. This effect has a Cooldown of 180s. When <span style="color:#f7ca2f"><strong>Optical Illusion</strong></span> is triggered, Lucy gains a Shield equal to 150% of ATK for 10s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "talentModifierMultiply",
        modifySpecificTalents: [
          "FinalActStagecraftFormDMG",
        ],
        modifierValue: 1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "SequenceNode6IReallyWanttoStayatYourHouse",
    name: "Sequence Node 6: I Really Want to Stay At Your House",
    details: `<div>Targets with <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span> or in the <span style="color:#f7ca2f"><strong><a href="#WwLink151104" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151104">Hack - Interfered</a></strong></span> state take 40% increased Heavy Attack DMG from Lucy.<br>Targets with <span style="color:#f7ca2f"><strong><a href="#WwLink151101" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151101">Hack - Shifting</a></strong></span> or in the <span style="color:#f7ca2f"><strong><a href="#WwLink151104" class="underline decoration-dotted underline-offset-2 hover:cursor-help hover:text-accent" data-ww-link-id="151104">Hack - Interfered</a></strong></span> state take 60% increased Hack DMG from Lucy.<br>The Stagnation triggered by <span style="color:#f7ca2f"><strong>Hack Response - Data Crash</strong></span> now lasts for 1.5s.</div>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.6,
      },
      {
        modifier: "Fusion",
        modifierValue: 0.6,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
