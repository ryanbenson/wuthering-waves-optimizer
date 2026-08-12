<template>
  <div
    class="weapon-panel w-full h-full flex items-center gap-4 rounded-lg bg-base-200 px-4"
    data-test-build-card-weapon>
    <div class="weapon-panel__image-wrap relative shrink-0">
      <div
        class="weapon-panel__image size-32 rounded-lg bg-cover bg-center bg-base-300 border-2"
        :class="rarityBorderClass"
        :style="{ backgroundImage: image ? `url(${image})` : undefined }"></div>
      <div
        class="weapon-panel__stars absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5 bg-base-100 rounded-full px-1.5 py-0.5 shadow"
        aria-hidden="true">
        <svg
          v-for="n in starCount"
          :key="n"
          viewBox="0 0 24 24"
          class="size-2.5"
          :class="rarityTextClass"
          fill="currentColor">
          <path
            d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l7.1-1.01z" />
        </svg>
      </div>
    </div>

    <div class="weapon-panel__info min-w-0 flex-1">
      <h3
        class="weapon-panel__name text-2xl font-bold leading-tight truncate"
        :class="rarityTextClass">
        {{ name }}
      </h3>

      <div class="weapon-panel__row flex items-center gap-5 mt-3">
        <span v-if="attack != null" class="flex items-center gap-2">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png"
            class="size-6" />
          <span class="text-xl font-bold">{{ displayInt(attack) }}</span>
        </span>
        <span
          v-if="modifierLabel && modifierValue != null"
          class="flex items-center gap-2">
          <img v-if="modifierImage" :src="modifierImage" class="size-6" />
          <span class="text-xl font-bold">{{
            displayPercentage(modifierValue * 100)
          }}</span>
        </span>
      </div>

      <div class="weapon-panel__row flex items-center gap-3 mt-3">
        <span
          class="badge badge-primary badge-lg text-base font-bold"
          data-test-build-card-weapon-refinement>
          R{{ refinement }}
        </span>
        <span class="text-lg font-semibold opacity-80">Lv. {{ level }}</span>
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

const rarityBorderClass = computed(() => {
  switch (Number(props.rarity)) {
    case 5:
      return "border-amber-300";
    case 4:
      return "border-violet-600";
    case 3:
      return "border-blue-500";
    case 2:
      return "border-green-500";
    case 1:
      return "border-gray-500";
    default:
      return "border-base-content/20";
  }
});
</script>
