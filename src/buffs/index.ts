export const buffsByCharacter = {
  Sanhua: [
    {
      key: "Silversnow",
      name: "Outro: Silversnow",
      details: `<span class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Highlight">38% Basic Attack DMG Deepen</span> for 14s, or until the character is switched off field.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Basic",
          modifierValue: 0.38,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
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
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Heavy",
          modifierValue: 0.38,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
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
      details: `<div class="skilldescription">The incoming Resonator has their Fusion DMG Amplified by 20% and Resonance Liberation DMG Amplified by 25% for 10s or until the Resonator is switched out.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Fusion",
          modifierValue: 0.2,
        },
        {
          modifier: "DMGDeepen:Liberation",
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
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Electro",
          modifierValue: 0.2,
        },
        {
          modifier: "DMGDeepen:Liberation",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
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
  Yuanwu: [
    {
      key: "SequenceNode6DefenderofAllRealms",
      name: "Sequence Node 6: Defender of All Realms",
      details: `<span class="skilldescription">All team members nearby within the range of Resonance Skill <span class="Highlight">Thunder Wedge</span> will gain a 32% DEF increase, lasting 3s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DEF",
          modifierValue: 0.32,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Jinhsi: [
    {
      key: "SequenceNode4BenevolentGrace",
      name: "Sequence Node 4: Benevolent Grace",
      details: `<span class="skilldescription">When casting Resonance Liberation <span class="Highlight">Purge of Light</span> or Resonance Skill <span class="Highlight">Illuminous Epiphany</span>, all nearby Characters in the team gain DMG Bonus for all attributes by 20% for 20s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "AllElementAttributeBonus",
          modifierValue: 0.2,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Yangyang: [
    {
      key: "SequenceNode6ATributetoLifesSweetHymn",
      name: "Sequence Node 6: A Tribute to Life's Sweet Hymn",
      details: `<span class="skilldescription">After casting Mid-Air Attack <span class="Highlight">Feather Release</span>, the ATK of all team members is increased by 20% for 20s.</span>`,
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
  Aalto: [
    {
      key: "GateofQuandary",
      name: "Gate of Quandary",
      details: `<div class="skilldescription">Generate a "Gate of Quandary" in front, dealing <span class="Wind">Aero DMG</span>. When bullets pass through the "Gate of Quandary", ATK is increased. "Gate of Quandary" lasts for 10s.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ATK",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "DissolvingMist",
      name: "Dissolving Mist",
      details: `<div class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Hightlight">23%</span> <span class="Wind">Aero DMG</span> Deepen for 14 seconds or until the Character is switched.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Aero",
          modifierValue: 0.23,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Jiyan: [
    {
      key: "SequenceNode4Prudence",
      name: "Sequence Node 4: Prudence",
      details: `<span class="skilldescription">When casting Resonance Liberation <span class="Highlight">Emerald Storm: Prelude</span> or Resonance Liberation <span class="Highlight">Emerald Storm: Finale</span>, the Heavy Attack DMG Bonus of all team members is increased by 25% for 30s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "HeavyAttackDMGBonus",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Jianxin: [
    {
      key: "Transcendence",
      name: "Transcendence",
      details: `<span class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Highlight">38%</span> Resonance Liberation DMG Deepen for 14s or until the Character is switched.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Liberation",
          modifierValue: 0.38,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  "Rover-Spectro": [
    {
      key: "SequenceNode6EchoesofWanderlust",
      name: "Sequence Node 6: Echoes of Wanderlust",
      details: `<span class="skilldescription">Resonance Skill <span class="Highlight">Resonating Slashes</span> and Resonance Skill <span class="Highlight">Resonating Spin</span> reduces the target's Spectro DMG RES by 10% on hit for 20s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResistShred:Spectro",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  RoverHavocMale: [
    {
      key: "SequenceNode4AnnihilatedSilence",
      name: "Sequence Node 4: Annihilated Silence",
      details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Devastation</span> and Resonance Liberation <span class="Highlight">Deadening Abyss</span> reduces enemy Havoc RES by 10% for 20s on hit.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResistShred:Havoc",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  RoverHavocFemale: [
    {
      key: "SequenceNode4AnnihilatedSilence",
      name: "Sequence Node 4: Annihilated Silence",
      details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Devastation</span> and Resonance Liberation <span class="Highlight">Deadening Abyss</span> reduces enemy Havoc RES by 10% for 20s on hit.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResistShred:Havoc",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  XiangliYao: [
    {
      key: "SequenceNode4VesselofRebirth",
      name: "Sequence Node 4: Vessel of Rebirth",
      details: `<span class="skilldescription">After casting Resonance Liberation <span class="Highlight">Cogitation Model</span>, all team members' Resonance Liberation gains 25% DMG Bonus for 30s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResonanceLiberationDMGBonus",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Verina: [
    {
      key: "InherentSkillGiftofNature",
      name: "Inherent Skill: Gift of Nature",
      details: `<div class="skilldescription">When Verina casts Heavy Attack <span class="Highlight">Starflower Blooms</span>, Mid-air Attack <span class="Highlight">Starflower Blooms</span>, Resonance Liberation <span class="Highlight">Arboreal Flourish</span> or Outro Skill <span class="Highlight">Blossom</span>, all team members' ATK are increased by 20% for 20s.</div>`,
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
      key: "OutroSkillBlossom",
      name: "Outro Skill: Blossom",
      details: `<div class="skilldescription">Verina heals the next character by 19% of her ATK per second for 6s. All characters on nearby teams gain 15% All-Type DMG Deepen for 30s.</div>`,
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
      key: "SequenceNode4BlossomingEmbrace",
      name: "Sequence Node 4: Blossoming Embrace",
      details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Starflower Blooms</span>, Mid-Air Attack <span class="Highlight">Starflower Blooms</span>, Resonance Liberation <span class="Highlight">Arboreal Flourish</span> and Outro Skill <span class="Highlight">Blossom</span> increases the Spectro DMG Bonus of all team members by 15% for 24s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Spectro",
          modifierValue: 0.15,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Taoqi: [
    {
      key: "InherentSkillSteadfastProtection",
      name: "Inherent Skill: Steadfast Protection",
      details: `<div class="skilldescription">During the duration of the Resonance Skill <span class="Highlight">Rocksteady Shield</span>, the Character's DEF is increased by 15%.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DEF",
          modifierValue: 0.15,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "IronWill",
      name: "Iron Will",
      details: `<span class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Highlight">38%</span> Resonance Skill DMG Deepen for 14s or until the Character is switched.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Skill",
          modifierValue: 0.38,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Danjin: [
    {
      key: "SequenceNode6BloodiedJade",
      name: "Sequence Node 6: Bloodied Jade",
      details: `<span class="skilldescription">Heavy Attack <span class="Highlight">Chaoscleave</span> increases the ATK of all team members by 20% for 20s.</span>`,
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
      key: "Duality",
      name: "Duality",
      details: `<div class="skilldescription">The next character (or other characters on a nearby team that activates an Outro Skill) gains <span class="Hightlight">23%</span> <span class="Dark">Havoc DMG</span> Deepen for 14 seconds or until the Character is switched.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Havoc",
          modifierValue: 0.23,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Zhezhi: [
    {
      key: "OutroSkillWhitening",
      name: "Outro Skill: Whitening",
      details: `<span class="skilldescription">The incoming Resonator has their Glacio DMG Amplified by 20% and Resonance Skill DMG Amplified by 25% for 14s or until they are switched out.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Glacio",
          modifierValue: 0.2,
        },
        {
          modifier: "DMGDeepen:Skill",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4HuesSpectrum",
      name: "Sequence Node 4: Hue's Spectrum",
      details: `<span class="skilldescription">When Resonance Liberation <span class="Highlight"><strong>Living Canvas</strong></span> is cast, ATK of Resonators on the team increases by 20% for 30s.</span>`,
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
  Shorekeeper: [
    {
      key: "SophisticatedStellarealmCritRate",
      name: "Sophisticated Stellarealm",
      details: `<div class="skilldescription">When nearby team members use <span class="Highlight">Intro Skill</span> within <span class="Highlight">Elementary Stellarealm</span>, it evolves into <span class="Highlight">Sophisticated Stellarealm</span>. In <span class="Highlight">Sophisticated Stellarealm</span>, for every 0.2% of Shorekeeper's Energy Regen, all party members gain 0.01% bonus Crit. Rate, up to 12.5%</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "CritRate",
          modifierValue: 0.0001,
          maximumValue: 0.125,
          modifierStep: 0.002,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
      inputBase: true,
      modifierBasedOn: "Energy Regen",
    },
    {
      key: "ReleasedStellarealmCritDMG",
      name: "Released Stellarealm",
      details: `<div class="skilldescription">When nearby team members use <span class="Highlight">Intro Skill</span> within <span class="Highlight">Sophisticated Stellarealm</span>, it evolves into <span class="Highlight">Released Stellarealm</span>. In <span class="Highlight">Released Stellarealm</span>, for every 0.1% of Shorekeeper's Energy Regen, all party members gain a 0.01% increase of Crit. DMG, up to 25%.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "CritDMG",
          modifierValue: 0.0001,
          maximumValue: 0.25,
          modifierStep: 0.001,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
      inputBase: true,
      modifierBasedOn: "Energy Regen",
    },
    {
      key: "OutroSkillBinaryButterfly",
      name: "Outro Skill: Binary Butterfly",
      details: `<div class="skilldescription">When the <span class="Highlight">Dim Star Butterfly</span> is present, all nearby team members' DMG is amplified by 15%.</div>`,
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
      key: "InherentSkillSelfGravitation",
      name: "Inherent Skill: Self Gravitation",
      details: `<div class="skilldescription">When the Shorekeeper is in the team or when <span class="Highlight">Stellarealm</span> is active, or if the team is within the Black Shores area, the Shorekeeper's Energy Regen increases by 10%. If Rover is in the same team, their Energy Regen also increases by 10%.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "EnergyRegen",
          modifierValue: 0.1,
          specificCharacters: [
            "RoverHavocFemale",
            "RoverHavocMale",
            "RoverSpectroFemale",
            "RoverSpectroMale",
          ],
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode2NightsGiftandRefusal",
      name: "Sequence Node 2: Night's Gift and Refusal",
      details: `<span class="skilldescription">The <span class="Highlight">Outer Stellarealm</span> now increases the ATK of all team members by 40%.</span>`,
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
  ],
  Youhu: [
    {
      key: "OutroSkillTimelessClassics",
      name: "Outro Skill: Timeless Classics",
      details: `<span class="skilldescription">The incoming Resonator has their Coordinated Attack DMG Amplified by 100% for 28s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Coordinated",
          modifierValue: 1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Camellya: [
    {
      key: "SequenceNode4RootsSetDeepInEternity",
      name: "Sequence Node 4: Roots Set Deep In Eternity",
      details: `<span class="skilldescription">Casting <span class="Highlight">Everblooming</span> gives all team members 25% Basic Attack DMG Bonus for 30s.</span>`,
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
  Lumi: [
    {
      key: "OutroSkillConvoy",
      name: "Outro Skill: Convoy",
      details: `<span class="skilldescription">The upcoming Resonator has their <span class="Highlight">Resonance Skill Damage Deepen</span> by <span class="Highlight">38%</span>,  this effect lasts for <span class="Highlight">10s</span>. This effect ends early when switching to another Resonator.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Skill",
          modifierValue: 0.38,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode6GiveaFiveStarPraise",
      name: "Sequence Node 6: Give a Five-Star Praise",
      details: `<span class="skilldescription">When casting <span class="Highlight">Outro Skill</span>, Resonators in the team increases their Attack power by <span class="Highlight">20%</span>, lasting for <span class="Highlight">‘?’s</span>.</span>`,
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
  Carlotta: [
    {
      key: "SequenceNode4WithOldRainaHymnofBitterWine",
      name: "Sequence Node 4: With Old Rain, a Hymn of Bitter Wine",
      details: `<span class="skilldescription">When Carlotta casts Heavy Attack, Heavy Attack Restrictive Strategy, or Heavy Attack "End of the Road," all nearby allies’ Basic Attack damage is increased by 25% for 30 seconds.</span>`,
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
  Roccia: [
    {
      key: "FantasyIntoReality",
      name: "Fantasy Into Reality",
      details: `<div class="skilldescription">When Roccia's <span class="Highlight">Crit Rate</span> is above <span class="Highlight">50%</span>, for every additional <span class="Highlight">0.1%</span> critical rate, the 3rd attack of the Basic Attack Fantasy into reality will increase the <span class="Highlight">ATK</span> of all characters in the team by <span class="Highlight">1</span> point, lasting for 30 seconds. This can be increased up to <span class="Highlight">200</span> points.<br><br><em>Enter Roccia's total Crit Rate</em>.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ATK_FLAT",
          modifierValue: 1,
          maximumValue: 200,
          modifierStep: 0.001,
          minStatValue: 50,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
      inputBase: true,
      modifierBasedOn: "Crit Rate",
    },
    {
      key: "OutroSkillBinaryButterfly",
      name: "Outro Skill: Binary Butterfly",
      details: `<div class="skilldescription">The next character to appear will have their <span class="Dark">Havoc</span> damage increased by <span class="Highlight">20%</span> and <span class="Highlight">Basic Attack</span> damage increased by <span class="Highlight">25%</span>, lasting for <span class="Highlight">14</span> seconds. If switched to another character, the effect will end prematurely.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Havoc",
          modifierValue: 0.2,
        },
        {
          modifier: "DMGDeepen:Basic",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode2TheSeafireStoneFlickerswithFaintLight",
      name: "Sequence Node 2: The Seafire Stone Flickers with Faint Light",
      details: `<span class="skilldescription">When casting <span class="Highlight">Basic Attack</span> Fantasy into Reality, all characters in the team receive a <span class="Highlight">10%</span> increase in <span class="Dark">Havoc</span> damage. This effect can stack up to <span class="Highlight">3</span> times, lasting <span class="Highlight">30</span> seconds.</span>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "Havoc",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 3,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode2TheSeafireStoneFlickerswithFaintLightMax",
      name: "Sequence Node 2: The Seafire Stone Flickers with Faint Light",
      details: `<span class="skilldescription">When fully stacked, the <span class="Dark">Havoc</span> damage increase for the team is further raised by <span class="Highlight">10%</span>, lasting <span class="Highlight">30</span> seconds.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Havoc",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
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
  {
    key: "ImpermanenceHeron",
    name: "Impermanence Heron",
    details: `<span class="skilldescription">If the current character uses their Outro Skill within the next <span class="Highlight">15s</span>, the next character’s damage dealt will be boosted by <span class="Highlight">12%</span> for 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.12,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "BellBorne eochelone",
    name: "Bell-Borne Geochelone",
    details: `<span class="skilldescription">The Bell-Borne Shield provides <span class="Highlight">50.00%</span> DMG Reduction and <span class="Highlight">10.0%</span> DMG Boost for the current team members, and disappears after the current character is hit for 3 times.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "FallacyOfNoReturn",
    name: "Fallacy of No Return",
    details: `<span class="description">Increases attack of all team characters by <span class="Highlight">10%</span>, lasting for 20 seconds.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "TheVeilofHiddenNight",
    name: "The Veil of Hidden Night",
    details: `<span class="description">Increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
];

export const allWeaponTeamBuffs = [
  {
    name: "Static Mist",
    key: "StaticMistATK",
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierByRefinement: {
          "1": 0.1,
          "2": 0.125,
          "3": 0.15,
          "4": 0.175,
          "5": 0.2,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 1,
    details:
      "When Outro Skill is released, increases the switched-in Resonator's ATK by 10%/12.5%/15%/17.5%/20%, stacking up to 1 time(s). This effect lasts for 14s.",
    alwaysEnabled: false,
  },
  {
    name: "Stellar Symphony",
    key: "StellarSymphonyATK",
    hasStacks: false,
    modifiers: [
      {
        modifier: "ATK",
        modifierByRefinement: {
          "1": 0.14,
          "2": 0.175,
          "3": 0.21,
          "4": 0.245,
          "5": 0.28,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `<span class="skilldescription">Restore <span class="param">8/10/12/14/16</span> Concerto Energy when casting Resonance Liberation. This effect can be triggered <span class="param">1</span> time(s) every <span class="param">20</span>s. When casting Resonance Skill that heals, increase nearby party members' ATK by <span class="param">14%/17.5%/21%/24.5%/28%</span> for <span class="param">30</span>s. Effects of the same name cannot be stacked.</span>`,
    alwaysEnabled: false,
  },
];

export const allCharacters: string[] = [
  "Sanhua",
  "Baizhi",
  "Lingyang",
  "Chixia",
  "Encore",
  "Mortefi",
  "Changli",
  "Calcharo",
  "Carlotta",
  "Yinlin",
  "Yuanwu",
  "Jinhsi",
  "Yangyang",
  "Aalto",
  "Jiyan",
  "Jianxin",
  "Roccia",
  "Rover-Spectro",
  "Rover-Havoc",
  "Verina",
  "Taoqi",
  "Danjin",
  "Zhezhi",
];
