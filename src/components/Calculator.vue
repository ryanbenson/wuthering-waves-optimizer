<template>
  <div
    class="calculations"
    :class="{
      'calculations--full-width': curScreen === 'build-card',
      'calculations--live-bar': isLiveResultBarEnabled,
    }">
    <Nav
      cur-page="home"
      :sections="isLiveResultBarEnabled ? calculatorSections : null"
      :active-section="curScreen"
      @home="changeScreen('character')"
      @select-section="changeScreen">
      <template #mobile>
        <CalculatorMobileSubNav
          @change-screen="changeScreen"
          :screen="curScreen"
          :hide-resonance-chains="isLiveResultBarEnabled"></CalculatorMobileSubNav>
      </template>
      <template #default>
        <CalculatorSubNav
          :screen="curScreen"
          :hide-resonance-chains="isLiveResultBarEnabled"
          @change-screen="changeScreen"></CalculatorSubNav>
      </template>
    </Nav>
    <CalculatorCommandBar
      v-if="isLiveResultBarEnabled"
      :character="character"
      :character-rarity="chosenChar.value?.basic?.rarity"
      :character-name="chosenChar.value?.basic?.name"
      :character-level="characterLevel"
      :element="chosenChar?.value?.basic?.element"
      :weapon-type="weaponType"
      v-model:target="liveResultBarTarget"
      v-model:damage-type="liveResultBarDamageType"
      :stat-keys="liveResultBarStatKeys"
      :stats="liveResultBarStatValues"
      :build-stats="liveResultBarBuildStatValues"
      :all-damages="allDamages.value"
      :is-detail-open="isLiveResultDetailOpen"
      :is-loading="isLoading"
      :character-stances="!isLoading ? characterStances : []"
      @stat-selected="handleStatSelected"
      @updated-character-stance="handleUpdatedCharacterStance"
      @open-character-browser="openCharacterBrowser"
      @manage-builds="openManageBuilds"
      @character-level-updated="handleCharacterLevelUpdated"
      @toggle-detail="
        isLiveResultDetailOpen = !isLiveResultDetailOpen
      "></CalculatorCommandBar>
    <WorkspaceCharacterBrowser
      v-if="isLiveResultBarEnabled"
      :character="character"
      ref="characterBrowserRef"
      @character-browser:chosen-character="handleChosenCharacter" />
    <CalculatorManageBuilds
      v-if="isLiveResultBarEnabled"
      :character="character"
      ref="manageBuildsRef" />
    <div
      class="calculations__body"
      :class="{ 'calculations__body--legacy': !isLiveResultBarEnabled }">
    <div ref="screensRef" class="calculations__screens">
      <div class="screen--character" v-show="curScreen === 'character'">
        <div v-if="false" class="alert alert-success mb-6">
          Version 3.6 content is now available
        </div>

        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy layout, untouched. -->
        <div v-if="!isLiveResultBarEnabled">
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
          <CalculatorCharacterStance
            v-if="characterStances.length > 1 && isLoading === false"
            :key="`${characterBuildKey}-stance`"
            :character="character"
            :stances="characterStances"
            @updated-character-stance="handleUpdatedCharacterStance" />
          <template v-if="chosenChar?.value?.buffs && isLoading === false">
            <CalculatorCharacterBuffs
              :key="characterBuildKey"
              :character="character"
              :buffs="filteredCharacterBuffs"
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

        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) on: redesigned workspace. -->
        <CalculatorCharacterWorkspace
          v-else
          :key="characterBuildKey"
          :character="character"
          :weapon-type="weaponType"
          :buffs="filteredCharacterBuffs"
          :resonance-chain-buffs="filteredResonanceChains"
          :is-loading="isLoading"
          :attack-info="{
            basic: chosenChar?.value?.basicAttacks,
            skill: chosenChar?.value?.skillAttacks,
            forte: chosenChar?.value?.forteCircuitAttacks,
            liberation: chosenChar?.value?.liberationAttacks,
            intro: chosenChar?.value?.introAttacks,
          }"
          @character-talent-updated="handleCharacterTalentUpdated"
          @updated-character-buffs="handleUpdatedCharacterBuffs"
          @updated-character-resonance-chains="handleUpdatedCharacterResonanceChains"
          @change-screen="changeScreen" />
      </div>

      <div class="screen--weapon" v-show="curScreen === 'weapon'">
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy layout, untouched. -->
        <CalculatorWeapons
          v-if="character && !isLiveResultBarEnabled"
          :key="characterBuildKey"
          :character="character"
          @update-weapon="handleWeaponUpdated"
          :weapon-type="weaponType"
          :signature-weapon="chosenChar.value?.basic?.signatureWeapon"></CalculatorWeapons>
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) on: redesigned weapon workspace. -->
        <WorkspaceWeaponPanel
          v-else-if="character"
          :key="characterBuildKey"
          :character="character"
          :character-name="chosenChar.value?.basic?.name"
          :weapon-type="weaponType"
          :signature-weapon="chosenChar.value?.basic?.signatureWeapon"
          :suggested-weapons="chosenChar.value?.basic?.suggestedWeapons"
          @update-weapon="handleWeaponUpdated" />
      </div>

      <div class="screen--echoes" v-show="curScreen === 'echoes'">
        <CalculatorEchoes
          :key="characterBuildKey"
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
            :key="characterBuildKey"
            :character="character"
            :buffs="filteredResonanceChains"
            @updated-character-resonance-chains="
              handleUpdatedCharacterResonanceChains
            "></CalculatorResonanceChains>
        </template>
      </div>

      <div
        v-if="hasVisitedBuildCard"
        class="screen--build-card"
        v-show="curScreen === 'build-card'">
        <CalculatorBuildCard
          :key="characterBuildKey"
          :character="character"
          :character-level="characterLevel"
          :weapon-atk="weaponAtk"
          :chosen-char="chosenChar"></CalculatorBuildCard>
      </div>
      <div class="screen-party" v-show="curScreen === 'party'">
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy layout, untouched. -->
        <CalculatorPartyBuffs
          v-if="!isLiveResultBarEnabled"
          :key="characterBuildKey"
          :character="character"
          @updated-team-buffs="handleUpdatedTeamBuffs"></CalculatorPartyBuffs>
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) on: redesigned team buffs workspace, aligned with CalculatorCustomBuffsWorkspace.vue. -->
        <CalculatorTeamBuffsWorkspace
          v-else
          :key="characterBuildKey"
          :character="character"
          @updated-team-buffs="handleUpdatedTeamBuffs"></CalculatorTeamBuffsWorkspace>
      </div>
      <div class="screen--optimizer" v-if="curScreen === 'optimizer'">
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy layout, untouched. -->
        <CalculatorOptimizer
          v-if="!isLiveResultBarEnabled"
          :key="characterBuildKey"
          :character="character"
          :total-combos="totalCombos"
          :processed-combos="processedCombos"
          :optimizer-elapsed-ms="optimizerElapsedMs"
          :optimizer-no-possible-loadouts="optimizerNoPossibleLoadouts"
          :optimizer-empty-reason="optimizerEmptyReason"
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
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) on: redesigned setup/running/results workspace. -->
        <CalculatorOptimizerWorkspace
          v-else
          :key="characterBuildKey"
          :character="character"
          :total-combos="totalCombos"
          :processed-combos="processedCombos"
          :optimizer-elapsed-ms="optimizerElapsedMs"
          :optimizer-no-possible-loadouts="optimizerNoPossibleLoadouts"
          :optimizer-empty-reason="optimizerEmptyReason"
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
          :is-optimizer-running="isOptimizerRunning"
          :optimizer-search-complete="optimizerSearchComplete"
          :live-best-result="liveBestResult"
          @optimizer:optimize="handleOptimize"
          @optimizer:cancel="cancelOptimizer"
          @optimizer:edit-setup="optimizerResults = []"></CalculatorOptimizerWorkspace>
      </div>
      <div class="screen--rotations" v-show="curScreen === 'rotations'">
        <CalculatorRotations
          :key="characterBuildKey"
          :character="character"
          :all-damages="allDamages.value"
          @updated-rotations="handleUpdatedRotations"></CalculatorRotations>
      </div>
      <div class="screen--custom-buffs" v-show="curScreen === 'custom-buffs'">
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy layout, untouched. -->
        <CalculatorCustomBuffs
          v-if="!isLiveResultBarEnabled"
          :key="characterBuildKey"
          :character="character"
          @custom-buffs-updated="handleCustomBuffs"></CalculatorCustomBuffs>
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) on: redesigned, grouped + element-aware panel. -->
        <CalculatorCustomBuffsWorkspace
          v-else
          :key="characterBuildKey"
          :character="character"
          :character-element="characterElement"
          @custom-buffs-updated="handleCustomBuffs"></CalculatorCustomBuffsWorkspace>
      </div>
      <div class="screen--enemy" v-show="curScreen === 'enemy'">
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) off: legacy layout, untouched. -->
        <CalculatorEnemy
          v-if="!isLiveResultBarEnabled"
          :key="characterBuildKey"
          :character="character"
          :character-element="characterElement"
          @updated-enemy-data="handleUpdatedEnemy"
          :is-spectro-frazzle-enabled="isSpectroFrazzleEnabled"
          :is-aero-erosion-enabled="isAeroErosionEnabled"
          :is-havoc-bane-enabled="isHavocBaneEnabled"
          :is-fusion-burst-enabled="isFusionBurstEnabled"
          :is-electro-flare-enabled="isElectroFlareEnabled"
          :is-glacio-chafe-enabled="isGlacioChafeEnabled"></CalculatorEnemy>
        <!-- Labs flag "UI Overhaul 3.0" (liveResultBar) on: redesigned enemy workspace. -->
        <CalculatorEnemyWorkspace
          v-else
          :key="characterBuildKey"
          :character="character"
          :character-element="characterElement"
          @updated-enemy-data="handleUpdatedEnemy"
          :is-spectro-frazzle-enabled="isSpectroFrazzleEnabled"
          :is-aero-erosion-enabled="isAeroErosionEnabled"
          :is-fusion-burst-enabled="isFusionBurstEnabled"
          :is-electro-flare-enabled="isElectroFlareEnabled"
          :is-glacio-chafe-enabled="isGlacioChafeEnabled"></CalculatorEnemyWorkspace>
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
          :tune-break-boost="tuneBreakBoost"
          @stat-selected="handleStatSelected"></CalculatorStats>
        <CalculatorDamages
          :key="characterBuildKey"
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
    <CalculatorLiveResultDetail
      v-if="isLiveResultBarEnabled && isLiveResultDetailOpen"
      :character="character"
      :character-build-key="characterBuildKey"
      :weapon-atk="weaponAtk"
      :total-atk="totalAtk"
      :total-hp="totalHp"
      :total-def="totalDef"
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
      :tune-break-boost="tuneBreakBoost"
      :all-damages="allDamages"
      :rotations-list="rotationsList"
      :chosen-char="chosenChar"
      :chosen-echo-name="mainEcho"
      :is-missing-spectro-data="isMissingSpectroData"
      :is-missing-aero-erosion-data="isMissingAeroErosionData"
      :char-buffs-data="charBuffsData"
      :char-resonance-chains-data="charResonanceChainsData"
      :is-pinned="isLiveResultDetailPinned"
      :target="liveResultBarTarget"
      :default-pinned-stats="liveResultBarStatKeys"
      :build-stats="buildStatValues"
      @stat-selected="handleStatSelected"
      @selected-attack="handleSelectedAttack"
      @toggle-pin="
        isLiveResultDetailPinned = !isLiveResultDetailPinned
      "
      @close="isLiveResultDetailOpen = false"></CalculatorLiveResultDetail>
    </div>
    <div class="results" v-if="!isLiveResultBarEnabled">
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
        :tune-break-boost="tuneBreakBoost"
        @stat-selected="handleStatSelected"></CalculatorStats>
      <CalculatorDamages
        :key="characterBuildKey"
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
      :tune-break-boost="tuneBreakBoost"
      :base-hp="baseHp"
      :base-atk="baseAtk"
      :base-def="baseDef"
      :weapon-data="weaponData"
      :custom-buffs="customBuffs"
      :team-buffs-data="teamBuffsData"
      :char-buffs-data="charBuffsData"
      :char-resonance-chains-data="charResonanceChainsData"
      :echo-stats="echoStats"
      :echo-set-additional-base-buffs-data="echoSetAdditionalBaseBuffsData"
      :stat-split="selectedStatSplit"
      :attack-key="selectedAttackKey"
      :damage="selectedAttackDamage"
      :attack-label="selectedAttackLabel"
      @close="handleBreakdownClose"></CalculatorBreakdown>
  </Teleport>
