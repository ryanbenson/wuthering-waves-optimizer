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
 * A teammate with no entry gets no buffs turned on.
 */
import type { ElementName } from "./teamBuffs";

export type TeamBuffDefault = {
  key: string;
  signature?: boolean;
  stacks?: number;
  fullTeamElement?: ElementName;
};

export const TEAM_BUFF_DEFAULTS: Record<string, TeamBuffDefault[]> = {
  Brant: [{ key: "OutroSkillAttentiveHeart" }],
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
  Yuanwu: [{ key: "SequenceNode6DefenderofAllRealms" }, { key: "MoonlitClouds" }],
  Zhezhi: [
    { key: "OutroSkillWhitening" },
    { key: "SequenceNode4HuesSpectrum" },
    { key: "MoonlitClouds" },
    { key: "ImpermanenceHeron" },
  ],
};
