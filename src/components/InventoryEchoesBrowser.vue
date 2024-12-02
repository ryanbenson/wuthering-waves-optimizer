<template>
  <InventoryEchoEdit ref="inventoryEchoEdit"></InventoryEchoEdit>
  <div class="py-4">
    <div class="echoes__filters flex flex-wrap align-center gap-2 mb-6">
      <select
        v-model="mainStatFilter"
        name="mainEcho"
        class="select select-bordered select select-sm">
        <option :value="null">Select a main stat</option>
        <option
          v-for="mainStat in allMainStats"
          :key="mainStat"
          :value="mainStat">
          {{ getReadableSubStatLabel(mainStat) }}
        </option>
      </select>
      <select
        v-model="echo"
        name="mainEcho"
        class="select select-bordered select select-sm mr-4">
        <option :value="null">Select an echo</option>
        <optgroup label="Calamity">
          <option
            v-for="option in mainEchoOptions.Calamity"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
        <optgroup label="Overlord">
          <option
            v-for="option in mainEchoOptions.Overlord"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
        <optgroup label="Elite">
          <option
            v-for="option in mainEchoOptions.Elite"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
        <optgroup label="Common">
          <option
            v-for="option in mainEchoOptions.Common"
            :key="option.key"
            :value="option.key">
            {{ option.name }}
          </option>
        </optgroup>
      </select>
      <div class="echoes__filters__sets">
        <button
          v-for="echoSet in echoSetsList"
          :key="echoSet"
          @click="toggleEchoSetFilter(echoSet)"
          class="rounded mr-1"
          :class="{ 'btn-active': isEchoSetFilterActive(echoSet) }">
          <img
            :src="getEchoSetImage(echoSet)"
            class="size-8"
            :class="echoSet" />
        </button>
      </div>
      <button @click="resetFilters" class="btn btn-sm btn-ghost">Clear</button>
    </div>

    <div class="echoes__list">
      <template v-if="!echoesList.length">
        <div class="echoes__list--empty py-12 text-center w-full">
          No echoes found
        </div>
      </template>
      <template v-else>
        <div class="join flex justify-center py-4">
          <button @click="prevPage" class="join-item btn btn-sm">«</button>
          <button class="join-item btn btn-sm">
            Page {{ page }} / {{ totalPages }}
          </button>
          <button @click="nextPage" class="join-item btn btn-sm">»</button>
        </div>
        <div class="echoes__list__items grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculatorEchoCard
            v-for="echo in paginatedEchoesList"
            class="echo__item"
            :key="echo.echoId"
            :rank="echo.rank"
            :type="echo.type"
            :echo-id="echo.echoId"
            :echo-set="echo.echoSet"
            :stat="echo.stat"
            :echo="echo.echo"
            :echo-sub-stats-type-1="echo.echoSubStatsType1"
            :echo-sub-stats-value-1="echo.echoSubStatsValue1"
            :echo-sub-stats-type-2="echo.echoSubStatsType2"
            :echo-sub-stats-value-2="echo.echoSubStatsValue2"
            :echo-sub-stats-type-3="echo.echoSubStatsType3"
            :echo-sub-stats-value-3="echo.echoSubStatsValue3"
            :echo-sub-stats-type-4="echo.echoSubStatsType4"
            :echo-sub-stats-value-4="echo.echoSubStatsValue4"
            :echo-sub-stats-type-5="echo.echoSubStatsType5"
            :echo-sub-stats-value-5="echo.echoSubStatsValue5"
            :hide-inventory="true">
            <div
              class="echoes__item__foot flex gap-2 justify-between items-center">
              <div class="echoes__items__foot__equipped">
                <div class="avatar-group -space-x-6 rtl:space-x-reverse">
                  <div class="avatar" v-for="char in getCharsEquipped(echo)">
                    <div class="w-12 bg-accent-content">
                      <img :src="getCharImg(char)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="echoes__item__foot__actions flex gap-2">
                <button
                  @click="handleEditEcho(echo.echoId)"
                  class="btn btn-primary btn-sm min-w-16">
                  Edit
                </button>
                <button
                  @click="removeEcho(echo.echoId)"
                  class="btn btn-error btn-sm min-w-16">
                  Delete
                </button>
              </div>
            </div>
          </CalculatorEchoCard>
        </div>
        <div class="join flex justify-center py-4">
          <button @click="prevPage" class="join-item btn btn-sm">«</button>
          <button class="join-item btn btn-sm">
            Page {{ page }} / {{ totalPages }}
          </button>
          <button @click="nextPage" class="join-item btn btn-sm">»</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mainEchoesData, getEchoData } from "../echoes/index.ts";
