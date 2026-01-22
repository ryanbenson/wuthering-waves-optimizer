<template>
  <table class="calculator__stats table table-zebra">
    <tbody>
      <tr
        class="stat-atk"
        @click="$emit('stat-selected', 'ATK')"
        style="cursor: pointer">
        <td class="w-10">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
        </td>
        <td class="stat-name">ATK</td>
        <td
          class="text-right"
          v-tooltip="{
            content: atkTooltipContent,
            html: true,
          }">
          {{ displayInt(totalAtk) }}
        </td>
      </tr>
      <tr
        class="stat-hp"
        @click="$emit('stat-selected', 'HP')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
        </td>
        <td class="stat-name">HP</td>
        <td
          class="text-right"
          v-tooltip="{
            content: hpTooltipContent,
            html: true,
          }">
          {{ displayInt(totalHp) }}
        </td>
      </tr>
      <tr
        class="stat-def"
        @click="$emit('stat-selected', 'DEF')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
        </td>
        <td class="stat-name">DEF</td>
        <td
          class="text-right"
          v-tooltip="{
            content: defTooltipContent,
            html: true,
          }">
          {{ displayInt(totalDef) }}
        </td>
      </tr>
      <tr
        class="stat-cr"
        @click="$emit('stat-selected', 'Crit Rate')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />
        </td>
        <td class="stat-name">Crit Rate</td>
        <td class="text-right">{{ displayPercentage(totalCritRate * 100) }}</td>
      </tr>
      <tr
        class="stat-cd"
        @click="$emit('stat-selected', 'Crit DMG')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />
        </td>
        <td class="stat-name">Crit DMG</td>
        <td class="text-right">{{ displayPercentage(totalCritDmg * 100) }}</td>
      </tr>
      <tr
        class="stat-er"
        @click="$emit('stat-selected', 'Energy Regen')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />
        </td>
        <td class="stat-name">Energy Regen</td>
        <td class="text-right">{{ displayPercentage(energyRegen * 100) }}</td>
      </tr>
      <tr
        class="stat-basic"
        @click="$emit('stat-selected', 'Basic Attack DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />
        </td>
        <td class="stat-name">Basic Attack DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(basicAttackDmgBonus) }}</td>
      </tr>
      <tr
        class="stat-heavy"
        @click="$emit('stat-selected', 'Heavy Attack DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />
        </td>
        <td class="stat-name">Heavy Attack DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(heavyAttackDmgBonus) }}</td>
      </tr>
      <tr
        class="stat-skill"
        @click="$emit('stat-selected', 'Resonance Skill DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />
        </td>
        <td class="stat-name">Resonance Skill DMG Bonus</td>
        <td class="text-right">
          {{ displayPercentage(resonanceSkillDmgBonus) }}
        </td>
      </tr>
      <tr
        class="stat-liberation"
        @click="$emit('stat-selected', 'Resonance Liberation DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />
        </td>
        <td class="stat-name">Resonance Liberation DMG Bonus</td>
        <td class="text-right">
          {{ displayPercentage(resonanceLiberationDmgBonus) }}
        </td>
      </tr>
      <tr
        class="stat-glacio"
        @click="$emit('stat-selected', 'Glacio DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
            class="glacio--active" />
        </td>
        <td class="stat-name">Glacio DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(glacio) }}</td>
      </tr>
      <tr
        class="stat-fusion"
        @click="$emit('stat-selected', 'Fusion DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
            class="fusion--active" />
        </td>
        <td class="stat-name">Fusion DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(fusion) }}</td>
      </tr>
      <tr
        class="stat-electro"
        @click="$emit('stat-selected', 'Electro DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
            class="electro--active" />
        </td>
        <td class="stat-name">Electro DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(electro) }}</td>
      </tr>
      <tr
        class="stat-aero"
        @click="$emit('stat-selected', 'Aero DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
            class="aero--active" />
        </td>
        <td class="stat-name">Aero DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(aero) }}</td>
      </tr>
      <tr
        class="stat-spectro"
        @click="$emit('stat-selected', 'Spectro DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
            class="spectro--active" />
        </td>
        <td class="stat-name">Spectro DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(spectro) }}</td>
      </tr>
      <tr
        class="stat-havoc"
        @click="$emit('stat-selected', 'Havoc DMG Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
            class="havoc--active" />
        </td>
        <td class="stat-name">Havoc DMG Bonus</td>
        <td class="text-right">{{ displayPercentage(havoc) }}</td>
      </tr>
      <tr
        class="stat-healing"
        @click="$emit('stat-selected', 'Healing Bonus')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />
        </td>
        <td class="stat-name">Healing Bonus</td>
        <td class="text-right">{{ displayPercentage(healingBonus * 100) }}</td>
      </tr>
      <tr
        class="stat-tune-break-boost"
        @click="$emit('stat-selected', 'Tune Break Boost')"
        style="cursor: pointer">
        <td>
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/tunebreakboost.png" />
        </td>
        <td class="stat-name">Tune Break Boost</td>
        <td class="text-right">
          {{ displayInt((tuneBreakBoost || 0) * 100) }}
        </td>
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
    tuneBreakBoost: {
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
        this.characterLevel,
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
  tr::before {
    filter: none !important;
  }
}
.calculator__stats {
  td {
    padding: 0.5rem;
    font-size: 16px;
  }

  tr {
    position: relative;

    &::before {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 640'%3E%3Cpath d='M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z'/%3E%3C/svg%3E");
      position: absolute;
      width: 1rem;
      height: 1rem;
      left: -1.25rem;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
      transition: opacity 0.2s ease;
      filter: invert(100%);
    }
  }

  tr:hover::before {
    opacity: 0.6;
  }
}
</style>
