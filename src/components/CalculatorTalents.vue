<template>
  <div class="data-input--talents">
    <div class="form__group field">
      <label for="talentBasic" class="form__label">Basic: {{ basic }}</label>
      <input
        v-model="basic"
        name="talentBasic"
        type="range"
        min="1"
        max="10"
        steps="1"
        class="range range-xs"
        @input="(e) => talentUpdated('basic', e)" />
    </div>
    <div class="form__group field">
      <label for="talentSkill" class="form__label">Skill: {{ skill }}</label>
      <input
        v-model="skill"
        name="talentSkill"
        type="range"
        min="1"
        max="10"
        steps="1"
        class="range range-xs"
        @input="(e) => talentUpdated('skill', e)" />
    </div>
    <div class="form__group field">
      <label for="talentForte" class="form__label"
        >Forte Circuit: {{ forte }}</label
      >
      <input
        v-model="forte"
        name="talentForte"
        type="range"
        min="1"
        max="10"
        steps="1"
        class="range range-xs"
        @input="(e) => talentUpdated('forte', e)" />
    </div>
    <div class="form__group field">
      <label for="talentLiberation" class="form__label"
        >Liberation: {{ liberation }}</label
      >
      <input
        v-model="liberation"
        name="talentLiberation"
        type="range"
        min="1"
        max="10"
        steps="1"
        class="range range-xs"
        @input="(e) => talentUpdated('liberation', e)" />
    </div>
    <div class="form__group field">
      <label for="talentIntro" class="form__label">Intro: {{ intro }}</label>
      <input
        v-model="intro"
        name="talentIntro"
        type="range"
        min="1"
        max="10"
        steps="1"
        class="range range-xs"
        @input="(e) => talentUpdated('intro', e)" />
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
    return {};
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    talentUpdated(type, e) {
      this.$emit("character-talent-updated", { type, value: e.target.value });
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
    basic: {
      get() {
        return this.currentCharacter?.talents?.basic ?? 10;
      },
      async set(value) {
        const data = {
          talents: {
            basic: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the skill talent state
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Number}
     */
    skill: {
      get() {
        return this.currentCharacter?.talents?.skill ?? 10;
      },
      async set(value) {
        const data = {
          talents: {
            skill: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the forte talent state
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Number}
     */
    forte: {
      get() {
        return this.currentCharacter?.talents?.forte ?? 10;
      },
      async set(value) {
        const data = {
          talents: {
            forte: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the liberation talent state
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Number}
     */
    liberation: {
      get() {
        return this.currentCharacter?.talents?.liberation ?? 10;
      },
      async set(value) {
        const data = {
          talents: {
            liberation: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the intro talent state
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Number}
     */
    intro: {
      get() {
        return this.currentCharacter?.talents?.intro ?? 10;
      },
      async set(value) {
        const data = {
          talents: {
            intro: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.data-input--talents {
  padding: 1rem 0;
  label {
    min-width: 120px;
    display: inline-block;
  }
}
.form__group.field {
  display: flex;
}
</style>
