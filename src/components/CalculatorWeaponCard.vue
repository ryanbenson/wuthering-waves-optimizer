<template>
  <div
    class="weapon__item card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <div class="weapon__content flex gap-6 flex-col justify-center items-center">
        <div class="weapon__item__left">
          <div
            class="weapon__item__image rounded-full border border-solid neutral-content size-20 mb-2 bg-cover cursor-pointer mx-auto lg:m-0"
            :style="{
              backgroundImage:`url(https://ryanbenson.github.io/wuthering-waves-assets/images/weapons/${nameKey}.png)`,
            }"></div>
        </div>
        <div class="weapon__item__stats mb-2 w-full relative flex flex-col  justify-center items-center">
          <h2 class="card-title flex items-center">
            <span class="text-center">
              {{ name }}
            </span>
          </h2>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalculatorWeaponCard",
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
    isActive: {
        type: Boolean,
        default: false
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
  },
};
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .weapon__weapon img {
    filter: invert(1);
  }
}
</style>
