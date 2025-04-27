<template>
  <tr
    :class="[
      slugifiedLabel,
      {
        'calculation__damage__item--healing': type === 'Healing',
        'calculation__damage__item--shield': type === 'Shield',
        'opacity-50': isEnabled && !originalIsEnabled,
      },
    ]"
    v-tooltip="{
      content:
        isEnabled && !originalIsEnabled
          ? 'Action is not enabled, unlock this action to enable it.'
          : '',
    }">
    <template v-if="type === 'Healing'">
      <td>{{ label }}</td>
      <td
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }">
        {{ displayDamage(damage.healAmount) }}
      </td>
    </template>
    <template v-else-if="type === 'Shield'">
      <td>{{ label }}</td>
      <td
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }">
        {{ displayDamage(damage.shieldAmount) }}
      </td>
    </template>
    <template v-else-if="type === 'ElementalEffect'">
      <td>{{ label }}</td>
      <td
        v-tooltip="{
          content: displayDamage(damage),
          html: true,
        }">
        {{ displayDamage(damage) }}
      </td>
    </template>
    <template v-else>
      <td>{{ label }}</td>
      <td
        v-tooltip="{
          content: normalDmgTooltipText,
          html: true,
        }">
        <template v-if="!alwaysCrit">
          {{ displayDamage(damage.totalDamage) }}
        </template>
      </td>
      <td
        v-tooltip="{
          content: avgDmgTooltipText,
          html: true,
        }">
        <template v-if="!alwaysCrit">
          {{ displayDamage(damage.avgDamage) }}
        </template>
      </td>
      <td
        v-tooltip="{
          content: damage.detailedCalculationCrit,
          html: true,
        }">
        {{ displayDamage(damage.critDamage) }}
      </td>
    </template>
  </tr>
</template>

<script>
import { displayDamage } from "../utils/numbers";
import { slugify } from "../utils/strings";
export default {
  props: {
    character: {
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
    isEnabled: {
      type: Boolean,
      default: true,
    },
    originalIsEnabled: {
      type: Boolean,
      default: true,
    },
    alwaysCrit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    displayDamage,
    slugify,
  },
  computed: {
    slugifiedLabel() {
      return slugify(this.label) ?? "";
    },
    normalDmgTooltipText() {
      if (this.alwaysCrit) {
        return null;
      }
      return this.damage.detailedCalculation;
    },
    avgDmgTooltipText() {
      if (this.alwaysCrit) {
        return null;
      }
      return this.damage.detailedCalculationAvg;
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
