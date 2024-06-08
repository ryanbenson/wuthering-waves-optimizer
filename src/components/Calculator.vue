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
        <li @click="changeScreen('talents')">T</li>
        <li @click="changeScreen('echoes')">E</li>
        <li @click="changeScreen('constellations')">CO</li>
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
            <label :for="field.name" class="form__label">{{
              field.label
            }}</label>
          </div>
        </div>
      </div>

      <div class="screen--character" v-show="curScreen === 'weapon'">
        <div class="data-input">
          <div class="form__group field">
            <select name="character" v-model="weapon" class="form__field">
              <option v-for="weap in weaponsList" :key="weap" :value="weap">
                {{ weap }}
              </option>
            </select>
            <label for="character" class="form__label">Weapon</label>
          </div>
          <div class="form__group field">
            <select name="character" v-model="weaponLevel" class="form__field">
              <option v-for="lvl in weaponLevelOptions" :key="lvl" :value="lvl">
                {{ lvl }}
              </option>
            </select>
            <label for="character" class="form__label">Weapon Level</label>
          </div>
        </div>
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
    </div>
    <div class="results">
      <h2>Stats:</h2>
      <div>Attack: {{ totalAtk }}</div>
      <div>HP: {{ totalHp }}</div>
      <div>Defense: {{ totalDef }}</div>
      <hr />
      <div>Damage:</div>
      <div v-for="damageInstance in allDamages" :key="damageInstance.key">
        <span>{{ damageInstance.label }}: </span>
        <span v-html="damageInstance.damage.detailedCalculation"></span> =
        <span>{{ damageInstance.damage.totalDamage }}</span>
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
import { getWeaponsByType, getWeaponByName } from "../weapons/weapons";
import CalculatorEchoes from "./CalculatorEchoes.vue";

