<template>
  <ul
    tabindex="0"
    class="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
    <li class="mb-2">
      <a
        @click="changeScreen('echoes')"
        :class="{ active: curScreen === 'echoes' }"
        class="text-white hover:text-primary"
        data-test-inventory-mobile-nav="echoes">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
          class="size-7"
          alt="Your Echoes" />
        Echoes
      </a>
    </li>
    <li class="h-9 my-0.5 mb-2">
      <a
        @click="changeScreen('presets')"
        class="calcations__nav--icon-svg calcations__nav--rotations text-white hover:text-primary flex justify-start min-h-[36px]"
        :class="{ active: curScreen === 'presets' }"
        data-test-inventory-mobile-nav="presets">
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
        Presets
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "CalculatorMobileSubNav",
  props: {
    screen: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      curScreen: "character",
    };
  },
  methods: {
    changeScreen(screen) {
      this.$emit("change-screen", screen);
      this.curScreen = screen;
      const mainMenuEl = document.querySelector(".main-menu-mobile");
      if (mainMenuEl) {
        mainMenuEl.removeAttribute("open");
      }
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
