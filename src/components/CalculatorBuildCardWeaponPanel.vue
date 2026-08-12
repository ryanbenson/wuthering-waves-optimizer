<template>
  <div
    class="weapon-panel relative w-full h-full rounded-lg overflow-hidden bg-base-300 bg-cover bg-center"
    :style="{ backgroundImage: image ? `url(${image})` : undefined }"
    data-test-build-card-weapon>
    <div class="weapon-panel__scrim absolute inset-0"></div>
    <div class="weapon-panel__content absolute inset-0 p-4 flex flex-col justify-start">
      <h3
        class="weapon-panel__name text-lg font-bold leading-tight"
        :class="rarityTextClass">
        {{ name }}
      </h3>
      <div class="weapon-panel__stars flex gap-0.5 mt-1" aria-hidden="true">
        <svg
          v-for="n in starCount"
          :key="n"
          viewBox="0 0 24 24"
          class="size-4"
          :class="rarityTextClass"
          fill="currentColor">
          <path
            d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l7.1-1.01z" />
        </svg>
      </div>
      <div class="weapon-panel__meta text-sm opacity-80 mt-1">
        Lv. {{ level }} &middot; R{{ refinement }}
      </div>

      <div class="weapon-panel__stats mt-3 flex flex-col gap-1 max-w-[240px]">
        <div
          v-if="attack != null"
          class="weapon-panel__stat flex items-center justify-between gap-3 bg-base-100/70 rounded px-2 py-1">
          <span class="flex items-center gap-1.5">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png"
              class="size-4" />
            <span class="text-xs font-semibold">ATK</span>
          </span>
          <span class="text-sm font-bold">{{ displayInt(attack) }}</span>
        </div>
        <div
          v-if="modifierLabel && modifierValue != null"
          class="weapon-panel__stat flex items-center justify-between gap-3 bg-base-100/70 rounded px-2 py-1">
          <span class="flex items-center gap-1.5">
            <img v-if="modifierImage" :src="modifierImage" class="size-4" />
            <span class="text-xs font-semibold">{{ modifierLabel }}</span>
          </span>
          <span class="text-sm font-bold">{{
            displayPercentage(modifierValue * 100)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { displayInt, displayPercentage } from "../utils/numbers";

const props = defineProps<{
  name: string;
  image?: string | null;
  rarity: number | string;
  level: string | number;
  refinement: string | number;
  attack?: number | null;
  modifierLabel?: string | null;
  modifierImage?: string | null;
  modifierValue?: number | null;
}>();

const starCount = computed(() => Number(props.rarity) || 0);

const rarityTextClass = computed(() => {
  switch (Number(props.rarity)) {
    case 5:
      return "text-amber-300";
    case 4:
      return "text-violet-600";
    case 3:
      return "text-blue-500";
    case 2:
      return "text-green-500";
    case 1:
      return "text-gray-500";
    default:
      return "";
  }
});
</script>

<style scoped lang="scss">
.weapon-panel__scrim {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.55) 0%,
    rgba(0, 0, 0, 0.15) 45%,
    rgba(0, 0, 0, 0.05) 100%
  );
}
</style>
