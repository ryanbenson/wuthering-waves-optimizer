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
          <div
            v-if="false"
            class="alert alert-success mb-6 text-white p-2 px-4">
            Tune Break & Lynae's Tune Rupture Response are implemented!
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
              :energy-regen="energyRegen"
              :crit-rate="totalCritRate"
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
          :character-element="characterElement"
          :all-damages="JSON.parse(JSON.stringify(allDamages))"
          :total-atk="totalAtk"
          :total-hp="totalHp"
          :total-def="totalDef"
          :total-crit-rate="totalCritRate"
          :total-crit-dmg="totalCritDMG"
          :energy-regen="energyRegen"
          :optimization-target-type="optimizationTargetType"
          :optimization-target-object="optimizationTargetObject"
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
          :is-aero-erosion-enabled="isAeroErosionEnabled"
          :is-havoc-bane-enabled="isHavocBaneEnabled"></CalculatorEnemy>
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
          :healing-bonus="healingBonus"
          @stat-selected="handleStatSelected"></CalculatorStats>
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
          :char-resonance-chains-data="charResonanceChainsData"
          @selected-attack="handleSelectedAttack"></CalculatorDamages>
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
        :healing-bonus="healingBonus"
        @stat-selected="handleStatSelected"></CalculatorStats>
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
        :char-resonance-chains-data="charResonanceChainsData"
        @selected-attack="handleSelectedAttack"></CalculatorDamages>
    </div>
  </div>
  <Teleport to="#sidebar">
    <CalculatorBreakdown
      v-if="selectedStat || selectedAttackKey"
      :character="character"
      :stat="selectedStat"
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
      :healing-bonus="healingBonus"
      :base-hp="baseHp"
      :base-atk="baseAtk"
      :base-def="baseDef"
      :weapon-data="weaponData"
      :custom-buffs="customBuffs"
      :team-buffs-data="teamBuffsData"
      :char-buffs-data="charBuffsData"
      :char-resonance-chains-data="charResonanceChainsData"
      :echo-stats="echoStats"
      :attack-key="selectedAttackKey"
      :damage="selectedAttackDamage"
      :attack-label="selectedAttackLabel"
      @close="handleBreakdownClose"></CalculatorBreakdown>
  </Teleport>
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
  calcFixedDamage,
  calcTuneBreak,
} from "../calculator/calculator";
import {
  getCharByName,
  getCharactersAvailable,
  getAttackData,
  getOriginalForteFromAttackKey,
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
import {
  addBuffs,
  addEchoBuffs,
  getElementDmgBonusByType,
  getDamageValByAttr,
  getDamageTypeBonusByType,
  getInitStats,
  calcCharStats,
  computeSelfBuffs,
  computeResonanceChainsBuffs,
  computeAdditionalBaseBuffs,
  computeCritOverflowBuffs,
  calculateAllStats,
} from "../calculator/stats";
import {
  processAttacks,
  calcDamages,
  getCalculationContext,
} from "../calculator/attacks";
import type { OptimizerContext } from "../calculator/optimizer";
import { getSetsFromEchoes, getSetBonusEffects } from "../echoes/sets";
import { allEchoBuffs, utilityAttacks } from "../buffs";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useRoute } from "vue-router";
import Nav from "./navigation/Nav.vue";
import CalculatorMobileSubNav from "./navigation/CalculatorMobileSubNav.vue";
import CalculatorSubNav from "./navigation/CalculatorSubNav.vue";
import CalculatorBreakdown from "./CalculatorBreakdown.vue";
import { randomString } from "../utils/strings";
// Note: Workers are imported dynamically via new Worker() calls
import { displayPercentage, displayInt } from "../utils/numbers";

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
    CalculatorBreakdown,
  },
  emits: ["stat-selected", "attack-selected", "breakdown-closed"],
  setup(props, { emit }) {
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
    const selectedStat = ref(null);
    const damage = ref(0);
    const selectedAttackKey = ref(null);
    const selectedAttackDamage = ref(0);
    const selectedAttackLabel = ref(null);
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
    const DefReduction = ref(0);
    const BonusSpecificSkillDMGBonus = ref(0);
    const TotalDeepenEffect = ref(0);
    const ResistReduction = ref(0);
    const isLoading = ref(false);
    const enemyLevel = ref(90);
    const enemyResist = ref(0.1);
    const enemyType = ref("Calamity");
    const characterElement = ref("");
    // elemental effects
    const isSpectroFrazzleEnabled = ref(false);
    const spectroFrazzleStacks = ref(0);
    const isMissingSpectroData = ref(false);
    const isAeroErosionEnabled = ref(false);
    const isHavocBaneEnabled = ref(false);
    const havocBaneStacks = ref(0);
    const aeroErosionStacks = ref(0);
    const isMissingAeroErosionData = ref(false);
    // component refs
    const characterBuffsRef = ref(null);
    // optimizer
    const totalCombos = ref(0);
    const processedCombos = ref(0);
    const optimizerResults = ref([]);
    const optimizationTargetType = ref("");
    const optimizationTargetObject = ref("");
    // base stats
    const baseHp = ref(0);
    const baseAtk = ref(0);
    const baseDef = ref(0);

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
      isHavocBaneEnabled.value = chosenChar?.value?.basic?.havocBane ?? false;
      // hold onto the character's main element
      characterElement.value = chosenChar.value?.basic?.element;
      // update the base stats
      baseHp.value =
        chosenChar.value?.getCharacterStatsByLevel(characterLevel.value)?.hp ??
        0;
      baseAtk.value =
        chosenChar.value?.getCharacterStatsByLevel(characterLevel.value)
          ?.attack ?? 0;
      baseDef.value =
        chosenChar.value?.getCharacterStatsByLevel(characterLevel.value)
          ?.defense ?? 0;
      // reset any optimizer data

      totalCombos.value = 0;
      processedCombos.value = 0;
      optimizerResults.value = [];
      setTimeout(() => {
        isLoading.value = false;
      }, 10);
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    });

    const calcAllDamages = () => {
      const context = getCalculationContext(
        chosenChar.value,
        echoStats.value,
        teamBuffsData.value,
        talentData,
        isSpectroFrazzleEnabled.value,
        spectroFrazzleStacks.value,
        isAeroErosionEnabled.value,
        aeroErosionStacks.value,
        characterLevel.value,
        mainEcho.value,
        mainEchoRank.value,
        rotationsList.value,
        charResonanceChainsData.value,
        charBuffsData.value,
        baseHp.value,
        baseAtk.value,
        baseDef.value,
        weaponData.value,
        customBuffs.value,
        Glacio.value,
        Fusion.value,
        Electro.value,
        Aero.value,
        Spectro.value,
        Havoc.value,
        totalDef.value,
        totalHp.value,
        energyRegen.value,
        totalAtk.value,
        BasicAttackDMGBonus.value,
        HeavyAttackDMGBonus.value,
        ResonanceSkillDMGBonus.value,
        IntroSkillDMGBonus.value,
        OutroSkillDMGBonus.value,
        ResonanceLiberationDMGBonus.value,
        EchoDMGBonus.value,
        healingBonus.value,
        shieldBonus.value,
        totalCritRate.value,
        totalCritDMG.value,
        DefIgnore.value,
        havocBaneStacks.value,
        ResistReduction.value,
        TotalDeepenEffect.value,
        enemyLevel.value,
        enemyResist.value,
        characters.value,
        character.value,
        enemyType.value,
      );
      const damageData = calcDamages(context);
      allDamages.value = damageData;
    };

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

    const updateStats = (stats) => {
      totalAtkPercent.value = stats.attackPercent;
      totalAtkFlat.value = stats.attackFlat;
      totalHpPercent.value = stats.hpPercent;
      totalHpFlat.value = stats.hpFlat;
      totalDefPercent.value = stats.defPercent;
      totalDefFlat.value = stats.defFlat;
      totalAtk.value = stats.totalAtk;
      totalHp.value = stats.totalHp;
      totalDef.value = stats.totalDef;
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
    };

    const handleWeaponUpdated = (givenWeaponData) => {
      weaponData.value = givenWeaponData;
      weaponAtk.value = givenWeaponData.attack;
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    };

    // Helper function to compute all buffs in the correct order and return breakdown data
    // Uses the pure calculateAllStats function which is web worker compatible
    const computeAllBuffsWithBreakdown = () => {
      return calculateAllStats({
        baseHp: baseHp.value,
        baseAtk: baseAtk.value,
        baseDef: baseDef.value,
        weaponAtk: weaponData?.value?.attack ?? 0,
        weaponModifier: weaponData?.value?.modifier ?? null,
        weaponModifierValue: weaponData?.value?.modifierValue ?? 0,
        weaponPassiveData: weaponData?.value?.weaponPassiveStats ?? {},
        buffsConfig: characterStore.getActiveCharacter?.buffs ?? {},
        resonanceChainsConfig:
          characterStore.getActiveCharacter?.resonanceChains ?? {},
        customBuffs: customBuffs.value,
        teamBuffsData: teamBuffsData.value,
        echoStats: echoStats.value,
        buffsCharInfo: chosenChar.value?.buffs ?? [],
        resonanceChainsCharInfo: chosenChar.value?.resonanceChains ?? [],
        character: character?.value ?? "",
        talentData: talentData ?? {},
        ignoreBuffs: {},
      });
    };

    const handleUpdatedCharacterBuffs = (givenCharBuffsData) => {
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    };

    const handleUpdatedTeamBuffs = (givenTeamBuffs) => {
      teamBuffsData.value = givenTeamBuffs;
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    };

    const handleUpdatedCharacterResonanceChains = async (
      givenResonanceChainsData,
    ) => {
      if (character.value === "Lupa") {
        await nextTick();
        characterBuffsRef.value.retriggerBuffCalculations();
      }

      charResonanceChainsData.value = givenResonanceChainsData;
      // also re-trigger the self buffs as they can be tied together
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    };

    const updateStatsEchoes = (echoStatsGiven) => {
      echoStats.value = echoStatsGiven;
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    };

    const changeScreen = (screen: string) => {
      curScreen.value = screen;
    };

    const handleCharacterTalentUpdated = (data) => {
      talentData[data.type] = data.value;
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    };

    const handleCharacterLevelUpdated = (level) => {
      // set the character level in the store
      characterLevel.value = level;
      // update the base stats
      baseHp.value =
        chosenChar.value?.getCharacterStatsByLevel(characterLevel.value)?.hp ??
        0;
      baseAtk.value =
        chosenChar.value?.getCharacterStatsByLevel(characterLevel.value)
          ?.attack ?? 0;
      baseDef.value =
        chosenChar.value?.getCharacterStatsByLevel(characterLevel.value)
          ?.defense ?? 0;
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
    };

    const handleUpdatedEnemy = (data) => {
      enemyLevel.value = data.enemyLevel;
      enemyResist.value = data.enemyResist;
      enemyType.value = data.enemyType;
      spectroFrazzleStacks.value = data.spectroFrazzleStacks;
      aeroErosionStacks.value = data.aeroErosionStacks;
      havocBaneStacks.value = data.havocBaneStacks;
      calcAllDamages();
    };

    const handleCustomBuffs = (data) => {
      customBuffs.value = data;
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
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
          echo: rotation.echo ?? null,
          mainEcho: rotation.mainEcho ?? null,
          mainEchoRank: rotation.actionMainEchoRank ?? null,
        };
        const rotationActionInfo = [];
        rotation.actions.forEach((action) => {
          const actionKey = action.key;
          const actionType = action.type;
          const actionBuffs = action.buffs;
          const actionCount = action.count;
          const actionId = action.id;
          const actionDisabled = action?.isDisabled ?? false;
          const actionMainEcho = action?.mainEcho ?? null;
          const actionMainEchoRank = action?.mainEchoRank ?? null;
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
          } else if (actionType === "echoAttacks") {
            const echoData = getEchoData(actionMainEcho);
            const echoAttacks = echoData?.actions ?? [];
            foundAction = echoAttacks.find((attack) => {
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
              actionMainEcho,
              actionMainEchoRank,
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

    const handleStatSelected = (statName) => {
      selectedStat.value = statName;
      selectedAttackKey.value = null;
      selectedAttackDamage.value = null;
      selectedAttackLabel.value = null;
      // Emit to parent (HomeView) to open the drawer
      emit("stat-selected", statName);
    };

    const handleBreakdownClose = () => {
      selectedAttackKey.value = null;
      selectedAttackDamage.value = null;
      selectedStat.value = null;
      selectedAttackLabel.value = null;
      // Emit to parent (HomeView) to close the drawer
      emit("breakdown-closed");
    };

    const handleUpdatedMainEcho = (chosenEcho) => {
      mainEcho.value = chosenEcho;
      calcAllDamages();
    };

    const handleUpdatedMainEchoRank = (chosenEchoRank) => {
      mainEchoRank.value = chosenEchoRank;
      calcAllDamages();
    };

    const handleOptimize = (
      setFilters = [],
      mainEchoes = [],
      minStats = [],
      echoSetPassiveBuffs = {},
      mainEchoStats = {},
      target = "ATK",
      damageType = "Average",
      ignoreOtherResonantorEchoes = false,
    ) => {
      const echoes = inventoryStore.echoes;
      const allowedSets = new Set(setFilters);
      const topN = 5;
      processedCombos.value = 0;
      totalCombos.value = 0;
      optimizerResults.value = []; // Initialize as empty array instead of null
      optimizationTargetType.value = target.split(":")[0];
      optimizationTargetObject.value = target.split(":")[1] || "";

      // 1. Filter upfront
      let filteredEchoes = echoes;
      if (allowedSets.size) {
        filteredEchoes = echoes.filter((e) => allowedSets.has(e.echoSet));
      }
      if (ignoreOtherResonantorEchoes) {
        const echoIdsEquippedByOtherChars =
          inventoryStore.echoIdsEquippedByOtherChars(character.value);
        filteredEchoes = filteredEchoes.filter(
          (e) => !echoIdsEquippedByOtherChars.includes(e.echoId),
        );
      }

      // Build optimizer context with all necessary data
      const optimizerContext = {
        // Character data
        chosenChar: chosenChar.value,
        character: character.value,
        characterLevel: characterLevel.value,
        talentData: {
          basic: talentData.basic,
          skill: talentData.skill,
          forte: talentData.forte,
          liberation: talentData.liberation,
          intro: talentData.intro,
        },

        // Base stats
        baseHp: baseHp.value,
        baseAtk: baseAtk.value,
        baseDef: baseDef.value,

        // Weapon data
        weaponData: {
          attack: weaponData.value?.attack ?? 0,
          modifier: weaponData.value?.modifier ?? null,
          modifierValue: weaponData.value?.modifierValue ?? 0,
          weaponPassiveStats: weaponData.value?.weaponPassiveStats ?? {},
        },

        // Buffs
        charBuffsData: charBuffsData.value,
        charResonanceChainsData: charResonanceChainsData.value,
        teamBuffsData: teamBuffsData.value,
        customBuffs: customBuffs.value,

        // Echo data
        echoStats: echoStats.value,

        // Enemy data
        enemyLevel: enemyLevel.value,
        enemyResist: enemyResist.value,
        enemyType: enemyType.value,
        isSpectroFrazzleEnabled: isSpectroFrazzleEnabled.value,
        spectroFrazzleStacks: spectroFrazzleStacks.value,
        isAeroErosionEnabled: isAeroErosionEnabled.value,
        aeroErosionStacks: aeroErosionStacks.value,
        havocBaneStacks: havocBaneStacks.value,

        // Main echo
        mainEcho: mainEcho.value,
        mainEchoRank: mainEchoRank.value,

        // Rotations
        rotationsList: rotationsList.value,

        // Computed stats (for fallback values)
        Glacio: Glacio.value,
        Fusion: Fusion.value,
        Electro: Electro.value,
        Aero: Aero.value,
        Spectro: Spectro.value,
        Havoc: Havoc.value,

        // Global data
        characters: characters.value,

        // Character store data
        activeCharacterBuffs: characterStore.getActiveCharacter?.buffs ?? {},
        activeCharacterResonanceChains:
          characterStore.getActiveCharacter?.resonanceChains ?? {},

        // Helper function to get rotation by ID
        getRotationById: (char: string, rotationId: string) => {
          return characterStore.getRotationById(char, rotationId);
        },
      };

      // Pre-process rotation data if needed (since we can't pass functions to workers)
      let rotationData = null;
      const targetElements = target.split(":");
      const targetType = targetElements[0];
      if (targetType === "Rotation") {
        const rotationId = targetElements[1];
        const rotation = characterStore.getRotationById(
          character.value,
          rotationId,
        );
        if (rotation) {
          // Pre-process rotation data - convert actions to attacks (like in optimizer.ts)
          const rotationInfo = {
            id: rotationId,
            name: rotation.name,
            description: rotation.description,
            duration: rotation.duration ?? null,
            echo: rotation.echo ?? null,
          };

          // Use already imported functions (getEchoData, utilityAttacks, echoSetAttacks are imported at top)

          const rotationActionInfo: any[] = [];
          rotation.actions.forEach((action: any) => {
            const actionKey = action.key;
            const actionType = action.type;
            const actionBuffs = action.buffs;
            const actionCount = action.count;
            const actionId = action.id;
            const actionDisabled = action?.isDisabled ?? false;
            const actionMainEcho = action?.mainEcho ?? null;
            const actionMainEchoRank = action?.mainEchoRank ?? null;

            // Skip disabled actions
            if (actionDisabled) {
              return;
            }

            const attacksList =
              chosenChar.value?.[`${actionType}Attacks`]?.attacks ?? [];
            let foundAction;

            if (actionType === "echoSetAttacks") {
              foundAction = echoSetAttacks.find(
                (attack: any) => attack.key === actionKey,
              );
            } else if (actionType === "utilityAttacks") {
              foundAction = utilityAttacks.find(
                (attack: any) => attack.key === actionKey,
              );
            } else if (actionType === "echoAttacks") {
              const echoData = getEchoData(actionMainEcho);
              const echoAttacks = echoData?.actions ?? [];
              foundAction = echoAttacks.find(
                (attack: any) => attack.key === actionKey,
              );
            } else {
              foundAction = attacksList.find(
                (attack: any) => attack.key === actionKey,
              );
            }

            if (foundAction) {
              const actionData: any = {
                ...foundAction,
                buffs: null,
                actionType,
                count: actionCount,
                id: actionId,
                excludeSelfBuffs: action.excludeSelfBuffs ?? false,
                excludeTeamBuffs: action.excludeTeamBuffs ?? false,
                excludeWeaponBuffs: action.excludeWeaponBuffs ?? false,
                actionMainEcho: action?.mainEcho ?? null,
                actionMainEchoRank: action?.mainEchoRank ?? null,
                excludeEchoes:
                  action.excludeSelfBuffs ||
                  action.excludeTeamBuffs ||
                  action.excludeWeaponBuffs ||
                  false,
              };

              // Convert buffs array to object if present
              if (action?.buffs?.length) {
                const buffsData: any = {};
                action.buffs.forEach((buff: any) => {
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
          rotationData = rotationInfo;

          console.log("Pre-processed rotation data:", {
            id: rotationData.id,
            name: rotationData.name,
            attacksCount: rotationData.attacks?.length || 0,
          });
        } else {
          console.error("Could not find rotation:", rotationId);
        }
      }

      // Use web workers for optimization
      optimizeWithWorkers(
        filteredEchoes,
        optimizerContext,
        Array.from(allowedSets),
        topN,
        mainEchoes,
        minStats,
        echoSetPassiveBuffs,
        mainEchoStats,
        target,
        damageType,
        rotationData,
      );
    };

    // Helper function to serialize echoes array (only include needed properties)
    const serializeEchoes = (echoes: any[]): any[] => {
      if (!Array.isArray(echoes)) {
        return [];
      }
      return echoes
        .filter((echo) => echo && typeof echo === "object")
        .map((echo) => {
          // Only include the properties we actually need for optimization
          // Use null/undefined checks to ensure we don't pass non-serializable values
          return {
            echoId: echo.echoId ?? null,
            echo: echo.echo ?? null,
            echoSet: echo.echoSet ?? null,
            echoSubStatsType1: echo.echoSubStatsType1 ?? null,
            echoSubStatsType2: echo.echoSubStatsType2 ?? null,
            echoSubStatsType3: echo.echoSubStatsType3 ?? null,
            echoSubStatsType4: echo.echoSubStatsType4 ?? null,
            echoSubStatsType5: echo.echoSubStatsType5 ?? null,
            echoSubStatsValue1:
              typeof echo.echoSubStatsValue1 === "number"
                ? echo.echoSubStatsValue1
                : null,
            echoSubStatsValue2:
              typeof echo.echoSubStatsValue2 === "number"
                ? echo.echoSubStatsValue2
                : null,
            echoSubStatsValue3:
              typeof echo.echoSubStatsValue3 === "number"
                ? echo.echoSubStatsValue3
                : null,
            echoSubStatsValue4:
              typeof echo.echoSubStatsValue4 === "number"
                ? echo.echoSubStatsValue4
                : null,
            echoSubStatsValue5:
              typeof echo.echoSubStatsValue5 === "number"
                ? echo.echoSubStatsValue5
                : null,
            rank: typeof echo.rank === "number" ? echo.rank : null,
            stat: echo.stat ?? null,
            type:
              typeof echo.type === "number" || typeof echo.type === "string"
                ? echo.type
                : null,
          };
        });
    };

    // Helper function to create a serializable context (removes functions and ensures all data is plain)
    const createSerializableContext = (context: any): any => {
      try {
        // Deep clone using JSON to ensure everything is serializable
        // This will remove functions, Vue reactive proxies, circular references, etc.
        const serializable = JSON.parse(
          JSON.stringify(context, (key, value) => {
            // Skip functions
            if (typeof value === "function") {
              return undefined;
            }
            // Ensure we're not passing Vue reactive proxies or other non-serializable objects
            return value;
          }),
        );
        return serializable;
      } catch (error) {
        console.error("Error serializing context:", error);
        // Fallback: manually create a plain object
        return {
          chosenChar: JSON.parse(JSON.stringify(context.chosenChar)),
          character: context.character,
          characterLevel: context.characterLevel,
          talentData: { ...context.talentData },
          baseHp: context.baseHp,
          baseAtk: context.baseAtk,
          baseDef: context.baseDef,
          weaponData: JSON.parse(JSON.stringify(context.weaponData)),
          charBuffsData: JSON.parse(JSON.stringify(context.charBuffsData)),
          charResonanceChainsData: JSON.parse(
            JSON.stringify(context.charResonanceChainsData),
          ),
          teamBuffsData: JSON.parse(JSON.stringify(context.teamBuffsData)),
          customBuffs: JSON.parse(JSON.stringify(context.customBuffs)),
          echoStats: JSON.parse(JSON.stringify(context.echoStats)),
          enemyLevel: context.enemyLevel,
          enemyResist: context.enemyResist,
          enemyType: context.enemyType,
          isSpectroFrazzleEnabled: context.isSpectroFrazzleEnabled,
          spectroFrazzleStacks: context.spectroFrazzleStacks,
          isAeroErosionEnabled: context.isAeroErosionEnabled,
          aeroErosionStacks: context.aeroErosionStacks,
          havocBaneStacks: context.havocBaneStacks,
          mainEcho: context.mainEcho,
          mainEchoRank: context.mainEchoRank,
          rotationsList: JSON.parse(JSON.stringify(context.rotationsList)),
          Glacio: context.Glacio,
          Fusion: context.Fusion,
          Electro: context.Electro,
          Aero: context.Aero,
          Spectro: context.Spectro,
          Havoc: context.Havoc,
          characters: JSON.parse(JSON.stringify(context.characters)),
          activeCharacterBuffs: JSON.parse(
            JSON.stringify(context.activeCharacterBuffs),
          ),
          activeCharacterResonanceChains: JSON.parse(
            JSON.stringify(context.activeCharacterResonanceChains),
          ),
        };
      }
    };

    // Web worker-based optimization
    const optimizeWithWorkers = async (
      echoes: any[],
      context: any,
      allowedSets: string[],
      topN: number,
      mainEchoKeys: string[],
      minStats: any[],
      echoSetPassiveBuffs: Record<string, any>,
      mainEchoStats: Record<string, any>,
      target: string,
      damageType: string,
      rotationData: any = null,
    ) => {
      // Detect device capabilities
      const workerCount = Math.min(
        5,
        Math.max(2, (navigator.hardwareConcurrency || 4) - 1),
      );
      const batchSize =
        navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8
          ? 5000
          : 2000; // Larger batches on powerful devices

      // Create workers
      const generatorWorker = new Worker(
        new URL("../workers/generator.worker.ts", import.meta.url),
        { type: "module" },
      );

      const processorWorkers: Worker[] = [];
      for (let i = 0; i < workerCount; i++) {
        const worker = new Worker(
          new URL("../workers/processor.worker.ts", import.meta.url),
          { type: "module" },
        );
        processorWorkers.push(worker);
      }

      // State management
      const heap: any[] = [];
      const workQueue: Array<{ batch: any[]; batchId: number }> = [];
      let batchIdCounter = 0;
      let totalGenerated = 0;
      let totalProcessed = 0;
      const workerBusy = new Map<Worker, boolean>();
      let generatorDone = false;
      const seenCombinations = new Set<string>();
      let readyWorkers = 0;

      // Initialize processor workers
      processorWorkers.forEach((worker, index) => {
        workerBusy.set(worker, false);
        worker.postMessage({ type: "init" });
        worker.onmessage = (e) => {
          if (e.data.type === "ready") {
            readyWorkers++;
            console.log(
              `Worker ${index} ready. Total ready: ${readyWorkers}/${processorWorkers.length}`,
            );
            if (readyWorkers === processorWorkers.length) {
              console.log("All workers ready, starting work distribution");
              distributeWork();
            }
          } else if (e.data.type === "result") {
            workerBusy.set(worker, false);
            totalProcessed += e.data.processed || 0;
            processedCombos.value = totalProcessed;

            // Workers no longer send newCombinations - we filter duplicates here in main thread
            // Update heap with results
            if (e.data.results && e.data.results.length > 0) {
              let addedToHeap = 0;
              let skippedDuplicate = 0;
              let skippedTooLow = 0;

              // Log the current state before processing this batch
              const seenBeforeBatch = seenCombinations.size;

              for (const result of e.data.results) {
                // Skip duplicates (double-check, though workers should have already filtered)
                if (
                  !result ||
                  !result.loadout ||
                  !Array.isArray(result.loadout)
                ) {
                  console.warn("Invalid result in batch:", result);
                  continue;
                }
                // Create key exactly like generator does
                const echoIds: string[] = [];
                for (const e of result.loadout) {
                  if (e && e.echoId) {
                    echoIds.push(String(e.echoId));
                  }
                }
                if (echoIds.length === 0) {
                  console.warn("Result has no echoIds:", result);
                  continue;
                }
                echoIds.sort();
                const key = echoIds.join("|");
                if (seenCombinations.has(key)) {
                  skippedDuplicate++;
                  continue;
                }
                seenCombinations.add(key);

                // Ensure targetValue is a number
                const targetValue =
                  typeof result.targetValue === "number"
                    ? result.targetValue
                    : Number(result.targetValue);

                if (heap.length < topN) {
                  const resultWithId = {
                    ...result,
                    targetValue,
                    id: randomString(),
                  };
                  heap.push(resultWithId);
                  heap.sort((a, b) => a.targetValue - b.targetValue);
                  addedToHeap++;
                } else {
                  // Ensure heap[0].targetValue is also a number for comparison
                  const heapMinValue =
                    typeof heap[0].targetValue === "number"
                      ? heap[0].targetValue
                      : Number(heap[0].targetValue) || 0;

                  if (targetValue > heapMinValue) {
                    const oldValue = heapMinValue;
                    heap[0] = {
                      ...result,
                      targetValue,
                      id: randomString(),
                    };
                    heap.sort((a, b) => {
                      const aVal =
                        typeof a.targetValue === "number"
                          ? a.targetValue
                          : Number(a.targetValue) || 0;
                      const bVal =
                        typeof b.targetValue === "number"
                          ? b.targetValue
                          : Number(b.targetValue) || 0;
                      return aVal - bVal;
                    });
                    addedToHeap++;
                    // Only log significant improvements (more than 1% better)
                    if (targetValue > oldValue * 1.01) {
                      console.log(
                        `Replaced heap[0]: ${oldValue.toFixed(0)} -> ${targetValue.toFixed(0)} (+${((targetValue / oldValue - 1) * 100).toFixed(1)}%)`,
                      );
                    }
                  } else {
                    skippedTooLow++;
                  }
                }
              }

              // Log summary for this batch (only if there are many results)
              if (e.data.results.length > 100) {
                const seenAfterBatch = seenCombinations.size;
                const newUnique = seenAfterBatch - seenBeforeBatch;
                console.log(
                  `Batch ${e.data.batchId}: ${e.data.results.length} results -> ${addedToHeap} added, ${skippedDuplicate} duplicates (${newUnique} new unique), ${skippedTooLow} too low. Total unique: ${seenAfterBatch}`,
                );

                // Debug: Log sample keys and loadout details from first few results
                if (e.data.batchId <= 1 && e.data.results.length > 0) {
                  const sampleKeys: string[] = [];
                  const sampleLoadouts: any[] = [];
                  for (let i = 0; i < Math.min(5, e.data.results.length); i++) {
                    const result = e.data.results[i];
                    if (!result || !result.loadout) continue;
                    const echoIds: string[] = [];
                    for (const e of result.loadout) {
                      if (e && e.echoId) {
                        echoIds.push(String(e.echoId));
                      }
                    }
                    echoIds.sort();
                    const key = echoIds.join("|");
                    sampleKeys.push(key);
                    sampleLoadouts.push({
                      loadoutLength: result.loadout.length,
                      echoIds: echoIds.slice(0, 5),
                      hasEchoId: result.loadout[0]?.echoId != null,
                    });
                  }
                  console.log(
                    `Sample keys from batch ${e.data.batchId} (first 5):`,
                    sampleKeys,
                  );
                  console.log(
                    `Sample loadout details from batch ${e.data.batchId}:`,
                    sampleLoadouts,
                  );
                }
              }
            }

            // Request more work
            distributeWork();
          } else if (e.data.type === "error") {
            console.error(
              `Processor worker error (batch ${e.data.batchId}):`,
              e.data.error,
            );
            workerBusy.set(worker, false);
            totalProcessed += e.data.processed || 0;
            processedCombos.value = totalProcessed;
            distributeWork();
          } else {
            console.warn("Unknown message type from worker:", e.data);
          }
        };
      });

      // Distribute work to available workers
      const distributeWork = () => {
        // Don't distribute work if workers aren't ready yet
        if (readyWorkers < processorWorkers.length) {
          console.log(
            `Workers not all ready yet (${readyWorkers}/${processorWorkers.length}), skipping work distribution`,
          );
          return;
        }

        console.log(
          `distributeWork called. Queue: ${workQueue.length}, Ready: ${readyWorkers}/${processorWorkers.length}, Busy: ${processorWorkers.filter((w) => workerBusy.get(w)).length}`,
        );

        while (workQueue.length > 0) {
          const work = workQueue.shift();
          if (!work) break;

          const availableWorker = processorWorkers.find(
            (w) => !workerBusy.get(w),
          );
          if (!availableWorker) {
            // No available workers, put work back at front
            workQueue.unshift(work);
            console.log("No available workers, work queued");
            break;
          }

          console.log(
            `Distributing batch ${work.batchId} with ${work.batch.length} loadouts to worker`,
          );
          workerBusy.set(availableWorker, true);

          try {
            // Create serializable context (remove functions, ensure all data is plain objects)
            const serializableContext = createSerializableContext(context);

            // Convert any Vue reactive arrays/objects to plain arrays/objects
            // Vue reactive proxies cannot be cloned, so we need to convert them first
            const plainAllowedSets = Array.isArray(allowedSets)
              ? [...allowedSets]
              : allowedSets;
            const plainMainEchoKeys = Array.isArray(mainEchoKeys)
              ? [...mainEchoKeys]
              : mainEchoKeys;
            const plainMinStats = Array.isArray(minStats)
              ? minStats.map((s: any) =>
                  s && typeof s === "object" ? { ...s } : s,
                )
              : minStats;

            // Don't send seenCombinations to workers - they'll process everything
            // and we'll filter duplicates in the main thread (single source of truth)
            const seenCombinationsArray: string[] = [];

            availableWorker.postMessage({
              type: "process",
              data: {
                batch: work.batch,
                batchId: work.batchId,
                context: serializableContext,
                allowedSets: plainAllowedSets,
                topN,
                mainEchoKeys: plainMainEchoKeys,
                minStats: plainMinStats,
                echoSetPassiveBuffs: JSON.parse(
                  JSON.stringify(echoSetPassiveBuffs),
                ),
                mainEchoStats: JSON.parse(JSON.stringify(mainEchoStats)),
                target,
                damageType,
                rotationData: rotationData
                  ? JSON.parse(JSON.stringify(rotationData))
                  : null,
                seenCombinations: seenCombinationsArray, // Send current seen combinations
              },
            });
          } catch (error: any) {
            console.error(
              `Error sending batch ${work.batchId} to worker:`,
              error,
            );
            workerBusy.set(availableWorker, false);
            // Put work back in queue to retry
            workQueue.unshift(work);
          }
        }

        // Check if we're done
        const allWorkersIdle = processorWorkers.every(
          (w) => !workerBusy.get(w),
        );
        if (generatorDone && workQueue.length === 0 && allWorkersIdle) {
          // Set final results (sorted descending)
          const finalResults = heap
            .slice()
            .sort((a, b) => b.targetValue - a.targetValue);
          optimizerResults.value = finalResults;

          console.log("Optimization complete!", {
            totalProcessed,
            heapSize: heap.length,
            resultsCount: finalResults.length,
            topValue: finalResults[0]?.targetValue,
            topValueType: typeof finalResults[0]?.targetValue,
            damageType,
            target,
            seenCombinationsCount: seenCombinations.size,
            results: finalResults.map((r: any, idx: number) => ({
              rank: idx + 1,
              targetValue: r.targetValue,
              avgDamage: r.context?.rotation?.damageAggregation?.avgDamage,
              normalDamage:
                r.context?.rotation?.damageAggregation?.normalDamage,
              critDamage: r.context?.rotation?.damageAggregation?.critDamage,
            })),
          });

          // Cleanup
          generatorWorker.terminate();
          processorWorkers.forEach((w) => w.terminate());
          totalCombos.value = totalProcessed;
        }
      };

      // Helper function to test if data can be cloned and identify problematic items
      const testClone = (data: any, name: string): boolean => {
        try {
          // Try structuredClone first (more accurate, available in modern browsers)
          if (typeof structuredClone !== "undefined") {
            structuredClone(data);
            return true;
          }
          // Fallback: try JSON serialization (catches most issues)
          const jsonStr = JSON.stringify(data);
          JSON.parse(jsonStr);
          return true;
        } catch (error: any) {
          console.error(`❌ Cannot clone ${name}:`, error.message);
          console.error(
            `${name} type:`,
            typeof data,
            Array.isArray(data) ? "Array" : "",
          );
          console.error(`${name} value:`, data);

          // If it's an array, test each item
          if (Array.isArray(data) && data.length > 0) {
            console.error(`Testing ${data.length} items in ${name}...`);
            data.forEach((item: any, index: number) => {
              try {
                if (typeof structuredClone !== "undefined") {
                  structuredClone(item);
                } else {
                  JSON.stringify(item);
                }
              } catch (itemError: any) {
                console.error(
                  `❌ Cannot clone ${name}[${index}]:`,
                  itemError.message,
                );
                console.error(`${name}[${index}] value:`, item);
                console.error(
                  `${name}[${index}] keys:`,
                  Object.keys(item || {}),
                );
                // Check each property of the problematic item
                if (item && typeof item === "object") {
                  Object.keys(item).forEach((key) => {
                    try {
                      if (typeof structuredClone !== "undefined") {
                        structuredClone(item[key]);
                      } else {
                        JSON.stringify(item[key]);
                      }
                    } catch (propError: any) {
                      console.error(
                        `❌ Property ${name}[${index}].${key} cannot be cloned:`,
                        propError.message,
                      );
                      console.error(`Property value:`, item[key]);
                      console.error(`Property type:`, typeof item[key]);
                    }
                  });
                }
              }
            });
          } else if (data && typeof data === "object") {
            // If it's an object, test each property
            console.error(`Testing properties of ${name}...`);
            Object.keys(data).forEach((key) => {
              try {
                if (typeof structuredClone !== "undefined") {
                  structuredClone(data[key]);
                } else {
                  JSON.stringify(data[key]);
                }
              } catch (propError: any) {
                console.error(
                  `❌ Property ${name}.${key} cannot be cloned:`,
                  propError.message,
                );
                console.error(`Property value:`, data[key]);
                console.error(`Property type:`, typeof data[key]);
              }
            });
          }
          return false;
        }
      };

      // Generator worker handler
      generatorWorker.onmessage = (e) => {
        if (e.data.type === "ready") {
          // Start generation - ensure echoes are serializable
          try {
            // Serialize echoes by only including needed properties
            const serializedEchoes = serializeEchoes(echoes);

            // Convert Vue reactive arrays/objects to plain arrays/objects
            // Vue reactive proxies cannot be cloned, so we need to convert them first
            const plainMainEchoKeys = Array.isArray(mainEchoKeys)
              ? [...mainEchoKeys] // Convert Proxy array to plain array
              : mainEchoKeys;

            // Debug: Test each property individually (only in development)
            if (process.env.NODE_ENV === "development") {
              console.log("Testing serialization...");
              if (!testClone(serializedEchoes, "echoes")) {
                throw new Error("Echoes array cannot be cloned");
              }
              if (!testClone(plainMainEchoKeys, "mainEchoKeys")) {
                throw new Error("mainEchoKeys cannot be cloned");
              }
              if (!testClone(batchSize, "batchSize")) {
                throw new Error("batchSize cannot be cloned");
              }
            }

            const messageData = {
              type: "start",
              data: {
                echoes: serializedEchoes,
                mainEchoKeys: plainMainEchoKeys,
                batchSize,
              },
            };

            generatorWorker.postMessage(messageData);
            if (process.env.NODE_ENV === "development") {
              console.log("Successfully sent data to generator worker");
            }
          } catch (error) {
            console.error("Error sending data to generator worker:", error);
            generatorWorker.terminate();
            processorWorkers.forEach((w) => w.terminate());
          }
        } else if (e.data.type === "batch") {
          totalGenerated = e.data.totalGenerated || 0;
          totalCombos.value = totalGenerated;

          console.log(
            `Received batch with ${e.data.batch?.length || 0} loadouts, total generated: ${totalGenerated}`,
          );

          // Add batch to work queue
          if (e.data.batch && e.data.batch.length > 0) {
            workQueue.push({
              batch: e.data.batch,
              batchId: batchIdCounter++,
            });
            console.log(
              `Added batch to queue. Queue size: ${workQueue.length}, Ready workers: ${readyWorkers}/${processorWorkers.length}`,
            );

            // Distribute work if workers are ready
            if (readyWorkers === processorWorkers.length) {
              distributeWork();
            } else {
              console.log("Workers not ready yet, waiting...");
            }
          } else {
            console.warn("Received empty batch from generator");
          }
        } else if (e.data.type === "done") {
          generatorDone = true;
          totalCombos.value = e.data.totalGenerated || totalGenerated;
          distributeWork(); // Process remaining work
        } else if (e.data.type === "error") {
          console.error("Generator worker error:", e.data.error);
          generatorDone = true;
        }
      };

      // Initialize generator
      generatorWorker.postMessage({ type: "init" });
    };

    function handleSelectedAttack(attackKey, damage, label) {
      selectedStat.value = null;
      selectedAttackKey.value = attackKey;
      selectedAttackDamage.value = damage;
      selectedAttackLabel.value = label;
      // Emit to parent (HomeView) to open the drawer
      emit("attack-selected", attackKey);
    }

    function getRotationData(character, rotationId) {}

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
      handleSelectedAttack,
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
      characterElement,
      isLoading,
      mainEcho,
      // elemental effects
      isSpectroFrazzleEnabled,
      isMissingSpectroData,
      isAeroErosionEnabled,
      isMissingAeroErosionData,
      isHavocBaneEnabled,
      // component refs
      characterBuffsRef,
      // optimizer stuff
      totalCombos,
      processedCombos,
      optimizerResults,
      optimizationTargetType,
      optimizationTargetObject,
      // data for the sidebar
      displayPercentage,
      displayInt,
      baseHp,
      baseAtk,
      baseDef,
      customBuffs,
      teamBuffsData,
      echoStats,
      selectedStat,
      handleStatSelected,
      handleBreakdownClose,
      selectedAttackKey,
      selectedAttackDamage,
      selectedAttackLabel,
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
