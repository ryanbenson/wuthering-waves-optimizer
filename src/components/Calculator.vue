<template>
  <div class="calculations">
    <div class="calcations__nav">
      <ul>
        <li
          @click="changeScreen('character')"
          :class="{ active: curScreen === 'character' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png"
            class="icon"
            alt="Your Character" />
        </li>
        <li
          @click="changeScreen('weapon')"
          :class="{ active: curScreen === 'weapon' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_014.png"
            class="icon"
            alt="Your Weapon" />
        </li>
        <li
          @click="changeScreen('echoes')"
          :class="{ active: curScreen === 'echoes' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
            class="icon"
            alt="Your Echoes" />
        </li>
        <li
          @click="changeScreen('constellations')"
          :class="{ active: curScreen === 'constellations' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/constellations.png"
            class="icon"
            alt="Your Resonance Chains" />
        </li>
        <li
          @click="changeScreen('party')"
          :class="{ active: curScreen === 'party' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/team.png"
            class="icon"
            alt="Team Buffs" />
        </li>
        <li
          @click="changeScreen('rotations')"
          class="calcations__nav--icon-svg calcations__nav--rotations"
          :class="{ active: curScreen === 'rotations' }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"
              fill="#FFFFFF" />
          </svg>
        </li>
        <li
          @click="changeScreen('custom-buffs')"
          class="calcations__nav--icon-svg calcations__nav--custom-buffs"
          :class="{ active: curScreen === 'custom-buffs' }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
              fill="#FFFFFF" />
          </svg>
        </li>
        <li
          @click="changeScreen('enemy')"
          :class="{ active: curScreen === 'enemy' }">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png"
            class="icon"
            alt="Your Enemy" />
        </li>
        <li class="calculations__nav--results" @click="changeScreen('results')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/damages.png"
            class="icon"
            alt="Results" />
        </li>
      </ul>
    </div>
    <div class="calculations__screens">
      <div class="screen--character" v-show="curScreen === 'character'">
        <div>
          <div v-if="false" class="alert">Camellya & Lumi are now available!</div>
          <div class="character__selection">
            <div
              class="character__selection__avatar"
              :style="{
                backgroundImage: `url(https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png)`,
              }"></div>
            <div class="character__selection__form">
              <div class="character__selection__form--character">
                <select name="character" v-model="character">
                  <optgroup label="5 Star">
                    <option
                      v-for="char in charactersList.five"
                      :key="char.key"
                      :value="char.key">
                      {{ char.name }}
                    </option>
                  </optgroup>
                  <optgroup label="4 Star">
                    <option
                      v-for="char in charactersList.four"
                      :key="char.key"
                      :value="char.key">
                      {{ char.name }}
                    </option>
                  </optgroup>
                </select>
                <label for="character">Character</label>
              </div>
              <CalculatorCharacterLevel
                :character="character"
                @character-level-updated="
                  handleCharacterLevelUpdated
                "></CalculatorCharacterLevel>
            </div>
          </div>
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
              @updated-character-buffs="
                handleUpdatedCharacterBuffs
              "></CalculatorCharacterBuffs>
          </template>
        </div>
      </div>

      <div class="screen--character" v-show="curScreen === 'weapon'">
        <CalculatorWeapons
          v-if="character"
          :key="character"
          :character="character"
          @update-weapon="handleWeaponUpdated"
          :weapon-type="weaponType"></CalculatorWeapons>
      </div>

      <div class="screen--character" v-show="curScreen === 'echoes'">
        <CalculatorEchoes
          :key="character"
          :character="character"
          @update-stats="updateStatsEchoes"
          @updated-main-echo="handleUpdatedMainEcho"
          @updated-main-echo-rank="
            handleUpdatedMainEchoRank
          "></CalculatorEchoes>
      </div>

      <div class="screen--character" v-show="curScreen === 'constellations'">
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

      <div class="screen-character" v-show="curScreen === 'party'">
        <CalculatorPartyBuffs
          :key="character"
          :character="character"
          @updated-team-buffs="handleUpdatedTeamBuffs"></CalculatorPartyBuffs>
      </div>
      <div class="screen--enemy" v-show="curScreen === 'rotations'">
        <CalculatorRotations
          :key="character"
          :character="character"
          @updated-rotations="handleUpdatedRotations"></CalculatorRotations>
      </div>
      <div class="screen--enemy" v-show="curScreen === 'custom-buffs'">
        <CalculatorCustomBuffs
          :key="character"
          :character="character"
          @custom-buffs-updated="handleCustomBuffs"></CalculatorCustomBuffs>
      </div>
      <div class="screen--enemy" v-show="curScreen === 'enemy'">
        <CalculatorEnemy
          :key="character"
          :character="character"
          @updated-enemy-data="handleUpdatedEnemy"></CalculatorEnemy>
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
          :chosen-echo-name="mainEcho"></CalculatorDamages>
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
        :chosen-echo-name="mainEcho"></CalculatorDamages>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { calcDamage, calcHeal, calcShield } from "../calculator/calculator";
