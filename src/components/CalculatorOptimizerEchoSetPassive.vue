<template>
  <div
    :class="{ 'weapon-passive': !alwaysEnabled }"
    @click="toggleEnabled"
    :data-test-echo-set-passive="passiveKey">
    <div v-html="details"></div>
    <div class="flex gap-2 items-center">
      <div class="form-control" @click.stop>
        <label
          class="label inline-flex justify-start pl-0"
          :class="{ 'cursor-pointer': !alwaysEnabled }">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            v-model="isEnabled"
            @change="updatedStats"
            :disabled="alwaysEnabled"
            :data-test-echo-set-passive-enabled="passiveKey" />
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
            :max="maxStacks"
            @input="ensureMaxStacks"
            @change="updatedStats"
            :data-test-echo-set-stacks="passiveKey" />
          <span class="label-text ml-2">Stacks</span>
          <span class="ml-1 text-sm italic">(Max {{ maxStacks }})</span>
        </label>
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
    hasStacks: {
      type: Boolean,
      default: false,
    },
    modifier: {
      type: String,
    },
    modifierValue: {
      type: Number,
      default: 0,
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
    passiveKey: {
      type: String,
    },
    modifiers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  watch: {
    isEnabled: {
      handler: async function (val) {
        await this.updateStats();
      },
      immediate: true,
    },
    stacks: {
      handler: async function () {
        await this.updateStats();
      },
      immediate: true,
    },
    alwaysEnabled: {
      handler: async function (val) {
        if (val === true) {
          this.isEnabled = true;
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    /**
     * Updates the stats for the passive and emits up to the parent
     * @emits updated-echo-passive-stats
     */
    async updateStats() {
      this.$emit("updated-optimizer-echo-passive-stats", {
        stats: this.buffStats,
        key: this.passiveKey,
      });
    },
    /**
     * Prevents the user from exceeding the max stacks
     */
    ensureMaxStacks() {
      if (this.stacks > this.maxStacks) {
        this.stacks = this.maxStacks;
      }
    },
    toggleEnabled() {
      if (this.alwaysEnabled) {
        return;
      }
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
          this.currentCharacter?.optimizer.echoSetPassives?.[this.passiveKey]
            ?.isEnabled ?? false
        );
      },
      async set(value) {
        const data = {
          optimizer: {
            echoSetPassives: {},
          },
        };
        data.optimizer.echoSetPassives[this.passiveKey] = {
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
          this.currentCharacter?.optimizer.echoSetPassives?.[this.passiveKey]
            ?.stacks ?? 0
        );
      },
      async set(value) {
        const data = {
          optimizer: {
            echoSetPassives: {},
          },
        };
        data.optimizer.echoSetPassives[this.passiveKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Compiles the stats for this passive
     * @returns {Object}
     */
    // weaponPassiveStats() {
    //   const data = {
    //     stat: this.modifier,
    //     value: 0,
    //     key: this.passiveKey,
    //   };
    //   if (!this.isEnabled) {
    //     return data;
    //   }
    //   if (!this.hasStacks) {
    //     data.stat = this.modifier;
    //     data.value = this.modifierValue;
    //     return data;
    //   }
    //   if (this.hasStacks) {
    //     if (this.stacks === 0) {
    //       return data;
    //     }
    //     data.stat = this.modifier;
    //     const totalValue = this.modifieValue * this.stacks;
    //     data.value = totalValue;
    //   }
    //   return data;
    // },

    /**
     * Transforms the buffs data into a hashmap of buffModifider : buffValue
     * That gets sent throughout the calculator to reflect in the stats and damages
     * @returns {Object}
     */
    buffStats() {
      const data = {};
      if (!this.isEnabled) {
        return data;
      }
      if (!this.hasStacks) {
        this.modifiers.forEach((modifierItem) => {
          if (modifierItem?.modifySpecificTalents) {
            if (!data.modifySpecificTalents) {
              data.modifySpecificTalents = [];
            }
            // add our calculated value
            modifierItem.modifierValueCalculated = modifierItem.modifierValue;
            data.modifySpecificTalents.push(modifierItem);
          } else if (modifierItem.modifier === "Talent") {
            // this is the rare case where the modifier value needs a reference to another talent level
            // specifically Jinhsi incandescence buff scales off of her forte talent
            const talentRef =
              this.talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
            const talentVal = modifierItem.modifierValue[talentRef];
            data[modifierItem.modifierTalentKey] = talentVal;
          } else if (modifierItem.modifier === "EnableAttack") {
            data[modifierItem.modifier] = modifierItem.modifierValue;
          } else if (modifierItem.modifier === "talentModifierMultiply") {
            // for buffs that apply talentModifierMultiply to the calcs
            if (!data.talentModifierMultiply) {
              data.talentModifierMultiply = [];
            }
            data.talentModifierMultiply.push(modifierItem);
          } else {
            data[modifierItem.modifier] = modifierItem.modifierValue;
          }
        });
        return data;
      }
      if (this.hasStacks) {
        if (this.stacks === 0) {
          return data;
        }
        this.modifiers.forEach((modifierItem) => {
          if (modifierItem?.modifySpecificTalents) {
            if (!data.modifySpecificTalents) {
              data.modifySpecificTalents = [];
            }
            // updadate modifer value with the value * stacks
            modifierItem.modifierValueCalculated =
              modifierItem.modifierValue * this.stacks;
            data.modifySpecificTalents.push(modifierItem);
          } else if (modifierItem.modifier === "Talent") {
            const talentRef =
              this.talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
            const talentVal = modifierItem.modifierValue[talentRef];
            data[modifierItem.modifierTalentKey] = talentVal * this.stacks;
          } else {
            const totalValue = modifierItem.modifierValue * this.stacks;
            data[modifierItem.modifier] = totalValue;
          }
        });
      }
      return data;
    },
  },
  beforeUnmount() {
    this.$emit("updated-echo-passive-stats", {
      stats: {},
      key: this.passiveKey,
    });
  },
};
</script>

<style scoped lang="scss">
.weapon-passive {
  cursor: pointer;
}
</style>
