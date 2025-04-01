<template>
  <div class="action__buff pb-4">
    <select
      v-model="modifierType"
      @change="onModifierUpdate"
      class="select select-bordered select-xs w-full"
      :data-test-action-buff-input="modifier ?? 'none'">
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
      id="modifierValueInput"
      class="input input-xs input-bordered w-24"
      @input="onModifierValueUpdate"
      :data-test-action-buff-value-input="modifier ?? 'none'" />
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
    id: {
      type: String,
      required: true,
    },
    modifier: {
      type: String,
      default: null,
    },
    modifierValue: {
      type: [Number, String],
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
      // add in Damage Deepen. It's a buff we want, but not from echo substats
      allModifiers.push(["DMGDeepen", "Damage Amplify"]);
      // also add in resist shred
      allModifiers.push(["ResistShred", "Resist Reduction"])
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
      this.$emit("remove-buff", this.id);
    },
    onModifierUpdate(e) {
      this.$emit("updated-buff", {
        id: this.id,
        modifier: e.target.value,
        modifierValue: this.modifierValueInput,
      });
    },
    onModifierValueUpdate(e) {
      this.$emit("updated-buff", {
        id: this.id,
        modifier: this.modifierType,
        modifierValue: e.target.value,
      });
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
.delete {
  margin-top: 0.3rem;
  svg {
    width: 1rem;
    height: 1rem;
  }
}
html[data-theme="light"] {
  .delete {
    svg {
      filter: invert(100%);
    }
  }
}
</style>
