import { OFF_FIELD, type FrameOverrides } from "./frames.js";

/**
 * Hand-picked frame matches for attacks the motion-value matcher can't place
 * (cli/lib/frames.ts). Keyed by character folder, then our attack key; the
 * value is the wuwalab ability name to take frames from, `OFF_FIELD` for a
 * proc that never takes field time of its own, or null to leave the attack
 * without frames on purpose.
 *
 * Add an entry when `import frames` lists an attack as unmatched or flags a
 * tied pick and you've confirmed on wuwalab which ability it is. Most entries
 * come from a full review of the list on 2026-10-29; ties where the matcher
 * already chose right are pinned so a wuwalab update can't flip them.
 */
export const frameOverrides: Record<string, FrameOverrides> = {
  Aemeath: {
    // Same frames and motion values as "Skill: Form Switch (Mech)"; ours is the basic attack.
    BasicAttackMechStage1DMG: "Basic: Mech 1",
    HeavyAttackMechChargedIDMG: null,
    MidAirAttackMechDMG: null,
    SequenceNode5VoyagetotheAstralShore: OFF_FIELD,
    // Damage that rides on other actions rather than being cast.
    SeraphicDuetBonusDMGPerInstance: OFF_FIELD,
  },
  Augusta: {
    InherentSkillGlorysFavor: OFF_FIELD,
    RulersRealm: OFF_FIELD,
    SequenceNode6EngravedinRadiantLight: "S6: Thunder Rage",
  },
  Baizhi: {
    DestinedPromiseHeavyAttackDMG: "Heavy: Destined Promise",
    InherentSkillStimulusFeedback: "Stimulus Feedback (Healing)",
    SequenceNode4EternalVerity: OFF_FIELD,
  },
  Brant: {
    DodgeCounterDMG: null,
    ReturnedfromAshesShield: OFF_FIELD,
    S6AlltheWorldsaCaptainsCarnevaleBlastDMG: "S6: All the World's a Captain's Carnevale",
    SequenceNode4ToFreedomISingHealing: "S4: To Freedom I Sing (Healing)",
    TotheHorizonHealing: OFF_FIELD,
    WavesofAcclaimsHealing: "Waves of Acclaims (Healing)",
  },
  Cantarella: {
    DiffusionDMG: OFF_FIELD,
    ShadowySweepDMG: null,
  },
  Carlotta: {
    MidairAttackDMG: "Basic: Silent Execution (Mid-Air)",
  },
  Cartethyia: {
    // Same motion values as "Avatar: Cartethyia (Mid-Air)", which has a cooldown; ours is the plain plunge.
    MidairAttackDMG: "Basic: Plunging Attack",
    Sequence5HopeReshapedinStormsShield: OFF_FIELD,
  },
  Chisa: {
    // Manual timing (76f); the auto version is slower (84f).
    DeathSnipAdditionalDMG: "Basic: Death Snip With Spread",
    EyeOfUnravelingRetractionDMG: null,
    SawringBlitzStage2DMG: "Forte: Sawring Blitz 2",
    SawringBlitzStage2HoldDMG: "Forte: Sawring Blitz 2 (Hold)",
    SawringEradicationShield: OFF_FIELD,
    SequenceNode1WanderingThroughtheDesolateCorridors: OFF_FIELD,
  },
  Ciaccona: {
    AimedShotDMG: null,
    FullyChargedAimedShotDMG: null,
    InherentSkillStimulusFeedback: OFF_FIELD,
  },
  Danjin: {
    CrimsonErosion1: OFF_FIELD,
    CrimsonErosion2: OFF_FIELD,
  },
  Denia: {
    DodgeCounterBreakdownFormDMG: null,
    ErosionFieldDMGPerTick: "Erosion Field",
  },
  Encore: {
    MidAirAttack: null,
  },
  Galbrena: {
    // wuwalab shows our flat 666 as 6.66.
    HellstrideDMG: "Dash: Hellstride",
    MidairAttackAshfallBarrageSustainedFireDMG: null,
    MidairAttackHellsentBarrageSustainedFireDMG: null,
  },
  Hiyuki: {
    ElementalEffectGlacioBite: OFF_FIELD,
    FrostedgeDMG: "Intro: Frostedge - Present Self",
    GlacioBiteDMG: OFF_FIELD,
    SequenceNode4LikeReedsonTides: OFF_FIELD,
  },
  Hsin: {
    HeartOfThunderDelayedDMG: OFF_FIELD,
    HeavyAttackAnsweringFormReignAtEaseDMG: null,
    SequenceNode3PillarsAcrossHeavenElectroFlareDMG: OFF_FIELD,
  },
  Iuno: {
    AbsoluteFullnessHealing: OFF_FIELD,
    ArcBeyondtheEdgeHealing: OFF_FIELD,
    FullMoonDomainHealing: OFF_FIELD,
    InherentSkillWaxingAscent: OFF_FIELD,
    MoonbowBasicAttack1Healing: OFF_FIELD,
    MoonbowBasicAttack2Healing: OFF_FIELD,
    MoonbowBasicAttack3Healing: OFF_FIELD,
    MoonbowDodgeCounterHealing: OFF_FIELD,
    SequenceNode4RainySeasonDwellinMyEyes: OFF_FIELD,
  },
  Jingran: {
    EarthCharmShield: OFF_FIELD,
    EarthCharmYinghuoShield: OFF_FIELD,
    ShadowStepDMG: "Dodge: Shadow Step",
  },
  Lingyang: {
    LionAwakensDMG: "Intro: Lion Awakens",
  },
  Lucilla: {
    CompensateDMG: "Skill Compensate",
    MidairAttackDMG: null,
    MidairAttackReminiscenceDMG: null,
    PhantomFrameDMG: null,
  },
  Lucy: {
    SequenceNode5ABrokenPathtoHell: OFF_FIELD,
  },
  LuukHerssen: {
    GroundDodgeCounterDMG: "Basic: Such is Light 2 (Dodge Counter)",
  },
  Lynae: {
    MidairAttackDMG: "Basic: Chroma Drift (Mid-Air)",
  },
  Mornye: {
    InherentSkillBoundedness: OFF_FIELD,
  },
  Mortefi: {
    ImpromptuShowAimedShotDMG: null,
    ImpromptuShowFullyChargedAimedShotDMG: null,
    SequenceNodeFuneraryQuartet: OFF_FIELD,
  },
  Phoebe: {
    ToWhereLightShinesDMG: "Skill: To Where Light Shines",
  },
  Phrolova: {
    BasicAttackHecateStage1DMG: "Basic: Hecate 1",
    BasicAttackHecateStage2DMG: "Basic: Hecate 2",
    EnhancedAttackHecateStringsDMG: "Basic: Hecate - Strings",
    Stage2DMG: "Basic: Movement of Life and Death 2",
  },
  Rebecca: {
    DodgeCounterGutsDMG: "Basic: Guts (Dodge Counter)",
    DodgeCounterHuntressDMG: "Basic: Huntress (Dodge Counter)",
    TacticalDodgeGutsSuccessfulDodgeDMG: "Tactical Dodge: Guts",
    TacticalDodgeHuntressSuccessfulDodgeDMG: "Tactical Dodge: Huntress",
  },
  Roccia: {
    HeavyAttackDMG: "Heavy: Pero, Easy (End Success)",
    RealFantasyStage1DMG: "Forte: Real Fantasy 1",
    RealFantasyStage2DMG: "Forte: Real Fantasy 2",
    // The unlabelled entry is the failed version here.
    RealFantasyStage3DMG: "Forte: Real Fantasy 3 (Success)",
    SequenceNode6WhentheGoldenWingsFlyDMG: "Forte: Reality Recreation",
  },
  RoverAeroFemale: {
    OmegaStormHealing: OFF_FIELD,
    SequenceNode2GlimmersFadeintotheDarkHeal1: OFF_FIELD,
  },
  RoverAeroMale: {
    OmegaStormHealing: OFF_FIELD,
    SequenceNode2GlimmersFadeintotheDarkHeal1: OFF_FIELD,
  },
  Roverelectrofemale: {
    BasicAttackStage3DMG: "Basic: Deterrence 3",
    MidAirAttackHavocStage1DMG: "Skill Havoc: Thrum of All Sounds 1 (Mid-Air)",
    MidAirAttackHavocStage2DMG: "Skill Havoc: Thrum of All Sounds 2 (Mid-Air)",
    MidAirAttackHavocStage3DMG: "Skill Havoc: Thrum of All Sounds 3 (Mid-Air)",
    OvershockDMG: "Skill 2: Overshock",
    RiposteStrikeCrumbleDMG: "Basic: Riposte Strike",
    ThrumOfAllSoundsAeroMidAirAttackHealing: OFF_FIELD,
    // Rides on the Spectro Thrum of All Sounds casts.
    ThunderBaneDMG: OFF_FIELD,
  },
  Roverelectromale: {
    BasicAttackStage3DMG: "Basic: Deterrence 3",
    MidAirAttackHavocStage1DMG: "Skill Havoc: Thrum of All Sounds 1 (Mid-Air)",
    MidAirAttackHavocStage2DMG: "Skill Havoc: Thrum of All Sounds 2 (Mid-Air)",
    MidAirAttackHavocStage3DMG: "Skill Havoc: Thrum of All Sounds 3 (Mid-Air)",
    OvershockDMG: "Skill 2: Overshock",
    RiposteStrikeCrumbleDMG: "Basic: Riposte Strike",
    ThrumOfAllSoundsAeroMidAirAttackHealing: OFF_FIELD,
    // Rides on the Spectro Thrum of All Sounds casts.
    ThunderBaneDMG: OFF_FIELD,
  },
  RoverSpectroFemale: {
    ResonatingWhirlDMG: null,
    SequenceNode4ResonatingLamella: OFF_FIELD,
    // Same motion values as Basic Attack 2; ours is the heavy follow-up.
    VibrationManifestationHeavyAttackResonanceDMG: "Heavy 2: Resonance",
  },
  RoverSpectroMale: {
    ResonatingWhirlDMG: null,
    SequenceNode4ResonatingLamella: OFF_FIELD,
    // Same motion values as Basic Attack 2; ours is the heavy follow-up.
    VibrationManifestationHeavyAttackResonanceDMG: "Heavy 2: Resonance",
  },
  Shorekeeper: {
    OriginCalculusDodgeCounterDMG: "Basic: Origin Calculus 2 (Dodge Counter)",
    OriginCalculusHeavyAttackDMG: null,
    SequenceNode2NightsGiftandRefusal: OFF_FIELD,
  },
  Sigrika: {
    SoliskintotheAidDMG: "Skill 3: Soliskin to the Aid",
  },
  Taoqi: {
    FortifiedDefenseHPRecovery: OFF_FIELD,
    TimedCountersPart1Shield: OFF_FIELD,
    TimedCountersPart2Shield: OFF_FIELD,
    TimedCountersPart3Shield: OFF_FIELD,
  },
  Verina: {
    // Fires while teammates act.
    ArborealFlourishCoordinatedAttackDMG: OFF_FIELD,
    InherentSkillGraceofLifeShield: OFF_FIELD,
  },
  YangyangXuanling: {
    WraithOfSoundDMG: null,
  },
  Zani: {
    PinpointStrikeDMG: null,
  },
  Zhezhi: {
    NormalAttackMidAirAttackDMG: "Basic: Dimming Brush 1 (Mid-Air)",
    SequenceNode6InfiniteLegacy: OFF_FIELD,
  },
};

/** The same, for echoes: keyed by echo key, then our action key. */
export const echoFrameOverrides: Record<string, FrameOverrides> = {
  SentryConstruct: {
    SentryConstructAttack: "Sentry Construct",
    SentryConstructUpgradedAttack: "Sentry Construct (Enhanced)",
  },
};
