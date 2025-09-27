<template>
  <div class="optimizer-rotation-actions flex justify-center items-center">
    <button class="btn btn-xs btn-outline" @click="toggleIsDamagesListShown">
      {{ isDamagesListShown ? "Hide Details" : "Show Details" }}
    </button>
  </div>
  <table class="calculator__damages table table-zebra table-sm">
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
        <CalculatorDamage
          v-for="damageInstance in rotation.attacks"
          :key="damageInstance.id"
          :character="character"
          :type="damageInstance.type"
          :label="damageInstance.label"
          :damage="damageInstance.damage"
          :is-enabled="damageInstance.isEnabled"
          :original-is-enabled="damageInstance.originalIsEnabled"
          :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
      </template>
    </tbody>
    <tfoot>
      <tr
        v-if="rotation.damageAggregation.normalDamage"
        class="rotation-total-damage">
        <td>Total Damage</td>
        <td>
          {{ displayDamage(rotation.damageAggregation.normalDamage) }}
        </td>
        <td>{{ displayDamage(rotation.damageAggregation.avgDamage) }}</td>
        <td>
          {{ displayDamage(rotation.damageAggregation.critDamage) }}
        </td>
      </tr>
      <tr
        v-if="rotation.damageAggregation.healing"
        class="calculation__damage__item--healing">
        <td>Total Healing</td>
        <td>{{ displayDamage(rotation.damageAggregation.healing) }}</td>
        <td></td>
        <td></td>
      </tr>
      <tr
        v-if="rotation.damageAggregation.shield"
        class="calculation__damage__item--shield">
        <td>Total Shield</td>
        <td>{{ displayDamage(rotation.damageAggregation.shield) }}</td>
        <td></td>
        <td></td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import { displayDamage } from "../utils/numbers";
import CalculatorDamage from "./CalculatorDamage.vue";
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
  },
  components: {
    CalculatorDamage,
  },
  data() {
    return {
      isDamagesListShown: false,
    };
  },
  methods: {
    displayDamage,
    toggleIsDamagesListShown() {
      this.isDamagesListShown = !this.isDamagesListShown;
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
