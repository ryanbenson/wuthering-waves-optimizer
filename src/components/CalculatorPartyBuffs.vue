<template>
  <div>
    <h2>Select Buffs</h2>
    <label>Select Character 1:</label>
    <select v-model="selectedCharacter1">
      <option
        v-for="character in availableCharacters"
        :key="character"
        :value="character">
        {{ character }}
      </option>
    </select>
    <img
      v-if="selectedCharacter1"
      :src="getCharacterImage(selectedCharacter1)"
      :alt="selectedCharacter1"
      width="50" />
    <br />
    <label>Select Character 2:</label>
    <select v-model="selectedCharacter2">
      <option
        v-for="character in availableCharacters"
        :key="character"
        :value="character">
        {{ character }}
      </option>
    </select>
    <img
      v-if="selectedCharacter2"
      :src="getCharacterImage(selectedCharacter2)"
      :alt="selectedCharacter2"
      width="50" />

    <div v-if="selectedCharacter1">
      <h3>Buffs for {{ selectedCharacter1 }}</h3>
      <div v-for="buff in buffsByCharacter[selectedCharacter1]" :key="buff.key">
        <input
          type="checkbox"
          v-model="selectedBuffs[buff.key].enabled"
          @change="emitBuffs" />
        {{ buff.name }}
        <div v-html="buff.details"></div>
        <div v-if="buff.hasStacks">
          <input
            type="number"
            v-model="selectedBuffs[buff.key].stacks"
            :min="buff.minStacks"
            :max="buff.maxStacks"
            @change="emitBuffs" />
        </div>
      </div>
    </div>

    <div v-if="selectedCharacter2">
      <h3>Buffs for {{ selectedCharacter2 }}</h3>
      <div v-for="buff in buffsByCharacter[selectedCharacter2]" :key="buff.key">
        <input
          type="checkbox"
          v-model="selectedBuffs[buff.key].enabled"
          @change="emitBuffs" />
        {{ buff.name }}
        <div v-html="buff.details"></div>
        <div v-if="buff.hasStacks">
          <input
            type="number"
            v-model="selectedBuffs[buff.key].stacks"
            :min="buff.minStacks"
            :max="buff.maxStacks"
            @change="emitBuffs" />
        </div>
      </div>
    </div>

    <div>
      <h3>All Echo Buffs</h3>
      <div v-for="buff in allEchoBuffs" :key="buff.key">
        <input
          type="checkbox"
          v-model="selectedEchoBuffs[buff.key].enabled"
          @change="emitBuffs" />
        {{ buff.name }}
        <div v-html="buff.details"></div>
        <div v-if="buff.hasStacks">
          <input
            type="number"
            v-model="selectedEchoBuffs[buff.key].stacks"
            :min="buff.minStacks"
            :max="buff.maxStacks"
            @change="emitBuffs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { buffsByCharacter, allEchoBuffs } from "../buffs/index.ts";
import { allCharacters } from "../characters/characters.ts";

export default {
  name: "BuffSelector",
  props: {
    currentCharacter: {
      type: String,
      required: true,
    },
  },
  data() {
    const initialEchoBuffs = {};
    allEchoBuffs.forEach((buff) => {
      initialEchoBuffs[buff.key] = { enabled: false, stacks: buff.minStacks };
    });
    return {
      buffsByCharacter,
      allCharacters,
      allEchoBuffs,
      selectedCharacter1: null,
      selectedCharacter2: null,
      selectedBuffs: {},
      selectedEchoBuffs: initialEchoBuffs,
    };
  },
  computed: {
    availableCharacters() {
      return this.allCharacters.filter(
        (char) => char !== this.currentCharacter
      );
    },
  },
  watch: {
    selectedCharacter1(newVal) {
      if (newVal) {
        this.initializeSelectedBuffs(newVal);
      }
    },
    selectedCharacter2(newVal) {
      if (newVal) {
        this.initializeSelectedBuffs(newVal);
      }
    },
  },
  methods: {
    initializeSelectedBuffs(character) {
      this.buffsByCharacter[character].forEach((buff) => {
        if (!this.selectedBuffs[buff.key]) {
          this.selectedBuffs = {
            ...this.selectedBuffs,
            [buff.key]: { enabled: false, stacks: buff.minStacks },
          };
        }
      });
    },
    getCharacterImage(character) {
      return `/images/${character}.png`;
    },
    emitBuffs() {
      const buffs = {};
      Object.keys(this.selectedBuffs).forEach((key) => {
        if (this.selectedBuffs[key]?.enabled) {
          const buff =
            this.buffsByCharacter[this.selectedCharacter1]?.find(
              (buff) => buff.key === key
            ) ||
            this.buffsByCharacter[this.selectedCharacter2]?.find(
              (buff) => buff.key === key
            );
          if (buff) {
            buffs[key] = {
              ...this.selectedBuffs[key],
              modifiers: buff.modifiers,
            };
          }
        }
      });
      Object.keys(this.selectedEchoBuffs).forEach((key) => {
        if (this.selectedEchoBuffs[key]?.enabled) {
          const buff = this.allEchoBuffs.find((buff) => buff.key === key);
          if (buff) {
            buffs[key] = {
              ...this.selectedEchoBuffs[key],
              modifiers: buff.modifiers,
            };
          }
        }
      });
      console.log(buffs);
      this.$emit("update-buffs", buffs);
    },
  },
};
</script>

<style scoped>
.skilldescription {
  display: inline-block;
}
</style>
