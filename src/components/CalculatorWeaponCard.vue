<template>
  <div
    class="weapon__item card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <div class="weapon__content flex gap-6 flex-col justify-center items-center">
        <div class="weapon__item__left">
          <div
            class="weapon__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
            :class="{
              'border-amber-300': rarity === '5' || rarity === 5,
              'border-violet-600': rarity === '4' || rarity === 4,
              'border-blue-500': rarity === '3' || rarity === 3,
              'border-green-500': rarity === '2' || rarity === 2,
              'border-gray-500': rarity === '1' || rarity === 1,
            }"
            :style="{
              backgroundImage:`url(https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/${nameKey}.png)`,
            }"></div>
        </div>
        <div class="weapon__item__stats mb-2 w-full relative flex flex-col  justify-center items-center">
          <h2 class="card-title flex items-center">
            <span class="text-center"
              :class="{
                'text-amber-300': rarity === '5' || rarity === 5,
                'text-violet-600': rarity === '4' || rarity === 4,
                'text-blue-500': rarity === '3' || rarity === 3,
                'text-green-500': rarity === '2' || rarity === 2,
                'text-gray-500': rarity === '1' || rarity === 1,
              }">
              {{ name }}
            </span>
          </h2>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string;
    nameKey: string;
    rarity: number | string;
    isActive?: boolean;
  }>(),
  { isActive: false },
);
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .weapon__weapon img {
    filter: invert(1);
  }
}
</style>
