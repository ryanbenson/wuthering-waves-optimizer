<template>
  <div
    class="card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer"
    @click="toggleEnabled">
    <div class="card-body">
      <h2 class="card-title">{{ name }}</h2>
      <div v-html="details"></div>
      <div class="flex gap-2 items-center">
        <div class="form-control" @click.stop>
          <label
            class="label inline-flex justify-start"
            :class="{ 'cursor-pointer': !alwaysEnabled }">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              v-model="isEnabled"
              :disabled="alwaysEnabled" />
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
              :max="effectiveBuffData.effectiveMaxStacks"
              @input="ensureMaxStacks" />
            <span class="label-text ml-2">Stacks</span>
            <span class="ml-1 text-sm italic">
              (Max {{ effectiveBuffData.effectiveMaxStacks }})
            </span>
          </label>
        </div>
      </div>
      <!-- Debug info to show effective values -->
      <div
        v-if="false && hasStacks && isEnabled"
        class="text-xs text-gray-500 mt-2">
        <div>Base stacks: {{ stacks }}</div>
        <div>Base max stacks: {{ maxStacks }}</div>
        <div>
          Effective max stacks: {{ effectiveBuffData.effectiveMaxStacks }}
        </div>
        <div>
          Effective modifiers: {{ effectiveBuffData.effectiveModifiers.length }}
        </div>
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
    // used in rare buffs that are based on a talent level
    // e.g. Incandescence for Jinhsi
    talentData: {
      type: Object,
      default: () => {},
    },
    energyRegen: {
      type: Number,
      default: 0,
    },
    critRate: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  watch: {
    buffStats: function () {
      this.updatedStats();
    },
    isEnabled: {
      handler: async function () {
        this.updatedStats();
      },
      immediate: true,
    },
    stacks: {
      handler: function () {
        // Use nextTick to ensure the DOM has updated before recalculating
        this.$nextTick(() => {
          this.updatedStats();
        });
      },
      immediate: true,
    },
    // Watch for changes in resonance chains to recalculate buff stats
    "currentCharacter.resonanceChains.SequenceNode1StainedinScorchedEarth.isEnabled":
      {
        handler: function () {
          this.updatedStats();
        },
        immediate: true,
      },
    "currentCharacter.resonanceChains.SequenceNode2CleansedinCrimsonWar.isEnabled":
      {
        handler: function () {
          this.updatedStats();
        },
        immediate: true,
      },
    "currentCharacter.resonanceChains.SequenceNode6EngravedinRadiantLight.isEnabled":
      {
        handler: function () {
          this.updatedStats();
        },
        immediate: true,
      },
    // watch for Brant changes in his buffs
    "currentCharacter.buffs.MyMoment.isEnabled": {
      handler: function () {
        this.updatedStats();
      },
      immediate: true,
    },
    // watch for Brant changes in his buffs
    "currentCharacter.buffs.TheatricalMoment.isEnabled": {
      handler: function () {
        this.updatedStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    /**
     * Updates the parent with the buff data
     * @emits updated-character-buff
     */
    updatedStats() {
      this.$emit("updated-character-buff", {
        key: this.uniqueKey,
        data: this.buffStats,
      });
    },
    /**
     * Ensures a user can't exceed the effective max stacks
     */
    ensureMaxStacks() {
      if (this.stacks > this.effectiveBuffData.effectiveMaxStacks) {
        this.stacks = this.effectiveBuffData.effectiveMaxStacks;
      }
    },
    toggleEnabled() {
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
          this.currentCharacter?.buffs?.[this.uniqueKey]?.isEnabled ?? false
        );
      },
      async set(value) {
        const data = {
          buffs: {},
        };
        data.buffs[this.uniqueKey] = {
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
        const stacks =
          this.currentCharacter?.buffs?.[this.uniqueKey]?.stacks ?? 0;
        return stacks;
      },
      async set(value) {
        const data = {
          buffs: {},
        };
        data.buffs[this.uniqueKey] = {
          stacks: value,
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Calculates the effective max stacks and modifiers based on resonance chain interactions
     * @returns {Object} Object containing effectiveMaxStacks, effectiveModifiers, and effectiveStacks
     */
    effectiveBuffData() {
      // Start with the base configuration from props
      let effectiveMaxStacks = this.maxStacks || 1; // Default to 1 if no maxStacks set
      let effectiveModifiers = [...this.modifiers];
      let effectiveStacks = this.stacks || 0; // Use the actual user input stacks

      // this only applies to CrownofWills on Augusta
      if (this.character === "Augusta" && this.uniqueKey === "CrownofWills") {
        // Check if resonance chain buffs are enabled and apply their effects
        const sequenceNode1 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode1StainedinScorchedEarth;
        const sequenceNode2 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode2CleansedinCrimsonWar;
        const sequenceNode6 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode6EngravedinRadiantLight;

        // Apply SequenceNode1 effects if enabled
        if (sequenceNode1?.isEnabled) {
          effectiveMaxStacks = 2;
          // Add CritDMG modifier if not already present
          const hasCritDMG = effectiveModifiers.some(
            (mod) => mod.modifier === "CritDMG",
          );
          if (!hasCritDMG) {
            effectiveModifiers.push({
              modifier: "CritDMG",
              modifierValue: 0.15,
            });
          }
        }

        // Apply SequenceNode2 effects if enabled
        if (sequenceNode2?.isEnabled) {
          // Add CritDMG modifier if not already present
          const hasCritDMG = effectiveModifiers.some(
            (mod) => mod.modifier === "CritRate",
          );
          if (!hasCritDMG) {
            effectiveModifiers.push({
              modifier: "CritRate",
              modifierValue: 0.2,
            });
          }
        }

        // Apply SequenceNode6 effects if enabled
        if (sequenceNode6?.isEnabled) {
          effectiveMaxStacks = 4;
        }
      }

      // this only applies to Afterflame on Galbrena
      if (this.character === "Galbrena" && this.uniqueKey === "Afterflame") {
        // Check if resonance chain buffs are enabled and apply their effects
        const sequenceNode1 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode1HeartofDefianceEverAblaze;
        const sequenceNode6 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode6IRemainWhoIamEternalMyFlame;

        // Apply SequenceNode1 effects if enabled
        if (sequenceNode1?.isEnabled) {
          // Add CritDMG modifier if not already present
          const hasCritDMG = effectiveModifiers.some(
            (mod) => mod.modifier === "CritDMG",
          );
          if (!hasCritDMG) {
            effectiveModifiers.push({
              modifier: "CritDMG",
              modifySpecificTalents: [
                "BasicAttackSeraphicExecutionStage1DMG",
                "BasicAttackSeraphicExecutionStage2DMG",
                "BasicAttackSeraphicExecutionStage3DMG",
                "BasicAttackSeraphicExecutionStage4DMG",
                "BasicAttackSeraphicExecutionStage5DMG",
                "HeavyAttackFlamewingVerdictStage1DMG",
                "HeavyAttackFlamewingVerdictStage2DMG",
                "HeavyAttackFlamewingVerdictStage3DMG",
                "MidairAttackHellsentBarragePlungingAttackDMG",
                "MidairAttackHellsentBarrageSustainedFireDMG",
                "ResonanceSkillRavageDMG",
                "DodgeCounterPurgatoryScourgeDMG",
              ],
              modifierValue: 0.02,
            });
          }
        }

        // Apply sequenceNode6 effects if enabled
        if (sequenceNode6?.isEnabled) {
          // Add CritDMG modifier if not already present
          const DMGDeepen = effectiveModifiers.some(
            (mod) => mod.modifier === "DMGDeepen",
          );
          if (!DMGDeepen) {
            effectiveModifiers.push({
              modifier: "DMGDeepen",
              modifySpecificTalents: [
                "BasicAttackSeraphicExecutionStage1DMG",
                "BasicAttackSeraphicExecutionStage2DMG",
                "BasicAttackSeraphicExecutionStage3DMG",
                "BasicAttackSeraphicExecutionStage4DMG",
                "BasicAttackSeraphicExecutionStage5DMG",
                "HeavyAttackFlamewingVerdictStage1DMG",
                "HeavyAttackFlamewingVerdictStage2DMG",
                "HeavyAttackFlamewingVerdictStage3DMG",
                "MidairAttackHellsentBarragePlungingAttackDMG",
                "MidairAttackHellsentBarrageSustainedFireDMG",
                "ResonanceSkillRavageDMG",
                "DodgeCounterPurgatoryScourgeDMG",
              ],
              modifierValue: 0.00875,
            });
          }
        }
      }

      // this only applies to BurningDrive on Galbrena
      if (this.character === "Galbrena" && this.uniqueKey === "BurningDrive") {
        const sequenceNode2 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode2HellboundDiveofFireandAbyss;

        // Apply SequenceNode1 effects if enabled
        if (sequenceNode2?.isEnabled) {
          // Add CritDMG modifier if not already present
          const hasAtk = effectiveModifiers.some(
            (mod) => mod.modifier === "ATK",
          );
          // it should replace the existing buff, so we check if it does exist
          if (hasAtk) {
            effectiveModifiers.push({
              modifier: "ATK",
              // .7 from res chain + 0.2 from original buff
              // wording says 350%, but it's a multiplier against 20%, so 20%*350%
              // not additive
              modifierValue: 0.9,
            });
          }
        }
      }

      // this only applies to BamboosShade on Qiuyuan
      if (this.character === "Qiuyuan" && this.uniqueKey === "BamboosShade") {
        const sequenceNode2 =
          this.currentCharacter?.resonanceChains
            ?.SequenceNode2OBladeIWhoTeachNoMore;

        // Apply SequenceNode2 effects if enabled
        if (sequenceNode2?.isEnabled) {
          const hasEchoAmplify = effectiveModifiers.some(
            (mod) => mod.modifier === "DMGDeepen:Echo",
          );
          if (!hasEchoAmplify) {
            effectiveModifiers.push({
              modifier: "DMGDeepen:Echo",
              modifierValue: 0.3,
            });
          }
        }
      }
      // Buling SequenceNode6AlmightyForumLordofThunderSpell replaces ThunderSpellHeavenEarthMind
      if (
        this.character === "Buling" &&
        this.uniqueKey === "ThunderSpellHeavenEarthMind"
      ) {
        if (
          this.currentCharacter?.resonanceChains
            ?.SequenceNode6AlmightyForumLordofThunderSpell?.isEnabled
        ) {
          // overwrite the modifiers
          effectiveModifiers = [
            {
              modifier: "ResonanceSkillDMGBonus",
              modifierValue: 0.5,
            },
          ];
        }
      }

      // If both are enabled, SequenceNode6 takes precedence (4 max stacks)
      // If neither is enabled, revert to base configuration (1 max stack, original modifiers)

      const result = {
        effectiveMaxStacks,
        effectiveModifiers,
        effectiveStacks,
      };
      return result;
    },
    /**
     * Transforms the buffs data into a hashmap of buffModifider : buffValue
     * That gets sent throughout the calculator to reflect in the stats and damages
     * @returns {Object}
     */
    buffStats() {
      const data = {};
      if (!this.isEnabled) {
        return data;
      }

      // Check if this buff got overridden by another buff
      // TODO: Implement the replaces and replacedBy logic
      // it needs to check both character buffs and resonance chains
      if (
        this.character === "Lupa" &&
        (this.uniqueKey === "InherentSkillApplauseofVictory" ||
          this.uniqueKey === "InherentSkillApplauseofVictoryFullFusionTeam")
      ) {
        if (
          this.currentCharacter?.resonanceChains
            ?.SequenceNode3WolflameHowlsinHerWakeIgnoreFusion?.isEnabled
        ) {
          return data;
        }
      }

      // Get the effective modifiers based on resonance chain interactions
      const effectiveData = this.effectiveBuffData;
      const { effectiveModifiers, effectiveStacks } = effectiveData;
      if (!this.hasStacks) {
        effectiveModifiers.forEach((modifierItem) => {
          if (modifierItem?.modifySpecificTalents) {
            if (!data.modifySpecificTalents) {
              data.modifySpecificTalents = [];
            }
            // add our calculated value
            modifierItem.modifierValueCalculated = modifierItem.modifierValue;
            data.modifySpecificTalents.push(modifierItem);
          } else if (modifierItem.modifier === "Talent") {
            // this is the rare case where the modifier value needs a reference to another talent level
            // specifically Jinhsi incandescence buff scales off of her forte talent
            const talentRef =
              this.talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
            const talentVal = modifierItem.modifierValue[talentRef];
            data[
              `${modifierItem.modifierTalentKey}:talentModifierMultiplyAdd`
            ] = talentVal;
          } else if (modifierItem.modifier === "talentModifierMultiply") {
            // for buffs that apply talentModifierMultiply to the calcs
            if (!data.talentModifierMultiply) {
              data.talentModifierMultiply = [];
            }
            data.talentModifierMultiply.push(modifierItem);
          } else if (modifierItem.modifier.includes("AdditionalBase")) {
            // we need to calculate the buff based on the stats of another stat
            let base = 0;
            let currentAmount = 0;
            switch (modifierItem.modifierBasedOn) {
              // if there's a minStatValue, use that or use the default base
              // some characters use full base (e.g. SK), some use a minimum amount (Roccia)
              case "EnergyRegen":
                base = modifierItem?.minStatValue ?? 0;
                currentAmount = this.energyRegen;
                break;
              case "CritRate":
                base = modifierItem?.minStatValue ?? 0.05;
                currentAmount = this.critRate;
                break;
              default:
                base = modifierItem?.minStatValue ?? 0;
                break;
            }
            // use full numbers instead of decimals for this, to workaround JS math issues
            // e.g. 0.7 - 0.5 = 0.19999996, so instead 7 - 5 = 2
            const additionalAmount = currentAmount * 100 - base * 100;
            const steps = Math.floor(
              additionalAmount / modifierItem.modifierStep,
            );
            let buffValue = steps * modifierItem.modifierValue;
            if (buffValue > modifierItem.maximumValue) {
              buffValue = modifierItem.maximumValue;
            }
            // don't allow the buff to go negative and reduce your stats
            if (buffValue < 0) {
              buffValue = 0;
            }
            // now apply the buff
            switch (modifierItem.modifierTargetAttr) {
              case "CritRate":
                data["CritRate"] = buffValue;
                break;
              case "CritDMG":
                data["CritDMG"] = buffValue;
                break;
              case "ATK":
                data["ATK"] = buffValue;
                break;
              case "ATK_FLAT":
                data["ATK_FLAT"] = buffValue;
                break;
            }
          } else {
            data[modifierItem.modifier] = modifierItem.modifierValue;
          }
        });
        return data;
      }

      if (this.hasStacks) {
        if (effectiveStacks === 0) {
          return data;
        }
        effectiveModifiers.forEach((modifierItem) => {
          if (modifierItem?.modifySpecificTalents) {
            if (!data.modifySpecificTalents) {
              data.modifySpecificTalents = [];
            }
            // update modifier value with the value * stacks
            modifierItem.modifierValueCalculated =
              modifierItem.modifierValue * effectiveStacks;
            data.modifySpecificTalents.push(modifierItem);
          } else if (modifierItem.modifier === "Talent") {
            const talentRef =
              this.talentData?.[modifierItem.modifierValueTalentRef] ?? "10";
            const talentVal = modifierItem.modifierValue[talentRef];
            data[
              `${modifierItem.modifierTalentKey}:talentModifierMultiplyAdd`
            ] = talentVal * effectiveStacks;
          } else {
            const totalValue = modifierItem.modifierValue * effectiveStacks;
            data[modifierItem.modifier] = totalValue;
          }
        });
      }
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

<style scoped lang="scss">
.shadow {
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);
}
</style>
