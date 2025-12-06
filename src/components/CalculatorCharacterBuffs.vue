<template>
  <div>
    <div v-if="buffs" class="character__buffs p-2">
      <CalculatorCharacterBuff
        v-for="buff in buffs"
        :key="buff.key"
        :character="character"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        :energy-regen="energyRegen"
        :crit-rate="critRate"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"></CalculatorCharacterBuff>
    </div>
  </div>
</template>

<script>
import { mapState } from "pinia";
import CalculatorCharacterBuff from "./CalculatorCharacterBuff.vue";
import { useCharacterStore } from "../stores/character";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    buffs: {
      type: Array,
      default: () => [],
    },
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
  components: { CalculatorCharacterBuff },
  data() {
    return {
      buffsData: [],
      triggerBuffUpdate: 0, // used to force reactivity
    };
  },
  watch: {
    buffsFormatted: function () {
      this.updatedStats();
    },
  },
  methods: {
    /**
     * Emits the buff data in its proper format
     * @emits updated-character-buffs
     */
    updatedStats() {
      this.$emit("updated-character-buffs", this.buffsFormatted);
    },
    /**
     * Handler for when the child components has buff data for us to consume
     * @param {Object} buffInfo
     */
    handleUpdatedCharacterBuff(buffInfo) {
      const buffIndex = this.buffsData.findIndex((buff) => {
        return buff.key === buffInfo.key;
      });
      if (buffIndex === -1) {
        this.buffsData.push(buffInfo);
      } else {
        this.buffsData[buffIndex] = buffInfo;
      }
    },
    retriggerBuffCalculations() {
      this.triggerBuffUpdate++; // increment to force reactivity
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
     * Transformer to take all of the buffs we have, which can overlap
     * and merge them together to provide an aggregated list of buffs
     * in a hashmap to the parent to process in stats and damage
     * @returns {Object}
     */
    buffsFormatted() {
      if (this.triggerBuffUpdate) {
        // will force reactivity
      }
      const finalBuffData = {};
      let modifySpecificTalents = [];
      this.buffsData.forEach((buffInstance) => {
        // TODO: implement the replacedBy logic
        if (this.character === "Jiyan") {
          if (buffInstance.key === "ForteCircuitQingloongatWar1") {
            // if we have buffsData[]{key: "ForteCircuitQingloongatWar2"}, skip this buff
            const hasForteCircuitQingloongatWar2 = this.buffsData.find(
              (buff) => buff.key === "ForteCircuitQingloongatWar2",
            );
            // hasForteCircuitQingloongatWar2 must have properties in "data" to be considered valid
            // if it has no data, we can skip this buff

            if (
              hasForteCircuitQingloongatWar2 &&
              Object.keys(hasForteCircuitQingloongatWar2.data).length > 0
            ) {
              return; // skip this buff for Jiyan
            }
          }
        }
        

      if (this.character === "Brant") {
        // if this is TheatricalMoment, check if MyMoment, if so, ignore this buff
        if (buffInstance.key === "TheatricalMoment") {
          const hasMyMomentBuffEnabled = this.buffsData.find((buff) => buff.key === "MyMoment");
          // if the data object is empty, then it's not enabled. but if it has data, hen we skip this buff
          if (hasMyMomentBuffEnabled && Object.keys(hasMyMomentBuffEnabled.data).length > 0) {
            return;
          }
        }
      }
        const stat = buffInstance.key;
        const buffDataArr = Object.entries(buffInstance.data);
        buffDataArr.forEach(([stat, value]) => {
          if (stat === "modifySpecificTalents") {
            const updatedSpecificTalentList =
              modifySpecificTalents.concat(value);
            modifySpecificTalents = updatedSpecificTalentList;
          } else if (stat === "EnableAttack") {
            if (Array.isArray(finalBuffData[stat])) {
              finalBuffData[stat].push(...value);
            } else {
              finalBuffData[stat] = [...value];
            }
          } else {
            finalBuffData[stat] = (finalBuffData[stat] || 0) + value;
          }
        });
      });
      // format any specific talents
      if (modifySpecificTalents.length > 0) {
        const specificTalentBuffs = {};
        // make it { talentKey: value }, if it has a modifier (e.g. DefIgnore), attach it to the talent
        // so it won't auto buff, and we can grab it later
        modifySpecificTalents.forEach((buffInstance) => {
          const talentKeys = buffInstance?.modifySpecificTalents ?? [];
          talentKeys.forEach((talent) => {
            let talentName = talent;
            if (buffInstance?.modifier) {
              talentName = `${talentName}:${buffInstance.modifier}`;
            }
            if (buffInstance.modifier === "talentTypeOverride") {
              specificTalentBuffs[talentName] =
                (specificTalentBuffs[talentName] || "") +
                buffInstance.modifierValueCalculated;
            } else {
              specificTalentBuffs[talentName] =
                (specificTalentBuffs[talentName] || 0) +
                buffInstance.modifierValueCalculated;
            }
          });
        });
        finalBuffData.specificTalentBuffs = specificTalentBuffs;
      }
      if (this.character === "Lupa" && finalBuffData.specificTalentBuffs) {
        if (
          this.currentCharacter?.resonanceChains
            ?.SequenceNode6TotheBrightestFlamingStar?.isEnabled
        ) {
          // copy the same buffs for NowheretoRunDMG from the other intro
          const atk =
            finalBuffData.specificTalentBuffs?.[`TryFocusingEhDMG:ATK`];
          const fusion =
            finalBuffData?.specificTalentBuffs?.[`TryFocusingEhDMG:Fusion`];
          const resistReduction =
            finalBuffData?.specificTalentBuffs?.[
              `TryFocusingEhDMG:ResistShred:Fusion`
            ];
          finalBuffData.specificTalentBuffs["NowheretoRunDMG:ATK"] = atk || 0;
          finalBuffData.specificTalentBuffs["NowheretoRunDMG:Fusion"] =
            fusion || 0;
          finalBuffData.specificTalentBuffs[
            "NowheretoRunDMG:ResistShred:Fusion"
          ] = resistReduction || 0;
        }
      }
      return finalBuffData;
    },
  },
  mounted() {
    this.updatedStats();
  },
  beforeUnmount() {
    this.$emit("updated-character-buffs", {});
  },
};
</script>

<style scoped lang="scss">
.character__buff {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}
html[data-theme="light"] {
  .character__buff {
    background-color: #f8f8f8;
  }
}
</style>
