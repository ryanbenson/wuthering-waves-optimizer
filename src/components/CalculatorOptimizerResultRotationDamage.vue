<template>
  <div class="optimizer-rotation-actions flex justify-center items-center">
    <button class="btn btn-xs btn-outline" @click="toggleIsDamagesListShown">
      {{ isDamagesListShown ? "Hide Details" : "Show Details" }}
    </button>
  </div>
  <table class="calculator-optimizer__damages table table-zebra table-xs">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="isDamagesListShown">
        <CalculatorOptimizerResultRotationDamageItem
          v-for="damageInstance in rotation.attacks"
          :key="damageInstance.id"
          :attack-id="damageInstance.id"
          :character="character"
          :type="damageInstance.type"
          :label="damageInstance.label"
          :damage="damageInstance.damage"
          :is-enabled="damageInstance.isEnabled"
          :original-is-enabled="damageInstance.originalIsEnabled"
          :matched-rotation-from-current-damages="
            matchedRotationFromCurrentDamages
          "
          :always-crit="
            damageInstance.alwaysCrit
          "></CalculatorOptimizerResultRotationDamageItem>
      </template>
    </tbody>
    <tfoot>
      <tr
        v-if="rotation.damageAggregation.normalDamage"
        class="rotation-total-damage">
        <td>Total Damage</td>
        <td>
          {{ displayDamage(rotation.damageAggregation.normalDamage) }}
          <span
            :class="{
              'text-success': normalDiffPercentage >= 0,
              'text-error': normalDiffPercentage < 0,
            }">
            ({{ normalDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(normalDiffPercentage) }})
          </span>
        </td>
        <td>
          {{ displayDamage(rotation.damageAggregation.avgDamage) }}
          <span
            :class="{
              'text-success': avgDiffPercentage >= 0,
              'text-error': avgDiffPercentage < 0,
            }">
            ({{ avgDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(avgDiffPercentage) }})
          </span>
        </td>
        <td>
          {{ displayDamage(rotation.damageAggregation.critDamage) }}
          <span
            :class="{
              'text-success': critDiffPercentage >= 0,
              'text-error': critDiffPercentage < 0,
            }">
            ({{ critDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(critDiffPercentage) }})
          </span>
        </td>
      </tr>
      <tr
        v-if="rotation.damageAggregation.healing"
        class="calculation__damage__item--healing">
        <td>Total Healing</td>
        <td>
          {{ displayDamage(rotation.damageAggregation.healing) }}
          <span
            :class="{
              'text-success': healingDiffPercentage >= 0,
              'text-error': healingDiffPercentage < 0,
            }">
            ({{ healingDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(healingDiffPercentage) }})
          </span>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr
        v-if="rotation.damageAggregation.shield"
        class="calculation__damage__item--shield">
        <td>Total Shield</td>
        <td>
          {{ displayDamage(rotation.damageAggregation.shield) }}
          <span
            :class="{
              'text-success': shieldDiffPercentage >= 0,
              'text-error': shieldDiffPercentage < 0,
            }">
            ({{ shieldDiffPercentage >= 0 ? "+" : ""
            }}{{ displayPercentage(shieldDiffPercentage) }})
          </span>
        </td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import { displayDamage, displayPercentage } from "../utils/numbers";
import CalculatorOptimizerResultRotationDamageItem from "./CalculatorOptimizerResultRotationDamageItem.vue";
export default {
  name: "CalculatorOptimizerResultRotationDamage",
  props: {
    character: {
      type: String,
      required: true,
    },
    rotation: {
      type: Array,
      required: true,
    },
    allDamages: {
      type: Array,
      default: () => [],
    },
    rotationId: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorOptimizerResultRotationDamageItem,
  },
  data() {
    return {
      isDamagesListShown: false,
    };
  },
  methods: {
    displayDamage,
    displayPercentage,
    toggleIsDamagesListShown() {
      this.isDamagesListShown = !this.isDamagesListShown;
    },
  },
  computed: {
    rotationsList() {
      return this.allDamages?.value?.rotations ?? [];
    },
    matchedRotationFromCurrentDamages() {
      return this.rotationsList.find(
        (rotation) => rotation.id === this.rotationId,
      );
    },
    normalDiffPercentage() {
      const newDamage = this.rotation.damageAggregation.normalDamage ?? 0;
      const baseDamage =
        this.matchedRotationFromCurrentDamages?.damageAggregation
          .normalDamage ?? 0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    avgDiffPercentage() {
      const newDamage = this.rotation.damageAggregation.avgDamage ?? 0;
      const baseDamage =
        this.matchedRotationFromCurrentDamages?.damageAggregation.avgDamage ??
        0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    critDiffPercentage() {
      const newDamage = this.rotation.damageAggregation.critDamage ?? 0;
      const baseDamage =
        this.matchedRotationFromCurrentDamages?.damageAggregation.critDamage ??
        0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    shieldDiffPercentage() {
      const newDamage = this.rotation.damageAggregation.shield ?? 0;
      const baseDamage =
        this.matchedRotationFromCurrentDamages?.damageAggregation.shield ?? 0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    healingDiffPercentage() {
      const newDamage = this.rotation.damageAggregation.healing ?? 0;
      const baseDamage =
        this.matchedRotationFromCurrentDamages?.damageAggregation.healing ?? 0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
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
