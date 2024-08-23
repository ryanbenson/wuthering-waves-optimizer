<template>
  <div class="action__buff">
    <select v-model="modifierType">
      <option
        v-for="option in modifierOptions"
        :value="option.key"
        :disabled="option.disabled">
        {{ option.label }}
      </option>
    </select>
    <input
      v-model="modifierValueInput"
      type="number"
      name="modifierValueInput"
      id="modifierValueInput" />
    <div class="delete" @click="removeBuff">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
          fill="#FFFFFF" />
      </svg>
    </div>
  </div>
</template>

<script>
import { subStatLabelMap, getReadableSubStatLabel } from "../echoes/stats";
export default {
  props: {
    modifier: {
      type: String,
      default: null,
    },
    modifierValue: {
      type: Number,
      default: null,
    },
    allBuffs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      modifierType: null,
      modifierValueInput: null,
    };
  },
  computed: {
    modifierOptions() {
      const modifierOptionsList = [];
      const allModifiers = Object.entries(subStatLabelMap);
      allModifiers.forEach((modifier) => {
        const [key, label] = modifier;
        // find if this key is anywhere in the full list. if so, mark it as disabled
        // Array.some will return a Boolean
        const isFound = this.allBuffs.some((allBuffItem) => {
          return allBuffItem.modifier === key;
        });
        modifierOptionsList.push({ key, label, disabled: isFound });
      });
      return modifierOptionsList;
    },
  },
  methods: {
    removeBuff() {
      this.$emit("remove-buff", this.modifierType);
    },
  },
  mounted() {
    this.modifierType = this.modifier;
    this.modifierValueInput = this.modifierValue;
  },
};
</script>

<style scoped lang="scss">
.action__buff {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
select,
input {
  display: block;
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0.3rem;
  background-color: #36415b;
}
input {
  padding: 0.395rem 0.5rem;
}
.delete {
  margin-top: 0.3rem;
  svg {
    width: 1rem;
    height: 1rem;
  }
}
</style>
