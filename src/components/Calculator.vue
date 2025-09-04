<template>
  <div class="calculations">
    <Nav cur-page="home">
      <template #mobile>
        <CalculatorMobileSubNav
          @change-screen="changeScreen"
          :screen="curScreen"></CalculatorMobileSubNav>
      </template>
      <template #default>
        <CalculatorSubNav
          :screen="curScreen"
          @change-screen="changeScreen"></CalculatorSubNav>
      </template>
    </Nav>
    <div class="calculations__screens">
      <div class="screen--character" v-show="curScreen === 'character'">
        <div>
          <div v-if="true" class="alert alert-success mb-6 text-white p-2 px-4">
            All 2.6 content is now available!
          </div>
          <CalculatorCharacterSelect
            :key="character"
            :character="character"
            @updated-chosen-character="handleUpdatedCharacter"
            @character-level-updated="handleCharacterLevelUpdated"
            class="pb-4" />
          <CalculatorTalents
            :character="character"
            :key="character"
            @character-talent-updated="
              handleCharacterTalentUpdated
            "></CalculatorTalents>
          <template v-if="chosenChar?.value?.buffs && isLoading === false">
            <CalculatorCharacterBuffs
              :key="character"
              :character="character"
              :buffs="chosenChar?.value?.buffs"
              :talent-data="characters?.[character]?.talents"
              class="character__self-buffs"
              ref="characterBuffsRef"
              @updated-character-buffs="
                handleUpdatedCharacterBuffs
              "></CalculatorCharacterBuffs>
          </template>
        </div>
      </div>

      <div class="screen--weapon" v-show="curScreen === 'weapon'">
        <CalculatorWeapons
          v-if="character"
          :key="character"
          :character="character"
          @update-weapon="handleWeaponUpdated"
          :weapon-type="weaponType"></CalculatorWeapons>
      </div>

      <div class="screen--echoes" v-show="curScreen === 'echoes'">
        <CalculatorEchoes
          :key="character"
          :character="character"
          @update-stats="updateStatsEchoes"
          @updated-main-echo="handleUpdatedMainEcho"
          @updated-main-echo-rank="
            handleUpdatedMainEchoRank
          "></CalculatorEchoes>
      </div>

      <div
        class="screen--resonance-chains"
        v-show="curScreen === 'constellations'">
        <template
          v-if="chosenChar?.value?.resonanceChains && isLoading === false">
          <CalculatorResonanceChains
            :key="character"
            :character="character"
            :buffs="chosenChar?.value?.resonanceChains"
            :talent-data="characters?.[character]?.talents"
            @updated-character-resonance-chains="
              handleUpdatedCharacterResonanceChains
            "></CalculatorResonanceChains>
        </template>
      </div>

      <div class="screen-party" v-show="curScreen === 'party'">
        <CalculatorPartyBuffs
          :key="character"
          :character="character"
          @updated-team-buffs="handleUpdatedTeamBuffs"></CalculatorPartyBuffs>
      </div>
      <div class="screen--optimizer" v-show="curScreen === 'optimizer'">
        <CalculatorOptimizer
          :key="character"
          :character="character"
          :total-combos="totalCombos"
          :processed-combos="processedCombos"
          :optimizer-results="optimizerResults"
          @optimizer:optimize="handleOptimize"></CalculatorOptimizer>
      </div>
      <div class="screen--rotations" v-show="curScreen === 'rotations'">
        <CalculatorRotations
          :key="character"
          :character="character"
          @updated-rotations="handleUpdatedRotations"></CalculatorRotations>
      </div>
      <div class="screen--custom-buffs" v-show="curScreen === 'custom-buffs'">
        <CalculatorCustomBuffs
          :key="character"
          :character="character"
          @custom-buffs-updated="handleCustomBuffs"></CalculatorCustomBuffs>
      </div>
      <div class="screen--enemy" v-show="curScreen === 'enemy'">
        <CalculatorEnemy
          :key="character"
          :character="character"
          @updated-enemy-data="handleUpdatedEnemy"
          :is-spectro-frazzle-enabled="isSpectroFrazzleEnabled"
          :is-aero-erosion-enabled="isAeroErosionEnabled"></CalculatorEnemy>
      </div>
      <div class="screen--results" v-show="curScreen === 'results'">
        <CalculatorStats
          :key="character + weaponAtk"
          :character="character"
          :character-level="characterLevel"
          :weapon-atk="weaponAtk"
          :total-atk="totalAtk"
          :total-atk-percent="totalAtkPercent"
          :total-atk-flat="totalAtkFlat"
          :total-hp="totalHp"
          :total-hp-percent="totalHpPercent"
          :total-hp-flat="totalHpFlat"
          :total-def="totalDef"
          :total-def-percent="totalDefPercent"
          :total-def-flat="totalDefFlat"
          :total-crit-rate="totalCritRate"
          :total-crit-dmg="totalCritDMG"
          :energy-regen="energyRegen"
          :basic-attack-dmg-bonus="BasicAttackDMGBonus"
          :heavy-attack-dmg-bonus="HeavyAttackDMGBonus"
          :resonance-skill-dmg-bonus="ResonanceSkillDMGBonus"
          :resonance-liberation-dmg-bonus="ResonanceLiberationDMGBonus"
          :glacio="Glacio"
          :fusion="Fusion"
          :electro="Electro"
          :aero="Aero"
          :spectro="Spectro"
          :havoc="Havoc"
          :healing-bonus="healingBonus"></CalculatorStats>
        <CalculatorDamages
          :key="character"
          :character="character"
          :all-damages="allDamages"
          :rotations-list="rotationsList"
          :chosen-char="chosenChar"
          :chosen-echo-name="mainEcho"
          :is-missing-spectro-data="isMissingSpectroData"
          :is-missing-aero-erosion-data="isMissingAeroErosionData"
          :char-buffs-data="charBuffsData"
          :char-resonance-chains-data="
            charResonanceChainsData
          "></CalculatorDamages>
      </div>
    </div>
    <div class="results">
      <CalculatorStats
        :key="character + weaponAtk"
        :character="character"
        :character-level="characterLevel"
        :weapon-atk="weaponAtk"
        :total-atk="totalAtk"
        :total-atk-percent="totalAtkPercent"
        :total-atk-flat="totalAtkFlat"
        :total-hp="totalHp"
        :total-hp-percent="totalHpPercent"
        :total-hp-flat="totalHpFlat"
        :total-def="totalDef"
        :total-def-percent="totalDefPercent"
        :total-def-flat="totalDefFlat"
        :total-crit-rate="totalCritRate"
        :total-crit-dmg="totalCritDMG"
        :energy-regen="energyRegen"
        :basic-attack-dmg-bonus="BasicAttackDMGBonus"
        :heavy-attack-dmg-bonus="HeavyAttackDMGBonus"
        :resonance-skill-dmg-bonus="ResonanceSkillDMGBonus"
        :resonance-liberation-dmg-bonus="ResonanceLiberationDMGBonus"
        :glacio="Glacio"
        :fusion="Fusion"
        :electro="Electro"
        :aero="Aero"
        :spectro="Spectro"
        :havoc="Havoc"
        :healing-bonus="healingBonus"></CalculatorStats>
      <CalculatorDamages
        :key="character"
        :character="character"
        :all-damages="allDamages"
        :rotations-list="rotationsList"
        :chosen-char="chosenChar"
        :chosen-echo-name="mainEcho"
        :is-missing-spectro-data="isMissingSpectroData"
        :is-missing-aero-erosion-data="isMissingAeroErosionData"
        :char-buffs-data="charBuffsData"
        :char-resonance-chains-data="
          charResonanceChainsData
        "></CalculatorDamages>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive, ref, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import {
  calcDamage,
  calcHeal,
  calcShield,
  getSpectroFrazzleDamage,
  getSpectroFrazzleModifierByLevelByStacks,
  getAeroErosionDamage,
  getAeroErosionModifierByLevelByStacks,
  calcMidnightVeilDMG,
} from "../calculator/calculator";
import {
  getCharByName,
  getCharactersAvailable,
  getAttackData,
} from "../characters/characters";
import CalculatorEchoes from "./CalculatorEchoes.vue";
import CalculatorWeapons from "./CalculatorWeapons.vue";
import CalculatorCharacterBuffs from "./CalculatorCharacterBuffs.vue";
import CalculatorResonanceChains from "./CalculatorResonanceChains.vue";
import CalculatorPartyBuffs from "./CalculatorPartyBuffs.vue";
import CalculatorCharacterSelect from "./CalculatorCharacterSelect.vue";
import CalculatorTalents from "./CalculatorTalents.vue";
import CalculatorEnemy from "./CalculatorEnemy.vue";
import CalculatorRotations from "./CalculatorRotations.vue";
import CalculatorCustomBuffs from "./CalculatorCustomBuffs.vue";
import CalculatorStats from "./CalculatorStats.vue";
import CalculatorDamages from "./CalculatorDamages.vue";
import CalculatorOptimizer from "./CalculatorOptimizer.vue";
import { mainEchoesData, getEchoData } from "../echoes";
import {
  echoSetAttacks,
  getEchoStats,
  getCombinedEchoStats,
} from "../echoes/stats";
import { getSetsFromEchoes, getSetBonusEffects } from "../echoes/sets";
import { allEchoBuffs, utilityAttacks } from "../buffs";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useRoute } from "vue-router";
import Nav from "./navigation/Nav.vue";
import CalculatorMobileSubNav from "./navigation/CalculatorMobileSubNav.vue";
import CalculatorSubNav from "./navigation/CalculatorSubNav.vue";