</template>

<script lang="ts">
// @ts-nocheck
import {
  defineComponent,
  reactive,
  ref,
  watch,
  nextTick,
  computed,
  onUnmounted,
} from "vue";
import { storeToRefs } from "pinia";
import {
  calcDamage,
  calcHeal,
  calcShield,
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
import CalculatorTeamBuffsWorkspace from "./CalculatorTeamBuffsWorkspace.vue";
import CalculatorCharacterSelect from "./CalculatorCharacterSelect.vue";
import CalculatorCharacterStance from "./CalculatorCharacterStance.vue";
import CalculatorTalents from "./CalculatorTalents.vue";
import CalculatorCharacterWorkspace from "./characterWorkspace/CalculatorCharacterWorkspace.vue";
import WorkspaceWeaponPanel from "./characterWorkspace/WorkspaceWeaponPanel.vue";
import {
  filterBuffsForStance,
  resolveActiveStance,
} from "../calculator/stances";
import CalculatorEnemy from "./CalculatorEnemy.vue";
import CalculatorEnemyWorkspace from "./CalculatorEnemyWorkspace.vue";
import CalculatorRotations from "./CalculatorRotations.vue";
import CalculatorCustomBuffs from "./CalculatorCustomBuffs.vue";
import CalculatorCustomBuffsWorkspace from "./CalculatorCustomBuffsWorkspace.vue";
import CalculatorStats from "./CalculatorStats.vue";
import CalculatorBuildCard from "./CalculatorBuildCard.vue";
import CalculatorDamages from "./CalculatorDamages.vue";
import CalculatorOptimizer from "./CalculatorOptimizer.vue";
import CalculatorOptimizerWorkspace from "./optimizerWorkspace/CalculatorOptimizerWorkspace.vue";
import {
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
  computeTotalTuneBreakBoost,
} from "../calculator/stats";
import {
  processAttacks,
  calcDamages,
  getCalculationContext,
} from "../calculator/attacks";
import { buildOptimizerRotationData } from "../calculator/rotationData";
import { calcCharacterRotationDamage } from "../calculator/characterRotation";
import { characterRotationTiming, rotationLength } from "../calculator/rotationTiming";
import { echoFrames } from "../echoes/frames";
import type { OptimizerContext } from "../calculator/optimizer";
import {
  filterEchoesForOptimizer,
  resolveOptimizerEmptyReason,
  type OptimizerEmptyReason,
} from "../calculator/optimizer";
import { getSetsFromEchoes, getSetBonusEffects } from "../echoes/sets";
import { allEchoBuffs } from "../buffs";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import { computeBuildOnlyStats } from "../calculator/buildOnlyStats";
import {
  liveStatValueFor,
  resolveStatSelection,
  splitStat,
} from "../calculator/statSplit";
import { resolveOptimizerWorkerCount } from "../utils/optimizerPreferences";
import { trackEvent } from "../utils/analytics";
import { useRoute } from "vue-router";
import Nav from "./navigation/Nav.vue";
import CalculatorMobileSubNav from "./navigation/CalculatorMobileSubNav.vue";
import CalculatorSubNav from "./navigation/CalculatorSubNav.vue";
import { CALCULATOR_SECTIONS } from "./navigation/navSections";
import CalculatorBreakdown from "./CalculatorBreakdown.vue";
import CalculatorCommandBar from "./CalculatorCommandBar.vue";
import WorkspaceCharacterBrowser from "./characterWorkspace/WorkspaceCharacterBrowser.vue";
import CalculatorManageBuilds from "./CalculatorManageBuilds.vue";
import CalculatorLiveResultDetail from "./CalculatorLiveResultDetail.vue";
import {
  defaultLiveResultBarTarget,
  resolveLiveResultBarTarget,
  DEFAULT_LIVE_RESULT_BAR_STATS,
} from "../calculator/liveResultBar";
// Note: Workers are spawned by src/workers/optimizerRun.ts
import { runOptimizerWorkers } from "../workers/optimizerRun";
import { displayPercentage, displayInt } from "../utils/numbers";

export default defineComponent({
  name: "Calculator",
  props: {
    isBreakdownOpen: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CalculatorCharacterSelect,
    CalculatorCharacterStance,
    CalculatorCharacterWorkspace,
    CalculatorDamages,
    CalculatorEchoes,
    CalculatorEnemy,
    CalculatorEnemyWorkspace,
    CalculatorWeapons,
    WorkspaceWeaponPanel,
    CalculatorCharacterBuffs,
    CalculatorCustomBuffs,
    CalculatorCustomBuffsWorkspace,
    CalculatorPartyBuffs,
    CalculatorTeamBuffsWorkspace,
    CalculatorResonanceChains,
    CalculatorRotations,
    CalculatorStats,
    CalculatorBuildCard,
    CalculatorTalents,
    CalculatorOptimizer,
    CalculatorOptimizerWorkspace,
    CalculatorMobileSubNav,
    CalculatorSubNav,
    Nav,
    CalculatorBreakdown,
    CalculatorCommandBar,
    WorkspaceCharacterBrowser,
    CalculatorManageBuilds,
    CalculatorLiveResultDetail,
  },
  emits: ["stat-selected", "attack-selected", "breakdown-closed"],
  setup(props, { emit }) {
    const characterStore = useCharacterStore();
    const inventoryStore = useInventoryStore();
    const settingsStore = useSettingsStore();
    const { characters, activeCharacter } = storeToRefs(characterStore);
    // Every other screen below is always mounted (v-show only) so tab
    // switches are instant, but that means an always-hidden screen's DOM can
    // still collide with e.g. Cypress element-count assertions elsewhere
    // (see the .echo__item count bug this caused before build card was
    // gated). Mounting build card lazily on first visit, instead of eagerly
    // like the rest, sidesteps that without touching the established
    // always-mounted pattern everywhere else.
    const hasVisitedBuildCard = ref(false);
    const weaponData = reactive({});
    const weaponAtk = ref(0);
    const charBuffsData = reactive({});
    const echoSetAdditionalBaseBuffsData = ref({});
    // Self buffs as the stat pipeline actually summed them — charBuffsData is
    // the UI breakdown copy. Only read by the V3 build-vs-live split.
    const appliedCharBuffsData = ref({});
    const teamBuffsData = reactive({});
    const charResonanceChainsData = reactive({});
    const charactersList = ref([]);
    const allDamages = reactive({});
    // Guards against out-of-order writes when calcAllDamages is invoked again
    // (e.g. another buff toggle) before a slower in-flight call — one with an
    // overridden rotation action, which awaits a full rebuilt context —
    // finishes. Without this, a faster newer call's correct result could be
    // clobbered by a slower older call resolving after it.
    let damagesRequestId = 0;
    const chosenWeapon = reactive({});
    const chosenChar = reactive({});
    const characterStances = computed(
      () => chosenChar.value?.basic?.stances ?? [],
    );
    // Everything about a character's build (weapon, echoes, buffs, stance,
    // resonance chains, etc. — everything except characterLevel/talents) is
    // build-scoped (issue #278). Switching the active build swaps those
    // fields on the character record in place, so the child components that
    // read them once on mount need a full remount to pick up the new build's
    // data, the same way they already remount on a character switch.
    const activeBuildId = computed(
      () => characters.value?.[character.value]?.activeBuildId ?? "",
    );
    const characterBuildKey = computed(
      () => `${character.value}-${activeBuildId.value}`,
    );
    const activeStance = computed(() =>
      resolveActiveStance(
        characterStances.value,
        characters.value[character.value]?.activeStance,
        characters.value[character.value]?.buffs,
      ),
    );
    const filteredCharacterBuffs = computed(() =>
      filterBuffsForStance(chosenChar.value?.buffs ?? [], activeStance.value),
    );
    const filteredResonanceChains = computed(() =>
      filterBuffsForStance(
        chosenChar.value?.resonanceChains ?? [],
        activeStance.value,
      ),
    );
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

    // Live Result Bar (Labs flag) — see src/calculator/liveResultBar.ts.
    const isLiveResultBarEnabled = computed(
      () => isV3UiEnabled(settingsStore),
    );
    const liveResultBarTarget = ref(null);
    const liveResultBarDamageType = ref("Average");
    // Target + damage type persist per character (settings store,
    // localStorage) — restored below on every character switch, including
    // switching back to the same character after a reload. Skipped while a
    // character switch is still resolving its own default (see the
    // character watcher and calcAllDamages below), so an in-flight
    // auto-resolution never overwrites what the user actually chose.
    let isRestoringLiveResultBarPreference = false;
    function persistLiveResultBarPreference() {
      if (!character.value || isRestoringLiveResultBarPreference) return;
      settingsStore.addToConfig({
        liveResultBarByCharacter: {
          [character.value]: {
            target: liveResultBarTarget.value,
            damageType: liveResultBarDamageType.value,
          },
        },
      });
    }
    watch(liveResultBarTarget, persistLiveResultBarPreference);
    watch(liveResultBarDamageType, persistLiveResultBarPreference);

    // Pinning persists (settings store, localStorage) — reopen on load if
    // it was left pinned last time, same as it was when the page closed.
    const isLiveResultDetailOpen = ref(
      settingsStore.config?.liveResultBarPinned ?? false,
    );
    const isLiveResultDetailPinned = computed({
      get: () => settingsStore.config?.liveResultBarPinned ?? false,
      set: (value) => {
        settingsStore.addToConfig({ liveResultBarPinned: value });
        if (value) isLiveResultDetailOpen.value = true;
      },
    });
    // Character-browser / build-manage modals — mounted here (not inside
    // CalculatorCharacterWorkspace.vue) because CalculatorCommandBar.vue now
    // triggers them from every tab, not just the Character tab, since it
    // renders page-wide as a sibling of .calculations__body.
    const characterBrowserRef = ref(null);
    const manageBuildsRef = ref(null);
    function openCharacterBrowser() {
      characterBrowserRef.value?.triggerOpenModal();
    }
    function openManageBuilds() {
      manageBuildsRef.value?.triggerOpenModal();
    }
    function handleChosenCharacter(nextCharacter) {
      characterStore.ensureCharacterBuilds(nextCharacter);
      handleUpdatedCharacter(nextCharacter);
    }

    const liveResultBarStatKeys = computed(
      () => chosenChar.value?.basic?.liveResultBarStats ?? DEFAULT_LIVE_RESULT_BAR_STATS,
    );
    const liveResultBarStatValues = computed(() => ({
      totalHp: totalHp.value,
      totalAtk: totalAtk.value,
      totalDef: totalDef.value,
      totalCritRate: totalCritRate.value,
      totalCritDMG: totalCritDMG.value,
      energyRegen: energyRegen.value,
    }));


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
    const tuneBreakBoost = ref(0);
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
    const isFusionBurstEnabled = ref(false);
    const isElectroFlareEnabled = ref(false);
    const isGlacioChafeEnabled = ref(false);
    const havocBaneStacks = ref(0);
    const aeroErosionStacks = ref(0);
    const fusionBurstStacks = ref(0);
    const electroFlareStacks = ref(0);
    const electroRageStacks = ref(0);
    const glacioChafeStacks = ref(0);
    const strainStacks = ref(0);
    const isMissingAeroErosionData = ref(false);
    // component refs
    const characterBuffsRef = ref(null);
    // optimizer
    const totalCombos = ref(0);
    const processedCombos = ref(0);
    const optimizerNoPossibleLoadouts = ref(false);
    const optimizerEmptyReason = ref<OptimizerEmptyReason | null>(null);
    const optimizerResults = ref([]);
    const optimizationTargetType = ref("");
    const optimizationTargetObject = ref("");
    const optimizerElapsedMs = ref(0);
    // Optimizer Workspace (UI Overhaul 3.0 / liveResultBar flag) — additive
    // state consumed only by CalculatorOptimizerWorkspace.vue; the legacy
    // CalculatorOptimizer.vue ignores these.
    const isOptimizerRunning = ref(false);
    const optimizerSearchComplete = ref(false);
    const liveBestResult = ref<any>(null);
    let currentOptimizerCleanup: (() => void) | null = null;
    let optimizerTimerStartMs = 0;
    let optimizerTimerIntervalId: ReturnType<typeof setInterval> | null = null;

    const stopOptimizerTimer = () => {
      if (optimizerTimerIntervalId != null) {
        clearInterval(optimizerTimerIntervalId);
        optimizerTimerIntervalId = null;
      }
      if (optimizerTimerStartMs > 0) {
        optimizerElapsedMs.value = Math.max(
          0,
          performance.now() - optimizerTimerStartMs,
        );
      }
    };

    const startOptimizerTimer = () => {
      stopOptimizerTimer();
      optimizerElapsedMs.value = 0;
      optimizerTimerStartMs = performance.now();
      optimizerTimerIntervalId = setInterval(() => {
        optimizerElapsedMs.value = Math.max(
          0,
          performance.now() - optimizerTimerStartMs,
        );
      }, 250);
    };

    onUnmounted(() => {
      stopOptimizerTimer();
    });
    // base stats
    const baseHp = ref(0);
    const baseAtk = ref(0);
    const baseDef = ref(0);

    charactersList.value = getCharactersAvailable();

    watch(activeCharacter, (charName) => {
      if (charName && charName !== character.value) {
        character.value = charName;
      }
    });

    watch(character, async (charName) => {
      isLoading.value = true;
      // Restore this character's own remembered target/damage type if one
      // was saved before; otherwise null so the calcAllDamages pass below
      // resolves this character's declared default instead of keeping the
      // previous character's target. isRestoringLiveResultBarPreference
      // guards the persist watchers above from immediately writing this
      // restored (or nulled) value straight back as if the user had just
      // chosen it — harmless either way, but pointless churn otherwise.
      isRestoringLiveResultBarPreference = true;
      const savedPreference =
        settingsStore.config?.liveResultBarByCharacter?.[charName];
      liveResultBarTarget.value = savedPreference?.target ?? null;
      liveResultBarDamageType.value = savedPreference?.damageType ?? "Average";
      await nextTick();
      isRestoringLiveResultBarPreference = false;
      const chosen = await getCharByName(charName);
      chosenChar.value = chosen;
      // set the character in the store
      characterStore.setActiveCharacter(charName);
      characterStore.ensureCharacterBuilds(charName);
      const stances = chosen?.basic?.stances;
      if (stances?.length && !characters.value?.[charName]?.activeStance) {
        const resolved = resolveActiveStance(
          stances,
          undefined,
          characters.value?.[charName]?.buffs,
        );
        if (resolved) {
          characterStore.setCharacterData(charName, { activeStance: resolved });
        }
      }
      // update the character level
      characterLevel.value =
        characters.value?.[charName]?.characterLevel ?? "90";
      // resync talent levels — the talent sliders only emit on user input,
      // so without this the previous character's levels carry over
      Object.assign(talentData, readStoredTalents(charName));
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
      isFusionBurstEnabled.value = chosenChar?.value?.basic?.fusionBurst ?? false;
      isElectroFlareEnabled.value = chosenChar?.value?.basic?.electroFlare ?? false;
      isGlacioChafeEnabled.value =
        chosenChar?.value?.basic?.glacioChafe ?? false;
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
      optimizerNoPossibleLoadouts.value = false;
      optimizerEmptyReason.value = null;
      optimizerResults.value = [];
      isOptimizerRunning.value = false;
      optimizerSearchComplete.value = false;
      liveBestResult.value = null;
      stopOptimizerTimer();
      optimizerElapsedMs.value = 0;
      optimizerTimerStartMs = 0;
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

    const calcAllDamages = async () => {
      const requestId = ++damagesRequestId;
      const context = getCalculationContext(
        chosenChar.value,
        echoStats.value,
        teamBuffsData.value,
        talentData,
        isSpectroFrazzleEnabled.value,
        spectroFrazzleStacks.value,
        isAeroErosionEnabled.value,
        aeroErosionStacks.value,
        isFusionBurstEnabled.value,
        fusionBurstStacks.value,
        isElectroFlareEnabled.value,
        electroFlareStacks.value,
        electroRageStacks.value,
        isGlacioChafeEnabled.value,
        glacioChafeStacks.value,
        characterLevel.value,
        mainEcho.value,
        mainEchoRank.value,
        // Rotations are computed separately below via calcCharacterRotationDamage,
        // which supports per-action buff overrides — calcDamages' own
        // rotationsList branch (built for a single shared context) is unused here.
        [],
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
        strainStacks.value,
      );
      const damageData = calcDamages(context);
      // Bail if a newer calcAllDamages call has started since this one began
      // — its result (once it lands) should win, not this now-stale one.
      if (requestId !== damagesRequestId) return;
      // calcDamages doesn't populate `.rotations` (rotations are computed
      // separately below, awaited sequentially). Carry the previous value
      // forward across this reassignment instead of letting it go missing —
      // otherwise CalculatorDamages.vue's `v-if="... && allDamages.value?.rotations"`
      // sees `undefined` for the brief window before the loop below resolves,
      // unmounting and remounting the entire rotation section on every buff
      // toggle (visible as a scroll-position jump in the results panel).
      damageData.rotations = allDamages.value?.rotations;
      allDamages.value = damageData;

      if (rotationsList.value.length) {
        const enemyConfig = {
          enemyLevel: enemyLevel.value,
          enemyResist: enemyResist.value,
          enemyType: enemyType.value,
          spectroFrazzleStacks: spectroFrazzleStacks.value,
          aeroErosionStacks: aeroErosionStacks.value,
          havocBaneStacks: havocBaneStacks.value,
          fusionBurstStacks: fusionBurstStacks.value,
          electroFlareStacks: electroFlareStacks.value,
          electroRageStacks: electroRageStacks.value,
          glacioChafeStacks: glacioChafeStacks.value,
          strainStacks: strainStacks.value,
        };
        // Sequential rather than Promise.all: each call's fast path mutates
        // the shared `context.rotationsList` before reading it back, and
        // running rotations concurrently would risk them clobbering each
        // other's in-flight mutation of that shared object.
        const rotationResults = [];
        for (const rotation of rotationsList.value) {
          const result = await calcCharacterRotationDamage(
            rotation,
            { chosenChar: chosenChar.value, characterLevel: characterLevel.value, context },
            character.value,
            characters.value,
            enemyConfig,
            inventoryStore.echoes,
          );
          // Frame-data length (ADR 0048) for the results views' DPS; they
          // only show it while the frameTiming lab is on.
          const timing = characterRotationTiming(rotation.actions, chosenChar.value, echoFrames, rotation.mainEcho);
          rotationResults.push({ ...result, frameLength: timing ? rotationLength(timing) : null });
          // A newer call landed while this one was still awaiting a
          // per-action rebuilt context — stop and let it own the result
          // instead of finishing this stale computation.
          if (requestId !== damagesRequestId) return;
        }
        allDamages.value.rotations = rotationResults;
      } else {
        allDamages.value.rotations = [];
      }

      // Live Result Bar: fill in (or validate) this character's target once
      // its data is actually ready. Several other components' own initial
      // mounts can trigger a calcAllDamages pass before this character's
      // real attack data has loaded — allDamages.value briefly holds empty
      // attack-group arrays during that window, which would otherwise look
      // identical to "this target genuinely doesn't exist" and wrongly
      // clear a target that was just restored from a saved preference.
      // Gate on at least one populated group as a real "data is ready"
      // signal, and skip entirely (leaving whatever target is already set
      // untouched) until then.
      const hasComputedAttackData =
        (allDamages.value?.basicAttacks?.length ?? 0) > 0 ||
        (allDamages.value?.skillAttacks?.length ?? 0) > 0 ||
        (allDamages.value?.liberationAttacks?.length ?? 0) > 0;

      if (hasComputedAttackData) {
        // A no-op once a target is set and still resolves, so this can't
        // fight a target the user (or a restored preference) picked for
        // this character — except a target that no longer resolves at all
        // (e.g. a rotation default picked against CalculatorRotations' own
        // not-yet-remounted list right after a character switch, or a
        // saved preference referencing a since-deleted rotation), which
        // gets cleared and re-resolved. Rotation ids don't collide across
        // characters, so this can't mistake a genuinely different
        // character's rotation for a still-valid one.
        if (
          liveResultBarTarget.value !== null &&
          !resolveLiveResultBarTarget(
            liveResultBarTarget.value,
            allDamages.value,
            liveResultBarStatValues.value,
            liveResultBarDamageType.value,
          )
        ) {
          liveResultBarTarget.value = null;
        }
        if (liveResultBarTarget.value === null) {
          const declared = chosenChar.value?.basic?.liveResultBarDefaultTarget;
          liveResultBarTarget.value = defaultLiveResultBarTarget(
            declared,
            rotationsList.value,
            allDamages.value,
          );
        }
      }
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

    const readStoredTalents = (charName: string) => {
      const talents = characters.value?.[charName]?.talents;
      return {
        basic: talents?.basic ?? 10,
        skill: talents?.skill ?? 10,
        forte: talents?.forte ?? 10,
        liberation: talents?.liberation ?? 10,
        intro: talents?.intro ?? 10,
      };
    };

    const talentData = reactive(readStoredTalents(character.value));

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
      tuneBreakBoost.value = computeTotalTuneBreakBoost({
        baseTuneBreakBoost: chosenChar?.value?.basic?.tuneBreakBoost ?? 0,
        selfBuffs: charBuffsData?.value ?? charBuffsData ?? {},
        resonanceChainsBuffs:
          charResonanceChainsData?.value ?? charResonanceChainsData ?? {},
        teamBuffs: teamBuffsData?.value ?? teamBuffsData ?? {},
        echoStats: echoStats?.value ?? echoStats ?? {},
      });
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
      const activeCharacter = characterStore.getActiveCharacter ?? {};
      const echoSetBonus = activeCharacter.echoSetBonus ?? {};
      const result = calculateAllStats({
        baseHp: baseHp.value,
        baseAtk: baseAtk.value,
        baseDef: baseDef.value,
        weaponAtk: weaponData?.value?.attack ?? 0,
        weaponModifier: weaponData?.value?.modifier ?? null,
        weaponModifierValue: weaponData?.value?.modifierValue ?? 0,
        weaponPassiveData: weaponData?.value?.weaponPassiveStats ?? {},
        buffsConfig: activeCharacter.buffs ?? {},
        resonanceChainsConfig: activeCharacter.resonanceChains ?? {},
        customBuffs: customBuffs.value,
        teamBuffsData: teamBuffsData.value,
        echoStats: echoStats.value,
        buffsCharInfo: chosenChar.value?.buffs ?? [],
        resonanceChainsCharInfo: chosenChar.value?.resonanceChains ?? [],
        character: character?.value ?? "",
        talentData: talentData ?? {},
        activeStance: activeStance.value,
        ignoreBuffs: {},
        enemy: {
          havocBaneStacks: havocBaneStacks.value,
        },
        setBonusLabels: [
          echoSetBonus.setBonusOnePiece,
          echoSetBonus.setBonusOne,
          echoSetBonus.setBonusTwo,
        ],
        echoSetPassivesConfig: activeCharacter.echoSetPassives ?? {},
      });
      echoSetAdditionalBaseBuffsData.value =
        result.echoSetAdditionalBaseBuffsData ?? {};
      appliedCharBuffsData.value = result.appliedSelfBuffsData ?? {};
      return result;
    };

    const handleUpdatedCharacterStance = () => {
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
      calcAllDamages();
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

    // The screens scroll inside their own panel on desktop and with the page
    // on phones; a new section starts at the top of both.
    const screensRef = ref(null);
    const changeScreen = (screen: string) => {
      const isNewScreen = screen !== curScreen.value;
      curScreen.value = screen;
      if (screen === "build-card") {
        hasVisitedBuildCard.value = true;
      }
      if (isNewScreen) {
        nextTick(() => {
          screensRef.value?.scrollTo({ top: 0 });
          window.scrollTo({ top: 0 });
        });
      }
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
      fusionBurstStacks.value = data.fusionBurstStacks;
      electroFlareStacks.value = data.electroFlareStacks;
      electroRageStacks.value = data.electroRageStacks;
      glacioChafeStacks.value = data.glacioChafeStacks;
      strainStacks.value = data.strainStacks;
      const { finalStats, selfBuffsData, resonanceChainsBuffsData } =
        computeAllBuffsWithBreakdown();
      charBuffsData.value = selfBuffsData;
      charResonanceChainsData.value = resonanceChainsBuffsData;
      updateStats(finalStats);
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
      // Raw rotations (not pre-resolved into attacks) — calcCharacterRotationDamage
      // resolves each action itself, since actions with a per-action buff
      // override need their own freshly-rebuilt context rather than sharing
      // the one built below.
      rotationsList.value = data.map((rotation) => ({
        id: rotation.id,
        name: rotation.name,
        description: rotation.description,
        duration: rotation.duration ?? null,
        mainEcho: rotation.echo ?? null,
        mainEchoRank: rotation.echoRank ?? null,
        actions: rotation.actions,
      }));
      calcAllDamages();
    };

    const handleUpdatedCharacter = (chosenCharacter) => {
      character.value = chosenCharacter;
    };

    const clearBreakdownSelection = () => {
      selectedAttackKey.value = null;
      selectedAttackDamage.value = null;
      selectedStat.value = null;
      selectedAttackLabel.value = null;
    };

    const handleStatSelected = async (statName) => {
      clearBreakdownSelection();
      await nextTick(); // wait for the next tick to ensure the breakdown is actually closed/unmounted
      selectedStat.value = statName;
      // Emit to parent (HomeView) to open the drawer
      emit("stat-selected", statName);
    };

    const handleBreakdownClose = () => {
      clearBreakdownSelection();
      // Emit to parent (HomeView) to close the drawer
      emit("breakdown-closed");
    };

    watch(
      () => props.isBreakdownOpen,
      (isOpen) => {
        if (!isOpen) {
          clearBreakdownSelection();
        }
      },
    );

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
      loadoutFormat = "Any",
    ) => {
      const echoes = inventoryStore.echoes;
      const inventoryCount = Array.isArray(echoes) ? echoes.length : 0;
      const allowedSets = new Set(setFilters);
      const topN = 5;
      processedCombos.value = 0;
      totalCombos.value = 0;
      optimizerNoPossibleLoadouts.value = false;
      optimizerEmptyReason.value = null;
      optimizerResults.value = []; // Initialize as empty array instead of null
      optimizationTargetType.value = target.split(":")[0];
      optimizationTargetObject.value = target.split(":")[1] || "";
      isOptimizerRunning.value = true;
      optimizerSearchComplete.value = false;
      liveBestResult.value = null;
      startOptimizerTimer();

      // 1. Filter upfront
      const inventoryEchoes = Array.isArray(echoes) ? echoes : [];
      const setFilteredCount = allowedSets.size
        ? inventoryEchoes.filter((e) => allowedSets.has(e.echoSet)).length
        : inventoryEchoes.length;
      let filteredEchoes = filterEchoesForOptimizer(echoes) as typeof echoes;
      if (allowedSets.size) {
        filteredEchoes = filteredEchoes.filter((e) => allowedSets.has(e.echoSet));
      }
      if (ignoreOtherResonantorEchoes) {
        const echoIdsEquippedByOtherChars =
          inventoryStore.echoIdsEquippedByOtherChars(character.value);
        filteredEchoes = filteredEchoes.filter(
          (e) => !echoIdsEquippedByOtherChars.includes(e.echoId),
        );
      }

      const emptyReasonContext = {
        inventoryCount,
        setFilteredCount,
      };

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
          weaponPassiveDefs: weaponData.value?.weaponPassiveDefs ?? [],
          refinement: weaponData.value?.refinement ?? "1",
        },

        // Buffs
        charBuffsData: charBuffsData.value,
        charResonanceChainsData: charResonanceChainsData.value,
        teamBuffsData: teamBuffsData.value,
        customBuffs: customBuffs.value,
        echoSetPassivesConfig:
          characterStore.getActiveCharacter?.echoSetPassives ?? {},

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
        isFusionBurstEnabled: isFusionBurstEnabled.value,
        fusionBurstStacks: fusionBurstStacks.value,
        isElectroFlareEnabled: isElectroFlareEnabled.value,
        electroFlareStacks: electroFlareStacks.value,
        electroRageStacks: electroRageStacks.value,
        isGlacioChafeEnabled: isGlacioChafeEnabled.value,
        glacioChafeStacks: glacioChafeStacks.value,
        strainStacks: strainStacks.value,

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
        activeStance: activeStance.value,

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
          rotationData = buildOptimizerRotationData(
            { ...rotation, id: rotationId },
            chosenChar.value,
            characterLevel.value,
          );
        } else {
          console.error("Could not find rotation:", rotationId);
        }
      }

      // Use web workers for optimization
      optimizeWithWorkers(
        filteredEchoes,
        optimizerContext,
        topN,
        mainEchoes,
        minStats,
        echoSetPassiveBuffs,
        mainEchoStats,
        target,
        damageType,
        rotationData,
        loadoutFormat,
        emptyReasonContext,
      );
    };

    // Web worker-based optimization (the workers themselves are driven by
    // src/workers/optimizerRun.ts; this maps its progress onto this page's refs).
    const optimizeWithWorkers = (
      echoes: any[],
      context: any,
      topN: number,
      mainEchoKeys: string[],
      minStats: any[],
      echoSetPassiveBuffs: Record<string, any>,
      mainEchoStats: Record<string, any>,
      target: string,
      damageType: string,
      rotationData: any = null,
      loadoutFormat: string = "Any",
      emptyReasonContext: {
        inventoryCount: number;
        setFilteredCount: number;
      } = { inventoryCount: 0, setFilteredCount: 0 },
    ) => {
      const run = runOptimizerWorkers(
        {
          echoes,
          context,
          topN,
          mainEchoKeys,
          minStats,
          echoSetPassiveBuffs,
          mainEchoStats,
          target,
          damageType,
          rotationData,
          loadoutFormat,
          // Worker count is user-configurable (Settings → Preferences).
          workerCount: resolveOptimizerWorkerCount(
            (settingsStore.config as { optimizerWorkerCount?: unknown })
              ?.optimizerWorkerCount,
          ),
        },
        {
          onProcessed: (totalProcessed) => {
            processedCombos.value = totalProcessed;
          },
          onGenerated: (totalGenerated) => {
            totalCombos.value = totalGenerated;
          },
          onLiveBest: (best) => {
            liveBestResult.value = best;
          },
          onSearchComplete: ({ totalGenerated }) => {
            optimizerSearchComplete.value = true;
            optimizerNoPossibleLoadouts.value = totalGenerated === 0;
            if (totalGenerated === 0) {
              optimizerEmptyReason.value = resolveOptimizerEmptyReason({
                inventoryCount: emptyReasonContext.inventoryCount,
                setFilteredCount: emptyReasonContext.setFilteredCount,
                generatedCount: 0,
              });
              stopOptimizerTimer();
              isOptimizerRunning.value = false;
            }
          },
          onGeneratorFailed: () => {
            optimizerSearchComplete.value = true;
            stopOptimizerTimer();
            isOptimizerRunning.value = false;
          },
          onAborted: () => {
            stopOptimizerTimer();
            isOptimizerRunning.value = false;
          },
          onCleanedUp: () => {
            currentOptimizerCleanup = null;
          },
          onFinished: ({ results, totalProcessed, generatedCount }) => {
            optimizerResults.value = results;
            if (results.length === 0) {
              optimizerEmptyReason.value = resolveOptimizerEmptyReason({
                inventoryCount: emptyReasonContext.inventoryCount,
                setFilteredCount: emptyReasonContext.setFilteredCount,
                generatedCount,
              });
            } else {
              optimizerEmptyReason.value = null;
            }
            totalCombos.value = totalProcessed;
            stopOptimizerTimer();
            isOptimizerRunning.value = false;
            trackEvent("optimizer-run", { resultsFound: results.length > 0 });
          },
        },
      );
      currentOptimizerCleanup = run.cancel;
    };

    // Optimizer Workspace only (legacy CalculatorOptimizer.vue has no cancel
    // affordance). Tears down whichever run is currently active via the
    // cleanup closure that run's handleOptimize call captured, then resets
    // every optimizer ref to its idle state.
    const cancelOptimizer = () => {
      currentOptimizerCleanup?.();
      currentOptimizerCleanup = null;
      stopOptimizerTimer();
      isOptimizerRunning.value = false;
      optimizerResults.value = [];
      totalCombos.value = 0;
      processedCombos.value = 0;
      optimizerNoPossibleLoadouts.value = false;
      optimizerEmptyReason.value = null;
      optimizerSearchComplete.value = false;
      liveBestResult.value = null;
    };

    async function handleSelectedAttack(attackKey, damage, label) {
      clearBreakdownSelection();
      await nextTick();
      selectedAttackKey.value = attackKey;
      selectedAttackDamage.value = damage;
      selectedAttackLabel.value = label;
      // Emit to parent (HomeView) to open the drawer
      emit("attack-selected", attackKey);
    }

    function getRotationData(character, rotationId) {}

    // V3 build-vs-live split (ADR 0051): the character's build-only stats —
    // the same numbers the build card shows — recomputed from stored build
    // data whenever the build changes. Toggling an ordinary buff doesn't
    // change the build, so this stays off the per-toggle hot path.
    const buildOnlyStats = ref(null);
    let buildOnlyStatsRequestId = 0;
    const equippedEchoesForBuild = () => {
      const slots = characters.value?.[character.value]?.echoes ?? {};
      return Object.values(slots).map((slot) =>
        slot?.echoId ? (inventoryStore.getEchoById?.(slot.echoId) ?? null) : null,
      );
    };
    watch(
      () => [
        isLiveResultBarEnabled.value,
        character.value,
        characters.value?.[character.value],
        equippedEchoesForBuild(),
      ],
      async ([isEnabled, nextCharacter]) => {
        const requestId = ++buildOnlyStatsRequestId;
        if (!isEnabled || !nextCharacter) {
          buildOnlyStats.value = null;
          return;
        }
        try {
          const built = await computeBuildOnlyStats(
            nextCharacter,
            characters.value,
            inventoryStore.echoes,
          );
          // A newer build change (or character switch) superseded this one.
          if (requestId !== buildOnlyStatsRequestId) return;
          buildOnlyStats.value = { character: nextCharacter, ...built };
        } catch (error) {
          if (requestId !== buildOnlyStatsRequestId) return;
          console.error("Failed to compute build-only stats", error);
          buildOnlyStats.value = null;
        }
      },
      { immediate: true, deep: true },
    );
    // Never show one character's build against another's live stats.
    const currentBuildOnlyStats = computed(() =>
      buildOnlyStats.value?.character === character.value
        ? buildOnlyStats.value
        : null,
    );
    const buildStatValues = computed(
      () => currentBuildOnlyStats.value?.values ?? null,
    );
    const liveResultBarBuildStatValues = computed(() => {
      const values = buildStatValues.value;
      if (!values) return null;
      return {
        totalHp: values.totalHp,
        totalAtk: values.totalAtk,
        totalDef: values.totalDef,
        totalCritRate: values.totalCritRate,
        totalCritDMG: values.totalCritDmg,
        energyRegen: values.energyRegen,
      };
    });
    const liveStatValues = computed(() => ({
      totalHp: totalHp.value,
      totalAtk: totalAtk.value,
      totalDef: totalDef.value,
      totalCritRate: totalCritRate.value,
      totalCritDmg: totalCritDMG.value,
      energyRegen: energyRegen.value,
      basicAttackDmgBonus: BasicAttackDMGBonus.value,
      heavyAttackDmgBonus: HeavyAttackDMGBonus.value,
      resonanceSkillDmgBonus: ResonanceSkillDMGBonus.value,
      resonanceLiberationDmgBonus: ResonanceLiberationDMGBonus.value,
      healingBonus: healingBonus.value,
      tuneBreakBoost: tuneBreakBoost.value,
      glacio: Glacio.value,
      fusion: Fusion.value,
      electro: Electro.value,
      aero: Aero.value,
      spectro: Spectro.value,
      havoc: Havoc.value,
    }));
    // Same inputs computeAllBuffsWithBreakdown/updateStats used for the live
    // numbers, in the shape statSplit.ts attributes per source.
    const liveStatSourceInputs = () => ({
      baseHp: baseHp.value,
      baseAtk: baseAtk.value,
      baseDef: baseDef.value,
      weaponData: weaponData?.value ?? {},
      selfBuffs: appliedCharBuffsData.value ?? {},
      resonanceChains: charResonanceChainsData?.value ?? {},
      echoStats: echoStats?.value ?? {},
      echoSetAdditionalBase: echoSetAdditionalBaseBuffsData.value ?? {},
      customBuffs: customBuffs?.value ?? {},
      teamBuffs: teamBuffsData?.value ?? {},
      tuneBreakBoost: {
        base: chosenChar?.value?.basic?.tuneBreakBoost ?? 0,
        selfBuffs: charBuffsData?.value?.tuneBreakBoost ?? 0,
        resonanceChains: charResonanceChainsData?.value?.tuneBreakBoost ?? 0,
        teamBuffs: teamBuffsData?.value?.tuneBreakBoost ?? 0,
        echoes: echoStats?.value?.tuneBreakBoost ?? 0,
      },
    });
    // Only built while a stat detail is open in V3 — classic keeps its own
    // breakdown untouched.
    const selectedStatSplit = computed(() => {
      if (!isLiveResultBarEnabled.value || !selectedStat.value) return null;
      const build = currentBuildOnlyStats.value;
      const selection = resolveStatSelection(selectedStat.value);
      if (!build || !selection) return null;
      const { statKey, element } = selection;
      return splitStat(
        statKey,
        {
          build: {
            inputs: build.inputs,
            value: liveStatValueFor(build.values, statKey, element),
          },
          live: {
            inputs: liveStatSourceInputs(),
            value: liveStatValueFor(liveStatValues.value, statKey, element),
          },
        },
        element,
      );
    });

    return {
      allDamages,
      buildStatValues,
      liveResultBarBuildStatValues,
      selectedStatSplit,
      calculatorSections: CALCULATOR_SECTIONS,
      character,
      characters,
      characterLevel,
      chosenChar,
      characterStances,
      activeBuildId,
      characterBuildKey,
      activeStance,
      filteredCharacterBuffs,
      filteredResonanceChains,
      charBuffsData,
      echoSetAdditionalBaseBuffsData,
      charResonanceChainsData,
      chosenWeapon,
      rotationsList,
      curScreen,
      changeScreen,
      screensRef,
      hasVisitedBuildCard,
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
      handleUpdatedCharacterStance,
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
      isFusionBurstEnabled,
      isElectroFlareEnabled,
      isGlacioChafeEnabled,
      // component refs
      characterBuffsRef,
      // optimizer stuff
      totalCombos,
      processedCombos,
      optimizerElapsedMs,
      optimizerNoPossibleLoadouts,
      optimizerEmptyReason,
      optimizerResults,
      optimizationTargetType,
      optimizationTargetObject,
      // optimizer workspace (liveResultBar flag) only
      isOptimizerRunning,
      optimizerSearchComplete,
      liveBestResult,
      cancelOptimizer,
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
      tuneBreakBoost,
      strainStacks,
      // Live Result Bar (Labs flag)
      isLiveResultBarEnabled,
      liveResultBarTarget,
      liveResultBarDamageType,
      isLiveResultDetailOpen,
      isLiveResultDetailPinned,
      liveResultBarStatKeys,
      liveResultBarStatValues,
      characterBrowserRef,
      manageBuildsRef,
      openCharacterBrowser,
      openManageBuilds,
      handleChosenCharacter,
    };
  },
});
</script>

