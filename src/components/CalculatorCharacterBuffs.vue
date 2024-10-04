<template>
  <div>
    <div v-if="buffs" class="character__buffs">
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
        @updated-character-buff="handleUpdatedCharacterBuff"
        :talent-data="talentData"></CalculatorCharacterBuff>
    </div>
  </div>
</template>

<script>
import CalculatorCharacterBuff from "./CalculatorCharacterBuff.vue";
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
  },
  components: { CalculatorCharacterBuff },
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
  },
  computed: {
    /**
     * Transformer to take all of the buffs we have, which can overlap
     * and merge them together to provide an aggregated list of buffs
     * in a hashmap to the parent to process in stats and damage
     * @returns {Object}
     */
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
            specificTalentBuffs[talentName] =
              (specificTalentBuffs[talentName] || 0) +
              buffInstance.modifierValueCalculated;
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

<style scoped lang="scss">
.character__buff {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }
}
</style>
