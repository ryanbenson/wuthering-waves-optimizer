<template>
  <div class="character__buff" @click="toggleEnabled">
    <span>{{ name }}</span>
    <div v-html="details"></div>
    <label v-if="!alwaysEnabled" @click.stop
      ><input type="checkbox" class="checkbox" v-model="isEnabled" />
      Enabled?</label
    >
    <span v-if="hasStacks" class="party-buff__stacks" @click.stop>
      <input
        v-model="stacks"
        type="number"
        :min="minStacks"
        :max="maxStacks"
        @input="ensureMaxStacks" />
      Stacks</span
    >
    <div v-if="hasRefinements" class="party-buff__refinement" @click.stop>
      <select name="refinement" v-model="refinement">
        <option v-for="lvl in weaponRefinementLevels" :key="lvl" :value="lvl">
          {{ lvl }}
        </option>
      </select>
      <label for="weaponLevel">Refinement Level</label>
    </div>
    <div v-if="inputBase" class="party-buff__input-base" @click.stop>
      <label for="baseAttrValue">{{ modifierBasedOn }}:</label>
      <input
        type="number"
        id="baseAttrValue"
        name="baseAttrValue"
        v-model="baseAttrValue" />
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
    hasRefinements: {
      type: Boolean,
      default: false,
    },
    inputBase: {
      type: Boolean,
      default: false,
    },
    modifierBasedOn: {
      type: String,
      default: null,
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
    refinement: {
      handler: async function () {
        this.updatedStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    updatedStats() {
      this.$emit("updated-party-buff", {
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
          this.currentCharacter?.teamBuffs?.buffs?.[this.uniqueKey]
            ?.isEnabled ?? false
        );
      },
      async set(value) {
        const data = {
          teamBuffs: {
            buffs: {},
          },
        };
        data.teamBuffs.buffs[this.uniqueKey] = {
          isEnabled: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the refinement state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    refinement: {
      get() {
        return (
          this.currentCharacter?.teamBuffs?.buffs?.[this.uniqueKey]
            ?.refinement ?? 1
        );
      },
      async set(value) {
        const data = {
          teamBuffs: {
            buffs: {},
          },
        };
        data.teamBuffs.buffs[this.uniqueKey] = {
          refinement: value,
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
          this.currentCharacter?.teamBuffs?.buffs?.[this.uniqueKey]?.stacks ?? 0
        );
      },
      async set(value) {
        const data = {
          teamBuffs: {
            buffs: {},
          },
        };
        data.teamBuffs.buffs[this.uniqueKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the refinement state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    baseAttrValue: {
      get() {
        return (
          this.currentCharacter?.teamBuffs?.buffs?.[this.uniqueKey]
            ?.baseAttrValue ?? 0
        );
      },
      async set(value) {
        const data = {
          teamBuffs: {
            buffs: {},
          },
        };
        data.teamBuffs.buffs[this.uniqueKey] = {
          baseAttrValue: value,
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
          // if this buff only applies to specific characters, check the cur character
          if (modifierItem?.specificCharacters?.length) {
            if (!modifierItem.specificCharacters.includes(this.character)) {
              return;
            }
          }
          if (modifierItem?.modifySpecificTalents) {
            if (!data.modifySpecificTalents) {
              data.modifySpecificTalents = [];
            }
            // add our calculated value
            let modifierValue;
            if (this.hasRefinements) {
              modifierValue =
                modifierItem.modifierByRefinement[this.refinement];
            } else {
              modifierValue = modifierItem.modifierValue;
            }
            modifierItem.modifierValueCalculated = modifierValue;
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
          } else if (this.inputBase === true) {
            let base = 0;
            switch (this.modifierBasedOn) {
              case "Energy Regen":
                // TODO: Verify this. Latest is that it is all ER, not added ER
                base = 0;
                break;
              case "CritRate":
                base = 0.05;
                break;
              case "CritDMG":
                base = 1.5;
                break;
              default:
                base = 0;
                break;
            }
            const currentAmount = this.baseAttrValue ?? 0;
            let additionalAmount = (currentAmount - base) / 100;

            // Step 2: Calculate the number of steps of 0.2
            let steps = Math.floor(
              additionalAmount / modifierItem.modifierStep
            );

            // Step 3: Calculate the CritRate buff
            let buffValue = steps * modifierItem.modifierValue;

            // Step 4: Ensure the CritRate buff doesn't exceed the maximum value
            if (buffValue > modifierItem.maximumValue) {
              buffValue = modifierItem.maximumValue;
            }
            if (buffValue < 0) {
              buffValue = 0;
            }
            data[modifierItem.modifier] = buffValue;
          } else {
            let modifierValue;
            if (this.hasRefinements) {
              modifierValue =
                modifierItem.modifierByRefinement[this.refinement];
            } else {
              modifierValue = modifierItem.modifierValue;
            }
            data[modifierItem.modifier] = modifierValue;
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
            let modifierValue;
            if (this.hasRefinements) {
              modifierValue =
                modifierItem.modifierByRefinement[this.refinement];
            } else {
              modifierValue = modifierItem.modifierValue;
            }
            modifierItem.modifierValueCalculated = modifierValue * this.stacks;
            data.modifySpecificTalents.push(modifierItem);
          } else if (modifierItem.modifier === "Talent") {
            const talentRef =
              this.talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
            const talentVal = modifierItem.modifierValue[talentRef];
            data[modifierItem.modifierTalentKey] = talentVal * this.stacks;
          } else {
            let modifierValue;
            if (this.hasRefinements) {
              modifierValue =
                modifierItem.modifierByRefinement[this.refinement];
            } else {
              modifierValue = modifierItem.modifierValue;
            }
            const totalValue = modifierValue * this.stacks;
            data[modifierItem.modifier] = totalValue;
          }
        });
      }
      // shouldn't get here
      return data;
    },
    /**
     * List of options for the refinements options
     * @returns {Array}
     */
    weaponRefinementLevels() {
      return ["1", "2", "3", "4", "5"];
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
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }

  span:first-of-type {
    font-weight: bold;
  }
}
label {
  margin: 1rem 0 0;
  display: inline-block;
}
.party-buff__stacks {
  margin-left: 1rem;
}
.party-buff__refinement {
  label {
    margin-left: 0.5rem;
  }
}
.party-buff__input-base {
  label {
    margin-right: 0.5rem;
  }
}
</style>
