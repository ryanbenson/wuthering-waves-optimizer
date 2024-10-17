<template>
  <div>
    <button class="btn" onclick="my_modal_3.showModal()">open modal</button>
    <dialog id="my_modal_3" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div class="py-4">
          <div class="echo__selection flex w-full items-center gap-6">
            <div
              class="echo__item__image rounded-full border border-solid border-amber-300 neutral-content size-24 bg-cover min-w-24 text-center"
              style="background-image: url(https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FallacyOfNoReturn.png);">
            </div>
            <div class="echo__item__main-selection flex flex-col gap-4">
              <select name="mainEcho" class="select select-bordered select select-sm">
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
              <select name="mainStat" class="select select-bordered select select-sm">
                <option value="CritRate">Crit Rate</option>
                <option value="CritDMG">Crit DMG</option>
              </select>
            </div>
            <div class="echo__item__set w-full relative">
              <span class="font-bold mb-2 inline-flex">Echo Set</span>
              <div class="echo__item__set-selection flex gap-4">
                <div class="size-8 rounded-full border border-solid border-white"><img src="https://www.prydwen.gg/static/5f4daa43c4a07ee8fb472a7e4f8feea1/8257c/set_8.webp"></div>
                <div class="size-8 rounded-full"><img src="https://www.prydwen.gg/static/321492541c283d76ce00e5b199247274/8257c/set_7.webp"></div>
              </div>
            </div>
          </div>
          <div class="echo__selection__input w-full mt-8">
            <div class="echo__selection__rank flex flex-col pb-7 relative">
              <label for="rank" class="rank__label">Rank <span class="text-primary">5</span></label>
              <input type="range" id="rank" min="1" max="5" value="5" step="1" class="echo__selection__rank__input range range-xs" />
            </div>
          </div>
          <div class="echo__selection_substats w-full">
            <span class="font-bold text-2xl mb-6 inline-flex">Substats</span>
            <div class="echo__selection_substats__list">
              <div class="echo__selection_substat relative">
                <div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                  <input type="checkbox" class="toggle toggle-sm toggle-accent" checked="checked" />
                  <span class="label-text substat__label">Crit Rate <span class="text-primary">6.3%</span></span>
                  <input type="range" id="rank" min="1" max="5" value="5" step="1" class="echo__selection__rank__input range range-xs" />
                </div>

                <div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                  <input type="checkbox" class="toggle toggle-sm toggle-accent" checked="checked" />
                  <span class="label-text substat__label">Crit DMG <span class="text-primary">21%</span></span>
                  <input type="range" id="rank" min="1" max="5" value="1" step="1" class="echo__selection__rank__input range range-xs" />
                </div>

                <div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
                  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
                  <span class="label-text text-base">ATK% <span class="text-primary"></span></span>
                </div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" checked="checked" />
  <span class="label-text substat__label">ATK <span class="text-primary">150</span></span>
  <input type="range" id="rank" min="1" max="5" value="3" step="1" class="echo__selection__rank__input range range-xs" />
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">HP%</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">HP</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">DEF%</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">DEF</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">Basic Attack DMG Bonus</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">Heavy Attack DMG Bonus</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">Skill DMG Bonus</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">Liberation DMG Bonus</span>
</div>

<div class="echo__selection_substat__info flex gap-4 items-center relative mb-6">
  <input type="checkbox" class="toggle toggle-sm toggle-accent" />
  <span class="label-text text-base">Energy Recharge</span>
