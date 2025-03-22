<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
    @click="toggleEnabled"
    :data-test-party-buff="uniqueKey">
    <div class="card-body">
      <div class="character__buff">
        <h2 class="card-title" :data-test-party-buff-title="uniqueKey">{{ name }}</h2>
        <div v-html="details"></div>
        <div class="flex gap-2 items-center">
          <div class="form-control" @click.stop>
            <label
              class="label cursor-pointer inline-flex justify-start pl-0"
              v-if="!alwaysEnabled">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                v-model="isEnabled"
                @change="updatedStats"
                :data-test-party-buff-enabled="uniqueKey" />
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
                :data-test-party-buff-stacks="uniqueKey" />
              <span class="label-text ml-2">Stacks</span>
            </label>
          </div>

          <div v-if="hasRefinements" class="form-control" @click.stop>
            <label class="label cursor-pointer inline-flex justify-start">
              <span class="label-text mr-2">Refinement Level</span>
              <select
                name="refinement"
                class="select select-bordered select-xs"
                v-model="refinement"
                :data-test-party-refinements="uniqueKey">
                <option
                  v-for="lvl in weaponRefinementLevels"
                  :key="lvl"
                  :value="lvl">
                  {{ lvl }}
                </option>
              </select>
            </label>
          </div>

          <div v-if="inputBase" class="form-control" @click.stop>
            <label class="label cursor-pointer inline-flex justify-start">
              <span class="label-text mr-2">{{ modifierBasedOn }}</span>
              <input
                type="number"
                id="baseAttrValue"
                name="baseAttrValue"
                class="input input-bordered input-xs"
                v-model="baseAttrValue"
                :data-test-party-buff-input-base="uniqueKey" />
            </label>
          </div>
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
          } else if (modifierItem.modifier === "EnableAttack") {
            if (Array.isArray(data[modifierItem.modifier])) {
              data[modifierItem.modifier].push(...modifierItem.modifierValue);
            } else {
              data[modifierItem.modifier] = [...modifierItem.modifierValue];
            }
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
                base = modifierItem?.minStatValue ?? 0;
                break;
              case "CritRate":
                base = modifierItem?.minStatValue ?? 0.05;
                break;
              case "CritDMG":
                base = modifierItem?.minStatValue ?? 1.5;
                break;
              default:
                base = modifierItem?.minStatValue ?? 0;
                break;
            }
            const currentAmount = this.baseAttrValue ?? 0;
            let additionalAmount = (currentAmount - base) / 100;

            // Step 2: Calculate the number of steps of 0.2
            let steps = Math.floor(
              additionalAmount / modifierItem.modifierStep,
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

<style scoped lang="scss"></style>
