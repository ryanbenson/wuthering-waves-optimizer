<template>
  <ul class="menu menu-horizontal px-1">
    <li>
      <a
        @click="changeScreen('echoes')"
        :class="{ active: curScreen === 'echoes' }"
        class="p-0 flex justify-center min-w-[48px] min-h-[48px] mr-2"
        data-test-inventory-nav="echoes">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
          class="size-7"
          alt="Your Echoes" />
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('presets')"
        :class="{ active: curScreen === 'presets' }"
        class="p-0 flex justify-center min-w-[48px] min-h-[48px] mr-2"
        data-test-inventory-nav="presets">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" class="preset-icon">
          <g class="layer">
            <title>Layer 1</title>
            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
            <g id="SVGRepo_iconCarrier">
            <path d="m6.75,3c-2.87,0 -3.75,0.88 -3.75,3.75c0,2.87 0.88,3.75 3.75,3.75c2.87,0 3.75,-0.88 3.75,-3.75c0,-2.87 -0.88,-3.75 -3.75,-3.75z" fill="#FFFFFF" id="svg_1" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="matrix(1 0 0 1 0 0)"/>
            <path d="m6.75,13.5c-2.87,0 -3.75,0.88 -3.75,3.75c0,2.87 0.88,3.75 3.75,3.75c2.87,0 3.75,-0.88 3.75,-3.75c0,-2.87 -0.88,-3.75 -3.75,-3.75z" id="svg_2" fill="#FFFFFF" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="matrix(1 0 0 1 0 0)"/>
            <path d="m17.25,13.5c-2.87,0 -3.75,0.88 -3.75,3.75c0,2.87 0.88,3.75 3.75,3.75c2.87,0 3.75,-0.88 3.75,-3.75c0,-2.87 -0.88,-3.75 -3.75,-3.75z" id="svg_3" fill="#FFFFFF" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
            <path class="preset-icon-outline" d="m17.25,3c-2.87,0 -3.75,0.88 -3.75,3.75c0,2.87 0.88,3.75 3.75,3.75c2.87,0 3.75,-0.88 3.75,-3.75c0,-2.87 -0.88,-3.75 -3.75,-3.75z" id="svg_4" stroke="#FFFFFF" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
            </g>
          </g>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "InventorySubNav",
  props: {
    screen: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      curScreen: "echoes",
    };
  },
  methods: {
    changeScreen(screen) {
      this.$emit("change-screen", screen);
      this.curScreen = screen;
    },
  },
  mounted() {
    this.curScreen = this.screen;
  },
};
</script>

<style lang="scss" scoped>
.menu {
  z-index: 100;
}
</style>

<style scoped lang="scss">
html[data-theme="light"] {
  .preset-icon svg path {
    stroke: black !important;
    fill: black !important;
  }
  .preset-icon-outline {
    fill: none !important;
  }
  .menu a:hover,
  .menu a.active svg {
    .preset-icon-outline {
        fill: none !important;
    }
  }
}
</style>