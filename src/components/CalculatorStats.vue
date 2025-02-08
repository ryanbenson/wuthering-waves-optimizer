<template>
  <table class="calculator__stats table table-zebra">
    <tbody>
      <tr class="stat-atk">
        <td class="w-10">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
        </td>
        <td>Attack</td>
        <td
          class="text-right"
          v-tooltip="{
            content: atkTooltipContent,
            html: true,
          }">
          {{ displayInt(totalAtk) }}
        </td>
      </tr>
      <tr class="stat-hp">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
        </td>
        <td>HP</td>
        <td
          class="text-right"
          v-tooltip="{
            content: hpTooltipContent,
            html: true,
          }">
          {{ displayInt(totalHp) }}
        </td>
      </tr>
      <tr class="stat-def">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
        </td>
        <td>Defense</td>
        <td
          class="text-right"
          v-tooltip="{
            content: defTooltipContent,
            html: true,
          }">
          {{ displayInt(totalDef) }}
        </td>
      </tr>
      <tr class="stat-cr">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />
        </td>
        <td>Crit Rate</td>
        <td class="text-right">{{ displayPercentage(totalCritRate * 100) }}</td>
      </tr>
      <tr class="stat-cd">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />
        </td>
        <td>Crit DMG</td>
        <td class="text-right">{{ displayPercentage(totalCritDmg * 100) }}</td>
      </tr>
      <tr class="stat-er">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />
        </td>
        <td>Energy Regen</td>
        <td class="text-right">{{ displayPercentage(energyRegen * 100) }}</td>
      </tr>
      <tr class="stat-basic">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />
        </td>
        <td>Basic Attack DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(basicAttackDmgBonus) }}</td>
      </tr>
      <tr class="stat-heavy">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />
        </td>
        <td>Heavy Attack DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(heavyAttackDmgBonus) }}</td>
      </tr>
      <tr class="stat-skill">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />
        </td>
        <td>Resonance Skill DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(resonanceSkillDmgBonus) }}</td>
      </tr>
      <tr class="stat-liberation">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />
        </td>
        <td>Resonance Liberation DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(resonanceLiberationDmgBonus) }}</td>
      </tr>
      <tr class="stat-glacio">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
            class="glacio--active" />
        </td>
        <td>Glacio DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(glacio) }}</td>
      </tr>
      <tr class="stat-fusion">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
            class="fusion--active" />
        </td>
        <td>Fusion DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(fusion) }}</td>
      </tr>
      <tr class="stat-electro">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
            class="electro--active" />
        </td>
        <td>Electro DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(electro) }}</td>
      </tr>
      <tr class="stat-aero">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
            class="aero--active" />
        </td>
        <td>Aero DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(aero) }}</td>
      </tr>
      <tr class="stat-spectro">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
            class="spectro--active" />
        </td>
        <td>Spectro DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(spectro) }}</td>
      </tr>
      <tr class="stat-havoc">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
            class="havoc--active" />
        </td>
        <td>Havoc DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(havoc) }}</td>
      </tr>
      <tr class="stat-healing">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />
        </td>
        <td>Healing Bonus</td>
        <td class="text-right">{{ displayPercentage(healingBonus * 100) }}</td>
      </tr>
    </tbody>
  </table>
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
    };
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
      return `(<span class="Highlight">${this.baseAtk}</span> + <span class="Highlight">${this.weaponAtk}</span>) * (1 + <span class="Highlight">${this.totalAtkPercent}%</span>) + <span class="Highlight">${this.totalAtkFlat}</span>`;
    },
    defTooltipContent() {
      return `<span class="Highlight">${this.baseDef}</span> * (1 + <span class="Highlight">${this.totalDefPercent}%</span>) + <span class="Highlight">${this.totalDefFlat}</span>`;
    },
  },
  async mounted() {
    const chosenChar = await getCharByName(this.character);
    if (chosenChar) {
      const { hp, attack, defense } = chosenChar.getCharacterStatsByLevel(
        this.characterLevel
      );
      this.baseHp = hp;
      this.baseAtk = attack;
      this.baseDef = defense;
    }
  },
};
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  td img {
    filter: contrast(0);
  }
}
.calculator__stats {
  td {
    padding: 0.5rem;
    font-size: 16px;
  }
}
</style>
