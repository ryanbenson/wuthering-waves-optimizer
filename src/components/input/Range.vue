<template>
  <div class="range-slider" :class="$attrs.class">
    <input
      type="range"
      class="range w-full"
      :class="classes"
      :id="id"
      :min="0"
      :max="maxIndex"
      v-model="rangeIndex"
      v-bind="inputAttrs"
      @input="updateValue" />
    <div
      v-if="showTicks && values.length > 1"
      class="range-slider__ticks"
      aria-hidden="true">
      <div
        v-for="(value, index) in values"
        :key="index"
        class="range-slider__tick">
        <span class="range-slider__tick-mark"></span>
        <span class="range-slider__tick-value">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useSettingsStore } from "../../stores/settings";
export default {
  name: "RangeSlider",
  inheritAttrs: false,
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
    showTicks: {
      type: Boolean,
      default: false,
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
    inputAttrs() {
      const { class: _class, ...rest } = this.$attrs;
      return rest;
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

<style scoped lang="scss">
.range-slider {
  width: 100%;
}

.range-slider__ticks {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.25rem;
}

.range-slider__tick {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
}

.range-slider__tick-mark {
  width: 1px;
  height: 0.35rem;
  background-color: var(--fallback-bc, oklch(var(--bc) / 0.4));
}

.range-slider__tick-value {
  margin-top: 0.15rem;
  font-size: 0.625rem;
  line-height: 1;
  color: var(--fallback-bc, oklch(var(--bc) / 0.6));
  white-space: nowrap;
}
</style>
