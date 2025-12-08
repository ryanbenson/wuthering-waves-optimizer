<template>
  <div>
    <div
      v-if="buffs"
      class="character__buffs character__resonance-chains p-2"
      data-test-resonance-chains>
      <CalculatorResonanceChainsItem
        v-for="buff in buffs"
        :key="buff.key"
        :unique-key="buff.key"
        :character="character"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"
        class="character__buff character__resonance-chain"
        :data-test-resonance-chain="buff.key"></CalculatorResonanceChainsItem>
    </div>
  </div>
</template>

<script>
import CalculatorResonanceChainsItem from "./CalculatorResonanceChainsItem.vue";
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
    critRate: {
      type: Number,
      default: 0,
    },
  },
  components: { CalculatorResonanceChainsItem },
  data() {
    return {
      buffsData: [],
    };
  },
  watch: {
    buffsFormatted: function () {
      this.updatedStats();
    },
  },
  methods: {
    updatedStats() {
      this.$emit("updated-character-resonance-chains", this.buffsFormatted);
    },
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
  },
  computed: {
    buffsFormatted() {
      // process any buffs that need to be ignored
      /**
       * Augusta s6 CritOverflow overwrites s2 buff
       * SequenceNode2CleansedinCrimsonWar
       * SequenceNode6EngravedinRadiantLight
       */
      if (this.character === "Augusta") {
        // if this is SequenceNode2CleansedinCrimsonWar, check if SequenceNode6EngravedinRadiantLight is enabled, if so, ignore this buff
        if (buffInstance.key === "SequenceNode2CleansedinCrimsonWar") {
          const SequenceNode6EngravedinRadiantLight = this.buffsData.find((buff) => buff.key === "SequenceNode6EngravedinRadiantLight");
          // if the data object is empty, then it's not enabled. but if it has data, hen we skip this buff
          if (SequenceNode6EngravedinRadiantLight && Object.keys(SequenceNode6EngravedinRadiantLight.data).length > 0) {
            return;
          }
        }
      }
      const finalBuffData = {};
      let modifySpecificTalents = [];
      this.buffsData.forEach((buffInstance) => {
        const stat = buffInstance.key;
        const buffDataArr = Object.entries(buffInstance.data);
        buffDataArr.forEach(([stat, value]) => {
          if (stat === "modifySpecificTalents") {
            const updatedSpecificTalentList =
              modifySpecificTalents.concat(value);
            modifySpecificTalents = updatedSpecificTalentList;
          } else if (stat === "CritOverflow") {
            const currentCritRate = this.critRate;
            console.log(currentCritRate, value);
            if (currentCritRate > value.overflowMin) {
              const { modifierValue, overflowStep, overflowMin, overflowMax } =
                overflowConfigs;
              // Calculate how much Crit Rate is overflowing (above 100%)
              const overflowAmount = Math.max(0, currentCritRate - overflowMin);
              // Calculate how many overflow steps we have
              const overflowSteps = Math.floor(overflowAmount / overflowStep);
              // Calculate the Crit DMG bonus from overflow (capped by overflowMax)
              const overflowBonus = Math.min(
                overflowSteps * modifierValue,
                overflowMax,
              );
              // Apply the overflow bonus to Crit DMG
              finalBuffData["critDMG"] = (finalBuffData["critDMG"] || 0) + overflowBonus;
            }
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
            } else if (buffInstance.modifier === "talentReplace") {
              specificTalentBuffs[talentName] = buffInstance.modifierValue;
            } else {
              specificTalentBuffs[talentName] =
                (specificTalentBuffs[talentName] || 0) +
                buffInstance.modifierValueCalculated;
            }
          });
        });
        finalBuffData.specificTalentBuffs = specificTalentBuffs;
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

<style scoped lang="scss"></style>
