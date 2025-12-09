export const addEchoBuffs = (source: any, target: any, returnCopy: boolean = false) => {
      // we make a clone to make sure we don't mutate the original
      // mostly used in the optimizer so we can have a constant base, and then layer on the echo buffs
      // without messing up the original state of stats
      if (returnCopy) {
        target = JSON.parse(JSON.stringify(target));
      }
      if (source) {
        target.attackPercent += source?.ATK ? source.ATK : 0;
        target.hpPercent += source?.HP ? source.HP : 0;
        target.defPercent += source?.DEF ? source.DEF : 0;
        target.attackFlat += source?.ATK_FLAT ?? 0;
        target.hpFlat += source?.HP_FLAT ?? 0;
        target.defFlat += source?.DEF_FLAT ?? 0;
        target.critRate += source?.CritRate ? source.CritRate : 0;
        target.critDMG += source?.CritDMG ? source.CritDMG : 0;
        target.energyRegen += source?.EnergyRegen
          ? source.EnergyRegen / 100
          : 0;
        target.healingBonus += source?.HealingBonus
          ? source.HealingBonus / 100
          : 0;
        target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
          ? source.BasicAttackDMGBonus
          : 0;
        target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
          ? source.HeavyAttackDMGBonus
          : 0;
        target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
          ? source.ResonanceSkillDMGBonus
          : 0;
        target.resonanceLiberationDMGBonus +=
          source?.ResonanceLiberationDMGBonus
            ? source.ResonanceLiberationDMGBonus
            : 0;
        target.echoDMGBonus += source?.EchoDMGBonus ? source.EchoDMGBonus : 0;
        target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
          ? source.OutroSkillDMGBonus
          : 0;
        target.glacio += source?.Glacio ? source.Glacio : 0;
        target.fusion += source?.Fusion ? source.Fusion : 0;
        target.electro += source?.Electro ? source.Electro : 0;
        target.aero += source?.Aero ? source.Aero : 0;
        target.spectro += source?.Spectro ? source.Spectro : 0;
        target.havoc += source?.Havoc ? source.Havoc : 0;
        target.defIgnore += source?.DEFIgnore ? source.DEFIgnor : 0;
        target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
          ? source.BonusSpecificSkillDMGBonus
          : 0;
        target.totalDeepenEffect += source?.TotalDeepenEffect
          ? source.TotalDeepenEffect
          : 0;
        target.resistReduction += source?.ResistReduction
          ? source.ResistReduction
          : 0;
        target.coordinatedDmgBonus += source?.CoordinatedDMGBonus
          ? source.CoordinatedDMGBonus
          : 0;
        target.dmgBonus += source?.DMGBonus ? source.DMGBonus : 0;

        if (source?.AllAttributeBonus) {
          const allAttributeBonus = source.AllAttributeBonus;
          target.basicAttackDMGBonus += allAttributeBonus;
          target.heavyAttackDMGBonus += allAttributeBonus;
          target.resonanceSkillDMGBonus += allAttributeBonus;
          target.resonanceLiberationDMGBonus += allAttributeBonus;
          target.introSkillDMGBonus += allAttributeBonus;
          target.outroSkillDMGBonus += allAttributeBonus;
        }
        if (source?.AllElementAttributeBonus) {
          const allElementAttributeBonus = source.AllElementAttributeBonus;
          target.glacio += allElementAttributeBonus;
          target.fusion += allElementAttributeBonus;
          target.electro += allElementAttributeBonus;
          target.aero += allElementAttributeBonus;
          target.spectro += allElementAttributeBonus;
          target.havoc += allElementAttributeBonus;
        }
      }
      if (returnCopy) {
        return target;
      }
    };

