<template>
  <input
    type="range"
    class="range"
    :class="classes"
    :id="id"
    :min="0"
    :max="maxIndex"
    v-model="rangeIndex"
    @input="updateValue" />
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useSettingsStore } from "../../stores/settings";
export default {
  name: "RangeSlider",
  props: {
    id: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
      required: true,
      default: () => [],
    },
    defaultValue: {
      type: [Number, String],
      default: null,
    },
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["xs", "sm", "md", "lg"].includes(value);
      },
    },
  },
  data() {
    return {
      rangeIndex:
        this.defaultValue !== null ? this.values.indexOf(this.defaultValue) : 0,
    };
  },
  computed: {
    ...mapState(useSettingsStore, ["config"]),
    settingsTheme() {
      const settingsTheme = this.config?.theme ?? null;
      return settingsTheme;
    },
    maxIndex() {
      return this.values.length - 1;
    },
    displayValue() {
      return this.values[this.rangeIndex];
    },
    classes() {
      const classes = [];
      const sizeClass = {
        xs: "range-xs",
        sm: "range-sm",
        md: "range-md",
        lg: "range-lg",
      };
      if (this.size && sizeClass[this.size]) {
        classes.push(sizeClass[this.size]);
      }
      if (this.settingsTheme === "black") {
        classes.push("[--range-shdw:gray]");
      }
      return classes;
    },
  },
  watch: {
    defaultValue(newVal) {
      this.rangeIndex = this.values.indexOf(newVal);
    },
  },
  methods: {
    updateValue() {
      this.$emit("updateValue", this.displayValue);
    },
  },
};
</script>

<style scoped lang="scss"></style>
