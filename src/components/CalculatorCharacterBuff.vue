<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
    @click="toggleEnabled">
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <div v-html="details"></div>
      <div class="flex gap-2 items-center">
        <div class="form-control" @click.stop>
          <label
            class="label inline-flex justify-start"
            :class="{ 'cursor-pointer': !alwaysEnabled }">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              v-model="isEnabled"
              :disabled="alwaysEnabled" />
            <span class="label-text ml-2">Enabled?</span>
          </label>
        </div>
        <div v-if="hasStacks" class="form-control" @click.stop>
          <label
            class="label cursor-pointer inline-flex justify-start"
            v-if="!alwaysEnabled">
            <input
              v-model="stacks"
              type="number"
              class="input input-bordered input-xs"
              :min="minStacks"
              :max="effectiveBuffData.effectiveMaxStacks"
              @input="ensureMaxStacks" />
            <span class="label-text ml-2">Stacks</span>
            <span class="ml-1 text-sm italic">
              (Max {{ effectiveBuffData.effectiveMaxStacks }})
            </span>
          </label>
        </div>
      </div>
      <!-- Debug info to show effective values -->
      <div
        v-if="false && hasStacks && isEnabled"
        class="text-xs text-gray-500 mt-2">
        <div>Base stacks: {{ stacks }}</div>
        <div>Base max stacks: {{ maxStacks }}</div>
        <div>
          Effective max stacks: {{ effectiveBuffData.effectiveMaxStacks }}
        </div>
        <div>
          Effective modifiers: {{ effectiveBuffData.effectiveModifiers.length }}
        </div>
      </div>
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
    name: {
      type: String,
    },
    uniqueKey: {
      type: String,
    },
    details: {
      type: String,
    },
    alwaysEnabled: {
      type: Boolean,
      default: false,
    },
    hasStacks: {
      type: Boolean,
      default: false,
    },
    minStacks: {
      type: Number,
      default: 0,
    },
    maxStacks: {
      type: Number,
      default: 0,
    },
    modifiers: {
      type: Array,
      default: () => [],
    },
    // used in rare buffs that are based on a talent level
    // e.g. Incandescence for Jinhsi
    talentData: {
      type: Object,
      default: () => {},
    },
    energyRegen: {
      type: Number,
      default: 0,
    },
    critRate: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  watch: {
    // buffStats: function () {
    //   this.updatedStats();
    // },
    isEnabled: {
      handler: async function () {
        this.updatedStats();
      },
      immediate: true,
    },
    stacks: {
      handler: function () {
        // Use nextTick to ensure the DOM has updated before recalculating
        this.$nextTick(() => {
          this.updatedStats();
        });
      },
      immediate: true,
    },
    // Watch for changes in resonance chains to recalculate buff stats
    "currentCharacter.resonanceChains.SequenceNode1StainedinScorchedEarth.isEnabled":
      {
        handler: function () {
          this.updatedStats();
        },
        immediate: true,
      },
    "currentCharacter.resonanceChains.SequenceNode6EngravedinRadiantLight.isEnabled":
      {
        handler: function () {
          this.updatedStats();
        },
        immediate: true,
      },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    /**
     * Updates the parent with the buff data
     * @emits updated-character-buff
     */
    updatedStats() {
      this.$emit("updated-character-buff", {
        key: this.uniqueKey,
        // data: this.buffStats,
      });
    },
    /**
     * Ensures a user can't exceed the effective max stacks
     */
    ensureMaxStacks() {
      if (this.stacks > this.effectiveBuffData.effectiveMaxStacks) {
        this.stacks = this.effectiveBuffData.effectiveMaxStacks;
      }
    },
    toggleEnabled() {
      this.isEnabled = !this.isEnabled;
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
          this.currentCharacter?.buffs?.[this.uniqueKey]?.isEnabled ?? false
        );
      },
      async set(value) {
        const data = {
          buffs: {},
        };
        data.buffs[this.uniqueKey] = {
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
        const stacks =
          this.currentCharacter?.buffs?.[this.uniqueKey]?.stacks ?? 0;
        return stacks;
      },
      async set(value) {
        const data = {
          buffs: {},
        };
        data.buffs[this.uniqueKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Calculates the effective max stacks and modifiers based on resonance chain interactions
     * @returns {Object} Object containing effectiveMaxStacks, effectiveModifiers, and effectiveStacks
     */
    effectiveBuffData() {
      // Start with the base configuration from props
      let effectiveMaxStacks = this.maxStacks || 1; // Default to 1 if no maxStacks set
      let effectiveModifiers = [...this.modifiers];
      let effectiveStacks = this.stacks || 0; // Use the actual user input stacks

      // this only applies to CrownofWills on Augusta
      if (this.character === "Augusta" && this.uniqueKey === "CrownofWills") {
        // Check if resonance chain buffs are enabled and apply their effects
        const sequenceNode1 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode1StainedinScorchedEarth;
        const sequenceNode6 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode6EngravedinRadiantLight;

        // Apply SequenceNode1 effects if enabled
        if (sequenceNode1?.isEnabled) {
          effectiveMaxStacks = 2;
        }

        // Apply SequenceNode6 effects if enabled
        if (sequenceNode6?.isEnabled) {
          effectiveMaxStacks = 4;
        }
      }

      const result = {
        effectiveMaxStacks,
        effectiveModifiers,
        effectiveStacks,
      };
      return result;
    },
  },
  mounted() {
    if (this.alwaysEnabled === true) {
      this.isEnabled = true;
    }
  },
};
</script>

<style scoped lang="scss">
.shadow {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>