interface FormData {
  [key: string]: number | string; // index signature
  enemyLevel: number;
  enemyResist: number;
  talent: string;
  critRate: number;
  critDamage: number;
  defIgnore: number;
  bonusTotalSkillDmg: number;
  bonusSpecificSkillDmg: number;
  bonusElementDmg: number;
  totalDeepenEffect: number;
  resistenceReduction: number;
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
  },
  setup() {
    const formData = reactive<FormData>({
      enemyLevel: 0,
      enemyResist: 0,
      talent: "0%",
      critRate: 0,
      critDamage: 0,
      defIgnore: 0,
      bonusTotalSkillDmg: 0,
      bonusSpecificSkillDmg: 0,
      bonusElementDmg: 0,
      totalDeepenEffect: 0,
      resistenceReduction: 0,
    });
    const talentData = reactive<TalentData>({
      basic: 1,
      skill: 1,
      forte: 1,
      liberation: 1,
      intro: 1,
    });

    watch(formData, async (updatedFormData: FormData) => {
      handleCalculation(updatedFormData);
    });

    const allDamages = ref([]);
    const chosenWeapon = reactive({});
    const chosenChar = reactive({});
    const echoStats = reactive({});
    const characterLevel = ref("1");
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
    const weaponsList = ref([]);
    const weapon = ref([]);
    const weaponLevel = ref("1");
    const weaponLevelOptions = ref(["1", "40", "50", "60", "70", "80", "90"]);
    const totalAtk = ref(0);
    const totalHp = ref(0);
    const totalDef = ref(0);

    charactersList.value = getCharactersAvailable();
    weaponsList.value = getWeaponsByType(weaponType.value);

    watch(weapon, async (weaponName: string) => {
      const weaponChosen = await getWeaponByName(weaponType.value, weaponName);
      chosenWeapon.value = weaponChosen;
      console.log(chosenWeapon.value.getWeaponDataByLevel(weaponLevel.value));
      calcCharStats();
    });
    watch(weaponLevel, async () => {
      console.log(chosenWeapon.value.getWeaponDataByLevel(weaponLevel.value));
      calcCharStats();
    });
    watch(character, async (charName) => {
      const chosen = await getCharByName(charName);
      chosenChar.value = chosen;
      calcCharStats();
    });
    watch(characterLevel, () => {
      calcCharStats();
    });
    watch(talentData, () => {
      calcCharStats();
    });

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

      let weaponModifer = null;
      let weaponModifierValue = 0;
      if (chosenChar.value) {
        const { hp, attack, defense } =
          chosenChar.value.getCharacterStatsByLevel(characterLevel.value);
        charHp = hp;
        charAtk = attack;
        charDef = defense;
      }
      if (chosenWeapon.value) {
        const { attack, modifier, modiferValue } =
          chosenWeapon.value.getWeaponDataByLevel(weaponLevel.value);
        weaponAtk = attack;
        weaponModifer = modifier;
        weaponModifierValue = modiferValue;
      }
      if (echoStats) {
        attackPercent += echoStats?.value?.ATK ?? 0;
        hpPercent += echoStats?.value?.HP ?? 0;
        defPercent += echoStats?.value?.DEF ?? 0;
        attackFlat += echoStats?.value?.ATK_FLAT ?? 0;
        hpFlat += echoStats?.value?.HP_FLAT ?? 0;
        defFlat += echoStats?.value?.DEF_FLAT ?? 0;
      }
      totalAtk.value =
        charAtk + weaponAtk * (1 + attackPercent / 100) + attackFlat;
      totalHp.value = charHp * (1 + hpPercent / 100) + hpFlat;
      totalDef.value = charDef * (1 + defPercent / 100) + defFlat;

      calcAllDamages();
    };

    const calcAllDamages = () => {
      const basicAttacks = chosenChar.value.basicAttacks?.attacks ?? [];
      const basicAttacksTalent = talentData.basic;
      const basicAttacksByTalent = [];
      basicAttacks.forEach((attack) => {
        const talent = attack.talents[basicAttacksTalent];
        const damage = calcDamage(
          characterLevel.value,
          formData.enemyLevel,
          formData.enemyResist,
          talent,
          totalAtk.value,
          formData.defIgnore,
          formData.bonusTotalSkillDmg,
          formData.bonusSpecificSkillDmg,
          formData.bonusElementDmg,
          formData.totalDeepenEffect,
          formData.resistenceReduction
        );
        const attackToUse = {
          key: attack.key,
          label: attack.label,
          talent,
          damage,
        };
        basicAttacksByTalent.push(attackToUse);
      });
      allDamages.value = basicAttacksByTalent;
      console.log(basicAttacksByTalent);
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
      { name: "talent", label: "Talent", type: "text", step: "" },
      { name: "critRate", label: "Crit Rate", type: "number", step: "0.01" },
      {
        name: "critDamage",
        label: "Crit Damage",
        type: "number",
        step: "0.01",
      },
      {
        name: "defIgnore",
        label: "Defense Ignore",
        type: "number",
        step: "0.01",
      },
      {
        name: "bonusTotalSkillDmg",
        label: "Bonus Total Skill Dmg",
        type: "number",
        step: ".1",
      },
      {
        name: "bonusSpecificSkillDmg",
        label: "Bonus Specific Skill Dmg",
        type: "number",
        step: "1",
      },
      {
        name: "bonusElementDmg",
        label: "Bonus Element Dmg",
        type: "number",
        step: "0.1",
      },
      {
        name: "totalDeepenEffect",
        label: "Total Deepen Effect",
        type: "number",
        step: "1",
      },
      {
        name: "resistenceReduction",
        label: "Resist Reduction",
        type: "number",
        step: "1",
      },
    ];

    const handleCalculation = (formData: FormData) => {
      // to do: use HP and DEF
      const dmg = calcDamage(
        characterLevel.value,
        formData.enemyLevel,
        formData.enemyResist,
        formData.talent,
        totalAtk.value,
        formData.defIgnore,
        formData.bonusTotalSkillDmg,
        formData.bonusSpecificSkillDmg,
        formData.bonusElementDmg,
        formData.totalDeepenEffect,
        formData.resistenceReduction
      );
      damage.value = dmg;
    };

    const updateStatsEchoes = (echoStatsGiven) => {
      echoStats.value = echoStatsGiven;
      calcCharStats();
    };

    const changeScreen = (screen: string) => {
      curScreen.value = screen;
    };

    return {
      formData,
      talentData,
      fields,
      damage,
      character,
      characterLevel,
      characterLevelOptions,
      charactersList,
      curScreen,
      changeScreen,
      weapon,
      weaponsList,
      weaponLevel,
      weaponLevelOptions,
      totalAtk,
      totalHp,
      totalDef,
      updateStatsEchoes,
      allDamages,
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
</style>
