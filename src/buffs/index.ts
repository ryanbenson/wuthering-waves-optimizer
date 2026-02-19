export const buffsByCharacter = {
  Sanhua: [
    {
      key: "Silversnow",
      name: "Outro: Silversnow",
      details: `<span class="skilldescription">The incoming Resonator has their Basic Attack DMG Amplified by 38% for 14s or until they are switched out.</span>`,
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
      details: `<div class="skilldescription">Generate a "Gate of Quandary" in front, dealing <span class="Wind">Aero DMG</span>. When bullets pass through the "Gate of Quandary", ATK is increased by 10%. "Gate of Quandary" lasts for 10s</div>`,
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
      details: `<div class="skilldescription">When a party member uses <span class="Highlight">Intro Skill</span> within the <span class="Highlight">Outer Stellarealm</span>, it evolves into the <span class="Highlight">Inner Stellarealm</span>. Within the effective range of the <span class="Highlight">Inner Stellarealm</span>, for every 0.2% of Shorekeeper's Energy Regen, all party members gain a 0.01% increase of Crit. Rate, up to 12.5%.</div>`,
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
      name: "Supernal Stellarealm",
      details: `<div class="skilldescription">When a party member uses <span class="Highlight">Intro Skill</span> within the <span class="Highlight">Inner Stellarealm</span>, it evolves into the <span class="Highlight">Supernal Stellarealm</span>. Within the effective range of the <span class="Highlight">Supernal Stellarealm</span>, for every 0.1% of Shorekeeper's Energy Regen, all party members gain a 0.01% increase of Crit. DMG, up to 25%.</div>`,
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
      details: `<div class="skilldescription">All nearby party members' DMG is Amplified by 15%.</div>`,
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
      details: `<div class="skilldescription">When the on-field Resonator is within range of a <span class="Highlight">Stellarealm</span>, Shorekeeper's Energy Regen is increased by 10%, and Rover's Energy Regen is also increased by 10% if Rover is on the team.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "EnergyRegen",
          modifierValue: 0.1,
          specificCharacters: [
            "RoverAeroFemale",
            "RoverAeroMale",
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
      key: "OutroSkillEscorting",
      name: "Outro Skill: Escorting",
      details: `<div class="skilldescription">The incoming Resonator has their Resonance Skill DMG Amplified by 38% for 10s or until they are switched out.</div>`,
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
      key: "SequenceNode6GiveMeAFivestarRating",
      name: "Sequence Node 6: Give Me A Five-star Rating",
      details: `<span class="skilldescription">Casting Resonance Liberation <span class="Highlight">Squeakie Express</span> increases all team members' ATK by 20% for 20s.</span>`,
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
      details: `<span class="skilldescription">Casting Heavy Attack, Heavy Attack <span class="Highlight">Containment Tactics</span>, and Heavy Attack <span class="Highlight">Imminent Oblivion</span> grants all Resonators in the team 25% Resonance Skill DMG Bonus for 30s.</span>`,
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
  ],
  Roccia: [
    {
      key: "InherentSkillSuperAttractiveMagicBox",
      name: "Inherent Skill: Super Attractive Magic Box",
      details: `<div class="skilldescription">After casting Outro Skill, the Utility of the incoming Resonator is replaced with Magic Box.<br> <br><span class="Title">Magic Box</span><br>- Upon use, pull nearby targets toward the Magic Box, dealing 100 points of <span class="Dark">Havoc DMG</span>. This skill is considered Echo Skill that deals Utility DMG.<br>- The Magic Box lasts for 14s or until the Resonator is switched out.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "EnableAttack",
          modifierValue: ["InherentSkillSuperAttractiveMagicBox"],
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "CommediaImprovvisoATK",
      name: "Commedia Improvviso!",
      details: `For every 0.1% of Roccia's Crit. Rate over 50%, this skill increases the ATK of all Resnonators in the team by 1 point for 30s, up to 200 points.`,
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
      key: "OutroSkillApplausePlease!",
      name: "Outro Skill: Applause, Please!y",
      details: `<div class="skilldescription">The incoming Resonator has their Havoc DMG Amplified by 20% and Basic Attack DMG Amplified by 25% for 14s or until the Resonator is switched out.</div>`,
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
      key: "SequenceNode2WhentheLuceaniteGleamsHavoc",
      name: "Sequence Node 2: When the Luceanite Gleams",
      details: `<span class="skilldescription">Casting Basic Attack <span class="Highlight">Real Fantasy</span> grants all Resonators in the team 10% Havoc DMG Bonus for 30s, stacking up to <saptag=1>3 time.</span>`,
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
      key: "SequenceNode2WhentheLuceaniteGleamsHavocMaxed",
      name: "Sequence Node 2: When the Luceanite Gleams",
      details: `<span class="skilldescription"> Upon reaching the max stacks, it grants all Resonators in the team 10% additional Havoc DMG Bonus for 30s.</saptag=1></span>`,
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
  Phoebe: [
    {
      key: "OutroSkillAttentiveHeart",
      name: "Outro Skill: Attentive Heart",
      details: `<span class="Highlight">Confession</span> Enhancement: Grant <span class="Highlight">Silent Prayer</span> to the Resonator on the field, reducing the Spectro RES of nearby targets by 10% and granting 100% <span class="Highlight">Spectro Frazzle</span> DMG Amplification. When <span class="Highlight">Spectro Frazzle</span> inflicts DMG, extend <span class="Highlight">Spectro Frazzle's</span> damage interval by 50%. This effect lasts 30s or until Phoebe switches to <span class="Highlight">Absolution</span> status.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:SpectroFrazzle",
          modifierValue: 1,
        },
        {
          modifier: "ResistShred:Spectro",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode2ABoatAdriftinTears",
      name: "Sequence Node 2: A Boat Adrift in Tears",
      details: `When in <span class="Highlight">Confession</span>, <span class="Highlight">Silent Prayer</span> grants 120% more DMG Amplification for <span class="Highlight">Spectro Frazzle.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:SpectroFrazzle",
          modifierValue: 1.2,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4RingingBellsonWingsAloft",
      name: "Sequence Node 4: Ringing Bells on Wings Aloft",
      details: `<span class="skilldescription">When <span class="Highlight">Basic Attack</span>, Basic Attack <span class="Highlight">Chamuel's Star</span>, <span class="Highlight">Dodge Counter</span>, or <span class="Highlight">Chamuel‘s Star: Dodge Counter</span> hits, the target's Spectro RES is reduced by 10% for 30s.</span>`,
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
  Brant: [
    {
      key: "OutroSkillAttentiveHeart",
      name: "Outro Skill: Attentive Heart",
      details: `Ampify the incoming Resonator's Fusion DMG by 20% and Resonance Skill DMG by 25% for 14s or until the Resonator is switched out.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Fusion",
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
  ],
  Cantarella: [
    {
      key: "OutroSkillGentleTentacles",
      name: "Outro Skill: Gentle Tentacles",
      details: `Amplify the incoming Resonator's Havoc DMG by 20% and Resonance Skill DMG by 25% for 14s. Switching Resonators ends this effect.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Havoc",
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
  ],
  Zani: [
    {
      key: "OutroSkillBeaconFortheFuture",
      name: "Outro Skill: Beacon For the Future",
      details: `The Spectro DMG dealt by other Resonators in the team to the target marked by <span class="Highlight">Heliacal Ember</span> is Amplified by 20% for 20s.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.2,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4MoreEfficiencyLessDrama",
      name: "Sequence Node 4: More Efficiency, Less Drama",
      details: ``,
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
  Ciaccona: [
    {
      key: "OutroSkillWindcallingTune",
      name: "Outro Skill: Windcalling Tune",
      details: `<div class="skilldescription"><span class="Highlight">Aero Erosion</span> DMG dealt to targets near the active Resonator is Amplified by 100% for 30s.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:AeroErosion",
          modifierValue: 1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SoloConcert",
      name: "Solo Concert",
      details: `When Ciaccona or Ensemble Sylph performs Solo Concert, they give 24% Aero DMG Bonus to all nearby Resonators in the team. This effect is not stackable.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Aero",
          modifierValue: 0.24,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode2SongoftheFourSeasons",
      name: "Sequence Node 2: Song of the Four Seasons",
      details: `<span class="skilldescription">During Resonance Liberation <span class="Highlight">Singer's Triple Cadenza</span>, Resonators in the team gain 40% Aero DMG Bonus.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Aero",
          modifierValue: 0.4,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode5EternalIdylltoLastinSummer",
      name: "Sequence Node 5: Eternal Idyll to Lasting Summer",
      details: `>DMG taken by Resonators within and around the range of Resonance Liberation <span class="Highlight">Singer's Triple Cadenza</span> is reduced by 30%.</span>`,
      hasStacks: false,
      modifiers: [],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Cartethyia: [
    {
      key: "OutroSkillWindsDivineBlessing",
      name: "Outro Skill: Wind's Divine Blessing",
      details: `Aero DMG dealt by the active Resonator in the team other than Cartethyia/Fleurdelys to targets with Negative Statuses is Amplified by 17.5% for 20s.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Aero",
          modifierValue: 0.175,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4SacrificeMadeforSalvation",
      name: "Sequence Node 4: Sacrifice Made for Salvation",
      details: `When Resonators in the team inflict Havoc Bane, Fusion Burst, Spectro Frazzle, Electro Flare, Glacio Chafe and Aero Erosion, all Resonators in the team gain 20% DMG Bonus for all Attributes for 20s.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.2,
        },
        {
          modifier: "Glacio",
          modifierValue: 0.2,
        },
        {
          modifier: "Electro",
          modifierValue: 0.2,
        },
        {
          modifier: "Aero",
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
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Lupa: [
    {
      key: `PackHunt`,
      name: `Pack Hunt`,
      details: `Resonators with <span class="Highlight">Pack Hunt</span> gain a 6% ATK increase, and 10% Fusion DMG Bonus when they attack Overlord Class or Calamity Class targets (Both are non-stackable).<br><em>These buffs may not appear in your stats in-game.</em>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ATK",
          modifierValue: 0.06,
        },
        {
          modifier: "Fusion",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: `PackHuntFusionTeam`,
      name: `Pack Hunt Fusion Team`,
      details: `Resonators with <span class="Highlight">Pack Hunt</span>: If there are 3 Fusion Resonators in the team, the Fusion DMG Bonus against Overlord Class or Calamity Class targets additionally increases by 10%.<br><em>These buffs may not appear in your stats in-game.</em>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: `PackHuntFusionEnhanced`,
      name: `Pack Hunt Enhanced`,
      details: `When the active Resonator casts <span class="Highlight">Intro Skill, Pack Hunt</span> is enhanced, granting an additional 6% ATK increase to all Resonators in the team, up to a maximum of 18%.`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "ATK",
          modifierValue: 0.06,
        },
      ],
      minStacks: 0,
      maxStacks: 3,
      alwaysEnabled: false,
    },
    {
      key: `InherentSkillApplauseofVictory`,
      name: `Inherent Skill: Applause of Victory`,
      details: `<div class="skilldescription">Defeating a <span class="Highlight">marked</span> target resets the cooldown of Resonance Skill <span class="Highlight">Shewolf's Hunt</span>.<br><span class="Title">Resonance Liberation - Glory</span><br>Casting Resonance Liberation <span class="Highlight">Fire-Kissed Glory</span> grants <span class="Highlight">Glory</span>. Within 35s:<br>Attacks of all Resonators in the team ignore 3% of the target's Fusion RES. For each Fusion Resonator in the team other than Lupa, this effect increases by 3%, up to the maximum of 9%.</div>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "ResistShred:Fusion",
          modifierValue: 0.03,
        },
      ],
      minStacks: 0,
      maxStacks: 3,
      alwaysEnabled: false,
    },
    {
      key: `InherentSkillApplauseofVictoryFullFusionTeam`,
      name: `Inherent Skill: Applause of Victory: Fusion Team`,
      details: `When there are 3 Fusion Resonators in the team, Resonators' attacks further ignore 6% Fusion RES.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResistShred:Fusion",
          modifierValue: 0.06,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: `OutroSkillStandbyMeWarrior`,
      name: `Outro Skill: Stand by Me, Warrior`,
      details: `The incoming Resonator will have their Fusion DMG Amplified by 20% and Basic Attack DMG Amplified by 25% for 14s or until the Resonator is switched out.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Fusion",
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
      key: "SequenceNode2EveryGroundHerHuntingField",
      name: "Sequence Node 2: Every Ground, Her Hunting Field",
      details: `<span class="skilldescription">Performing <span class="Highlight">Fire-Kissed Glory</span>, <span class="Highlight">Heavy Attack - Wolf's Gnawing</span>,  <span class="Highlight">Heavy Attack - Wolf's Claw</span>, or <span class="Highlight">Mid-air Attack - Firestrike</span> gives 20% Fusion DMG Bonus to all Resonators in the team for 30s, stacking up to 2 times.</span>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.2,
        },
      ],
      minStacks: 0,
      maxStacks: 2,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode3WolflameHowlsinHerWake",
      name: "Sequence Node 3: Wolflame Howls in Her Wake",
      details: `<span class="skilldescription">The effect of Resonance Liberation <span class="Highlight">Glory</span> is now updated as follows:<br>Casting Resonance Liberation <span class="Highlight">Fire-Kissed Glory</span> grants <span class="Highlight">Glory</span>. Attacks of all Resonators in the team ignore 15% Fusion RES for 35s.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResistShred:Fusion",
          modifierValue: 0.15,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Phrolova: [
    {
      key: "OutroSkillUnfinishedPiece",
      name: "Outro Skill: Unfinished Piece",
      details: `The incoming Resonator gains 20% Havoc DMG Amplification and 25% Heavy DMG Amplification for 14s or until they are switched out.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Havoc",
          modifierValue: 0.2,
        },
        {
          modifier: "DMGDeepen:Heavy",
          modifierValue: 0.25,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4ATorchIlluminatingthePath",
      name: "Sequence Node 4: A Torch Illuminating the Path",
      details: `Casting <span class="Highlight">Echo Skill</span> grants 20% Attribute DMG Bonus for all Resonators in the team for 30s.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.2,
        },
        {
          modifier: "Glacio",
          modifierValue: 0.2,
        },
        {
          modifier: "Electro",
          modifierValue: 0.2,
        },
        {
          modifier: "Aero",
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
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Augusta: [
    {
      key: "OutroSkillBattlesongoftheUnyielding",
      name: "Outro Skill: Battlesong of the Unyielding",
      details: `The next Resonator switched onto the field gains the following effects for 14s, which end immediately if they are switched out:<br>
- Gain 15% DMG Amplification for all Attributes.`,
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
      key: "SequenceNode4AscentinSunandGlory",
      name: "Sequence Node 4: Ascent in Sun and Glory",
      details: `<div>Casting <span class="ingame-Highlight">Intro Skill - Stride of Goldenflare</span> increases the ATK of all Resonators in the team by 20% for 30s.</div>`,
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
  Iuno: [
    {
      key: "OutroSkillFromGloomtoGleam",
      name: "Outro Skill: From Gloom to Gleam",
      details: `<div>The incoming Resonator gains 50% Heavy Attack DMG Amplification for 14s. This effect ends early if they are switched off the field.<br>Casting <span class="ingame-Highlight">Outro Skill</span> won't interrupt <span class="ingame-Highlight">Heavy Attack - Absolute Fullness</span>, and the Outro Skill effect still applies.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Heavy",
          modifierValue: 0.5,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "BlessingoftheWanLight",
      name: "Blessing of the Wan Light",
      details: `<div class="skilldescription">Gaining a Shield inside the <span class="Highlight">Full Moon Domain</span> domain grants 1 stack of <span class="Highlight">Blessing of the Wan Light</span>. This effect can be triggered once every 0.5s.<br><br>The receiving Resonator gains 4% all DMG Amplification for 10s, stacking up to 10 times. Gaining new stacks resets the duration. This effect ends early if the receiving Resonator is switched off the field.</div>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.04,
        },
      ],
      minStacks: 0,
      maxStacks: 10,
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
  ],
  Galbrena: [
    {
      key: "SequenceNode4CarryForthThisFadingSpark",
      name: "Sequence Node 4: Carry Forth This Fading Spark",
      details: `<div>When Resonators in the team cast Echo Skill, all Resonators in the team gain 20% all-Attribute DMG Bonus for 20s.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.2,
        },
        {
          modifier: "Glacio",
          modifierValue: 0.2,
        },
        {
          modifier: "Electro",
          modifierValue: 0.2,
        },
        {
          modifier: "Aero",
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
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Qiuyuan: [
    {
      key: "BamboosShade",
      name: `Bamboo's Shade`,
      details: `<span class="ingame-Title">Bamboo's Shade</span></span><br>When Qiuyuan reaches 400 points of <te href="141101">Swordster's Soliloquy</te>, he gains the <span class="ingame-Highlight">Bamboo's Shade</span> effect, granting all nearby active Resonators in the team 30% Echo Skill DMG Bonus for 30s.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "EchoDMGBonus",
          modifierValue: 0.3,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SunderingStrike",
      name: `Sundering Strike`,
      details: `For every 1% of Qiuyuan's Crit. Rate over 50%, this skill increases the Crit. DMG of all nearby active Resonators in the team by 2% for 30s, up to 30%.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "CritDMG",
          modifierValue: 0.02,
          maximumValue: 0.3,
          modifierStep: 0.01,
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
      key: "OutroSkillStrikeBeforeReady",
      name: `Outro Skill: Strike Before Ready`,
      details: `Grant 50% Echo Skill DMG Amplification to the incoming Resonator, lasting for 14s or until the Resonator is switched out.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:Echo",
          modifierValue: 0.5,
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
      modifiers: [
        {
          modifier: "DMGDeepen:Echo",
          modifierValue: 0.3,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Chisa: [
    {
      key: "ThreadofBane",
      name: "Thread of Bane",
      details: `<div>When dealing damage to targets affected by <span class="Highlight">Unseen Snare</span>, ignore 18% of their DEF.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DEFIgnore",
          modifierValue: 0.18,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode2IntotheWebofEndlessBonds",
      name: "Sequence Node 2: Into the Web of Endless Bonds",
      details: `<span class="skilldescription">Nearby Resonators in the team with <span class="Highlight">Thread of Bane</span> gain 50% All-Attribute DMG Bonus.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "Fusion",
          modifierValue: 0.5,
        },
        {
          modifier: "Glacio",
          modifierValue: 0.5,
        },
        {
          modifier: "Electro",
          modifierValue: 0.5,
        },
        {
          modifier: "Aero",
          modifierValue: 0.5,
        },
        {
          modifier: "Havoc",
          modifierValue: 0.5,
        },
        {
          modifier: "Spectro",
          modifierValue: 0.5,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode6ThusHopeisRekindledwiththeRisingDawn",
      name: "Sequence Node 6: Thus, Hope is Rekindled with the Rising Dawn",
      details: `<span class="skilldescription">Targets affected by Unseen Snare - Finality takes 30% Amplified DMG from Negative Statuses.</span>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen:SpectroFrazzle",
          modifierValue: 0.3,
        },
        {
          modifier: "DMGDeepen:AeroErosion",
          modifierValue: 0.3,
        },
        {
          modifier: "DMGDeepen:ElectroFlare",
          modifierValue: 0.3,
        },
        {
          modifier: "DMGDeepen:FusionBurst",
          modifierValue: 0.3,
        },
        {
          modifier: "DMGDeepen:GlacioChafe",
          modifierValue: 0.3,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Buling: [
    {
      key: `ExorcismSpell`,
      name: `Exorcism Spell`,
      details: `<span>All nearby Resonators in the team have their DMG Amplified by 15% for 30s.</span>`,
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
      key: `ThunderSpellYinandYang`,
      name: `Thunder Spell - Yin and Yang`,
      details: `<div><span class="Highlight">Thunder Spell - Yin and Yang</span> grants 10% <span class="Highlight">Resonance Skill</span> DMG Bonus to all active Resonators in the team.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResonanceSkillDMGBonus",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: `ThunderSpellHeavenEarthMind`,
      name: `Thunder Spell - Heaven, Earth, Mind`,
      details: `<div><span class="Highlight">Thunder Spell - Heaven, Earth, Mind</span> grants 25% <span class="Highlight">Resonance Skill</span> DMG Bonus to all active Resonators in the team.</div>`,
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
      key: "SequenceNode6AlmightyForumLordofThunderSpell",
      name: `Sequence Node 6: "Almighty Forum Lord of Thunder Spell"`,
      details: `<div>The <span class="Highlight">Thunder Spell - Heaven, Earth, Mind</span> state now grants 50% <span class="Highlight">Resonance Skill</span> DMG Bonus to the active Resonator in the team.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "ResonanceSkillDMGBonus",
          modifierValue: 0.5,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
  ],
  Lynae: [
    {
      key: "TuneBreakBoost",
      name: `Tune Break Boost`,
      details: `<div><span class="Highlight">Basic Attack - Visual Impact</span> consumes 3 points of True Color and grants all nearby Resonators in the team 40 points of Tune Break Boost for 30s.</div>`,
      hasStacks: true,
      modifiers: [
        {
          modifier: "tuneBreakBoost",
          modifierValue: 0.01,
        },
      ],
      minStacks: 0,
      maxStacks: 40,
      alwaysEnabled: false,
    },
    {
      key: "LetsHittheRoad",
      name: `Outro Skill: Let's Hit the Road!`,
      details: `The next incoming Resonator gain 15% All DMG Amplification and 25% Resonance Liberation DMG Amplification for 14s or until they are switched out.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.15,
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
      key: "PrismaticOverblast",
      name: `Prismatic Overblast`,
      details: `Casting this skill grants all nearby Resonators in the team 24% All DMG Bonus that lasts for 30s.`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGBonus",
          modifierValue: 0.24,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode2IntoLightsVanishingPoint",
      name: "Sequence Node 2: Into Lights' Vanishing Point",
      details: `<span class="skilldescription">Casting Outro Skill grants the incoming Resonator 25% All-DMG Amplification for 14s or until the Resonator is switched out.</span>`,
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
  ],
  Mornye: [
    {
      key: "InterferedMarker",
      name: `Interfered Marker`,
      details: `<div>Targets affected by <span class="Highlight">Tune Rupture - Interfered</span> or <span class="Highlight">Tune Strain - Interfered</span> take increased DMG from all nearby Resonators in the team. For every 1% of Mornye's Energy Regen exceeding 100%, their DMG is increased by 0.25%, up to 40%.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGBonus",
          modifierValue: 0.0025,
          maximumValue: 0.4,
          modifierStep: 0.01,
          minStatValue: 100,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
      inputBase: true,
      modifierBasedOn: "Energy Regen",
    },
    {
      key: "HighSyntonyField",
      name: `High Syntony Field`,
      details: `<div><span class="Highlight">High Syntony Field</span> lasts for 25s.<br>
- Increases the DEF of all nearby Resonators in the team within the <span class="Highlight">High Syntony Field</span> by 20%.<br>
- Inherits the <span class="Highlight">Syntony Field</span>'s boost to resistance to interruption and <span class="Highlight">Off-Tune Buildup Rate</span>.<br></div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DEF",
          modifierValue: 0.2,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "Recursion",
      name: `Outro Skill: Recursion`,
      details: `Resonators in the team gain 25% All DMG Amplification for 30s.`,
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
      key: "SequenceNode2MorningStarofEntropy",
      name: `Sequence Node 2: Morning Star of Entropy`,
      details: `<div>All nearby Resonators in the team gain Crit. DMG increase against targets with <span class="Highlight">Interfered Marker</span>: Every 1% of Mornye's Energy Regen over 100% grants 0.2% Crit. DMG increase, up to 32%.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "CritDMG",
          modifierValue: 0.002,
          maximumValue: 0.32,
          modifierStep: 0.01,
          minStatValue: 100,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
      inputBase: true,
      modifierBasedOn: "Energy Regen",
    },
  ],
  Aemeath: [
    {
      key: "SilentProtectionTuneRupture",
      name: `Silent Protection - Tune Rupture`,
      details: `<div>- In <span class="Highlight">Resonance Mode - Tune Rupture</span>: all Resonators in the team except Aemeath gain 10% All DMG Amplification for 20s.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SilentProtectionTuneRuptureShifting",
      name: `Silent Protection - Tune Rupture Shifting`,
      details: `<div>The All DMG Amplification effect is increased to 20% for Resonators who inflict <span class="Highlight">Tune Rupture - Shifting</span>.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SilentProtectionFusionBurst",
      name: `Silent Protection - Fusion Burst`,
      details: `<div>- In <span class="Highlight">Resonance Mode - Fusion Burst</span>: all Resonators in the team except Aemeath gain 10% All DMG Amplification for 20s.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SilentProtectionFusionBurstAppliers",
      name: `Silent Protection - Fusion Burst Appliers`,
      details: `<div>The All DMG Amplification effect is increased to 20% for Resonators who inflict <span class="Highlight">Fusion Burst</span>.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGDeepen",
          modifierValue: 0.1,
        },
      ],
      minStacks: 0,
      maxStacks: 0,
      alwaysEnabled: false,
    },
    {
      key: "SequenceNode4EtherealWaltzonBinaryTides",
      name: `Sequence Node 4: Ethereal Waltz on Binary Tides`,
      details: `<div>When casting Intro Skill <span class="Highlight"><strong>Songs Across the Universe</strong></span>, Intro Skill <span class="Highlight"><strong>Debut of Meteoric Radiance</strong></span>, Resonance Skill <span class="Highlight"><strong>Sync Strike</strong></span> and Resonance Skill <span class="Highlight"><strong>Seraphic Duet</strong></span>, Resonators in the team gain 20% All-Attribute DMG Bonus for 30s.</div>`,
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
  LuukHerssen: [
    {
      key: "SequenceNode4PulseThrummingUnderRime",
      name: "Sequence Node 4: Pulse Thrumming Under Rime",
      details: `<div>After a Resonator in the team deals Tune Break DMG, all Resonators in the team deal 20% more DMG for 20s. This effect is unstackable.</div>`,
      hasStacks: false,
      modifiers: [
        {
          modifier: "DMGBonus",
          modifierValue: 0.2,
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
    details: `<span class="description">Activate the protection of Bell-Borne Geochelone. Obtain a Bell-Borne Shield that lasts for <span class="param">15</span>s

The Bell-Borne Shield provides <span class="param">50.00%</span> DMG Reduction and <span class="param">10.00%</span> DMG Boost for the current team members, and disappears after the current character is hit for <span class="param">3</span> times.

CD: <span class="param">20</span>s</span>`,
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
    details: `<span class="description">Increases attack of all team characters by <span class="Highlight">10%</span>, lasting for 20 seconds.</span>`,
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
    key: "Hyvatia",
    name: "Hyvatia",
    details: `<span class="description">Casting Outro Skill within 15s after summoning Hyvatia grants 10.00% All-Attribute DMG Bonus to the next Resonator using Intro Skill for 15s.</span>`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "AllElementAttributeBonus",
        modifierValue: 0.1,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "MidnightVeil",
    name: "Midnight Veil",
    details: `<span class="description">Increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds</span>`,
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
  {
    key: "EmpyreanAnthem",
    name: "Empyrean Anthem",
    details: `<span class="description">Upon a critical hit of Coordinated Attack, increase the active Resonator's ATK by 20% for 4s.</span>`,
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
    key: "GustsofWelkin",
    name: "Gusts of Welkin",
    details: `Inflicting Aero Erosion upon enemies increases <span class="Wind">Aero</span> DMG for all Resonators in the team by 15%.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "FlamingClawprint",
    name: "Flaming Clawprint",
    details: `Casting Resonance Liberation increases Fusion DMG of Resonators in the team by 15%, lasting for 35s.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.15,
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
  },
  {
    key: "LawofHarmony",
    name: "Law of Harmony",
    details: `Casting Echo Skill grants 30% Heavy Attack DMG Bonus to the caster for 4s.</br>Additionally, all Resonators in the team gain 4% Echo Skill DMG Bonus for 30s, stacking up to 4 times. Echoes of the same name can only trigger this effect once. The record of Echo triggering this effect is cleared along with this effect. At 4 stacks, casting Echo Skill again resets the duration of this effect.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "EchoDMGBonus",
        modifierValue: 0.04,
      },
    ],
    minStacks: 0,
    maxStacks: 4,
    alwaysEnabled: false,
  },
  {
    key: "PactofNeonlightLeap",
    name: "Pact of Neonlight Leap",
    details: `Casting Outro Skill increases the ATK of the incoming Resonator by 15%, with each point of Tune Break Boost additionally increasing ATK by 0.3%, up to 15%. This effect lasts for 15s, or until the Resonator is switched out.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.003,
      },
    ],
    minStacks: 0,
    maxStacks: 50,
    alwaysEnabled: false,
  },
  {
    key: "HaloofStarryRadiance",
    name: "Halo of Starry Radiance",
    details: `When healing a Resonator in the team, every 1% of Off-Tune Buildup Rate grants a 0.2% ATK increase to all Resonators in the team for 4s, up to 25%. Effects of the same name cannot be stacked.`,
    hasStacks: true,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.002,
      },
    ],
    minStacks: 0,
    maxStacks: 125,
    alwaysEnabled: false,
  },
  {
    key: "ChromaticFoam",
    name: "Chromatic Foam",
    details: `When the Resonator inflicts Fusion Burst on the enemies, they gain the following effects: Gain 10% Fusion DMG Bonus for 15 s. While this effect is active, casting an Outro Skill grants the incoming Resonator 25% Fusion DMG Bonus for 15s.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.25,
      },
    ],
    alwaysEnabled: false,
  },
  {
    key: "Glommoth",
    name: "Glommoth",
    details: `Casting Outro Skill within 15s after summoning Glommoth grants 12.00% Glacio DMG Bonus to the incoming Resonator for 15s.
CD: 20s.`,
    hasStacks: false,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.12,
      },
    ],
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
  {
    name: "Luminous Hymn Spectro Frazzle Amplify",
    key: "LuminousHymnSpectroFrazzle",
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:SpectroFrazzle",
        modifierByRefinement: {
          "1": 0.3,
          "2": 0.375,
          "3": 0.45,
          "4": 0.525,
          "5": 0.6,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `Casing Outro Skill Amplifies the DMG from Spectro Frazzle on enemies around the active resonator by <span class="param">30%/37.5%/45%/52.5%/60%</span> for 30s. Effects of the same name cannot be stacked.`,
    alwaysEnabled: false,
  },
  {
    name: "Bloodpact's Pledge Aero Amplify",
    key: "BloodpactsPledgeAeroDeepen",
    hasStacks: false,
    modifiers: [
      {
        modifier: "DMGDeepen:Aero",
        modifierByRefinement: {
          "1": 0.1,
          "2": 0.14,
          "3": 0.18,
          "4": 0.22,
          "5": 0.26,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `When Rover: Aero casts Resonance Skill Unbound Flow, Aero DMG dealt by nearby Resonators on the field is Amplified by <span class="param">10%/14%/18%/22%/26%</span> for <span class="param">30</span>s.</span>`,
    alwaysEnabled: false,
  },
  {
    name: "Woodland Aria Aero RES Reduction",
    key: "WoodlandAriaAeroShred",
    hasStacks: false,
    modifiers: [
      {
        modifier: "ResistShred:Aero",
        modifierByRefinement: {
          "1": 0.1,
          "2": 0.115,
          "3": 0.13,
          "4": 0.145,
          "5": 0.16,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `Hitting targets with Aero Erosion reduces their Aero RES by <span class="param">10%/11.5%/13%/14.5%/16%</span> for <span class="param">20</span>s. Effects of the same name cannot be stacked.`,
    alwaysEnabled: false,
  },
  {
    name: "Wildfire Mark",
    key: "WildfireMarkDMGBonus",
    hasStacks: false,
    modifiers: [
      {
        modifier: "Fusion",
        modifierByRefinement: {
          "1": 0.24,
          "2": 0.3,
          "3": 0.36,
          "4": 0.42,
          "5": 0.48,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `Each successful extension gives <span class="param">24%/30%/36%/42%/48%</span> Fusion DMG Bonus to all Resonators in the team for <span class="param">30</span>s. Effects of the same name cannot be stacked.`,
    alwaysEnabled: false,
  },
  {
    name: "Emerald Sentence",
    key: "EmeraldSentenceEchoDMGBonus",
    hasStacks: false,
    modifiers: [
      {
        modifier: "EchoDMGBonus",
        modifierByRefinement: {
          "1": 0.2,
          "2": 0.25,
          "3": 0.3,
          "4": 0.35,
          "5": 0.4,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `Casting Intro Skill grants <span class="param">20%/25%/30%/35%/40%</span> Echo Skill DMG Bonus to all Resonators in the team for 30s. Effects of the same name cannot be stacked.`,
    alwaysEnabled: false,
  },
  {
    name: "Kumokiri",
    key: "ThreadofFateAllAttribute",
    hasStacks: false,
    modifiers: [
      {
        modifier: "AllElementAttributeBonus",
        modifierByRefinement: {
          "1": 0.24,
          "2": 0.3,
          "3": 0.36,
          "4": 0.42,
          "5": 0.48,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `At max stacks, when Resonators in the team inflict Negative Status, grants <span class="Highlight">24%/30%/36%/42%/48%</span> All-Attribute DMG Bonus for 15s. Effects of the same name cannot be stacked.`,
    alwaysEnabled: false,
  },
  {
    name: "Spectrum Blaster",
    key: "SpectrumBlasterAllDMG",
    hasStacks: true,
    modifiers: [
      {
        modifier: "AllElementAttributeBonus",
        modifierByRefinement: {
          "1": 0.08,
          "2": 0.1,
          "3": 0.12,
          "4": 0.14,
          "5": 0.16,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 3,
    details: `Each time the wielder inflicts <span class="highlight">Tune Rupture - Shifting</span> or <span class="highlight">Tune Strain - Shifting</span> during Basic Attacks, all DMG dealt by Resonators in the team is increased by <span class="highlight">8%/10%/12%/14%/16%</span> for 30s, up to 3 stacks. Effects of the same name cannot be stacked.`,
    alwaysEnabled: false,
  },
  {
    name: "Starfield Calibrator",
    key: "StarfieldCalibratorCritDMG",
    hasStacks: false,
    modifiers: [
      {
        modifier: "CritDMG",
        modifierByRefinement: {
          "1": 0.2,
          "2": 0.25,
          "3": 0.3,
          "4": 0.35,
          "5": 0.4,
        },
      },
    ],
    minStacks: 0,
    maxStacks: 0,
    details: `When the wielder heals Resonators, increases Crit. DMG of all nearby Resonators in the team by <span class="Param">20%/25%/30%/35%/40%</span> for 4s. Effects of the same name cannot be stacked.`,
    alwaysEnabled: false,
  },
];

export const allCharacters: string[] = [
  "Sanhua",
  "Baizhi",
  "Lingyang",
  "Lupa",
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
  "Zani",
  "Zhezhi",
];

type UtilityAttack = {
  key: string;
  label: string;
  talent: string;
  type: string;
  element: string;
};
export const utilityAttacks: UtilityAttack[] = [
  {
    key: "InherentSkillSuperAttractiveMagicBox",
    label: "Endless Gravity: Precious Box",
    talent: "20%*5",
    type: "Utility",
    element: "Havoc",
  },
];
