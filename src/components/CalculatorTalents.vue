<template>
  <div class="data-input--talents mt-8">
    <div class="flex flex-col pb-7 relative">
      <label for="talentBasic" class="talent__label">
        Basic
        <span class="text-primary">{{ basic }}</span>
      </label>
      <input
        v-model="basic"
        name="talentBasic"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('basic', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentSkill" class="talent__label">
        Skill
        <span class="text-primary">{{ skill }}</span>
      </label>
      <input
        v-model="skill"
        name="talentSkill"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('skill', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentForte" class="talent__label">
        Forte Circuit
        <span class="text-primary">{{ forte }}</span>
      </label>
      <input
        v-model="forte"
        name="talentForte"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('forte', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentLiberation" class="talent__label">
        Liberation
        <span class="text-primary">{{ liberation }}</span>
      </label>
      <input
        v-model="liberation"
        name="talentLiberation"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('liberation', e)" />
    </div>
    <div class="flex flex-col pb-7 relative">
      <label for="talentIntro" class="talent__label">
        Intro
        <span class="text-primary">{{ intro }}</span>
      </label>
      <input
        v-model="intro"
        name="talentIntro"
        type="range"
        min="1"
        max="10"
        step="1"
        class="range range-xs"
        :class="classes"
        @input="(e) => talentUpdated('intro', e)" />
    </div>
  </div>
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
    ...mapState(useSettingsStore, ["config"]),
    settingsTheme() {
      const settingsTheme = this.config?.theme ?? null;
      return settingsTheme;
    },
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    classes() {
      const classes = [];
      if (this.settingsTheme === "black") {
        classes.push("[--range-shdw:gray]");
      }
      return classes;
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