</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>

    <div v-if="isTotalCostOverCap" class="alert alert--error">
      You have exceeded to total echo cost of 12 with {{ totalEchoCost }}.
    </div>
    <div class="echo__list">
      <div class="echo__item card card-bordered card-compact bg-base-100 shadow mb-2">
        <div class="card-body">
          <div class="echo__content flex gap-6">
            <div class="echo__item__left">
              <div
                class="echo__item__image rounded-full border border-solid border-amber-300 neutral-content size-20 mb-2 bg-cover"
                style="background-image: url(https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/FallacyOfNoReturn.png);">
              </div>
              <div class="echo__item__actions flex gap-2 justify-center mt-4">
                <span class="echo__item__edit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" fill="#FFFFFF"/></svg></span>
                <span class="echo__item__delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4"><path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" fill="#FFFFFF"/></svg></span>
              </div>
            </div>
            <div class="echo__item__stats mb-2 w-full relative">
              <h2 class="card-title text-amber-300 flex items-center justify-between">
                <span>Fallacy of No Return</span>
                <div class="echo__item__meta flex gap-2 items-center">
                  <span class="echo__item__set size-6 rounded-full border border-solid border-white"><img src="https://www.prydwen.gg/static/5f4daa43c4a07ee8fb472a7e4f8feea1/8257c/set_8.webp"></span>
                  <span class="echo__item__cost badge badge-primary">Cost 4</span>
                </div>
              </h2>
              <table class="echo__item__sub-stats table table-zebra table-xs">
                <tbody>
                  <tr>
                    <td class="flex gap-2 items-center"><img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />Crit Rate</td>
                    <td>22%</td>
                  </tr>
                  <tr>
                    <td class="flex gap-2 items-center"><img src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />ATK</td>
                    <td>150</td>
                  </tr>
                  <tr class=" substats__label">
                    <td class="font-bold font-size-8">Substats</td>
                  </tr>
                  <tr class="relative" style="z-index: 1;">
                    <td class="flex gap-2 items-center"><img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" /> Crit DMG</td>
                    <td>21%</td>
                  </tr>
                  <tr>
                    <td class="flex gap-2 items-center"><img src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" /> Crit Rate</td>
                    <td>6.3%</td>
                  </tr>
                  <tr>
                    <td class="flex gap-2 items-center"><img src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" /> ATK%</td>
                    <td>6.8%</td>
                  </tr>
                  <tr>
                    <td class="flex gap-2 items-center"><img src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" /> Basic Attack DMG Bonus</td>
                    <td>11.1%</td>
                  </tr>
                  <tr>
                    <td class="flex gap-2 items-center"><img src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" /> Crit DMG</td>
                    <td>40</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="echo__item__image rounded-full border border-solid neutral-content size-16 ml-1 mb-2"></div>
      <div class="echo__item__image rounded-full border border-solid neutral-content size-16 ml-1 mb-2"></div>
      <div class="echo__item__image rounded-full border border-solid neutral-content size-16 ml-1 mb-2"></div>
      <div class="echo__item__image rounded-full border border-solid neutral-content size-16 ml-1"></div>
    </div>
    <CalculatorEcho
      v-for="(n, index) in 5"
      :key="character + '-' + index"
      :index="index"
      :character="character"
      class="echo-selector"
      @updated-echo-cost="handleUpdatedEchoCost"
      @update-stats="handleEchoStats">
    </CalculatorEcho>
    <div class="set-bonus-selector">
      <CalculatorEchoesSetBonusOne
        :character="character"
        @update-stats="handleSetBonusOneData"></CalculatorEchoesSetBonusOne>
      <CalculatorEchoesSetBonusTwo
        :character="character"
        @update-stats="handleSetBonusTwoData"></CalculatorEchoesSetBonusTwo>
    </div>
    <h3>Main Echo</h3>
    <div class="main-echo__selection">
      <div
        :style="{
          backgroundImage: `url(${chosenMainEchoImage})`,
        }"
        class="main-echo__image"></div>
      <select name="mainEcho" v-model="mainEcho">
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
    </div>
    <div class="main-echo-level">
      <label for="mainEchoRank">Choose Main Echo Rank</label>
      <select name="mainEchoRank" v-model="mainEchoRank">
        <option value="">Select a rank</option>
        <option value="5">5</option>
        <option value="4">4</option>
        <option value="3">3</option>
        <option value="2">2</option>
        <option value="1">1</option>
      </select>
    </div>
    <div class="main-echo" @click="toggleMainEchoBuffEnabled">
      <div
        v-if="chosenMainEchoData"
        class="main-echo__details"
        v-html="chosenMainEchoData.details"></div>
      <div class="main-echo__enabled" v-if="chosenMainEchoHasBuffs">
        <label @click.stop>
          <input
            type="checkbox"
            class="checkbox"
            v-model="mainEchoBuffEnabled"
            name="mainEchoBuffEnabled" />
          Enabled?</label
        >
        <div v-if="mainEchoHasStacks" @click.stop>
          <label>Stacks:</label>
          <input
            v-model.number="mainEchoStacks"
            type="number"
            min="0"
            :max="mainEchoMaxStacks" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mainEchoesData } from "../echoes/index.ts";
import CalculatorEcho from "./CalculatorEcho.vue";
import CalculatorEchoesSetBonusOne from "./CalculatorEchoesSetBonusOne.vue";
import CalculatorEchoesSetBonusTwo from "./CalculatorEchoesSetBonusTwo.vue";
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
const MAX_ECHO_COST = 12;