import {
  getCharactersAvailable,
  getCharByName,
} from "../characters/characters";
import CalculatorEchoes from "./CalculatorEchoes.vue";
import CalculatorWeapons from "./CalculatorWeapons.vue";
import CalculatorCharacterBuffs from "./CalculatorCharacterBuffs.vue";
import CalculatorResonanceChains from "./CalculatorResonanceChains.vue";
import CalculatorPartyBuffs from "./CalculatorPartyBuffs.vue";
import CalculatorTalents from "./CalculatorTalents.vue";
import CalculatorCharacterLevel from "./CalculatorCharacterLevel.vue";
import CalculatorEnemy from "./CalculatorEnemy.vue";
import CalculatorRotations from "./CalculatorRotations.vue";
import CalculatorCustomBuffs from "./CalculatorCustomBuffs.vue";
import CalculatorStats from "./CalculatorStats.vue";
import CalculatorDamages from "./CalculatorDamages.vue";
import { mainEchoesData, getEchoData } from "../echoes";
import { allEchoBuffs } from "../buffs";
import { useCharacterStore } from "../stores/character";

export default defineComponent({
  name: "Calculator",
  components: {
    CalculatorDamages,
    CalculatorEchoes,
    CalculatorEnemy,
    CalculatorWeapons,
    CalculatorCharacterBuffs,
    CalculatorCharacterLevel,
    CalculatorCustomBuffs,
    CalculatorPartyBuffs,
    CalculatorResonanceChains,
    CalculatorRotations,
    CalculatorStats,
    CalculatorTalents,
  },
  setup() {
    const characterStore = useCharacterStore();
    const { characters, activeCharacter } = storeToRefs(characterStore);
    const weaponData = reactive({});
    const weaponAtk = ref(0);
    const charBuffsData = reactive({});
    const teamBuffsData = reactive({});
    const charResonanceChainsData = reactive({});

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
    const charactersList = ref([]);
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
    const addEchoBuffs = (source, target) => {
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
      }
    };

    const calcCharStats = (returnValue = false, injectStats = null) => {
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
          Object.entries(weaponPassiveData).filter(([_, v]) => v != null)
        );

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

      if (echoStats) {
        addEchoBuffs(echoStats?.value, stats);
      }

      if (customBuffs.value) {
        addBuffs(customBuffs?.value, stats);
      }

      if (teamBuffsData.value) {
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
        // find any with "Additional" in it
        const additionalBasedBuffs = charBuffKeys.filter((buff) => {
          return buff.includes("AdditionalBase");
        });
        const charBuffDetails = chosenChar.value?.buffs ?? [];
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
              case "EnergyRegen":
                // TODO: Verify this. updated theory is all ER, not added ER
                base = 0;
                currentAmount = stats.energyRegen;
                break;
              case "CritRate":
                base = 0.05;
                currentAmount = stats.critRate;
                break;
              case "CritDMG":
                base = 1.5;
                currentAmount = stats.critDMG;
                break;
              default:
                base = 0;
                break;
            }
            const additionalAmount = currentAmount - base;
            const steps = Math.floor(
              additionalAmount / buffParams.modifierStep
            );
            let buffValue = steps * buffParams.modifierValue;
            if (buffValue > buffParams.maximumValue) {
              buffValue = buffParams.maximumValue;
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
            }
          }
        });
      }

      if (returnValue) {
        switch (returnValue) {
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

    const getElementDmgBonusByType = (element) => {
      let val = 0;
      switch (element) {
        case "Glacio":
          val = Glacio.value;
          break;
        case "Fusion":
          val = Fusion.value;
          break;
        case "Electro":
          val = Electro.value;
          break;
        case "Aero":
          val = Aero.value;
          break;
        case "Spectro":
          val = Spectro.value;
          break;
        case "Havoc":
          val = Havoc.value;
          break;
      }

      return val / 100;
    };

    const getDamageTypeBonusByType = (type) => {
      let val = 0;
      switch (type) {
        case "Basic":
          val = BasicAttackDMGBonus.value;
          break;
        case "Heavy":
          val = HeavyAttackDMGBonus.value;
          break;
        case "Skill":
          val = ResonanceSkillDMGBonus.value;
          break;
        case "Intro":
          val = IntroSkillDMGBonus.value;
          break;
        case "Outro":
          val = OutroSkillDMGBonus.value;
          break;
        case "Liberation":
          val = ResonanceLiberationDMGBonus.value;
          break;
        // do not divide this by 100
        case "Healing":
          return healingBonus.value;
        case "Shield":
          return shieldBonus.value;
      }

      return val / 100;
    };

    const getDamageValByAttr = (attribute = "attack") => {
      switch (attribute) {
        case "defense":
          return totalDef.value;
          break;
        case "hp":
          return totalHp.value;
          return;
        case "attack":
        default:
          return totalAtk.value;
          break;
      }
    };

    const calcAllDamages = () => {
      if (!chosenChar.value) return;

      let elementalDmgBonusDecimal = getElementDmgBonusByType(
        chosenChar.value?.basic?.element
      );

      const calculateAttackDamage = (
        attack,
        talentType,
        hasNoTalentLevel = false,
        hasDynamicTalent = false,
        count = 1
      ) => {
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
        const attackElement = chosenChar.value?.basic?.element;
        const atkDefHpVal = getDamageValByAttr(attack?.attribute);
        let totalSkillDmgBonus = getDamageTypeBonusByType(attackType);
        let talent;
        if (hasNoTalentLevel) {
          talent = attack.talent;
        } else if (hasDynamicTalent) {
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
              // outros have no talent tree, just a single value
              talent = attack.talent;
              break;
          }
        } else {
          talent = attack.talents[talentType];
        }
        const talentModifierAdd = charBuffsData.value?.[attack.key] ?? 0;
        const talentModifierAddFromResonanceChains =
          charResonanceChainsData.value?.[attack.key] ?? 0;
        const totalTalentModifierAdd =
          talentModifierAdd + talentModifierAddFromResonanceChains;
        const specificSkillDmgFromResonanceChains =
          charResonanceChainsData.value?.specificTalentBuffs?.[attack.key] ?? 0;
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
          charBuffsData.value?.specificTalentBuffs?.[attack.key] ?? 0;
        const specificSkillDmgFromEchoes =
          echoStats.value?.specificTalentBuffs?.[attack.key] ?? 0;
        const genericSkillDmgBonusResChain =
          charResonanceChainsData.value?.DMGBonus ?? 0;
        const genericSkillDmgBonusSelfBuff = charBuffsData.value?.DMGBonus ?? 0;
        const genericSkillDmgBonusEchoBuff = echoStats.value?.DMGBonus ?? 0;
        const genericSkillDmgBonusTeamEchoBuff =
          teamBuffsData.value?.DMGBonus ?? 0;
        const extraDefIgnoreResonanceChain =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DEFIgnore`
          ] ?? 0;
        const extraDefIgnoreCharBuff =
          charBuffsData.value?.specificTalentBuffs?.[
            `${attack.key}:DEFIgnore`
          ] ?? 0;
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
        let instanceDmgCritDMG = totalCritDMG.value + specificSkillExtraCritDMG;
        const talentModifierMultiply =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiply`
          ] ?? 0;
        const talentModifierMultiplySelfBuff =
          charBuffsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiply`
          ] ?? 0;
        const totalDefIgnore =
          DefIgnore.value +
          extraDefIgnoreResonanceChain +
          extraDefIgnoreCharBuff;
        let specificSkillDmg =
          specificSkillDmgFromResonanceChains +
          specificSkillDmgFromCharBuffs +
          genericSkillDmgBonusResChain +
          genericSkillDmgBonusSelfBuff +
          genericSkillDmgBonusTeamEchoBuff +
          specificSkillDmgFromEchoes +
          specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
          specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
          specificSkillDmgFromResonanceChainsBasedOnMaxDefVal +
          genericSkillDmgBonusEchoBuff / 100;
        const teamBuffResistShredForCharElement =
          teamBuffsData.value?.[`ResistShred:${attackElement}`] ?? 0;
        const resonanceChainResistShredForCharElement =
          charResonanceChainsData.value?.[`ResistShred:${attackElement}`] ?? 0;
        const baseResistReduction = ResistReduction.value ?? 0;
        const totalResistReduction =
          baseResistReduction +
          teamBuffResistShredForCharElement +
          resonanceChainResistShredForCharElement;
        // damage deepen
        const baseTotalDeepenEffect = TotalDeepenEffect.value;
        // so far damage deepen is from team buffs, add more later if needed
        // get element first, then any skill specific ones next, then add together
        // NOTE: all outro attacks cannot use the DMGDeepen:element|attackType
        // as they expire before the outro attacks occur. so ignore these
        // for outro attacks
        let teamBuffDmgDeepenForCharElement =
          teamBuffsData.value?.[`DMGDeepen:${attackElement}`] ?? 0;
        let teamBuffDmgDeepenForAttackType =
          teamBuffsData.value?.[`DMGDeepen:${attackType}`] ?? 0;
        let teamBuffDmgDeepenForCoordinatedAttack =
          teamBuffsData.value?.[`DMGDeepen:Coordinated`] ?? 0;
        let coordinatedDmgDeepenEffect = 0;
        if (attack?.subType === "Coordinated") {
          coordinatedDmgDeepenEffect = teamBuffDmgDeepenForCoordinatedAttack;
        }
        if (attackType === "Outro") {
          teamBuffDmgDeepenForCharElement = 0;
          teamBuffDmgDeepenForAttackType = 0;
        }
        let attackLevelDmgDeepen = attack.buffs?.DMGDeepen ?? 0;
        const totalDmgDeepen =
          baseTotalDeepenEffect +
          teamBuffDmgDeepenForCharElement +
          teamBuffDmgDeepenForAttackType +
          attackLevelDmgDeepen +
          coordinatedDmgDeepenEffect;
        let totalTalentModifierMultiply =
          talentModifierMultiply + talentModifierMultiplySelfBuff;
        // check for any modifiers that change the individual instance of atk/hp/def
        // re-calculate the base for this specific instance of damage
        let modifyBaseAtk =
          charBuffsData.value?.specificTalentBuffs?.[`${attack.key}:ATK`] ?? 0;
        let modifyBaseAtkResChain =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:ATK`
          ] ?? 0;
        modifyBaseAtk += modifyBaseAtkResChain;
        let modifyBaseHp =
          charBuffsData.value?.specificTalentBuffs?.[`${attack.key}:HP`] ?? 0;
        let modifyBaseDef =
          charBuffsData.value?.specificTalentBuffs?.[`${attack.key}:DEF`] ?? 0;
        let modifyBaseAtkFlat =
          charBuffsData.value?.specificTalentBuffs?.[
            `${attack.key}:ATK_FLAT`
          ] ?? 0;
        let modifyBaseHpFlat =
          charBuffsData.value?.specificTalentBuffs?.[`${attack.key}:HP_FLAT`] ??
          0;
        let modifyBaseDefFlat =
          charBuffsData.value?.specificTalentBuffs?.[
            `${attack.key}:DEF_FLAT`
          ] ?? 0;
        // if there are any attack-level buffs for atk, hp, or def (% or flat, upate them)
        if (attack?.buffs) {
          modifyBaseAtk += attack.buffs?.ATK ?? 0;
          modifyBaseHp += attack.buffs?.HP ?? 0;
          modifyBaseDef += attack.buffs?.DEF ?? 0;
          modifyBaseAtkFlat += attack.buffs?.ATK_FLAT ?? 0;
          modifyBaseHpFlat += attack.buffs?.HP_FLAT ?? 0;
          modifyBaseDefFlat += attack.buffs?.DEF_FLAT ?? 0;
        }
        let finalAtkDefHpVal = atkDefHpVal;
        if (modifyBaseAtk) {
          finalAtkDefHpVal = calcCharStats("ATK", {
            ATK: modifyBaseAtk,
            ATK_FLAT: modifyBaseAtkFlat,
          });
        }
        if (modifyBaseHp) {
          finalAtkDefHpVal = calcCharStats("HP", {
            HP: modifyBaseHp,
            HP_FLAT: modifyBaseHpFlat,
          });
        }
        if (modifyBaseDef) {
          finalAtkDefHpVal = calcCharStats("DEF", {
            DEF: modifyBaseDef,
            DEF_FLAT: modifyBaseDefFlat,
          });
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

        if (attackType === "Healing") {
          // apply any attack-level healing bonuses
          if (attack?.buffs) {
            totalSkillDmgBonus += attack.buffs?.HealingBonus ?? 0;
          }
          const specificSkillHealingBonus =
            charResonanceChainsData.value?.specificTalentBuffs?.[
              `${attack.key}:HealingBonus`
            ] ?? 0;
          totalSkillDmgBonus += specificSkillHealingBonus;
          const h = calcHeal(
            talent,
            finalAtkDefHpVal,
            totalSkillDmgBonus, // char stat of healing bonus
            specificSkillDmg, // any buffs for the skill
            totalTalentModifierAdd,
            totalTalentModifierMultiply,
            count
          );
          return h;
        }

        if (attackType === "Shield") {
          const h = calcShield(
            talent,
            finalAtkDefHpVal,
            totalSkillDmgBonus, // char stat of shield bonus
            specificSkillDmg, // any buffs for the skill
            totalTalentModifierAdd,
            totalTalentModifierMultiply,
            count
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
          count
        );
      };

      const processAttacks = (
        attacks,
        talentType,
        hasNoTalentLevel = false,
        dynamicTalentType = false
      ) => {
        return (
          (attacks ?? [])
            .map((attack) => {
              let isEnabled = true;
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
                  attack.requiresResonanceChain
                );
                // flag this attack as enabled or not based on the resonance chain
                isEnabled = isAttackEnabled;
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
                }
              } else {
                talent = attack.talents[talentType];
              }
              const hitCount = attack?.count ?? 1;
              return {
                key: attack.key,
                label: attack.label,
                talent,
                damage: calculateAttackDamage(
                  attack,
                  talentType,
                  hasNoTalentLevel,
                  dynamicTalentType,
                  hitCount
                ),
                isEnabled,
                type: attack.type,
                count: attack.count,
              };
            })
            // remove any attacks that are not enabled
            .filter((attack) => attack.isEnabled)
        );
      };

      const allDamagesData = {
        basicAttacks: processAttacks(
          chosenChar.value.basicAttacks?.attacks,
          talentData.basic
        ),
        skillAttacks: processAttacks(
          chosenChar.value.skillAttacks?.attacks,
          talentData.skill
        ),
        liberationAttacks: processAttacks(
          chosenChar.value.liberationAttacks?.attacks,
          talentData.liberation
        ),
        forteCircuitAttacks: processAttacks(
          chosenChar.value.forteCircuitAttacks?.attacks,
          talentData.forte
        ),
        introAttacks: processAttacks(
          chosenChar.value.introAttacks?.attacks,
          talentData.intro
        ),
        outroAttacks: processAttacks(
          chosenChar.value.outroAttacks?.attacks,
          talentData.intro,
          true // has no talent level
        ),
      };

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
          };
          const attacks = processAttacks(rotation.attacks, null, false, true);
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
      givenResonanceChainsData
    ) => {
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
        };
        const rotationActionInfo = [];
        rotation.actions.forEach((action) => {
          const actionKey = action.key;
          const actionType = action.type;
          const actionBuffs = action.buffs;
          const actionCount = action.count;
          const attacksList =
            chosenChar?.[`${actionType}Attacks`]?.attacks ?? [];
          const foundAction = attacksList.find((attack) => {
            return attack.key === actionKey;
          });
          if (foundAction) {
            const actionData = {
              ...foundAction,
              buffs: null,
              actionType,
              count: actionCount,
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

    const handleUpdatedMainEcho = (chosenEcho) => {
      mainEcho.value = chosenEcho;
      calcAllDamages();
    };

    const handleUpdatedMainEchoRank = (chosenEchoRank) => {
      mainEchoRank.value = chosenEchoRank;
      calcAllDamages();
    };

    return {
      allDamages,
      character,
      characters,
      characterLevel,
      charactersList,
      chosenChar,
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
    };
  },
});
</script>

<style lang="scss" scoped>
.calculations {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  height: 100vh;

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

$sidebar-background-color: #121212;
$active-sidebar-link-color: #22252e;
$hover-sidebar-link-color: $active-sidebar-link-color;
$active-link-color: #98d7ec;
$tooltip-background-color: $sidebar-background-color;
.calcations__nav {
  display: inline-block;
  min-height: 100vh;
  background-color: #000;
  float: left;
  flex-basis: 80px;
  width: 80px;
  z-index: 999;

  ul {
    text-align: center;
    color: white;
    padding: 0;
    margin: 0;

    li {
      height: 64px;
      max-height: 64px;
      cursor: pointer;
      transition: all ease-out 120ms;
      list-style-type: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 0;

      .icon {
        width: 48px;
        height: 48px;
      }

      &:hover,
      &.active {
        background-color: $active-sidebar-link-color;

        i {
          color: $active-link-color;
        }
      }
    }
  }
  @media (max-width: 768px) {
    display: block;
    height: 48px;
    background: #000;
    height: 48px;
    min-height: 48px;
    width: 100%;
    position: sticky;
    top: 48px;
    left: 0;

    ul {
      display: flex;
      flex-direction: row;

      li {
        height: 48px;
        max-height: 48px;
        cursor: pointer;
        transition: all ease-out 0.12s;
        list-style-type: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 0;
        flex-basis: 36px;
        padding: 0 0.25rem;

        .icon {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
.alert {
  background: #126a5a;
  padding: 0.25rem 0.5rem;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: white;

  &.alert--info {
    background: #12526a;
  }
}
.screen--character {
  padding-top: 1rem;
  overflow: hidden;
}
.character__selection {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  grid-gap: 2rem;
}
.character__selection__form--character {
  margin-bottom: 1rem;
}
.character__selection__form {
  label {
    margin-left: 0.5rem;
  }
}
.character__selection__avatar {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
.results {
  display: block !important;

  h4 {
    padding-left: 0.5rem;
  }
}
.calculations__nav--results {
  display: none !important;
}
@media (max-width: 768px) {
  .calculations__nav--results {
    display: flex !important;
  }
  .results {
    display: none !important;
  }
}
.calcations__nav--icon-svg {
  svg {
    width: 2rem;
    height: 2rem;

    @media (max-width: 768px) {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
</style>
