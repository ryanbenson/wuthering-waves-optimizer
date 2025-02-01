<template>
  <div
    class="character__item card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <div class="character__content flex gap-6 flex-col justify-center items-center">
        <div class="character__item__left">
          <div
            class="character__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
            :style="{
              backgroundImage:`url(https://ryanbenson.github.io/wuthering-waves-assets/images/${nameKey}.png)`,
            }"></div>
        </div>
        <div class="character__item__stats mb-2 w-full relative flex flex-col  justify-center items-center">
          <h2 class="card-title flex items-center">
            <span>
              {{ name }}
            </span>
          </h2>
          <div class="character__item__meta flex gap-2 items-center">
            <span class="character__item__set size-6 rounded-full">
              <img :src="elementImage" :class="getElementClass" />
            </span>
            <span class="character__item__cost size-6 rounded-full">
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

<script>
import { characterElementsSetImageMap, weaponTypesImageMap } from "../characters/characters";
export default {
  name: "CalculatorCharacterCard",
  props: {
    name: {
        type: String,
        required: true
    },
    nameKey: {
        type: String,
        required: true
    },
    rarity: {
        type: Number,
        required: true
    },
    element: {
        type: String,
        required: true
    },
    weapon: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    elementImage() {
        return characterElementsSetImageMap[this.element] ?? null;
    },
    weaponImage() {
      return weaponTypesImageMap[this.weapon] ?? null; 
    },
    getElementClass() {
      return `${this.element.toLowerCase()}--active`;
    }
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .character__item__sub-stats img {
    filter: contrast(0);
  }
}
</style>
