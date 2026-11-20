/**
 * Typical team buffs per support (issue #663 PR 2, ADR 0059): what
 * "Use team" turns on for a teammate when "Also turn on their buffs" is on.
 *
 * Hand-written and reviewed, never derived: a character's buff list mixes
 * alternative versions (Roccia's S2, Lupa's Pack Hunt), buffs for other
 * characters (Shorekeeper's Rover-only ER) and attacks that aren't buffs
 * (Roccia's Magic Box), so turning everything on would count things twice.
 *
 * Each entry is a key from that teammate's own buffs (`buffsByCharacter`),
 * their signature weapon's team buff (`allWeaponTeamBuffs`, marked
 * `signature`) or an echo buff (`allEchoBuffs`, their usual set or main echo).
 * - Sequence: a `SequenceNodeN…` key needs SN or higher (read from the key).
 * - `stacks`: optional; otherwise the buff's realistic max stacks.
 * - `fullTeamElement`: only when all three Resonators have this element.
 * Base stat values for `inputBase` buffs come from `realisticBaseAttrValue`.
 * An empty list means "no team buffs on purpose"; a missing entry means not
 * filled in yet. Either way Use team turns nothing on for them.
 *
 * Fill this in with `npm run cli -- edit team-data` (issue #732), which
 * rewrites the object below sorted by character. Hand edits are fine too.
 */
import type { ElementName } from "./teamBuffs";

export type TeamBuffDefault = {
  key: string;
  signature?: boolean;
  stacks?: number;
  fullTeamElement?: ElementName;
};

export const TEAM_BUFF_DEFAULTS: Record<string, TeamBuffDefault[]> = {
  Augusta: [{ key: "OutroSkillBattlesongoftheUnyielding" }, { key: "SequenceNode4AscentinSunandGlory" }],
  Brant: [{ key: "OutroSkillAttentiveHeart" }],
  Calcharo: [{ key: "SequenceNode4DarkAlliance" }],
  Changli: [{ key: "OutroSkillStrategyofDuality" }, { key: "SequenceNode4PolishedWords" }],
  Denia: [
    { key: "InherentSkillEtchedColorsFusionBurst" },
    { key: "OutroSkillUnfinishedLiesFusionBurst" },
    { key: "SequenceNode2TossedintheTidesofRealityFusionBurst" },
    { key: "ForgedDwarfStarATKBonus", signature: true },
    { key: "ReminiscenceDenia" },
  ],
  Iuno: [
    { key: "OutroSkillFromGloomtoGleam" },
    { key: "BlessingoftheWanLight" },
    { key: "SequenceNode2DayorNightLetThisBeEternal" },
  ],
  Lupa: [
    { key: "PackHunt" },
    { key: "PackHuntFusionTeam", fullTeamElement: "Fusion" },
    { key: "PackHuntFusionEnhanced" },
    { key: "InherentSkillApplauseofVictory" },
    { key: "InherentSkillApplauseofVictoryFullFusionTeam", fullTeamElement: "Fusion" },
    { key: "OutroSkillStandbyMeWarrior" },
    { key: "SequenceNode2EveryGroundHerHuntingField" },
    { key: "SequenceNode3WolflameHowlsinHerWake" },
    { key: "WildfireMarkDMGBonus", signature: true },
    { key: "FlamingClawprint" },
  ],
  Lynae: [
    { key: "TuneBreakBoost" },
    { key: "LetsHittheRoad" },
    { key: "PrismaticOverblast" },
    { key: "SequenceNode2IntoLightsVanishingPoint" },
    { key: "SpectrumBlasterAllDMG", signature: true },
    { key: "Hyvatia" },
    { key: "PactofNeonlightLeap" },
  ],
  Mornye: [
    { key: "InterferedMarker" },
    { key: "HighSyntonyField" },
    { key: "Recursion" },
    { key: "SequenceNode2MorningStarofEntropy" },
    { key: "StarfieldCalibratorCritDMG", signature: true },
    { key: "HaloofStarryRadiance" },
  ],
  Roccia: [
    { key: "CommediaImprovvisoATK" },
    { key: "OutroSkillApplausePlease" },
    { key: "SequenceNode2WhentheLuceaniteGleamsHavoc" },
    { key: "SequenceNode2WhentheLuceaniteGleamsHavocMaxed" },
    { key: "MidnightVeil" },
  ],
  Sanhua: [{ key: "Silversnow" }, { key: "SequenceNode6DaybreakRadiance" }, { key: "MoonlitClouds" }],
  Shorekeeper: [
    { key: "SophisticatedStellarealmCritRate" },
    { key: "ReleasedStellarealmCritDMG" },
    { key: "OutroSkillBinaryButterfly" },
    { key: "InherentSkillSelfGravitation" },
    { key: "SequenceNode2NightsGiftandRefusal" },
    { key: "StellarSymphonyATK", signature: true },
    { key: "RejuvenatingGlow" },
  ],
  Verina: [
    { key: "InherentSkillGiftofNature" },
    { key: "OutroSkillBlossom" },
    { key: "SequenceNode4BlossomingEmbrace" },
    { key: "RejuvenatingGlow" },
  ],
  Yinlin: [
    { key: "Strategist" },
    { key: "SequenceNode4SteadfastConviction" },
    { key: "ImpermanenceHeron" },
    { key: "MoonlitClouds" },
  ],
  Yuanwu: [{ key: "SequenceNode6DefenderofAllRealms" }, { key: "MoonlitClouds" }],
  Zhezhi: [
    { key: "OutroSkillWhitening" },
    { key: "SequenceNode4HuesSpectrum" },
    { key: "MoonlitClouds" },
    { key: "ImpermanenceHeron" },
  ],
};
