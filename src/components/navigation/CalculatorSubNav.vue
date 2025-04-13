<template>
  <ul class="menu menu-horizontal px-1">
    <li>
      <a
        @click="changeScreen('character')"
        :class="{ active: curScreen === 'character' }"
        data-test-calculator-nav="character">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png"
          class="size-8"
          alt="Your Character" />
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('weapon')"
        :class="{ active: curScreen === 'weapon' }"
        data-test-calculator-nav="weapon">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_014.png"
          class="size-8"
          alt="Your Weapon" />
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('echoes')"
        :class="{ active: curScreen === 'echoes' }"
        data-test-calculator-nav="echoes">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
          class="size-8"
          alt="Your Echoes" />
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('constellations')"
        :class="{ active: curScreen === 'constellations' }"
        data-test-calculator-nav="resonanceChains">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/constellations.png"
          class="size-8"
          alt="Your Resonance Chains" />
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('party')"
        :class="{ active: curScreen === 'party' }"
        data-test-calculator-nav="team">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/team.png"
          class="size-8"
          alt="Team Buffs" />
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('rotations')"
        class="calcations__nav--icon-svg calcations__nav--rotations mr-2 h-12"
        :class="{ active: curScreen === 'rotations' }"
        data-test-calculator-nav="rotations">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="size-6 mt-1">
          <path
            d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
            fill="#FFFFFF" />
        </svg>
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('custom-buffs')"
        class="calcations__nav--icon-svg calcations__nav--custom-buffs h-12"
        :class="{ active: curScreen === 'custom-buffs' }"
        data-test-calculator-nav="customBuffs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          class="size-6 mt-1">
          <path
            d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
            fill="#FFFFFF" />
        </svg>
      </a>
    </li>
    <li>
      <a
        @click="changeScreen('enemy')"
        :class="{ active: curScreen === 'enemy' }"
        data-test-calculator-nav="enemy">
        <img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png"
          class="size-8"
          alt="Your Enemy" />
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: "CalculatorSubNav",
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
