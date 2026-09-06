import type { TeamExportData } from "./exportImport";

export interface TeamRotationPreset {
  name: string;
  description: string;
  author: string;
  /**
   * Same shape a team export produces (see exportImport.ts) — the easiest
   * way to author an entry is to build the team in-app, use the team
   * editor's "Copy Team" button, and paste the `data` portion here.
   */
  data: TeamExportData;
}

/**
 * The enemy every WuWaBuilds preset below assumes: a level 90 Calamity-class
 * target with 10% base elemental resistance and no pre-applied status stacks.
 * That is both what the leaderboard's damage engine scores against (its
 * defence multiplier is fixed at lv90 attacker vs lv90 enemy and its
 * resistance term at a 10% base) and, field for field, this app's own
 * `defaultEnemyConfig` in the teamRotations store — so importing a preset
 * leaves the enemy exactly where a freshly created team would leave it.
 *
 * Shared by reference on purpose: `importTeam` copies it into a new object
 * (`{ ...defaultEnemyConfig(), ...teamData.enemyConfig }`), so no imported
 * team can ever mutate it.
 */
const wuwabuildsEnemyConfig: Record<string, unknown> = {
  enemyLevel: 90,
  enemyResist: 0.1,
  enemyType: "Calamity",
  enemyBrowserKey: null,
  spectroFrazzleStacks: 0,
  aeroErosionStacks: 0,
  havocBaneStacks: 0,
  fusionBurstStacks: 0,
  electroFlareStacks: 0,
  electroRageStacks: 0,
  glacioChafeStacks: 0,
  strainStacks: 0,
};

const WUWABUILDS = "WuWaBuilds";

/**
 * Curated Team Rotations presets, listed in the app under Teams > List
 * Presets. Add new entries to this array — each is a full, importable team
 * (characters, actions, enemy config). This file is meant to grow long;
 * keep entries self-contained and alphabetized by `name` isn't required,
 * just append new ones.
 *
 * The WuWaBuilds block below mirrors one leaderboard board ("track") each
 * from wuwa.build, all of them: slot 0 is the scored carry, slots 1-2 the
 * supports that board is scored with, in the leaderboard's own order. Names
 * carry the investment the leaderboard standardizes on — S<n>R1, because
 * WuWaBuilds pins 5-star weapons at R1 (and 4-stars at R5).
 *
 * A few boards are scored with no team at all and so fill slot 0 only: every
 * healer board (scored on healing rather than damage), and the Solo tracks
 * Cartethyia, Changli and Danjin keep alongside their team ones. They are
 * kept here because the leaderboard scores them, and because their setup
 * differs from the team track's — Cartethyia's Aero Erosion cap and
 * Changli's Energy Regen target both move when the supports go away.
 *
 * A team export references characters by id and deliberately never carries
 * their builds or the board's rotation, so everything those cannot express —
 * each support's weapon, sonata set, main echo and assumed sequence, the
 * carry's Energy Regen target, and what the board actually measures — lives
 * in `description`. Import one to get the composition, then bring your own
 * builds and actions.
 */
