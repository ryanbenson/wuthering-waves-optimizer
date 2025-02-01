<template>
<div class="character__selection">
    <div
        class="character__selection__avatar"
        :style="{
        backgroundImage: `url(https://ryanbenson.github.io/wuthering-waves-assets/images/${characterChosen}.png)`,
        }"
    ></div>
    <div class="character__selection__form">
        <div class="character__selection__form--character">
        <select
            name="character"
            v-model="characterChosen"
            class="select select-bordered select-sm"
            @input="handleUpdatedCharacter">
            <optgroup label="5 Star">
            <option
                v-for="char in charactersList.five"
                :key="char.key"
                :value="char.key">
                {{ char.name }}
            </option>
            </optgroup>
            <optgroup label="4 Star">
            <option
                v-for="char in charactersList.four"
                :key="char.key"
                :value="char.key">
                {{ char.name }}
            </option>
            </optgroup>
        </select>
        </div>
    </div>
    <CalculatorCharacterBrowser
      :character="character"
      ref="characterBrowser"
      @character-browser:chosen-character="handleChosenCharacter"
    />
    <button @click="openCharacterBrowser" class="btn btn-sm btn--character--find">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="size-4">
        <path
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
          fill="#FFFFFF" />
      </svg>
      Find
    </button>
</div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import CalculatorCharacterBrowser from "./CalculatorCharacterBrowser.vue";
import {
  getCharactersAvailable,
  getCharByName,
} from "../characters/characters";
export default {
  props: {
    character: {
        type: String,
        required: true,
    }
  },
  components: {
    CalculatorCharacterBrowser
  },
  data() {
    return {
      charactersList: [],
      characterChosen: "",
    };
  },
  methods: {
    /**
     * @emits updated-chosen-character
     */
    handleUpdatedCharacter(e) {
        const character = e.target.value;
        this.$emit('updated-chosen-character', character);
    },
    handleChosenCharacter(character) {
      this.characterChosen = character;
      this.$emit('updated-chosen-character', character);
    },
    /**
     * Tells the character browser to open
     */
    openCharacterBrowser() {
      this.$refs.characterBrowser.triggerOpenModal();
    }
  },
  mounted() {
    this.charactersList = getCharactersAvailable();
    this.characterChosen = this.character;
  }
};
</script>

<style lang="scss" scoped>
.character__selection {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  grid-gap: 2rem;
}
.character__selection__form--character {
  margin-bottom: 1rem;
}
.character__selection__form {
  label {
    margin-left: 0.5rem;
  }
}
.character__selection__avatar {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}

html[data-theme="light"] {
  .btn--character--find {
    svg {
      filter: invert(100%);
    }
  }
}
</style>