export default defineComponent({
  name: "Calculator",
  components: {
    CalculatorCharacterSelect,
    CalculatorDamages,
    CalculatorEchoes,
    CalculatorEnemy,
    CalculatorWeapons,
    CalculatorCharacterBuffs,
    CalculatorCustomBuffs,
    CalculatorPartyBuffs,
    CalculatorResonanceChains,
    CalculatorRotations,
    CalculatorStats,
    CalculatorTalents,
    CalculatorOptimizer,
    CalculatorMobileSubNav,
    CalculatorSubNav,
    Nav,
  },
  setup() {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    const { characters, activeCharacter } = storeToRefs(characterStore);
    const weaponData = reactive({});
    const weaponAtk = ref(0);
    const charBuffsData = reactive({});
    const teamBuffsData = reactive({});
    const charResonanceChainsData = reactive({});
    const charactersList = ref([]);
    const allDamages = reactive({});
    const chosenWeapon = reactive({});
    const chosenChar = reactive({});
    const echoStats = reactive({});
    const customBuffs = reactive({});
    const characterLevel = ref("90");
    const weaponType = ref("");
    const curScreen = ref("character");
    const mainEcho = ref("");
    const mainEchoRank = ref(5);
    const damage = ref(0);
    const rotationsList = ref([]);
    const character = ref("");
    const totalAtk = ref(0);
    const totalAtkPercent = ref(0);
    const totalAtkFlat = ref(0);
    const totalHp = ref(0);
    const totalHpPercent = ref(0);
    const totalHpFlat = ref(0);
    const totalDef = ref(0);
    const totalDefPercent = ref(0);
    const totalDefFlat = ref(0);
    const totalCritRate = ref(0.05);
    const totalCritDMG = ref(0.5);
    const energyRegen = ref(1);
    const healingBonus = ref(0);
    const shieldBonus = ref(0);
    const BasicAttackDMGBonus = ref(0);
    const HeavyAttackDMGBonus = ref(0);
    const ResonanceSkillDMGBonus = ref(0);
    const ResonanceLiberationDMGBonus = ref(0);
    const EchoDMGBonus = ref(0);
    const IntroSkillDMGBonus = ref(0);
    const OutroSkillDMGBonus = ref(0);
    const Glacio = ref(0);
    const Fusion = ref(0);
    const Electro = ref(0);
    const Aero = ref(0);
    const Spectro = ref(0);
    const Havoc = ref(0);
    const DefIgnore = ref(0);
    const BonusSpecificSkillDMGBonus = ref(0);
    const TotalDeepenEffect = ref(0);
    const ResistReduction = ref(0);
    const isLoading = ref(false);
    const enemyLevel = ref(90);
    const enemyResist = ref(0.1);
    // elemental effects
    const isSpectroFrazzleEnabled = ref(false);
    const spectroFrazzleStacks = ref(0);
    const isMissingSpectroData = ref(false);
    const isAeroErosionEnabled = ref(false);
    const aeroErosionStacks = ref(0);
    const isMissingAeroErosionData = ref(false);
    // component refs
    const characterBuffsRef = ref(null);
    // optimizer
    const totalCombos = ref(0);
    const processedCombos = ref(0);
    const optimizerResults = ref([]);

    charactersList.value = getCharactersAvailable();

    watch(character, async (charName) => {
      isLoading.value = true;
      const chosen = await getCharByName(charName);
      chosenChar.value = chosen;
      // set the character in the store
      characterStore.setActiveCharacter(charName);
      // update the character level
      characterLevel.value =
        characters.value?.[charName]?.characterLevel ?? "90";
      // update the weapons if needed
      if (weaponType.value !== chosenChar.value?.basic?.weapon) {
        weaponType.value = chosenChar.value?.basic?.weapon ?? "Swords";
      }
      // update the enemy data
      enemyLevel.value = characters.value?.[charName]?.enemyLevel ?? 90;
      enemyResist.value = characters.value?.[charName]?.enemyResist ?? 0.1;
      // update any elemental effects
      isSpectroFrazzleEnabled.value =
        chosenChar?.value?.basic?.spectroFrazzle ?? false;
      isAeroErosionEnabled.value =
        chosenChar?.value?.basic?.aeroErosion ?? false;
      setTimeout(() => {
        isLoading.value = false;
      }, 10);
      calcCharStats();
    });

    // set the character to display, default to the first
    let initialCharacter = activeCharacter?.value;
    // it can be a blank string, if so, set it to the first item
    if (!initialCharacter) {
      initialCharacter = charactersList.value?.five?.[0]?.key ?? "Calcharo";
    }
    character.value = initialCharacter;

    // seed initial enemy data with store data or default
    enemyLevel.value = characters.value?.[character.value]?.enemyLevel ?? 90;
    enemyResist.value = characters.value?.[character.value]?.enemyResist ?? 0.1;

    // set the character value
    characterLevel.value =
      characters.value?.[character.value]?.characterLevel ?? "90";

    const talentData = reactive({
      basic: characters.value?.[character.value]?.talents?.basic ?? 10,
      skill: characters.value?.[character.value]?.talents?.skill ?? 10,
      forte: characters.value?.[character.value]?.talents?.forte ?? 10,
      liberation:
        characters.value?.[character.value]?.talents?.liberation ?? 10,
      intro: characters.value?.[character.value]?.talents?.intro ?? 10,
    });

    const addBuffs = (source, target) => {
      if (source) {
        target.attackPercent += source?.ATK ? source.ATK * 100 : 0;
        target.hpPercent += source?.HP ? source.HP * 100 : 0;
        target.defPercent += source?.DEF ? source.DEF * 100 : 0;
        target.attackFlat += source?.ATK_FLAT ?? 0;
        target.hpFlat += source?.HP_FLAT ?? 0;
        target.defFlat += source?.DEF_FLAT ?? 0;
        target.critRate += source?.CritRate ? source.CritRate * 100 : 0;
        target.critDMG += source?.CritDMG ? source.CritDMG * 100 : 0;
        target.energyRegen += source?.EnergyRegen ? source.EnergyRegen : 0;
        target.healingBonus += source?.HealingBonus ? source.HealingBonus : 0;
        target.shieldBonus += source?.ShieldBonus ? source.ShieldBonus : 0;
        target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
          ? source.BasicAttackDMGBonus * 100
          : 0;
        target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
          ? source.HeavyAttackDMGBonus * 100
          : 0;
        target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
          ? source.ResonanceSkillDMGBonus * 100
          : 0;
        target.introSkillDMGBonus += source?.IntroSkillDMGBonus
          ? source.IntroSkillDMGBonus * 100
          : 0;
        target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
          ? source.OutroSkillDMGBonus * 100
          : 0;
        target.resonanceLiberationDMGBonus +=
          source?.ResonanceLiberationDMGBonus
            ? source.ResonanceLiberationDMGBonus * 100
            : 0;
        target.echoDMGBonus += source?.EchoDMGBonus
          ? source.EchoDMGBonus * 100
          : 0;
        target.glacio += source?.Glacio ? source.Glacio * 100 : 0;
        target.fusion += source?.Fusion ? source.Fusion * 100 : 0;
        target.electro += source?.Electro ? source.Electro * 100 : 0;
        target.aero += source?.Aero ? source.Aero * 100 : 0;
        target.spectro += source?.Spectro ? source.Spectro * 100 : 0;
        target.havoc += source?.Havoc ? source.Havoc * 100 : 0;
        target.defIgnore += source?.DEFIgnore ? source.DEFIgnore * 100 : 0;
        target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
          ? source.BonusSpecificSkillDMGBonus * 100
          : 0;
        target.totalDeepenEffect += source?.DMGDeepen ? source.DMGDeepen : 0;
        target.resistReduction += source?.ResistReduction
          ? source.ResistReduction * 100
          : 0;
      }
    };
    const addEchoBuffs = (source, target, returnCopy = false) => {
      // we make a clone to make sure we don't mutate the original
      // mostly used in the optimizer so we can have a constant base, and then layer on the echo buffs
      // without messing up the original state of stats
      if (returnCopy) {
        target = JSON.parse(JSON.stringify(target));
      }
      if (source) {
        target.attackPercent += source?.ATK ? source.ATK : 0;
        target.hpPercent += source?.HP ? source.HP : 0;
        target.defPercent += source?.DEF ? source.DEF : 0;
        target.attackFlat += source?.ATK_FLAT ?? 0;
        target.hpFlat += source?.HP_FLAT ?? 0;
        target.defFlat += source?.DEF_FLAT ?? 0;
        target.critRate += source?.CritRate ? source.CritRate : 0;
        target.critDMG += source?.CritDMG ? source.CritDMG : 0;
        target.energyRegen += source?.EnergyRegen
          ? source.EnergyRegen / 100
          : 0;
        target.healingBonus += source?.HealingBonus
          ? source.HealingBonus / 100
          : 0;
        target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
          ? source.BasicAttackDMGBonus
          : 0;
        target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
          ? source.HeavyAttackDMGBonus
          : 0;
        target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
          ? source.ResonanceSkillDMGBonus
          : 0;
        target.resonanceLiberationDMGBonus +=
          source?.ResonanceLiberationDMGBonus
            ? source.ResonanceLiberationDMGBonus
            : 0;
        target.echoDMGBonus += source?.EchoDMGBonus ? source.EchoDMGBonus : 0;
        target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
          ? source.OutroSkillDMGBonus
          : 0;
        target.glacio += source?.Glacio ? source.Glacio : 0;
        target.fusion += source?.Fusion ? source.Fusion : 0;
        target.electro += source?.Electro ? source.Electro : 0;
        target.aero += source?.Aero ? source.Aero : 0;
        target.spectro += source?.Spectro ? source.Spectro : 0;
        target.havoc += source?.Havoc ? source.Havoc : 0;
        target.defIgnore += source?.DEFIgnore ? source.DEFIgnor : 0;
        target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
          ? source.BonusSpecificSkillDMGBonus
          : 0;
        target.totalDeepenEffect += source?.TotalDeepenEffect
          ? source.TotalDeepenEffect
          : 0;
        target.resistReduction += source?.ResistReduction
          ? source.ResistReduction
          : 0;

        if (source?.AllAttributeBonus) {
          const allAttributeBonus = source.AllAttributeBonus;
          target.basicAttackDMGBonus += allAttributeBonus;
          target.heavyAttackDMGBonus += allAttributeBonus;
          target.resonanceSkillDMGBonus += allAttributeBonus;
          target.resonanceLiberationDMGBonus += allAttributeBonus;
          target.introSkillDMGBonus += allAttributeBonus;
          target.outroSkillDMGBonus += allAttributeBonus;
        }
        if (source?.AllElementAttributeBonus) {
          const allElementAttributeBonus = source.AllElementAttributeBonus;
          target.glacio += allElementAttributeBonus;
          target.fusion += allElementAttributeBonus;
          target.electro += allElementAttributeBonus;
          target.aero += allElementAttributeBonus;
          target.spectro += allElementAttributeBonus;
          target.havoc += allElementAttributeBonus;
        }
      }
      if (returnCopy) {
        return target;
      }
    };

    const calcCharStats = (
      returnValue = false,
      injectStats = null,
      ignoreBuffs = {}, // e.g. {ignoreTeamBuffs: true}
      injectEchoStats = null,
    ) => {
      const { ignoreTeamBuffs, ignoreWeaponBuffs, ignoreEchoes } = ignoreBuffs;
      let stats = {
        attackPercent: 0,
        hpPercent: 0,
        defPercent: 0,
        attackFlat: 0,
        hpFlat: 0,
        defFlat: 0,
        critRate: 5,
        critDMG: 150,
        energyRegen: 1,
        healingBonus: 0,
        shieldBonus: 0,
        basicAttackDMGBonus: 0,
        heavyAttackDMGBonus: 0,
        resonanceSkillDMGBonus: 0,
        introSkillDMGBonus: 0,
        outroSkillDMGBonus: 0,
        resonanceLiberationDMGBonus: 0,
        echoDMGBonus: 0,
        glacio: 0,
        fusion: 0,
        electro: 0,
        aero: 0,
        spectro: 0,
        havoc: 0,
        defIgnore: 0,
        bonusSpecificSkillDMGBonus: 0,
        totalDeepenEffect: 0,
        resistReduction: 0,
      };
      let charHp = 0;
      let charAtk = 0;
      let charDef = 0;
      let weaponAtk = 0;

      let weaponModifer = null;
      let weaponModifierValue = 0;
      let weaponPassiveData = {};
      let resonanceChainsData = {};
      if (chosenChar.value) {
        const { hp, attack, defense } =
          chosenChar.value.getCharacterStatsByLevel(characterLevel.value);
        charHp = hp;
        charAtk = attack;
        charDef = defense;
      }

      if (charBuffsData.value) {
        addBuffs(charBuffsData.value, stats);
      }

      if (injectStats) {
        addBuffs(injectStats, stats);
      }

      if (charResonanceChainsData.value) {
        addBuffs(charResonanceChainsData.value, stats);

        resonanceChainsData = charResonanceChainsData.value ?? {};
        if (resonanceChainsData?.AllAttributeBonus) {
          const allAttributeBonus = resonanceChainsData.AllAttributeBonus * 100;
          stats.basicAttackDMGBonus += allAttributeBonus;
          stats.heavyAttackDMGBonus += allAttributeBonus;
          stats.resonanceSkillDMGBonus += allAttributeBonus;
          stats.resonanceLiberationDMGBonus += allAttributeBonus;
          stats.introSkillDMGBonus += allAttributeBonus;
          stats.outroSkillDMGBonus += allAttributeBonus;
        }
        if (resonanceChainsData?.AllElementAttributeBonus) {
          const allElementAttributeBonus =
            resonanceChainsData.AllElementAttributeBonus * 100;
          stats.glacio += allElementAttributeBonus;
          stats.fusion += allElementAttributeBonus;
          stats.electro += allElementAttributeBonus;
          stats.aero += allElementAttributeBonus;
          stats.spectro += allElementAttributeBonus;
          stats.havoc += allElementAttributeBonus;
        }
      }

      if (weaponData.value) {
        weaponAtk = weaponData.value?.attack;
        weaponModifer = weaponData.value?.modifier;
        weaponModifierValue = weaponData.value?.modifierValue;
        weaponPassiveData = weaponData.value?.weaponPassiveStats ?? {};

        weaponPassiveData = Object.fromEntries(
          Object.entries(weaponPassiveData).filter(([_, v]) => v != null),
        );

        if (!ignoreWeaponBuffs) {
          addBuffs(weaponPassiveData, stats);

          if (weaponPassiveData?.AllElementAttributeBonus) {
            const allElementAttributeBonus =
              weaponPassiveData.AllElementAttributeBonus * 100;
            stats.glacio += allElementAttributeBonus;
            stats.fusion += allElementAttributeBonus;
            stats.electro += allElementAttributeBonus;
            stats.aero += allElementAttributeBonus;
            stats.spectro += allElementAttributeBonus;
            stats.havoc += allElementAttributeBonus;
          }

          if (weaponPassiveData?.AllResonanceDMG) {
            const allResonanceDMG = weaponPassiveData.AllResonanceDMG * 100;
            stats.resonanceSkillDMGBonus += allResonanceDMG;
            stats.resonanceLiberationDMGBonus += allResonanceDMG;
          }
        }

        switch (weaponModifer) {
          case "ATK":
            stats.attackPercent += weaponModifierValue * 100;
            break;
          case "HP":
            stats.hpPercent += weaponModifierValue * 100;
            break;
          case "DEF":
            stats.defPercent += weaponModifierValue * 100;
            break;
          case "CritRate":
            stats.critRate += weaponModifierValue * 100;
            break;
          case "CritDMG":
            stats.critDMG += weaponModifierValue * 100;
            break;
          case "EnergyRegen":
            stats.energyRegen += weaponModifierValue;
            break;
          case "HealingBonus":
            stats.healingBonus += weaponModifierValue;
            break;
        }
      }

      if (echoStats && !ignoreEchoes) {
        addEchoBuffs(echoStats?.value, stats);
      }

      if (injectEchoStats) {
        addEchoBuffs(injectEchoStats, stats);
      }

      if (customBuffs.value) {
        addBuffs(customBuffs?.value, stats);
      }

      if (teamBuffsData.value && !ignoreTeamBuffs) {
        addBuffs(teamBuffsData.value, stats);

        if (teamBuffsData?.value?.AllAttributeBonus) {
          const allAttributeBonus =
            teamBuffsData?.value?.AllAttributeBonus * 100;
          stats.basicAttackDMGBonus += allAttributeBonus;
          stats.heavyAttackDMGBonus += allAttributeBonus;
          stats.resonanceSkillDMGBonus += allAttributeBonus;
          stats.resonanceLiberationDMGBonus += allAttributeBonus;
          stats.introSkillDMGBonus += allAttributeBonus;
          stats.outroSkillDMGBonus += allAttributeBonus;
        }
        if (teamBuffsData?.value?.AllElementAttributeBonus) {
          const allElementAttributeBonus =
            teamBuffsData?.value.AllElementAttributeBonus * 100;
          stats.glacio += allElementAttributeBonus;
          stats.fusion += allElementAttributeBonus;
          stats.electro += allElementAttributeBonus;
          stats.aero += allElementAttributeBonus;
          stats.spectro += allElementAttributeBonus;
          stats.havoc += allElementAttributeBonus;
        }
      }

      // add any buffs that are based on total / additional stats
      if (charBuffsData.value) {
        const charBuffKeys = Object.keys(charBuffsData.value);
        const charBuffDetails = chosenChar.value?.buffs ?? [];
        // find any with "Additional" in it
        const additionalBasedBuffs = charBuffKeys.filter(
          (buff, index, allBuffKeys) => {
            // TODO: Implement the replacedBy logic
            // Temporary: Brant has two flat buffs. The first one
            // replaces the second one. This is a temporary fix.
            if (character.value === "Brant") {
              if (
                buff === "ATK_FLAT2:AdditionalBase" &&
                allBuffKeys.includes("ATK_FLAT:AdditionalBase")
              ) {
                return false;
              }
            }
            return buff.includes("AdditionalBase");
          },
        );

        additionalBasedBuffs.forEach((buff) => {
          // find the buff data, it has more data we need
          let buffParams;
          for (const charBuffDetail of charBuffDetails) {
            const foundModifier = charBuffDetail.modifiers.find((modifier) => {
              return modifier.modifier === buff;
            });
            if (foundModifier) {
              buffParams = foundModifier;
              break;
            }
          }
          if (buffParams) {
            // now calc the amount we get
            let base = 0;
            let currentAmount = 0;
            switch (buffParams.modifierBasedOn) {
              // if there's a minStatValue, use that or use the default base
              // some characters use full base (e.g. SK), some use a minimum amount (Roccia)
              case "EnergyRegen":
                base = buffParams?.minStatValue ?? 0;
                currentAmount = stats.energyRegen;
                break;
              case "CritRate":
                base = buffParams?.minStatValue ?? 0.05;
                currentAmount = stats.critRate;
                break;
              case "CritDMG":
                base = buffParams?.minStatValue ?? 1.5;
                currentAmount = stats.critDMG;
                break;
              default:
                base = buffParams?.minStatValue ?? 0;
                break;
            }
            const additionalAmount = currentAmount - base;
            const steps = Math.floor(
              additionalAmount / buffParams.modifierStep,
            );
            let buffValue = steps * buffParams.modifierValue;
            if (buffValue > buffParams.maximumValue) {
              buffValue = buffParams.maximumValue;
            }
            // don't allow the buff to go negative and reduce your stats
            if (buffValue < 0) {
              buffValue = 0;
            }
            // now apply the buff
            switch (buffParams.modifierTargetAttr) {
              case "CritRate":
                stats.critRate += buffValue * 100;
                break;
              case "CritDMG":
                stats.critDMG += buffValue * 100;
                break;
              case "ATK":
                stats.attackPercent += buffValue * 100;
                break;
              case "ATK_FLAT":
                stats.attackFlat += buffValue;
                break;
            }
          }
        });
      }

      // check for CritOverflow
      // TODO: if this is Augusta, look for "SequenceNode2CleansedinCrimsonWar", and SequenceNode6EngravedinRadiantLight
      // in the resonance chains of the character in the store
      // if found, then apply the crit overflow logic
      if (character.value === "Augusta") {
        const isAugustaS2Enabled =
          characters.value?.[character.value]?.resonanceChains
            ?.SequenceNode2CleansedinCrimsonWar?.isEnabled ?? false;
        const isAugustaS6Enabled =
          characters.value?.[character.value]?.resonanceChains
            ?.SequenceNode6EngravedinRadiantLight?.isEnabled ?? false;
        if (isAugustaS2Enabled) {
          const overflowConfigs = {
            modifier: "CritOverflow",
            modifierValue: 2,
            overflowStep: 1, // for every 1% CR
            overflowMin: 100, // must be 100% CR
            overflowMax: 100, // can only get 100% CD from this
          };
          const currentCritRate = stats.critRate;
          if (currentCritRate > overflowConfigs.overflowMin) {
            const { modifierValue, overflowStep, overflowMin, overflowMax } =
              overflowConfigs;
            // Calculate how much Crit Rate is overflowing (above 100%)
            const overflowAmount = Math.max(0, currentCritRate - overflowMin);
            // Calculate how many overflow steps we have
            const overflowSteps = Math.floor(overflowAmount / overflowStep);
            // Calculate the Crit DMG bonus from overflow (capped by overflowMax)
            const overflowBonus = Math.min(
              overflowSteps * modifierValue,
              overflowMax,
            );
            // Apply the overflow bonus to Crit DMG
            stats.critDMG += overflowBonus;
          }
        }
        if (isAugustaS6Enabled) {
          const overflowConfigs = {
            modifier: "CritOverflow",
            modifierValue: 2,
            overflowStep: 1, // for every 1% CR
            overflowMin: 150, // must be 100% CR
            overflowMax: 50, // can only get 100% CD from this
          };
          const currentCritRate = stats.critRate;
          if (currentCritRate > overflowConfigs.overflowMin) {
            const { modifierValue, overflowStep, overflowMin, overflowMax } =
              overflowConfigs;
            // Calculate how much Crit Rate is overflowing (above 100%)
            const overflowAmount = Math.max(0, currentCritRate - overflowMin);
            // Calculate how many overflow steps we have
            const overflowSteps = Math.floor(overflowAmount / overflowStep);
            // Calculate the Crit DMG bonus from overflow (capped by overflowMax)
            const overflowBonus = Math.min(
              overflowSteps * modifierValue,
              overflowMax,
            );
            // Apply the overflow bonus to Crit DMG
            stats.critDMG += overflowBonus;
          }
        }
      }

      if (returnValue) {
        switch (returnValue) {
          case "All":
            const returnedStats = { ...stats };
            returnedStats.totalAtk =
              (charAtk + weaponAtk) * (1 + stats.attackPercent / 100) +
              stats.attackFlat;
            returnedStats.totalHp =
              charHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
            returnedStats.totalDef =
              charDef * (1 + stats.defPercent / 100) + stats.defFlat;
            returnedStats.totalCritRate = stats.critRate / 100;
            returnedStats.totalCritDMG = stats.critDMG / 100;
            returnedStats.DefIgnore = stats.defIgnore / 100;
            return returnedStats;
          case "HP":
            return charHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
          case "DEF":
            return charDef * (1 + stats.defPercent / 100) + stats.defFlat;
          case "ATK":
          default:
            return (
              (charAtk + weaponAtk) * (1 + stats.attackPercent / 100) +
              stats.attackFlat
            );
        }
      }

      totalAtkPercent.value = stats.attackPercent;
      totalAtkFlat.value = stats.attackFlat;
      totalHpPercent.value = stats.hpPercent;
      totalHpFlat.value = stats.hpFlat;
      totalDefPercent.value = stats.defPercent;
      totalDefFlat.value = stats.defFlat;
      totalAtk.value =
        (charAtk + weaponAtk) * (1 + stats.attackPercent / 100) +
        stats.attackFlat;
      totalHp.value = charHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
      totalDef.value = charDef * (1 + stats.defPercent / 100) + stats.defFlat;
      totalCritRate.value = stats.critRate / 100;
      totalCritDMG.value = stats.critDMG / 100;
      energyRegen.value = stats.energyRegen;
      healingBonus.value = stats.healingBonus;
      shieldBonus.value = stats.shieldBonus;
      BasicAttackDMGBonus.value = stats.basicAttackDMGBonus;
      HeavyAttackDMGBonus.value = stats.heavyAttackDMGBonus;
      ResonanceSkillDMGBonus.value = stats.resonanceSkillDMGBonus;
      IntroSkillDMGBonus.value = stats.introSkillDMGBonus;
      OutroSkillDMGBonus.value = stats.outroSkillDMGBonus;
      ResonanceLiberationDMGBonus.value = stats.resonanceLiberationDMGBonus;
      EchoDMGBonus.value = stats.echoDMGBonus;
      Glacio.value = stats.glacio;
      Fusion.value = stats.fusion;
      Electro.value = stats.electro;
      Aero.value = stats.aero;
      Spectro.value = stats.spectro;
      Havoc.value = stats.havoc;
      DefIgnore.value = stats.defIgnore / 100;
      BonusSpecificSkillDMGBonus.value = stats.bonusSpecificSkillDMGBonus;
      TotalDeepenEffect.value = stats.totalDeepenEffect;
      ResistReduction.value = stats.resistReduction;

      calcAllDamages();
    };

    const getElementDmgBonusByType = (element, providedStats) => {
      let val = 0;
      switch (element) {
        case "Glacio":
          val = providedStats?.glacio ?? Glacio.value;
          break;
        case "Fusion":
          val = providedStats?.fusion ?? Fusion.value;
          break;
        case "Electro":
          val = providedStats?.electro ?? Electro.value;
          break;
        case "Aero":
          val = providedStats?.aero ?? Aero.value;
          break;
        case "Spectro":
          val = providedStats?.spectro ?? Spectro.value;
          break;
        case "Havoc":
          val = providedStats?.havoc ?? Havoc.value;
          break;
      }

      return val / 100;
    };

    const getDamageTypeBonusByType = (type, providedStats) => {
      let val = 0;
      switch (type) {
        case "Basic":
          val = providedStats?.basicAttackDMGBonus ?? BasicAttackDMGBonus.value;
          break;
        case "Heavy":
          val = providedStats?.heavyAttackDMGBonus ?? HeavyAttackDMGBonus.value;
          break;
        case "Skill":
          val =
            providedStats?.resonanceSkillDMGBonus ??
            ResonanceSkillDMGBonus.value;
          break;
        case "Intro":
          val = providedStats?.introSkillDMGBonus ?? IntroSkillDMGBonus.value;
          break;
        case "Outro":
          val = providedStats?.outroSkillDMGBonus ?? OutroSkillDMGBonus.value;
          break;
        case "Liberation":
          val =
            providedStats?.resonanceLiberationDMGBonus ??
            ResonanceLiberationDMGBonus.value;
          break;
        case "Echo":
          val = providedStats?.echoDmgBonus ?? EchoDMGBonus.value;
          break;
        // do not divide this by 100
        case "Healing":
          return providedStats?.healingBonus ?? healingBonus.value;
        case "Shield":
          return providedStats?.shieldBonus ?? shieldBonus.value;
      }

      return val / 100;
    };

    const getDamageValByAttr = (attribute = "attack", providedStats) => {
      switch (attribute) {
        case "defense":
          return providedStats?.totalDef ?? totalDef.value;
        case "hp":
          return providedStats?.totalHp ?? totalHp.value;
        case "EnergyRegen":
          // we store the ER in decimal form, but for calculating damages based on ER
          // it uses the full amount (1.5 => 150%)
          const decimalEnergy = providedStats?.energyRegen ?? energyRegen.value;
          const intEnergy = decimalEnergy * 100;
          return intEnergy;
        case "attack":
        default:
          return providedStats?.totalAtk ?? totalAtk.value;
      }
    };


      const processAttacks = (
        attacks,
        talentType,
        hasNoTalentLevel = false,
        dynamicTalentType = false,
        excludeDisabledAttacks = true, // e.g. ones that are unlocked through chains should be hidden by default
      ) => {
        return (
          (attacks ?? [])
            .map((attack) => {
              let isEnabled = true;
              let originalIsEnabled = true; // used for rotations. we show them, but disable them, so isEnabled is overwritten
              // if this attack requires a resonance chain to be unlocked, verify it's enabled
              const requiresResonanceChain =
                attack?.requiresResonanceChain ?? false;
              if (requiresResonanceChain) {
                const resonanceChainsEnabledAttacks =
                  charResonanceChainsData.value?.EnableAttack ?? [];
                const charBuffsEnabledAttacks =
                  charBuffsData.value?.EnableAttack ?? [];
                // merge all possible enabled attack arrays together
                const enabledAttacks = []
                  .concat(resonanceChainsEnabledAttacks)
                  .concat(charBuffsEnabledAttacks);
                const isAttackEnabled = enabledAttacks.includes(
                  attack.requiresResonanceChain,
                );
                // flag this attack as enabled or not based on the resonance chain
                isEnabled = isAttackEnabled;
                originalIsEnabled = isEnabled;
              }
              if (!excludeDisabledAttacks) {
                isEnabled = true;
              }
              let talent;
              if (hasNoTalentLevel) {
                talent = attack.talent;
              } else if (dynamicTalentType) {
                let talent;
                switch (attack.actionType) {
                  case "basic":
                    talent = attack.talents[talentData.basic];
                    break;
                  case "skill":
                    talent = attack.talents[talentData.skill];
                    break;
                  case "forteCircuit":
                    talent = attack.talents[talentData.forte];
                    break;
                  case "liberation":
                    talent = attack.talents[talentData.liberation];
                    break;
                  case "intro":
                    talent = attack.talents[talentData.intro];
                    break;
                  case "outro":
                    // outro has no talent tree. it only has 1 value (e.g. 20.00%)
                    talent = attack.talent;
                    break;
                  case "utilityAttacks":
                    // outro has no talent tree. it only has 1 value (e.g. 20.00%)
                    talent = attack.talent;
                    break;
                }
              } else {
                talent = attack.talents[talentType];
              }
              const hitCount = attack?.count ?? 1;
              let attackType = attack.type;
              // is there an attack type override? if so, update it
              const attackTypeOverrideResChain =
                charResonanceChainsData.value?.specificTalentBuffs?.[
                  `${attack.key}:talentTypeOverride`
                ] ?? null;
              const attackTypeOverrideSelfBuff =
                charBuffsData.value?.specificTalentBuffs?.[
                  `${attack.key}:talentTypeOverride`
                ] ?? null;
              if (attackTypeOverrideResChain) {
                attackType = attackTypeOverrideResChain;
              }
              if (attackTypeOverrideSelfBuff) {
                attackType = attackTypeOverrideSelfBuff;
              }
              return {
                id: attack.id ?? attack.key,
                key: attack.key,
                label: attack.label,
                talent,
                damage: calculateAttackDamage(
                  attack,
                  talentType,
                  hasNoTalentLevel,
                  dynamicTalentType,
                  hitCount,
                ),
                isEnabled,
                originalIsEnabled,
                requiresResonanceChain,
                type: attackType,
                count: attack.count,
                alwaysCrit: attack.alwaysCrit ?? false,
              };
            })
            // remove any attacks that are not enabled
            .filter((attack) => attack.isEnabled)
        );
      };


      const calculateAttackDamage = (
        attack,
        talentType,
        hasNoTalentLevel = false,
        hasDynamicTalent = false,
        count = 1,
      ) => {
        const { excludeTeamBuffs, excludeWeaponBuffs } = attack;
        let statsWithoutTeamBuffs = null;
        if (excludeTeamBuffs || excludeWeaponBuffs) {
          statsWithoutTeamBuffs = calcCharStats("All", null, {
            ignoreTeamBuffs: excludeTeamBuffs,
            ignoreWeaponBuffs: excludeWeaponBuffs,
          });
        }
        let attackType = attack.type;
        const selfBuffs = JSON.parse(JSON.stringify(charBuffsData.value ?? {}));
        /**
         * check if there are any buffs that buff another buff
         * look through the object of charResonanceChainsData.value for any ${attack.key}:MultiplySelfBuffs
         * and apply them to the selfBuffs object. it will be in specificTalentBuffs
         * { specificTalentBuffs: { PoeticEssenceSkillDMG:MultiplySelfBuff: 2 } }
         */
        const resonanceChainsKeys = Object.keys(
          charResonanceChainsData.value?.specificTalentBuffs ?? {},
        );
        const resonanceChainsKeysWithMultiply = resonanceChainsKeys.filter(
          (key) => key.includes("MultiplySelfBuff"),
        );
        if (resonanceChainsKeysWithMultiply.length > 0) {
          resonanceChainsKeysWithMultiply.forEach((key) => {
            const buffValue =
              charResonanceChainsData.value?.specificTalentBuffs?.[key];
            const buffReferenceKey = key.split(":")[0]; // e.g. PoeticEssenceSkillDMG
            // // check if the buffReferenceKey is in the selfBuffs object
            if (selfBuffs?.specificTalentBuffs?.[buffReferenceKey]) {
              // multiply the buff value by the buffValue
              selfBuffs.specificTalentBuffs[buffReferenceKey] *= buffValue;
            }
          });
        }

        // apply any buff changes
        // is there an attack type override? if so, update it
        const attackTypeOverrideResChain =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentTypeOverride`
          ] ?? null;
        const attackTypeOverrideSelfBuff =
          selfBuffs?.specificTalentBuffs?.[
            `${attack.key}:talentTypeOverride`
          ] ?? null;
        if (attackTypeOverrideResChain) {
          attackType = attackTypeOverrideResChain;
        }
        if (attackTypeOverrideSelfBuff) {
          attackType = attackTypeOverrideSelfBuff;
        }
        // an attack can have its own element override
        const attackElement =
          attack?.element ?? chosenChar.value?.basic?.element;
        let elementalDmgBonusDecimal = getElementDmgBonusByType(
          attackElement,
          statsWithoutTeamBuffs,
        );
        const atkDefHpVal = getDamageValByAttr(
          attack?.attribute,
          statsWithoutTeamBuffs,
        );
        let totalSkillDmgBonus = getDamageTypeBonusByType(
          attackType,
          statsWithoutTeamBuffs,
        );
        let talent;
        let talentTree = attack?.talents;

        // see if we have a talent modifier replacement to override the talent value
        const talentModifierReplace =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentReplace`
          ] ?? null;
        if (talentModifierReplace) {
          talentTree = talentModifierReplace;
        }

        if (hasNoTalentLevel) {
          talent = attack.talent;
        } else if (hasDynamicTalent) {
          switch (attack.actionType) {
            case "basic":
              talent = talentTree[talentData.basic];
              break;
            case "skill":
              talent = talentTree[talentData.skill];
              break;
            case "forteCircuit":
              talent = talentTree[talentData.forte];
              break;
            case "liberation":
              talent = talentTree[talentData.liberation];
              break;
            case "intro":
              talent = talentTree[talentData.intro];
              break;
            case "outro":
              // outros have no talent tree, just a single value
              talent = attack.talent;
              break;
            case "utilityAttacks":
              // utility have no talent tree, just a single value
              talent = attack.talent;
              break;
            case "echoSetAttacks":
              // echo set attacks have no talent tree, just a single value
              talent = attack.talent;
              break;
          }
        } else {
          talent = talentTree[talentType];
        }
        const talentModifierAdd = selfBuffs?.[attack.key] ?? 0;
        // TODO: Is this used anywhere?
        const talentModifierAddFromResonanceChains =
          charResonanceChainsData.value?.[attack.key] ?? 0;
        // flat adding to the base multiplier for a specific attack
        const talentModifierAddFromResonanceChainsAdd =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiplyAdd`
          ] ?? 0;
        const talentModifierAddFromSelfBuffs =
          selfBuffs?.[`${attack.key}:talentModifierMultiplyAdd`] ?? 0;
        const attackBuffsTalentModifierAdd =
          attack?.buffs?.talentModifierAdd ?? 0;
        const totalTalentModifierAdd =
          talentModifierAdd +
          talentModifierAddFromResonanceChains +
          talentModifierAddFromResonanceChainsAdd +
          talentModifierAddFromSelfBuffs +
          attackBuffsTalentModifierAdd;

        const specificSkillDmgFromResonanceChains =
          charResonanceChainsData.value?.specificTalentBuffs?.[attack.key] ?? 0;
        // apply echo based coordianted dmg bonus (both echo set and main echo)
        // as well as custom buffs for coordinated attacks
        let coordinatedEchoDmgBonus = 0;
        let coordinatedDmgBonusCustomBuffs = 0;
        if (attack?.subType === "Coordinated") {
          coordinatedEchoDmgBonus = echoStats?.value?.CoordinatedDMGBonus ?? 0;
          coordinatedDmgBonusCustomBuffs =
            customBuffs?.value?.CoordinatedDMGBonus ?? 0;
        }
        // there are bonuses that are based on Max HP, Max ATK, Max DEF
        // we end up with DMG Bonus %, so we also / 100 in the end
        const specificSkillDmgFromResonanceChainsBasedOnMaxHp =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DMGBonus:MaxHP`
          ] ?? 0;
        const specificSkillDmgFromResonanceChainsBasedOnMaxAtk =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DMGBonus:MaxAtk`
          ] ?? 0;
        const specificSkillDmgFromResonanceChainsBasedOnMaxDef =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DMGBonus:MaxDef`
          ] ?? 0;
        const specificSkillDmgFromResonanceChainsBasedOnMaxHpVal =
          (totalHp.value * specificSkillDmgFromResonanceChainsBasedOnMaxHp) /
          100;
        const specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal =
          (totalAtk.value * specificSkillDmgFromResonanceChainsBasedOnMaxAtk) /
          100;
        const specificSkillDmgFromResonanceChainsBasedOnMaxDefVal =
          (totalDef.value * specificSkillDmgFromResonanceChainsBasedOnMaxDef) /
          100;
        // end max buff handlers
        const specificSkillDmgFromCharBuffs =
          selfBuffs?.specificTalentBuffs?.[attack.key] ?? 0;
        const specificSkillDmgFromCharBuffsWithElement =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:${attackElement}`] ??
          0;
        const specificSkillDmgFromEchoes =
          echoStats.value?.specificTalentBuffs?.[attack.key] ?? 0;
        const genericSkillDmgBonusResChain =
          charResonanceChainsData.value?.DMGBonus ?? 0;
        const genericSkillDmgBonusSelfBuff = selfBuffs?.DMGBonus ?? 0;
        let genericSkillDmgBonusWeaponBuff =
          weaponData?.value?.weaponPassiveStats?.DMGBonus ?? 0;
        if (excludeWeaponBuffs) {
          genericSkillDmgBonusWeaponBuff = 0;
        }
        const genericSkillDmgBonusEchoBuff = echoStats.value?.DMGBonus ?? 0;
        let genericSkillDmgBonusTeamEchoBuff =
          teamBuffsData.value?.DMGBonus ?? 0;
        if (excludeTeamBuffs) {
          genericSkillDmgBonusTeamEchoBuff = 0;
        }
        const extraDefIgnoreResonanceChain =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DEFIgnore`
          ] ?? 0;
        const extraDefIgnoreCharBuff =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:DEFIgnore`] ?? 0;
        const extraDefIgnoreCustomBuffs = customBuffs.value?.DefIgnore ?? 0;
        const attackBuffsDefIgnore = attack?.buffs?.DefIgnore ?? 0;
        let weaponDefIgnoreSpecificDmgType =
          weaponData?.value?.weaponPassiveStats?.[`DEFIgnore:${attack.type}`] ??
          0;
        if (excludeWeaponBuffs) {
          weaponDefIgnoreSpecificDmgType = 0;
        }
        const specificSkillExtraCritRate =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:CritRate`
          ] ?? 0;
        const specificSkillExtraCritDMG =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:CritDMG`
          ] ?? 0;
        let instanceDmgCritRate =
          totalCritRate.value + specificSkillExtraCritRate;
        if (excludeTeamBuffs) {
          instanceDmgCritRate = statsWithoutTeamBuffs?.totalCritRate ?? 0;
          instanceDmgCritRate += specificSkillExtraCritRate;
        }
        let instanceDmgCritDMG = totalCritDMG.value + specificSkillExtraCritDMG;
        if (excludeTeamBuffs) {
          instanceDmgCritDMG = statsWithoutTeamBuffs?.totalCritDMG ?? 0;
          instanceDmgCritDMG += specificSkillExtraCritDMG;
        }
        const talentModifierMultiply =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiply`
          ] ?? 0;
        const talentModifierMultiplySelfBuff =
          selfBuffs?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiply`
          ] ?? 0;
        const talentModifierMultiplyAttackBuff =
          attack?.buffs?.talentModifierMultiply ?? 0;
        const totalDefIgnore =
          DefIgnore.value +
          extraDefIgnoreResonanceChain +
          extraDefIgnoreCharBuff +
          extraDefIgnoreCustomBuffs +
          attackBuffsDefIgnore +
          weaponDefIgnoreSpecificDmgType;
        let specificSkillDmg =
          specificSkillDmgFromResonanceChains +
          specificSkillDmgFromCharBuffs +
          specificSkillDmgFromCharBuffsWithElement +
          genericSkillDmgBonusResChain +
          genericSkillDmgBonusSelfBuff +
          genericSkillDmgBonusWeaponBuff +
          genericSkillDmgBonusTeamEchoBuff +
          specificSkillDmgFromEchoes +
          specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
          specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
          specificSkillDmgFromResonanceChainsBasedOnMaxDefVal +
          // echo buffs are in full integers, need to divide since everything else is decimal
          // TODO: when refactoring echoes, move to decimals
          coordinatedEchoDmgBonus / 100 +
          genericSkillDmgBonusEchoBuff / 100 +
          coordinatedDmgBonusCustomBuffs;
        let teamBuffResistShredForCharElement =
          teamBuffsData.value?.[`ResistShred:${attackElement}`] ?? 0;
        let selfBuffResistShredForCharElement =
          selfBuffs?.[`ResistShred:${attackElement}`] ?? 0;
        let selfBuffResistShredForCharElementSpecificAttack =
          selfBuffs?.specificTalentBuffs?.[
            `${attack.key}:ResistShred:${attackElement}`
          ] ?? 0;
        let weaponBuffResistShredForCharElement =
          weaponData.value?.weaponPassiveStats?.[
            `ResistShred:${attackElement}`
          ] ?? 0;
        if (excludeWeaponBuffs) {
          weaponBuffResistShredForCharElement = 0;
        }
        if (excludeTeamBuffs) {
          teamBuffResistShredForCharElement = 0;
        }

        const resonanceChainResistShredForCharElement =
          charResonanceChainsData.value?.[`ResistShred:${attackElement}`] ?? 0;
        const baseResistReduction = ResistReduction.value ?? 0;
        const customResistReduction = customBuffs.value?.ResistShred ?? 0;
        const actionBuffResistReduction = attack.buffs?.ResistShred ?? 0;
        const totalResistReduction =
          baseResistReduction +
          teamBuffResistShredForCharElement +
          resonanceChainResistShredForCharElement +
          selfBuffResistShredForCharElement +
          selfBuffResistShredForCharElementSpecificAttack +
          weaponBuffResistShredForCharElement +
          actionBuffResistReduction +
          customResistReduction;
        // damage deepen
        let baseTotalDeepenEffect = TotalDeepenEffect.value;
        // so far damage deepen is from team buffs, add more later if needed
        // get element first, then any skill specific ones next, then add together
        // NOTE: all outro attacks cannot use the DMGDeepen:element|attackType
        // as they expire before the outro attacks occur. so ignore these
        // for outro attacks
        // self subtype dmg deepen
        let selfBuffDmgDeepenForSubType =
          charBuffsData.value?.[`DMGDeepen:${attack.subType}`] ?? 0;
        let selfBuffDmgDeepenForElement =
          charBuffsData.value?.[`DMGDeepen:${attackElement}`] ?? 0;
        let teamBuffDmgDeepenForCharElement =
          teamBuffsData.value?.[`DMGDeepen:${attackElement}`] ?? 0;
        let teamBuffDmgDeepenForAttackType =
          teamBuffsData.value?.[`DMGDeepen:${attackType}`] ?? 0;
        let teamBuffDmgDeepenForSubType =
          teamBuffsData.value?.[`DMGDeepen:${attack.subType}`] ?? 0;
        const selfBuffSpecificAttackGenericDmgDeepen =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:DMGDeepen`] ?? 0;
        const resonanceChainBuffSpecificAttackGenericDmgDeepen =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DMGDeepen`
          ] ?? 0;
        if (excludeTeamBuffs) {
          baseTotalDeepenEffect = statsWithoutTeamBuffs?.totalDeepenEffect ?? 0;
          teamBuffDmgDeepenForCharElement = 0;
          teamBuffDmgDeepenForAttackType = 0;
          teamBuffDmgDeepenForSubType = 0;
        }
        // outro and utility attacks lose dmg deepen for specific elements and attack types
        // because they're off-field, but keep global ones like Verina
        if (attackType === "Outro" || attackType === "Utility") {
          teamBuffDmgDeepenForCharElement = 0;
          teamBuffDmgDeepenForAttackType = 0;
        }
        let attackLevelDmgDeepen = attack.buffs?.DMGDeepen ?? 0;
        const customDamageDeepen = customBuffs.value?.DamageAmplify ?? 0;
        let resonanceChainDmgDeepenForAttackType =
          charResonanceChainsData.value?.[`DMGDeepen:${attackType}`] ?? 0;
        let resonanceChainDmgDeepenForAttackSubType =
          charResonanceChainsData.value?.[`DMGDeepen:${attack.subType}`] ?? 0;
        let weaponBuffDmgDeepenElement =
          weaponData.value?.weaponPassiveStats?.[
            `DMGDeepen:${attackElement}`
          ] ?? 0;
        let weaponBuffDmgDeepenSubType =
          weaponData.value?.weaponPassiveStats?.[
            `DMGDeepen:${attack.subType}`
          ] ?? 0;
        let weaponBuffDmgDeepenType =
          weaponData.value?.weaponPassiveStats?.[`DMGDeepen:${attackType}`] ??
          0;
        if (excludeWeaponBuffs) {
          weaponBuffDmgDeepenElement = 0;
          weaponBuffDmgDeepenSubType = 0;
          weaponBuffDmgDeepenType = 0;
        }
        const totalDmgDeepen =
          baseTotalDeepenEffect +
          teamBuffDmgDeepenForCharElement +
          teamBuffDmgDeepenForAttackType +
          attackLevelDmgDeepen +
          teamBuffDmgDeepenForSubType +
          selfBuffSpecificAttackGenericDmgDeepen +
          resonanceChainBuffSpecificAttackGenericDmgDeepen +
          resonanceChainDmgDeepenForAttackType +
          resonanceChainDmgDeepenForAttackSubType +
          weaponBuffDmgDeepenElement +
          weaponBuffDmgDeepenSubType +
          customDamageDeepen +
          selfBuffDmgDeepenForSubType +
          weaponBuffDmgDeepenType +
          selfBuffDmgDeepenForElement;
        let totalTalentModifierMultiply =
          talentModifierMultiply +
          talentModifierMultiplySelfBuff +
          talentModifierMultiplyAttackBuff;
        // grab any special multipliers, and then multiply the previous total by that
        const talentModifierSpecialMultiplyResChains =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierSpecialMultiply`
          ] ?? 0;
        let totalTalentModifierSpecialMultiply =
          talentModifierSpecialMultiplyResChains;
        // check for any modifiers that change the individual instance of atk/hp/def
        // re-calculate the base for this specific instance of damage
        let modifyBaseAtk =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:ATK`] ?? 0;
        let modifyBaseAtkResChain =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:ATK`
          ] ?? 0;
        modifyBaseAtk += modifyBaseAtkResChain;
        let modifyBaseHp =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:HP`] ?? 0;
        let modifyBaseDef =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:DEF`] ?? 0;
        let modifyBaseAtkFlat =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:ATK_FLAT`] ?? 0;
        let modifyBaseHpFlat =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:HP_FLAT`] ?? 0;
        let modifyBaseDefFlat =
          selfBuffs?.specificTalentBuffs?.[`${attack.key}:DEF_FLAT`] ?? 0;
        // if there are any attack-level buffs for atk, hp, or def (% or flat, update them)
        if (attack?.buffs) {
          modifyBaseAtk += attack.buffs?.ATK ?? 0;
          modifyBaseHp += attack.buffs?.HP ?? 0;
          modifyBaseDef += attack.buffs?.DEF ?? 0;
          modifyBaseAtkFlat += attack.buffs?.ATK_FLAT ?? 0;
          modifyBaseHpFlat += attack.buffs?.HP_FLAT ?? 0;
          modifyBaseDefFlat += attack.buffs?.DEF_FLAT ?? 0;
        }
        let finalAtkDefHpVal = atkDefHpVal;
        if (modifyBaseAtk || modifyBaseAtkFlat) {
          finalAtkDefHpVal = calcCharStats(
            "ATK",
            {
              ATK: modifyBaseAtk,
              ATK_FLAT: modifyBaseAtkFlat,
            },
            {
              ignoreTeamBuffs: excludeTeamBuffs,
              ignoreWeaponBuffs: excludeWeaponBuffs,
            },
          );
        }
        if (modifyBaseHp || modifyBaseHpFlat) {
          finalAtkDefHpVal = calcCharStats(
            "HP",
            {
              HP: modifyBaseHp,
              HP_FLAT: modifyBaseHpFlat,
            },
            {
              ignoreTeamBuffs: excludeTeamBuffs,
              ignoreWeaponBuffs: excludeWeaponBuffs,
            },
          );
        }
        if (modifyBaseDef || modifyBaseDefFlat) {
          finalAtkDefHpVal = calcCharStats(
            "DEF",
            {
              DEF: modifyBaseDef,
              DEF_FLAT: modifyBaseDefFlat,
            },
            {
              ignoreTeamBuffs: excludeTeamBuffs,
              ignoreWeaponBuffs: excludeWeaponBuffs,
            },
          );
        }

        // special calc for MidnightVeilDMG
        if (attack.key === "InherentSkillSuperAttractiveMagicBox") {
          return calcMidnightVeilDMG();
        }

        // set the multiplier hard set here
        // talentModifierMultiplySetValue
        const talentModifierMultiplySet =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiplySetValue`
          ] ?? null;
        if (talentModifierMultiplySet) {
          totalTalentModifierMultiply = talentModifierMultiplySet;
        }

        if (
          attackType === "ElementalEffect" &&
          attack?.subType === "SpectroFrazzle"
        ) {
          let totalSpectroFrazzleDeepen = 0;
          // get any SpectroFrazzle dmg deepen/amplify
          // comes from weapon buffs, team buffs, and personal buffs (e.g. Phoebe)
          let spectroFrazzleDeepenWeaponBuffs =
            weaponData.value?.weaponPassiveStats?.[
              "DMGDeepen:SpectroFrazzle"
            ] ?? 0;
          if (excludeWeaponBuffs) {
            spectroFrazzleDeepenWeaponBuffs = 0;
          }
          let spectroFrazzleDeepenTeamBuffs =
            teamBuffsData.value?.["DMGDeepen:SpectroFrazzle"] ?? 0;
          if (excludeTeamBuffs) {
            spectroFrazzleDeepenTeamBuffs = 0;
          }
          const spectroFrazzleDeepenSelfBuffs =
            selfBuffs?.["DMGDeepen:SpectroFrazzle"] ?? 0;
          const spectroFrazzleDeepenResonanceChains =
            charResonanceChainsData.value?.["DMGDeepen:SpectroFrazzle"] ?? 0;
          totalSpectroFrazzleDeepen =
            spectroFrazzleDeepenWeaponBuffs +
            spectroFrazzleDeepenTeamBuffs +
            spectroFrazzleDeepenSelfBuffs +
            spectroFrazzleDeepenResonanceChains;
          if (attack?.subType === "SpectroFrazzle") {
            const elementalEffectDmg = getSpectroFrazzleDamage(
              attack.talent,
              attack?.stacks ?? 0,
              characterLevel.value,
              enemyLevel.value,
              enemyResist.value,
              totalResistReduction,
              totalDefIgnore,
              totalSpectroFrazzleDeepen,
            );
            return elementalEffectDmg;
          }
        }

        if (
          attackType === "ElementalEffect" &&
          attack?.subType === "AeroErosion"
        ) {
          let totalAeroErosionDeepen = 0;
          // get any SpectroFrazzle dmg deepen/amplify
          // comes from weapon buffs, team buffs, and personal buffs (e.g. Phoebe)
          let aeroErosionDeepenWeaponBuffs =
            weaponData.value?.weaponPassiveStats?.["DMGDeepen:AeroErosion"] ??
            0;
          if (excludeWeaponBuffs) {
            aeroErosionDeepenWeaponBuffs = 0;
          }
          let aeroErosionDeepenTeamBuffs =
            teamBuffsData.value?.["DMGDeepen:AeroErosion"] ?? 0;
          if (excludeTeamBuffs) {
            aeroErosionDeepenTeamBuffs = 0;
          }
          const aeroErosionDeepenSelfBuffs =
            selfBuffs?.["DMGDeepen:AeroErosion"] ?? 0;
          const specificAeroErosionDeepenSelfBuffs =
            selfBuffs?.specificTalentBuffs?.[
              "AeroErosion:DMGDeepen:AeroErosion"
            ] ?? 0;
          const aeroErosionDeepenResonanceChains =
            charResonanceChainsData.value?.["DMGDeepen:AeroErosion"] ?? 0;
          totalAeroErosionDeepen =
            aeroErosionDeepenWeaponBuffs +
            aeroErosionDeepenTeamBuffs +
            aeroErosionDeepenSelfBuffs +
            aeroErosionDeepenResonanceChains +
            specificAeroErosionDeepenSelfBuffs;
          const elementalEffectDmg = getAeroErosionDamage(
            attack.talent,
            attack?.stacks ?? 0,
            characterLevel.value,
            enemyLevel.value,
            enemyResist.value,
            totalResistReduction,
            0, // TODO: AeroErosion does not use DefIgnore?
            totalAeroErosionDeepen,
          );
          return elementalEffectDmg;
        }

        if (attackType === "Healing") {
          // apply any attack-level healing bonuses
          if (attack?.buffs) {
            totalSkillDmgBonus += attack.buffs?.HealingBonus ?? 0;
          }
          const specificSkillHealingBonus =
            charResonanceChainsData.value?.specificTalentBuffs?.[
              `${attack.key}:HealingBonus`
            ] ?? 0;
          const specificSkillHealingBonusSelfBuff =
            selfBuffs?.specificTalentBuffs?.[`${attack.key}:HealingBonus`] ?? 0;
          totalSkillDmgBonus += specificSkillHealingBonus;
          // overwrite the specific skill buff to avoid generic dmg bonuses affecting healing
          const specificSkillDmg =
            specificSkillDmgFromResonanceChains +
            specificSkillDmgFromCharBuffs +
            specificSkillDmgFromEchoes +
            specificSkillHealingBonusSelfBuff +
            specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
            specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
            specificSkillDmgFromResonanceChainsBasedOnMaxDefVal;
          const h = calcHeal(
            talent,
            finalAtkDefHpVal,
            totalSkillDmgBonus, // char stat of healing bonus
            specificSkillDmg, // any buffs for the skill
            totalTalentModifierAdd,
            totalTalentModifierMultiply,
            count,
          );
          return h;
        }

        if (attackType === "Shield") {
          // overwrite the specific skill buff to avoid generic dmg bonuses affecting shield
          const specificSkillDmg =
            specificSkillDmgFromResonanceChains +
            specificSkillDmgFromCharBuffs +
            specificSkillDmgFromEchoes +
            specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
            specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
            specificSkillDmgFromResonanceChainsBasedOnMaxDefVal;
          const h = calcShield(
            talent,
            finalAtkDefHpVal,
            totalSkillDmgBonus, // char stat of shield bonus
            specificSkillDmg, // any buffs for the skill
            totalTalentModifierAdd,
            totalTalentModifierMultiply,
            count,
          );
          return h;
        }

        let totalInstanceDmgBuff = 0;
        // apply any generic attack-level buffs (e.g. CR, CD)
        if (attack?.buffs) {
          instanceDmgCritRate += attack.buffs?.CritRate ?? 0;
          instanceDmgCritDMG += attack.buffs?.CritDMG ?? 0;

          // get any element and attack type buffs too
          let attackTypeAttackBuff = 0;
          switch (attackType) {
            case "Basic":
              attackTypeAttackBuff = attack.buffs?.BasicAttackDMGBonus ?? 0;
              break;
            case "Heavy":
              attackTypeAttackBuff = attack.buffs?.HeavyAttackDMGBonus ?? 0;
              break;
            case "Skill":
              attackTypeAttackBuff = attack.buffs?.ResonanceSkillDMGBonus ?? 0;
              break;
            case "Liberation":
              attackTypeAttackBuff =
                attack.buffs?.ResonanceLiberationDMGBonus ?? 0;
            case "Echo":
              attackTypeAttackBuff = attack.buffs?.EchoDMGBonus ?? 0;
              break;
          }

          // get any element and attack type buffs too (e.g. Glacio)
          const instanceElementBuff = attack.buffs?.[attackElement] ?? 0;
          totalInstanceDmgBuff = attackTypeAttackBuff + instanceElementBuff;
        }
        // sometimes an attack will always crit, if so, make that instance have max CR
        if (attack?.alwaysCrit) {
          instanceDmgCritRate = 1;
        }

        let additiveMultiplierStacks = 0;
        let additiveMultiplierPercent = 0;
        // special additive handler for HeavySlashNightfallDMG
        if (attack.key === "HeavySlashNightfallDMG") {
          let { isEnabled, stacks } =
            characters.value?.[character.value]?.buffs
              ?.HeavySlashNightfallBlazeStacks ?? {};
          // only apply these if it's enabled
          if (isEnabled) {
            if (!stacks) {
              stacks = 0;
            }
            additiveMultiplierStacks = stacks;
            const forteLevel =
              characters.value?.[character.value]?.talents?.forte ?? 10;
            const buffsList = chosenChar.value?.buffs ?? [];
            const foundBuff = buffsList.find(
              (buff) => buff.key === "HeavySlashNightfallBlazeStacks",
            );
            const modifierPercent =
              foundBuff?.modifiers?.[0]?.modifierValue?.[forteLevel] ?? 0;
            additiveMultiplierPercent = modifierPercent;
          }
        }
        let totalSpecialMultiplier = 0;
        let resonanceChainAttackSpecialMultiplier =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:specialMultiplier`
          ] ?? 0;
        totalSpecialMultiplier += resonanceChainAttackSpecialMultiplier;
        return calcDamage(
          characterLevel.value,
          enemyLevel.value,
          enemyResist.value,
          talent,
          finalAtkDefHpVal,
          totalDefIgnore,
          totalSkillDmgBonus,
          specificSkillDmg,
          elementalDmgBonusDecimal + totalInstanceDmgBuff,
          totalDmgDeepen,
          totalResistReduction,
          instanceDmgCritRate,
          instanceDmgCritDMG,
          totalTalentModifierAdd,
          totalTalentModifierMultiply,
          totalTalentModifierSpecialMultiply,
          count,
          attack.key,
          additiveMultiplierStacks,
          additiveMultiplierPercent,
          totalSpecialMultiplier,
        );
      };

    const calcAllDamages = () => {
      if (!chosenChar.value) return;

      // clone the list of attacks so it doesn't mutate the base character data
      // this makes it where we dont have to manage the list of attacks,
      // and the rotations list has its own list of echo set attacks to choose from
      const echoSetAttacks = [];
      // TODO: Makes this scalable and more maintainable
      // can wait for another echo set attack, so okay for now
      const hasEchoOutroAttack =
        echoStats.value?.EnableAttack === "MidnightVeil";
      const echoOutroAttackSetIndex = echoSetAttacks.findIndex(
        (attack) => attack.key === "MidnightVeilDMG",
      );
      if (echoOutroAttackSetIndex < 0 && hasEchoOutroAttack) {
        echoSetAttacks.push({
          key: "MidnightVeilDMG",
          label: "The Veil of Hidden Night DMG",
          talent: "480%",
          type: "Outro",
          element: "Havoc",
        });
      }

      // similar principle applies to utility attacks (e.g. Roccia passive)
      const utilityAttacks = [];
      // TODO: Makes this scalable and more maintainable
      let utilityAttacksFromTeamBuffs = teamBuffsData.value?.EnableAttack ?? [];
      // TODO: Exclude the attack if using exclude from team buffs
      const hasUtilityAttack = utilityAttacksFromTeamBuffs.includes(
        "InherentSkillSuperAttractiveMagicBox",
      );
      const alreadyHasUtilityAttackConfigured = utilityAttacks.findIndex(
        (attack) => attack.key === "InherentSkillSuperAttractiveMagicBox",
      );
      if (alreadyHasUtilityAttackConfigured < 0 && hasUtilityAttack) {
        utilityAttacks.push({
          key: "InherentSkillSuperAttractiveMagicBox",
          label: "Magic Box DMG",
          talent: "100%",
          type: "Utility",
          element: "Havoc",
        });
      }

      const allDamagesData = {
        basicAttacks: processAttacks(
          chosenChar.value.basicAttacks?.attacks,
          talentData.basic,
        ),
        skillAttacks: processAttacks(
          chosenChar.value.skillAttacks?.attacks,
          talentData.skill,
        ),
        liberationAttacks: processAttacks(
          chosenChar.value.liberationAttacks?.attacks,
          talentData.liberation,
        ),
        forteCircuitAttacks: processAttacks(
          chosenChar.value.forteCircuitAttacks?.attacks,
          talentData.forte,
        ),
        introAttacks: processAttacks(
          chosenChar.value.introAttacks?.attacks,
          talentData.intro,
        ),
        outroAttacks: processAttacks(
          chosenChar.value.outroAttacks?.attacks,
          talentData.intro, // TODO: What is this?
          true, // has no talent level
        ),
        echoSetAttacks: processAttacks(
          echoSetAttacks,
          talentData.intro, // TODO: What is this?
          true, // has no talent level
        ),
        utilityAttacks: processAttacks(
          utilityAttacks,
          talentData.intro, // TODO: What is this?
          true, // has no talent level
        ),
      };

      const elementalReactionsAttacks = [];
      // add any elemental effects
      if (isSpectroFrazzleEnabled.value && spectroFrazzleStacks.value > 0) {
        isMissingSpectroData.value = false;
        // get the MV based on stacks and character level
        const spectroFrazzleMv = getSpectroFrazzleModifierByLevelByStacks(
          characterLevel.value,
          spectroFrazzleStacks.value,
        );
        if (!spectroFrazzleMv) {
          isMissingSpectroData.value = true;
        }
        if (spectroFrazzleMv) {
          const spectroFrazzleAttack = {
            key: "ElementalEffectSpectroFrazzle",
            label: "Spectro Frazzle",
            talent: spectroFrazzleMv,
            type: "ElementalEffect",
            element: "Spectro",
            subType: "SpectroFrazzle",
            stacks: spectroFrazzleStacks.value,
          };
          elementalReactionsAttacks.push(spectroFrazzleAttack);
        }
      }
      if (isAeroErosionEnabled.value && aeroErosionStacks.value > 0) {
        isMissingAeroErosionData.value = false;
        // get the MV based on stacks and character level
        const aeroErosionMv = getAeroErosionModifierByLevelByStacks(
          characterLevel.value,
          aeroErosionStacks.value,
        );
        if (!aeroErosionMv) {
          isMissingAeroErosionData.value = true;
        }
        if (aeroErosionMv) {
          const aeroErosionAttack = {
            key: "ElementalEffectAeroErosion",
            label: "Aero Erosion",
            talent: aeroErosionMv,
            type: "ElementalEffect",
            element: "Aero",
            subType: "AeroErosion",
            stacks: aeroErosionStacks.value,
          };
          elementalReactionsAttacks.push(aeroErosionAttack);
        }
      }
      if (elementalReactionsAttacks.length > 0) {
        allDamagesData.elementalReactions = processAttacks(
          elementalReactionsAttacks,
          talentData.intro,
          true, // has no talent level
        );
      }
      let chosenEcho;
      if (mainEcho.value) {
        chosenEcho = getEchoData(mainEcho.value);
        const echoDmg = processAttacks(chosenEcho.actions, mainEchoRank.value);
        allDamagesData.echoAttacks = echoDmg;
      }

      if (rotationsList.value?.length) {
        const rotationData = [];
        rotationsList.value.forEach((rotation) => {
          const rotationInfo = {
            id: rotation.id,
            name: rotation.name,
            description: rotation.description,
            duration: rotation.duration ?? null,
          };
          const attacks = processAttacks(
            rotation.attacks,
            null,
            false,
            true,
            false,
          );
          // capture all damages
          const damageAggregation = {
            normalDamage: null,
            avgDamage: null,
            critDamage: null,
            healing: null,
            shield: null,
          };
          // go through all attacks and update our aggregation
          attacks.forEach((attack) => {
            if (attack?.originalIsEnabled === false) {
              return;
            }
            if (attack?.damage?.totalDamage !== undefined) {
              damageAggregation.normalDamage =
                (damageAggregation.normalDamage || 0) +
                attack?.damage?.totalDamage;
            }

            if (attack?.damage?.avgDamage !== undefined) {
              damageAggregation.avgDamage =
                (damageAggregation.avgDamage || 0) + attack?.damage?.avgDamage;
            }

            if (attack?.damage?.critDamage !== undefined) {
              damageAggregation.critDamage =
                (damageAggregation.critDamage || 0) +
                attack?.damage?.critDamage;
            }

            if (
              attack.type === "Healing" &&
              attack?.damage?.healAmount !== undefined
            ) {
              damageAggregation.healing =
                (damageAggregation.healing || 0) + attack?.damage?.healAmount;
            }

            if (
              attack.type === "Shield" &&
              attack?.damage?.shieldAmount !== undefined
            ) {
              damageAggregation.shield =
                (damageAggregation.shield || 0) + attack?.damage?.shieldAmount;
            }
          });
          rotationInfo.attacks = attacks;
          rotationInfo.damageAggregation = damageAggregation;
          rotationData.push(rotationInfo);
        });
        allDamagesData.rotations = rotationData;
      }

      allDamages.value = allDamagesData;
    };

    const handleCalculation = () => {
      calcAllDamages();
    };

    const handleWeaponUpdated = (givenWeaponData) => {
      weaponData.value = givenWeaponData;
      weaponAtk.value = givenWeaponData.attack;
      calcCharStats();
    };

    const handleUpdatedCharacterBuffs = (givenCharBuffsData) => {
      charBuffsData.value = givenCharBuffsData;
      calcCharStats();
    };

    const handleUpdatedTeamBuffs = (givenTeamBuffs) => {
      teamBuffsData.value = givenTeamBuffs;
      calcCharStats();
    };

    const handleUpdatedCharacterResonanceChains = (
      givenResonanceChainsData,
    ) => {
      if (character.value === "Lupa") {
        characterBuffsRef.value.retriggerBuffCalculations();
      }

      charResonanceChainsData.value = givenResonanceChainsData;
      calcCharStats();
    };

    const updateStatsEchoes = (echoStatsGiven) => {
      echoStats.value = echoStatsGiven;
      calcCharStats();
    };

    const changeScreen = (screen: string) => {
      curScreen.value = screen;
    };

    const handleCharacterTalentUpdated = (data) => {
      talentData[data.type] = data.value;
      calcAllDamages();
    };

    const handleCharacterLevelUpdated = (level) => {
      // set the character level in the store
      characterLevel.value = level;
      calcCharStats();
    };

    const handleUpdatedEnemy = (data) => {
      enemyLevel.value = data.enemyLevel;
      enemyResist.value = data.enemyResist;
      spectroFrazzleStacks.value = data.spectroFrazzleStacks;
      aeroErosionStacks.value = data.aeroErosionStacks;
      calcAllDamages();
    };

    const handleCustomBuffs = (data) => {
      customBuffs.value = data;
      calcCharStats();
    };

    const handleUpdatedRotations = async (data) => {
      // go through each rotation and each action and use the full talent data
      // which will make the rotation system work
      const chosenChar = await getCharByName(character.value);
      const rotationData = [];
      data.forEach((rotation) => {
        const rotationInfo = {
          id: rotation.id,
          name: rotation.name,
          description: rotation.description,
          duration: rotation.duration ?? null,
        };
        const rotationActionInfo = [];
        rotation.actions.forEach((action) => {
          const actionKey = action.key;
          const actionType = action.type;
          const actionBuffs = action.buffs;
          const actionCount = action.count;
          const actionId = action.id;
          const actionDisabled = action?.isDisabled ?? false;
          // if the action is disabled, just skip it
          if (actionDisabled) {
            return;
          }
          const attacksList =
            chosenChar?.[`${actionType}Attacks`]?.attacks ?? [];
          let foundAction;
          if (actionType === "echoSetAttacks") {
            foundAction = echoSetAttacks.find((attack) => {
              return attack.key === actionKey;
            });
          } else if (actionType === "utilityAttacks") {
            foundAction = utilityAttacks.find((attack) => {
              return attack.key === actionKey;
            });
          } else {
            foundAction = attacksList.find((attack) => {
              return attack.key === actionKey;
            });
          }
          if (foundAction) {
            const actionData = {
              ...foundAction,
              buffs: null,
              actionType,
              count: actionCount,
              id: actionId,
              excludeSelfBuffs: action.excludeSelfBuffs ?? false,
              excludeTeamBuffs: action.excludeTeamBuffs ?? false,
              excludeWeaponBuffs: action.excludeWeaponBuffs ?? false,
            };
            // if there are buffs, turn it into a hashmap
            if (action?.buffs?.length) {
              const buffsData = {};
              // keys are unique, there should not be duplicates
              action.buffs.forEach((buff) => {
                // buffs are in human readable, convert to decimal except flat values
                let buffValue;
                if (
                  ["ATK_FLAT", "HP_FLAT", "DEF_FLAT"].includes(buff.modifier)
                ) {
                  buffValue = Number(buff.modifierValue);
                } else {
                  buffValue = Number(buff.modifierValue) / 100;
                }
                buffsData[buff.modifier] = buffValue;
              });
              actionData.buffs = buffsData;
            }
            rotationActionInfo.push(actionData);
          }
        });
        rotationInfo.attacks = rotationActionInfo;
        rotationData.push(rotationInfo);
      });
      rotationsList.value = rotationData;
      calcAllDamages();
    };

    const handleUpdatedCharacter = (chosenCharacter) => {
      character.value = chosenCharacter;
    };

    const handleUpdatedMainEcho = (chosenEcho) => {
      mainEcho.value = chosenEcho;
      calcAllDamages();
    };

    const handleUpdatedMainEchoRank = (chosenEchoRank) => {
      mainEchoRank.value = chosenEchoRank;
      calcAllDamages();
    };

    /* TODO:
     * Update calcCharStats - change return ALL to include all stats, including various bonuses including healing, etc
     * Figure out the final stats of the echos, including echo set bonuses
     * Ask the user to fill out any echo set bonus options (stacks, etc)
     * Use injectStats when calcCharStats and likely need to divide by 100
     * That should be final stats
     *
     * For DMG:
     * - Ask the user to choose: stat (e.g. HP, CD), a single attack (choose one), or rotation (choose one), and for any attack: if they want to look at normal / average / crit
     * - For stat, bypass the calculateDamage, and just look for the highest stat given
     * - For single attack: use calculateAttackDamage (will likely need to pull that out so its usable, it's inside another function)
     * - For rotation, look at: rotationsList.value.forEach((rotation) => { ... }
     */

    // const stats = calculateStats(loadout);
    // const dmg = calculateDamage(stats);

    // keeping because it works
    // const handleOptimize = (setFilters = [], mainEchoes = []) => {
    //   console.log("NOT USING THIS RIGHT NOW", mainEchoes)
    //   const echoes = inventoryStore.echoes;
    //   const allowedSets = new Set(setFilters);
    //   const topN = 5;
    //   totalCombos.value = 0;
    //   processedCombos.value = 0;
    //   optimizerResults.value = null;

    //   // 1. Filter upfront
    //   let filteredEchoes = echoes;
    //   if (allowedSets.size) {
    //     filteredEchoes = echoes.filter(e => allowedSets.has(e.echoSet));
    //   }
    //   totalCombos.value = estimateCombos(filteredEchoes);
    //   const results = optimize(filteredEchoes, allowedSets, topN);
    //   processedCombos.value = totalCombos.value;
    //   optimizerResults.value = results;
    //   console.log(results);
    // };

    // function estimateCombos(echoes: {cost: number}[]) {
    //   // dp[size][cost] = # of combos of this size and total cost
    //   const dp: number[][] = Array.from({length: 6}, () => Array(13).fill(0));
    //   dp[0][0] = 1; // empty combo

    //   for (const echo of echoes) {
    //     for (let size = 4; size >= 0; size--) {
    //       for (let cost = 12 - echo.type; cost >= 0; cost--) {
    //         if (dp[size][cost] > 0) {
    //           dp[size + 1][cost + echo.type] += dp[size][cost];
    //         }
    //       }
    //     }
    //   }

    //   // Sum all non-empty valid combos (size 1-5, cost <= 12)
    //   let total = 0;
    //   for (let size = 1; size <= 5; size++) {
    //     for (let cost = 0; cost <= 12; cost++) {
    //       total += dp[size][cost];
    //     }
    //   }

    //   return total;
    // }

    // function* generateLoadouts(echoes, start = 0, combo = [], cost = 0) {
    //   // Valid combination? Yield it (ignore empty set)
    //   if (combo.length > 0 && combo.length <= 5 && cost <= 12) {
    //     yield combo;
    //   }

    //   // Stop exploring if combo already too big
    //   if (combo.length === 5 || cost >= 12) return;

    //   for (let i = start; i < echoes.length; i++) {
    //     const next = echoes[i];
    //     const nextCost = cost + next.type; // echo.type === echo.cost
    //     if (nextCost <= 12) {
    //       yield* generateLoadouts(echoes, i + 1, [...combo, next], nextCost);
    //     }
    //   }
    // }

    // function optimize(echoes, allowedSets = [], topN = 5) {
    //   // 2. Min-heap for topN results
    //   const heap = [];

    //   for (const loadout of generateLoadouts(echoes)) {
    //     const dmg = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
    //     processedCombos.value++;

    //     if (heap.length < topN) {
    //       heap.push({ loadout, dmg });
    //       heap.sort((a, b) => a.dmg - b.dmg); // min at index 0
    //     } else if (dmg > heap[0].dmg) {
    //       heap[0] = { loadout, dmg };
    //       heap.sort((a, b) => a.dmg - b.dmg);
    //     }
    //   }

    //   return heap.sort((a, b) => b.dmg - a.dmg); // descending
    // }
    
