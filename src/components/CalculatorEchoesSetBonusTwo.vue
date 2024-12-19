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
        "Brave the Waves 2 Set",
        "A Song of High Heavens 2 Set",
        "The Eternal Light 2 Set",
        "The Veil of Hidden Night 2 Set",
        "A Heart Of Determination 2 Set",
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
        "Brave the Waves 5 Set",
        "A Song of High Heavens 5 Set",
        "The Eternal Light 5 Set",
        "The Veil of Hidden Night 5 Set",
        "A Heart Of Determination 5 Set",
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
        "Freezing Frost 5 Set": {
          key: "FreezingFrost5Set",
          name: "Freezing Frost",
          details: `Upon using Basic Attack or Heavy Attack, <span class="Ice">Glacio</span> DMG increases by <span class="Highlight">10%</span>, stacking up to three times, lasting for <span class="Highlight">15s.</span>`,
          passives: [
            {
              key: "FreezingFrost5SetGlacio",
              modifiers: [
                {
                  modifier: "Glacio",
                  modifierValue: 10,
                },
              ],
              maxStacks: 3,
              minStacks: 0,
              hasStacks: true,
              alwaysEnabled: false,
              details: `Upon using Basic Attack or Heavy Attack, <span class="Ice">Glacio</span> DMG increases by <span class="Highlight">10%</span>, stacking up to three times, lasting for <span class="Highlight">15s.</span>`,
            },
          ],
        },
        "Molten Rift 5 Set": {
          key: "MoltenRift5Set",
          name: "Molten Rift",
          details: `Upon using Resonance Skill, <span class="Fire">Fusion</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
          passives: [
            {
              key: "MoltenRift5SetFusion",
              modifiers: [
                {
                  modifier: "Fusion",
                  modifierValue: 30,
                },
              ],
              alwaysEnabled: false,
              details: `Upon using Resonance Skill, <span class="Fire">Fusion</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
            },
          ],
        },
        "Void Thunder 5 Set": {
          key: "VoidThunder5Set",
          name: "Void Thunder",
          details: `Upon using Heavy Attack or Resonance Skill, <span class="Thunder">Electro</span> DMG increases by <span class="Highlight">15%</span>, stacking up to <span class="Highlight">2</span> times, each stack lasting for <span class="Highlight">15s.</span>`,
          passives: [
            {
              key: "VoidThunder5SetElectro",
              modifiers: [
                {
                  modifier: "Electro",
                  modifierValue: 15,
                },
              ],
              maxStacks: 2,
              minStacks: 0,
              hasStacks: true,
              alwaysEnabled: false,
              details: `Upon using Heavy Attack or Resonance Skill, <span class="Thunder">Electro</span> DMG increases by <span class="Highlight">15%</span>, stacking up to <span class="Highlight">2</span> times, each stack lasting for <span class="Highlight">15s.</span>`,
            },
          ],
        },
        "Sierra Gale 5 Set": {
          key: "SierraGale5Set",
          name: "Sierra Gale",
          details: `Upon using Intro Skill, <span class="Wind">Aero</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
          passives: [
            {
              key: "SierraGale5SetAero",
              modifiers: [
                {
                  modifier: "Aero",
                  modifierValue: 30,
                },
              ],
              alwaysEnabled: false,
              details: `Upon using Intro Skill, <span class="Wind">Aero</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
            },
          ],
        },
        "Celestial Light 5 Set": {
          key: "CelestialLight5Set",
          name: "Celestial Light",
          details: `Upon using Intro Skill, <span class="Light">Spectro</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
          passives: [
            {
              key: "CelestialLight5SetSpectro",
              modifiers: [
                {
                  modifier: "Spectro",
                  modifierValue: 30,
                },
              ],
              alwaysEnabled: false,
              details: `Upon using Intro Skill, <span class="Light">Spectro</span> DMG increases by <span class="Highlight">30%</span> for <span class="Highlight">15s.</span>`,
            },
          ],
        },
        "Sun-sinking Eclipse 5 Set": {
          key: "SunSinkingEclipse5Set",
          name: "Sun-sinking Eclipse",
          details: `Upon using Basic Attack or Heavy Attack, <span class="Dark">Havoc</span> DMG increases by <span class="Highlight">7.5%</span>, stacking up to four times for <span class="Highlight">15s.</span>`,
          passives: [
            {
              key: "SunSinkingEclipse5SetHavoc",
              modifiers: [
                {
                  modifier: "Havoc",
                  modifierValue: 7.5,
                },
              ],
              maxStacks: 4,
              minStacks: 0,
              hasStacks: true,
              alwaysEnabled: false,
              details: `Upon using Basic Attack or Heavy Attack, <span class="Dark">Havoc</span> DMG increases by <span class="Highlight">7.5%</span>, stacking up to four times for <span class="Highlight">15s.</span>`,
            },
          ],
        },
        "Rejuvenating Glow 5 Set": {
          key: "RejuvenatingGlow5Set",
          name: "Rejuvenating Glow",
          details: `Upon healing allies, increase ATK of the entire team by <span class="Highlight">15%</span>, lasting <span class="Highlight">30s.</span>`,
          passives: [
            {
              key: "RejuvenatingGlow5SetATK",
              modifiers: [
                {
                  modifier: "ATK",
                  modifierValue: 15,
                },
              ],
              alwaysEnabled: false,
              details: `Upon healing allies, increase ATK of the entire team by <span class="Highlight">15%</span>, lasting <span class="Highlight">30s.</span>`,
            },
          ],
        },
        "Moonlit Clouds 5 Set": {
          key: "MoonlitClouds5Set",
          name: "Moonlit Clouds",
          details: `Upon using Outro Skill, ATK of the next Resonator increases by <span class="Highlight">22.5%</span> for <span class="Highlight">15s.</span>`,
          passives: [],
        },
        "Lingering Tunes 5 Set": {
          key: "LingeringTunes5Set",
          name: "Lingering Tunes",
          details: `While on the field, ATK increases by <span class="Highlight">5%</span> every <span class="Highlight">1.5s</span>, stacking up to 4 times. Outro Skill DMG increases by <span class="Highlight">60%.</span>`,
          passives: [
            {
              key: "LingeringTunes5SetATK",
              modifier: "ATK",
              modifierValue: 5,
              maxStacks: 4,
              minStacks: 0,
              hasStacks: true,
              alwaysEnabled: false,
              details: `While on the field, ATK increases by <span class="Highlight">5%</span> every <span class="Highlight">1.5s</span>, stacking up to 4 times.`,
            },
            {
              key: "LingeringTunes5SetOutroSkillDMGBonus",
              modifier: "OutroSkillDMGBonus",
              modifierValue: 60,
              alwaysEnabled: true,
              details: `Outro Skill DMG increases by <span class="Highlight">60%.</span>`,
            },
          ],
        },
        "A Heart Of Determination 5 Set": {
          key: "AHeartOfDetermination5Set",
          name: "A Heart Of Determination",
          details: `For 6 seconds after using Resonance Liberation, increase <span class="Ice">Glacio</span> DMG by <span class="Highlight">30%</span>, and <span class="Highlight">Resonance Skill</span> DMG by <span class="Highlight">30%</span>.`,
          passives: [
            {
              key: "AHeartOfDetermination5Set5SetGlacioSkillDMGBonus",
              modifiers: [
                {
                  modifier: "Glacio",
                  modifierValue: 30,
                },
                {
                  modifier: "ResonanceSkillDMGBonus",
                  modifierValue: 30,
                },
              ],
              details: `For 6 seconds after using Resonance Liberation, increase <span class="Ice">Glacio</span> DMG by <span class="Highlight">30%</span>, and <span class="Highlight">Resonance Skill</span> DMG by <span class="Highlight">30%</span>.`,
            },
          ],
        },
        "The Veil of Hidden Night 5 Set": {
          key: "TheVeilofHiddenNight5Set",
          name: "The Veil of Hidden Night",
          details: `When the character uses an <span class="Highlight">Outro Skill</span>, it deals an additional <span class="Highlight">480%</span> <span class="Dark">Havoc</span> DMG and increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds`,
          passives: [
            {
              key: "TheVeilofHiddenNight5SetAttack",
              modifiers: [
                {
                  modifier: "EnableAttack",
                  modifierValue: "TheVeilofHiddenNight",
                },
              ],
              details: `When the character uses an <span class="Highlight">Outro Skill</span>, it deals an additional <span class="Highlight">480%</span> <span class="Dark">Havoc</span> DMG and increases the next character's <span class="Dark">Havoc</span> DMG by <span class="Highlight">15%</span> for <span class="Highlight">15</span> seconds`,
            },
          ],
        },
        "The Eternal Light 5 Set": {
          key: "TheEternalLight5Set",
          name: "The Eternal Light",
          details: `When a character adds [light noise effect] to a target, the characters Crit DMG is increased by <span class="Highlight">20%</span> for <span class="Highlight">15</span> seconds. When attacking an enemy with 10 stacks of [light noise effect] the character gains <span class="Highlight">15%</span> <span class="Light">Spectro</span> DMG bonus for <span class="Highlight">15</span> seconds`,
          passives: [
            {
              key: "TheEternalLight5SetCritDMG",
              modifiers: [
                {
                  modifier: "CritDMG",
                  modifierValue: 20,
                },
              ],
              alwaysEnabled: false,
              details: `When a character adds [light noise effect] to a target, the characters Crit DMG is increased by <span class="Highlight">20%</span> for <span class="Highlight">15</span> seconds.`,
            },
            {
              key: "TheEternalLight5SetSpectro",
              modifiers: [
                {
                  modifier: "Spectro",
                  modifierValue: 15,
                },
              ],
              alwaysEnabled: false,
              details: `When attacking an enemy with 10 stacks of [light noise effect] the character gains <span class="Highlight">15%</span> <span class="Light">Spectro</span> DMG bonus for <span class="Highlight">15</span> seconds`,
            },
          ],
        },
        "A Song of High Heavens 5 Set": {
          key: "ASongOfHighHeavens5Set",
          name: "A Song of High Heavens",
          details: `Increases the DMG dealt by coordinated attacks by <span class="Highlight">80%</span>, when a coordinated attack deals Crit DMG, the whole team gains <span class="Highlight">20%</span> ATK bonus.`,
          passives: [
            {
              key: "ASongOfHighHeavens5SetCoordinatedDMGBonus",
              modifiers: [
                {
                  modifier: "CoordinatedDMGBonus",
                  modifierValue: 80,
                },
              ],
              alwaysEnabled: false,
              details: `Increases the DMG dealt by coordinated attacks by <span class="Highlight">80%</span>.`,
            },
            {
              key: "ASongOfHighHeavens5SetATK",
              modifiers: [
                {
                  modifier: "ATK",
                  modifierValue: 20,
                },
              ],
              alwaysEnabled: false,
              details: `When a coordinated attack deals Crit DMG, the whole team gains <span class="Highlight">20%</span> ATK bonus.`,
            },
          ],
        },
        "Brave the Waves 5 Set": {
          name: "Brave the Waves",
          key: "BravetheWaves",
          details: `ATK is increased by <span class="Highlight">15%</span>, after Energy Regen reaches <span class="Highlight">250%</span> the current character's all attribute DMG is increased by <span class="Highlight">30%</span>.`,
          passives: [
            {
              key: "BravetheWaves5SetATK",
              modifiers: [
                {
                  modifier: "ATK",
                  modifierValue: 15,
                },
              ],
              alwaysEnabled: false,
              details: `ATK is increased by <span class="Highlight">15%</span>.`,
            },
            {
              key: "BravetheWaves5SetAllElementAttributeBonus",
              modifiers: [
                {
                  modifier: "AllElementAttributeBonus",
                  modifierValue: 30,
                },
              ],
              alwaysEnabled: false,
              details: `When a coordinated attack deals Crit DMG, the whole team gains <span class="Highlight">20%</span> ATK bonus.`,
            },
          ],
        },
      },
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
