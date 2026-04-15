<template>
  <tr
    @click="handleClick"
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
        }"
        colspan="3">
        {{ displayDamage(damage.healAmount) }}
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
        }"
        colspan="3">
        {{ displayDamage(damage.shieldAmount) }}
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
        <template v-if="isEchoAttack">
          <span v-if="!isEquippedEchoSameAsActionEcho" class="mismatch-echo" v-tooltip="'This echo does not match your equipped main echo'">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="size-4"><path d="M320 64C334.7 64 348.2 72.1 355.2 85L571.2 485C577.9 497.4 577.6 512.4 570.4 524.5C563.2 536.6 550.1 544 536 544L104 544C89.9 544 76.8 536.6 69.6 524.5C62.4 512.4 62.1 497.4 68.8 485L284.8 85C291.8 72.1 305.3 64 320 64zM320 416C302.3 416 288 430.3 288 448C288 465.7 302.3 480 320 480C337.7 480 352 465.7 352 448C352 430.3 337.7 416 320 416zM320 224C301.8 224 287.3 239.5 288.6 257.7L296 361.7C296.9 374.2 307.4 384 319.9 384C332.5 384 342.9 374.3 343.8 361.7L351.2 257.7C352.5 239.5 338.1 224 319.8 224z"/></svg>
          </span>
        </template>
      </td>
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

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { displayDamage } from "../utils/numbers";
import { slugify } from "../utils/strings";
import { getEchoData } from "../echoes";
import { useCharacterStore } from "../stores/character";

type DamageData = Record<string, any>;

const props = withDefaults(
  defineProps<{
    character: string;
    type: string;
    label: string;
    damage: DamageData;
    attackKey?: string;
    isEnabled?: boolean;
    mainEcho?: string | null;
    mainEchoRank?: number | string | null;
    originalIsEnabled?: boolean;
    alwaysCrit?: boolean;
  }>(),
  {
    isEnabled: true,
    mainEcho: null,
    mainEchoRank: null,
    originalIsEnabled: true,
    alwaysCrit: false,
  },
);

const emit = defineEmits<{
  "selected-attack": [attackKey: string, damage: DamageData, label: string];
}>();

const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);

const currentCharacter = computed(
  () => (characters.value?.[props.character] as Record<string, any>) ?? {},
);
const currentCharacterMainEcho = computed(
  () => currentCharacter.value?.mainEcho?.echo ?? null,
);
const slugifiedLabel = computed(() => slugify(props.label) ?? "");
const normalDmgTooltipText = computed(() =>
  props.alwaysCrit ? null : props.damage.detailedCalculation,
);
const avgDmgTooltipText = computed(() =>
  props.alwaysCrit ? null : props.damage.detailedCalculationAvg,
);
const mainEchoData = computed(() => {
  if (!props.mainEcho) return null;
  return getEchoData(props.mainEcho);
});
const mainEchoImage = computed(() => mainEchoData.value?.image ?? null);
const isEchoAttack = computed(() => props.mainEcho !== null);
const isEquippedEchoSameAsActionEcho = computed(() => {
  if (!currentCharacterMainEcho.value || !props.mainEcho) {
    return true;
  }
  return currentCharacterMainEcho.value === props.mainEcho;
});

function handleClick() {
  emit("selected-attack", props.attackKey ?? props.label, props.damage, props.label);
}
</script>

<style lang="scss" scoped>
.mismatch-echo {
  svg {
    filter: none !important;
  }
  path {
    fill: oklch(var(--wa));
  }
}
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
  tr::before {
    filter: none !important;
  }
}

tr {
  position: relative;
  cursor: pointer;
  
  &::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Cpath d='M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z'/%3E%3C/svg%3E");
    position: absolute;
    width: 1rem;
    height: 1rem;
    left: -1.25rem;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    filter: invert(100%);
  }
}

tr:hover::before {
  opacity: 0.6;
}
</style>
