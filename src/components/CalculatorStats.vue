<template>
  <div class="results__stats">
    <h2 class="mt-0">Stats</h2>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />Attack</span
      >
      <span
        v-tooltip="{
          content: atkTooltipContent,
          html: true,
        }">{{ displayInt(totalAtk) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />HP</span
      >
      <span
        v-tooltip="{
          content: hpTooltipContent,
          html: true,
        }">{{ displayInt(totalHp) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />Defense</span
      >
      <span
        v-tooltip="{
          content: defTooltipContent,
          html: true,
        }">{{ displayInt(totalDef) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />Crit
        Rate</span
      >
      <span>{{ displayPercentage(totalCritRate * 100) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />Crit
        DMG</span
      >
      <span>{{ displayPercentage(totalCritDmg * 100) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />Energy
        Regen</span
      >
      <span>{{ displayPercentage(energyRegen * 100) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />Basic
        Attack DMG Bonus</span
      >
      <span>{{ displayPercentage(basicAttackDmgBonus) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />Heavy
        Attack DMG Bonus</span
      >
      <span>{{ displayPercentage(heavyAttackDmgBonus) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />Resonance
        Skill DMG Bonus</span
      >
      <span>{{ displayPercentage(resonanceSkillDmgBonus) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />Resonance
        Liberation DMG Bonus</span
      >
      <span>{{ displayPercentage(resonanceLiberationDmgBonus) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
          class="glacio--active" />Glacio DMG Bonus</span
      >
      <span>{{ displayPercentage(glacio) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
          class="fusion--active" />Fusion DMG Bonus</span
      >
      <span>{{ displayPercentage(fusion) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
          class="electro--active" />Electro DMG Bonus</span
      >
      <span>{{ displayPercentage(electro) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
          class="aero--active" />Aero DMG Bonus</span
      >
      <span>{{ displayPercentage(aero) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
          class="spectro--active" />Spectro DMG Bonus</span
      >
      <span>{{ displayPercentage(spectro) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
          class="havoc--active" />Havoc DMG Bonus</span
      >
      <span>{{ displayPercentage(havoc) }}</span>
    </div>
    <div>
      <span
        ><img
          src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />Healing
        Bonus</span
      >
      <span>{{ displayPercentage(healingBonus * 100) }}</span>
    </div>
  </div>
</template>

<script>
import { displayPercentage, displayInt } from "../utils/numbers";
import { getCharByName } from "../characters/characters";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    characterLevel: {
      type: String,
      required: true,
    },
    weaponAtk: {
      type: Number,
      required: true,
    },
    totalAtk: {
      type: Number,
      required: true,
    },
    totalAtkPercent: {
      type: Number,
      required: true,
    },
    totalAtkFlat: {
      type: Number,
      required: true,
    },
    totalHp: {
      type: Number,
      required: true,
    },
    totalHpPercent: {
      type: Number,
      required: true,
    },
    totalHpFlat: {
      type: Number,
      required: true,
    },
    totalDef: {
      type: Number,
      required: true,
    },
    totalDefPercent: {
      type: Number,
      required: true,
    },
    totalDefFlat: {
      type: Number,
      required: true,
    },
    totalCritRate: {
      type: Number,
      required: true,
    },
    totalCritDmg: {
      type: Number,
      required: true,
    },
    energyRegen: {
      type: Number,
      required: true,
    },
    basicAttackDmgBonus: {
      type: Number,
      required: true,
    },
    heavyAttackDmgBonus: {
      type: Number,
      required: true,
    },
    resonanceSkillDmgBonus: {
      type: Number,
      required: true,
    },
    resonanceLiberationDmgBonus: {
      type: Number,
      required: true,
    },
    glacio: {
      type: Number,
      required: true,
    },
    fusion: {
      type: Number,
      required: true,
    },
    electro: {
      type: Number,
      required: true,
    },
    aero: {
      type: Number,
      required: true,
    },
    spectro: {
      type: Number,
      required: true,
    },
    havoc: {
      type: Number,
      required: true,
    },
    healingBonus: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      baseHp: 0,
      baseAtk: 0,
      baseDef: 0,
    }
  },
  methods: {
    displayPercentage,
    displayInt,
  },
  computed: {
    hpTooltipContent() {
      return `<span class="Highlight">${this.baseHp}</span> * (1 + <span class="Highlight">${this.totalHpPercent}%</span>) + <span class="Highlight">${this.totalHpFlat}</span>`;
    },
    atkTooltipContent() {
      return `<span class="Highlight">(${this.baseAtk} + ${this.weaponAtk})</span> * (1 + <span class="Highlight">${this.totalAtkPercent}%</span>) + <span class="Highlight">${this.totalAtkFlat}</span>`;
    },
    defTooltipContent() {
      return `<span class="Highlight">${this.baseDef}</span> * (1 + <span class="Highlight">${this.totalDefPercent}%</span>) + <span class="Highlight">${this.totalDefFlat}</span>`;
    }
  },
  async mounted() {
    const chosenChar = await getCharByName(this.character);
    if (chosenChar) {
      const { hp, attack, defense } = chosenChar.getCharacterStatsByLevel(this.characterLevel);
      this.baseHp = hp;
      this.baseAtk = attack;
      this.baseDef = defense;
    }
  }
};
</script>

<style lang="scss" scoped>
.results__stats {
  div {
    display: flex;
    justify-content: space-between;
    max-width: 400px;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;

    span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
  div:nth-child(even) {
    background-color: transparent;
  }
  div:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);

    @media (prefers-color-scheme: light) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  span img {
    // make the white icons darker on light mode for stats
    @media (prefers-color-scheme: light) {
      filter: contrast(0.25);
    }
  }
}
</style>
