<template>
  <div class="flex gap-2" data-test-optimizer-result-stats>
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
          <td>ATK</td>
          <td
            class="text-right"
            v-tooltip="{
              content: atkTooltipContent,
              html: true,
            }">
            {{ displayInt(finalStats.totalAtk ?? 0) }}
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
            {{ displayInt(finalStats.totalHp ?? 0) }}
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
          <td>DEF</td>
          <td
            class="text-right"
            v-tooltip="{
              content: defTooltipContent,
              html: true,
            }">
            {{ displayInt(finalStats.totalDef ?? 0) }}
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
            {{ displayPercentage((finalStats.totalCritRate ?? 0) * 100) }}
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
            {{ displayPercentage((finalStats.totalCritDMG ?? 0) * 100) }}
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
            {{ displayPercentage((finalStats.energyRegen ?? 0) * 100) }}
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
            {{ displayPercentage(finalStats.basicAttackDMGBonus ?? 0) }}
          </td>
        </tr>
        <tr class="stat-heavy">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />
          </td>
          <td>Heavy Attack DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.heavyAttackDMGBonus ?? 0) }}
          </td>
        </tr>
        <tr class="stat-skill">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />
          </td>
          <td>Resonance Skill DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.resonanceSkillDMGBonus ?? 0) }}
          </td>
        </tr>
        <tr class="stat-liberation">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />
          </td>
          <td>Resonance Liberation DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.resonanceLiberationDMGBonus ?? 0) }}
          </td>
        </tr>
        <tr class="stat-glacio" v-if="characterElement === 'Glacio'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
              class="glacio--active" />
          </td>
          <td>Glacio DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.glacio ?? 0) }}</td>
        </tr>
        <tr class="stat-fusion" v-if="characterElement === 'Fusion'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
              class="fusion--active" />
          </td>
          <td>Fusion DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.fusion ?? 0) }}</td>
        </tr>
        <tr class="stat-electro" v-if="characterElement === 'Electro'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
              class="electro--active" />
          </td>
          <td>Electro DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.electro ?? 0) }}
          </td>
        </tr>
        <tr class="stat-aero" v-if="characterElement === 'Aero'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
              class="aero--active" />
          </td>
          <td>Aero DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.aero ?? 0) }}</td>
        </tr>
        <tr class="stat-spectro" v-if="characterElement === 'Spectro'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
              class="spectro--active" />
          </td>
          <td>Spectro DMG Bonus</td>
          <td class="text-right">
            {{ displayPercentage(finalStats.spectro ?? 0) }}
          </td>
        </tr>
        <tr class="stat-havoc" v-if="characterElement === 'Havoc'">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
              class="havoc--active" />
          </td>
          <td>Havoc DMG Bonus</td>
          <td class="text-right">{{ displayPercentage(finalStats.havoc ?? 0) }}</td>
        </tr>
        <tr class="stat-healing">
          <td>
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />
          </td>
          <td>Healing Bonus</td>
          <td class="text-right">
            {{ displayPercentage((finalStats.healingBonus ?? 0) * 100) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { displayPercentage, displayInt } from "../utils/numbers";

defineOptions({ name: "CalculatorOptimizerResultStats" });

const props = defineProps<{
  finalStats: Record<string, number> & { totalCritDMG?: number };
  characterElement: string;
  targetValue: string;
  totalAtk: number;
  totalHp: number;
  totalDef: number;
  totalCritRate: number;
  totalCritDmg: number;
  energyRegen: number;
}>();

const hpTooltipContent = computed(() => null);
const atkTooltipContent = computed(() => null);
const defTooltipContent = computed(() => null);

const atkDiffPercent = computed(() => {
  const diffNumber = (props.finalStats.totalAtk ?? 0) - props.totalAtk;
  return (diffNumber / props.totalAtk) * 100;
});
</script>