export const addBuffs = (source: any, target: any) => {
      if (source) {
        target.attackPercent += source?.ATK ? source.ATK * 100 : 0;
        target.hpPercent += source?.HP ? source.HP * 100 : 0;
        target.defPercent += source?.DEF ? source.DEF * 100 : 0;
        target.attackFlat += source?.ATK_FLAT ?? 0;
        target.hpFlat += source?.HP_FLAT ?? 0;
        target.defFlat += source?.DEF_FLAT ?? 0;
        target.critRate += source?.CritRate ? source.CritRate * 100 : 0;
        target.critDMG += source?.CritDMG ? source.CritDMG * 100 : 0;
        target.energyRegen += source?.EnergyRegen ? source.EnergyRegen : 0;
        target.healingBonus += source?.HealingBonus ? source.HealingBonus : 0;
        target.shieldBonus += source?.ShieldBonus ? source.ShieldBonus : 0;
        target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
          ? source.BasicAttackDMGBonus * 100
          : 0;
        target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
          ? source.HeavyAttackDMGBonus * 100
          : 0;
        target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
          ? source.ResonanceSkillDMGBonus * 100
          : 0;
        target.introSkillDMGBonus += source?.IntroSkillDMGBonus
          ? source.IntroSkillDMGBonus * 100
          : 0;
        target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
          ? source.OutroSkillDMGBonus * 100
          : 0;
        target.resonanceLiberationDMGBonus +=
          source?.ResonanceLiberationDMGBonus
            ? source.ResonanceLiberationDMGBonus * 100
            : 0;
        target.echoDMGBonus += source?.EchoDMGBonus
          ? source.EchoDMGBonus * 100
          : 0;
        target.glacio += source?.Glacio ? source.Glacio * 100 : 0;
        target.fusion += source?.Fusion ? source.Fusion * 100 : 0;
        target.electro += source?.Electro ? source.Electro * 100 : 0;
        target.aero += source?.Aero ? source.Aero * 100 : 0;
        target.spectro += source?.Spectro ? source.Spectro * 100 : 0;
        target.havoc += source?.Havoc ? source.Havoc * 100 : 0;
        target.defIgnore += source?.DEFIgnore ? source.DEFIgnore * 100 : 0;
        target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
          ? source.BonusSpecificSkillDMGBonus * 100
          : 0;
        target.totalDeepenEffect += source?.DMGDeepen ? source.DMGDeepen : 0;
        target.resistReduction += source?.ResistReduction
          ? source.ResistReduction * 100
          : 0;
      }
    };

export const getElementDmgBonusByType = (element: string, providedStats: any, stats: any): number => {
      let val = 0;
      switch (element) {
        case "Glacio":
          val = providedStats?.glacio ?? stats.Glacio;
          break;
        case "Fusion":
          val = providedStats?.fusion ?? stats.Fusion;
          break;
        case "Electro":
          val = providedStats?.electro ?? stats.Electro;
          break;
        case "Aero":
          val = providedStats?.aero ?? stats.Aero;
          break;
        case "Spectro":
          val = providedStats?.spectro ?? stats.Spectro;
          break;
        case "Havoc":
          val = providedStats?.havoc ?? stats.Havoc;
          break;
      }

      return val / 100;
    };

export const getDamageValByAttr = (attribute: string = "attack", providedStats: any, stats: any): number => {
      switch (attribute) {
        case "defense":
          return providedStats?.totalDef ?? stats.totalDef;
        case "hp":
          return providedStats?.totalHp ?? stats.totalHp;
        case "EnergyRegen":
          // we store the ER in decimal form, but for calculating damages based on ER
          // it uses the full amount (1.5 => 150%)
          const decimalEnergy = providedStats?.energyRegen ?? stats.energyRegen;
          const intEnergy = decimalEnergy * 100;
          return intEnergy;
        case "attack":
        default:
          return providedStats?.totalAtk ?? stats.totalAtk;
      }
    };

export const getDamageTypeBonusByType = (type: string, providedStats: any, stats: any) => {
      let val = 0;
      switch (type) {
        case "Basic":
          val = providedStats?.basicAttackDMGBonus ?? stats.BasicAttackDMGBonus;
          break;
        case "Heavy":
          val = providedStats?.heavyAttackDMGBonus ?? stats.HeavyAttackDMGBonus;
          break;
        case "Skill":
          val =
            providedStats?.resonanceSkillDMGBonus ??
            stats.ResonanceSkillDMGBonus;
          break;
        case "Intro":
          val = providedStats?.introSkillDMGBonus ?? stats.IntroSkillDMGBonus;
          break;
        case "Outro":
          val = providedStats?.outroSkillDMGBonus ?? stats.OutroSkillDMGBonus;
          break;
        case "Liberation":
          val =
            providedStats?.resonanceLiberationDMGBonus ??
            stats.ResonanceLiberationDMGBonus;
          break;
        case "Echo":
          val = providedStats?.echoDmgBonus ?? stats.EchoDMGBonus;
          break;
        // do not divide this by 100
        case "Healing":
          return providedStats?.healingBonus ?? stats.healingBonus;
        case "Shield":
          return providedStats?.shieldBonus ?? stats.shieldBonus;
      }

      return val / 100;
    };