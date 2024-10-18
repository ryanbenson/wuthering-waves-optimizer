<template>
  <div class="panel mb-1">
    Enemies in Tower of Adversity (ToA) have increased resistence, typically 20%
    and 60%.
  </div>
  <div class="form__group field">
    <input
      id="enemyLevel"
      type="number"
      v-model="enemyLevel"
      class="form__field form__field--short" />
    <label for="enemyLevel" class="form__label">Enemy Level</label>
  </div>
  <div class="form__group field">
    <select v-model="enemyResist" id="enemyResist" name="enemyResist">
      <option v-for="option in enemyResistOptions" :value="option.key">
        {{ option.label }}
      </option>
    </select>
    <label for="enemyResist" class="form__label">Enemy Resist</label>
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
.panel {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }
}
.mb-1 {
  margin-bottom: 1rem;
}
.form__field--short {
  max-width: 55px;
}
label {
  margin-left: 0.5rem;
}
.field {
  margin-bottom: 1rem;
}
</style>