export const teamRotationPresets: TeamRotationPreset[] = [
  {
    name: "WuWaBuilds Aemeath S0R1 Hypercarry",
    description:
      "Tune Rupture BiS team, Stardust Resonance rotation, average damage. Carry ER target 115%. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Aemeath S0R1 Hypercarry",
      characterIds: ["Aemeath", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Aemeath S6R1 Hypercarry",
    description:
      "S6 full sequence with the Tune Rupture team, average damage. Carry ER target 115%. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Aemeath S6R1 Hypercarry",
      characterIds: ["Aemeath", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Augusta S0R1 Hypercarry",
    description:
      "Fully buffed standard rotation, average damage. Carry ER target 120%. Supports: Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Iuno S0 (Moongazer's Sigil R1, Crown of Valor, Lady of the Sea). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Augusta S0R1 Hypercarry",
      characterIds: ["Augusta", "Shorekeeper", "Iuno"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Augusta S2R1 Hypercarry",
    description:
      "Fully buffed rotation with 2 stacks of Crown of Wills, average damage. Carry ER target 120%. Supports: Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Iuno S0 (Moongazer's Sigil R1, Crown of Valor, Lady of the Sea). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Augusta S2R1 Hypercarry",
      characterIds: ["Augusta", "Shorekeeper", "Iuno"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Augusta S6R1 Hypercarry",
    description:
      "Fully buffed rotation with 4 stacks of Crown of Wills, average damage. Carry ER target 120%. Supports: Shorekeeper S2 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Iuno S2 (Moongazer's Sigil R1, Crown of Valor, Lady of the Sea). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Augusta S6R1 Hypercarry",
      characterIds: ["Augusta", "Shorekeeper", "Iuno"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Calcharo S0R1 Hypercarry",
    description:
      "Optimized 3 Death Messenger burst, average damage. Carry ER target 120%. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Calcharo S0R1 Hypercarry",
      characterIds: ["Calcharo", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Calcharo S6R1 Hypercarry",
    description:
      "Same team and rotation at S6, average damage. Carry ER target 120%. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Calcharo S6R1 Hypercarry",
      characterIds: ["Calcharo", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Camellya S0R1 Hypercarry",
    description:
      "Standard Nuke and Spin rotation, average damage. Carry ER target 115%. Supports: Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Roccia S0 (Moonlit Clouds, Impermanence Heron). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Camellya S0R1 Hypercarry",
      characterIds: ["Camellya", "Shorekeeper", "Roccia"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Camellya S2R1 Hypercarry",
    description:
      "Standard Nuke and Spin with the Forte Circuit nuke crit-fished, rest average damage. Carry ER target 115%. Supports: Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Roccia S0 (Moonlit Clouds, Impermanence Heron). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Camellya S2R1 Hypercarry",
      characterIds: ["Camellya", "Shorekeeper", "Roccia"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Camellya S6R1 Hypercarry",
    description:
      "Full sequence chain with the Perennial follow-up; Forte Circuit nuke crit-fished, rest average damage. Carry ER target 115%. Supports: Shorekeeper S2 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Roccia S2 (Moonlit Clouds, Impermanence Heron). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Camellya S6R1 Hypercarry",
      characterIds: ["Camellya", "Shorekeeper", "Roccia"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Cantarella S0R1 Sub-DPS",
    description:
      "Single-cycle Sub-DPS in the Phrolova team, average damage; Midnight Veil adds +8.1% bonus score. Carry ER target 130%. Supports: Phrolova S0 (kit only, no team-facing gear); Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Cantarella S0R1 Sub-DPS",
      characterIds: ["Cantarella", "Phrolova", "Shorekeeper"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Cantarella S6R1 Hypercarry",
    description:
      "S6 buffed DPS rotation, average damage; Midnight Veil adds +3.5% bonus score. Carry ER target 130%. Supports: Roccia S2 (Moonlit Clouds, Impermanence Heron); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Cantarella S6R1 Hypercarry",
      characterIds: ["Cantarella", "Roccia", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Carlotta S0R1 Hypercarry",
    description:
      "Lynae + Mornye buffed rotation, average damage. Carry ER target 108%. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Carlotta S0R1 Hypercarry",
      characterIds: ["Carlotta", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Carlotta S1R1 Hypercarry",
    description:
      "Same rotation with S1's +12.5% Crit Rate on Deconstruction hits, average damage. Carry ER target 108%. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Carlotta S1R1 Hypercarry",
      characterIds: ["Carlotta", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Carlotta S6R1 Hypercarry",
    description:
      "Full sequence chain: boosted Death Knell / Fatal Finale plus the Kaleidoscope Sparks outro strike, average damage. Carry ER target 108%. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Carlotta S6R1 Hypercarry",
      characterIds: ["Carlotta", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Cartethyia S0R1 Hypercarry",
    description:
      "Chisa's Outro raises the Aero Erosion stack cap from 3 to 6, which every buff on this board depends on; stack Swords, transform to Fleurdelys and nuke, average damage. Carry ER target 110%. Supports: Ciaccona S0 (Woodland Aria R1, Gusts of Welkin); Chisa S0 (Kumokiri R1, Thread of Severed Fate). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Cartethyia S0R1 Hypercarry",
      characterIds: ["Cartethyia", "Ciaccona", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Cartethyia S0R1 Solo",
    description:
      "No team, so Aero Erosion never leaves its base 3-stack cap: Wind's Indelible Imprint stays at its 30% floor and Blade of Howling Squall removes 3 stacks instead of 5, and a Heavy opens instead of the Intro, average damage. Carry ER target 115%. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Cartethyia S0R1 Solo",
      characterIds: ["Cartethyia"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Cartethyia S6R1 Hypercarry",
    description:
      "S6 full sequence, average damage. Carry ER target 110%. Supports: Ciaccona S2 (Woodland Aria R1, Gusts of Welkin); Chisa S2 (Kumokiri R1, Thread of Severed Fate). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Cartethyia S6R1 Hypercarry",
      characterIds: ["Cartethyia", "Ciaccona", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Changli S0R1 Hypercarry",
    description:
      "Mornye + Lupa buffed rotation, average damage. Carry ER target 110%. Supports: Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance); Lupa S0 (Wildfire Mark R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Changli S0R1 Hypercarry",
      characterIds: ["Changli", "Mornye", "Lupa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Changli S0R1 Solo",
    description:
      "Solo Changli, average damage. Carry ER target 120%, higher than the team track because nothing else feeds her energy. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Changli S0R1 Solo",
      characterIds: ["Changli"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Changli S2R1 Hypercarry",
    description:
      "S2 buffed rotation, average damage. Carry ER target 110%. Supports: Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance); Lupa S0 (Wildfire Mark R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Changli S2R1 Hypercarry",
      characterIds: ["Changli", "Mornye", "Lupa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Changli S2R1 Solo",
    description:
      "S2 solo Changli, average damage. Carry ER target 120%, higher than the team track because nothing else feeds her energy. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Changli S2R1 Solo",
      characterIds: ["Changli"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Changli S6R1 Hypercarry",
    description:
      "Mornye + Lupa buffed rotation with the full sequence chain, average damage. Carry ER target 110%. Supports: Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance); Lupa S2 (Wildfire Mark R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Changli S6R1 Hypercarry",
      characterIds: ["Changli", "Mornye", "Lupa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Chisa S0R1 Hypercarry",
    description:
      "Intro, Basic String, Liberation, Chainsaw; average damage. Carry ER target 125%. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Chisa S0R1 Hypercarry",
      characterIds: ["Chisa", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Chisa S6R1 Hypercarry",
    description:
      "Same rotation at S6, average damage. Carry ER target 125%. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Chisa S6R1 Hypercarry",
      characterIds: ["Chisa", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Danjin S6R1 Damage",
    description:
      "Double-cycle DPS combo as a solo team, the damage counterpart to her Sub-DPS board. No ER requirement on this board. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Danjin S6R1 Damage",
      characterIds: ["Danjin"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Danjin S6R1 Sub-DPS",
    description:
      "Single-cycle Sub-DPS; Moonlit Clouds adds +7.7% and Impermanence Heron +4.3% bonus score. No ER requirement on this board. Supports: Phrolova S0 (kit only, no team-facing gear); Verina S2 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Danjin S6R1 Sub-DPS",
      characterIds: ["Danjin", "Phrolova", "Verina"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Denia S0R1 Fusion Burst",
    description:
      "Fusion Burst rotation, average damage; the Denia echo adds 12% bonus score. Carry ER target 120%. Supports: Aemeath S0 (Everbright Polestar R1, Trailblazing Star); Chisa S0 (Kumokiri R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Denia S0R1 Fusion Burst",
      characterIds: ["Denia", "Aemeath", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Denia S6R1 Fusion Burst",
    description:
      "Same team at S6 with S3 (max 5 Dark Cores), average damage; the Denia echo adds 12% bonus score. Carry ER target 120%. Supports: Aemeath S2 (Everbright Polestar R1, Trailblazing Star); Chisa S2 (Kumokiri R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Denia S6R1 Fusion Burst",
      characterIds: ["Denia", "Aemeath", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Galbrena S0R1 Hypercarry",
    description:
      "Lupa + Mornye buffed rotation, average damage. Carry ER target 110%. Supports: Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance); Lupa S0 (Wildfire Mark R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Galbrena S0R1 Hypercarry",
      characterIds: ["Galbrena", "Mornye", "Lupa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Galbrena S6R1 Hypercarry",
    description:
      "Same team at S6, average damage. Carry ER target 110%. Supports: Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance); Lupa S2 (Wildfire Mark R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Galbrena S6R1 Hypercarry",
      characterIds: ["Galbrena", "Mornye", "Lupa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Hiyuki S0R1 Hypercarry",
    description:
      "Lynae + Chisa 4-Iai rotation, average damage. Carry ER target 107%. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Chisa S0 (Kumokiri R1, Thread of Severed Fate). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Hiyuki S0R1 Hypercarry",
      characterIds: ["Hiyuki", "Lynae", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Hiyuki S6R1 Hypercarry",
    description:
      "Lynae + Chisa on the 5-Iai rotation S2's extra Iai charge unlocks, average damage. No ER requirement on this board. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Chisa S2 (Kumokiri R1, Thread of Severed Fate). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Hiyuki S6R1 Hypercarry",
      characterIds: ["Hiyuki", "Lynae", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Iuno S0R1 Hypercarry",
    description:
      "Full Moon Domain MDPS rotation into the Forte Ring nuke, average damage. No ER requirement on this board. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Iuno S0R1 Hypercarry",
      characterIds: ["Iuno", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Iuno S6R1 Hypercarry",
    description:
      "Extended S6 rotation, average damage. No ER requirement on this board. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Iuno S6R1 Hypercarry",
      characterIds: ["Iuno", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Jinhsi S0R1 Hypercarry",
    description:
      "Two-window loop: low-stack first Epiphany, full-stack second, average damage. Carry ER target 110%. Supports: Verina S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Zhezhi S0 (Rime-Draped Sprouts R1, Moonlit Clouds, Impermanence Heron). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Jinhsi S0R1 Hypercarry",
      characterIds: ["Jinhsi", "Verina", "Zhezhi"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Jinhsi S1R1 Hypercarry",
    description:
      "Same two-window loop with S1's Epiphany MV bonus, average damage. Carry ER target 110%. Supports: Verina S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Zhezhi S0 (Rime-Draped Sprouts R1, Moonlit Clouds, Impermanence Heron). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Jinhsi S1R1 Hypercarry",
      characterIds: ["Jinhsi", "Verina", "Zhezhi"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Jinhsi S6R1 Hypercarry",
    description:
      "Same loop with the full sequence chain (S1 Epiphany, S3 ATK, S4 team DMG, S5/S6 MV bonuses), average damage. Carry ER target 110%. Supports: Verina S2 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Zhezhi S2 (Rime-Draped Sprouts R1, Moonlit Clouds, Impermanence Heron). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Jinhsi S6R1 Hypercarry",
      characterIds: ["Jinhsi", "Verina", "Zhezhi"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Jiyan S0R1 Hypercarry",
    description:
      "Double Dragon Combo: 8x dodge-cancelled Stage-1 lances, average damage. Carry ER target 125%. Supports: Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Iuno S0 (kit only, no team-facing gear). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Jiyan S0R1 Hypercarry",
      characterIds: ["Jiyan", "Shorekeeper", "Iuno"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Jiyan S6R1 Hypercarry",
    description:
      "Double Dragon Combo with the full sequence chain (S1 extra Windqueller, S6 Momentum Finale), average damage. Carry ER target 125%. Supports: Shorekeeper S2 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return); Iuno S2 (kit only, no team-facing gear). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Jiyan S6R1 Hypercarry",
      characterIds: ["Jiyan", "Shorekeeper", "Iuno"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Lucilla S0R1 Glacio Chafe",
    description:
      "The standard Hiyuki Glacio Chafe team, average damage. No ER requirement on this board. Supports: Chisa S0 (Kumokiri R1, Rejuvenating Glow, Fallacy of No Return); Hiyuki S0 (Wishes of Quiet Snowfall). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Lucilla S0R1 Glacio Chafe",
      characterIds: ["Lucilla", "Chisa", "Hiyuki"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Lucilla S6R1 Glacio Chafe",
    description:
      "Same Chafe team at S6, average damage. No ER requirement on this board. Supports: Chisa S2 (Kumokiri R1, Rejuvenating Glow, Fallacy of No Return); Hiyuki S4 (Wishes of Quiet Snowfall). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Lucilla S6R1 Glacio Chafe",
      characterIds: ["Lucilla", "Chisa", "Hiyuki"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Lucy S0R1 Hypercarry",
    description:
      "Hack team, full Algorithm Compaction loop, average damage. Carry ER target 121%. Supports: Rebecca S0 (Skull Thrasher R1, Moonlit Clouds, Bell-Borne Geochelone); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Lucy S0R1 Hypercarry",
      characterIds: ["Lucy", "Rebecca", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Lucy S6R1 Hypercarry",
    description:
      "Same rotation at S6 with the S2 Pulse Interference bonus instance, average damage. Carry ER target 121%. Supports: Rebecca S2 (Skull Thrasher R1, Moonlit Clouds, Bell-Borne Geochelone); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Lucy S6R1 Hypercarry",
      characterIds: ["Lucy", "Rebecca", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Lupa S0R1 Sub DPS",
    description:
      "Mornye + Changli buffed rotation, average damage. Carry ER target 120%. Supports: Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk); Changli S0 (Blazing Brilliance R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Lupa S0R1 Sub DPS",
      characterIds: ["Lupa", "Mornye", "Changli"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Lupa S1R1 Sub DPS",
    description:
      "S1 Lupa buffed rotation, average damage. Carry ER target 120%. Supports: Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk); Changli S0 (Blazing Brilliance R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Lupa S1R1 Sub DPS",
      characterIds: ["Lupa", "Mornye", "Changli"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Lupa S6R1 Sub DPS",
    description:
      "Mornye + Changli buffed rotation with the full sequence chain, average damage. Carry ER target 120%. Supports: Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk); Changli S2 (Blazing Brilliance R1, Flaming Clawprint). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Lupa S6R1 Sub DPS",
      characterIds: ["Lupa", "Mornye", "Changli"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Luuk Herssen S0R1 Hypercarry",
    description:
      "Tune Strain BiS team, Aureate Judge Aureole cycle into the Rewritten nuke, average damage. Carry ER target 120%. Supports: Denia S0 (Forged Dwarf Star R1, Pact of Neonlight Leap, Reminiscence: Denia, Tune Strain stance, hands off); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Luuk Herssen S0R1 Hypercarry",
      characterIds: ["LuukHerssen", "Denia", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Luuk Herssen S6R1 Hypercarry",
    description:
      "Full sequence chain with the Tune Strain team, average damage. Carry ER target 120%. Supports: Denia S2 (Forged Dwarf Star R1, Pact of Neonlight Leap, Reminiscence: Denia, Tune Strain stance, hands off); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Luuk Herssen S6R1 Hypercarry",
      characterIds: ["LuukHerssen", "Denia", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Mornye S0R1 Heal",
    description:
      "Scored on healing, not damage: the full S0 sustain cycle of Distributed Array and 8 High Syntony ticks. Carry ER target 260%, retained for her normal Liberation cycle. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Mornye S0R1 Heal",
      characterIds: ["Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Mornye S6R1 Nuke",
    description:
      "S6 Critical Protocol in a fixed buff showcase: +440% multiplier with ER-scaled Crit Rate and Crit DMG, the 260% ER requirement capping those kit buffs. Carry ER target 260%. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Shorekeeper S2 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Mornye S6R1 Nuke",
      characterIds: ["Mornye", "Lynae", "Shorekeeper"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Phoebe S0R1 Hypercarry",
    description:
      "Absolution DPS Phoebe, average damage. Carry ER target 110%. Supports: Lynae S0 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Rover Spectro S6 (Moonlit Clouds, Impermanence Heron, S6 comes from the questline, and either gender works: this preset uses the female key). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Phoebe S0R1 Hypercarry",
      characterIds: ["Phoebe", "Lynae", "RoverSpectroFemale"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Phrolova S0R1 Hypercarry",
    description:
      "Off-field Maestro rotation with Aftersound at its 24-stack cap, average damage. No ER requirement on this board. Supports: Qiuyuan S0 (Emerald Sentence R1, Law of Harmony); Cantarella S0 (Midnight Veil, hands off). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Phrolova S0R1 Hypercarry",
      characterIds: ["Phrolova", "Qiuyuan", "Cantarella"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Phrolova S6R1 Hypercarry",
    description:
      "Adds the Phrolova sequence damage effects; excludes the manually over-ramped Octet +100% Crit DMG toggle. No ER requirement on this board. Supports: Qiuyuan S2 (Emerald Sentence R1, Law of Harmony); Cantarella S2 (Midnight Veil, hands off). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Phrolova S6R1 Hypercarry",
      characterIds: ["Phrolova", "Qiuyuan", "Cantarella"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Qingxiao S0R1 Hypercarry",
    description:
      "Tune Strain BiS team, average damage at 15 Mindlock. Carry ER target 120%. Supports: Denia S0 (Forged Dwarf Star R1, Reel of Spliced Memories, Voidwing Moth, Tune Strain stance, hands off); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Qingxiao S0R1 Hypercarry",
      characterIds: ["Qingxiao", "Denia", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Qingxiao S1R1 Hypercarry",
    description:
      "Same rotation with S1's +16% Crit Rate and combat entry at 25 Exorcising Seal, average damage. Carry ER target 120%. Supports: Denia S0 (Forged Dwarf Star R1, Reel of Spliced Memories, Voidwing Moth, Tune Strain stance, hands off); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Qingxiao S1R1 Hypercarry",
      characterIds: ["Qingxiao", "Denia", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Qingxiao S6R1 Hypercarry",
    description:
      "S6 Tune Strain rotation at 25 Mindlock, average damage. Carry ER target 120%. Supports: Denia S2 (Forged Dwarf Star R1, Reel of Spliced Memories, Voidwing Moth, Tune Strain stance, hands off); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Qingxiao S6R1 Hypercarry",
      characterIds: ["Qingxiao", "Denia", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Rebecca S0R1 Hypercarry",
    description:
      "Hack team, Guts into Huntress loop with the Forte Heavy, average damage. Carry ER target 118%. Supports: Lucy S0 (kit only, no team-facing gear); Mornye S0 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Rebecca S0R1 Hypercarry",
      characterIds: ["Rebecca", "Lucy", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Rebecca S6R1 Hypercarry",
    description:
      "Same rotation at S6 with the bonus Salvo instance, average damage. Carry ER target 118%. Supports: Lucy S2 (kit only, no team-facing gear); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Rebecca S6R1 Hypercarry",
      characterIds: ["Rebecca", "Lucy", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Shorekeeper S0R1 Heal",
    description:
      "Scored on healing, not damage: the full S0 sustain cycle of Chaos Theory, Discernment, and 8 End Loop ticks. Carry ER target 230%. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Shorekeeper S0R1 Heal",
      characterIds: ["Shorekeeper"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Shorekeeper S6R1 Nuke",
    description:
      "S6 Discernment in a fixed buff showcase: guaranteed crit, +42% multiplier, +500% Crit DMG. Carry ER target 230%. Supports: Lynae S2 (Spectrum Blaster R1, Pact of Neonlight Leap, Hyvatia); Mornye S2 (Starfield Calibrator R1, Halo of Starry Radiance, Reactor Husk). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Shorekeeper S6R1 Nuke",
      characterIds: ["Shorekeeper", "Lynae", "Mornye"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Sigrika S0R1 Hypercarry",
    description:
      "6 Blessing stacks at 60 Soliskin Vitality, average damage. Carry ER target 109%. Supports: Qiuyuan S0 (Emerald Sentence R1, Moonlit Clouds, Impermanence Heron); Ciaccona S0 (Woodland Aria R1, Gusts of Welkin, Nightmare: Kelpie). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Sigrika S0R1 Hypercarry",
      characterIds: ["Sigrika", "Qiuyuan", "Ciaccona"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Sigrika S6R1 Hypercarry",
    description:
      "S6 full sequence with 4 Innate Gift stacks, average damage. Carry ER target 109%. Supports: Qiuyuan S2 (Emerald Sentence R1, Moonlit Clouds, Impermanence Heron); Ciaccona S2 (Woodland Aria R1, Gusts of Welkin, Nightmare: Kelpie). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Sigrika S6R1 Hypercarry",
      characterIds: ["Sigrika", "Qiuyuan", "Ciaccona"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Suisui S0R1 Heal",
    description:
      "Scored on healing, not damage: the full S0 Floral Epistle window of Enrichment, 10 Spring's Birth ticks, and 3 Heaven's Roam interactions. Carry ER target 260%. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Suisui S0R1 Heal",
      characterIds: ["Suisui"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Suisui S6R1 Nuke",
    description:
      "S6 Tinkling Jade under Sky Over Water's +80% Crit Rate and +240% Glacio DMG. Carry ER target 260%. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Suisui S6R1 Nuke",
      characterIds: ["Suisui"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Verina S0R1 Heal",
    description:
      "Scored on healing, not damage: the full S0 sustain cycle of Arboreal Flourish, 2 Starflower heals, 12 Photosynthesis Mark heals, and 6 Outro ticks. Carry ER target 200%. Solo board, no supports. Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Verina S0R1 Heal",
      characterIds: ["Verina"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Yangyang: Xuanling S0R1 Hypercarry",
    description:
      "Suisui + Chisa quickswap loop: two Feather chains, no Heavy Azure, average damage. Carry ER target 113%. Supports: Suisui S0 (Firstlight's Herald R1, Song of Feathered Trace); Chisa S0 (Kumokiri R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Yangyang: Xuanling S0R1 Hypercarry",
      characterIds: ["YangyangXuanling", "Suisui", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Yangyang: Xuanling S6R1 Hypercarry",
    description:
      "Same loop plus S1 Unfaltering x2, S2 Strung Notes and S6 Still as Withered Wood x5, average damage. Carry ER target 113%. Supports: Suisui S2 (Firstlight's Herald R1, Song of Feathered Trace); Chisa S2 (Kumokiri R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Yangyang: Xuanling S6R1 Hypercarry",
      characterIds: ["YangyangXuanling", "Suisui", "Chisa"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Zani S0R1 Hypercarry",
    description:
      "Basic Quickswap, reference rotation 39's own team: Intro, Basic S3, Skill, Liberation, 3x (Daybreak, Dawning, Nightfall), Outro at 17 Heliacal Embers; the first two Nightfalls swap-cancel at Stage 2. Carry ER target 110%. Supports: Phoebe S0 (Luminous Hymn R1, Moonlit Clouds, Impermanence Heron, hands off); Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Zani S0R1 Hypercarry",
      characterIds: ["Zani", "Phoebe", "Shorekeeper"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Zani S2R1 Hypercarry",
    description:
      "Basic Quickswap, reference rotation 39's own team: Intro, Basic S3, Skill, Liberation, 3x (Daybreak, Dawning, Nightfall), Outro at 17 Heliacal Embers; the first two Nightfalls swap-cancel at Stage 2. Carry ER target 110%. Supports: Phoebe S0 (Luminous Hymn R1, Moonlit Clouds, Impermanence Heron, hands off); Shorekeeper S0 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Zani S2R1 Hypercarry",
      characterIds: ["Zani", "Phoebe", "Shorekeeper"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
  {
    name: "WuWaBuilds Zani S6R1 Hypercarry",
    description:
      "Same team and rotation; S3 Last Stand +1200% MV, S4 +20% team ATK, S5 Rekindle +120% MV, S6 Heavy Slashes +40% MV. Carry ER target 110%. Supports: Phoebe S2 (Luminous Hymn R1, Moonlit Clouds, Impermanence Heron, hands off); Shorekeeper S2 (Stellar Symphony R1, Rejuvenating Glow, Fallacy of No Return). Composition only, no rotation actions.",
    author: WUWABUILDS,
    data: {
      name: "WuWaBuilds Zani S6R1 Hypercarry",
      characterIds: ["Zani", "Phoebe", "Shorekeeper"],
      actions: [],
      duration: null,
      enemyConfig: wuwabuildsEnemyConfig,
    },
  },
];