<style lang="scss" scoped>
.calculations {
  display: grid;
  // grid-template-columns: 80px 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  // Must mirror AppLayout.vue's .contain height calc, which subtracts the
  // live AppUpdateBanner height via --announce-banner-h (0px when the
  // banner is hidden/unmounted). Falling out of sync here overflows the
  // parent and clips the bottom of both panels whenever the banner shows.
  height: calc(100vh - var(--nav-h) - var(--nav-bottom-h) - var(--announce-banner-h, 0px));

  @media (max-width: 768px) {
    display: block;
    height: auto;
  }
}

// Live Result Bar layout (Labs flag): the bar takes its own row above the
// content, which itself becomes a single grid row instead of a column pair
// — .calculations__body then decides content-vs-detail split with flex,
// since that's an auto/fixed-width pair rather than the even 1fr/1fr split
// the legacy layout wants.
.calculations--live-bar {
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;

  @media (max-width: 768px) {
    display: block;
  }
}

.calculations__body {
  display: flex;
  min-height: 0; // let children scroll internally instead of the grid row growing to fit them
  overflow: hidden;

  @media (max-width: 768px) {
    display: block;
  }
}
// Off by default: the legacy (flag-disabled) layout needs .calculations__screens
// to behave as if it were still a direct child of the outer grid, unchanged.
.calculations__body--legacy {
  display: contents;
}

.calculations__screens {
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  // Only takes effect inside .calculations__body's flex layout (live-bar
  // enabled) — inert as a grid item in the legacy display:contents case.
  flex: 1;
  min-width: 0;

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

.calculations--full-width {
  grid-template-columns: 1fr;

  .results {
    display: none !important;
  }
}
</style>
