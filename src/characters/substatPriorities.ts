import type { SubstatWeights } from "../echoes/rating";

/**
 * Default substat priorities per character, sourced from Tacet Lab's
 * community-maintained, DPR-calc-derived dataset:
 * https://github.com/DJ12421/Tacet-Lab/blob/main/src/game-data/character-substat-preferences.ts
 * (GPL-3.0, same license as this project). Reproduced here on the same 0-4 /
 * 0.5-step weight scale, remapped from that project's stat keys and display
 * names onto this repo's `subStats` keys and `src/characters/<Key>` folder
 * names (its single "Rover: <Element>" entries are applied to both this
 * repo's male/female folders for that element).
 *
 * Note: "Healing Bonus" is an echo *main* stat only — it's not in the
 * `subStats` list in `src/echoes/stats.ts` and can never appear as a rolled
 * substat, so it has no place in a substat weight profile even for healers.
 *
 * Characters the source left unpopulated (no usable DPR-calc graph yet —
 * e.g. most healers/shielders, plus a few others) are omitted here too
 * rather than guessed, as are characters added to this repo since the
 * source was last synced (e.g. Jingran, Qingxiao). All omitted characters
 * fall back to the neutral DEFAULT_SUBSTAT_WEIGHTS profile (see
 * `src/echoes/rating.ts`) until a user customizes it themselves.
 */