import {
  echoSetLabelMap,
  getEchoSetIconByType,
  getReadableSubStatLabel,
  statsTable,
} from "../echoes/stats";
import { mapActions, mapState } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import InventoryEchoEdit from "./InventoryEchoEdit.vue";
export default {
  name: "InventoryEchoesBrowser",
  props: {},
  data() {
    return {
      echoIndex: null,
      echoSetLabelMap,
      statsTable,
      echoSet: null,
      echo: null,
      mainStatFilter: null,
      page: 1,
      perPage: 20,
    };
  },
  components: {
    CalculatorEchoCard,
    InventoryEchoEdit,
  },
  computed: {
    ...mapState(useInventoryStore, ["echoes", "getEquippedEchoData"]),
    echoSetsList() {
      return Object.keys(echoSetLabelMap);
    },
    echoesList() {
      let allEchoes = this.echoes ?? [];
      // don't bother filtering if there are none
      if (allEchoes.length <= 0) {
        return allEchoes;
      }
      // filter by type if set
      if (this.echoSet) {
        allEchoes = allEchoes.filter((echo) => echo.echoSet === this.echoSet);
      }
      // filter by main echo if set
      if (this.echo) {
        allEchoes = allEchoes.filter((echo) => echo.echo === this.echo);
      }
      // filter by main stat if set
      if (this.mainStatFilter) {
        allEchoes = allEchoes.filter(
          (echo) => echo.stat === this.mainStatFilter,
        );
      }

      return allEchoes;
    },
    paginatedEchoesList() {
      const start = (this.page - 1) * this.perPage;
      const end = this.page * this.perPage;
      const slicedEchoes = this.echoesList.slice(start, end);
      return slicedEchoes;
    },
    totalPages() {
      return Math.ceil(this.echoesList.length / this.perPage);
    },
    mainEchoesData() {
      return { ...mainEchoesData };
    },
    mainEchoOptions() {
      const echoes = {
        Calamity: [],
        Overlord: [],
        Elite: [],
        Common: [],
      };
      const mainEchoValues = Object.values(this.mainEchoesData);
      mainEchoValues.forEach((echo) => {
        if (echo?.class && echoes?.[echo.class]) {
          echoes[echo.class].push(echo);
        }
      });
      return echoes;
    },
    allMainStats() {
      const fourSlotOptions = Object.keys(this.statsTable["4"]);
      const threeSlotOptions = Object.keys(this.statsTable["3"]);
      const oneSlotOptions = Object.keys(this.statsTable["1"]);
      const allOptions = [
        ...fourSlotOptions,
        ...threeSlotOptions,
        ...oneSlotOptions,
      ];
      // filter out any dupes
      return [...new Set(allOptions)];
    },
  },
  methods: {
    ...mapActions(useInventoryStore, [
      "getEchoById",
      "getEchoEquippedChars",
      "deleteEcho",
      "deleteEchoEquippedMapping",
    ]),
    ...mapActions(useCharacterStore, ["removeCharacterEcho"]),
    getReadableSubStatLabel,
    triggerOpenModal(echoIndex) {
      this.echoIndex = echoIndex;
      const modalEl = document.getElementById("modal-echoes-browser");
      modalEl.showModal();
    },
    triggerCloseModal() {
      const modalEl = document.getElementById("modal-echoes-browser");
      modalEl.close();
    },
    handleClose() {
      this.reset();
    },
    handleEditEcho(echoId) {
      this.$refs.inventoryEchoEdit.setEchoId(echoId);
      this.$refs.inventoryEchoEdit.handleOpenModal();
    },
    reset() {
      this.echoIndex = null;
      this.echoSet = null;
      this.echo = null;
      this.mainStatFilter = null;
    },
    getEchoSetImage(echoSet) {
      return getEchoSetIconByType(echoSet);
    },
    toggleEchoSetFilter(echoSet) {
      if (this.echoSet === echoSet) {
        this.echoSet = null;
      } else {
        this.echoSet = echoSet;
      }
    },
    isEchoSetFilterActive(echoSet) {
      return this.echoSet === echoSet;
    },
    resetFilters() {
      this.echoSet = null;
      this.echo = null;
      this.mainStatFilter = null;
    },
    prevPage() {
      if (this.page <= 1) {
        this.page = 1;
      } else {
        this.page--;
      }
    },
    nextPage() {
      if (this.page >= this.totalPages) {
        this.page = this.totalPages;
      } else {
        this.page++;
      }
    },
    getCharsEquipped(echo) {
      return this.getEchoEquippedChars(echo.echoId);
    },
    getCharImg(character) {
      return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
    },
    async removeEcho(echoId) {
      if (window.confirm("Do you really want to delete this echo?")) {
        await this.deleteEcho(echoId);
        await this.deleteEchoEquippedMapping(echoId);
        const equippedCharsData = this.getEquippedEchoData(echoId);
        const equippedChars = Object.entries(equippedCharsData);
        for (const equippedChar of equippedChars) {
          const [character, index] = equippedChar;
          await this.removeCharacterEcho(character, index);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  .modal-backdrop {
    opacity: 0.5;
  }
}
</style>
