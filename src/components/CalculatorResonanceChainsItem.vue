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
              :max="maxStacks"
              @input="ensureMaxStacks" />
            <span class="label-text ml-2">Stacks</span>
            <span class="ml-1 text-sm italic">(Max {{ maxStacks }})</span>
          </label>
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
    talentData: {
      type: Object,
      default: () => {},
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
    buffStats: function () {
      this.updatedStats();
    },
    isEnabled: {
      handler: async function () {
        this.updatedStats();
      },
      immediate: true,
    },
    stacks: {
      handler: async function () {
        this.updatedStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    updatedStats() {
      this.$emit("updated-character-buff", {
        key: this.uniqueKey,
        data: this.buffStats,
      });
    },
    ensureMaxStacks() {
      if (this.stacks > this.maxStacks) {
        this.stacks = this.maxStacks;
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
          this.currentCharacter?.resonanceChains?.[this.uniqueKey]?.isEnabled ??
          false
        );
      },
      async set(value) {
        const data = {
          resonanceChains: {},
        };
        data.resonanceChains[this.uniqueKey] = {
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
          this.currentCharacter?.resonanceChains?.[this.uniqueKey]?.stacks ?? 0
        );
      },
      async set(value) {
        const data = {
          resonanceChains: {},
        };
        data.resonanceChains[this.uniqueKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
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
          } else if (modifierItem.modifier === "talentModifierMultiply") {
            // for buffs that apply talentModifierMultiply to the calcs
            if (!data.talentModifierMultiply) {
              data.talentModifierMultiply = [];
            }
            data.talentModifierMultiply.push(modifierItem);
          } else if (modifierItem.modifier === "talentReplace") {
            if (!data.talentReplace) {
              data.talentReplace = [];
            }
            data.talentReplace.push(modifierItem);
          } else if (
            modifierItem.modifier === "talentModifierSpecialMultiply"
          ) {
            // for buffs that apply talentModifierMultiply to the calcs
            if (!data.talentModifierSpecialMultiply) {
              data.talentModifierSpecialMultiply = [];
            }
            data.talentModifierSpecialMultiply.push(modifierItem);
          } else if (
            modifierItem.modifier === "talentModifierMultiplySetValue"
          ) {
            // for buffs that apply talentModifierMultiply to the calcs
            if (!data.talentModifierMultiplySetValue) {
              data.talentModifierMultiplySetValue = [];
            }
            data.talentModifierMultiplySetValue.push(modifierItem);
          } else if (stat === "CritOverflow") {
            const currentCritRate = this.critRate;
            console.log(currentCritRate, modifierItem);
            if (currentCritRate > value.overflowMin) {
              const { modifierValue, overflowStep, overflowMin, overflowMax } =
                modifierItem;
              // Calculate how much Crit Rate is overflowing (above 100%)
              const overflowAmount = Math.max(0, currentCritRate - overflowMin);
              // Calculate how many overflow steps we have
              const overflowSteps = Math.floor(overflowAmount / overflowStep);
              // Calculate the Crit DMG bonus from overflow (capped by overflowMax)
              const overflowBonus = Math.min(
                overflowSteps * modifierValue,
                overflowMax,
              );
              console.log(currentCritRate, overflowAmount, overflowSteps, overflowBonus);
              // Apply the overflow bonus to Crit DMG
              data["critDMG"] = overflowBonus;
            }
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
  mounted() {
    if (this.alwaysEnabled === true) {
      this.isEnabled = true;
    }
  },
};
</script>

<style scoped lang="scss">
.character__buff {
  cursor: pointer;
}
.shadow {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>
