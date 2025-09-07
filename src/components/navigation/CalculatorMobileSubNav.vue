<template>
  <ul
    tabindex="0"
    class="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
    <li class="mb-2">
      <a
        @click="changeScreen('character')"
        :class="{ active: curScreen === 'character' }"
        class="text-white hover:text-primary"
        data-test-calculator-mobile-nav="character">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png"
          class="size-7"
          alt="Your Character" />
        Character
      </a>
    </li>
    <li class="mb-2">
      <a
        @click="changeScreen('weapon')"
        :class="{ active: curScreen === 'weapon' }"
        class="text-white hover:text-primary"
        data-test-calculator-mobile-nav="weapon">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_014.png"
          class="size-7"
          alt="Your Weapon" />
        Weapon
      </a>
    </li>
    <li class="mb-2">
      <a
        @click="changeScreen('echoes')"
        :class="{ active: curScreen === 'echoes' }"
        class="text-white hover:text-primary"
        data-test-calculator-mobile-nav="echoes">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
          class="size-7"
          alt="Your Echoes" />
        Echoes
      </a>
    </li>
    <li class="mb-2">
      <a
        @click="changeScreen('constellations')"
        :class="{ active: curScreen === 'constellations' }"
        class="text-white hover:text-primary"
        data-test-calculator-mobile-nav="resonanceChains">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/constellations.png"
          class="size-7"
          alt="Your Resonance Chains" />
        Resonance Chains
      </a>
    </li>
    <li class="mb-2">
      <a
        @click="changeScreen('party')"
        :class="{ active: curScreen === 'party' }"
        class="text-white hover:text-primary"
        data-test-calculator-mobile-nav="team">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/team.png"
          class="size-7"
          alt="Team Buffs" />
        Team Buffs
      </a>
    </li>
    <li v-if="isFeatureOptimizerEnabled" class="mb-2">
      <a
        @click="changeScreen('optimizer')"
        :class="{ active: curScreen === 'optimizer' }"
        class="text-white hover:text-primary"
        data-test-calculator-mobile-nav="optimizer">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/sparkles.png"
          class="size-7"
          alt="Optimizer" />
        Optimizer
      </a>
    </li>
    <li class="h-9 my-0.5 mb-2">
      <a
        @click="changeScreen('rotations')"
        class="calcations__nav--icon-svg calcations__nav--rotations text-white hover:text-primary flex justify-start min-h-[36px]"
        :class="{ active: curScreen === 'rotations' }"
        data-test-calculator-mobile-nav="rotations">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="size-5 mr-1 ml-0.5">
          <path
            d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
            fill="#FFFFFF" />
        </svg>
        Rotations
      </a>
    </li>
    <li class="h-9 my-0.5 mb-2">
      <a
        @click="changeScreen('custom-buffs')"
        class="calcations__nav--icon-svg calcations__nav--custom-buffs text-white hover:text-primary flex justify-start min-h-[36px]"
        :class="{ active: curScreen === 'custom-buffs' }"
        data-test-calculator-mobile-nav="customBuffs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="size-5 mr-1 ml-0.5">
          <path
            d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
            fill="#FFFFFF" />
        </svg>
        Custom Buffs
      </a>
    </li>
    <li class="mb-2">
      <a
        @click="changeScreen('enemy')"
        :class="{ active: curScreen === 'enemy' }"
        class="text-white hover:text-primary"
        data-test-calculator-mobile-nav="enemy">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png"
          class="size-7"
          alt="Your Enemy" />
        Enemy
      </a>
    </li>
    <li>
      <a
        class="calculations__nav--results text-white hover:text-primary"
        :class="{ active: curScreen === 'results' }"
        @click="changeScreen('results')"
        data-test-calculator-mobile-nav="stats">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/damages.png"
          class="size-7"
          alt="Results" />
        Stats & Damages
      </a>
    </li>
  </ul>
</template>

<script>
import { mapState } from "pinia";
import { useSettingsStore } from "../../stores/settings";
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
  computed: {
    ...mapState(useSettingsStore, ["labs"]),
    isFeatureOptimizerEnabled() {
      return this.labs?.optimizer?.isEnabled ?? false;
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