export default {
  props: {
    character: {
      type: String,
      required: true,
    },
  },
  components: {
    CalculatorEcho,
    CalculatorEchoesSetBonusOne,
    CalculatorEchoesSetBonusTwo,
  },
  data() {
    return {
      totalCost: 0,
      setBonusOne: {},
      setBonusTwo: {},
      echoData: {},
      setBonuses: [
        { type: "", stacks: 0 },
        { type: "", stacks: 0 },
      ],
      echoCosts: [],
    };
  },
  watch: {
    mainEcho: {
      handler: async function () {
        this.handleMainEchoChange();
        // prevent stacks from exceeding max stacks
        if (this.mainEchoStacks > this.mainEchoMaxStacks) {
          this.mainEchoStacks = this.mainEchoMaxStacks;
        }
        this.updateTotalStats();
      },
      immediate: true,
    },
    mainEchoRank: {
      handler: async function () {
        this.handleMainEchoRank();
      },
      immediate: true,
    },
    mainEchoBuffEnabled: {
      handler: async function () {
        this.updateTotalStats();
      },
      immediate: true,
    },
    mainEchoStacks: {
      handler: async function (stacksVal) {
        // prevent stacks from exceeding max stacks
        if (stacksVal > this.mainEchoMaxStacks) {
          this.mainEchoStacks = this.mainEchoMaxStacks;
        }
        this.updateTotalStats();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterData"]),
    updateTotalStats() {
      const stats = {};
      // process all of the echo data
      if (this.echoData) {
        const echoItemsData = Object.values(
          JSON.parse(JSON.stringify(this.echoData))
        );
        // go through each echo data and merge each stat
        for (const echo of echoItemsData) {
          for (const [stat, value] of Object.entries(echo)) {
            stats[stat] = (stats[stat] || 0) + value;
          }
        }
      }
      // process the first set bonus
      if (this.setBonusOne) {
        for (const [stat, value] of Object.entries(
          JSON.parse(JSON.stringify(this.setBonusOne))
        )) {
          stats[stat] = (stats[stat] || 0) + value;
        }
      }
      // process the second set bonus
      if (this.setBonusTwo) {
        for (const [stat, value] of Object.entries(
          JSON.parse(JSON.stringify(this.setBonusTwo))
        )) {
          stats[stat] = (stats[stat] || 0) + value;
        }
      }

      let modifySpecificTalents = [];
      // process the main echo buffs, only if enabled
      if (this.mainEchoBuffEnabled) {
        for (const mainEchoBuff of this.chosenMainEchoBuffs) {
          if (mainEchoBuff?.modifySpecificTalents) {
            stats.specificTalentBuffs = {};
            mainEchoBuff?.modifySpecificTalents.forEach((buffTalentName) => {
              stats.specificTalentBuffs[buffTalentName] =
                mainEchoBuff.modifierValue;
            });
          } else {
            // we're dealing with full numbers right now, not decimals,
            // so multiply * 100
            // TODO: Remove this when we refactor this whole thing to use decimals
            if (this.mainEchoHasStacks) {
              const buffVal = mainEchoBuff.modifierValue * 100;
              stats[mainEchoBuff.modifier] =
                (stats[mainEchoBuff.modifier] || 0) +
                buffVal * this.mainEchoStacks;
            } else {
              const buffVal = mainEchoBuff.modifierValue * 100;
              stats[mainEchoBuff.modifier] =
                (stats[mainEchoBuff.modifier] || 0) + buffVal;
            }
          }
        }
      }

      this.$emit("update-stats", stats);
    },
    handleSetBonusOneData(data) {
      const stats = JSON.parse(JSON.stringify(data));
      this.setBonusOne = stats;
      this.updateTotalStats();
    },
    handleSetBonusTwoData(data) {
      const stats = JSON.parse(JSON.stringify(data));
      this.setBonusTwo = stats;
      this.updateTotalStats();
    },
    handleEchoStats({ index, stats }) {
      const statData = JSON.parse(JSON.stringify(stats));
      this.echoData[index] = stats;
      this.updateTotalStats();
    },
    handleUpdatedEchoCost({ index, cost }) {
      this.echoCosts[index] = cost;
    },
    toggleMainEchoBuffEnabled() {
      this.mainEchoBuffEnabled = !this.mainEchoBuffEnabled;
    },
    handleMainEchoChange() {
      this.$emit("updated-main-echo", this.mainEcho);
    },
    handleMainEchoRank() {
      this.$emit("updated-main-echo-rank", this.mainEchoRank);
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
    /**
     * Getter/setter used in the form for the the main echo
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    mainEcho: {
      get() {
        return this.currentCharacter?.mainEcho?.echo ?? null;
      },
      async set(value) {
        const data = {
          mainEcho: {
            echo: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the the main echo rarity
     * @returns {Boolean}
     */
    mainEchoRank: {
      get() {
        return this.currentCharacter?.mainEcho?.rank ?? 5;
      },
      async set(value) {
        const data = {
          mainEcho: {
            rank: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the isEnabled state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    mainEchoBuffEnabled: {
      get() {
        return this.currentCharacter?.mainEcho?.isEnabled ?? false;
      },
      async set(value) {
        const data = {
          mainEcho: {
            isEnabled: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    /**
     * Getter/setter used in the form for the stacks count state for this passive
     * Data is persisted in the store. Avoids needing a local data + store data
     * @returns {Boolean}
     */
    mainEchoStacks: {
      get() {
        return this.currentCharacter?.mainEcho?.stacks ?? 0;
      },
      async set(value) {
        const data = {
          mainEcho: {
            stacks: value,
          },
        };
        await this.setCharacterData(this.character, data);
      },
    },
    mainEchoesData() {
      return { ...mainEchoesData };
    },
    chosenMainEchoData() {
      if (!this.mainEcho) {
        return null;
      }
      return this.mainEchoesData?.[this.mainEcho];
    },
    chosenMainEchoBuffs() {
      if (!this.chosenMainEchoData) {
        return [];
      }
      return this.chosenMainEchoData?.modifiers ?? [];
    },
    chosenMainEchoHasBuffs() {
      return this.chosenMainEchoBuffs?.length > 0;
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
    chosenMainEchoImage() {
      return (
        this.chosenMainEchoData?.image ??
        "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png"
      );
    },
    mainEchoHasStacks() {
      return this.chosenMainEchoData?.hasStacks ?? false;
    },
    mainEchoMinStacks() {
      return this.chosenMainEchoData?.minStacks ?? 0;
    },
    mainEchoMaxStacks() {
      return this.chosenMainEchoData?.maxStacks ?? 0;
    },
    totalEchoCost() {
      const totalCost = this.echoCosts.reduce((totalCost, cost) => {
        return (totalCost += cost);
      }, 0);
      return totalCost;
    },
    isTotalCostOverCap() {
      return this.totalEchoCost > MAX_ECHO_COST;
    },
  },
};
</script>

<style scoped>
.echo-selector {
  margin-bottom: 20px;
}

.sub-stat-selector {
  display: flex;
  margin-top: 5px;
}

.sub-stat-selector select,
.sub-stat-selector input {
  margin-right: 10px;
}

.set-bonus-selector {
  margin-bottom: 20px;
}

.set-bonus-selector select {
  margin-right: 10px;
}
.echo-selector {
  margin-bottom: 20px;
}

.cost-selector,
.rank-selector {
  margin: 0 1rem 1rem 0;
}
.echo-setup {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.rank-options {
  display: flex;
}
.cost-options button,
.rank-options .rank-circle {
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.rank-options .rank-circle {
  width: 24px;
  height: 24px;
  border-radius: 100%;
  display: inline-block;
  padding: 0;
  border: none;
}

.cost-options button {
  background-color: transparent;
  border-radius: 6px;
}
.cost-options button.selected {
  font-weight: bold;
  border-color: yellow !important;
}

.sub-stat-selector {
  display: flex;
  margin-top: 5px;
}

.sub-stat-selector select,
.sub-stat-selector input {
  margin-right: 10px;
}

.set-bonus-selector {
  margin-bottom: 20px;
}

.set-bonus-selector select {
  margin-right: 10px;
}
.rank-circle.selected {
  transform: scale(1.3);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
.sub-stat__input {
  max-width: 3rem;
  width: 3rem;
}
.main-echo__image {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
.main-echo__selection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
}
.main-echo__enabled {
  margin-top: 1rem;
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
}
.alert--error {
  background-color: #7b7c27;
}
.main-echo-level {
  padding-top: 0.5rem;
  label {
    display: block;
  }
}
.main-echo {
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  margin-top: 2rem;
  border-radius: 6px;
  cursor: pointer;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }

  span:first-of-type {
    font-weight: bold;
  }
}
.substats__label {
  position: relative;
  left: -10px;
  top: 4px;
  z-index: 0;
  font-size: 24px;
}
.echo__item__actions {
  @media (prefers-color-scheme: light) {
    svg {
      filter: invert(100%);
    }
  }
}



.rank__label {
  font-size: 24px;
  font-weight: 700;
  position: absolute;
  top: -1.6rem;
  left: 0.5rem;
  z-index: 0;
}
.substat__label {
  font-size: 16px;
  position: absolute;
  left: 3rem;
  top: -0.9rem;
  z-index: 0;
}
.echo__selection__rank__input {
  position: relative;
  z-index: 10;
}
</style>
