<template>
  <div class="character__buff">
    <span>{{ name }}</span>
    <div v-html="details"></div>
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
    name: {
      type: String,
    },
    uniqueKey: {
      type: String,
    },
    details: {
      type: String,
    },
    alwaysEnabled: {
      type: Boolean,
      default: false,
    },
    hasStacks: {
      type: Boolean,
      default: false,
    },
    minStacks: {
      type: Number,
      default: 0,
    },
    maxStacks: {
      type: Number,
      default: 0,
    },
    modifiers: {
      type: Array,
      default: () => [],
    },
    talentData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isEnabled: false,
      stacks: 0,
    };
  },
  watch: {
    buffStats: function () {
      this.updatedStats();
    },
  },
  methods: {
    updatedStats() {
      this.$emit("updated-character-buff", {
        key: this.uniqueKey,
        data: this.buffStats,
      });
    },
  },
  computed: {
    buffStats() {
      const data = {};
      if (!this.isEnabled) {
        return data;
      }
      if (!this.hasStacks) {
        this.modifiers.forEach((modifierItem) => {
          data[modifierItem.modifier] = modifierItem.modifierValue;
        });
        return data;
      }
      if (this.hasStacks) {
        if (this.stacks === 0) {
          return data;
        }
        this.modifiers.forEach((modifierItem) => {
          if (modifierItem.modifier === "Talent") {
            const talentVal =
              modifierItem.modifierValue[
                this.talentData[modifierItem.modifierValueTalentRef]
              ];
            data[modifierItem.modifierTalentKey] = talentVal * this.stacks;
          } else {
            const totalValue = modifierItem.modifierValue * this.stacks;
            data[modifierItem.modifier] = totalValue;
          }
        });
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
};
</script>

<style scoped>
.character__buff {
  margin-top: 1rem;
}
</style>
