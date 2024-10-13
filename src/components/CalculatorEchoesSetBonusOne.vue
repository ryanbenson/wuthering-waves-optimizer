<template>
  <label>Set Bonuses:</label>
  <div class="panel mb-1">
    <select v-model="type">
      <option value="">Select 2 Set Bonus</option>
      <option
        v-for="setBonus in twoSetBonuses"
        :key="setBonus"
        :value="setBonus">
        {{ setBonus }}
      </option>
    </select>
    <div v-if="setDescription" v-html="setDescription" class="mt-1"></div>
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
  },
  emits: ["update-stats"],
  data() {
    return {
      twoSetBonuses: [
        "Freezing Frost 2 Set",
        "Molten Rift 2 Set",
        "Void Thunder 2 Set",
        "Sierra Gale 2 Set",
        "Celestial Light 2 Set",
        "Sun-sinking Eclipse 2 Set",
        "Rejuvenating Glow 2 Set",
        "Moonlit Clouds 2 Set",
        "Lingering Tunes 2 Set",
      ],
      setBonusEffects: {
        "Freezing Frost 2 Set": { Glacio: 10, description: `<span class="Ice">Glacio</span> DMG increased by <span class="Highlight">10%</span>` },
        "Molten Rift 2 Set": { Fusion: 10, description: `<span class="Fire">Fusion</span> DMG increased by <span class="Highlight">10%</span>` },
        "Void Thunder 2 Set": { Electro: 10, description: `<span class="Thunder">Electro</span> DMG increased by <span class="Highlight">10%</span>` },
        "Sierra Gale 2 Set": { Aero: 10, description: `<span class="Wind">Aero</span> DMG increased by <span class="Highlight">10%</span>` },
        "Celestial Light 2 Set": { Spectro: 10, description: `<span class="Light">Spectro</span> DMG increased by <span class="Highlight">10%</span>` },
        "Sun-sinking Eclipse 2 Set": { Havoc: 10, description: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>` },
        "Rejuvenating Glow 2 Set": { HealingBonus: 10, description: `Healing increases by <span class="Highlight">10%</span>` },
        "Moonlit Clouds 2 Set": { EnergyRegen: 10, description: `Energy Regen increases by <span class="Highlight">10%</span>` },
        "Lingering Tunes 2 Set": { ATK: 10,description: `ATK increases by <span class="Highlight">10%</span>` },
      },
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
      let stats = {};
      if (this.type) {
        stats = this.setBonusEffects[this.type] ?? {};
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
      return this.setBonusEffects[this.type]?.description ?? '';
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }
}
.mb-1 {
  margin-bottom: 1rem;
}
.mt-1 {
  margin-top: 1rem;
}
</style>