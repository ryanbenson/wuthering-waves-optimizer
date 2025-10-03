<template>
  <div class="flex gap-2">
    <table class="calculator__stats table table-xs table-zebra">
      <tbody>
        <tr
          class="stat-atk"
          :class="{
            'border border-primary': targetValue === 'totalAtk',
          }">
          <td class="w-10">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
          </td>
          <td>Attack</td>
          <td
            class="text-right"
            v-tooltip="{
              content: atkTooltipContent,
              html: true,
            }">
            {{ displayInt(finalStats.totalAtk) }}
            <template v-if="targetValue === 'totalAtk'">
              <span
                :class="{
                  'text-success': atkDiffPercent >= 0,
                  'text-error': atkDiffPercent < 0,
                }">
                ({{ atkDiffPercent >= 0 ? "+" : ""
                }}{{ displayPercentage(atkDiffPercent) }})
              </span>
            </template>
          </td>
        </tr>
        <tr
          class="stat-hp"
          :class="{
            'border border-primary': targetValue === 'totalHp',
          }">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
          </td>
          <td>HP</td>
          <td
            class="text-right"
            v-tooltip="{
              content: hpTooltipContent,
              html: true,
            }">
            {{ displayInt(finalStats.totalHp) }}
            <template v-if="targetValue === 'totalHp'">
              <span
                :class="{
                  'text-success': atkDiffPercent >= 0,
                  'text-error': atkDiffPercent < 0,
                }">
                ({{ atkDiffPercent >= 0 ? "+" : ""
                }}{{ displayPercentage(atkDiffPercent) }})
              </span>
            </template>
          </td>
        </tr>
        <tr
          class="stat-def"
          :class="{
            'border border-primary': targetValue === 'totalDef',
          }">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
          </td>
          <td>Defense</td>
          <td
            class="text-right"
            v-tooltip="{
              content: defTooltipContent,
              html: true,
            }">
            {{ displayInt(finalStats.totalDef) }}
            <template v-if="targetValue === 'totalDef'">
              <span
                :class="{
                  'text-success': atkDiffPercent >= 0,
                  'text-error': atkDiffPercent < 0,
                }">
                ({{ atkDiffPercent >= 0 ? "+" : ""
                }}{{ displayPercentage(atkDiffPercent) }})
              </span>
            </template>
          </td>
        </tr>
        <tr
          class="stat-cr"
          :class="{
            'border border-primary': targetValue === 'totalCritRate',
          }">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />
          </td>
          <td>Crit Rate</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.totalCritRate * 100) }}
            <template v-if="targetValue === 'totalCritRate'">
              <span
                :class="{
                  'text-success': atkDiffPercent >= 0,
                  'text-error': atkDiffPercent < 0,
                }">
                ({{ atkDiffPercent >= 0 ? "+" : ""
                }}{{ displayPercentage(atkDiffPercent) }})
              </span>
            </template>
          </td>
        </tr>
        <tr
          class="stat-cd"
          :class="{
            'border border-primary': targetValue === 'totalCritDMG',
          }">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />
          </td>
          <td>Crit DMG</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.totalCritDMG * 100) }}
            <template v-if="targetValue === 'totalCritDMG'">
              <span
                :class="{
                  'text-success': atkDiffPercent >= 0,
                  'text-error': atkDiffPercent < 0,
                }">
                ({{ atkDiffPercent >= 0 ? "+" : ""
                }}{{ displayPercentage(atkDiffPercent) }})
              </span>
            </template>
          </td>
        </tr>
        <tr
          class="stat-er"
          :class="{
            'border border-primary': targetValue === 'energyRegen',
          }">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />
          </td>
          <td>Energy Regen</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.energyRegen * 100) }}
            <template v-if="targetValue === 'energyRegen'">
              <span
                :class="{
                  'text-success': atkDiffPercent >= 0,
                  'text-error': atkDiffPercent < 0,
                }">
                ({{ atkDiffPercent >= 0 ? "+" : ""
                }}{{ displayPercentage(atkDiffPercent) }})
              </span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="calculator__stats table table-xs table-zebra">
      <tbody>
        <tr class="stat-basic">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />
          </td>
          <td>Basic Attack DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.basicAttackDMGBonus) }}
          </td>
        </tr>
        <tr class="stat-heavy">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />
          </td>
          <td>Heavy Attack DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.heavyAttackDMGBonus) }}
          </td>
        </tr>
        <tr class="stat-skill">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />
          </td>
          <td>Resonance Skill DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.resonanceSkillDMGBonus) }}
          </td>
        </tr>
        <tr class="stat-liberation">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />
          </td>
          <td>Resonance Liberation DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.resonanceLiberationDMGBonus) }}
          </td>
        </tr>
        <tr class="stat-glacio" v-if="characterElement === 'Glacio'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
              class="glacio--active" />
          </td>
          <td>Glacio DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.glacio) }}</td>
        </tr>
        <tr class="stat-fusion" v-if="characterElement === 'Fusion'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
              class="fusion--active" />
          </td>
          <td>Fusion DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.fusion) }}</td>
        </tr>
        <tr class="stat-electro" v-if="characterElement === 'Electro'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
              class="electro--active" />
          </td>
          <td>Electro DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.electro) }}
          </td>
        </tr>
        <tr class="stat-aero" v-if="characterElement === 'Aero'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
              class="aero--active" />
          </td>
          <td>Aero DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.aero) }}</td>
        </tr>
        <tr class="stat-spectro" v-if="characterElement === 'Spectro'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
              class="spectro--active" />
          </td>
          <td>Spectro DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.spectro) }}
          </td>
        </tr>
        <tr class="stat-havoc" v-if="characterElement === 'Havoc'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
              class="havoc--active" />
          </td>
          <td>Havoc DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.havoc) }}</td>
        </tr>
        <tr class="stat-healing">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />
          </td>
          <td>Healing Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.healingBonus * 100) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { displayPercentage, displayInt } from "../utils/numbers";
