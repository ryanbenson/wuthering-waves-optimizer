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
          :passive-key="passive.key"></CalculatorEchoSetPassive>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoSetPassive from "./CalculatorEchoSetPassive.vue";
import { character } from "../characters/Aalto/character";
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
        "A Heart Of Determination 2 Set",
      ],
      setBonusEffects: {
        "Freezing Frost 2 Set": {
          name: "Freezing Frost",
          key: "FreezingFrost2Set",
          passives: [
            {
              key: "FreezingFrost2SetGlacio",
              details: `<span class="Ice">Glacio</span> DMG increased by <span class="Highlight">10%</span>`,
              modifier: "Glacio",
              modifierValue: 10,
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `<span class="Ice">Glacio</span> DMG increased by <span class="Highlight">10%</span>`,
        },
        "Molten Rift 2 Set": {
          name: "Molten Rift",
          key: "MoltenRift2Set",
          passives: [
            {
              key: "MoltenRift2SetFusion",
              details: `<span class="Fire">Fusion</span> DMG increased by <span class="Highlight">10%</span>`,
              modifier: "Fusion",
              modifierValue: 10,
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `<span class="Fire">Fusion</span> DMG increased by <span class="Highlight">10%</span>`,
        },
        "Void Thunder 2 Set": {
          name: "Void Thunder",
          key: "VoidThunder2Set",
          passives: [
            {
              key: "VoidThunder2SetElectro",
              details: `<span class="Thunder">Electro</span> DMG increased by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "Electro",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `<span class="Thunder">Electro</span> DMG increased by <span class="Highlight">10%</span>`,
        },
        "Sierra Gale 2 Set": {
          name: "Sierra Gale",
          key: "SierraGale2Set",
          passives: [
            {
              key: "SierraGale2SetAero",
              details: `<span class="Wind">Aero</span> DMG increased by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "Aero",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `<span class="Wind">Aero</span> DMG increased by <span class="Highlight">10%</span>`,
        },
        "Celestial Light 2 Set": {
          name: "Celestial Light",
          key: "CelestialLight2Set",
          passives: [
            {
              key: "CelestialLight2SetSpectro",
              details: `<span class="Light">Spectro</span> DMG increased by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "Spectro",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `<span class="Light">Spectro</span> DMG increased by <span class="Highlight">10%</span>`,
        },
        "Sun-sinking Eclipse 2 Set": {
          name: "Sun-sinking Eclipse",
          key: "SunSinkingEclipse2Set",
          passives: [
            {
              key: "SunSinkingEclipse2SetHavoc",
              details: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "Havoc",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `<span class="Dark">Havoc</span> DMG increased by <span class="Highlight">10%</span>`,
        },
        "Rejuvenating Glow 2 Set": {
          name: "Rejuvenating Glow",
          key: "RejuvenatingGlow2Set",
          passives: [
            {
              key: "RejuvenatingGlow2SetHealingBonus",
              details: `Healing increases by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "HealingBonus",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `Healing increases by <span class="Highlight">10%</span>`,
        },
        "Moonlit Clouds 2 Set": {
          name: "Moonlit Clouds",
          key: "MoonlitClouds2Set",
          passives: [
            {
              key: "MoonlitClouds2SetEnergyRegen",
              details: `Energy Regen increases by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "EnergyRegen",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `Energy Regen increases by <span class="Highlight">10%</span>`,
        },
        "Lingering Tunes 2 Set": {
          name: "Lingering Tunes",
          key: "LingeringTunes2Set",
          passives: [
            {
              key: "LingeringTunes2SetATK",
              details: `ATK increases by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "ATK",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `ATK increases by <span class="Highlight">10%</span>`,
        },
        "A Heart Of Determination 2 Set": {
          name: "A Heart Of Determination",
          key: "HeartOfDetermination2Set",
          passives: [
            {
              key: "HeartOfDetermination2SetResonanceSkillDMGBonus",
              details: `Increase Resonance Skill DMG by <span class="Highlight">12%</span>`,
              modifiers: [
                {
                  modifier: "ResonanceSkillDMGBonus",
                  modifierValue: 12,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `Increase Resonance Skill DMG by <span class="Highlight">12%</span>`,
        },
        "A Song of High Heavens 2 Set": {
          name: "A Song of High Heavens",
          key: "SongOfHighHeavens2Set",
          passives: [
            {
              key: "SongOfHighHeavens2SetEnergyRegen",
              details: `Energy Regen increases by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "EnergyRegen",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `Energy Regen increases by <span class="Highlight">10%</span>`,
        },
        "Brave the Waves 2 Set": {
          name: "Brave the Waves",
          key: "BraveTheWaves2Set",
          passives: [
            {
              key: "BraveTheWaves2SetHP",
              details: `HP increases by <span class="Highlight">10%</span>`,
              modifiers: [
                {
                  modifier: "HP",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `HP increases by <span class="Highlight">10%</span>`,
        },
        "The Eternal Light 2 Set": {
          name: "The Eternal Light",
          key: "TheEternalLight2Set",
          passives: [
            {
              key: "TheEternalLight2SetHP",
              details: `Increases Spectro DMG by 10%`,
              modifiers: [
                {
                  modifier: "Spectro",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `Increases Spectro DMG by 10%`,
        },
        "The Veil of Hidden Night 2 Set": {
          name: "The Veil of Hidden Night",
          key: "TheVeilofHiddenNight2Set",
          passives: [
            {
              key: "TheVeilofHiddenNight2SetHavoc",
              details: `Increases Havoc DMG by 10%`,
              modifiers: [
                {
                  modifier: "Havoc",
                  modifierValue: 10,
                },
              ],
              minStacks: 0,
              maxStacks: 0,
              alwaysEnabled: true,
            },
          ],
          details: `Increases Havoc DMG by 10%`,
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
        const cloneType = JSON.parse(
          JSON.stringify(this.setBonusEffects[this.type]),
        );
        delete cloneType.name;
        delete cloneType.description;
        stats = cloneType ?? {};
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