const handleOptimize = (
    setFilters = [],
    mainEchoes = [],
    minStats = [],
    echoSetPassiveBuffs = {},
    mainEchoStats = {},
    target = "ATK",
  ) => {
    const echoes = inventoryStore.echoes;
    const allowedSets = new Set(setFilters);
    const topN = 5;
    processedCombos.value = 0;
    optimizerResults.value = null;

    // 1. Filter upfront
    let filteredEchoes = echoes;
    if (allowedSets.size) {
      filteredEchoes = echoes.filter((e) => allowedSets.has(e.echoSet));
    }

    const results = optimize(
      filteredEchoes,
      allowedSets,
      topN,
      mainEchoes,
      minStats,
      echoSetPassiveBuffs,
      mainEchoStats,
      target,
    );
    optimizerResults.value = results;
    totalCombos.value = processedCombos.value;
    console.log(results);
  };

      function* generateLoadouts(
      echoes,
      mainEchoKeys = [],
      start = 0,
      combo = [],
      cost = 0,
      usedEchoIds = new Set(),
    ) {
      // If we have main echo keys and combo is empty, we need to start with one of those
      if (mainEchoKeys.length > 0 && combo.length === 0) {
        // Find all echoes that match the main echo keys
        const mainEchoCopies = echoes.filter((e) =>
          mainEchoKeys.includes(e.echo),
        );

        // For each copy of the main echo, start a new combination
        for (const mainEcho of mainEchoCopies) {
          // the main echo isn't guaranteed to be 4, sometimes it's an elite, so 3
          const nextCost = cost + mainEcho.type;
          if (nextCost <= 12) {
            // Create a fresh usedEchoIds Set for each main echo group
            const groupUsedEchoIds = new Set([mainEcho.echoId]);
            yield* generateLoadouts(
              echoes,
              mainEchoKeys,
              0,
              [mainEcho],
              nextCost,
              groupUsedEchoIds,
            );
          }
        }
        return;
      }

    // Valid combination? Yield it (ignore empty set)
    if (combo.length > 0 && combo.length <= 5 && cost <= 12) {
      yield combo;
    }

    // Stop exploring if combo already too big
    if (combo.length === 5 || cost >= 12) return;

    // If we have main echo keys and combo is empty, we've already handled the first slot
    if (mainEchoKeys.length > 0 && combo.length === 0) return;

    for (let i = start; i < echoes.length; i++) {
      const next = echoes[i];
      // Skip if already used
      if (usedEchoIds.has(next.echoId)) continue;

      const nextCost = cost + next.type;
      if (nextCost <= 12) {
        // Add to used set instead of filtering
        usedEchoIds.add(next.echoId);
        combo.push(next); // Mutate instead of creating new array
        yield* generateLoadouts(
          echoes,
          mainEchoKeys,
          i + 1, // Can keep original index since we're not filtering
          combo,
          nextCost,
          usedEchoIds,
        );
        combo.pop(); // Backtrack
        usedEchoIds.delete(next.echoId); // Backtrack
      }
    }
  }

  function optimize(
    echoes,
    allowedSets = [],
    topN = 5,
    mainEchoKeys = [],
    minStats = [],
    echoSetPassiveBuffs = {},
    mainEchoStats = {},
    target = "ATK",
  ) {
    // Min-heap for topN results
    const heap = [];
    const seenCombinations = new Set(); // Track unique combinations

    // get info on our target
    const targetElements = target.split(":");
    const [targetType, targetObject] = targetElements;
    // if it's an attack, get the attack info, the targetObject is Type|skillkey
    let attackData;
    if (targetType === "Attack") {
      const [attackType, attackKey] = targetObject.split("|");
      const attackInfo = getAttackData(chosenChar.value, attackType, attackKey);
      let actionTypeForAttackData;
      switch (attackType) {
        case 'basicAttacks':
          actionTypeForAttackData = 'basic';
          break;
        case 'skillAttacks':
          actionTypeForAttackData = 'skill';
          break;
        case 'forteCircuitAttacks':
          actionTypeForAttackData = 'forte';
          break;
        case 'liberationAttacks':
          actionTypeForAttackData = 'liberation';
          break;
        case 'introAttacks':
          actionTypeForAttackData = 'intro';
          break;
        case 'outroAttacks':
          actionTypeForAttackData = 'outro';
          break;
      }
      attackData = {
        actionType: actionTypeForAttackData,
        buffs: null,
        count: 1,
        excludeSelfBuffs: false,
        excludeTeamBuffs: false,
        excludeWeaponBuffs: false,
        key: attackKey,
        label: attackInfo.label,
        talents: attackInfo.talents,
        type: attackInfo.type,
      };
      console.log(attackData);
      if (!attackData) {
        console.error('Could not find the attack data chosen');
        return;
      }
    }

    for (const loadout of generateLoadouts(echoes, mainEchoKeys)) {
      // Create a unique key for this combination based on echo keys, sorted
      // Using echo.echoId to ensure we dont use the same specific echo, but we can use the same echoes
      const echoIds = loadout.map((echo) => echo.echoId);
      echoIds.sort(); // Sort in place for better performance
      const combinationKey = echoIds.join("|");

      // Skip if we've already seen this combination
      if (seenCombinations.has(combinationKey)) {
        continue;
      }

      // TODO: implement the stats and damage/desire stat
      // calculate the total buffs from the echoes + set bonuses + main echo bonuses
      // TODO: We have the echo stats, need to add in set bonuses and main echo bonuses
      const echoStats = getCombinedEchoStats(loadout);
      // get the echo sets list
      const echoSets = getSetsFromEchoes(loadout);
      const echoSetBonuses = getSetBonusEffects(echoSets);
      const setBonusOne = echoSetBonuses?.setBonusOne ?? null;
      const setBonusTwo = echoSetBonuses?.setBonusTwo ?? null;
      //add in the main echo buff, if we have some
      const mainEchoKey = loadout[0]?.echo;
      const mainEchoBuff = mainEchoStats?.[mainEchoKey] ?? {};

      // go through these buffs, and overlap them to get a final set of buffs in one object
      // the keys will the stat keys, and the values will be the total buff value
      // and we need to add them up
      const setBonusOneBuffs = echoSetPassiveBuffs?.[setBonusOne] ?? {};
      const setBonusTwoBuffs = echoSetPassiveBuffs?.[setBonusTwo] ?? {};
      const allBuffsToAdd = [
        echoStats,
        mainEchoBuff,
        setBonusOneBuffs,
        setBonusTwoBuffs,
      ];
      const combinedEchoBuffs = {};
      allBuffsToAdd.forEach((buffs) => {
        Object.keys(buffs).forEach((key) => {
          if (combinedEchoBuffs[key]) {
            combinedEchoBuffs[key] += buffs[key];
          } else {
            combinedEchoBuffs[key] = buffs[key];
          }
        });
      });
      const finalStats = calcCharStats(
        "All",
        null,
        {
          ignoreEchoes: true,
        },
        combinedEchoBuffs,
      );

      // re-calculate the "total" stats
      // TODO: Make this better
      const { hp, attack, defense } =
        chosenChar.value.getCharacterStatsByLevel(characterLevel.value);
      const charHp = hp;
      const charAtk = attack;
      const charDef = defense;
      const weaponAtk = weaponData.value?.attack;
      finalStats.totalAtk =
        (charAtk + weaponAtk) * (1 + finalStats.attackPercent / 100) +
        finalStats.attackFlat;
      finalStats.totalHp =
        charHp * (1 + finalStats.hpPercent / 100) + finalStats.hpFlat;
      finalStats.totalDef =
        charDef * (1 + finalStats.defPercent / 100) + finalStats.defFlat;
      finalStats.totalCritRate = finalStats.critRate / 100;
      finalStats.totalCritDMG = finalStats.critDMG / 100;
      finalStats.DefIgnore = finalStats.defIgnore / 100;

      // if we have some min stats, check them before we add them to the list of usable loadouts
      if (minStats.length > 0) {
        for (const minStat of minStats) {
          const statValue = finalStats?.[minStat.stat];
          const desiredValue = Number(minStat.minValue) / 100; // we need to divide as we're getting full int, but the stats calculated are decimals
          // if any of the min stats aren't good enough, then don't use the loadout
          if (statValue < desiredValue) {
            continue;
          }
        }
      }

      seenCombinations.add(combinationKey);

      let targetValue = 0;
      if (targetType === "Stat") {
        // get the stat wer'e looking for from our final stats
        targetValue = finalStats?.[targetObject] ?? 0;
      } else if (targetType === "Attack") {
        // TODO: We need to pass in the stats we have on-hand from the loadout
        // and not use the stats that the current user has
        // INFO: It works as it is right now, and the damages match, which is good
        const attacks = processAttacks(
            [attackData], // attacks list, just the one since we're just doing 1 attack to optimize
            null, // talentType = null since it will be figured out dynamically
            false, // hasNoTalentType = no, unless it's outro (TODO)
            true, // dynamicTalentType = yes, this will figure out the talent data for us
            false, // excludeDisabledAttacks = no, unless we need to (TODO)
          );
          console.log(attacks?.[0]?.damage?.critDamage);
        targetValue = Math.floor(Math.random() * (100000 - 100 + 1)) + 100;
      } else if (targetType === "Rotation") {
        console.log('process rotation');
      }
      processedCombos.value++;

      if (heap.length < topN) {
        heap.push({ loadout, targetValue });
        heap.sort((a, b) => a.targetValue - b.targetValue); // min at index 0
      } else if (targetValue > heap[0].targetValue) {
        heap[0] = { loadout, targetValue };
        heap.sort((a, b) => a.targetValue - b.targetValue);
      }
    }

    return heap.sort((a, b) => b.targetValue - a.targetValue); // descending
  }



    return {
      allDamages,
      character,
      characters,
      characterLevel,
      chosenChar,
      charBuffsData,
      charResonanceChainsData,
      chosenWeapon,
      rotationsList,
      curScreen,
      changeScreen,
      damage,
      updateStatsEchoes,
      totalAtk,
      totalAtkPercent,
      totalAtkFlat,
      totalHp,
      totalHpPercent,
      totalHpFlat,
      totalDef,
      totalDefPercent,
      totalDefFlat,
      totalCritRate,
      totalCritDMG,
      energyRegen,
      healingBonus,
      weaponType,
      handleCharacterLevelUpdated,
      handleCharacterTalentUpdated,
      handleCustomBuffs,
      handleWeaponUpdated,
      handleOptimize,
      handleUpdatedCharacter,
      handleUpdatedCharacterBuffs,
      handleUpdatedCharacterResonanceChains,
      handleUpdatedEnemy,
      handleUpdatedMainEcho,
      handleUpdatedMainEchoRank,
      handleUpdatedRotations,
      handleUpdatedTeamBuffs,
      BasicAttackDMGBonus,
      HeavyAttackDMGBonus,
      ResonanceSkillDMGBonus,
      IntroSkillDMGBonus,
      OutroSkillDMGBonus,
      ResonanceLiberationDMGBonus,
      Glacio,
      Fusion,
      Electro,
      Aero,
      Spectro,
      Havoc,
      DefIgnore,
      BonusSpecificSkillDMGBonus,
      TotalDeepenEffect,
      ResistReduction,
      weaponData,
      weaponAtk,
      isLoading,
      mainEcho,
      // elemental effects
      isSpectroFrazzleEnabled,
      isMissingSpectroData,
      isAeroErosionEnabled,
      isMissingAeroErosionData,
      // component refs
      characterBuffsRef,
      // optimizer stuff
      totalCombos,
      processedCombos,
      optimizerResults,
    };
  },
});
</script>

<style lang="scss" scoped>
.calculations {
  display: grid;
  // grid-template-columns: 80px 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 80px);

  @media (max-width: 768px) {
    display: block;
    height: auto;
  }
}

.calculations__screens {
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  @media (max-width: 480px) {
    padding: 1rem;
  }
}
.results {
  overflow-y: auto;
  padding: 2rem;
}

.screen--character {
  overflow: hidden;
}
.results {
  display: block !important;

  @media (max-width: 768px) {
    display: none !important;
  }

  h4 {
    padding-left: 0.5rem;
  }
}
</style>
