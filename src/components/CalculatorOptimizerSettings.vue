<template>
  <div class="optimizer-settings-list">
    <div class="form-control">
      <label class="label cursor-pointer flex gap-4 justify-start">
        <input
          v-model="ignoreOtherResonantorEchoes"
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          checked="checked" />
        <span class="label-text">
          Ignore echoes equipped by other resonators
        </span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "CalculatorOptimizerSettings",
  props: {
    character: {
      type: String,
      required: true,
    },
    currentIgnoreOtherResonantorEchoes: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      ignoreOtherResonantorEchoes: false,
    };
  },
  watch: {
    ignoreOtherResonantorEchoes() {
      this.updatedSettings();
    },
  },
  methods: {
    /**
     * Update the target in the store when changed
     */
    async updatedSettings() {
      this.$emit("optimizer:settings-updated", {
        ignoreOtherResonantorEchoes: this.ignoreOtherResonantorEchoes,
      });
    },
  },
  async mounted() {
    this.ignoreOtherResonantorEchoes =
      this.currentIgnoreOtherResonantorEchoes ?? "Average";
  },
};
</script>
