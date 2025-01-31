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
    />
    <button @click="openCharacterBrowser">Find</button>
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
</style>