export default {
  name: "CalculatorOptimizerResultStats",
  props: {
    finalStats: {
      type: Object,
      required: true,
    },
    characterElement: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      required: true,
    },
    targetValue: {
      type: String,
      required: true,
    },
    totalAtk: {
      type: Number,
      required: true,
    },
    totalHp: {
      type: Number,
      required: true,
    },
    totalDef: {
      type: Number,
      required: true,
    },
    totalCritRate: {
      type: Number,
      required: true,
    },
    totalCritDMG: {
      type: Number,
      required: true,
    },
    energyRegen: {
      type: Number,
      required: true,
    },
  },
  methods: {
    displayInt,
    displayPercentage,
  },
  computed: {
    hpTooltipContent() {
      return null;
    },
    atkTooltipContent() {
      return null;
    },
    defTooltipContent() {
      return null;
    },
    hpDiffPercent() {
      const diffNumber = this.finalStats.totalHp - this.totalHp;
      return (diffNumber / this.totalHp) * 100;
    },
    defDiffPercent() {
      const diffNumber = this.finalStats.totalDef - this.totalDef;
      return (diffNumber / this.totalDef) * 100;
    },
    atkDiffPercent() {
      const diffNumber = this.finalStats.totalAtk - this.totalAtk;
      return (diffNumber / this.totalAtk) * 100;
    },
    critRateDiffPercent() {
      const diffNumber = this.finalStats.totalCritRate - this.totalCritRate;
      return (diffNumber / this.totalCritRate) * 100;
    },
    critDmgDiffPercent() {
      const diffNumber = this.finalStats.totalCritDMG - this.totalCritDMG;
      return (diffNumber / this.totalCritDMG) * 100;
    },
    energyRegenDiffPercent() {
      const diffNumber = this.finalStats.energyRegen - this.energyRegen;
      return (diffNumber / this.energyRegen) * 100;
    },
    // TODO: Implement, but need to collect base and weapon info
    // hpTooltipContent() {
    //     console.log(this.context.finalStats)
    //   return `<span class="Highlight">${this.context.finalStats.baseHp}</span> * (1 + <span class="Highlight">${this.context.finalStats.totalHpPercent}%</span>) + <span class="Highlight">${this.context.finalStats.totalHpFlat}</span>`;
    // },
    // atkTooltipContent() {
    //   return `(<span class="Highlight">${this.context.finalStats.baseAtk}</span> + <span class="Highlight">${this.context.finalStats.weaponAtk}</span>) * (1 + <span class="Highlight">${this.totalAtkPercent}%</span>) + <span class="Highlight">${this.context.finalStats.totalAtkFlat}</span>`;
    // },
    // defTooltipContent() {
    //   return `<span class="Highlight">${this.context.finalStats.baseDef}</span> * (1 + <span class="Highlight">${this.context.finalStats.totalDefPercent}%</span>) + <span class="Highlight">${this.context.finalStats.totalDefFlat}</span>`;
    // },
  },
};
</script>
