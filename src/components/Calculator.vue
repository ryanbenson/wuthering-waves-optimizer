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
import { processAttacks, calcDamages } from "../calculator/attacks";
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
      const damageData = calcDamages(
        chosenChar.value,
        echoStats.value,
        teamBuffsData.value,
        talentData,
        isSpectroFrazzleEnabled.value,
        spectroFrazzleStacks.value,
        isMissingSpectroData.value,
        isAeroErosionEnabled.value,
        aeroErosionStacks.value,
        isMissingAeroErosionData.value,
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
      optimizerResults.value = null;

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

      const results = optimize(
        filteredEchoes,
        allowedSets,
        topN,
        mainEchoes,
        minStats,
        echoSetPassiveBuffs,
        mainEchoStats,
        target,
        damageType,
      );
      optimizerResults.value = results;
      totalCombos.value = processedCombos.value;
      // console.log(results);
    };

    function* generateLoadouts(
      echoes,
      mainEchoKeys = [],
      start = 0,
      combo = [],
      cost = 0,
      usedEchoIds = new Set(),
      usedEchoes = new Set(),
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
            // add the main echo to the list of echoes already used so we dont try to use
            // another copy of the same echo
            const groupUsedEchoes = new Set([mainEcho.echo]);
            yield* generateLoadouts(
              echoes,
              mainEchoKeys,
              0,
              [mainEcho],
              nextCost,
              groupUsedEchoIds,
              groupUsedEchoes,
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
        // Skip if the echo has
        if (usedEchoes.has(next.echo)) continue;

        const nextCost = cost + next.type;
        if (nextCost <= 12) {
          // Add to used set instead of filtering
          usedEchoIds.add(next.echoId);
          // Add the echo key instead of filtering
          usedEchoes.add(next.echo);
          combo.push(next); // Mutate instead of creating new array
          yield* generateLoadouts(
            echoes,
            mainEchoKeys,
            i + 1, // Can keep original index since we're not filtering
            combo,
            nextCost,
            usedEchoIds,
            usedEchoes,
          );
          combo.pop(); // Backtrack
          usedEchoIds.delete(next.echoId); // Backtrack
          usedEchoes.delete(next.echo);
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
      damageType = "Average",
    ) {
      // Min-heap for topN results
      const heap = [];
      const seenCombinations = new Set(); // Track unique combinations

      // get info on our target
      const targetElements = target.split(":");
      const [targetType, targetObject] = targetElements;
      optimizationTargetType.value = targetType;
      optimizationTargetObject.value = targetObject;
      // if it's an attack, get the attack info, the targetObject is Type|skillkey
      let attackData;
      if (targetType === "Attack") {
        const [attackType, attackKey] = targetObject.split("|");
        const attackInfo = getAttackData(
          chosenChar.value,
          attackType,
          attackKey,
        );
        let actionTypeForAttackData;
        switch (attackType) {
          case "basicAttacks":
            actionTypeForAttackData = "basic";
            break;
          case "skillAttacks":
            actionTypeForAttackData = "skill";
            break;
          case "forteCircuitAttacks":
            actionTypeForAttackData = "forte";
            break;
          case "liberationAttacks":
            actionTypeForAttackData = "liberation";
            break;
          case "introAttacks":
            actionTypeForAttackData = "intro";
            break;
          case "tuneBreakAttacks":
            actionTypeForAttackData = "tuneBreak";
            break;
          case "outroAttacks":
            actionTypeForAttackData = "outro";
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
          subType: attackInfo.subType,
          element: attackInfo.element,
          attribute: attackInfo?.attribute ?? null,
          alwaysCrit: attackInfo?.alwaysCrit ?? false,
        };
        if (!attackData) {
          console.error("Could not find the attack data chosen");
          return;
        }
      }

      let rotationData;
      if (targetType === "Rotation") {
        const rotationId = targetObject;
        const rotation = characterStore.getRotationById(
          character.value,
          rotationId,
        );
        // TODO: this is also copy and pasted to build the rotation data
        // Refactor this out
        // console.log(rotationId, rotation, targetObject);
        const rotationInfo = {
          id: rotationId,
          name: rotation.name,
          description: rotation.description,
          duration: rotation.duration ?? null,
          echo: rotation.echo ?? null,
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
            chosenChar.value?.[`${actionType}Attacks`]?.attacks ?? [];
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
              actionMainEcho: action?.mainEcho ?? null,
              actionMainEchoRank: action?.mainEchoRank ?? null,
              // only exclude echoes if we excluded self, team, or weapon buffs
              excludeEchoes:
                action.excludeSelfBuffs ||
                action.excludeTeamBuffs ||
                action.excludeWeaponBuffs ||
                false,
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
        rotationData = rotationInfo;
      }

      // get the mapping of the damage target
      // we'll use this to get the damage out of the damage calculation (Normal/Avg/Crit)
      // default to average if we didn't match anything
      let damageTargetReference;
      if (targetType === "Attack") {
        const damageTargetMap = {
          Normal: "totalDamage",
          Average: "avgDamage",
          Crit: "critDamage",
        };
        damageTargetReference = damageTargetMap[damageType] ?? "avgDamage";
        if (targetType === "Attack" && attackData.type === "Shield") {
          damageTargetReference = "shieldAmount";
        }
        if (targetType === "Attack" && attackData.type === "Healing") {
          damageTargetReference = "healAmount";
        }
      }
      if (targetType === "Rotation") {
        const damageTargetMap = {
          Normal: "normalDamage",
          Average: "avgDamage",
          Crit: "critDamage",
        };
        damageTargetReference = damageTargetMap[damageType] ?? "avgDamage";
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
        // first compute the stats without self buffs
        let finalStats = calcCharStats(
          "All", // return value
          null, // inject stats
          // ignores
          {
            ignoreEchoes: true,
          },
          combinedEchoBuffs, // echo stats
          null, // full stats
          // base stats
          {
            baseHp: baseHp.value,
            baseAtk: baseAtk.value,
            baseDef: baseDef.value,
          },
          {
            weaponAtk: weaponData?.value?.attack,
            weaponModifier: weaponData?.value?.modifier,
            weaponModifierValue: weaponData?.value?.modifierValue,
            weaponPassiveData: weaponData?.value?.weaponPassiveStats ?? {},
          },
          {}, // NO SELF BUFFS
          {}, // no resonance chains
          echoStats.value,
          customBuffs.value,
          teamBuffsData.value,
        );

        // Compute all buffs in the correct order for this loadout
        // Step 1: Compute resonance chains buffs using base stats
        const resonanceChainsBuffsData = computeResonanceChainsBuffs(
          characterStore.getActiveCharacter?.resonanceChains ?? {},
          chosenChar.value?.resonanceChains ?? [],
          talentData ?? {},
        );

        // Step 2: Compute self buffs using base stats
        const selfBuffsData = computeSelfBuffs(
          characterStore.getActiveCharacter?.buffs ?? {},
          chosenChar.value?.buffs ?? [],
          characterStore.getActiveCharacter?.resonanceChains ?? {},
          talentData ?? {},
          character?.value ?? null,
        );

        // Step 3: Calculate intermediate stats with resonance chains and self buffs
        let intermediateStats = calcCharStats(
          "All",
          null,
          {
            ignoreEchoes: true,
          },
          combinedEchoBuffs,
          null,
          {
            baseHp: baseHp.value,
            baseAtk: baseAtk.value,
            baseDef: baseDef.value,
          },
          {
            weaponAtk: weaponData?.value?.attack,
            weaponModifier: weaponData?.value?.modifier,
            weaponModifierValue: weaponData?.value?.modifierValue,
            weaponPassiveData: weaponData?.value?.weaponPassiveStats ?? {},
          },
          selfBuffsData,
          resonanceChainsBuffsData,
          echoStats.value,
          customBuffs.value,
          teamBuffsData.value,
        );

        // Step 4: Compute AdditionalBase buffs using intermediate stats
        const additionalBaseBuffsData = computeAdditionalBaseBuffs(
          characterStore.getActiveCharacter?.buffs ?? {},
          chosenChar.value?.buffs ?? [],
          characterStore.getActiveCharacter?.resonanceChains ?? {},
          character?.value ?? null,
          intermediateStats.energyRegen,
          intermediateStats.totalCritRate,
        );

        // Step 5: Compute CritOverflow buffs using intermediate stats
        const critOverflowBuffsData = computeCritOverflowBuffs(
          characterStore.getActiveCharacter?.buffs ?? {},
          chosenChar.value?.buffs ?? [],
          characterStore.getActiveCharacter?.resonanceChains ?? {},
          chosenChar.value?.resonanceChains ?? [],
          intermediateStats.totalCritRate,
        );

        // Step 6: Merge AdditionalBase and CritOverflow into self buffs
        const mergedSelfBuffs = {
          ...selfBuffsData,
          CritRate:
            (selfBuffsData?.CritRate || 0) +
            (additionalBaseBuffsData?.CritRate || 0),
          CritDMG:
            (selfBuffsData?.CritDMG || 0) +
            (additionalBaseBuffsData?.CritDMG || 0) +
            (critOverflowBuffsData?.CritDMG || 0),
          ATK: (selfBuffsData?.ATK || 0) + (additionalBaseBuffsData?.ATK || 0),
          ATK_FLAT:
            (selfBuffsData?.ATK_FLAT || 0) +
            (additionalBaseBuffsData?.ATK_FLAT || 0),
        };

        // Step 7: Compute final stats with all buffs
        finalStats = calcCharStats(
          "All",
          null,
          {
            ignoreEchoes: true,
          },
          combinedEchoBuffs,
          null,
          {
            baseHp: baseHp.value,
            baseAtk: baseAtk.value,
            baseDef: baseDef.value,
          },
          {
            weaponAtk: weaponData?.value?.attack,
            weaponModifier: weaponData?.value?.modifier,
            weaponModifierValue: weaponData?.value?.modifierValue,
            weaponPassiveData: weaponData?.value?.weaponPassiveStats ?? {},
          },
          mergedSelfBuffs,
          resonanceChainsBuffsData,
          echoStats.value,
          customBuffs.value,
          teamBuffsData.value,
        );

        // re-calculate the "total" stats
        const weaponAtk = weaponData.value?.attack;
        finalStats.totalAtk =
          (baseAtk.value + weaponAtk) * (1 + finalStats.attackPercent / 100) +
          finalStats.attackFlat;
        finalStats.totalHp =
          baseHp.value * (1 + finalStats.hpPercent / 100) + finalStats.hpFlat;
        finalStats.totalDef =
          baseDef.value * (1 + finalStats.defPercent / 100) +
          finalStats.defFlat;
        finalStats.totalCritRate = finalStats.critRate / 100;
        finalStats.totalCritDMG = finalStats.critDMG / 100;
        finalStats.DefIgnore = finalStats.defIgnore / 100;

        // if we have some min stats, check them before we add them to the list of usable loadouts
        let isMeetingMinRequirements = true;
        if (minStats.length > 0) {
          for (const minStat of minStats) {
            const statValue = finalStats?.[minStat.stat];
            const desiredValue = Number(minStat.minValue) / 100; // we need to divide as we're getting full int, but the stats calculated are decimals
            // if any of the min stats aren't good enough, then don't use the loadout
            if (statValue < desiredValue) {
              isMeetingMinRequirements = false;
              break;
            }
          }
        }
        // drop this loadout if it didnt meet the min requirements
        if (!isMeetingMinRequirements) {
          continue;
        }

        seenCombinations.add(combinationKey);

        let targetValue = 0;
        let context = {
          finalStats,
          targetType,
          targetObject,
        };
        const loadoutArr = JSON.parse(JSON.stringify(loadout));
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
            finalStats, // give our stats, it will use this instead of the global state
            combinedEchoBuffs, // provide the echoes so we can exclude them if needed
            charResonanceChainsData.value,
            charBuffsData.value,
            talentData,
            baseHp.value,
            baseAtk.value,
            baseDef.value,
            weaponData.value,
            echoStats.value,
            customBuffs.value,
            teamBuffsData.value,
            chosenChar.value,
            Glacio.value,
            Fusion.value,
            Electro.value,
            Aero.value,
            Spectro.value,
            Havoc.value,
            finalStats.totalDef,
            finalStats.totalHp,
            finalStats.energyRegen,
            finalStats.totalAtk,
            finalStats.basicAttackDMGBonus,
            finalStats.heavyAttackDMGBonus,
            finalStats.resonanceSkillDMGBonus,
            finalStats.introSkillDMGBonus,
            finalStats.outroSkillDMGBonus,
            finalStats.resonanceLiberationDMGBonus,
            finalStats.echoDMGBonus,
            finalStats.healingBonus,
            finalStats.shieldBonus,
            finalStats.totalCritRate,
            finalStats.totalCritDMG,
            finalStats.DefIgnore,
            havocBaneStacks.value,
            finalStats.resistReduction,
            finalStats.totalDeepenEffect,
            characterLevel.value,
            enemyLevel.value,
            enemyResist.value,
            characters.value,
            character.value,
            enemyType.value,
          );
          targetValue = attacks?.[0]?.damage?.[damageTargetReference] ?? 0;
          context.attacks = attacks;
          // console.log(
          //   targetValue,
          //   attacks,
          //   JSON.parse(JSON.stringify(loadout)),
          //   finalStats,
          // );
          // console.log("==============================");
        } else if (targetType === "Rotation") {
          // TODO: This is a copy and paste of the original rotations processing
          // We should abstract this out

          const rotationInfo = {
            id: rotationData.id,
            name: rotationData.name,
            description: rotationData.description,
            duration: rotationData.duration ?? null,
            echo: rotationData.echo ?? null,
          };
          console.log("optimize:", rotationData.attacks, talentData);
          const attacks = processAttacks(
            rotationData.attacks, // process all attacks in this rotations
            null, // talentType = null since it will be figured out dynamically
            false, // hasNoTalentType = no, unless it's outro (TODO)
            true, // dynamicTalentType = yes, this will figure out the talent data for us
            false, // excludeDisabledAttacks = no, unless we need to (TODO)
            finalStats, // give our stats, it will use this instead of the global state
            combinedEchoBuffs, // provide the echoes so we can exclude them if needed
            charResonanceChainsData.value,
            charBuffsData.value,
            talentData,
            baseHp.value,
            baseAtk.value,
            baseDef.value,
            weaponData.value,
            echoStats.value,
            customBuffs.value,
            teamBuffsData.value,
            chosenChar.value,
            Glacio.value,
            Fusion.value,
            Electro.value,
            Aero.value,
            Spectro.value,
            Havoc.value,
            finalStats.totalDef,
            finalStats.totalHp,
            finalStats.energyRegen,
            finalStats.totalAtk,
            finalStats.basicAttackDMGBonus,
            finalStats.heavyAttackDMGBonus,
            finalStats.resonanceSkillDMGBonus,
            finalStats.introSkillDMGBonus,
            finalStats.outroSkillDMGBonus,
            finalStats.resonanceLiberationDMGBonus,
            finalStats.echoDMGBonus,
            finalStats.healingBonus,
            finalStats.shieldBonus,
            finalStats.totalCritRate,
            finalStats.totalCritDMG,
            finalStats.DefIgnore,
            havocBaneStacks.value,
            finalStats.resistReduction,
            finalStats.totalDeepenEffect,
            characterLevel.value,
            enemyLevel.value,
            enemyResist.value,
            characters.value,
            character.value,
            enemyType.value,
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
          //
          targetValue =
            rotationInfo.damageAggregation?.[damageTargetReference] ?? 0;
          context.attacks = rotationInfo;
          // console.log(rotationInfo);
        }
        processedCombos.value++;

        if (heap.length < topN) {
          heap.push({
            loadout: loadoutArr,
            targetValue,
            context,
            id: randomString(),
          });
          heap.sort((a, b) => a.targetValue - b.targetValue); // min at index 0
        } else if (targetValue > heap[0].targetValue) {
          heap[0] = {
            loadout: loadoutArr,
            targetValue,
            context,
            id: randomString(),
          };
          heap.sort((a, b) => a.targetValue - b.targetValue);
        }
      }

      return heap.sort((a, b) => b.targetValue - a.targetValue); // descending
    }

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
