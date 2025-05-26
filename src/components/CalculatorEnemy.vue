<template>
  <div
    class="card card-bordered card-compact shadow mb-12 bg-primary"
    data-test-enemy-info>
    <div class="card-body text-white">
      Enemies in Tower of Adversity (ToA) have increased resistance, typically
      20% and 60%.
    </div>
  </div>

  <div class="data-input--talents mt-8" data-test-enemy-level>
    <div class="flex flex-col pb-7 relative">
      <label for="enemyLevel" class="talent__label" data-test-enemy-level-label>
        Enemy level
        <span class="text-primary">{{ enemyLevel }}</span>
      </label>
      <input
        v-model="enemyLevel"
        name="enemyLevel"
        id="enemyLevel"
        type="range"
        min="1"
        max="120"
        step="1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-level-input />
    </div>
  </div>

  <div class="data-input--talents mt-8" data-test-enemy-resist>
    <div class="flex flex-col pb-7 relative">
      <label
        for="enemyResist"
        class="talent__label"
        data-test-enemy-resist-label>
        Enemy Resistance
        <span class="text-primary">{{ enemyResist * 100 }}%</span>
      </label>
      <input
        v-model="enemyResist"
        name="enemyResist"
        id="enemyResist"
        type="range"
        min="0"
        max="1"
        step="0.1"
        class="range range-xs"
        :class="rangeClasses"
        data-test-enemy-resist-input />
    </div>
  </div>

  <template v-if="hasElementEffects">
    <h3
      class="text-4xl font-bold mb-4 text-primary"
      data-test-enemy-elemental-effects-title>
      Elemental Effects
    </h3>
    <div
      v-if="isSpectroFrazzleEnabled"
      class="data-input--talents mt-8"
      data-test-enemy-spectro-frazzle>
      <div class="flex flex-col pb-7 relative">
        <label
          for="enemyResist"
          class="talent__label"
          data-test-enemy-spectro-frazzle-label>
          Spectro Frazzle Stacks
          <span class="text-primary">{{ spectroFrazzleStacks }}</span>
        </label>
        <input
          v-model="spectroFrazzleStacks"
          name="spectroFrazzleStacks"
          id="spectroFrazzleStacks"
          type="range"
          min="0"
          max="10"
          step="1"
          class="range range-xs"
          :class="rangeClasses"
          data-test-enemy-spectro-frazzle-input />
      </div>
    </div>
  </template>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useSettingsStore } from "../stores/settings";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    isSpectroFrazzleEnabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      enemyResistOptions: [
        { key: 0, label: "0%" },
        { key: 0.1, label: "10%" },
        { key: 0.2, label: "20%" },
        { key: 0.3, label: "30%" },
        { key: 0.4, label: "40%" },
        { key: 0.5, label: "50%" },
        { key: 0.6, label: "60%" },
        { key: 0.7, label: "70%" },
        { key: 0.8, label: "80%" },
        { key: 0.9, label: "90%" },
        { key: 1, label: "100%" },
      ],
    };
  },
  watch: {
    enemyLevel: {
      /**
       * Emits the buff data in its proper format
       * @emits updated-enemy
       */
      handler: async function () {
        this.$emit("updated-enemy-data", {
          enemyLevel: this.enemyLevel,
          enemyResist: this.enemyResist,
          spectroFrazzleStacks: this.spectroFrazzleStacks,
        });
      },
      immediate: true,
    },
    enemyResist: {
      /**
       * Emits the buff data in its proper format
       * @emits updated-enemy
       */
      handler: async function () {
        this.$emit("updated-enemy-data", {
          enemyLevel: this.enemyLevel,
          enemyResist: this.enemyResist,
          spectroFrazzleStacks: this.spectroFrazzleStacks,
        });
      },
      immediate: true,
    },
    spectroFrazzleStacks: {
      /**
       * Emits the buff data in its proper format
       * @emits updated-enemy
       */
      handler: async function () {
        this.$emit("updated-enemy-data", {
          enemyLevel: this.enemyLevel,
          enemyResist: this.enemyResist,
          spectroFrazzleStacks: this.spectroFrazzleStacks,
        });
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    ...mapState(useSettingsStore, ["config"]),
    settingsTheme() {
      const settingsTheme = this.config?.theme ?? null;
      return settingsTheme;
    },
    rangeClasses() {
      const classes = [];
      if (this.settingsTheme === "black") {
        classes.push("[--range-shdw:gray]");
      }
      return classes;
    },
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    /**
     * Getter/setter used in the form for the enemy level
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    enemyLevel: {
      get() {
        return this.currentCharacter?.enemyLevel ?? 90;
      },
      async set(value) {
        const data = {
          enemyLevel: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the enemy level
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    enemyResist: {
      get() {
        return this.currentCharacter?.enemyResist ?? 0.1;
      },
      async set(value) {
        const data = {
          enemyResist: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the number of spectro frazzle stacks
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    spectroFrazzleStacks: {
      get() {
        return this.currentCharacter?.spectroFrazzleStacks ?? 0;
      },
      async set(value) {
        const data = {
          spectroFrazzleStacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Determines if there are any element effects
     * @returns {Boolean}
     */
    hasElementEffects() {
      return this.isSpectroFrazzleEnabled;
    },
  },
};
</script>

<style lang="scss" scoped>
.talent__label {
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: -1.7rem;
  left: 0.5rem;
  z-index: 0;
}
.data-input--talents input {
  position: relative;
  z-index: 10;
}
</style>
