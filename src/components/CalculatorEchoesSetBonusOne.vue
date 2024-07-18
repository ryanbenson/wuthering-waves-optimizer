<template>
  <label>Set Bonuses:</label>
  <div>
    <select v-model="type">
      <option value="">Select 2 Set Bonus</option>
      <option
        v-for="setBonus in twoSetBonuses"
        :key="setBonus"
        :value="setBonus">
        {{ setBonus }}
      </option>
    </select>
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
        "Freezing Frost 2 Set": { Glacio: 10 },
        "Molten Rift 2 Set": { Fusion: 10 },
        "Void Thunder 2 Set": { Electro: 10 },
        "Sierra Gale 2 Set": { Aero: 10 },
        "Celestial Light 2 Set": { Spectro: 10 },
        "Sun-sinking Eclipse 2 Set": { Havoc: 10 },
        "Rejuvenating Glow 2 Set": { HealingBonus: 10 },
        "Moonlit Clouds 2 Set": { EnergyRegen: 10 },
        "Lingering Tunes 2 Set": { ATK: 10 },
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
  },
};
</script>
