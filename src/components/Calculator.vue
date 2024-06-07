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
        <div class="data-input">choose your weapon</div>
      </div>
    </div>
    <div class="results">
      <h2>Damage:</h2>
      <h1>{{ damage }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { calcDamage } from "../calculator/calculator";
import { getCharactersAvailable } from "../characters/characters";

interface FormData {
  [key: string]: number | string; // index signature
  charLevel: number;
  enemyLevel: number;
  enemyResist: number;
  talent: string;
  critRate: number;
  critDamage: number;
  attack: number;
  hp: number;
  defense: number;
  defIgnore: number;
  bonusTotalSkillDmg: number;
  bonusSpecificSkillDmg: number;
  bonusElementDmg: number;
  totalDeepenEffect: number;
  resistenceReduction: number;
}

export default defineComponent({
  name: "Calculator",
  setup() {
    const formData = reactive<FormData>({
      charLevel: 0,
      enemyLevel: 0,
      enemyResist: 0,
      talent: "0%",
      critRate: 0,
      critDamage: 0,
      attack: 0,
      hp: 0,
      defense: 0,
      defIgnore: 0,
      bonusTotalSkillDmg: 0,
      bonusSpecificSkillDmg: 0,
      bonusElementDmg: 0,
      totalDeepenEffect: 0,
      resistenceReduction: 0,
    });

    watch(formData, async (updatedFormData: FormData) => {
      handleCalculation(updatedFormData);
    });

    const curScreen = ref("character");
    const damage = ref(0);
    const charactersList = ref([]);
    const character = ref("");
    charactersList.value = getCharactersAvailable();

    const fields = [
      {
        name: "charLevel",
        label: "Character Level",
        type: "number",
        step: "1",
      },
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
      { name: "attack", label: "Attack", type: "number", step: "1" },
      { name: "hp", label: "HP", type: "number", step: "1" },
      { name: "defense", label: "Defense", type: "number", step: "1" },
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
        formData.charLevel,
        formData.enemyLevel,
        formData.enemyResist,
        formData.talent,
        formData.attack,
        formData.defIgnore,
        formData.bonusTotalSkillDmg,
        formData.bonusSpecificSkillDmg,
        formData.bonusElementDmg,
        formData.totalDeepenEffect,
        formData.resistenceReduction
      );
      damage.value = dmg;
    };

    const changeScreen = (screen: string) => {
      curScreen.value = screen;
    };

    return {
      formData,
      fields,
      damage,
      character,
      charactersList,
      curScreen,
      changeScreen,
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
