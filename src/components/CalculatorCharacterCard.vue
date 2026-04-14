<template>
  <div
    class="character__item card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <div class="character__content flex gap-6 flex-col justify-center items-center">
        <div class="character__item__left">
          <div
            class="character__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
            :class="{
              'border-amber-300': rarity === 5,
              'border-violet-600': rarity === 4,
            }"
            :style="{
              backgroundImage:`url(https://ryanbenson.github.io/wuthering-waves-assets/images/${nameKey}.png)`,
            }"></div>
        </div>
        <div class="character__item__stats mb-2 w-full relative flex flex-col  justify-center items-center">
          <h2 class="card-title flex items-center">
            <span
              :class="{
                'text-amber-300': rarity === 5,
                'text-violet-600': rarity === 4,
              }">
              {{ name }}
            </span>
          </h2>
          <div class="character__item__meta flex gap-2 items-center">
            <span class="character__item__set size-6 rounded-full">
              <img :src="elementImage" :class="elementClass" />
            </span>
            <span class="character__weapon size-6 rounded-full">
              <img
                :src="weaponImage"
              />
            </span>
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  characterElementsSetImageMap,
  weaponTypesImageMap,
} from "../characters/characters";

interface Props {
  name: string;
  nameKey: string;
  rarity: number;
  element: string;
  weapon: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
});

const elementImage = computed(
  () => characterElementsSetImageMap[props.element] ?? null,
);
const weaponImage = computed(
  () => weaponTypesImageMap[props.weapon] ?? null,
);
const elementClass = computed(
  () => `${props.element.toLowerCase()}--active`,
);
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .character__weapon img {
    filter: invert(1);
  }
}
</style>
