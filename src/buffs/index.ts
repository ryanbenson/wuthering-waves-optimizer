export const buffsByCharacter = {
  Sanhua: [
    {
      key: "Silversnow",
      name: "Outro: Silversnow",
      details: `<span class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Highlight">38% Basic Attack DMG Deepen</span> for 14s, or until the character is switched off field.</span>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierTalentAll: "Basic",
          modifierValue: 0.38,
        },
      ],
      minStacks: 0,
      maxStacks: 2,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode6DaybreakRadiance",
      name: "Sequence Node 6: Daybreak Radiance",
      details: `<span class="skilldescription">After an Ice Prism or a Glacier is detonated, all team members' ATK is increased by 10% for 20s, stacking up to 2 times.</span>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "ATK",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 2,
      alwaysEnabled: false,
    },
  ],
  Baizhi: [
    {
      key: "RejuvinatingFlow",
      name: "Rejuvinating Flow",
      details: `<span class="skilldescription">Baizhi restores HP equal to 1.54% of her max HP to The next character (or other characters on a nearby team that activates an Outro Skill) every 3s for 30s. Resonators gaining this healing also gain <span class="Highlight">15% all-Type DMG Deepen</span> for 6s.</span>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.15,
        },
      ],
      minStacks: 0,
      maxStacks: 2,
      alwaysEnabled: false,
    },
    {
      key: "Euphonia",
      name: "Euphonia",
      details: `<div class="skilldescription">When Baizhi casts Resonance Skill <span class="Highlight">Emergency Plan</span>, You'tan generates a field of <span class="Highlight">Euphonia</span> that lasts for 15s.<br> <br><span class="Title">Euphonia</span><br>ATK of the Resonators who picks up Euphonia is increased by 15% for 20s.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ATK",
          modifierValue: 0.15,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode6SeekersDevotion",
      name: "Sequence Node 6: Seeker's Devotion",
      details: `<span class="skilldescription">When <span class="Highlight">Euphonia</span> is picked up, increase the Glacio DMG Bonus of all characters nearby by 12% for 20s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Glacio",
          modifierValue: 0.12,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Lingyang: [
    {
      key: "SequenceNode4ImmortalsBowinReverenceFlawed",
      name: "Sequence Node 4: Immortals Bow, in Reverence Flawed",
      details: `<span class="skilldescription">Outro Skill <span class="Highlight">Frosty Marks</span> increases the Glacio DMG Bonus of all team members by 20% for 30s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Glacio",
          modifierValue: 0.2,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Chixia: [
    {
      key: "SequenceNode6EasterEggPerformance",
      name: "Sequence Node 6: Easter Egg Performance",
      details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Boom Boom</span> increases the Basic Attack DMG Bonus of all team members by 25% for 15s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "BasicAttackDMGBonus",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Encore: [
    {
      key: "SequenceNode4AdventureLetsgo",
      name: "Sequence Node 4: Adventure? Let's go!",
      details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Cosmos: Rupture</span> increases the Fusion DMG Bonus of all team members by 20% for 30s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.2,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Mortefi: [
    {
      key: "RageTransposition",
      name: "Outro: Rage Transposition",
      details: `<span class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Highlight">38% Heavy Attack DMG Deepen</span> for 14 seconds or until the Character is switched.</span>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierTalentAll: "Heavy",
          modifierValue: 0.38,
        },
      ],
      minStacks: 0,
      maxStacks: 2,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode6ApoplecticInstrumental",
      name: "Sequence Node 6: Apoplectic Instrumental",
      details: `<span class="skilldescription">When Resonance Liberation <span class="Highlight">Violent Finale</span> is cast, ATK of all team members is increased by 20% for 20s.</span>`,
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
  ],
  Changli: [
    {
      key: "OutroSkillStrategyofDuality",
      name: "Outro Skill: Strategy of Duality",
      details: `<div class="skilldescription">Changli's Outro Skill increases the switched-in Resonator's Fusion DMG by 20% and their Resonance Liberation DMG by 25%, lasting for 10s. Switching to another Resonator ends this effect.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.25,
        },
        {
          modifier: "ResonanceLiberationDMGBonus",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4PolishedWords",
      name: "Sequence Node 4: Polished Words",
      details: `<span class="skilldescription">Intro Skill increases the ATK of all team members by 20%, lasting for 30s.</span>`,
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
  ],
  Calcharo: [
    {
      key: "SequenceNode4DarkAlliance",
      name: "Sequence Node 4: Dark Alliance",
      details: `<span class="skilldescription">After casting Outro Skill <span class="Highlight">Shadowy Raid</span>, Electro DMG Bonus of all team members is increased by 20% for 30s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Electro",
          modifierValue: 0.2,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Yinlin: [
    {
      key: "Strategist",
      name: "Outro: Strategist",
      details: `<span class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Highlight">20% Electro DMG Deepen</span>, and <span class="Highlight">25% Resonance Liberation DMG Deepen</span> for 14 seconds or until the Character is switched.</span>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierElement: "Electro",
          modifierValue: 0.2,
        },
        {
          modifier: "DMGDeepen",
          modifierTalentAll: "Liberation",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 2,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4SteadfastConviction",
      name: "Sequence Node 4: Steadfast Conviction",
      details: `<span class="skilldescription">When Forte Circuit <span class="Highlight">Judgment Strike</span> hits a target, the ATK of all team members is increased by 20% for 12s.</span>`,
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
  ],
  Yuanwu: [],
  Jinhsi: [],
  Yangyang: [],
  Aalto: [],
  Jiyan: [],
  Jianxin: [],
  "Rover-Spectro": [],
  "Rover-Havoc": [],
  Verina: [],
  Taoqi: [],
  Danjin: [],
};

export const allEchoBuffs = [
  {
    key: "RejuvenatingGlow",
    name: "Rejuvenating Glow",
    details: `<span class="skilldescription">Upon healing allies, increase ATK of the entire team by <span class="Highlight">15%</span> , lasting <span class="Highlight">30s</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "MoonlitClouds",
    name: "Moonlit Clouds",
    details: `<span class="skilldescription">Upon using Outro Skill, ATK of the next Resonator increases by <span class="Highlight">22.5%</span> , for <span class="Highlight">15s</span>.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.225,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];
