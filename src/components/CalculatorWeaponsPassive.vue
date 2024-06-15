<template>
  <div>
    <p>{{ details }}</p>
    <span v-if="!alwaysEnabled"
      ><input type="checkbox" v-model="isEnabled" /> Enabled?</span
    >
    <span v-if="hasStacks">
      <input v-model="stacks" type="number" :min="minStacks" :max="maxStacks" />
      Stacks</span
    >
  </div>
</template>

<script>
export default {
  props: {
    hasStacks: {
      type: Boolean,
      default: false,
    },
    modifier: {
      type: String,
    },
    modifierByRefinement: {
      type: Object,
      default: () => {},
    },
    minStacks: {
      type: Number,
      default: 0,
    },
    maxStacks: {
      type: Number,
      default: 0,
    },
    details: {
      type: String,
    },
    alwaysEnabled: {
      type: Boolean,
      default: false,
    },
    refinement: {
      type: Number,
    },
  },
  data() {
    return {
      isEnabled: false,
      stacks: 0,
    };
  },
  watch: {
    weaponPassiveStats: function () {
      this.updatedStats();
    },
  },
  methods: {
    updatedStats() {
      this.$emit("updated-weapon-stats", this.weaponPassiveStats);
    },
  },
  computed: {
    weaponPassiveStats() {
      const data = { stat: null, value: null };
      if (!this.isEnabled) {
        return data;
      }
      if (!this.hasStacks) {
        data.stat = this.modifier;
        data.value = this.modifierByRefinement[this.refinement];
        return data;
      }
      if (this.hasStacks) {
        if (this.stacks === 0) {
          return data;
        }
        data.stat = this.modifier;
        const totalValue =
          this.modifierByRefinement[this.refinement] * this.stacks;
        data.value = totalValue;
      }
      // shouldn't get here
      return data;
    },
  },
  mounted() {
    if (this.alwaysEnabled === true) {
      this.isEnabled = true;
    }
  },
  beforeUnmount() {
    this.$emit("updated-weapon-stats", {});
  },
};
</script>
