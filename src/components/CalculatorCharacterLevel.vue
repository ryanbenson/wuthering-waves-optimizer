<template>
  <div>
    <select
      name="characterLevel"
      v-model="characterLevel"
      @input="levelUpdated">
      <option v-for="lvl in characterLevelOptions" :key="lvl" :value="lvl">
        {{ lvl }}
      </option>
    </select>
    <label for="characterLevel">Character Level</label>
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
      characterLevelOptions: [
        "1",
        "20",
        "20+",
        "40",
        "40+",
        "50",
        "50+",
        "60",
        "60+",
        "70",
        "70+",
        "80",
        "80+",
        "90",
      ],
    };
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    levelUpdated(e) {
      this.$emit("character-level-updated", e.target.value);
    },
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
     * Getter/setter used in the form for the basic talent state
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Number}
     */
    characterLevel: {
      get() {
        return this.currentCharacter?.characterLevel ?? "90";
      },
      async set(value) {
        const data = {
          characterLevel: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
