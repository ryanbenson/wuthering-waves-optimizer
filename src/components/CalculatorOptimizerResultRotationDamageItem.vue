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
      <td class="flex items-center gap-2">
        <img v-if="mainEchoImage" :src="mainEchoImage" class="size-6 rounded-full border border-solid neutral-content"
          :class="{
            'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
            'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
            'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
            'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
          }"
        />
        <span>{{ label }}</span>
      </td>
      <td
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }">
        {{ displayDamage(damage.healAmount) }}
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
    <template v-else-if="type === 'Shield'">
      <td class="flex items-center gap-2">
        <img v-if="mainEchoImage" :src="mainEchoImage" class="size-6 rounded-full border border-solid neutral-content"
          :class="{
            'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
            'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
            'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
            'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
          }"
        />
        <span>{{ label }}</span>
      </td>
      <td
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }">
        {{ displayDamage(damage.shieldAmount) }}
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
    <template v-else-if="type === 'ElementalEffect'">
      <td class="flex items-center gap-2">
        <img v-if="mainEchoImage" :src="mainEchoImage" class="size-6 rounded-full border border-solid neutral-content"
          :class="{
            'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
            'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
            'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
            'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
          }"
        />
        <span>{{ label }}</span>
      </td>
      <td
        v-tooltip="{
          content: displayDamage(damage),
          html: true,
        }">
        {{ displayDamage(damage) }}
      </td>
    </template>
    <template v-else>
      <td class="flex items-center gap-2">
        <img v-if="mainEchoImage" :src="mainEchoImage" class="size-6 rounded-full border border-solid neutral-content"
          :class="{
            'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
            'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
            'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
            'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
          }"
        />
        <span>{{ label }}</span>
      </td>
      <td
        v-tooltip="{
          content: normalDmgTooltipText,
          html: true,
        }">
        <template v-if="!alwaysCrit">
          {{ displayDamage(damage.totalDamage) }}
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
          content: avgDmgTooltipText,
          html: true,
        }">
        <template v-if="!alwaysCrit">
          {{ displayDamage(damage.avgDamage) }}
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
          content: damage.detailedCalculationCrit,
          html: true,
        }">
        {{ displayDamage(damage.critDamage) }}
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
</template>

<script>
import { displayDamage, displayPercentage } from "../utils/numbers";
import { slugify } from "../utils/strings";
import { getEchoData } from "../echoes";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    attackId: {
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
    mainEcho: {
      type: String,
      default: null,
    },
    mainEchoRank: {
      type: [Number, String],
      default: null,
    },
    matchedRotationFromCurrentDamages: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    displayDamage,
    displayPercentage,
    slugify,
  },
  computed: {
    slugifiedLabel() {
      return slugify(this.label) ?? "";
    },
    mainEchoData() {
      return getEchoData(this.mainEcho);
    },
    mainEchoImage() {
      return this.mainEchoData?.image ?? null;
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
    originalDamageInstance() {
      return this.matchedRotationFromCurrentDamages?.attacks?.find(
        (attack) => attack.id === this.attackId,
      );
    },
    normalDiffPercentage() {
      const newDamage = this.damage.totalDamage ?? 0;
      const baseDamage = this.originalDamageInstance?.damage.totalDamage ?? 0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    avgDiffPercentage() {
      const newDamage = this.damage.avgDamage ?? 0;
      const baseDamage = this.originalDamageInstance?.damage.avgDamage ?? 0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    critDiffPercentage() {
      const newDamage = this.damage.critDamage ?? 0;
      const baseDamage = this.originalDamageInstance?.damage.critDamage ?? 0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    shieldDiffPercentage() {
      const newDamage = this.damage.shieldAmount ?? 0;
      const baseDamage = this.originalDamageInstance?.damage.shieldAmount ?? 0;
      return ((newDamage - baseDamage) / baseDamage) * 100;
    },
    healingDiffPercentage() {
      const newDamage = this.damage.healAmount ?? 0;
      const baseDamage = this.originalDamageInstance?.damage.healAmount ?? 0;
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
html[data-theme="light"] {
  .calculation__damage__item {
    &:nth-child(odd) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .calculation__damage__item--shield {
    color: #4a92ff;
  }
  .calculation__damage__item--healing {
    color: #13a813;
  }
}
</style>
