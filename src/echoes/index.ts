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
  actions?: EchoAction[];
  sets: string[];
}

interface EchoAction {
  key: string;
  label: string;
  talents: Record<string, string>;
  description: string;
  element: string;
  type: string;
  attribute?: string;
  subType?: string;
}

interface EchoModifier {
  modifier?: string;
  modifySpecificTalents?: string[];
  modifierValue?: number;
  specificCharacters?: string[];
}

type MainEchoes = Record<string, Echo>;

export function getEchoData(echoKey: string): Echo {
  return mainEchoesData[echoKey];
}

export const echoCostClassMap: Record<string, number> = {
  Calamity: 4,
  Overlord: 4,
  Elite: 3,
  Common: 1,
};

export function getCostByClass(echoClass: string): number {
  return echoCostClassMap[echoClass];
}

export const mainEchoesData: MainEchoes = {
  AbyssalGladius: {
    key: "AbyssalGladius",
    name: "Abyssal Gladius",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/AbyssalGladius.webp",
    details: `A humanoid Tacet Discord born from the abyssal sea that assumes the semblance of an aristocratic knight, a fully differentiated form of Primordia Bloom.`,
    modifiers: [],
    actions: [],
    sets: ["MidnightVeil", "TidebreakingCourage"],
  },
  AbyssalPatricius: {
    key: "AbyssalPatricius",
    name: "Abyssal Patricius",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/abyssalvenator.png",
    details: `Transform into Abyssal Patricius and charge forward to attack enemies, dealing 268.20% Glacio DMG.
The Resonator with this Echo equipped in the main slot gains 12.00% Glacio DMG Bonus.
CD: 15s.`,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "ChargeDMG",
        label: "Charge DMG",
        description: `Transform into Abyssal Patricius and charge forward to attack enemies, dealing 268.20% Glacio DMG.`,
        talents: {
          "1": "178.80%",
          "2": "178.80%",
          "3": "208.60%",
          "4": "238.40%",
          "5": "268.20%",
        },
        type: "Echo",
        element: "Glacio",
      },
    ],
    sets: ["FrostyResolve", "EmpyreanAnthem"],
  },
  AbyssalMercator: {
    key: "AbyssalMercator",
    name: "Abyssal Mercator",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/abyssalmercator.png",
    details: `A humanoid Tacet Discord born from the abyssal sea that assumes the semblance of an aristocratic merchant, a fully differentiated form of Primordia Bloom.`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "EternalRadiance"],
  },
  AeroDrake: {
    key: "AeroDrake",
    name: "Aero Drake",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/AeroDrake.webp",
    details: ``,
    modifiers: [],
    actions: [],
    sets: ["GustsofWelkin", "TidebreakingCourage"],
  },
  AeroPredator: {
    key: "AeroPredator",
    name: "Aero Predator",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/AeroPredator.png",
    details: `<span class="description">Summon an Aero Predator that throws a dart forward. The dart will bounce between enemies up to three times, dealing <span class="param">18.00%/20.70%/23.40%/26.10%/28.80%</span> Aero DMG each time it hits.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "AeroPredatorDart",
        label: "Dart DMG",
        description: `Summon an Aero Predator that throws a dart forward. The dart will bounce between enemies up to three times, dealing <span class="param">18.00%/20.70%/23.40%/26.10%/28.80%</span> Aero DMG each time it hits.`,
        talents: {
          "1": "18.00%*3",
          "2": "20.70%*3",
          "3": "23.40%*3",
          "4": "26.10%*3",
          "5": "28.80%*3",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["VoidThunder", "SierraGale"],
  },
  AeroPrism: {
    key: "AeroPrism",
    name: "Aero Prism",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/AeroPrism.png",
    details: `<span class="description">Summon an Aero Prism to attack enemies, dealing <span class="param">10.70%/12.84%/14.98%/17.12%/19.26%</span> Aero DMG.
CD: <span class="param">15</span>s.</span>`,
    modifiers: [],
    actions: [
      {
        key: "AeroPrismDMG",
        label: "Aero Prism DMG",
        description: `Summon an Aero Prism to attack enemies, dealing <span class="param">10.70%/12.84%/14.98%/17.12%/19.26%</span> Aero DMG.
CD: <span class="param">15</span>s.`,
        talents: {
          "1": "10.70%",
          "2": "12.84%",
          "3": "14.98%",
          "4": "17.12%",
          "5": "19.26%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["EternalRadiance", "TidebreakingCourage"],
  },
  AutopuppetScout: {
    key: "AutopuppetScout",
    name: "Autopuppet Scout",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/AutopuppetScout.png",
    details: `<span class="description">Transform into Autopuppet Scout, dealing <span class="param">170.00%/195.50%/221.00%/246.50%/272.00%</span> Glacio DMG to the surroundings, and generate up to 3 Ice Walls to block off the enemies.
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "AutopuppetScoutAttacak",
        label: "Attack DMG",
        description: `Transform into Autopuppet Scout, dealing <span class="param">170.00%/195.50%/221.00%/246.50%/272.00%</span> Glacio DMG to the surroundings, and generate up to 3 Ice Walls to block off the enemies.`,
        talents: {
          "1": "170.00%",
          "2": "195.50%",
          "3": "221.00%",
          "4": "246.50%",
          "5": "272.00%",
        },
        type: "Echo",
        element: "Glacio",
      },
    ],
    sets: ["FreezingFrost", "CelestialLight"],
  },
  BabyViridblazeSaurian: {
    key: "BabyViridblazeSaurian",
    name: "Baby Viridblaze Saurian",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/YoungGeohideSaurian.png",
    details: `Transform into Baby Viridblaze Saurian to rest in place, and slowly restore HP.`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "VoidThunder", "LingeringTunes"],
  },
  BellBorneGeochelone: {
    key: "BellBorneGeochelone",
    name: "Bell-Borne Geochelone",
    class: "Calamity",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/BellBorneGeochelone.png",
    details: `<span class="description">Activate the protection of Bell-Borne Geochelone. Deal Glacio DMG based on <span class="param">91.20%/104.88%/118.56%/132.24%/145.92%</span> of the current character's DEF to nearby enemies, and obtain a Bell-Borne Shield that lasts for <span class="param">15</span>s

The Bell-Borne Shield provides <span class="param">50.00%</span> DMG Reduction and <span class="param">10.00%</span> DMG Boost for the current team members, and disappears after the current character is hit for <span class="param">3</span> times.

CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "DMGBonus",
        modifierValue: 0.1,
      },
    ],
    actions: [
      {
        key: "BellBorneGeocheloneActivation",
        label: "Activation DMG",
        description: `<span class="description">Activate the protection of Bell-Borne Geochelone. Deal Glacio DMG based on <span class="param">91.20%/104.88%/118.56%/132.24%/145.92%</span> of the current character's DEF to nearby enemies, and obtain a Bell-Borne Shield that lasts for <span class="param">15</span>s

The Bell-Borne Shield provides <span class="param">50.00%</span> DMG Reduction and <span class="param">10.00%</span> DMG Boost for the current team members, and disappears after the current character is hit for <span class="param">3</span> times.

CD: <span class="param">20</span>s</span>`,
        talents: {
          "1": "91.20%",
          "2": "104.88%",
          "3": "118.56%",
          "4": "132.24%",
          "5": "145.92%",
        },
        type: "Echo",
        element: "Glacio",
        attribute: "def",
      },
    ],
    sets: ["RejuvenatingGlow", "MoonlitClouds"],
  },
  CalcifiedJunrock: {
    key: "CalcifiedJunrock",
    name: "Calcified Junrock",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/CalcifiedJunrock.png",
    details: `<span class="description">Summon a Calcified Junrock that restores HP for nearby Resonators in the team by <span class="param">1.40%/1.68%/1.96%/2.24%/2.52%</span> of their Max HP, up to 5 times.
CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["EmpyreanAnthem", "TidebreakingCourage"],
  },
  Capitaneus: {
    key: "Capitaneus",
    name: "Capitaneus",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Capitaneus.webp",
    details: `Summon a Capitaneus to jump up and smash enemies, dealing 79.20% Spectro DMG. This attack generates 4 extra Merciless Judgements, each dealing 39.60% Spectro DMG.<br>
The Resonator with this Echo equipped in their main slot gains 12.00% Spectro DMG Bonus and 12.00% Heavy Attack DMG Bonus.<br>
CD: 20s.`,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.12,
      },
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "CapitaneusDMG",
        label: "Capitaneus DMG",
        description: `Summon a Capitaneus to jump up and smash enemies, dealing 79.20%/92.40%/105.60%/118.80% Spectro DMG. This attack generates 4 extra Merciless Judgements, each dealing 39.60%/46.20%/52.80%/59.40% Spectro DMG.`,
        talents: {
          "1": "79.20% + 39.60%*4",
          "2": "79.20% + 39.60%*4",
          "3": "92.40% + 46.20%%*4",
          "4": "105.60% + 52.80%*4",
          "5": "118.00% + 59.50%*4",
        },
        type: "Echo",
        element: "Spectro",
      },
    ],
    sets: ["GustsofWelkin", "EternalRadiance", "WindwardPilgrimage"],
  },
  Carapace: {
    key: "Carapace",
    name: "Carapace",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Chaserazor.png",
    details: `Transform into Carapace to perform a spinning attack that deals 80.50%/91.00%/101.50%/112.00% Aero DMG, followed by a slash that deals 120.75%/136.50%/152.25%/168.00% Aero DMG.
    CD: 15s`,
    modifiers: [],
    actions: [
      {
        key: "CarapaceSpinningAttack",
        label: "Spinning Attack DMG",
        description: `Transform into Carapace to perform a spinning attack that deals 80.50%/91.00%/101.50%/112.00% Aero DMG, followed by a slash that deals 120.75%/136.50%/152.25%/168.00% Aero DMG.`,
        talents: {
          "1": "80.50% + 120.75%",
          "2": "91.00% + 120.75%",
          "3": "91.00% + 136.50%",
          "4": "101.50% + 152.25%",
          "5": "112.00% + 168.00%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["SierraGale", "MoonlitClouds"],
  },
  ChasmGuardian: {
    key: "ChasmGuardian",
    name: "Chasm Guardian",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ChasmGuardian.png",
    details: `<span class="description">Transform into Chasm Guardian to perform a Leap Strike that deals <span class="param">171.00%/196.65%/222.30%/247.95%/273.60%</span> Havoc DMG on hit. Current character loses <span class="param">10.00%</span> HP after the hit lands. Periodically restore current character's HP after <span class="param">5</span>s for up to <span class="param">10.00%</span> of their Max HP.
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "ChasmGuardianLeap",
        label: "Leap DMG",
        description: `Transform into Chasm Guardian to perform a Leap Strike that deals <span class="param">171.00%/196.65%/222.30%/247.95%/273.60%</span> Havoc DMG on hit`,
        talents: {
          "1": "171.00%",
          "2": "196.65%",
          "3": "222.30%",
          "4": "247.95%",
          "5": "273.60%",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["RejuvenatingGlow", "LingeringTunes"],
  },
  ChestMimic: {
    key: "ChestMimic",
    name: "Chest Mimic",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/chestmimic.png",
    details: `A deceptive Tacet Discord disguised as a supply chest, preying on the greed of its victims and devouring those who approach.`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "MidnightVeil", "EmpyreanAnthem"],
  },
  Chirpuff: {
    key: "Chirpuff",
    name: "Chirpuff",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Chirpuff.png",
    details: `<span class="description">Summon a Chirpuff that self-inflates and blasts a powerful gust of wind forward <span class="param">3</span> times. Each blast inflicts <span class="param">24.00%/27.60%/31.20%/34.80%/38.40%</span> Aero DMG and pushes enemies backwards.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "ChirpuffGust",
        label: "Gust DMG",
        description: `Summon a Chirpuff that self-inflates and blasts a powerful gust of wind forward <span class="param">3</span> times. Each blast inflicts <span class="param">24.00%/27.60%/31.20%/34.80%/38.40%</span> Aero DMG and pushes enemies backwards.`,
        talents: {
          "1": "24.00%*3",
          "2": "27.60%*3",
          "3": "31.20%*3",
          "4": "34.80%*3",
          "5": "38.40%*3",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["SierraGale", "SunSinkingEclipse"],
  },
  ChopChop: {
    key: "ChopChop",
    name: "Chop Chop",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ChopChop.webp",
    details: `A Tacet Discord often seen hovering atop large structures, feigning an imposing posture as if the buildings are extensions of its body. Its silhouette blends with the architecture, towering like a menacing giant.`,
    modifiers: [],
    actions: [],
    sets: ["EmpyreanAnthem", "TidebreakingCourage"],
  },
  ChopChopHeadless: {
    key: "ChopChopHeadless",
    name: "Chop Chop: Headless",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ChopChopHeadless.webp",
    details: `A Tacet Discord that functions as the "head" of Chop Chop.`,
    modifiers: [],
    actions: [],
    sets: ["EternalRadiance", "TidebreakingCourage"],
  },
  ChopChopLeftless: {
    key: "ChopChopLeftless",
    name: "Chop Chop: Leftless",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/chopchopleftless.png",
    details: `A Tacet Discord that functions as the "left hand" of Chop Chop.`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "TidebreakingCourage"],
  },
  ChopChopRightless: {
    key: "ChopChopRightless",
    name: "Chop Chop: Rightless",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/chopchoprightless.png",
    details: `A Tacet Discord that functions as the "right hand" of Chop Chop.`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "TidebreakingCourage"],
  },
  ClangBang: {
    key: "ClangBang",
    name: "Clang Bang",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ClangBang.png",
    details: `<span class="description">Summon a Clang Bang that follows the enemy and eventually self-combusts, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Glacio DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "CelestialLight"],
  },
  Crownless: {
    key: "Crownless",
    name: "Crownless",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Crownless.png",
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
    actions: [
      {
        key: "CrownlessAttack",
        label: "Attacks DMG",
        description: `Transform into Crownless and perform up to 4 consecutive attacks. The first 2 attacks deal <span class="param">83.80%/96.37%/108.94%/121.51%/134.08%</span> Havoc DMG each, the 3rd attack deals <span class="param">62.85%/72.28%/81.71%/91.13%/100.56%</span> Havoc DMG 2 times, and the 4th attack deals <span class="param">41.90%/48.19%/54.47%/60.76%/67.04%</span> Havoc DMG 3 times.`,
        talents: {
          "1": "83.80%*2 + 62.85%*2 + 41.90%*3",
          "2": "96.37%*2 + 72.28%*2 + 48.19%*3",
          "3": "108.94%*2 + 81.71%*2 + 54.47%*3",
          "4": "121.51%*2 + 91.13%*2 + 60.76%*3",
          "5": "134.08%*2 + 100.56%*2 + 67.04%*3",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["SunSinkingEclipse"],
  },
  Cruisewing: {
    key: "Cruisewing",
    name: "Cruisewing",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Cruisewing.png",
    details: `<span class="description">Summon a Cruisewing that restores HP for all current team characters by <span class="param">1%/1.20%/1.40%/1.60%/1.80%</span> of their Max HPs plus an additional <span class="param">80</span> points of HP, up to 4 times.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [
      // TODO: Need the healing to support the * 4 part
      // {
      //   key: "CruisewingHeal",
      //   label: "Healing",
      //   description: `Summon a Cruisewing that restores HP for all current team characters by <span class="param">1%/1.20%/1.40%/1.60%/1.80%</span> of their Max HPs plus an additional <span class="param">80</span> points of HP, up to 4 times.`,
      //   talents: {
      //     "1": "80 + 1%*4",
      //     "2": "80 + 1.20%*4",
      //     "3": "80 + 1.40%*4",
      //     "4": "80 + 1.60%*4",
      //     "5": "80 + 1.80%*4",
      //   },
      //   type: "Healing",
      //   element: "Healing",
      //   attribute: "hp",
      // },
    ],
    sets: ["CelestialLight", "RejuvenatingGlow", "MoonlitClouds"],
  },
  CuddleWuddle: {
    key: "CuddleWuddle",
    name: "Cuddle Wuddle",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/cuddlewuddle.png",
    details: `An incorporeal Tacet Discord inhabiting the body of a large, ragged plushie.`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "MidnightVeil", "MoltenRift", "VoidThunder"],
  },
  CyanFeatheredHeron: {
    key: "CyanFeatheredHeron",
    name: "Cyan-Feathered Heron",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/CyanFeatheredHeron.png",
    details: `<span class="description">Transform into Cyan-Feathered Heron and charge at the enemies, dealing <span class="param">148.00%/170.20%/192.40%/214.60%/236.80%</span> Aero DMG; This Echo Skill interrupts enemy <color=highlight>Special Skills upon dealing damage.
    CD: <span class="param">15</span>s</color=highlight></span>`,
    modifiers: [],
    actions: [
      {
        key: "CyanFeatheredHeronCharge",
        label: "Activation DMG",
        description: `Transform into Cyan-Feathered Heron and charge at the enemies, dealing <span class="param">148.00%/170.20%/192.40%/214.60%/236.80%</span> Aero DMG.`,
        talents: {
          "1": "148.00%",
          "2": "170.20%",
          "3": "192.40%",
          "4": "214.60%",
          "5": "236.80%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["SierraGale", "CelestialLight"],
  },
  DevoteesFlesh: {
    key: "DevoteesFlesh",
    name: "Devotee's Flesh",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/DevoteesFlesh.webp",
    details: `Summon a Devotee's Flesh to attack enemies, dealing 43.20% Aero DMG 3 times.<br>CD: 8s`,
    modifiers: [],
    actions: [],
    sets: ["WindwardPilgrimage", "FlamingClawprint", "GustsofWelkin"],
  },
  Diamondclaw: {
    key: "Diamondclaw",
    name: "Diamondclaw",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Diamondclaw.png",
    details: `<span class="description">Transform into Crystal Scorpion and enter a Parry State. Counterattack when the Parry State is over, dealing <span class="param">30.00%+60/34.50%+69/39.00%+78/43.50%+87/48.00%+96</span> Physical DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoonlitClouds", "LingeringTunes"],
  },
  DiggyDuggy: {
    key: "DiggyDuggy",
    name: "Diggy Duggy",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/DiggyDuggy.webp",
    details: `An incorporeal Tacet Discord inhabiting the body of a sturdy, diligent plushie.`,
    modifiers: [],
    actions: [],
    sets: ["EternalRadiance", "TidebreakingCourage"],
  },
  DiurnusKnight: {
    key: "DiurnusKnight",
    name: "Diurnus Knight",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/DiurnusKnight.webp",
    details: `A humanoid Tacet Discord clad in fine attire, wielding a sharp blade. Seen only in the radiance of the sun.`,
    modifiers: [],
    actions: [],
    sets: ["EternalRadiance", "TidebreakingCourage"],
  },
  DragonofDirge: {
    key: "DragonofDirge",
    name: "Dragon of Dirge",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/DragonofDirge.webp",
    details: `<span class="description">Transform into Dragon of Dirge and summon a Grief Rift lasting for 5s. Periodically deal <span class="param">20.45%/24.54%/28.63%/32.72%/36.81%</span> Fusion DMG to enemies within the area of effect.
The Resonator with this Echo equipped in the main slot gains <span class="param">12.00%</span> Fusion DMG Bonus and <span class="param">12.00%</span> Basic Attack DMG Bonus.
CD: <span class="param">25</span>s.</span>`,
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
    actions: [
      {
        key: "GriefRiftDMG",
        label: "Grief Rift DMG",
        description: `Transform into Dragon of Dirge and summon a Grief Rift lasting for 5s. Periodically deal <span class="param">20.45%/24.54%/28.63%/32.72%/36.81%</span> Fusion DMG to enemies within the area of effect.`,
        talents: {
          "1": "20.45%",
          "2": "24.54%",
          "3": "28.63%",
          "4": "32.72%",
          "5": "36.81%",
        },
        type: "Echo",
        element: "Fusion",
      },
    ],
    sets: ["TidebreakingCourage"],
  },
  Dreamless: {
    key: "Dreamless",
    name: "Dreamless",
    class: "Calamity",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Dreamless.png",
    details: `<span class="description">Transform into Dreamless and perform 6 consecutive strikes. The first 5 strikes deal <span class="param">33.80%/38.87%/43.94%/49.01%/54.08%</span> Havoc DMG each, and the last strike deal <span class="param">169.00%/194.35%/219.70%/245.05%/270.40%</span> Havoc DMG.
    The DMG of this Echo Skill is increased by <span class="param">50.00%</span> during the first <span class="param">5</span>s after Rover: Havoc casts Resonance Liberation: Deadening Abyss.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifySpecificTalents: [
          "DreamlessFirstStrikes",
          "DreamlessFinalStrike",
        ],
        modifierValue: 0.5,
      },
    ],
    actions: [
      {
        key: "DreamlessFirstStrikes",
        label: "Strikes DMG",
        description: `Transform into Dreamless and perform 6 consecutive strikes. The first 5 strikes deal <span class="param">33.80%/38.87%/43.94%/49.01%/54.08%</span> Havoc DMG each`,
        talents: {
          "1": "33.80%*5",
          "2": "38.87%*5",
          "3": "43.94%*5",
          "4": "49.01%*5",
          "5": "54.08%*5",
        },
        type: "Echo",
        element: "Havoc",
      },
      {
        key: "DreamlessFinalStrike",
        label: "Final Strike DMG",
        description: `The last strike deals <span class="param">169.00%/194.35%/219.70%/245.05%/270.40%</span> Havoc DMG.`,
        talents: {
          "1": "169.00%",
          "2": "194.35%",
          "3": "219.70%",
          "4": "245.05%",
          "5": "270.40%",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["SunSinkingEclipse"],
  },
  DwarfCassowary: {
    key: "DwarfCassowary",
    name: "Dwarf Cassowary",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/DwarfCassowary.png",
    details: `<span class="description">Summon a Dwarf Cassowary that tracks and attacks the enemy, dealing <span class="param">24.00%/27.60%/31.20%/34.80%/38.40%</span> Physical DMG <span class="param">3</span> time(s).

    Cooldown: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["SierraGale", "RejuvenatingGlow"],
  },
  ElectroDrake: {
    key: "ElectroDrake",
    name: "Electro Drake",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ElectroDrake.webp",
    details: ``,
    modifiers: [],
    actions: [],
    sets: ["GustsofWelkin", "MidnightVeil"],
  },
  ElectroPredator: {
    key: "ElectroPredator",
    name: "Electro Predator",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ElectroPredator.png",
    details: `<span class="description">Summon an Electro Predator to shoot the enemy 5 times. The first 4 shots deals <span class="param">10.80%/12.42%/14.04%/15.66%/17.28%</span> Electro DMG, and the last deals <span class="param">28.80%/33.12%/37.44%/41.76%/46.08%</span> Electro DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "VoidThunder"],
  },
  Excarat: {
    key: "Excarat",
    name: "Excarat",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Excarat.png",
    details: `<span class="description">Transform into an Excarat and tunnel underground to advance. In this state, you have the ability to change your direction and are immune to damage.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "SunSinkingEclipse"],
  },
  FaeIgnis: {
    key: "FaeIgnis",
    name: "Fae Ignis",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FaeIgnis.webp",
    details: `An avian Tacet Discord prowling the Penitent's End. In darkness, its form blends into shadow, leaving only its mask flickering like ignis fatuus.`,
    modifiers: [],
    actions: [],
    sets: ["MidnightVeil", "EternalRadiance"],
  },
  FallacyOfNoReturn: {
    key: "FallacyOfNoReturn",
    name: "Fallacy of No Return",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FallacyOfNoReturn.png",
    details: `<span class="description">Use the Sound Corpse skill to summon a portion of the power of the Fallacy of No Return, causing 1 diffraction damage based on <span class="Highlight">9.91%/11.40%/12.88%/14.37%/15.86%</span> of the player's upper limit of health to surrounding enemies, increasing the player's <span class="Highlight">Energy Regen</span> by <span class="Highlight">10%</span> and the attack of all team characters by <span class="Highlight">10%</span>, lasting for 20 seconds. Long-press the Sound Corpse skill to consume stamina to continue attacking after the shock ends, causing <span class="Highlight">0.99%/1.14%/1.29%/1.44%/1.58%</span> of the upper limit of health each time; when the long-press ends, the final blow is triggered, causing <span class="Highlight">12.39%/14.25%/16.11%/17.97%/19.82%</span> of the upper limit of health.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "EnergyRegen",
        modifierValue: 0.1,
      },
      {
        modifier: "ATK",
        modifierValue: 0.1,
      },
    ],
    actions: [
      {
        key: "FallacyOfNoReturnDiffraction",
        label: "Diffraction DMG",
        description: `Use the Sound Corpse skill to summon a portion of the power of the Fallacy of No Return, causing 1 diffraction damage based on <span class="Highlight">9.91%/11.40%/12.88%/14.37%/15.86%</span> of the player's upper limit of health to surrounding enemies`,
        talents: {
          "1": "9.91%",
          "2": "11.40%",
          "3": "12.88%",
          "4": "14.37%",
          "5": "15.86%",
        },
        type: "Echo",
        element: "Glacio",
        attribute: "hp",
      },
      {
        key: "FallacyOfNoReturnSoundCorpseDoT",
        label: "Sound Corpse DoT DMG",
        description: `Long-press the Sound Corpse skill to consume stamina to continue attacking after the shock ends, causing <span class="Highlight">0.99%/1.14%/1.29%/1.44%/1.58%</span> of the upper limit of health each time.`,
        talents: {
          "1": "0.99%",
          "2": "1.14%",
          "3": "1.29%",
          "4": "1.44%",
          "5": "1.58%",
        },
        type: "Echo",
        element: "Glacio",
        attribute: "hp",
      },
      {
        key: "FallacyOfNoReturnFinalBlow",
        label: "Final Blow DMG",
        description: `When the long-press ends, the final blow is triggered, causing <span class="Highlight">12.39%/14.25%/16.11%/17.97%/19.82%</span> of the upper limit of health.`,
        talents: {
          "1": "12.39%",
          "2": "14.25%",
          "3": "16.11%",
          "4": "17.97%",
          "5": "19.82%",
        },
        type: "Echo",
        element: "Glacio",
        attribute: "hp",
      },
    ],
    sets: ["RejuvenatingGlow"],
  },
  FeilianBeringal: {
    key: "FeilianBeringal",
    name: "Feilian Beringal",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FeilianBeringal.png",
    details: `<span class="description">Transform into Feilian Beringal to perform a powerful kick. If the kick lands on an enemy, immediately perform a follow-up strike. The kick deals <span class="param">144.90%/166.64%/188.37%/210.11%/231.84%</span> Aero DMG, and the follow-up strike deals <span class="param">177.10%/203.67%/230.23%/256.80%/283.36%</span> Aero DMG.

    After the follow-up strike hits, the current character's Aero DMG increases by <span class="param">12.00%</span>, and the Heavy Attack DMG increases by <span class="param">12.00%</span> for <span class="param">15</span>s
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.12,
      },
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "FeilianBeringalKick",
        label: "Kick DMG",
        description: `Transform into Feilian Beringal to perform a powerful kick. If the kick lands on an enemy, immediately perform a follow-up strike. The kick deals <span class="param">144.90%/166.64%/188.37%/210.11%/231.84%</span> Aero DMG.`,
        talents: {
          "1": "144.90%",
          "2": "166.64%",
          "3": "188.37%",
          "4": "210.11%",
          "5": "231.84%",
        },
        type: "Echo",
        element: "Aero",
      },
      {
        key: "FeilianBeringalFollowUp",
        label: "Follow-Up Strike DMG",
        description: `Transform into Feilian Beringal to perform a powerful kick. If the kick lands on an enemy, immediately perform a follow-up strike. the follow-up strike deals <span class="param">177.10%/203.67%/230.23%/256.80%/283.36%</span> Aero DMG.`,
        talents: {
          "1": "177.10%",
          "2": "203.67%",
          "3": "230.23%",
          "4": "256.80%",
          "5": "283.36%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["SierraGale"],
  },
  FissionJunrock: {
    key: "FissionJunrock",
    name: "Fission Junrock",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FissionJunrock.png",
    details: `<span class="description">Summon a Fission Junrock. Generate a Resonance Effect that restores <span class="param">2%</span> HP for friendly units each time. If not in combat, you can pick up minerals or plants nearby.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["VoidThunder", "RejuvenatingGlow", "MoonlitClouds"],
  },
  Flautist: {
    key: "Flautist",
    name: "Flautist",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Flautist.png",
    details: `<span class="description">Transform into Flautist, continuously emitting Electro lasers, dealing <span class="param">33.30%/38.30%/43.29%/48.29%/53.28%</span> Electro DMG for a total of 10 times. Gain <span class="param">1</span> Concerto Energy every time a hit lands.
    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "FlautistLasers",
        label: "Lasers DMG",
        description: `Transform into Flautist, continuously emitting Electro lasers, dealing <span class="param">33.30%/38.30%/43.29%/48.29%/53.28%</span> Electro DMG for a total of 10 times`,
        talents: {
          "1": "33.30%*10",
          "2": "38.30%*10",
          "3": "43.29%*10",
          "4": "48.29%*10",
          "5": "53.28%*10",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["VoidThunder", "LingeringTunes"],
  },
  FractsidusThruster: {
    key: "FractsidusThruster",
    name: "Fractsidus Thruster",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FractsidusThruster.webp",
    details: `<span class="description"></span>`,
    modifiers: [],
    actions: [],
    sets: ["EternalRadiance", "EmpyreanAnthem"],
  },
  FrostscourgeStalker: {
    key: "FrostscourgeStalker",
    name: "Frostscourge Stalker",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FrostscourgeStalker.webp",
    details: `A wolf-like Tacet Discord ravaging frostbitten regions, known for its cold-blooded and ruthless nature.`,
    modifiers: [],
    actions: [],
    sets: ["MidnightVeil", "EternalRadiance"],
  },
  FusionDrake: {
    key: "FusionDrake",
    name: "Fusion Drake",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FusionDrake.webp",
    details: `Summon a Fusion Drake to attack enemies, dealing 25.92% Fusion DMG 3 times.<br>CD: 8s`,
    modifiers: [],
    actions: [],
    sets: ["WindwardPilgrimage", "FlamingClawprint"],
  },
  FusionDreadmane: {
    key: "FusionDreadmane",
    name: "Fusion Dreadmane",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FusionDreadmane.png",
    details: `<span class="description">Summon a Fusion Dreadmane that fiercely strikes the enemy, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Fusion DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "RejuvenatingGlow"],
  },
  FusionPrism: {
    key: "FusionPrism",
    name: "Fusion Prism",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FusionPrism.png",
    details: `<span class="description">Summon a Fusion Prism to fire a crystal shard, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Fusion DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "MoltenRift", "LingeringTunes"],
  },
  FusionWarrior: {
    key: "FusionWarrior",
    name: "Fusion Warrior",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FusionWarrior.png",
    details: `<span class="description">Transform into Fusion Warrior to perform a Counterattack. If the Counterattack is successful, the cooldown time of this skill will be reduced by <span class="param">70.00%</span>, and <span class="param">180.00%/207.00%/234.00%/261.00%/288.00%</span> Fusion DMG will be dealt.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "VoidThunder", "SierraGale"],
  },
  GalescourgeStalker: {
    key: "GalescourgeStalker",
    name: "Galescourge Stalker",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/galescourgestalker.png",
    details: `A wolf-like Tacet Discord dominating high-altitude regions, notorious for its relentless predation.`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "EmpyreanAnthem"],
  },
  GlacioDrake: {
    key: "GlacioDrake",
    name: "Glacio Drake",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/GlacioDrake.webp",
    details: ``,
    modifiers: [],
    actions: [],
    sets: ["GustsofWelkin", "WindwardPilgrimage"],
  },
  GlacioDreadmane: {
    key: "GlacioDreadmane",
    name: "Glacio Dreadmane",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/GlacioDreadmane.png",
    details: `<span class="description">Lacerate enemies as a Glacio Dreadmane, dealing <span class="param">134.00%/154.10%/174.20%/194.30%/214.40%</span> Glacio DMG on each hit. Equipped with 2 charges and can be cast mid-air. Glacio Dreadmane deals <span class="param">20.00%</span> more DMG while in mid-air and generates 6 Icicles upon landing, each dealing <span class="param">20.00%/23.00%/26.00%/29.00%/32.00%</span> Glacio DMG.

    CD: <span class="param">20</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "GlacioDreadmaneLacerate",
        label: "Lacerate DMG",
        description: `Lacerate enemies as a Glacio Dreadmane, dealing <span class="param">134.00%/154.10%/174.20%/194.30%/214.40%</span> Glacio DMG on each hit.`,
        talents: {
          "1": "134.00%",
          "2": "154.10%",
          "3": "174.20%",
          "4": "194.30%",
          "5": "214.40%",
        },
        type: "Echo",
        element: "Glacio",
      },
      {
        key: "GlacioDreadmaneMidAirLacerate",
        label: "Mid-Air Lacerate DMG",
        description: `Lacerate enemies as a Glacio Dreadmane, dealing <span class="param">134.00%/154.10%/174.20%/194.30%/214.40%</span> Glacio DMG on each hit. Glacio Dreadmane deals <span class="param">20.00%</span> more DMG while in mid-air.`,
        talents: {
          "1": "154.00%",
          "2": "174.10%",
          "3": "194.20%",
          "4": "214.30%",
          "5": "234.40%",
        },
        type: "Echo",
        element: "Glacio",
      },
      {
        key: "GlacioDreadmaneIcicle",
        label: "Icicle DMG",
        description: `Glacio Dreadmane deals <span class="param">20.00%</span> more DMG while in mid-air and generates 6 Icicles upon landing, each dealing <span class="param">20.00%/23.00%/26.00%/29.00%/32.00%</span> Glacio DMG.`,
        talents: {
          "1": "20.00%*6",
          "2": "23.00%*6",
          "3": "26.00%*6",
          "4": "29.00%*6",
          "5": "32.00%*6",
        },
        type: "Echo",
        element: "Glacio",
      },
    ],
    sets: ["FreezingFrost", "MoonlitClouds"],
  },
  GlacioPredator: {
    key: "GlacioPredator",
    name: "Glacio Predator",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/GlacioPredator.png",
    details: `<span class="description">Summon a Glacio Predator that throws an ice spear, dealing <span class="param">28.80%/33.12%/37.44%/41.76%/46.08%</span> Glacio DMG on hit. Deal <span class="param">2.88%/3.31%/3.74%/4.18%/4.61%</span> Glacio DMG up to 10 times during the charging time, and <span class="param">14.40%/16.56%/18.72%/20.88%/23.04%</span> Glacio DMG when the spear explodes. CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "CelestialLight"],
  },
  GlacioPrism: {
    key: "GlacioPrism",
    name: "Glacio Prism",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/GlacioPrism.png",
    details: `<span class="description">Summon a Glacio Prism that continuously fires three crystal shards, each dealing <span class="param">24.00%/27.60%/31.20%/34.80%/38.40%</span> Glacio DMG. CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "SunSinkingEclipse", "MoonlitClouds"],
  },
  GoldenJunrock: {
    key: "GoldenJunrock",
    name: "Golden Junrock",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/GoldenJunrock.png",
    details: `<span class="description">Summon a Golden Junrock that charges forward, dealing <span class="param">72.00%/86.40%/100.80%/115.20%/129.60%</span> Spectro DMG to enemies in its path.
CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "GoldenJunrockLungeDMG",
        label: "Golden Junrock Lunge DMG",
        description: `Summon a Golden Junrock that charges forward, dealing <span class="param">72.00%/86.40%/100.80%/115.20%/129.60%</span> Spectro DMG to enemies in its path.
CD: <span class="param">8</span>s`,
        talents: {
          "1": "72.00%%",
          "2": "86.40%",
          "3": "100.80%",
          "4": "115.20%",
          "5": "129.60%",
        },
        type: "Echo",
        element: "Sepctro",
      },
    ],
    sets: ["FrostyResolve", "EternalRadiance"],
  },
  Gulpuff: {
    key: "Gulpuff",
    name: "Gulpuff",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Gulpuff.png",
    details: `<span class="description">Summon a Gulpuff that blows bubbles <span class="param">5</span> times, each time dealing <span class="param">14.40%/16.56%/18.72%/20.88%/23.04%</span> Glacio DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "CelestialLight"],
  },
  HavocDreadmane: {
    key: "HavocDreadmane",
    name: "Havoc Dreadmane",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/HavocDreadmane.png",
    details: `<span class="description">Transform into a Havoc Dreadmane to perform up to 2 tail strikes. Each strike deals <span class="param">72.90%/83.84%/94.77%/105.71%/116.64%</span> Havoc DMG and inflicts an additional instance of <span class="param">48.60%/55.89%/63.18%/70.47%/77.76%</span> Havoc DMG upon hitting the target.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "SunSinkingEclipse"],
  },
  HavocDrake: {
    key: "HavocDrake",
    name: "Havoc Drake",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/HavocDrake.webp",
    details: `Summon a Havoc Drake to attack enemies, dealing 129.60% Havoc DMG 3 times.<br>CD: 8s`,
    modifiers: [],
    actions: [],
    sets: ["WindwardPilgrimage", "FlamingClawprint"],
  },
  HavocPrism: {
    key: "HavocPrism",
    name: "Havoc Prism",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/HavocPrism.png",
    details: `<span class="description">Summon a Havoc Prism to fire five crystal shards, each dealing <span class="param">14.40%/16.56%/18.72%/20.88%/23.04%</span> Havoc DMG.
    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["VoidThunder", "CelestialLight", "SunSinkingEclipse"],
  },
  HavocWarrior: {
    key: "HavocWarrior",
    name: "Havoc Warrior",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/HavocWarrior.png",
    details: `<span class="description">Transform into Havoc Warrior to attack up to 3 times, dealing <span class="param">107.33%/123.43%/139.53%/155.63%/171.73%</span> Havoc DMG each time.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["CelestialLight", "SunSinkingEclipse"],
  },
  Hecate: {
    key: "Hecate",
    name: "Hecate",
    class: "Calamity",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Hecate.webp",
    details: `<span class="description">Summon 3 twirling Crescent Servants around you. Crescent Servants attack enemies with their spinning blades, dealing <span class="param">25.33%/30.40%/35.46%/40.53%/45.59%</span> Havoc DMG. Triggering a Counterattack with the Echo attacks extends the Crescent Servants’ summon duration.
The Resonator with this Echo equipped in the main slot has their Coordinated Attack DMG increased by <span class="param">40.00%</span>.
CD: <span class="param">20</span>s.</span>`,
    modifiers: [
      {
        modifier: "CoordinatedDMGBonus",
        modifierValue: 0.4,
      },
    ],
    actions: [
      {
        key: "CrescentServantsDMG",
        label: "Crescent Servants DMG",
        description: `Summon 3 twirling Crescent Servants around you. Crescent Servants attack enemies with their spinning blades, dealing <span class="param">25.33%/30.40%/35.46%/40.53%/45.59%</span> Havoc DMG. Triggering a Counterattack with the Echo attacks extends the Crescent Servants’ summon duration.`,
        talents: {
          "1": "25.33%",
          "2": "29.13%",
          "3": "32.93%",
          "4": "36.73%",
          "5": "40.53%",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: [
      "EmpyreanAnthem",
      "FreezingFrost",
      "MoltenRift",
      "VoidThunder",
      "SierraGale",
      "CelestialLight",
      "SunSinkingEclipse",
    ],
  },
  Hoartoise: {
    key: "Hoartoise",
    name: "Hoartoise",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Hoartoise.png",
    details: `<span class="description">Transform into Hoartoise and slowly restore HP. Use the Echo skill again to exit the transformation state.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "CelestialLight"],
  },
  HocusPocus: {
    key: "HocusPocus",
    name: "Hocus Pocus",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/hocuspocus.png",
    details: `An incorporeal Tacet Discord inhabiting the body of a charming, dashing plushie.>`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "EmpyreanAnthem"],
  },
  Hoochief: {
    key: "Hoochief",
    name: "Hoochief",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Hoochief.png",
    details: `<span class="description">Transform into Hoochief Cyclone and smack the enemies, dealing <span class="param">149%/178.80%/208.60%/238.40%/268.20%</span> Aero DMG.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "HoochiefSmack",
        label: "Smack DMG",
        description: `Transform into Hoochief Cyclone and smack the enemies, dealing <span class="param">149%/178.80%/208.60%/238.40%/268.20%</span> Aero DMG.`,
        talents: {
          "1": "149%",
          "2": "178.80%",
          "3": "208.60%",
          "4": "238.40%",
          "5": "268.20%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["SierraGale", "RejuvenatingGlow"],
  },
  Hooscamp: {
    key: "Hooscamp",
    name: "Hooscamp",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Hooscamp.png",
    details: `<span class="description">Transform into Hooscamp Flinger and pounce at the enemies, dealing <span class="param">30.00%+60/34.50%+69/39.00%+78/43.50%+87/48.00%+96</span> Aero DMG.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["SierraGale", "LingeringTunes"],
  },
  Hurriclaw: {
    key: "Hurriclaw",
    name: "Hurriclaw",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Hurriclaw.png",
    details: `<span class="description">Transform into Hurriclaw and charge forward, dealing <span class="param">87.00%/104.40%/121.80%/139.20%/156.60%</span> Aero DMG upon hit plus <span class="param">87.00%/104.40%/121.80%/139.20%/156.60%</span> Aero DMG with a sweep attack. Hold the Echo Skill to continue charging forward. Use Echo Skill again while charging to perform a sweep attack.
CD: <span class="param">20</span>s.</span>`,
    modifiers: [],
    actions: [
      {
        key: "Hurriclaw",
        label: "Charge and Sweep DMG",
        description: `Transform into Hurriclaw and charge forward, dealing <span class="param">87.00%/104.40%/121.80%/139.20%/156.60%</span> Aero DMG upon hit plus <span class="param">87.00%/104.40%/121.80%/139.20%/156.60%</span> Aero DMG with a sweep attack. Hold the Echo Skill to continue charging forward. Use Echo Skill again while charging to perform a sweep attack.`,
        talents: {
          "1": "87.00% + 87.00%",
          "2": "104.40% + 104.40%",
          "3": "121.80% + 121.80%",
          "4": "139.20% + 139.20%",
          "5": "156.60% + 156.60%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["TidebreakingCourage", "GustsofWelkin"],
  },
  ImpermanenceHeron: {
    key: "ImpermanenceHeron",
    name: "Impermanence Heron",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ImpermanenceHeron.png",
    details: `<span class="description">Transform into Impermanence Heron to fly up and smack down, dealing <span class="param">194.10%/223.22%/252.33%/281.45%/310.56%</span> Havoc DMG.

    Long press to stay as Impermanence Heron and continuously spit flames, each attack dealing <span class="param">34.83%/40.05%/45.28%/50.50%/55.73%</span> Havoc DMG.
    
    Once the initial attack lands on any enemy, the current character regains 10 Resonance Energy. If the current character uses their Outro Skill within the next 15s, the next character’s damage dealt will be boosted by 12% for 15s.
    
    CD: <span class="param">20</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "ImpermanenceHeronFlySmack",
        label: "Fly Up & Smack Down DMG",
        description: `Transform into Impermanence Heron to fly up and smack down, dealing <span class="param">194.10%/223.22%/252.33%/281.45%/310.56%</span> Havoc DMG.`,
        talents: {
          "1": "194.10%",
          "2": "223.22%",
          "3": "252.33%",
          "4": "281.45%",
          "5": "310.56%",
        },
        type: "Echo",
        element: "Havoc",
      },
      {
        key: "ImpermanenceHeronFlames",
        label: "Flames Continuous DMG",
        description: `Long press to stay as Impermanence Heron and continuously spit flames, each attack dealing <span class="param">34.83%/40.05%/45.28%/50.50%/55.73%</span> Havoc DMG.`,
        talents: {
          "1": "34.83%",
          "2": "40.05%",
          "3": "45.28%",
          "4": "50.50%",
          "5": "55.73%",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["MoonlitClouds"],
  },
  InfernoRider: {
    key: "InfernoRider",
    name: "Inferno Rider",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/InfernoRider.png",
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
    actions: [
      {
        key: "InfernoRiderSlash",
        label: "Slash DMG",
        description: `Transform into Inferno Rider to launch up to 3 consecutive slashes in a row, each slash dealing <span class="param">151.50%/174.23%/196.95%/219.68%/242.40%</span>, <span class="param">176.75%/203.26%/229.78%/256.29%/282.80%</span>, and <span class="param">176.75%/203.26%/229.78%/256.29%/282.80%</span> Fusion DMG respectively.`,
        talents: {
          "1": "151.50% + 175.75%*2",
          "2": "174.23% + 203.26%*2",
          "3": "196.85% + 229.78%*2",
          "4": "219.68% + 256.29%*2",
          "5": "242.40% + 282.80%*2",
        },
        type: "Echo",
        element: "Fusion",
      },
      {
        key: "InfernoRiderSlash",
        label: "Exit Rider DMG",
        description: `When exiting the Riding Mode, deal <span class="param">176.75%/203.26%/229.78%/256.29%/282.80%</span> Fusion DMG to enemies in front.`,
        talents: {
          "1": "176.75%",
          "2": "203.26%",
          "3": "203.26%",
          "4": "229.78%",
          "5": "282.80%",
        },
        type: "Echo",
        element: "Fusion",
      },
    ],
    sets: ["MoltenRift"],
  },
  Jué: {
    key: "Jué",
    name: "Jué",
    class: "Calamity",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Jue.png",
    details: `<span class="description">Summon Jué to the aid. Jué soars through the air, dealing <span class="param">34.96%/39.52%/44.08%/48.64%</span> Spectro DMG, and summons thunderbolts that strike nearby enemies up to 5 times, each hit dealing <span class="param">13.98%/15.81%/17.63%/19.46%</span> Spectro DMG. Jué then spirals downward, attacking surrounding enemies twice, each hit dealing <span class="param">34.96%/39.52%/44.08%/48.64%</span> Spectro DMG. Casting this Echo Skill grants the Resonator a Blessing of Time effect that lasts 15s, during when:
    <ul>
      <li>The Resonator gains <span class="param">16.00%</span> Resonance Skill DMG Bonus.</li>
      <li>When the Resonator's Resonance Skill hits the target, inflict <span class="param">11.50%/13.00%/14.50%/16.00%</span> Spectro DMG 1 time per second for 15s, considered as the Resonator's Resonance Skill DMG.</li>
    </ul>
    CD: 20s</span>`,
    modifiers: [
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.16,
      },
    ],
    actions: [
      {
        key: "JueSummonDMG",
        label: "Summon DMG",
        description: `Summon Jué to the aid. Jué soars through the air, dealing <span class="param">34.96%/39.52%/44.08%/48.64%</span> Spectro DMG`,
        talents: {
          "1": "34.96%",
          "2": "34.96%",
          "3": "39.52%",
          "4": "44.08%",
          "5": "48.64%",
        },
        type: "Echo",
        element: "Spectro",
      },
      {
        key: "JueThunderboltDMG",
        label: "Thunderbolt DMG",
        description: `Summons thunderbolts that strike nearby enemies up to 5 times, each hit dealing <span class="param">13.98%/15.81%/17.63%/19.46%</span> Spectro DMG`,
        talents: {
          "1": "13.98%*5",
          "2": "13.98%*5",
          "3": "15.81%*5",
          "4": "17.63%*5",
          "5": "19.46%*5",
        },
        type: "Echo",
        element: "Spectro",
      },
      {
        key: "JueSpiralDMG",
        label: "Spiral DMG",
        description: `Jué then spirals downward, attacking surrounding enemies twice, each hit dealing <span class="param">34.96%/39.52%/44.08%/48.64%</span> Spectro DMG`,
        talents: {
          "1": "34.96%*2",
          "2": "34.96%*2",
          "3": "39.52%*2",
          "4": "44.08%*2",
          "5": "48.64%*2",
        },
        type: "Echo",
        element: "Spectro",
      },
      {
        key: "JueSkillCoordinatedDMG",
        label: "Coordinated DMG",
        description: `When the Resonator's Resonance Skill hits the target, inflict <span class="param">11.50%/13.00%/14.50%/16.00%</span> Spectro DMG 1 time per second for 15s, considered as the Resonator's Resonance Skill DMG.`,
        talents: {
          "1": "11.50%",
          "2": "11.50%",
          "3": "13.00%",
          "4": "14.50%",
          "5": "16.00%",
        },
        type: "Skill",
        element: "Spectro",
        subType: "Coordinated",
      },
    ],
    sets: ["CelestialLight"],
  },
  Kerasaur: {
    key: "Kerasaur",
    name: "Kerasaur",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Kerasaur.webp",
    details: `Transform into Kerasaur to leap into the air and slam down, dealing 178.80%/208.60%/238.40%/268.20% Aero DMG. Shortly after hitting the target, cast Echo Skill again to charge at the target, dealing 178.80%/208.60%/238.40%/268.20% Aero DMG.<br>The Resonator with this Echo equipped in the main slot gains 12.00% Aero DMG Bonus and 12.00% Resonance Liberation DMG Bonus.<br>CD: 15s`,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "KerasaurSlamDMG",
        label: "Slam DMG",
        description: `Transform into Kerasaur to leap into the air and slam down, dealing 178.80%/208.60%/238.40%/268.20% Aero DMG.`,
        talents: {
          "1": "178.80%",
          "2": "178.80%",
          "3": "208.60%",
          "4": "238.40%",
          "5": "268.20%",
        },
        type: "Echo",
        element: "Aero",
      },
      {
        key: "KerasaurChargeDMG",
        label: "Charge DMG",
        description: `Shortly after hitting the target, cast Echo Skill again to charge at the target, dealing 178.80%/208.60%/238.40%/268.20% Aero DMG`,
        talents: {
          "1": "178.80%",
          "2": "178.80%",
          "3": "208.60%",
          "4": "238.40%",
          "5": "268.20%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["WindwardPilgrimage", "FlamingClawprint"],
  },
  LaGuardia: {
    key: "LaGuardia",
    name: "La Guardia",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/LaGuardia.webp",
    details: ``,
    modifiers: [],
    actions: [],
    sets: ["MidnightVeil", "GustsofWelkin"],
  },
  LampylumenMyriad: {
    key: "LampylumenMyriad",
    name: "Lampylumen Myriad",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/LampylumenMyriad.png",
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
    actions: [
      {
        key: "LampylumenMyriadAttacks",
        label: "Transform Attacks DMG",
        description: `Transform into Lampylumen Myriad. Perform up to 3 consecutive attacks.

        Unleash a freezing shock by performing consecutive forward strikes, with the initial two strikes inflicting <span class="param">125.10%/143.87%/162.63%/181.40%/200.16%</span> and <span class="param">125.10%/143.87%/162.63%/181.40%/200.16%</span> Glacio DMG respectively, and the final strike dealing <span class="param">166.80%/191.82%/216.84%/241.86%/266.88%</span> Glacio DMG. Enemies will be frozen on hit.`,
        talents: {
          "1": "125.10%*2 + 166.80%",
          "2": "143.87%*2 + 191.82%",
          "3": "162.63%*2 + 216.84%",
          "4": "181.40%*2 + 241.86%",
          "5": "200.16%*2 + 266.88%",
        },
        type: "Echo",
        element: "Glacio",
      },
    ],
    sets: ["FreezingFrost"],
  },
  LavaLarva: {
    key: "LavaLarva",
    name: "Lava Larva",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/LavaLarva.png",
    details: `<span class="description">Summon a Lava Larva that continuously attacks enemies, dealing <span class="param">24.00%/27.60%/31.20%/34.80%/38.40%</span> Fusion DMG with each hit. The Lava Larva disappears when the summoner is switched out or moves too far away.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "LingeringTunes"],
  },
  Lightcrusher: {
    key: "Lightcrusher",
    name: "Lightcrusher",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Lightcrusher.png",
    details: `<span class="description">Lunge forward as a Lightcrusher, dealing <span class="param">84.60%/97.29%/109.98%/122.67%/135.36%</span> Spectro DMG. Generate <span class="param">6</span> Ablucence on hit. Each Ablucence explosion deals <span class="param">9.40%/10.81%/12.22%/13.63%/15.04%</span> Spectro DMG.
    Hold the Echo Skill to stay in the Lightcrusher form, which allows you to leap up and pounce forward in the air for a short distance.
    
    Cooldown: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "LightcrusherLunge",
        label: "Lunge DMG",
        description: `Lunge forward as a Lightcrusher, dealing <span class="param">84.60%/97.29%/109.98%/122.67%/135.36%</span> Spectro DMG. Generate <span class="param">6</span> Ablucence on hit.`,
        talents: {
          "1": "84.60%",
          "2": "97.29%",
          "3": "109.98%",
          "4": "122.67%",
          "5": "135.36%",
        },
        type: "Echo",
        element: "Spectro",
      },
      {
        key: "LightcrusherAblucence",
        label: "Ablucence DMG",
        description: `Each Ablucence explosion deals <span class="param">9.40%/10.81%/12.22%/13.63%/15.04%</span> Spectro DMG.`,
        talents: {
          "1": "9.40%*6",
          "2": "10.81%*6",
          "3": "12.22%*6",
          "4": "13.63%*6",
          "5": "15.04%*6",
        },
        type: "Echo",
        element: "Spectro",
      },
    ],
    sets: ["CelestialLight"],
  },
  LionessofGlory: {
    key: "LionessofGlory",
    name: "Lioness of Glory",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/LionessofGlory.webp",
    details: `Summon the Halberd of Glory to crush an area, dealing 54.72%/63.84%/2.96%/82.08% Fusion DMG to nearby targets, and then blast off after a short delay, dealing 127.68%/148.96%/170.24%/191.52% Fusion DMG.<br>The Resonator with this Echo equipped in the main slot gains 12.00% Fusion DMG Bonus and 12.00% Resonance Liberation DMG Bonus.<br>CD: 20s`,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceLiberationDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "LionessofGloryBlastDMG",
        label: "Blast DMG",
        description: `After a short delay, dealing 127.68%/148.96%/170.24%/191.52% Fusion DMG`,
        talents: {
          "1": "127.68%",
          "2": "127.68%",
          "3": "148.96%",
          "4": "170.24%",
          "5": "191.52%",
        },
        type: "Echo",
        element: "Fusion",
      },
      {
        key: "LionessofGloryCrashDMG",
        label: "Crash DMG",
        description: `Summon the Halberd of Glory to crush an area, dealing 54.72%/63.84%/72.96%/82.08% Fusion DMG to nearby targets`,
        talents: {
          "1": "54.72%",
          "2": "54.72%",
          "3": "63.84%",
          "4": "72.96%",
          "5": "82.08%",
        },
        type: "Echo",
        element: "Fusion",
      },
    ],
    sets: ["FlamingClawprint"],
  },
  Lorelei: {
    key: "Lorelei",
    name: "Lorelei",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Lorelei.webp",
    details: `<span class="description">Transform into Lorelei and attack surrounding enemies, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Havoc DMG.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Havoc DMG Bonus and <span class="param">12.00%</span> Basic Attack DMG Bonus.
CD: <span class="param">25</span>s.</span>`,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.12,
      },
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "LoreleiDMG",
        label: "Lorelei DMG",
        description: `Transform into Lorelei and attack surrounding enemies, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Havoc DMG.`,
        talents: {
          "1": "225.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["MidnightVeil"],
  },
  LottieLost: {
    key: "LottieLost",
    name: "Lottie Lost",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/lottielost.png",
    details: `An incorporeal Tacet Discord inhabiting the body of a quiet, compassionate plushie.`,
    modifiers: [],
    actions: [],
    sets: [
      "FrostyResolve",
      "TidebreakingCourage",
      "CelestialLight",
      "MoonlitClouds",
      "LingeringTunes",
    ],
  },
  LumiscaleConstruct: {
    key: "LumiscaleConstruct",
    name: "Lumiscale Construct",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/LumiscaleConstruct.png",
    details: `<span class="description">Transform into a Lumiscale Construct and enter a Parry Stance. If you are not attacked during the Parry Stance, slash to deal <span class="param">346.00%/397.90%/449.80%/501.70%/553.60%</span> Glacio DMG when the stance finishes. If attacked, counterattack instantly, dealing <span class="param">346.00%+173.00%/397.90%+198.95%/449.80%+224.90%/501.70%+250.85%/553.60%+276.80%</span> Glacio DMG. When hit with a <color=highlight>Special Skill attack while in the Parry Stance, break the <color=highlight>Special Skill and counterattack, dealing <span class="param">346.00%+173.00%/397.90%+198.95%/449.80%+224.90%/501.70%+250.85%/553.60%+276.80%</span> Glacio DMG.

    CD: <span class="param">15</span>s</color=highlight></color=highlight></span>`,
    modifiers: [],
    actions: [
      {
        key: "LumiscaleConstructSlash",
        label: "Slash DMG",
        description: `Transform into a Lumiscale Construct and enter a Parry Stance. If you are not attacked during the Parry Stance, slash to deal <span class="param">346.00%/397.90%/449.80%/501.70%/553.60%</span> Glacio DMG when the stance finishes.`,
        talents: {
          "1": "346.00%",
          "2": "397.90%",
          "3": "449.80%",
          "4": "501.70%",
          "5": "553.60%",
        },
        type: "Echo",
        element: "Glacio",
      },
      {
        key: "LumiscaleConstructCounter",
        label: "Counter Attack DMG",
        description: `If attacked, counterattack instantly, dealing <span class="param">346.00%+173.00%/397.90%+198.95%/449.80%+224.90%/501.70%+250.85%/553.60%+276.80%</span> Glacio DMG.`,
        talents: {
          "1": "346.00%+173.00%",
          "2": "397.90%+198.95%",
          "3": "449.80%+224.90%",
          "4": "501.70%+250.85%",
          "5": "553.60%+276.80%",
        },
        type: "Echo",
        element: "Glacio",
      },
      {
        key: "LumiscaleConstructSkillCounter",
        label: "Skill Counter Attack DMG",
        description: `When hit with a <color=highlight>Special Skill attack while in the Parry Stance, break the <color=highlight>Special Skill and counterattack, dealing <span class="param">346.00%+173.00%/397.90%+198.95%/449.80%+224.90%/501.70%+250.85%/553.60%+276.80%</span> Glacio DMG.`,
        talents: {
          "1": "346.00%+173.00%",
          "2": "397.90%+198.95%",
          "3": "449.80%+224.90%",
          "4": "501.70%+250.85%",
          "5": "553.60%+276.80%",
        },
        type: "Echo",
        element: "Glacio",
      },
    ],
    sets: ["FreezingFrost", "VoidThunder"],
  },
  MechAbomination: {
    key: "MechAbomination",
    name: "Mech Abomination",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/MechAbomination.png",
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
    actions: [
      {
        key: "MechAbominationStrike",
        label: "Strike DMG",
        description: `Strike enemies in front, dealing <span class="param">30.40%/34.96%/39.52%/44.08%/48.64%</span> Electro DMG.`,
        talents: {
          "1": "30.40%",
          "2": "34.96%",
          "3": "39.52%",
          "4": "44.08%",
          "5": "48.64",
        },
        type: "Echo",
        element: "Electro",
      },
      {
        key: "MechAbominationMechWaste",
        label: "Mech Waste DMG",
        description: `Summon Mech Waste to attack. Mech Waste deals <span class="param">200.00%/230.00%/260.00%/290.00%/320.00%</span> Electro DMG on hit.`,
        talents: {
          "1": "200.00%",
          "2": "230.00%",
          "3": "260.00%",
          "4": "290.00%",
          "5": "320.00%",
        },
        type: "Echo",
        element: "Electro",
      },
      {
        key: "MechAbominationMechWaste",
        label: "Mech Waste Explosion DMG",
        description: `Mech Waste explodes after a while, dealing <span class="param">100.00%/115.00%/130.00%/145.00%/160.00%</span> Electro DMG.`,
        talents: {
          "1": "100.00%",
          "2": "115.00%",
          "3": "130.00%",
          "4": "145.00%",
          "5": "160.00%",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["LingeringTunes"],
  },
  MourningAix: {
    key: "MourningAix",
    name: "Mourning Aix",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/MourningAix.png",
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
    actions: [
      {
        key: "MourningAixClaw",
        label: "Claw DMG",
        description: `Transform into Mourning Aix and perform 2 consecutive claw attacks, each attack dealing <span class="param">98.40%/113.16%/127.92%/142.68%/157.44%</span> and <span class="param">147.60%/169.74%/191.88%/214.02%/236.16%</span> Spectro DMG respectively.`,
        talents: {
          "1": "98.40% + 147.60%",
          "2": "113.16% + 169.74%",
          "3": "127.92% + 191.88%",
          "4": "142.68% + 214.02%",
          "5": "157.44% + 236.16%",
        },
        type: "Echo",
        element: "Spectro",
      },
    ],
    sets: ["CelestialLight"],
  },
  NimbusWraith: {
    key: "NimbusWraith",
    name: "Nimbus Wraith",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NimbusWraith.webp",
    details: `Once a remnant creature in Nimbus Sanctum, it decayed into a Tacet Discord as its frequency wanes, leaving it wandering in perpetual sorrow.`,
    modifiers: [],
    actions: [],
    sets: ["EmpyreanAnthem", "MidnightVeil"],
  },
  NightmareCrownless: {
    key: "NightmareCrownless",
    name: "Nightmare: Crownless",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareCrownless.webp",
    details: `<span class="description">Transform into Nightmare: Crownless and attack enemies in front, dealing <span class="param">147.00%/176.40%/205.80%/235.20%/264.60%</span> Havoc DMG. The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Havoc DMG Bonus and <span class="param">12.00%</span> Basic Attack DMG Bonus.
This skill has <span class="param">3</span> initial charges, replenished once every <span class="param">12</span>s, max <span class="param">3</span> charges. When Nightmare: Crownless hits a target, DMG dealt by this skill is increased by <span class="param">20.00%</span>. This effect lasts for <span class="param">2</span>s and does not stack.
CD: <span class="param">12</span>s.</span>`,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.12,
      },
      {
        modifier: "BasicAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "NightmareCrownlessAttackDMG",
        label: "Nightmare Crownless Attack DMG",
        description: `Transform into Nightmare: Crownless and attack enemies in front, dealing <span class="param">147.00%/176.40%/205.80%/235.20%/264.60%</span> Havoc DMG.`,
        talents: {
          "1": "147.00%",
          "2": "176.40%",
          "3": "205.80%",
          "4": "235.20%",
          "5": "264.60%",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["SunSinkingEclipse"],
  },
  NightmareFeilianBeringal: {
    key: "NightmareFeilianBeringal",
    name: "Nightmare: Feilian Beringal",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareFeilianBeringal.webp",
    details: `<span class="description">Summon a Nightmare: Feilian Beringal to attack enemies, dealing <span class="param">91.20%/109.44%/127.68%/145.92%/164.16%</span> Aero DMG. The remaining Whirlwind Beam will continuously attack surrounding enemies up to 5 times, each dealing <span class="param">12.16%/14.59%/17.02%/19.46%/21.89%</span> Aero DMG.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Aero DMG Bonus and <span class="param">12.00%</span> Heavy Attack DMG Bonus.
CD: <span class="param">20</span>s.</span>`,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.12,
      },
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "NightmareFeilianAttackDMG",
        label: "Nightmare Feilian Attack DMG",
        description: `Summon a Nightmare: Feilian Beringal to attack enemies, dealing <span class="param">91.20%/109.44%/127.68%/145.92%/164.16%</span> Aero DMG.`,
        talents: {
          "1": "91.20%",
          "2": "109.44%",
          "3": "127.68%",
          "4": "145.92%",
          "5": "164.16%",
        },
        type: "Echo",
        element: "Aero",
      },
      {
        key: "NightmareFeilianWhirlwindDMG",
        label: "Nightmare Feilian Whirlwind DMG",
        description: `The remaining Whirlwind Beam will continuously attack surrounding enemies up to 5 times, each dealing <span class="param">12.16%/14.59%/17.02%/19.46%/21.89%</span> Aero DMG.`,
        talents: {
          "1": "12.16%*5",
          "2": "14.59%*5",
          "3": "17.02%*5",
          "4": "19.46%*5",
          "5": "21.89%*5",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["SierraGale"],
  },
  NightmareImpermanenceHeron: {
    key: "NightmareImpermanenceHeron",
    name: "Nightmare: Impermanence Heron",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareImpermanenceHeron.webp",
    details: `<span class="description">Transform into Nightmare: Impermanence Heron and deliver up to 10 consecutive strikes to surrounding enemies, each dealing <span class="param">22.50%/27.00%/31.50%/36.00%/40.50%</span> Havoc DMG.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Havoc DMG Bonus and <span class="param">12.00%</span> Heavy Attack DMG Bonus.
CD: <span class="param">25</span>s.</span>`,
    modifiers: [
      {
        modifier: "Havoc",
        modifierValue: 0.12,
      },
      {
        modifier: "HeavyAttackDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "ImperStrikeDMG",
        label: "Strike DMG",
        description: `Transform into Nightmare: Impermanence Heron and deliver up to 10 consecutive strikes to surrounding enemies, each dealing <span class="param">22.50%/27.00%/31.50%/36.00%/40.50%</span> Havoc DMG.`,
        talents: {
          "1": "22.50%*10",
          "2": "27.00%*10",
          "3": "31.50%*10",
          "4": "36.00%*10",
          "5": "40.50%*10",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["MidnightVeil"],
  },
  NightmareInfernoRider: {
    key: "NightmareInfernoRider",
    name: "Nightmare: Inferno Rider",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareInfernoRider.webp",
    details: `<span class="description">Transform into Nightmare: Inferno Rider and jump to attack enemies in front, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Fusion DMG.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Fusion DMG Bonus and <span class="param">12.00%</span> Resonance Skill DMG Bonus.
Hold Echo Skill to transform into Nightmare: Inferno Rider and enter Riding Mode. When exiting Riding Mode, deal <span class="param">157.50%/189.00%/220.50%/252.00%/283.50%</span> Fusion DMG to enemies in front.
CD: <span class="param">25</span>s.</span>`,
    modifiers: [
      {
        modifier: "Fusion",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "NightmareInfernoRiderJumpDMG",
        label: "Nightmare Inferno Rider Jump DMG",
        description: `Transform into Nightmare: Inferno Rider and jump to attack enemies in front, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Fusion DMG.`,
        talents: {
          "1": "225.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Echo",
        element: "Fusion",
      },
      {
        key: "NightmareInfernoRiderRidingDMG",
        label: "Nightmare Inferno Rider Riding DMG",
        description: `Hold Echo Skill to transform into Nightmare: Inferno Rider and enter Riding Mode. When exiting Riding Mode, deal <span class="param">157.50%/189.00%/220.50%/252.00%/283.50%</span> Fusion DMG to enemies in front.`,
        talents: {
          "1": "157.50%",
          "2": "189.00%",
          "3": "220.50%",
          "4": "252.00%",
          "5": "283.50%",
        },
        type: "Echo",
        element: "Fusion",
      },
    ],
    sets: ["MoltenRift"],
  },
  NightmareKelpie: {
    key: "NightmareKelpie",
    name: "Nightmare: Kelpie",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareKelpie.webp",
    details: `Transform into Nightmare: Kelpie to attack nearby targets, dealing 270.00%/315.00%/360.00%/405.00% Glacio DMG.<br>The Resonator with this Echo equipped in the main slot gains 12.00% Glacio DMG Bonus and 12.00% Aero DMG Bonus. Switching out the Resonator with Outro Skill summons Nightmares: Kelpie to deal 270.00%/315.00%/360.00%/405.00% Aero DMG.<br>CD: 25s`,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.12,
      },
      {
        modifier: "Aero",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "NightmareKelpieAttackDMG",
        label: "Attack DMG",
        description: `Transform into Nightmare: Kelpie to attack nearby targets, dealing 270.00%/315.00%/360.00%/405.00% Glacio DMG.`,
        talents: {
          "1": "270.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Echo",
        element: "Glacio",
      },
      {
        key: "NightmareKelpieOutroDMG",
        label: "Outro DMG",
        description: `Transform into Nightmare: Kelpie to attack nearby targets, dealing 270.00%/315.00%/360.00%/405.00% Glacio DMG.`,
        talents: {
          "1": "270.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Outro",
        element: "Glacio",
      },
    ],
    sets: ["WindwardPilgrimage", "GustsofWelkin"],
  },
  NightmareLampylumenMyriad: {
    key: "NightmareLampylumenMyriad",
    name: "Nightmare: Lampylumen Myriad",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareLampylumenMyriad.png",
    details: `<span class="description">Summon a Nightmare: Lampylumen Myriad and attack nearby enemies, dealing <span class="param">152.00%/182.40%/212.80%/243.20%/273.60%</span> Glacio DMG.<br>
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Glacio DMG Bonus and has their Coordinated Attack DMG increased by <span class="param">30.00%</span>.<br>
CD: <span class="param">20</span>s.</span>`,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.12,
      },
      {
        modifier: "CoordinatedDMGBonus",
        modifierValue: 0.3,
      },
    ],
    actions: [
      {
        key: "NightmareLampylumenMyriadDMG",
        label: "Nightmare: Lampylumen Myriad DMG",
        description: `Summon a Nightmare: Lampylumen Myriad and attack nearby enemies, dealing <span class="param">152.00%/182.40%/212.80%/243.20%/273.60%</span> Glacio DMG.`,
        talents: {
          "1": "152.00%",
          "2": "182.40%",
          "3": "212.80%",
          "4": "243.20%",
          "5": "273.60%",
        },
        type: "Echo",
        element: "Glacio",
      },
    ],
    sets: ["FrostyResolve", "EmpyreanAnthem"],
  },
  NightmareMourningAix: {
    key: "NightmareMourningAix",
    name: "Nightmare: Mourning Aix",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareMourningAix.webp",
    details: `<span class="description">Summon a Nightmare: Mourning Aix to attack surrounding enemies, dealing <span class="param">152.00%/182.40%/212.80%/243.20%/273.60%</span> Spectro DMG. DMG dealt to enemies inflicted by Spectro Frazzle is increased by <span class="param">100.00%</span>.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Spectro DMG Bonus.
CD: <span class="param">20</span>s.</span>`,
    modifiers: [
      {
        modifier: "Spectro",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "NightmareMourningAixAttackDMG",
        label: "Nightmare Mourning Aix Attack DMG",
        description: `Summon a Nightmare: Mourning Aix to attack surrounding enemies, dealing <span class="param">152.00%/182.40%/212.80%/243.20%/273.60%</span> Spectro DMG.`,
        talents: {
          "1": "152.00%",
          "2": "182.40%",
          "3": "212.80%",
          "4": "243.20%",
          "5": "273.60%",
        },
        type: "Echo",
        element: "Spectro",
      },
      {
        key: "NightmareMourningAixBuffedAttackDMG",
        label: "Nightmare Mourning Aix Buffed Attack DMG",
        description: `DMG dealt to enemies inflicted by Spectro Frazzle is increased by <span class="param">100.00%</span>.`,
        talents: {
          "1": "304.00%",
          "2": "364.80%",
          "3": "425.60%",
          "4": "468.40%",
          "5": "547.20%",
        },
        type: "Echo",
        element: "Spectro",
      },
    ],
    sets: ["EternalRadiance"],
  },
  NightmareTempestMephis: {
    key: "NightmareTempestMephis",
    name: "Nightmare: Tempest Mephis",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareTempestMephis.webp",
    details: `<span class="description">Transform into Nightmare: Tempest Mephis and attack surrounding enemies, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Electro DMG.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Electro DMG Bonus and <span class="param">12.00%</span> Resonance Skill DMG Bonus.
CD: <span class="param">25</span>s.</span>`,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "NightmareTempestMephisDMG",
        label: "Nightmare: Tempest Mephis DMG",
        description: `Transform into Nightmare: Tempest Mephis and attack surrounding enemies, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Electro DMG.`,
        talents: {
          "1": "225.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["EmpyreanAnthem", "VoidThunder"],
  },
  NightmareThunderingMephis: {
    key: "NightmareThunderingMephis",
    name: "Nightmare: Thundering Mephis",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NightmareThunderingMephis.webp",
    details: `<span class="description">Transform into Nightmare: Thundering Mephis and attack enemies in front, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Electro DMG.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Electro DMG Bonus and <span class="param">12.00%</span> Resonance Liberation DMG Bonus.
CD: <span class="param">25</span>s.</span>`,
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
    actions: [
      {
        key: "NightmareThunderingMephisAttackDMG",
        label: "Nightmare Thundering Mephis Attack DMG",
        description: `Transform into Nightmare: Thundering Mephis and attack enemies in front, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Electro DMG.`,
        talents: {
          "1": "225.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["VoidThunder"],
  },
  NocturnusKnight: {
    key: "NocturnusKnight",
    name: "Nocturnus Knight",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/NocturnusKnight.webp",
    details: `A humanoid Tacet Discord clad in fine attire, wielding a sharp blade. Seen only in the pale glow of the moon.`,
    modifiers: [],
    actions: [],
    sets: ["MidnightVeil", "EmpyreanAnthem"],
  },
  PilgrimsShell: {
    key: "PilgrimsShell",
    name: "Pilgrim's Shell",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/PilgrimsShell.webp",
    details: `Transform into a Pilgrim's Shell to attack nearby enemies, dealing 178.80%/208.60%/238.40%/268.20% Aero DMG.<br>CD: 15s`,
    modifiers: [],
    actions: [
      {
        key: "PilgrimsShellAttackDMG",
        label: "Attack DMG",
        description: `Transform into a Pilgrim's Shell to attack nearby enemies, dealing 178.80%/208.60%/238.40%/268.20% Aero DMG.`,
        talents: {
          "1": "178.80%",
          "2": "178.80%",
          "3": "208.60%",
          "4": "238.40%",
          "5": "268.20%",
        },
        type: "Echo",
        element: "Aero",
      },
    ],
    sets: ["WindwardPilgrimage", "FlamingClawprint"],
  },
  QuestlessKnight: {
    key: "QuestlessKnight",
    name: "Questless Knight",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/questlessknight.png",
    details: `A humanoid Tacet Discord clad in fine attire, wielding a sharp blade and extraordinary might existing only in legends.`,
    modifiers: [],
    actions: [],
    sets: ["FrostyResolve", "MidnightVeil"],
  },
  RageAgainsttheStatue: {
    key: "RageAgainsttheStatue",
    name: "Rage Against the Statue",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/RageAgainsttheStatue.png",
    details: `<span class="description">Transform into Rage Against the Statue to attack enemies, dealing <span class="param">174.00%/208.80%/243.60%/278.40%/313.20%</span> Spectro DMG. Hold the Echo Skill to maintain the Echo form and charge towards enemies, dealing <span class="param">261.00%/313.20%/365.40%/417.60%/469.80%</span> Spectro DMG.
CD: <span class="param">20</span>s.</span>`,
    modifiers: [],
    actions: [
      {
        key: "RageAgainsttheStatueAttackDMG",
        label: "Attack DMG",
        description: `Transform into Rage Against the Statue to attack enemies, dealing <span class="param">174.00%/208.80%/243.60%/278.40%/313.20%</span> Spectro DMG.`,
        talents: {
          "1": "174.00%",
          "2": "208.80%",
          "3": "243.60%",
          "4": "278.40%",
          "5": "313.20%",
        },
        type: "Echo",
        element: "Spectro",
      },
      {
        key: "RageAgainsttheStatueChargeDMG",
        label: "Charge DMG",
        description: `Hold the Echo Skill to maintain the Echo form and charge towards enemies, dealing <span class="param">261.00%/313.20%/365.40%/417.60%/469.80%</span> Spectro DMG.`,
        talents: {
          "1": "261.00%",
          "2": "313.20%",
          "3": "365.40%",
          "4": "417.60%",
          "5": "469.80%",
        },
        type: "Echo",
        element: "Spectro",
      },
    ],
    sets: ["EternalRadiance", "GustsofWelkin"],
  },
  ReminiscenceFleurdelys: {
    key: "ReminiscenceFleurdelys",
    name: "Reminiscence: Fleurdelys",
    class: "Calamity",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ReminiscenceFleurdelys.webp",
    details: `Summon the Windcleaver to attack the target, dealing 18.24%/21.28%/24.32%/27.36% Aero DMG 8 times and 106.40%/121.60%/136.80% Aero DMG once.<br>
The Resonator with this Echo equipped in their main slot gains 10.00% Aero DMG Bonus. If this Resonator is Rover: Aero or ???, grant another 10.00% Aero DMG Bonus.<br>
CD: 20s.`,
    modifiers: [
      {
        modifier: "Aero",
        modifierValue: 0.10,
      },
      {
        modifier: "Aero",
        modifierValue: 0.10,
        specificCharacters: [
          "RoverAeroFemale",
          "RoverAeroMale",
        ],
      },
    ],
    actions: [
      {
        key: "WindcleaverDMG",
        label: "Windcleaver DMG",
        description: `Summon the Windcleaver to attack the target, dealing 18.24%/21.28%/24.32%/27.36% Aero DMG 8 times and 106.40%/121.60%/136.80% Aero DMG once.`,
        talents: {
          "1": "18.24%*8 + 91.20%",
          "2": "18.24%*8 + 91.20%",
          "3": "21.28%*8 + 106.40%",
          "4": "24.32%*8 + 121.60%",
          "5": "27.36%*8 + 126.80%",
        },
        type: "Echo",
        element: "Spectro",
      },
    ],
    sets: ["GustsofWelkin", "WindwardPilgrimage"],
  },
  RocksteadyGuardian: {
    key: "RocksteadyGuardian",
    name: "Rocksteady Guardian",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/RocksteadyGuardian.png",
    details: `<span class="description">Transform into Rocksteady Guardian and enter a Parry State. Upon being attacked, deal Spectro DMG equal to <span class="param">5.18%/5.96%/6.73%/7.51%/8.29%</span> of the Resonator's Max HP, and perform a follow-up attack that deals Spectro DMG equal to <span class="param">5.18%/5.96%/6.73%/7.51%/8.29%</span> of the Resonator's Max HP.

    Use the Echo Skill again to exit the transformation.

    If the attack received is a <color=highlight>Special Skill attack, interrupt the enemy's <color=highlight>Special Skill, gain a Shield equal to 30% Max HP, and perform a two-stage follow-up attack, each dealing Spectro DMG equal to <span class="param">3.45%/3.97%/4.49%/5.00%/5.52%</span> of the Resonator's Max HP. These follow-up attacks simultaneously launch three ground-breaking waves, each dealing Spectro DMG equal to <span class="param">2.87%/3.30%/3.73%/4.16%/4.59%</span> of the Resonator's Max HP.

    CD: <span class="param">15</span>s</color=highlight></color=highlight></span>`,
    modifiers: [],
    actions: [
      {
        key: "RocksteadyGuardianParry",
        label: "Parry DMG",
        description: `Transform into Rocksteady Guardian and enter a Parry State. Upon being attacked, deal Spectro DMG equal to <span class="param">5.18%/5.96%/6.73%/7.51%/8.29%</span> of the Resonator's Max HP, and perform a follow-up attack that deals Spectro DMG equal to <span class="param">5.18%/5.96%/6.73%/7.51%/8.29%</span> of the Resonator's Max HP.`,
        talents: {
          "1": "5.18%*2",
          "2": "5.96%*2",
          "3": "6.73%*2",
          "4": "7.51%*2",
          "5": "8.29%*2",
        },
        type: "Echo",
        element: "Spectro",
        attribute: "hp",
      },
      {
        key: "RocksteadyGuardianSpecialParry",
        label: "Special Attack Parry DMG",
        description: `If the attack received is a <color=highlight>Special Skill attack, interrupt the enemy's <color=highlight>Special Skill, perform a two-stage follow-up attack, each dealing Spectro DMG equal to <span class="param">3.45%/3.97%/4.49%/5.00%/5.52%</span> of the Resonator's Max HP. These follow-up attacks simultaneously launch three ground-breaking waves, each dealing Spectro DMG equal to <span class="param">2.87%/3.30%/3.73%/4.16%/4.59%</span> of the Resonator's Max HP.`,
        talents: {
          "1": "3.45%*2 + 2.87%*3",
          "2": "3.97%*2 + 3.30%*3",
          "3": "4.49%*2 + 3.73%*3",
          "4": "5.00%*2 + 4.16%*3",
          "5": "5.52%*2 + 4.59%*3",
        },
        type: "Echo",
        element: "Spectro",
        attribute: "hp",
      },
      {
        key: "RocksteadyGuardianSpecialParry",
        label: "Special Attack Shield",
        description: `If the attack received is a <color=highlight>Special Skill attack, interrupt the enemy's <color=highlight>Special Skill, gain a Shield equal to 30% Max HP.`,
        talents: {
          "1": "30%",
          "2": "30%",
          "3": "30%",
          "4": "30%",
          "5": "30%",
        },
        type: "Shield",
        element: "Spectro",
        attribute: "hp",
      },
    ],
    sets: ["CelestialLight", "RejuvenatingGlow"],
  },
  Roseshroom: {
    key: "Roseshroom",
    name: "Roseshroom",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Roseshroom.png",
    details: `<span class="description">Summon a Roseshroom that fires a laser, dealing <span class="param">35.67%/41.02%/46.37%/51.72%/57.07%</span> Havoc DMG up to <span class="param">3</span> times.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "RoseshroomLaser",
        label: "Laser DMG",
        description: `Summon a Roseshroom that fires a laser, dealing <span class="param">35.67%/41.02%/46.37%/51.72%/57.07%</span> Havoc DMG up to <span class="param">3</span> times.`,
        talents: {
          "1": "35.67%*3",
          "2": "41.02%*3",
          "3": "46.37%*3",
          "4": "51.72%*3",
          "5": "57.07%*3",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["FreezingFrost", "SunSinkingEclipse"],
  },
  SabyrBoar: {
    key: "SabyrBoar",
    name: "Sabyr Boar",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/SabyrBoar.png",
    details: `<span class="description">Summon a Sabyr Boar to headbutt the enemy into the air, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Physical DMG.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["FreezingFrost", "SierraGale", "MoonlitClouds"],
  },
  Sacerdos: {
    key: "Sacerdos",
    name: "Sacerdos",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Sacerdos.webp",
    details: ``,
    modifiers: [],
    actions: [],
    sets: ["GustsofWelkin", "WindwardPilgrimage"],
  },
  Sagittario: {
    key: "Sagittario",
    name: "Sagittario",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Sagittario.webp",
    details: ``,
    modifiers: [],
    actions: [],
    sets: ["EternalRadiance", "GustsofWelkin"],
  },
  SentryConstruct: {
    key: "SentryConstruct",
    name: "Sentry Construct",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/sentryconstruct.png",
    details: `<span class="description">Transform into Sentry Construct and attack enemies in front, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Glacio DMG. Each time the Resonator with this Echo casts Resonance Liberation, it enhances the Strike Capacitor.
Once Strike Capacitor is at max level, the Echo Skill cooldown will be reset. Use Echo Skill to transform into Sentry Construct and dive into enemies from the air, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Glacio DMG and freezing the target.
The Resonator with this Echo equipped in their main slot gains <span class="param">12.00%</span> Glacio DMG Bonus and <span class="param">12.00%</span> Resonance Skill DMG Bonus.
CD: <span class="param">25</span>s.</span>`,
    modifiers: [
      {
        modifier: "Glacio",
        modifierValue: 0.12,
      },
      {
        modifier: "ResonanceSkillDMGBonus",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "SentryConstructAttack",
        label: "Attack DMG",
        description: `Transform into Sentry Construct and attack enemies in front, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Glacio DMG. Each time the Resonator with this Echo casts Resonance Liberation, it enhances the Strike Capacitor.`,
        talents: {
          "1": "225.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Echo",
        element: "Glacio",
      },
      {
        key: "SentryConstructUpgradedAttack",
        label: "Upgraded Attack DMG",
        description: `Once Strike Capacitor is at max level, the Echo Skill cooldown will be reset. Use Echo Skill to transform into Sentry Construct and dive into enemies from the air, dealing <span class="param">225.00%/270.00%/315.00%/360.00%/405.00%</span> Glacio DMG and freezing the target.`,
        talents: {
          "1": "225.00%",
          "2": "270.00%",
          "3": "315.00%",
          "4": "360.00%",
          "5": "405.00%",
        },
        type: "Echo",
        element: "Glacio",
      },
    ],
    sets: ["FrostyResolve"],
  },
  SnipSnap: {
    key: "SnipSnap",
    name: "Snip Snap",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/SnipSnap.png",
    details: `<span class="description">Summon a Snip Snap that throws fireballs at the enemy, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Fusion DMG on-hit.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "RejuvenatingGlow", "LingeringTunes"],
  },
  Spearback: {
    key: "Spearback",
    name: "Spearback",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Spearback.png",
    details: `<span class="description">Summon a Spearback to perform 5 consecutive attacks. The first 4 attacks deal <span class="param">18.73%/21.53%/24.34%/27.15%/29.96%</span> Physical DMG, and the last deals <span class="param">32.10%/36.92%/41.73%/46.55%/51.36%</span> Physical DMG.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "SpearbackAttack",
        label: "Slash DMG",
        description: `Summon a Spearback to perform 5 consecutive attacks. The first 4 attacks deal <span class="param">18.73%/21.53%/24.34%/27.15%/29.96%</span> Physical DMG, and the last deals <span class="param">32.10%/36.92%/41.73%/46.55%/51.36%</span> Physical DMG.`,
        talents: {
          "1": "18.73%*4 + 32.10%",
          "2": "21.53%*4 + 36.92%",
          "3": "24.34%*4 + 41.73%",
          "4": "27.15%*4 + 46.55%",
          "5": "29.96%*4 + 51.36%",
        },
        type: "Echo",
        element: "Physical",
      },
    ],
    sets: ["MoonlitClouds", "LingeringTunes"],
  },
  SpectroDrake: {
    key: "SpectroDrake",
    name: "Spectro Drake",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/SpectroDrake.webp",
    details: `Summon a Spectro Drake to attack enemies, dealing 43.20% Spectro DMG 3 times.<br>CD: 8s`,
    modifiers: [],
    actions: [],
    sets: ["WindwardPilgrimage", "FlamingClawprint"],
  },
  SpectroPrism: {
    key: "SpectroPrism",
    name: "Spectro Prism",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/SpectroPrism.png",
    details: `<span class="description">Summon a Spectro Prism to emit a laser that hits the enemy up to <span class="param">8</span> times, dealing <span class="param">9.00%/10.35%/11.70%/13.05%/14.40%</span> Spectro DMG each time.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "VoidThunder", "CelestialLight"],
  },
  StonewallBracer: {
    key: "StonewallBracer",
    name: "Stonewall Bracer",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/StonewallBracer.png",
    details: `<span class="description">Transform into Stonewall Bracer and charge forward, dealing <span class="param">70.40%/80.96%/91.52%/102.08%/112.64%</span> Physical DMG on-hit, then smash to deal <span class="param">105.60%/121.44%/137.28%/153.12%/168.96%</span> Physical DMG, and gain a shield of <span class="param">10.00%</span> of current character's Max HP that lasts <span class="param">7</span>s. Use the Echo skill again to exit the transformation state.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "StonewallBracerCharge",
        label: "Charge DMG",
        description: `Transform into Stonewall Bracer and charge forward, dealing <span class="param">70.40%/80.96%/91.52%/102.08%/112.64%</span> Physical DMG on-hit, then smash to deal <span class="param">105.60%/121.44%/137.28%/153.12%/168.96%</span> Physical DMG.`,
        talents: {
          "1": "70.40% + 105.60%",
          "2": "80.96% + 121.44%",
          "3": "91.52% + 137.28%",
          "4": "102.08% + 153.12%",
          "5": "112.64% + 168.96%",
        },
        type: "Echo",
        element: "Physical",
      },
      {
        key: "StonewallBracerShield",
        label: "Charge Shield",
        description: `Gain a shield of <span class="param">10.00%</span> of current character's Max HP that lasts <span class="param">7</span>s.`,
        talents: {
          "1": "10%",
          "2": "10%",
          "3": "10%",
          "4": "10%",
          "5": "10%",
        },
        type: "Shield",
        element: "Physical",
        attribute: "hp",
      },
    ],
    sets: ["RejuvenatingGlow", "MoonlitClouds"],
  },
  Tambourinist: {
    key: "Tambourinist",
    name: "Tambourinist",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/Tambourinist.png",
    details: `<span class="description">Summon a Tambourinist that periodically emits Melodies of Annihilation. Friendly units hit with Melodies of Annihilation deal an extra Havoc DMG of <span class="param">10.35%/11.70%/13.05%/14.40%</span> with their attacks, up to 10 times.</span>`,
    modifiers: [],
    actions: [
      {
        key: "TambourinistAnnihilation",
        label: "Annihilation DoT DMG",
        description: `Summon a Tambourinist that periodically emits Melodies of Annihilation. Friendly units hit with Melodies of Annihilation deal an extra Havoc DMG of <span class="param">10.35%/11.70%/13.05%/14.40%</span> with their attacks, up to 10 times.`,
        talents: {
          "1": "10.35%",
          "2": "10.35%",
          "3": "11.70%",
          "4": "13.05%",
          "5": "14.40%",
        },
        type: "Echo",
        element: "Havoc",
      },
    ],
    sets: ["FreezingFrost", "SunSinkingEclipse"],
  },
  TempestMephis: {
    key: "TempestMephis",
    name: "Tempest Mephis",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/TempestMephis.png",
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
    actions: [
      {
        key: "TempestMephisTailSwing",
        label: "Tail Swing DMG",
        description: `Transform into Tempest Mephis to perform tail swing attacks followed by a claw attack. The lightning strike summoned by the tail swing deals <span class="param">64.05%/73.66%/83.27%/92.87%/102.48%</span> Electro DMG each time.`,
        talents: {
          "1": "64.05%",
          "2": "73.66%",
          "3": "83.27%",
          "4": "92.87%",
          "5": "102.48%",
        },
        type: "Echo",
        element: "Electro",
      },
      {
        key: "TempestMephisClaw",
        label: "Claw DMG",
        description: `Transform into Tempest Mephis to perform tail swing attacks followed by a claw attack. The claw attack deals <span class="param">109.80%/126.27%/142.74%/159.21%/175.68%</span> Electro DMG.`,
        talents: {
          "1": "109.80%",
          "2": "126.27%",
          "3": "142.74%",
          "4": "159.21%",
          "5": "175.68%",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["VoidThunder"],
  },
  ThunderingMephis: {
    key: "ThunderingMephis",
    name: "Thundering Mephis",
    class: "Overlord",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ThunderingMephis.png",
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
    actions: [
      {
        key: "ThunderingMephisStrike",
        label: "Strike DMG",
        description: `Transform into Thundering Mephis, engaging in a rapid assault of up to 6 strikes. The first 5 strikes deal <span class="param">82.88%/95.31%/107.74%/120.18%/132.61%</span> Electro DMG each, while the final strike inflicts <span class="param">118.40%/136.16%/153.92%/171.68%/189.44%</span> Electro DMG, with an additional <span class="param">19.73%/22.69%/25.65%/28.61%/31.57%</span> Electro DMG from the thunder.`,
        talents: {
          "1": "82.88%*5 + 118.40% + 19.73%",
          "2": "95.31%*5 + 136.16% + 22.69%",
          "3": "107.74%*5 + 153.92% + 25.65%",
          "4": "120.18%*5 + 171.68% + 28.61%",
          "5": "132.61%*5 + 189.44% + 31.57%",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["VoidThunder"],
  },
  TickTack: {
    key: "TickTack",
    name: "Tick Tack",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/TickTack.png",
    details: `<span class="description">Summon a Tick Tack that charges and bites the enemy. The charge from Tick Tack will deal <span class="param">42.80%/49.22%/55.64%/62.06%/68.48%</span> Havoc DMG to the enemy, and the bite will deal <span class="param">64.20%/73.83%/83.46%/93.09%/102.72%</span> Havoc DMG to the enemy. Reduces enemy Vibration Strength by up to <span class="param">5.00%</span> during <span class="param">5</span>s.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["SunSinkingEclipse", "RejuvenatingGlow", "LingeringTunes"],
  },
  TrafficIlluminator: {
    key: "TrafficIlluminator",
    name: "Traffic Illuminator",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/TrafficIlluminator.png",
    details: `<span class="description">Summon a Traffic Illuminator, immobilizing enemies for up to <span class="param">1</span>s. The immobilization will be lifted once the enemy is hit.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "VoidThunder", "SierraGale"],
  },
  VanguardJunrock: {
    key: "VanguardJunrock",
    name: "Vanguard Junrock",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/VanguardJunrock.png",
    details: `<span class="description">Summon a Vanguard Junrock that charges forward, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Physical DMG to enemies in its path.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["VoidThunder", "RejuvenatingGlow", "LingeringTunes"],
  },
  VioletFeatheredHeron: {
    key: "VioletFeatheredHeron",
    name: "Violet-Feathered Heron",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/VioletFeatheredHeron.png",
    details: `<span class="description">Transform into Violet-Feathered Heron and enter a Parry Stance. Counterattack when the Parry stance is over, dealing <span class="param">180.00%/207.00%/234.00%/261.00%/288.00%</span> Electro DMG. If attacked during Parry Stance, you can counterattack in advance and additionally recover <span class="param">5</span> Concerto Energy.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [
      {
        key: "VioletFeatheredHeron",
        label: "Counter Attack DMG",
        description: `Transform into Violet-Feathered Heron and enter a Parry Stance. Counterattack when the Parry stance is over, dealing <span class="param">180.00%/207.00%/234.00%/261.00%/288.00%</span> Electro DMG.`,
        talents: {
          "1": "180.00%",
          "2": "207.00%",
          "3": "234.00%",
          "4": "261.00%",
          "5": "288.00%",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["MoltenRift", "VoidThunder"],
  },
  VitreumDancer: {
    key: "VitreumDancer",
    name: "Vitreum Dancer",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/VitreumDancer.png",
    details: `Transform into Vitreum Dancer and attack surrounding enemies, dealing 313.20% Electro DMG.
The Resonator with this Echo equipped in their main slot gains 12.00% Electro DMG Bonus.
CD: 20s.`,
    modifiers: [
      {
        modifier: "Electro",
        modifierValue: 0.12,
      },
    ],
    actions: [
      {
        key: "VitreumDancerDMG",
        label: "Vitreum Dancer DMG",
        description: `Transform into Vitreum Dancer and attack surrounding enemies, dealing 208.80%/243.60%/278.40%/313.20% Electro DMG.`,
        talents: {
          "1": "208.80%",
          "2": "208.80%",
          "3": "243.60%",
          "4": "278.40%",
          "5": "313.20%",
        },
        type: "Echo",
        element: "Electro",
      },
    ],
    sets: ["EternalRadiance", "EmpyreanAnthem"],
  },
  VoltscourgeStalker: {
    key: "VoltscourgeStalker",
    name: "Voltscourge Stalker",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/VoltscourgeStalker.webp",
    details: `A wolf-like Tacet Discord prowling storm-stricken regions, known for its aggressiveness and lightning speed.`,
    modifiers: [],
    actions: [],
    sets: ["MidnightVeil", "EmpyreanAnthem"],
  },
  WhiffWhaff: {
    key: "WhiffWhaff",
    name: "Whiff Whaff",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/WhiffWhaff.png",
    details: `<span class="description">Summon a Whiff Whaff that triggers an air explosion, dealing <span class="param">32.10%/36.92%/41.73%/46.55%/51.36%</span> Aero DMG and produce a Low-pressure Zone. The Low-pressure Zone continuously pulls enemies nearby towards the center for <span class="param">2</span>s, dealing <span class="param">12.48%/14.35%/16.22%/18.10%/19.97%</span> Aero DMG up to 6 times.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["SierraGale", "RejuvenatingGlow", "MoonlitClouds"],
  },
  ViridblazeSaurian: {
    key: "ViridblazeSaurian",
    name: "Viridblaze Saurian",
    class: "Elite",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ViridblazeSaurian.png",
    details: `<span class="description">Summon a Viridblaze Saurian to continuously spit fire, dealing <span class="param">10.70%/12.31%/13.91%/15.52%/17.12%</span> Fusion DMG 10 times. CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["MoltenRift", "MoonlitClouds"],
  },
  YoungRoseshroom: {
    key: "YoungRoseshroom",
    name: "Young Roseshroom",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/YoungRoseshroom.png",
    details: `<span class="description">Summon a Baby Roseshroom that fires a laser, dealing <span class="param">20.00%+40/23.00%+46/26.00%+52/29.00%+58/32.00%+64</span> Havoc DMG.

    CD: <span class="param">8</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["SierraGale", "SunSinkingEclipse"],
  },
  ZigZag: {
    key: "ZigZag",
    name: "Zig Zag",
    class: "Common",
    image:
      "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/ZigZag.png",
    details: `<span class="description">Summon a Zig Zag that denotates Spectro energy, dealing <span class="param">30.00%+60/34.50%+69/39.00%+78/43.50%+87/48.00%+96</span> Spectro DMG and creating a Stagnation Zone that lasts 1.8s.

    CD: <span class="param">15</span>s</span>`,
    modifiers: [],
    actions: [],
    sets: ["CelestialLight", "MoonlitClouds", "LingeringTunes"],
  },
};
