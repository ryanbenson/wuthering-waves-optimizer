<template>
  <dialog id="modal-echoes-importer" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <CalculatorEchoParser
          @echoes-parsed="handleEchoesParsed"></CalculatorEchoParser>
      </div>
    </div>
  </dialog>
</template>

<script>
import CalculatorEchoParser from "./CalculatorEchoParser.vue";
import { verboseStatLabelMap } from "../echoes/stats";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { randomString } from "../utils/strings.ts";
export default {
  name: "CalculatorEchoImporter",
  components: {
    CalculatorEchoParser,
  },
  props: {
    character: {
      type: String,
      default: false,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, [
      "setCharacterEchoes",
      "setCharacterData",
    ]),
    ...mapActions(useInventoryStore, [
      "saveEcho",
      "setEquippedData",
      "deleteEquippedPreset",
      "removeCharacterFromAllEquipped",
    ]),
    triggerOpenModal() {
      const modalEl = document.getElementById("modal-echoes-importer");
      modalEl.showModal();
    },
    triggerCloseModal() {
      const modalEl = document.getElementById("modal-echoes-importer");
      modalEl.close();
    },
    async handleEchoesParsed(echoData, isSavingToInventory) {
      const echoes = echoData.map((echo) => {
        const echoSubStatsType1 = this.getSubstatType(echo.substats[0]);
        const echoSubStatsValue1 = this.getSubstatValue(
          echo.substats[0].subStatValue,
        );
        const echoSubStatsType2 = this.getSubstatType(echo.substats[1]);
        const echoSubStatsValue2 = this.getSubstatValue(
          echo.substats[1].subStatValue,
        );
        const echoSubStatsType3 = this.getSubstatType(echo.substats[2]);
        const echoSubStatsValue3 = this.getSubstatValue(
          echo.substats[2].subStatValue,
        );
        const echoSubStatsType4 = this.getSubstatType(echo.substats[3]);
        const echoSubStatsValue4 = this.getSubstatValue(
          echo.substats[3].subStatValue,
        );
        const echoSubStatsType5 = this.getSubstatType(echo.substats[4]);
        const echoSubStatsValue5 = this.getSubstatValue(
          echo.substats[4].subStatValue,
        );
        let echoId = null;
        if (isSavingToInventory) {
          echoId = randomString();
        }
        return {
          echo: echo.echo ?? null,
          type: Number(echo.cost) ?? null, // make sure the cost is a number so it counts max cost without breaking
          rank: echo.rank ?? 5,
          stat: echo.mainStatLabel
            ? verboseStatLabelMap[echo.mainStatLabel]
            : null,
          echoId,
          echoSet: echo.set,
          echoSubStatsType1,
          echoSubStatsValue1,
          echoSubStatsType2,
          echoSubStatsValue2,
          echoSubStatsType3,
          echoSubStatsValue3,
          echoSubStatsType4,
          echoSubStatsValue4,
          echoSubStatsType5,
          echoSubStatsValue5,
        };
      });
      // update store
      await this.setCharacterEchoes(this.character, {}); // flush first
      await this.setCharacterEchoes(this.character, echoes);
      // flush the echo preset Id too
      await this.setCharacterData(this.character, { echoPresetId: null });
      await this.deleteEquippedPreset(this.character);
      // flush out the character's equip references
      await this.removeCharacterFromAllEquipped(this.character);

      // if we're saving to the inventory, save each echo,
      // then add it to the char
      if (isSavingToInventory) {
        for (const [index, echo] of echoes.entries()) {
          await this.saveEcho(echo);
          const equippedData = {};
          equippedData[this.character] = index;
          await this.setEquippedData(echo.echoId, equippedData);
        }
      }
      // close modal
      this.triggerCloseModal();
    },
    getSubstatValue(subStatValue) {
      const valueWithoutPercent = subStatValue.replace("%", "");
      return Number(valueWithoutPercent);
    },
    getSubstatType(subStatData) {
      let type = subStatData.subStat;
      const value = subStatData.subStatValue;
      if (type === "DEF Y") {
        return "DEF";
      }
      if (["ATK", "DEF", "HP"].includes(type)) {
        // if the value has % then keep the type
        // if it does not have %, then it is the TYPE with _FLAT at the end
        if (value.includes("%")) {
          return type;
        } else {
          return type + "_FLAT";
        }
      }
      return verboseStatLabelMap[type] ?? null;
    },
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
  },
};
</script>
