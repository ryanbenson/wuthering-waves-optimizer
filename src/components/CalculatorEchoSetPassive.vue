<template>
  <div :class="{ 'weapon-passive': !alwaysEnabled }" @click="toggleEnabled">
    <div v-html="details"></div>
    <div class="flex gap-2 items-center">
      <div class="form-control" @click.stop>
        <label
          class="label cursor-pointer inline-flex justify-start pl-0"
          v-if="!alwaysEnabled">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            v-model="isEnabled"
            @change="updatedStats" />
          <span class="label-text ml-2">Enabled?</span>
        </label>
      </div>
      <div v-if="hasStacks" class="form-control" @click.stop>
        <label
          class="label cursor-pointer inline-flex justify-start"
          v-if="!alwaysEnabled">
          <input
            v-model="stacks"
            type="number"
            class="input input-bordered input-xs"
            :min="minStacks"
            :max="maxStacks"
            @input="ensureMaxStacks"
            @change="updatedStats" />
          <span class="label-text ml-2">Stacks</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";

export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    hasStacks: {
      type: Boolean,
      default: false,
    },
    modifier: {
      type: String,
    },
    modifierValue: {
      type: Number,
      default: 0,
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
    passiveKey: {
      type: String,
    },
  },
  data() {
    return {};
  },
  watch: {
    isEnabled: {
      handler: async function (val) {
        await this.updateStats();
      },
      immediate: true,
    },
    stacks: {
      handler: async function () {
        await this.updateStats();
      },
      immediate: true,
    },
    alwaysEnabled: {
      handler: async function (val) {
        if (val === true) {
          this.isEnabled = true;
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    /**
     * Updates the stats for the passive and emits up to the parent
     * @emits updated-weapon-stats
     */
    async updateStats() {
      // TODO: Determine if this is really needed. Not sure why this is here
      // await this.setCharacterData(this.character, {
      //   weaponPassiveStats: {
      //     ...this.weaponPassiveStats,
      //     [this.passiveKey]: this.weaponPassiveStats,
      //   },
      // });
      this.$emit("updated-weapon-stats", this.weaponPassiveStats);
    },
    /**
     * Prevents the user from exceeding the max stacks
     */
    ensureMaxStacks() {
      if (this.stacks > this.maxStacks) {
        this.stacks = this.maxStacks;
      }
    },
    toggleEnabled() {
      if (this.alwaysEnabled) {
        return;
      }
      this.isEnabled = !this.isEnabled;
    },
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    /**
     * Getter/setter used in the form for the isEnabled state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    isEnabled: {
      get() {
        return (
          this.currentCharacter?.echoSetPassives?.[this.passiveKey]
            ?.isEnabled ?? false
        );
      },
      async set(value) {
        const data = {
          echoSetPassives: {},
        };
        data.echoSetPassives[this.passiveKey] = {
          isEnabled: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the stacks count state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    stacks: {
      get() {
        return (
          this.currentCharacter?.echoSetPassives?.[this.passiveKey]?.stacks ?? 0
        );
      },
      async set(value) {
        const data = {
          echoSetPassives: {},
        };
        data.echoSetPassives[this.passiveKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Compiles the stats for this passive
     * @returns {Object}
     */
    weaponPassiveStats() {
      const data = {
        stat: this.modifier,
        value: 0,
        key: this.passiveKey,
      };
      if (!this.isEnabled) {
        return data;
      }
      if (!this.hasStacks) {
        data.stat = this.modifier;
        data.value = this.modifierValue;
        return data;
      }
      if (this.hasStacks) {
        if (this.stacks === 0) {
          return data;
        }
        data.stat = this.modifier;
        const totalValue = this.modifieValue * this.stacks;
        data.value = totalValue;
      }
      return data;
    },
  },
  beforeUnmount() {
    this.$emit("updated-weapon-stats", {
      stat: this.modifier,
      value: 0,
      key: this.passiveKey,
    });
  },
};
</script>

<style scoped lang="scss">
.weapon-passive {
  cursor: pointer;
}
</style>
