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
    return {};
  },
  watch: {
    // we're using immediate so it'll react when we get data from the store
    refinement: {
      handler: async function () {
        this.updateStats();
      },
      immediate: true,
    },
    isEnabled: {
      handler: async function () {
        this.updateStats();
      },
      immediate: true,
    },
    stacks: {
      handler: async function () {
        this.updateStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    /**
     * Updates the stats for the passive and emits up to the parent
     * @emits updated-weapon-stats
     */
    updateStats() {
      this.setCharacterData(this.character, {
        weaponPassiveStats: {
          ...this.weaponPassiveStats,
          [this.passiveKey]: this.weaponPassiveStats,
        },
      });
      this.$emit("updated-weapon-stats", this.weaponPassiveStats);
    },
    /**
     * Prevents the user from exceeding the max stacks
     */
    ensureMaxStacks() {
      if (this.stacks > this.maxStacks) {
        this.stacks = this.maxStacks;
      }
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
     * Getter/setter used in the form for the isEnabled state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    isEnabled: {
      get() {
        return (
          this.currentCharacter?.weaponPassives?.[this.passiveKey]?.isEnabled ??
          false
        );
      },
      async set(value) {
        const data = {
          weaponPassives: {},
        };
        data.weaponPassives[this.passiveKey] = {
          isEnabled: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the stacks count state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    stacks: {
      get() {
        return (
          this.currentCharacter?.weaponPassives?.[this.passiveKey]?.stacks ?? 0
        );
      },
      async set(value) {
        const data = {
          weaponPassives: {},
        };
        data.weaponPassives[this.passiveKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Compiles the stats for this passive
     * @returns {Object}
     */
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
