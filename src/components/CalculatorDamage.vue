<template>
  <div
    class="calculation__damage__item"
    :class="{
      'calculation__damage__item--healing': type === 'Healing',
      'calculation__damage__item--shield': type === 'Shield',
    }">
    <template v-if="type === 'Healing'">
      <span>{{ label }}</span>
      <span
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }"
        >{{ displayDamage(damage.healAmount) }}</span
      >
    </template>
    <template v-else-if="type === 'Shield'">
      <span>{{ label }}</span>
      <span
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }"
        >{{ displayDamage(damage.shieldAmount) }}</span
      >
    </template>
    <template v-else>
      <span>{{ label }}</span>
      <span
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }"
        >{{ displayDamage(damage.totalDamage) }}</span
      >
      <span
        v-tooltip="{
          content: damage.detailedCalculationAvg,
          html: true,
        }"
        >{{ displayDamage(damage.avgDamage) }}</span
      >
      <span
        v-tooltip="{
          content: damage.detailedCalculationCrit,
          html: true,
        }"
        >{{ displayDamage(damage.critDamage) }}</span
      >
    </template>
  </div>
</template>

<script>
import { displayDamage } from "../utils/numbers";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    damage: {
      type: Object,
      required: true,
    },
  },
  methods: {
    displayDamage,
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

    @media (prefers-color-scheme: light) {
      background-color: rgba(0, 0, 0, 0.1);
    }
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

  @media (prefers-color-scheme: light) {
    color: #13a813;
  }
}
.calculation__damage__item--shield {
  color: #00adff;

  @media (prefers-color-scheme: light) {
    color: #4a92ff;
  }
}
.rotation__aggregation {
  margin-top: 1rem;
  background: #1c2737;
  border-radius: 0.25rem;

  @media (prefers-color-scheme: light) {
    background: #cee2ff;
  }
}
</style>
