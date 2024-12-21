<template>
  <h2 class="text-lg font-bold mt-6 mb-2">Set Bonuses</h2>
  <div class="card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
      <h2 v-if="setName" class="card-title">{{ setName }}</h2>
      <div v-else>No first echo set bonus is configured.</div>
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
          :modifiers="passive.modifiers"
          :passive-key="passive.key"
          @updated-echo-passive-stats="
            handleUpdatedEchoPassiveStats
          "></CalculatorEchoSetPassive>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoSetPassive from "./CalculatorEchoSetPassive.vue";
import { character } from "../characters/Aalto/character";
import { twoSetBonuses, setBonusEffectsOne } from "../echoes/sets";
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
      setBonusEffects: setBonusEffectsOne,
      passiveData: [],
    };
  },
  watch: {
    type: {
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
      this.$emit("update-stats", this.buffsFormatted);
    },
    handleUpdatedEchoPassiveStats(data) {
      const buffIndex = this.passiveData.findIndex((buff) => {
        return buff.key === data.key;
      });
      if (buffIndex === -1) {
        this.passiveData.push(data);
      } else {
        this.passiveData[buffIndex] = data;
      }
      this.updatedStats();
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
    type: {
      get() {
        return this.currentCharacter?.echoSetBonus?.setBonusOne ?? "";
      },
      async set(value) {
        const data = {
          echoSetBonus: {
            setBonusOne: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    setDescription() {
      if (!this.type) {
        return false;
      }
      return this.setBonusEffects[this.type]?.details ?? "";
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
    /**
     * Returns the buffs data formatted to send to the stats collector
     * @returns {Object}
     */
    buffsFormatted() {
      const finalBuffData = {};
      const allBuffs = [...this.passiveData];
      allBuffs.forEach((buffInstance) => {
        const { stats } = buffInstance;
        Object.entries(stats).forEach(([stat, value]) => {
          if (finalBuffData[stat] === "EnableAttack") {
            finalBuffData[stat] = value;
          } else {
            finalBuffData[stat] = (finalBuffData[stat] || 0) + value;
          }
        });
      });
      return finalBuffData;
    },
  },
  beforeUnmount() {
    this.passiveData = [];
  },
};
</script>

<style lang="scss" scoped>
.mb-1 {
  margin-bottom: 1rem;
}
.mt-1 {
  margin-top: 1rem;
}
</style>
