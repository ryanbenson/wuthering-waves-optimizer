<template>
  <div>
    <p v-html="details"></p>
    <label v-if="!alwaysEnabled">
      <input type="checkbox" v-model="isEnabled" @change="updatedStats" />
      Enabled?
    </label>
    <span v-if="hasStacks">
      <input
        v-model="stacks"
        type="number"
        :min="minStacks"
        :max="maxStacks"
        @input="ensureMaxStacks"
        @change="updatedStats" />
      Stacks
    </span>
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
    hasStacks: {
      type: Boolean,
      default: false,
    },
    modifier: {
      type: String,
    },
    modifierByRefinement: {
      type: Object,
      default: () => ({}),
    },
    minStacks: {
      type: Number,
      default: 0,
    },
    maxStacks: {
      type: Number,
      default: 0,
    },
    details: {
      type: String,
    },
    alwaysEnabled: {
      type: Boolean,
      default: false,
    },
    refinement: {
      type: String,
    },
    passiveKey: {
      type: String,
    },
  },
  data() {
    return {
      isEnabled: false,
      stacks: 0,
    };
  },
  watch: {
    refinement: "updatedStats",
    isEnabled: "updatedStats",
    stacks: "updatedStats",
  },
  watch: {
    refinement: "updateStats",
    isEnabled: "updateStats",
    stacks: "updateStats",
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterWeaponData"]),
    updateStats() {
      this.setCharacterWeaponData(this.character, {
        weaponPassiveStats: {
          ...this.weaponPassiveStats,
          [this.passiveKey]: this.weaponPassiveStats,
        },
      });
      this.$emit("updated-weapon-stats", this.weaponPassiveStats);
    },
    ensureMaxStacks() {
      if (this.stacks > this.maxStacks) {
        this.stacks = this.maxStacks;
      }
    },
  },
  computed: {
    weaponPassiveStats() {
      const data = {
        stat: this.modifier,
        value: 0,
        key: this.passiveKey,
      };
      if (!this.isEnabled) {
        return data;
      }
      if (!this.hasStacks) {
        data.stat = this.modifier;
        data.value = this.modifierByRefinement[this.refinement];
        return data;
      }
      if (this.hasStacks) {
        if (this.stacks === 0) {
          return data;
        }
        data.stat = this.modifier;
        const totalValue =
          this.modifierByRefinement[this.refinement] * this.stacks;
        data.value = totalValue;
      }
      return data;
    },
  },
  mounted() {
    if (this.alwaysEnabled) {
      this.isEnabled = true;
      this.updateStats();
    }
  },
  beforeUnmount() {
    this.$emit("updated-weapon-stats", {});
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
}
label {
  margin: 1rem 0 0;
  display: inline-block;
}
</style>
