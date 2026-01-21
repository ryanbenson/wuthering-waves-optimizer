<template>
  <div
    class="optimizer-echo-set card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h3 class="card-title text-lg">{{ name }}</h3>

      <div @click="toggleEnabled">
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
                :data-test-optimizer-main-echo-passive-enabled="echoKey" />
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
                :data-test-main-echo-stacks="echoKey" />
              <span class="label-text ml-2">Stacks</span>
              <span class="ml-1 text-sm italic">(Max {{ maxStacks }})</span>
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
import { character } from "../characters/Aalto/character";
export default {
  name: "CalculatorOptimizerMainEcho",
  props: {
    character: {
      type: String,
      required: true,
    },
    echoKey: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    echoClass: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    modifiers: {
      type: Array,
      required: true,
    },
    sets: {
      type: Array,
      required: true,
    },
    actions: {
      type: Array,
      default: () => [],
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
     * @emits updated-main-echo-buffs
     */
    async updateStats() {
      this.$emit("updated-main-echo-buffs", {
        stats: this.buffStats,
        key: this.echoKey,
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
          this.currentCharacter?.optimizer?.mainEchoBuffs?.[this.echoKey]
            ?.isEnabled ?? false
        );
      },
      async set(value) {
        const data = {
          optimizer: {
            mainEchoBuffs: {},
          },
        };
        data.optimizer.mainEchoBuffs[this.echoKey] = {
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
          this.currentCharacter?.optimizer?.mainEchoBuffs?.[this.echoKey]
            ?.stacks ?? 0
        );
      },
      async set(value) {
        const data = {
          optimizer: {
            mainEchoBuffs: {},
          },
        };
        data.optimizer.mainEchoBuffs[this.echoKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
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
          // if it has buffs for specific characters, validate that first
          const specificCharacters = modifierItem?.specificCharacters ?? [];
          if (specificCharacters.length > 0) {
            // check if the current character key is in the list
            const isValidCharacter = specificCharacters.includes(
              this.character,
            );
            if (!isValidCharacter) {
              return; // skip this modifier
            }
          }
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
            // if the same modifier appears multiple times, they should add up
            if (data[modifierItem.modifier]) {
              data[modifierItem.modifier] += modifierItem.modifierValue * 100;
            } else {
              data[modifierItem.modifier] = modifierItem.modifierValue * 100;
            }
          }
        });
      } else if (this.hasStacks) {
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
            data[modifierItem.modifier] = totalValue * 100;
          }
        });
      }
      let modifySpecificTalentsData = {};
      // process the modifySpecificTalents
      data.modifySpecificTalents?.forEach((talentModifier) => {
        const talentList = talentModifier?.modifySpecificTalents ?? [];
        talentList.forEach((talent) => {
          let key = `${talent}`;
          if (talent.modifier) {
            key = `${key}:${talent.modifier}`;
          }
          modifySpecificTalentsData[key] =
            talentModifier.modifierValueCalculated;
        });
      });
      data.specificTalentBuffs = modifySpecificTalentsData;
      return data;
    },
  },
  beforeUnmount() {
    this.$emit("updated-main-echo-buffs", {
      stats: {},
      key: this.echoKey,
    });
  },
};
</script>
