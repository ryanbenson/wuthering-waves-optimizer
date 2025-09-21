<template>
  <div class="join">
    <input
      v-model="damageType"
      value="Normal"
      class="join-item btn"
      type="radio"
      name="options"
      aria-label="Normal"
      :checked="damageType === 'Normal'" />
    <input
      v-model="damageType"
      value="Average"
      class="join-item btn"
      type="radio"
      name="options"
      aria-label="Average"
      :checked="damageType === 'Average'" />
    <input
      v-model="damageType"
      value="Crit"
      class="join-item btn"
      type="radio"
      name="options"
      aria-label="Crit"
      :checked="damageType === 'Crit'" />
  </div>
</template>

<script>
export default {
  name: "CalculatorOptimizerTarget",
  props: {
    character: {
      type: String,
      required: true,
    },
    currentDamageType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      damageType: "Average",
    };
  },
  watch: {
    damageType() {
      this.updatedDamageType();
    },
  },
  methods: {
    /**
     * Update the target in the store when changed
     */
    async updatedDamageType() {
      this.$emit("optimizer:damage-type-updated", this.damageType);
    },
  },
  async mounted() {
    this.damageType = this.currentDamageType ?? "Average";
  },
};
</script>
