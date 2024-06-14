<template>
  <div class="calculations">
    <div class="calcations__nav">
      <ul>
        <li @click="changeScreen('character')">
          <img src="/images/T_IconAchv_002.png" class="icon" />
        </li>
        <li @click="changeScreen('weapon')">
          <img src="/images/T_IconAchv_014.png" class="icon" />
        </li>
        <li @click="changeScreen('talents')">
          <img src="/images/talents.png" class="icon" />
        </li>
        <li @click="changeScreen('echoes')">
          <img src="/images/echoes.png" class="icon" />
        </li>
        <li @click="changeScreen('constellations')">
          <img src="/images/constellations.png" class="icon" />
        </li>
        <li @click="changeScreen('enemy')">
          <img src="/images/enemy.png" class="icon" />
        </li>
      </ul>
    </div>
    <div class="calculations__screens">
      <div class="screen--character" v-show="curScreen === 'character'">
        <div class="data-input">
          <div class="form__group field">
            <select name="character" v-model="character" class="form__field">
              <option v-for="char in charactersList" :key="char" :value="char">
                {{ char }}
              </option>
            </select>
            <label for="character" class="form__label">Character</label>
          </div>
          <div class="form__group field">
            <select
              name="characterLevel"
              v-model="characterLevel"
              class="form__field">
              <option
                v-for="lvl in characterLevelOptions"
                :key="lvl"
                :value="lvl">
                {{ lvl }}
              </option>
            </select>
            <label for="characterLevel" class="form__label"
              >Character Level</label
            >
          </div>
          <template v-if="chosenChar?.value?.buffs">
            <CalculatorCharacterBuffs
              :buffs="chosenChar?.value?.buffs"
              @updated-character-buffs="
                handleUpdatedCharacterBuffs
              "></CalculatorCharacterBuffs>
          </template>
        </div>
      </div>

      <div class="screen--character" v-show="curScreen === 'weapon'">
        <CalculatorWeapons
          @update-weapon="handleWeaponUpdated"
          :weapon-type="weaponType"></CalculatorWeapons>
      </div>

      <div class="screen--character" v-show="curScreen === 'talents'">
        <div class="data-input">
          <div class="form__group field">
            <input
              v-model="talentData.basic"
              name="talentBasic"
              type="number"
              min="1"
              max="10"
              steps="1"
              class="form__field" />
            <label for="talentBasic" class="form__label">Basic</label>
          </div>
          <div class="form__group field">
            <input
              v-model="talentData.skill"
              name="talentSkill"
              type="number"
              min="1"
              max="10"
              steps="1"
              class="form__field" />
            <label for="talentSkill" class="form__label">Skill</label>
          </div>
          <div class="form__group field">
            <input
              v-model="talentData.forte"
              name="talentForte"
              type="number"
              min="1"
              max="10"
              steps="1"
              class="form__field" />
            <label for="talentForte" class="form__label">Forte</label>
          </div>
          <div class="form__group field">
            <input
              v-model="talentData.liberation"
              name="talentLiberation"
              type="number"
              min="1"
              max="10"
              steps="1"
              class="form__field" />
            <label for="talentLiberation" class="form__label">Liberation</label>
          </div>
          <div class="form__group field">
            <input
              v-model="talentData.intro"
              name="talentIntro"
              type="number"
              min="1"
              max="10"
              steps="1"
              class="form__field" />
            <label for="talentIntro" class="form__label">Intro</label>
          </div>
        </div>
      </div>

      <div class="screen--character" v-show="curScreen === 'echoes'">
        <CalculatorEchoes @update-stats="updateStatsEchoes"></CalculatorEchoes>
      </div>

      <div class="screen--character" v-show="curScreen === 'constellations'">
        Constellations coming soon.
      </div>
      <div class="screen--enemy" v-show="curScreen === 'enemy'">
        <div
          v-for="field in fields"
          :key="field.name"
          class="form__group field">
          <input
            :id="field.name"
            :type="field.type"
            v-model="formData[field.name]"
            :step="field.step"
            class="form__field"
            :placeholder="field.name" />
          <label :for="field.name" class="form__label">{{ field.label }}</label>
        </div>
      </div>
    </div>
    <div class="results">
      <h2>Stats:</h2>
      <div>Attack: {{ totalAtk }}</div>
      <div>HP: {{ totalHp }}</div>
      <div>Defense: {{ totalDef }}</div>
      <div>Crit Rate: {{ totalCritRate * 100 }}%</div>
      <div>Crit DMG: {{ totalCritDMG * 100 }}%</div>
      <div>Basic Attack DMG Bonus: {{ BasicAttackDMGBonus }}%</div>
      <div>Heavy Attack DMG Bonus: {{ HeavyAttackDMGBonus }}%</div>
      <div>Resonance Skill DMG Bonus: {{ ResonanceSkillDMGBonus }}%</div>
      <div>
        Resonance Liberation DMG Bonus: {{ ResonanceLiberationDMGBonus }}%
      </div>
      <div>Glaccio DMG Bonus: {{ Glacio }}%</div>
      <div>Fusion DMG Bonus: {{ Fusion }}%</div>
      <div>Electro DMG Bonus: {{ Electro }}%</div>
      <div>Aero DMG Bonus: {{ Aero }}%</div>
      <div>Spectro DMG Bonus: {{ Spectro }}%</div>
      <div>Havoc DMG Bonus: {{ Havoc }}%</div>
      <div>Defense Ignore: {{ DefIgnore }}%</div>
      <div>
        Bonus Specific Skill DMG Bonus: {{ BonusSpecificSkillDMGBonus }}%
      </div>
      <div>Total Deepen Effect: {{ TotalDeepenEffect }}%</div>
      <div>Resist Reduction: {{ ResistReduction }}%</div>
      <hr />
      <h2>Damage</h2>
      <div class="calculation__damage__item">
        <span>Name</span>
        <span>Normal</span>
        <span>Average</span>
        <span>Crit</span>
      </div>
      <h4>Basic Attacks</h4>
      <div
        v-for="damageInstance in allDamages?.value?.basicAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item">
        <span>{{ damageInstance.label }}:</span>
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculation,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationAvg,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationCrit,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.critDamage) }}</span
        >
      </div>
      <h4>Skill Attacks</h4>
      <div
        v-for="damageInstance in allDamages?.value?.skillAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item">
        <span>{{ damageInstance.label }}: </span>
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculation,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationAvg,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationCrit,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.critDamage) }}</span
        >
      </div>
      <h4>Liberation Attacks</h4>
      <div
        v-for="damageInstance in allDamages?.value?.liberationAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item">
        <span>{{ damageInstance.label }}: </span>
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculation,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationAvg,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationCrit,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.critDamage) }}</span
        >
      </div>
      <h4>Forte Circuit Attacks</h4>
      <div
        v-for="damageInstance in allDamages?.value?.forteCircuitAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item">
        <span>{{ damageInstance.label }}: </span>
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculation,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationAvg,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationCrit,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.critDamage) }}</span
        >
      </div>
      <h4>Intro Attacks</h4>
      <div
        v-for="damageInstance in allDamages?.value?.introAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item">
        <span>{{ damageInstance.label }}: </span>
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculation,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationAvg,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
        >
        <span
          v-tooltip="{
            content: damageInstance.damage.detailedCalculationCrit,
            html: true,
          }"
          >{{ displayDamage(damageInstance.damage.critDamage) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { calcDamage } from "../calculator/calculator";
import {
  getCharactersAvailable,
  getCharByName,
} from "../characters/characters";
import CalculatorEchoes from "./CalculatorEchoes.vue";
import CalculatorWeapons from "./CalculatorWeapons.vue";
import CalculatorCharacterBuffs from "./CalculatorCharacterBuffs.vue";

interface FormData {
  [key: string]: number | string; // index signature
  enemyLevel: number;
  enemyResist: number;
}

interface TalentData {
  basic: number;
  skill: number;
  forte: number;
  liberation: number;
  intro: number;
}

export default defineComponent({
  name: "Calculator",
  components: {
    CalculatorEchoes,
    CalculatorWeapons,
    CalculatorCharacterBuffs,
  },
  setup() {
    const formData = reactive<FormData>({
      enemyLevel: 90,
      enemyResist: 0.1,
    });
    const talentData = reactive<TalentData>({
      basic: 10,
      skill: 10,
      forte: 10,
      liberation: 10,
      intro: 10,
    });
    const weaponData = reactive({});
    const charBuffsData = reactive({});

    watch(formData, async (updatedFormData: FormData) => {
      handleCalculation(updatedFormData);
    });

    const allDamages = reactive({});
    const chosenWeapon = reactive({});
    const chosenChar = reactive({});
    const echoStats = reactive({});
    const characterLevel = ref("90");
    const weaponType = ref("Swords");
    const curScreen = ref("character");
    const damage = ref(0);
    const charactersList = ref([]);
    const character = ref("");
    const characterLevelOptions = ref([
      "1",
      "20",
      "20+",
      "40",
      "40+",
      "50",
      "50+",
      "60",
      "60+",
      "70",
      "70+",
      "80",
      "80+",
      "90",
    ]);
    const totalAtk = ref(0);
    const totalHp = ref(0);
    const totalDef = ref(0);
    const totalCritRate = ref(0.05);
    const totalCritDMG = ref(0.5);
    const BasicAttackDMGBonus = ref(0);
    const HeavyAttackDMGBonus = ref(0);
    const ResonanceSkillDMGBonus = ref(0);
    const ResonanceLiberationDMGBonus = ref(0);
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

    charactersList.value = getCharactersAvailable();

    watch(character, async (charName) => {
      const chosen = await getCharByName(charName);
      chosenChar.value = chosen;
      // update the weapons if needed
      if (weaponType.value !== chosenChar.value?.basic?.weapon) {
        weaponType.value = chosenChar.value?.basic?.weapon ?? "Swords";
      }
      calcCharStats();
    });
    watch(characterLevel, () => {
      calcCharStats();
    });
    watch(talentData, () => {
      calcCharStats();
    });

    character.value = charactersList.value[0];

    const calcCharStats = () => {
      let charHp = 0;
      let charAtk = 0;
      let charDef = 0;
      let weaponAtk = 0;

      let attackPercent = 0;
      let hpPercent = 0;
      let defPercent = 0;
      let hpFlat = 0;
      let defFlat = 0;
      let attackFlat = 0;
      let critRate = 5;
      let critDMG = 150;
      let basicAttackDMGBonus = 0;
      let heavyAttackDMGBonus = 0;
      let resonanceSkillDMGBonus = 0;
      let resonanceLiberationDMGBonus = 0;
      let glacio = 0;
      let fusion = 0;
      let electro = 0;
      let aero = 0;
      let spectro = 0;
      let havoc = 0;
      let defIgnore = 0;
      let bonusSpecificSkillDMGBonus = 0;
      let totalDeepenEffect = 0;
      let resistReduction = 0;

      let weaponModifer = null;
      let weaponModifierValue = 0;
      let weaponPassiveData = {};
      if (chosenChar.value) {
        const { hp, attack, defense } =
          chosenChar.value.getCharacterStatsByLevel(characterLevel.value);
        charHp = hp;
        charAtk = attack;
        charDef = defense;
      }
      if (charBuffsData.value) {
        const charBuffInfo = charBuffsData.value;
        attackPercent += charBuffInfo?.ATK ? charBuffInfo?.ATK * 100 : 0;
        hpPercent += charBuffInfo?.HP ? charBuffInfo?.HP * 100 : 0;
        defPercent += charBuffInfo?.DEF ? charBuffInfo?.DEF * 100 : 0;
        attackFlat += charBuffInfo?.ATK_FLAT ?? 0;
        hpFlat += charBuffInfo?.HP_FLAT ?? 0;
        defFlat += charBuffInfo?.DEF_FLAT ?? 0;
        critRate += charBuffInfo?.CritRate ? charBuffInfo?.CritRate * 100 : 0;
        critDMG += charBuffInfo?.CritDMG ? charBuffInfo?.CritDMG * 100 : 0;
        basicAttackDMGBonus += charBuffInfo?.BasicAttackDMGBonus
          ? charBuffInfo?.BasicAttackDMGBonus * 100
          : 0;
        heavyAttackDMGBonus += charBuffInfo?.HeavyAttackDMGBonus
          ? charBuffInfo?.HeavyAttackDMGBonus * 100
          : 0;
        resonanceSkillDMGBonus += charBuffInfo?.ResonanceSkillDMGBonus
          ? charBuffInfo?.ResonanceSkillDMGBonus * 100
          : 0;
        resonanceLiberationDMGBonus += charBuffInfo?.ResonanceLiberationDMGBonus
          ? charBuffInfo?.ResonanceLiberationDMGBonus * 100
          : 0;
        glacio += charBuffInfo?.Glacio ? charBuffInfo?.Glacio * 100 : 0;
        fusion += charBuffInfo?.Fusion ? charBuffInfo?.Fusion * 100 : 0;
        electro += charBuffInfo?.Electro ? charBuffInfo?.Electro * 100 : 0;
        aero += charBuffInfo?.Aero ? charBuffInfo?.Aero * 100 : 0;
        spectro += charBuffInfo?.Spectro ? charBuffInfo?.Spectro * 100 : 0;
        havoc += charBuffInfo?.Havoc ? charBuffInfo?.Havoc * 100 : 0;
        defIgnore += charBuffInfo?.DEFIgnore
          ? charBuffInfo?.DEFIgnore * 100
          : 0;
        bonusSpecificSkillDMGBonus = charBuffInfo?.BonusSpecificSkillDMGBonus
          ? charBuffInfo?.BonusSpecificSkillDMGBonus * 100
          : 0;
        totalDeepenEffect = charBuffInfo?.TotalDeepenEffect
          ? charBuffInfo?.TotalDeepenEffect * 100
          : 0;
        resistReduction = charBuffInfo?.ResistReduction
          ? charBuffInfo?.ResistReduction * 100
          : 0;
      }
      if (weaponData.value) {
        weaponAtk = weaponData.value?.attack;
        weaponModifer = weaponData.value?.modifier;
        weaponModifierValue = weaponData.value?.modifierValue;
        weaponPassiveData = weaponData.value?.weaponPassiveStats ?? {};
        // remove empties from the passive data
        weaponPassiveData = Object.fromEntries(
          Object.entries(weaponPassiveData).filter(([_, v]) => v != null)
        );
        // add in the weapon passives
        attackPercent += weaponPassiveData?.ATK
          ? weaponPassiveData?.ATK * 100
          : 0;
        hpPercent += weaponPassiveData?.HP ? weaponPassiveData?.HP * 100 : 0;
        defPercent += weaponPassiveData?.DEF ? weaponPassiveData?.DEF * 100 : 0;
        attackFlat += weaponPassiveData?.ATK_FLAT ?? 0;
        hpFlat += weaponPassiveData?.HP_FLAT ?? 0;
        defFlat += weaponPassiveData?.DEF_FLAT ?? 0;
        critRate += weaponPassiveData?.CritRate
          ? weaponPassiveData?.CritRate * 100
          : 0;
        critDMG += weaponPassiveData?.CritDMG
          ? weaponPassiveData?.CritDMG * 100
          : 0;
        basicAttackDMGBonus += weaponPassiveData?.BasicAttackDMGBonus
          ? weaponPassiveData?.BasicAttackDMGBonus * 100
          : 0;
        heavyAttackDMGBonus += weaponPassiveData?.HeavyAttackDMGBonus
          ? weaponPassiveData?.HeavyAttackDMGBonus * 100
          : 0;
        resonanceSkillDMGBonus += weaponPassiveData?.ResonanceSkillDMGBonus
          ? weaponPassiveData?.ResonanceSkillDMGBonus * 100
          : 0;
        resonanceLiberationDMGBonus +=
          weaponPassiveData?.ResonanceLiberationDMGBonus
            ? weaponPassiveData?.ResonanceLiberationDMGBonus * 100
            : 0;
        glacio += weaponPassiveData?.Glacio
          ? weaponPassiveData?.Glacio * 100
          : 0;
        fusion += weaponPassiveData?.Fusion
          ? weaponPassiveData?.Fusion * 100
          : 0;
        electro += weaponPassiveData?.Electro
          ? weaponPassiveData?.Electro * 100
          : 0;
        aero += weaponPassiveData?.Aero ? weaponPassiveData?.Aero * 100 : 0;
        spectro += weaponPassiveData?.Spectro
          ? weaponPassiveData?.Spectro * 100
          : 0;
        havoc += weaponPassiveData?.Havoc ? weaponPassiveData?.Havoc * 100 : 0;
        defIgnore += weaponPassiveData?.DefIgnore
          ? weaponPassiveData?.DefIgnore * 100
          : 0;
        bonusSpecificSkillDMGBonus =
          weaponPassiveData?.BonusSpecificSkillDMGBonus
            ? weaponPassiveData?.BonusSpecificSkillDMGBonus * 100
            : 0;
        totalDeepenEffect = weaponPassiveData?.TotalDeepenEffect
          ? weaponPassiveData?.TotalDeepenEffect * 100
          : 0;
        resistReduction = weaponPassiveData?.ResistReduction
          ? weaponPassiveData?.ResistReduction * 100
          : 0;
        // TO DO: Skills / liberation / elemental / etc
        // weapon data is in decimal, but we're calcing in percentages for now
        switch (weaponModifer) {
          case "ATK":
            attackPercent += weaponModifierValue * 100;
            break;
          case "HP":
            hpPercent += weaponModifierValue * 100;
            break;
          case "DEF":
            defPercent += weaponModifierValue * 100;
            break;
          case "CritRate":
            critRate += weaponModifierValue * 100;
            break;
          case "CritDMG":
            critDMG += weaponModifierValue * 100;
            break;
        }
      }
      if (echoStats) {
        attackPercent += echoStats?.value?.ATK ?? 0;
        hpPercent += echoStats?.value?.HP ?? 0;
        defPercent += echoStats?.value?.DEF ?? 0;
        attackFlat += echoStats?.value?.ATK_FLAT ?? 0;
        hpFlat += echoStats?.value?.HP_FLAT ?? 0;
        defFlat += echoStats?.value?.DEF_FLAT ?? 0;
        critRate += echoStats?.value?.CritRate ?? 0;
        critDMG += echoStats?.value?.CritDMG ?? 0;
        basicAttackDMGBonus += echoStats?.value?.BasicAttackDMGBonus ?? 0;
        heavyAttackDMGBonus += echoStats?.value?.HeavyAttackDMGBonus ?? 0;
        resonanceSkillDMGBonus += echoStats?.value?.ResonanceSkillDMGBonus ?? 0;
        resonanceLiberationDMGBonus +=
          echoStats?.value?.ResonanceLiberationDMGBonus ?? 0;
        glacio += echoStats?.value?.Glacio ?? 0;
        fusion += echoStats?.value?.Fusion ?? 0;
        electro += echoStats?.value?.Electro ?? 0;
        aero += echoStats?.value?.Aero ?? 0;
        spectro += echoStats?.value?.Spectro ?? 0;
        havoc += echoStats?.value?.Havoc ?? 0;
      }
      totalAtk.value =
        (charAtk + weaponAtk) * (1 + attackPercent / 100) + attackFlat;
      totalHp.value = charHp * (1 + hpPercent / 100) + hpFlat;
      totalDef.value = charDef * (1 + defPercent / 100) + defFlat;
      totalCritRate.value = critRate / 100;
      totalCritDMG.value = critDMG / 100;
      BasicAttackDMGBonus.value = basicAttackDMGBonus;
      HeavyAttackDMGBonus.value = heavyAttackDMGBonus;
      ResonanceSkillDMGBonus.value = resonanceSkillDMGBonus;
      ResonanceLiberationDMGBonus.value = resonanceLiberationDMGBonus;
      Glacio.value = glacio;
      Fusion.value = fusion;
      Electro.value = electro;
      Aero.value = aero;
      Spectro.value = spectro;
      Havoc.value = havoc;
      DefIgnore.value = defIgnore / 100;
      BonusSpecificSkillDMGBonus.value = bonusSpecificSkillDMGBonus;
      TotalDeepenEffect.value = totalDeepenEffect;
      ResistReduction.value = resistReduction;

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
        case "Liberation":
          val = ResonanceLiberationDMGBonus.value;
          break;
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
      if (!chosenChar.value) {
        return;
      }
      const elementalDmgBonusDecimal = getElementDmgBonusByType(
        chosenChar.value?.basic?.element
      );
      const basicAttacks = chosenChar.value.basicAttacks?.attacks ?? [];
      const basicAttacksTalent = talentData.basic;
      const basicAttacksByTalent = [];
      basicAttacks.forEach((attack) => {
        const attackType = attack.type;
        const atkDefHpVal = getDamageValByAttr(attack?.attribute);
        const totalSkillDmgBonus = getDamageTypeBonusByType(attackType);
        const talent = attack.talents[basicAttacksTalent];
        const damage = calcDamage(
          characterLevel.value,
          formData.enemyLevel,
          formData.enemyResist,
          talent,
          atkDefHpVal,
          DefIgnore.value,
          totalSkillDmgBonus,
          BonusSpecificSkillDMGBonus.value,
          elementalDmgBonusDecimal,
          TotalDeepenEffect.value,
          ResistReduction.value,
          totalCritRate.value,
          totalCritDMG.value
        );
        const attackToUse = {
          key: attack.key,
          label: attack.label,
          talent,
          damage,
        };
        basicAttacksByTalent.push(attackToUse);
      });

      const skillAttacksByTalent = [];
      const skillAttacks = chosenChar.value.skillAttacks?.attacks ?? [];
      const skillAttacksTalent = talentData.skill;
      skillAttacks.forEach((attack) => {
        const attackType = attack.type;
        const atkDefHpVal = getDamageValByAttr(attack?.attribute);
        const totalSkillDmgBonus = getDamageTypeBonusByType(attackType);
        const talent = attack.talents[skillAttacksTalent];
        const damage = calcDamage(
          characterLevel.value,
          formData.enemyLevel,
          formData.enemyResist,
          talent,
          atkDefHpVal,
          DefIgnore.value,
          totalSkillDmgBonus,
          BonusSpecificSkillDMGBonus.value,
          elementalDmgBonusDecimal,
          TotalDeepenEffect.value,
          ResistReduction.value,
          totalCritRate.value,
          totalCritDMG.value
        );
        const attackToUse = {
          key: attack.key,
          label: attack.label,
          talent,
          damage,
        };
        skillAttacksByTalent.push(attackToUse);
      });

      const liberationAttacksByTalent = [];
      const liberationAttacks =
        chosenChar.value.liberationAttacks?.attacks ?? [];
      const liberationAttacksTalent = talentData.liberation;
      liberationAttacks.forEach((attack) => {
        const attackType = attack.type;
        const atkDefHpVal = getDamageValByAttr(attack?.attribute);
        const totalSkillDmgBonus = getDamageTypeBonusByType(attackType);
        const talent = attack.talents[liberationAttacksTalent];
        const damage = calcDamage(
          characterLevel.value,
          formData.enemyLevel,
          formData.enemyResist,
          talent,
          atkDefHpVal,
          DefIgnore.value,
          totalSkillDmgBonus,
          BonusSpecificSkillDMGBonus.value,
          elementalDmgBonusDecimal,
          TotalDeepenEffect.value,
          ResistReduction.value,
          totalCritRate.value,
          totalCritDMG.value
        );
        const attackToUse = {
          key: attack.key,
          label: attack.label,
          talent,
          damage,
        };
        liberationAttacksByTalent.push(attackToUse);
      });

      const forteCircuitAttacksByTalent = [];
      const forteCircuitAttacks =
        chosenChar.value.forteCircuitAttacks?.attacks ?? [];
      const forteCircuitAttacksTalent = talentData.forte;
      forteCircuitAttacks.forEach((attack) => {
        const attackType = attack.type;
        const atkDefHpVal = getDamageValByAttr(attack?.attribute);
        const totalSkillDmgBonus = getDamageTypeBonusByType(attackType);
        const talent = attack.talents[forteCircuitAttacksTalent];
        const damage = calcDamage(
          characterLevel.value,
          formData.enemyLevel,
          formData.enemyResist,
          talent,
          atkDefHpVal,
          DefIgnore.value,
          totalSkillDmgBonus,
          BonusSpecificSkillDMGBonus.value,
          elementalDmgBonusDecimal,
          TotalDeepenEffect.value,
          ResistReduction.value,
          totalCritRate.value,
          totalCritDMG.value
        );
        const attackToUse = {
          key: attack.key,
          label: attack.label,
          talent,
          damage,
        };
        forteCircuitAttacksByTalent.push(attackToUse);
      });

      const introAttacksByTalent = [];
      const introAttacks = chosenChar.value.introAttacks?.attacks ?? [];
      const introAttacksTalent = talentData.intro;
      introAttacks.forEach((attack) => {
        const attackType = attack.type;
        const atkDefHpVal = getDamageValByAttr(attack?.attribute);
        const totalSkillDmgBonus = getDamageTypeBonusByType(attackType);
        const talent = attack.talents[introAttacksTalent];
        const damage = calcDamage(
          characterLevel.value,
          formData.enemyLevel,
          formData.enemyResist,
          talent,
          atkDefHpVal,
          DefIgnore.value,
          totalSkillDmgBonus,
          BonusSpecificSkillDMGBonus.value,
          elementalDmgBonusDecimal,
          TotalDeepenEffect.value,
          ResistReduction.value,
          totalCritRate.value,
          totalCritDMG.value
        );
        const attackToUse = {
          key: attack.key,
          label: attack.label,
          talent,
          damage,
        };
        introAttacksByTalent.push(attackToUse);
      });
      allDamages.value = {
        basicAttacks: basicAttacksByTalent,
        skillAttacks: skillAttacksByTalent,
        liberationAttacks: liberationAttacksByTalent,
        forteCircuitAttacks: forteCircuitAttacksByTalent,
        introAttacks: introAttacksByTalent,
      };
      console.log(allDamages.value);
      // to do: add the rest
    };

    const fields = [
      { name: "enemyLevel", label: "Enemy Level", type: "number", step: "1" },
      {
        name: "enemyResist",
        label: "Enemy Resistance",
        type: "number",
        step: "0.1",
      },
    ];

    const handleCalculation = () => {
      calcAllDamages();
    };

    const handleWeaponUpdated = (givenWeaponData) => {
      weaponData.value = givenWeaponData;
      calcCharStats();
    };

    const handleUpdatedCharacterBuffs = (givenCharBuffsData) => {
      charBuffsData.value = givenCharBuffsData;
      calcCharStats();
    };

    const updateStatsEchoes = (echoStatsGiven) => {
      echoStats.value = echoStatsGiven;
      calcCharStats();
    };

    const changeScreen = (screen: string) => {
      curScreen.value = screen;
    };

    const displayDamage = (damage: number) => {
      return Math.ceil(damage);
    };

    return {
      allDamages,
      character,
      characterLevel,
      characterLevelOptions,
      charactersList,
      chosenChar,
      chosenWeapon,
      curScreen,
      changeScreen,
      damage,
      displayDamage,
      fields,
      formData,
      updateStatsEchoes,
      talentData,
      totalAtk,
      totalHp,
      totalDef,
      totalCritRate,
      totalCritDMG,
      weaponType,
      handleWeaponUpdated,
      handleUpdatedCharacterBuffs,
      BasicAttackDMGBonus,
      HeavyAttackDMGBonus,
      ResonanceSkillDMGBonus,
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
      // weaponLevelOptions,
    };
  },
});
</script>

<style lang="scss" scoped>
.calculations {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
}

.calculations__screens {
  padding: 2rem;
}

$primary: #fff;
$secondary: #ffd700;
$white: #fff;
$gray: #9b9b9b;
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #242424 inset;
  transition: background-color 5000s ease-in-out 0s;
}
.form__group {
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 50%;
}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 1px solid $gray;
  outline: 0;
  font-size: 1.3rem;
  color: $white;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ .form__label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
  }
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: $gray;
}

.form__field:focus {
  ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: $primary;
    font-weight: 700;
  }
  padding-bottom: 6px;
  font-weight: 700;
  border-width: 1px;
  border-image: linear-gradient(to right, $primary, $secondary);
  border-image-slice: 1;
}
/* reset input */
.form__field {
  &:required,
  &:invalid {
    box-shadow: none;
  }
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
}
.calculation__damage__item {
  display: grid;
  grid-template-columns: 1fr 100px 100px 100px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.character__stat__item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
