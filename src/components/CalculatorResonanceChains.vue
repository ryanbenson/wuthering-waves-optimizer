<template>
  <div>
    <div v-if="buffs" class="character__buffs">
      <CalculatorResonanceChainsItem
        v-for="buff in buffs"
        :key="buff.key"
        :unique-key="buff.key"
        :name="buff.name"
        :details="buff.details"
        :always-enabled="buff.alwaysEnabled"
        :has-stacks="buff.hasStacks"
        :min-stacks="buff.minStacks"
        :max-stacks="buff.maxStacks"
        :modifiers="buff.modifiers"
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"
        class="character__buff"></CalculatorResonanceChainsItem>
    </div>
  </div>
</template>

<script>
import CalculatorResonanceChainsItem from "./CalculatorResonanceChainsItem.vue";
export default {
  props: {
    buffs: {
      type: Array,
      default: () => [],
    },
    talentData: {
      type: Object,
      default: () => {},
    },
  },
  components: { CalculatorResonanceChainsItem },
  data() {
    return {
      isEnabled: false,
      stacks: 0,
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
            specificTalentBuffs[talentName] =
              (specificTalentBuffs[talentName] || 0) +
              buffInstance.modifierValue;
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

<style scoped>
.character__buff {
  margin-top: 1rem;
}
</style>
