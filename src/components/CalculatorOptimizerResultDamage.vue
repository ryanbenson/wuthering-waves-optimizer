<template>
  <table class="calculator__stats table table table-zebra">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th>Normal</th>
        <th>Average</th>
        <th>Crit</th>
      </tr>
    </thead>
    <tbody>
      <tr
        :class="[
          {
            'calculation__damage__item--healing': attackInfo.type === 'Healing',
            'calculation__damage__item--shield': attackInfo.type === 'Shield',
            'opacity-50': attackInfo.isEnabled && !attackInfo.originalIsEnabled,
          },
        ]">
        <template v-if="attackInfo.type === 'Healing'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculation,
              html: true,
            }">
            {{ displayDamage(attackInfo.damage.healAmount) }}
            <span
              :class="{
                'text-success': healingDiffPercentage >= 0,
                'text-error': healingDiffPercentage < 0,
              }">
              ({{ healingDiffPercentage >= 0 ? "+" : ""
              }}{{ displayPercentage(healingDiffPercentage) }})
            </span>
          </td>
        </template>
        <template v-else-if="attackInfo.type === 'Shield'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculation,
              html: true,
            }">
            {{ displayDamage(attackInfo.damage.shieldAmount) }}
            <span
              :class="{
                'text-success': shieldDiffPercentage >= 0,
                'text-error': shieldDiffPercentage < 0,
              }">
              ({{ shieldDiffPercentage >= 0 ? "+" : ""
              }}{{ displayPercentage(shieldDiffPercentage) }})
            </span>
          </td>
        </template>
        <template v-else-if="attackInfo.type === 'ElementalEffect'">
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: displayDamage(attackInfo.damage),
              html: true,
            }">
            {{ displayDamage(attackInfo.damage) }}
            <span
              :class="{
                'text-success': elementalEffectDiffPercentage >= 0,
                'text-error': elementalEffectDiffPercentage < 0,
              }">
              ({{ elementalEffectDiffPercentage >= 0 ? "+" : ""
              }}{{ displayPercentage(elementalEffectDiffPercentage) }})
            </span>
          </td>
        </template>
        <template v-else>
          <td>{{ attackLabel }}</td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculation,
              html: true,
            }">
            <template v-if="!alwaysCrit">
              {{ displayDamage(attackInfo.damage.totalDamage) }}
              <span
                :class="{
                  'text-success': normalDiffPercentage >= 0,
                  'text-error': normalDiffPercentage < 0,
                }">
                ({{ normalDiffPercentage >= 0 ? "+" : ""
                }}{{ displayPercentage(normalDiffPercentage) }})
              </span>
            </template>
          </td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculationAvg,
              html: true,
            }">
            <template v-if="!alwaysCrit">
              {{ displayDamage(attackInfo.damage.avgDamage) }}
              <span
                :class="{
                  'text-success': avgDiffPercentage >= 0,
                  'text-error': avgDiffPercentage < 0,
                }">
                ({{ avgDiffPercentage >= 0 ? "+" : ""
                }}{{ displayPercentage(avgDiffPercentage) }})
              </span>
            </template>
          </td>
          <td
            v-tooltip="{
              content: attackInfo.damage.detailedCalculationCrit,
              html: true,
            }">
            {{ displayDamage(attackInfo.damage.critDamage) }}
            <span
              :class="{
                'text-success': critDiffPercentage >= 0,
                'text-error': critDiffPercentage < 0,
              }">
              ({{ critDiffPercentage >= 0 ? "+" : ""
              }}{{ displayPercentage(critDiffPercentage) }})
            </span>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { displayDamage, displayPercentage } from "../utils/numbers";
export default {
  name: "CalculatorOptimizerResultDamage",
  props: {
    attackInfo: {
      type: Object,
      required: true,
    },
    attackLabel: {
      type: String,
      default: null,
    },
    targetType: {
      type: String,
      required: true,
    },
    targetValue: {
      type: String,
      required: true,
    },
    allDamages: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    displayDamage,
    displayPercentage,
  },
  computed: {
    normalDiffPercentage() {
      if (!this.matchedDamageFromAllDamages) return 0;
      const baseDamage = this.matchedDamageFromAllDamages.damage.totalDamage;
      const newDamage = this.attackInfo.damage.totalDamage;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    avgDiffPercentage() {
      if (!this.matchedDamageFromAllDamages) return 0;
      const baseDamage = this.matchedDamageFromAllDamages.damage.avgDamage;
      const newDamage = this.attackInfo.damage.avgDamage;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    critDiffPercentage() {
      if (!this.matchedDamageFromAllDamages) return 0;
      const baseDamage = this.matchedDamageFromAllDamages.damage.critDamage;
      const newDamage = this.attackInfo.damage.critDamage;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    healingDiffPercentage() {
      if (!this.matchedDamageFromAllDamages) return 0;
      const baseHeal = this.matchedDamageFromAllDamages.damage.healAmount;
      const newHeal = this.attackInfo.damage.healAmount;
      return ((newHeal - baseHeal) / baseHeal) * 100;
    },
    shieldDiffPercentage() {
      if (!this.matchedDamageFromAllDamages) return 0;
      const baseShield = this.matchedDamageFromAllDamages.damage.shieldAmount;
      const newShield = this.attackInfo.damage.shieldAmount;
      return ((newShield - baseShield) / baseShield) * 100;
    },
    elementalEffectDiffPercentage() {
      if (!this.matchedDamageFromAllDamages) return 0;
      const baseDamage = this.matchedDamageFromAllDamages.damage;
      const newDamage = this.attackInfo.damage;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    matchedDamageFromAllDamages() {
      const loadoutAttackKey = this.attackInfo.key;
      const foundAttack = this.forteTypeAttacksListFromAllAttacks.find(
        (attack) => {
          return attack.key === loadoutAttackKey;
        },
      );
      return foundAttack;
    },
    forteTypeOfAttackChosen() {
      if (!this.targetValue) return null;
      const [type, unusedSkillKey] = this.targetValue.split("|");
      return type;
    },
    forteTypeAttacksListFromAllAttacks() {
      return this.allDamages?.value?.[this.forteTypeOfAttackChosen] || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.calculation__damage__item {
  display: grid;
  grid-template-columns: 1fr 100px 100px 100px;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  &:nth-child(even) {
    background-color: transparent;
  }
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 80px 80px 80px;
    gap: 0.15rem;
  }
}
.calculation__damage__item--fill {
  grid-template-columns: 1fr;
}
.calculation__damage__item--healing {
  color: #3bea3b;
}
.calculation__damage__item--shield {
  color: #00adff;
}
.rotation__aggregation {
  margin-top: 1rem;
  background: #1c2737;
  border-radius: 0.25rem;
}
html[data-theme="light"] {
  .calculation__damage__item {
    &:nth-child(odd) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .calculation__damage__item--shield {
    color: #4a92ff;
  }
  .rotation__aggregation {
    background: #cee2ff;
  }
  .calculation__damage__item--healing {
    color: #13a813;
  }
}
</style>
