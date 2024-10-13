<template>
  <div class="card card-bordered card-compact shadow mb-12 bg-primary">
    <div class="card-body text-white">
      Enemies in Tower of Adversity (ToA) have increased resistence, typically
      20% and 60%.
    </div>
  </div>

  <div class="data-input--talents mt-8">
    <div class="flex flex-col pb-7 relative">
      <label for="enemyLevel" class="talent__label"
        >Enemy level <span class="text-primary">{{ enemyLevel }}</span></label
      >
      <input
        v-model="enemyLevel"
        name="enemyLevel"
        id="enemyLevel"
        type="range"
        min="1"
        max="120"
        step="1"
        class="range range-xs" />
    </div>
  </div>

  <div class="data-input--talents mt-8">
    <div class="flex flex-col pb-7 relative">
      <label for="enemyResist" class="talent__label"
        >Enemy Resistence
        <span class="text-primary">{{ enemyResist * 100 }}%</span></label
      >
      <input
        v-model="enemyResist"
        name="enemyResist"
        id="enemyResist"
        type="range"
        min="0"
        max="1"
        step="0.1"
        class="range range-xs" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      enemyResistOptions: [
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
  },
};
</script>

<style lang="scss" scoped>
.talent__label {
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: -1.6rem;
  left: 0.5rem;
  z-index: -1;
}
</style>
