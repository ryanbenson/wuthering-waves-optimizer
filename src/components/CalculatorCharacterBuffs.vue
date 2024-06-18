<template>
  <div>
    <div v-if="buffs" class="character__buffs">
      <CalculatorCharacterBuff
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
        class="character__buff"></CalculatorCharacterBuff>
    </div>
  </div>
</template>

<script>
import CalculatorCharacterBuff from "./CalculatorCharacterBuff.vue";
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
  components: { CalculatorCharacterBuff },
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
      this.$emit("updated-character-buffs", this.buffsFormatted);
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
      this.buffsData.forEach((buffInstance) => {
        const stat = buffInstance.key;
        const buffDataArr = Object.entries(buffInstance.data);
        buffDataArr.forEach(([stat, value]) => {
          finalBuffData[stat] = (finalBuffData[stat] || 0) + value;
        });
      });
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