export const characterSubstatPriorities: Record<string, SubstatWeights> = {
  Aalto: { CritRate: 4, CritDMG: 4, EnergyRegen: 2, ATK: 2, ATK_FLAT: 1 },
  Aemeath: { CritRate: 4, CritDMG: 4, ATK: 2, ResonanceLiberationDMGBonus: 1.5, ATK_FLAT: 1 },
  Augusta: { CritRate: 3.5, CritDMG: 4, ATK: 1.5, HeavyAttackDMGBonus: 1.5, ATK_FLAT: 0.5 },
  Brant: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, BasicAttackDMGBonus: 3, ATK: 2, ATK_FLAT: 1 },
  Buling: { CritRate: 3, CritDMG: 4, ATK: 2.5, ResonanceSkillDMGBonus: 0.5, ResonanceLiberationDMGBonus: 2, BasicAttackDMGBonus: 1, ATK_FLAT: 1.5 },
  Calcharo: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, ResonanceLiberationDMGBonus: 3, ATK_FLAT: 1 },
  Camellya: { CritRate: 3, CritDMG: 4, ATK: 2, BasicAttackDMGBonus: 1, ATK_FLAT: 1 },
  Cantarella: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, BasicAttackDMGBonus: 3, ATK_FLAT: 1 },
  Carlotta: { CritRate: 4, CritDMG: 2.5, ATK: 2, ResonanceSkillDMGBonus: 1.5, ATK_FLAT: 1 },
  Cartethyia: { CritRate: 4, CritDMG: 1, HP: 2, BasicAttackDMGBonus: 1.5, ResonanceSkillDMGBonus: 0.5, ResonanceLiberationDMGBonus: 0.5, HP_FLAT: 0.5 },
  Changli: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, ResonanceSkillDMGBonus: 3, ATK_FLAT: 1 },
  Chisa: { CritRate: 4, CritDMG: 4, ATK: 2.5, ResonanceLiberationDMGBonus: 2, ATK_FLAT: 1.5 },
  Ciaccona: { CritRate: 4, CritDMG: 2.5, ATK: 2.5, BasicAttackDMGBonus: 0.5, HeavyAttackDMGBonus: 0.5, ResonanceLiberationDMGBonus: 1, ATK_FLAT: 1.5 },
  Danjin: { CritRate: 4, CritDMG: 4, EnergyRegen: 2, ATK: 2, ATK_FLAT: 1 },
  Denia: { CritRate: 4, CritDMG: 4, ATK: 2, ResonanceLiberationDMGBonus: 2, ATK_FLAT: 1 },
  Encore: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, BasicAttackDMGBonus: 3, ATK_FLAT: 1 },
  Galbrena: { CritRate: 4, CritDMG: 3.5, ATK: 1.5, HeavyAttackDMGBonus: 1, ATK_FLAT: 1 },
  Hiyuki: { CritRate: 3.5, CritDMG: 4, ATK: 2, ResonanceLiberationDMGBonus: 1.5, ATK_FLAT: 1 },
  Iuno: { CritRate: 3.5, CritDMG: 4, ATK: 2, ResonanceLiberationDMGBonus: 2, ATK_FLAT: 1 },
  Jianxin: { CritRate: 4, CritDMG: 4, ATK: 2, EnergyRegen: 2, ResonanceLiberationDMGBonus: 3, ATK_FLAT: 1 },
  Jinhsi: { CritRate: 4, CritDMG: 2.5, ATK: 2, ResonanceSkillDMGBonus: 1.5, ResonanceLiberationDMGBonus: 0.5, ATK_FLAT: 1 },
  Jiyan: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, HeavyAttackDMGBonus: 3, ATK_FLAT: 1 },
  Lucilla: { CritRate: 3.5, CritDMG: 4, ATK: 2, BasicAttackDMGBonus: 1.5, ResonanceSkillDMGBonus: 0.5, ATK_FLAT: 1 },
  Lucy: { CritRate: 4, CritDMG: 3.5, ATK: 1.5, HeavyAttackDMGBonus: 1.5, ATK_FLAT: 1 },
  Lupa: { CritRate: 4, CritDMG: 3, ATK: 2, ResonanceLiberationDMGBonus: 1.5, ATK_FLAT: 1 },
  LuukHerssen: { CritRate: 4, CritDMG: 3.5, ATK: 2, BasicAttackDMGBonus: 1.5, ATK_FLAT: 1 },
  Lynae: { CritRate: 4, CritDMG: 4, ATK: 2, BasicAttackDMGBonus: 1.5, ResonanceLiberationDMGBonus: 0.5, ATK_FLAT: 1 },
  Mornye: { CritRate: 2, CritDMG: 4, EnergyRegen: 3.5, ATK: 1.5, DEF: 3, BasicAttackDMGBonus: 0.5, HeavyAttackDMGBonus: 0.5, ResonanceLiberationDMGBonus: 4, ATK_FLAT: 1, DEF_FLAT: 1 },
  Mortefi: { CritRate: 4, CritDMG: 4, EnergyRegen: 2, ATK: 2, ResonanceLiberationDMGBonus: 3, ATK_FLAT: 1 },
  Phoebe: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, HeavyAttackDMGBonus: 3, ATK_FLAT: 1 },
  Phrolova: { CritRate: 4, CritDMG: 4, ATK: 2, ResonanceSkillDMGBonus: 1, ATK_FLAT: 1 },
  Qiuyuan: { CritRate: 3.5, CritDMG: 4, ATK: 2, HeavyAttackDMGBonus: 1, ATK_FLAT: 1 },
  Qingxiao: { CritRate: 4, CritDMG: 4, ATK: 2, HeavyAttackDMGBonus: 1, ATK_FLAT: 1 },
  Rebecca: { CritRate: 4, CritDMG: 3, ATK: 1.5, BasicAttackDMGBonus: 1.5, ATK_FLAT: 1 },
  Roccia: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, HeavyAttackDMGBonus: 3, ATK_FLAT: 1 },
  RoverAeroFemale: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, ResonanceSkillDMGBonus: 3, ATK_FLAT: 1 },
  RoverAeroMale: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, ResonanceSkillDMGBonus: 3, ATK_FLAT: 1 },
  RoverHavocFemale: { CritRate: 4, CritDMG: 4, EnergyRegen: 2, ATK: 2, ATK_FLAT: 1 },
  RoverHavocMale: { CritRate: 4, CritDMG: 4, EnergyRegen: 2, ATK: 2, ATK_FLAT: 1 },
  RoverSpectroFemale: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ResonanceSkillDMGBonus: 3, ATK: 2, ATK_FLAT: 1 },
  RoverSpectroMale: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ResonanceSkillDMGBonus: 3, ATK: 2, ATK_FLAT: 1 },
  Sanhua: { CritRate: 4, CritDMG: 4, ATK: 2, EnergyRegen: 2, ResonanceLiberationDMGBonus: 3, ATK_FLAT: 1 },
  Shorekeeper: { EnergyRegen: 2, HP: 2, CritDMG: 4, ResonanceLiberationDMGBonus: 3, HP_FLAT: 1 },
  Sigrika: { CritRate: 4, CritDMG: 3.5, EnergyRegen: 1.5, ATK: 2, ATK_FLAT: 1 },
  Suisui: { CritRate: 2.5, CritDMG: 4, ATK: 1, HP: 2, BasicAttackDMGBonus: 2, ResonanceSkillDMGBonus: 0.5, ATK_FLAT: 1, HP_FLAT: 0.5 },
  Verina: { EnergyRegen: 2, ATK: 2, ATK_FLAT: 1 },
  XiangliYao: { CritRate: 3, CritDMG: 4, ATK: 2, ResonanceSkillDMGBonus: 0.5, ResonanceLiberationDMGBonus: 1, ATK_FLAT: 1 },
  YangyangXuanling: { CritRate: 4, CritDMG: 3, ATK: 2, HeavyAttackDMGBonus: 2, ATK_FLAT: 1 },
  Yinlin: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, ResonanceSkillDMGBonus: 3, ATK_FLAT: 1 },
  Zani: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, HeavyAttackDMGBonus: 3, ATK_FLAT: 1 },
  Zhezhi: { EnergyRegen: 2, CritRate: 4, CritDMG: 4, ATK: 2, BasicAttackDMGBonus: 3, ATK_FLAT: 1 },
};

export function getCuratedSubstatWeights(
  characterId: string,
): SubstatWeights | undefined {
  return characterSubstatPriorities[characterId];
}
