interface Echo {
  key: string;
  name: string;
  class: string;
  image: string;
  details: string;
  modifiers: EchoModifier[];
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
}

interface EchoModifier {
  modifier?: string;
  modifierValue?: number;
}

type MainEchoes = Record<string, Echo>;

// getting the html: copy(document.querySelector('.description').outerHTML)

export const mainEchoesData: MainEchoes = {
  AeroPredator: {
    key: "AeroPredator",
    name: "Aero Predator",
    class: "Common",
    image: "/images/echoes/AeroPredator.png",
    details: `<span class="description">Summon an Aero Predator that throws a dart forward. The dart will bounce between enemies up to three times, dealing <span class="param">18.00%/20.70%/23.40%/26.10%/28.80%</span> Aero DMG each time it hits.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  AlteredClangBang: {
    key: "AlteredClangBang",
    name: "Altered Clang Bang",
    class: "Common",
    image: "/images/echoes/AlteredClangBang.png",
    details: `Summon a Clang Bang that follows the enemy and eventually self-combusts, dealing 20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64 Glacio DMG.`,
    modifiers: [],
  },
  AlteredLightcrusher: {
    key: "AlteredLightcrusher",
    name: "Altered Lightcrusher",
    class: "",
    image: "/images/echoes/AlteredLightcrusher.png",
    details: `
    Transform into Lightcrusher that lunges forward, dealing 84.60%/97.29%/109.98%/122.67%/135.36% Spectro DMG. Generate 6 Ablucence on hit. Each Ablucence explosion deals 9.40%/10.81%/12.22%/13.63%/15.04% Spectro DMG.
    Hold the Echo Skill to stay in the Lightcrusher form, allowing you to lunge forward and walk in mid-air for a short distance.
    Cooldown: 15s`,
    modifiers: [],
  },
  AutopuppetScout: {
    key: "AutopuppetScout",
    name: "Autopuppet Scout",
    class: "Elite",
    image: "/images/echoes/AutopuppetScout.png",
    details: `<span class="description">Transform into Autopuppet Scout, dealing <span class="param">170.00%/195.50%/221.00%/246.50%/272.00%</span> Glacio DMG to the surroundings, and generate up to 3 Ice Walls to block off the enemies.
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  BellBorneGeochelone: {
    key: "BellBorneGeochelone",
    name: "Bell-Borne Geochelone",
    class: "Calamity",
    image: "/images/echoes/BellBorneGeochelone.png",
    details: `<span class="description">Activate the protection of Bell-Borne Geochelone. Deal Glacio DMG based on <span class="param">91.20%/104.88%/118.56%/132.24%/145.92%</span> of the current character's DEF to nearby enemies, and obtain a Bell-Borne Shield that lasts for <span class="param">15</span>s

    The Bell-Borne Shield provides <span class="param">50.00%</span> DMG Reduction and <span class="param">10.00%</span> DMG Boost for the current team members, and disappears after the current character is hit for <span class="param">3</span> times.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.1,
      },
    ],
  },
  Chaserazor: {
    key: "Chaserazor",
    name: "Chaserazor",
    class: "Elite",
    image: "/images/echoes/Chaserazor.png",
    details: `Transform into Carapace to perform a spinning attack that deals 80.50%/91.00%/101.50%/112.00% Aero DMG, followed by a slash that deals 120.75%/136.50%/152.25%/168.00% Aero DMG.
    CD: 15s`,
    modifiers: [],
  },
  ChasmGuardian: {
    key: "ChasmGuardian",
    name: "Chasm Guardian",
    class: "Elite",
    image: "/images/echoes/ChasmGuardian.png",
    details: `<span class="description">Transform into Chasm Guardian to perform a Leap Strike that deals <span class="param">171.00%/196.65%/222.30%/247.95%/273.60%</span> Havoc DMG on hit. Current character loses <span class="param">10.00%</span> HP after the hit lands. Periodically restore current character's HP after <span class="param">5</span>s for up to <span class="param">10.00%</span> of their Max HP.
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  Chirpuff: {
    key: "Chirpuff",
    name: "Chirpuff",
    class: "Common",
    image: "/images/echoes/Chirpuff.png",
    details: `<span class="description">Summon a Chirpuff that self-inflates and blasts a powerful gust of wind forward <span class="param">3</span> times. Each blast inflicts <span class="param">24.00%/27.60%/31.20%/34.80%/38.40%</span> Aero DMG and pushes enemies backwards.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  ClangBang: {
    key: "ClangBang",
    name: "Clang Bang",
    class: "Common",
    image: "/images/echoes/ClangBang.png",
    details: `<span class="description">Summon a Clang Bang that follows the enemy and eventually self-combusts, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Glacio DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  Crownless: {
    key: "Crownless",
    name: "Crownless",
    class: "Overlord",
    image: "/images/echoes/Crownless.png",
    details: `<span class="description">Transform into Crownless and perform up to 4 consecutive attacks. The first 2 attacks deal <span class="param">83.80%/96.37%/108.94%/121.51%/134.08%</span> Havoc DMG each, the 3rd attack deals <span class="param">62.85%/72.28%/81.71%/91.13%/100.56%</span> Havoc DMG 2 times, and the 4th attack deals <span class="param">41.90%/48.19%/54.47%/60.76%/67.04%</span> Havoc DMG 3 times.

    After the transformation, increase current character's Havoc DMG by <span class="param">12.00%</span> and Resonance Skill DMG by <span class="param">12.00%</span> for <span class="param">15</span>s.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.12,
      },
    ],
  },
  Cruisewing: {
    key: "Cruisewing",
    name: "Cruisewing",
    class: "Common",
    image: "/images/echoes/Cruisewing.png",
    details: `<span class="description">Summon a Cruisewing that restores HP for all current team characters by <span class="param">1%/1.20%/1.40%/1.60%/1.80%</span> of their Max HPs plus an additional <span class="param">80</span> points of HP, up to 4 times.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  CyanFeatheredHeron: {
    key: "CyanFeatheredHeron",
    name: "Cyan-Feathered Heron",
    class: "Elite",
    image: "/images/echoes/CyanFeatheredHeron.png",
    details: `<span class="description">Transform into Cyan-Feathered Heron and charge at the enemies, dealing <span class="param">148.00%/170.20%/192.40%/214.60%/236.80%</span> Aero DMG; This Echo Skill interrupts enemy <color=highlight>Special Skills upon dealing damage.
    CD: <span class="param">15</span>s</color=highlight></span>`,
    modifiers: [],
  },
  Diamondclaw: {
    key: "Diamondclaw",
    name: "Diamondclaw",
    class: "Common",
    image: "/images/echoes/Diamondclaw.png",
    details: `<span class="description">Transform into Crystal Scorpion and enter a Parry State. Counterattack when the Parry State is over, dealing <span class="param">30.00%+60/34.50%+69/39.00%+78/43.50%+87/48.00%+96</span> Physical DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  Dreamless: {
    key: "Dreamless",
    name: "Dreamless",
    class: "Calamity",
    image: "/images/echoes/Dreamless.png",
    details: `<span class="description">Transform into Dreamless and perform 6 consecutive strikes. The first 5 strikes deal <span class="param">33.80%/38.87%/43.94%/49.01%/54.08%</span> Havoc DMG each, and the last strike deal <span class="param">169.00%/194.35%/219.70%/245.05%/270.40%</span> Havoc DMG.
    The DMG of this Echo Skill is increased by <span class="param">50.00%</span> during the first <span class="param">5</span>s after Rover: Havoc casts Resonance Liberation: Deadening Abyss.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [],
  },
  DwarfCassowary: {
    key: "DwarfCassowary",
    name: "Dwarf Cassowary",
    class: "Common",
    image: "/images/echoes/DwarfCassowary.png",
    details: `<span class="description">Summon a Dwarf Cassowary that tracks and attacks the enemy, dealing <span class="param">24.00%/27.60%/31.20%/34.80%/38.40%</span> Physical DMG <span class="param">3</span> time(s).

    Cooldown: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  ElectroPredator: {
    key: "ElectroPredator",
    name: "Electro Predator",
    class: "Common",
    image: "/images/echoes/ElectroPredator.png",
    details: `<span class="description">Summon an Electro Predator to shoot the enemy 5 times. The first 4 shots deals <span class="param">10.80%/12.42%/14.04%/15.66%/17.28%</span> Electro DMG, and the last deals <span class="param">28.80%/33.12%/37.44%/41.76%/46.08%</span> Electro DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  Excarat: {
    key: "Excarat",
    name: "Excarat",
    class: "Common",
    image: "/images/echoes/Excarat.png",
    details: `<span class="description">Transform into an Excarat and tunnel underground to advance. In this state, you have the ability to change your direction and are immune to damage.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  FissionJunrock: {
    key: "FissionJunrock",
    name: "Fission Junrock",
    class: "Common",
    image: "/images/echoes/FissionJunrock.png",
    details: `<span class="description">Summon a Fission Junrock. Generate a Resonance Effect that restores <span class="param">2%</span> HP for friendly units each time. If not in combat, you can pick up minerals or plants nearby.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  Flautist: {
    key: "Flautist",
    name: "Flautist",
    class: "Elite",
    image: "/images/echoes/Flautist.png",
    details: `<span class="description">Transform into Flautist, continuously emitting Electro lasers, dealing <span class="param">33.30%/38.30%/43.29%/48.29%/53.28%</span> Electro DMG for a total of 10 times. Gain <span class="param">1</span> Concerto Energy every time a hit lands.
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  FusionDreadmane: {
    key: "FusionDreadmane",
    name: "Fusion Dreadmane",
    class: "Common",
    image: "/images/echoes/FusionDreadmane.png",
    details: `<span class="description">Summon a Fusion Dreadmane that fiercely strikes the enemy, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Fusion DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  FusionPrism: {
    key: "FusionPrism",
    name: "Fusion Prism",
    class: "Common",
    image: "/images/echoes/FusionPrism.png",
    details: `<span class="description">Summon a Fusion Prism to fire a crystal shard, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Fusion DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  FusionWarrior: {
    key: "FusionWarrior",
    name: "Fusion Warrior",
    class: "Common",
    image: "/images/echoes/FusionWarrior.png",
    details: `<span class="description">Transform into Fusion Warrior to perform a Counterattack. If the Counterattack is successful, the cooldown time of this skill will be reduced by <span class="param">70.00%</span>, and <span class="param">180.00%/207.00%/234.00%/261.00%/288.00%</span> Fusion DMG will be dealt.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  Gulpuff: {
    key: "Gulpuff",
    name: "Gulpuff",
    class: "Common",
    image: "/images/echoes/Gulpuff.png",
    details: `<span class="description">Summon a Gulpuff that blows bubbles <span class="param">5</span> times, each time dealing <span class="param">14.40%/16.56%/18.72%/20.88%/23.04%</span> Glacio DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  HavocDreadmane: {
    key: "HavocDreadmane",
    name: "Havoc Dreadmane",
    class: "Common",
    image: "/images/echoes/HavocDreadmane.png",
    details: `<span class="description">Transform into a Havoc Dreadmane to perform up to 2 tail strikes. Each strike deals <span class="param">72.90%/83.84%/94.77%/105.71%/116.64%</span> Havoc DMG and inflicts an additional instance of <span class="param">48.60%/55.89%/63.18%/70.47%/77.76%</span> Havoc DMG upon hitting the target.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  HavocPrism: {
    key: "HavocPrism",
    name: "Havoc Prism",
    class: "Common",
    image: "/images/echoes/HavocPrism.png",
    details: `<span class="description">Summon a Havoc Prism to fire five crystal shards, each dealing <span class="param">14.40%/16.56%/18.72%/20.88%/23.04%</span> Havoc DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  HavocWarrior: {
    key: "HavocWarrior",
    name: "Havoc Warrior",
    class: "Common",
    image: "/images/echoes/HavocWarrior.png",
    details: `<span class="description">Transform into Havoc Warrior to attack up to 3 times, dealing <span class="param">107.33%/123.43%/139.53%/155.63%/171.73%</span> Havoc DMG each time.
 
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  Hoartoise: {
    key: "Hoartoise",
    name: "Hoartoise",
    class: "Common",
    image: "/images/echoes/Hoartoise.png",
    details: `<span class="description">Transform into Hoartoise and slowly restore HP. Use the Echo skill again to exit the transformation state.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  Hoochief: {
    key: "Hoochief",
    name: "Hoochief",
    class: "Elite",
    image: "/images/echoes/Hoochief.png",
    details: `<span class="description">Transform into Hoochief Cyclone and smack the enemies, dealing <span class="param">149%/178.80%/208.60%/238.40%/268.20%</span> Aero DMG.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  HoochiefCyclone: {
    key: "HoochiefCyclone",
    name: "Hoochief Cyclone",
    class: "Elite",
    image: "/images/echoes/HoochiefCyclone.png",
    details: `Transform into Hoochief Cyclone and smack the enemies, dealing 178.80%/208.60%/238.40%/268.20% Aero DMG.`,
    modifiers: [],
  },
  // HoochiefMenace: {
  //   key: "HoochiefMenace",
  //   name: "Hoochief Menace",
  //   class: "Elitezs",
  //   image: "/images/echoes/HoochiefMenace.png",
  //   details: ``,
  //   modifiers: [],
  // },
  Hooscamp: {
    key: "Hooscamp",
    name: "Hooscamp",
    class: "Common",
    image: "/images/echoes/Hooscamp.png",
    details: `<span class="description">Transform into Hooscamp Flinger and pounce at the enemies, dealing <span class="param">30.00%+60/34.50%+69/39.00%+78/43.50%+87/48.00%+96</span> Aero DMG.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  // HooscampClapperclaw: {
  //   key: "HooscampClapperclaw",
  //   name: "Hooscamp Clapperclaw",
  //   class: "",
  //   image: "/images/echoes/HooscampClapperclaw.png",
  //   details: ``,
  //   modifiers: [],
  // },
  // HooscampFlinger: {
  //   key: "HooscampFlinger",
  //   name: "Hooscamp Flinger",
  //   class: "",
  //   image: "/images/echoes/HooscampFlinger.png",
  //   details: ``,
  //   modifiers: [],
  // },
  ImpermanenceHeron: {
    key: "ImpermanenceHeron",
    name: "Impermanence Heron",
    class: "Overlord",
    image: "/images/echoes/ImpermanenceHeron.png",
    details: `<span class="description">Transform into Impermanence Heron to fly up and smack down, dealing <span class="param">194.10%/223.22%/252.33%/281.45%/310.56%</span> Havoc DMG.

    Long press to stay as Impermanence Heron and continuously spit flames, each attack dealing <span class="param">34.83%/40.05%/45.28%/50.50%/55.73%</span> Havoc DMG.
    
    Once the initial attack lands on any enemy, the current character regains 10 Resonance Energy. If the current character uses their Outro Skill within the next 15s, the next character’s damage dealt will be boosted by 12% for 15s.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [],
  },
  InfernoRider: {
    key: "InfernoRider",
    name: "Inferno Rider",
    class: "Overlord",
    image: "/images/echoes/InfernoRider.png",
    details: `<span class="description">Transform into Inferno Rider to launch up to 3 consecutive slashes in a row, each slash dealing <span class="param">151.50%/174.23%/196.95%/219.68%/242.40%</span>, <span class="param">176.75%/203.26%/229.78%/256.29%/282.80%</span>, and <span class="param">176.75%/203.26%/229.78%/256.29%/282.80%</span> Fusion DMG respectively.

    After the final hit, increase the current character’s Fusion DMG by <span class="param">12.00%</span> and Basic Attack DMG by <span class="param">12.00%</span> for <span class="param">15</span>s.
    
    Long press the Echo Skill to transform into Inferno Rider and enter the Riding Mode. When exiting the Riding Mode, deal <span class="param">176.75%/203.26%/229.78%/256.29%/282.80%</span> Fusion DMG to enemies in front.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.12,
      },
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
  },
  Jué: {
    key: "Jué",
    name: "Jué",
    class: "Overlord",
    image: "/images/echoes/Jue.png",
    details: `<span class="description">Summon Jué to leap into the air, dealing <span class="param">30.40%/34.96%/39.52%/44.08%/48.64%</span> Spectro DMG to the enemies and bringing forth Lightthunder. Lightthunder hits up to 5 times in total, each dealing <span class="param">12.16%/13.98%/15.81%/17.63%/19.46%</span> Spectro DMG to the surrounding enemies. Then Jué spirals downward to attack the surrounding enemies, dealing <span class="param">30.40%/34.96%/39.52%/44.08%/48.64%</span> Spectro DMG two times in a row. 
    The Resonator equipped with this Echo Skill obtains 1 stack of "Blessing of Time" every 6s, stacking up to 3 times. When the Resonator performs Resonance Skill, 1 stack of "Blessing of Time" is consumed, dealing <span class="param">15</span> Spectro DMG to the surrounding enemies. The enemies hit receive <span class="param">16.00%</span> Spectro DMG per second over 6s, stacking up to 3 times and new stacks extending the effect period. The damage dealt through consuming the stacks of "Blessing of Time" is considered as Resonance Skill DMG.
    
    CD: <span class="param">10.00%/11.50%/13.00%/14.50%/16.00%</span>s</span>`,
    modifiers: [],
  },
  LampylumenMyriad: {
    key: "LampylumenMyriad",
    name: "Lampylumen Myriad",
    class: "Overlord",
    image: "/images/echoes/LampylumenMyriad.png",
    details: `<span class="description">Transform into Lampylumen Myriad. Perform up to 3 consecutive attacks.

    Unleash a freezing shock by performing consecutive forward strikes, with the initial two strikes inflicting <span class="param">125.10%/143.87%/162.63%/181.40%/200.16%</span> and <span class="param">125.10%/143.87%/162.63%/181.40%/200.16%</span> Glacio DMG respectively, and the final strike dealing <span class="param">166.80%/191.82%/216.84%/241.86%/266.88%</span> Glacio DMG. Enemies will be frozen on hit.
    
    Each shock increases the current character’s Glacio DMG by <span class="param">4.00%</span> and Resonance Skill DMG dealt by <span class="param">4.00%</span> for <span class="param">15</span>s, stacking up to 3 times
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.04,
      },
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.04,
      },
    ],
    hasStacks: true,
    minStacks: 0,
    maxStacks: 3,
  },
  Lightcrusher: {
    key: "Lightcrusher",
    name: "Lightcrusher",
    class: "Elite",
    image: "/images/echoes/Lightcrusher.png",
    details: `<span class="description">Lunge forward as a Lightcrusher, dealing <span class="param">84.60%/97.29%/109.98%/122.67%/135.36%</span> Spectro DMG. Generate <span class="param">6</span> Ablucence on hit. Each Ablucence explosion deals <span class="param">9.40%/10.81%/12.22%/13.63%/15.04%</span> Spectro DMG.
    Hold the Echo Skill to stay in the Lightcrusher form, which allows you to leap up and pounce forward in the air for a short distance.
    
    Cooldown: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  LumiscaleConstruct: {
    key: "LumiscaleConstruct",
    name: "Lumiscale Construct",
    class: "Elite",
    image: "/images/echoes/LumiscaleConstruct.png",
    details: `<span class="description">Transform into a Lumiscale Construct and enter a Parry Stance. If you are not attacked during the Parry Stance, slash to deal <span class="param">346.00%/397.90%/449.80%/501.70%/553.60%</span> Glacio DMG when the stance finishes. If attacked, counterattack instantly, dealing <span class="param">346.00%+173.00%/397.90%+198.95%/449.80%+224.90%/501.70%+250.85%/553.60%+276.80%</span> Glacio DMG. When hit with a <color=highlight>Special Skill attack while in the Parry Stance, break the <color=highlight>Special Skill and counterattack, dealing <span class="param">346.00%+173.00%/397.90%+198.95%/449.80%+224.90%/501.70%+250.85%/553.60%+276.80%</span> Glacio DMG.

    CD: <span class="param">15</span>s</color=highlight></color=highlight></span>`,
    modifiers: [],
  },
  MechAbomination: {
    key: "MechAbomination",
    name: "Mech Abomination",
    class: "Overlord",
    image: "/images/echoes/MechAbomination.png",
    details: `<span class="description">Strike enemies in front, dealing <span class="param">30.40%/34.96%/39.52%/44.08%/48.64%</span> Electro DMG, and summon Mech Waste to attack. Mech Waste deals <span class="param">200.00%/230.00%/260.00%/290.00%/320.00%</span> Electro DMG on hit and explodes after a while, dealing <span class="param">100.00%/115.00%/130.00%/145.00%/160.00%</span> Electro DMG.

    After casting this Echo Skill, increase the current character's ATK by <span class="param">12.00%</span> for <span class="param">15</span>s. 
    Damage dealt by Mech Waste equals to the Resonator's Outro Skill DMG. 
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "ATK",
        modifierValue: 0.12,
      },
    ],
  },
  MourningAix: {
    key: "MourningAix",
    name: "Mourning Aix",
    class: "Overlord",
    image: "/images/echoes/MourningAix.png",
    details: `<span class="description">Transform into Mourning Aix and perform 2 consecutive claw attacks, each attack dealing <span class="param">98.40%/113.16%/127.92%/142.68%/157.44%</span> and <span class="param">147.60%/169.74%/191.88%/214.02%/236.16%</span> Spectro DMG respectively.

    After the transformation, increase current character's Spectro DMG by <span class="param">12.00%</span> and Resonance Liberation DMG by <span class="param">12.00%</span> for <span class="param">15</span>s
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.12,
      },
    ],
  },
  // PhantomFeilianBeringal: {
  //   key: "PhantomFeilianBeringal",
  //   name: "Phantom: Feilian Beringal",
  //   class: "",
  //   image: "/images/echoes/PhantomFeilianBeringal.png",
  //   details: ``,
  //   modifiers: [],
  // },
  // PhantomHoartoise: {
  //   key: "PhantomHoartoise",
  //   name: "Phantom: Hoartoise",
  //   class: "",
  //   image: "/images/echoes/PhantomHoartoise.png",
  //   details: ``,
  //   modifiers: [],
  // },
  // PhantomImpermanenceHeron: {
  //   key: "PhantomImpermanenceHeron",
  //   name: "Phantom: Impermanence Heron",
  //   class: "",
  //   image: "/images/echoes/PhantomImpermanenceHeron.png",
  //   details: ``,
  //   modifiers: [],
  // },
  // PhantomMourningAix: {
  //   key: "PhantomMourningAix",
  //   name: "Phantom: Mourning Aix",
  //   class: "",
  //   image: "/images/echoes/PhantomMourningAix.png",
  //   details: ``,
  //   modifiers: [],
  // },
  // PhantomRocksteadyGuardian: {
  //   key: "PhantomRocksteadyGuardian",
  //   name: "Phantom: Rocksteady Guardian",
  //   class: "",
  //   image: "/images/echoes/PhantomRocksteadyGuardian.png",
  //   details: ``,
  //   modifiers: [],
  // },
  // PhantomThunderingMephis: {
  //   key: "PhantomThunderingMephis",
  //   name: "Phantom: Thundering Mephis",
  //   class: "",
  //   image: "/images/echoes/PhantomThunderingMephis.png",
  //   details: ``,
  //   modifiers: [],
  // },
  RocksteadyGuardian: {
    key: "RocksteadyGuardian",
    name: "Rocksteady Guardian",
    class: "Elite",
    image: "/images/echoes/RocksteadyGuardian.png",
    details: `<span class="description">Transform into Rocksteady Guardian and enter a Parry State. Upon being attacked, deal Spectro DMG equal to <span class="param">5.18%/5.96%/6.73%/7.51%/8.29%</span> of the Resonator's Max HP, and perform a follow-up attack that deals Spectro DMG equal to <span class="param">5.18%/5.96%/6.73%/7.51%/8.29%</span> of the Resonator's Max HP.
 
    Use the Echo Skill again to exit the transformation.
     
    If the attack received is a <color=highlight>Special Skill attack, interrupt the enemy's <color=highlight>Special Skill, gain a Shield equal to 30% Max HP, and perform a two-stage follow-up attack, each dealing Spectro DMG equal to <span class="param">3.45%/3.97%/4.49%/5.00%/5.52%</span> of the Resonator's Max HP. These follow-up attacks simultaneously launch three ground-breaking waves, each dealing Spectro DMG equal to <span class="param">2.87%/3.30%/3.73%/4.16%/4.59%</span> of the Resonator's Max HP.
     
    CD: <span class="param">15</span>s</color=highlight></color=highlight></span>`,
    modifiers: [],
  },
  Roseshroom: {
    key: "Roseshroom",
    name: "Roseshroom",
    class: "Elite",
    image: "/images/echoes/Roseshroom.png",
    details: `<span class="description">Summon a Roseshroom that fires a laser, dealing <span class="param">35.67%/41.02%/46.37%/51.72%/57.07%</span> Havoc DMG up to <span class="param">3</span> times.
 
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  SabyrBoar: {
    key: "SabyrBoar",
    name: "Sabyr Boar",
    class: "Common",
    image: "/images/echoes/SabyrBoar.png",
    details: `<span class="description">Summon a Sabyr Boar to headbutt the enemy into the air, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Physical DMG.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  // Scar: {
  //   key: "Scar",
  //   name: "Scar",
  //   class: "",
  //   image: "/images/echoes/Scar.png",
  //   details: ``,
  //   modifiers: [],
  // },
  SnipSnap: {
    key: "SnipSnap",
    name: "Snip Snap",
    class: "Common",
    image: "/images/echoes/SnipSnap.png",
    details: `<span class="description">Summon a Snip Snap that throws fireballs at the enemy, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Fusion DMG on-hit.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  Spearback: {
    key: "Spearback",
    name: "Spearback",
    class: "Elite",
    image: "/images/echoes/Spearback.png",
    details: `<span class="description">Summon a Spearback to perform 5 consecutive attacks. The first 4 attacks deal <span class="param">18.73%/21.53%/24.34%/27.15%/29.96%</span> Physical DMG, and the last deals <span class="param">32.10%/36.92%/41.73%/46.55%/51.36%</span> Physical DMG.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  SpectroPrism: {
    key: "SpectroPrism",
    name: "Spectro Prism",
    class: "Common",
    image: "/images/echoes/SpectroPrism.png",
    details: `<span class="description">Summon a Spectro Prism to emit a laser that hits the enemy up to <span class="param">8</span> times, dealing <span class="param">9.00%/10.35%/11.70%/13.05%/14.40%</span> Spectro DMG each time.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  StonewallBracer: {
    key: "StonewallBracer",
    name: "Stonewall Bracer",
    class: "Elite",
    image: "/images/echoes/StonewallBracer.png",
    details: `<span class="description">Transform into Stonewall Bracer and charge forward, dealing <span class="param">70.40%/80.96%/91.52%/102.08%/112.64%</span> Physical DMG on-hit, then smash to deal <span class="param">105.60%/121.44%/137.28%/153.12%/168.96%</span> Physical DMG, and gain a shield of <span class="param">10.00%</span> of current character's Max HP that lasts <span class="param">7</span>s. Use the Echo skill again to exit the transformation state.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  TempestMephis: {
    key: "TempestMephis",
    name: "Tempest Mephis",
    class: "Overlord",
    image: "/images/echoes/TempestMephis.png",
    details: `<span class="description">Transform into Tempest Mephis to perform tail swing attacks followed by a claw attack. The lightning strike summoned by the tail swing deals <span class="param">64.05%/73.66%/83.27%/92.87%/102.48%</span> Electro DMG each time, while the claw attack deals <span class="param">109.80%/126.27%/142.74%/159.21%/175.68%</span> Electro DMG.



    After the claw hit, increase the current character’s Electro DMG by <span class="param">12.00%</span> and Heavy Attack DMG by <span class="param">12.00%</span> for <span class="param">15</span>s.
    
    
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.12,
      },
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
  },
  ThunderingMephis: {
    key: "ThunderingMephis",
    name: "Thundering Mephis",
    class: "Overlord",
    image: "/images/echoes/ThunderingMephis.png",
    details: `<span class="description">Transform into Thundering Mephis, engaging in a rapid assault of up to 6 strikes. The first 5 strikes deal <span class="param">82.88%/95.31%/107.74%/120.18%/132.61%</span> Electro DMG each, while the final strike inflicts <span class="param">118.40%/136.16%/153.92%/171.68%/189.44%</span> Electro DMG, with an additional <span class="param">19.73%/22.69%/25.65%/28.61%/31.57%</span> Electro DMG from the thunder.

    After the final hit, increase the current character’s Electro DMG by <span class="param">12.00%</span> and Resonance Liberation DMG by <span class="param">12.00%</span> for <span class="param">15</span>s.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.12,
      },
    ],
  },
  TickTack: {
    key: "TickTack",
    name: "Tick Tack",
    class: "Common",
    image: "/images/echoes/TickTack.png",
    details: `<span class="description">Summon a Tick Tack that charges and bites the enemy. The charge from Tick Tack will deal <span class="param">42.80%/49.22%/55.64%/62.06%/68.48%</span> Havoc DMG to the enemy, and the bite will deal <span class="param">64.20%/73.83%/83.46%/93.09%/102.72%</span> Havoc DMG to the enemy. Reduces enemy Vibration Strength by up to <span class="param">5.00%</span> during <span class="param">5</span>s.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  TrafficIlluminator: {
    key: "TrafficIlluminator",
    name: "Traffic Illuminator",
    class: "Common",
    image: "/images/echoes/TrafficIlluminator.png",
    details: `<span class="description">Summon a Traffic Illuminator, immobilizing enemies for up to <span class="param">1</span>s. The immobilization will be lifted once the enemy is hit.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  VanguardJunrock: {
    key: "VanguardJunrock",
    name: "Vanguard Junrock",
    class: "Common",
    image: "/images/echoes/VanguardJunrock.png",
    details: `<span class="description">Summon a Vanguard Junrock that charges forward, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Physical DMG to enemies in its path.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  VioletFeatheredHeron: {
    key: "VioletFeatheredHeron",
    name: "Violet-Feathered Heron",
    class: "Elite",
    image: "/images/echoes/VioletFeatheredHeron.png",
    details: `<span class="description">Transform into Violet-Feathered Heron and enter a Parry Stance. Counterattack when the Parry stance is over, dealing <span class="param">180.00%/207.00%/234.00%/261.00%/288.00%</span> Electro DMG. If attacked during Parry Stance, you can counterattack in advance and additionally recover <span class="param">5</span> Concerto Energy.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  WhiffWhaff: {
    key: "WhiffWhaff",
    name: "Whiff Whaff",
    class: "Common",
    image: "/images/echoes/WhiffWhaff.png",
    details: `<span class="description">Summon a Whiff Whaff that triggers an air explosion, dealing <span class="param">32.10%/36.92%/41.73%/46.55%/51.36%</span> Aero DMG and produce a Low-pressure Zone. The Low-pressure Zone continuously pulls enemies nearby towards the center for <span class="param">2</span>s, dealing <span class="param">12.48%/14.35%/16.22%/18.10%/19.97%</span> Aero DMG up to 6 times.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
  YoungGeohideSaurian: {
    key: "YoungGeohideSaurian",
    name: "Young Geohide Saurian",
    class: "Common",
    image: "/images/echoes/YoungGeohideSaurian.png",
    details: `Transform into Baby Viridblaze Saurian to rest in place, and slowly restore HP.`,
    modifiers: [],
  },
  YoungRoseshroom: {
    key: "YoungRoseshroom",
    name: "Young Roseshroom",
    class: "Common",
    image: "/images/echoes/YoungRoseshroom.png",
    details: `<span class="description">Summon a Baby Roseshroom that fires a laser, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Havoc DMG.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
  },
  ZigZag: {
    key: "ZigZag",
    name: "Zig Zag",
    class: "Common",
    image: "/images/echoes/ZigZag.png",
    details: `<span class="description">Summon a Zig Zag that denotates Spectro energy, dealing <span class="param">30.00%+60/34.50%+69/39.00%+78/43.50%+87/48.00%+96</span> Spectro DMG and creating a Stagnation Zone that lasts 1.8s.



    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
  },
};
