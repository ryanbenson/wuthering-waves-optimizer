<template>
  <div>
    <select v-model="type">
      <option value="">Select 5 Set Bonus or another 2 Set Bonus</option>
      <optgroup label="5 Set Bonuses">
        <option
          v-for="setBonus in fiveSetBonuses"
          :key="setBonus"
          :value="setBonus">
          {{ setBonus }}
        </option>
      </optgroup>
      <optgroup label="2 Set Bonuses">
        <option
          v-for="setBonus in twoSetBonuses"
          :key="setBonus"
          :value="setBonus">
          {{ setBonus }}
        </option>
      </optgroup>
    </select>
  </div>
  <div v-if="needsStacks">
    <label>Stacks:</label>
    <input
      v-model.number="stacks"
      type="number"
      min="0"
      :max="getMaxStacks"
      @input="updateTotalStats" />
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
      fiveSetBonuses: [
        "Freezing Frost 5 Set",
        "Molten Rift 5 Set",
        "Void Thunder 5 Set",
        "Sierra Gale 5 Set",
        "Celestial Light 5 Set",
        "Sun-sinking Eclipse 5 Set",
        "Rejuvenating Glow 5 Set",
        "Moonlit Clouds 5 Set",
        "Lingering Tunes 5 Set",
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
        "Freezing Frost 5 Set": { Glacio: 10, maxStacks: 3 },
        "Molten Rift 5 Set": { Fusion: 30 },
        "Void Thunder 5 Set": { Electro: 15, maxStacks: 2 },
        "Sierra Gale 5 Set": { Aero: 30 },
        "Celestial Light 5 Set": { Spectro: 30 },
        "Sun-sinking Eclipse 5 Set": { Havoc: 7.5, maxStacks: 4 },
        "Rejuvenating Glow 5 Set": { ATK: 15 },
        "Moonlit Clouds 5 Set": { ATK: 22.5 },
        "Lingering Tunes 5 Set": {
          ATK: 5,
          maxStacks: 4,
          OutroSkillDMGBonus: 60,
        },
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
    stacks: {
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
        const setBonusEffect = this.setBonusEffects[this.type];
        for (const [key, value] of Object.entries(setBonusEffect)) {
          if (key !== "maxStacks") {
            if (
              this.type === "Lingering Tunes 5 Set" &&
              key === "OutroSkillDMGBonus"
            ) {
              // Apply Outro stat directly
              stats[key] = (stats[key] || 0) + value;
            } else {
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
    getMaxStacks() {
      if (!this.type) {
        return 0;
      }
      return this.setBonusEffects[this.type]?.maxStacks || 0;
    },
    needsStacks() {
      if (!this.type) {
        return false;
      }
      return !!this.setBonusEffects[this.type]?.maxStacks;
    },
  },
};
</script>
