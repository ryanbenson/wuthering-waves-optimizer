<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
    <div class="card-body">
      <h2 v-if="setName" class="card-title">{{ setName }}</h2>
      <div v-else>No second echo set bonus is configured.</div>
      <template v-if="setName">
        <CalculatorEchoSetPassive
          v-for="passive in setPassives"
          :key="passive.key"
          :character="character"
          :has-stacks="passive.hasStacks"
          :modifier="passive.modifier"
          :modifier-value="passive.modifierValue"
          :min-stacks="passive.minStacks"
          :max-stacks="passive.maxStacks"
          :details="passive.details"
          :always-enabled="passive.alwaysEnabled"
          :passive-key="passive.key"></CalculatorEchoSetPassive>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoSetPassive from "./CalculatorEchoSetPassive.vue";
import {
  twoSetBonuses,
  fiveSetBonuses,
  setBonusEffectsTwo,
} from "../echoes/sets";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorEchoSetPassive,
  },
  emits: ["update-stats"],
  data() {
    return {
      twoSetBonuses,
      fiveSetBonuses,
      setBonusEffects: setBonusEffectsTwo,
    };
  },
  watch: {
    type: {
      handler: async function () {
        // if we change echo set bonus, ensure the stacks don't exceed the max
        if (this.stacks > this.getMaxStacks) {
          this.stacks = this.getMaxStacks;
        }
        if (this.setAlwaysEnabled) {
          this.isEnabled = true;
        }
        this.updatedStats();
      },
      immediate: true,
    },
    stacks: {
      handler: async function (stacksVal) {
        if (stacksVal > this.getMaxStacks) {
          this.stacks = this.getMaxStacks;
        }
        this.updatedStats();
      },
      immediate: true,
    },
    isEnabled: {
      handler: async function () {
        this.updatedStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    /**
     * Updates the stats and emits
     * @emits update-stats
     */
    updatedStats() {
      let stats = {};
      if (!this.isEnabled) {
        this.$emit("update-stats", stats);
        return;
      }
      if (this.type) {
        const setBonusEffect = this.setBonusEffects[this.type];
        for (const [key, value] of Object.entries(setBonusEffect)) {
          if (key === "EnableAttack") {
            stats[key] = value;
          } else if (key !== "maxStacks") {
            if (
              this.type === "Lingering Tunes 5 Set" &&
              key === "OutroSkillDMGBonus"
            ) {
              // Apply Outro stat directly
              stats[key] = (stats[key] || 0) + value;
            } else {
              if (
                key === "description" ||
                key === "alwaysEnabled" ||
                key === "name"
              ) {
                continue;
              }
              // Apply other stats with stacks if applicable
              const bonus = value * (this.needsStacks ? this.stacks : 1);
              stats[key] = (stats[key] || 0) + bonus;
            }
          }
        }
      }
      this.$emit("update-stats", stats);
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
     * Getter/setter used in the form for isEnabled
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    isEnabled: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusTwoEnabled ?? false;
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusTwoEnabled: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the type
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    type: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusTwo ?? "";
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusTwo: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the stacks count
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    stacks: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusTwoStacks ?? 0;
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusTwoStacks: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    setName() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.name ?? "";
    },
    setPassives() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.passives ?? [];
    },
  },
};
</script>

<style lang="scss" scoped></style>
