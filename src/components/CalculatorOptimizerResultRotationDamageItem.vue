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
        <img
          v-if="mainEchoImage"
          :src="mainEchoImage"
          class="size-6 rounded-full border border-solid neutral-content"
          :class="{
            'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
            'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
            'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
            'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
          }" />
        <span v-if="countLabel" class="badge badge-sm badge-ghost shrink-0">{{ countLabel }}</span>
        <span>{{ label }}</span>
      </td>
      <td
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }">
        {{ displayDamage(damage.healAmount ?? 0) }}
        <AppDeltaPercent :value="healingDiffPercentage" parens />
      </td>
    </template>
    <template v-else-if="type === 'Shield'">
      <td class="flex items-center gap-2">
        <img
          v-if="mainEchoImage"
          :src="mainEchoImage"
          class="size-6 rounded-full border border-solid neutral-content"
          :class="{
            'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
            'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
            'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
            'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
          }" />
        <span v-if="countLabel" class="badge badge-sm badge-ghost shrink-0">{{ countLabel }}</span>
        <span>{{ label }}</span>
      </td>
      <td
        v-tooltip="{
          content: damage.detailedCalculation,
          html: true,
        }">
        {{ displayDamage(damage.shieldAmount ?? 0) }}
        <AppDeltaPercent :value="shieldDiffPercentage" parens />
      </td>
    </template>
    <template v-else>
      <td class="flex items-center gap-2">
        <img
          v-if="mainEchoImage"
          :src="mainEchoImage"
          class="size-6 rounded-full border border-solid neutral-content"
          :class="{
            'border-amber-300': mainEchoRank === '5' || mainEchoRank === 5,
            'border-violet-600': mainEchoRank === '4' || mainEchoRank === 4,
            'border-blue-500': mainEchoRank === '3' || mainEchoRank === 3,
            'border-green-500': mainEchoRank === '2' || mainEchoRank === 2,
          }" />
        <span v-if="countLabel" class="badge badge-sm badge-ghost shrink-0">{{ countLabel }}</span>
        <span>{{ label }}</span>
      </td>
      <td
        v-tooltip="{
          content: normalDmgTooltipText,
          html: true,
        }">
        <template v-if="!alwaysCrit">
          {{ displayDamage(damage.totalDamage ?? 0) }}
          <AppDeltaPercent :value="normalDiffPercentage" parens />
        </template>
      </td>
      <td
        v-tooltip="{
          content: avgDmgTooltipText,
          html: true,
        }">
        <template v-if="!alwaysCrit">
          {{ displayDamage(damage.avgDamage ?? 0) }}
          <AppDeltaPercent :value="avgDiffPercentage" parens />
        </template>
      </td>
      <td
        v-tooltip="{
          content: damage.detailedCalculationCrit,
          html: true,
        }">
        {{ displayDamage(damage.critDamage ?? 0) }}
        <AppDeltaPercent :value="critDiffPercentage" parens />
      </td>
    </template>
  </tr>
</template>

<script setup lang="ts">
import AppDeltaPercent from "./AppDeltaPercent.vue";
import { computed } from "vue";
import { displayDamage } from "../utils/numbers";
import { slugify } from "../utils/strings";
import { getEchoData } from "../echoes";

defineOptions({ name: "CalculatorOptimizerResultRotationDamageItem" });

type DamageRow = {
  detailedCalculation?: string;
  detailedCalculationAvg?: string;
  detailedCalculationCrit?: string;
  totalDamage?: number;
  damage?: number;
  avgDamage?: number;
  critDamage?: number;
  shieldAmount?: number;
  healAmount?: number;
};

type RotationMatch = {
  attacks?: Array<{ id?: string; damage?: DamageRow }>;
};

const props = withDefaults(
  defineProps<{
    character: string;
    attackId: string;
    type: string;
    label: string;
    damage: DamageRow;
    isEnabled?: boolean;
    originalIsEnabled?: boolean;
    alwaysCrit?: boolean;
    mainEcho?: string | null;
    mainEchoRank?: number | string | null;
    matchedRotationFromCurrentDamages?: RotationMatch;
    count?: number | string | null;
  }>(),
  {
    isEnabled: true,
    originalIsEnabled: true,
    alwaysCrit: false,
    mainEcho: null,
    mainEchoRank: null,
    matchedRotationFromCurrentDamages: () => ({}),
    count: null,
  },
);

const slugifiedLabel = computed(() => slugify(props.label) ?? "");
const countLabel = computed(() => {
  if (props.count === null || props.count === undefined || props.count === "") {
    return null;
  }
  const n = Number(props.count);
  if (Number.isNaN(n) || n <= 0) return null;
  return `${n}x`;
});

const mainEchoData = computed(() =>
  props.mainEcho ? getEchoData(props.mainEcho) : null,
);

const mainEchoImage = computed(() => mainEchoData.value?.image ?? null);

const normalDmgTooltipText = computed(() => {
  if (props.alwaysCrit) {
    return undefined;
  }
  return props.damage.detailedCalculation;
});

const avgDmgTooltipText = computed(() => {
  if (props.alwaysCrit) {
    return undefined;
  }
  return props.damage.detailedCalculationAvg;
});

const originalDamageInstance = computed(() =>
  props.matchedRotationFromCurrentDamages?.attacks?.find(
    (attack) => attack.id === props.attackId,
  ),
);

const normalDiffPercentage = computed(() => {
  const newDamage =
    props.damage.totalDamage ?? props.damage?.damage ?? 0;
  const baseDamage =
    originalDamageInstance.value?.damage?.totalDamage ??
    originalDamageInstance.value?.damage?.damage ??
    0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const avgDiffPercentage = computed(() => {
  const newDamage = props.damage.avgDamage ?? 0;
  const baseDamage = originalDamageInstance.value?.damage?.avgDamage ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const critDiffPercentage = computed(() => {
  const newDamage = props.damage.critDamage ?? 0;
  const baseDamage = originalDamageInstance.value?.damage?.critDamage ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const shieldDiffPercentage = computed(() => {
  const newDamage = props.damage.shieldAmount ?? 0;
  const baseDamage = originalDamageInstance.value?.damage?.shieldAmount ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});

const healingDiffPercentage = computed(() => {
  const newDamage = props.damage.healAmount ?? 0;
  const baseDamage = originalDamageInstance.value?.damage?.healAmount ?? 0;
  if (!baseDamage) return 0;
  return ((newDamage - baseDamage) / baseDamage) * 100;
});
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
html[data-theme-style="light"] {
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
