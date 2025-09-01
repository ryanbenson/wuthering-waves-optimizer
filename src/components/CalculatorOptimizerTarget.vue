<template>
  <select
    v-model="optimizationTarget"
    class="select select-bordered select-sm w-full max-w-xs">
    <option disabled :value="null">Select target</option>
    <optgroup
      v-for="target in Object.entries(optimizationTargets)"
      :label="target[0]"
      :key="target[0]">
      <option v-for="t in target[1]" :key="t.key" :value="`Stat:${t.key}`">
        {{ t.label }}
      </option>
    </optgroup>
    <optgroup label="Basic" data-skill="basic">
      <option
        v-for="attack in basicAttacksList"
        :value="`Attack:${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Skill" data-skill="skill">
      <option
        v-for="attack in skillAttacksList"
        :value="`Attack:${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Forte Circuit" data-skill="forteCircuit">
      <option
        v-for="attack in forteCircuitAttacksList"
        :value="`Attack:${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Liberation" data-skill="liberation">
      <option
        v-for="attack in liberationAttacksList"
        :value="`Attack:${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Intro" data-skill="intro" v-if="introAttacksList.length">
      <option
        v-for="attack in introAttacksList"
        :value="`Attack:${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Outro" data-skill="outro" v-if="outroAttacksList.length">
      <option
        v-for="attack in outroAttacksList"
        :value="`Attack:${attack.key}`">
        {{ attack.label }}
      </option>
    </optgroup>
    <optgroup label="Rotations" v-if="rotations.length > 0">
      <option
        v-for="rotation in rotations"
        :key="rotation.id"
        :value="`Rotation:${rotation.id}`">
        {{ rotation.name }}
      </option>
    </optgroup>
  </select>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { getCharByName } from "../characters/characters.ts";
export default {
  name: "CalculatorOptimizerTarget",
  props: {
    character: {
      type: String,
      required: true,
    },
    currentOptimizationTarget: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      characterData: {},
      optimizationTarget: null,
    };
  },
  watch: {
    optimizationTarget() {
      this.updatedTarget();
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
    optimizationTargets() {
      return {
        Stats: [
          { key: "totalHp", label: "HP" },
          { key: "totalAtk", label: "ATK" },
          { key: "totalDef", label: "DEF" },
          { key: "totalCritRate", label: "Crit Rate" },
          { key: "totalCritDMG", label: "Crit DMG" },
          { key: "energyRegen", label: "Energy Regen" },
        ],
      };
    },
    basicAttacksList() {
      return this.characterData?.basicAttacks?.attacks ?? [];
    },
    skillAttacksList() {
      return this.characterData?.skillAttacks?.attacks ?? [];
    },
    forteCircuitAttacksList() {
      return this.characterData.forteCircuitAttacks?.attacks ?? [];
    },
    liberationAttacksList() {
      return this.characterData?.liberationAttacks?.attacks ?? [];
    },
    introAttacksList() {
      return this.characterData?.introAttacks?.attacks ?? [];
    },
    outroAttacksList() {
      return this.characterData?.outroAttacks?.attacks ?? [];
    },
    rotations() {
      return this.currentCharacter?.rotations ?? [];
    },
  },
  methods: {
    /**
     * Update the target in the store when changed
     */
    async updatedTarget() {
      this.$emit("optimizer:target-updated", this.optimizationTarget);
    },
  },
  async mounted() {
    this.optimizationTarget = this.currentOptimizationTarget;
    this.characterData = await getCharByName(this.character);
  },
  beforeUnmount() {
    this.characterData = {};
  },
};
</script>
