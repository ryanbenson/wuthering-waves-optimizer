<template>
  <dialog id="modal-echoes-presets" class="modal">
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
        <h3 class="text-xl mb-4">Choose a preset to apply to your build</h3>
        <div role="tablist" class="tabs tabs-bordered">
          <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="My Presets"
            checked="checked" />
          <div role="tabpanel" class="tab-content mt-6">
            <p v-if="!hasEchoPresets">No echo presets available</p>
            <div v-else class="echoes-presets-list">
              <EchoCustomPreset
                v-for="echoPreset in echoPresets"
                :key="echoPreset.name"
                :preset-id="echoPreset.presetId"
                :name="echoPreset.name"
                :echo-1-id="echoPreset.echo1Id"
                :echo-2-id="echoPreset.echo2Id"
                :echo-3-id="echoPreset.echo3Id"
                :echo-4-id="echoPreset.echo4Id"
                :echo-5-id="echoPreset.echo5Id"
                @click="applyCustomPreset(echoPreset)"
              />
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            class="tab"
            aria-label="Other Presets" />
          <div role="tabpanel" class="tab-content mt-6">
            <p v-if="!hasDefaultEchoPresets">No default echo presets available</p>
            <div v-else class="echoes-presets-list">
              <div
                v-for="defaultEchoPreset in defaultEchoPresets"
                :key="defaultEchoPreset.name"
            class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
                <div class="card-body">
                <h2 class="card-title">{{ defaultEchoPreset.name }}</h2>
                <p>{{ defaultEchoPreset.description }}</p>
                <p class="italic">Author: {{ defaultEchoPreset.author }}</p>
                <button class="btn btn-primary" @click="applyPreset(defaultEchoPreset)">Apply preset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getCharByName } from "../characters/characters.ts";
import EchoCustomPreset from "./EchoCustomPreset.vue";
export default {
  name: "CalculatorEchoImporter",
  components: {
    EchoCustomPreset,
  },
  props: {
    character: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      defaultEchoPresets: []
    }
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterEchoes", "setCharacterData"]),
    ...mapActions(useInventoryStore, [
      "saveEcho",
      "setEquippedData",
      "getEchoById",
    ]),
    triggerOpenModal() {
      const modalEl = document.getElementById("modal-echoes-presets");
      modalEl.showModal();
    },
    triggerCloseModal() {
      const modalEl = document.getElementById("modal-echoes-presets");
      modalEl.close();
    },
    async applyPreset(presetData) {
      const data = JSON.parse(JSON.stringify(presetData)); // clone so we don't use the raw data
      await this.setCharacterEchoes(this.character, {}); // flush first
      await this.setCharacterEchoes(this.character,  data.data.echoes);
      this.triggerCloseModal();
    },
    async applyCustomPreset(presetData) {
      const data = JSON.parse(JSON.stringify(presetData)); // clone so we don't use the raw data
      // set the preset id
      await this.setCharacterData(this.character, { echoPresetId: presetData.presetId });
      // flush current echo data
      await this.setCharacterEchoes(this.character, {});
      // need to setup the echo data to apply {0: echoData..., 1: echoData...}
      const echoData = {};
      if (data.echo1Id) {
        const echo1Data = await this.getEchoById(data.echo1Id);
        echoData[0] = echo1Data;
      }
      if (data.echo2Id) {
        const echo2Data = await this.getEchoById(data.echo2Id);
        echoData[1] = echo2Data;
      }
      if (data.echo3Id) {
        const echo3Data = await this.getEchoById(data.echo3Id);
        echoData[2] = echo3Data;
      }
      if (data.echo4Id) {
        const echo4Data = await this.getEchoById(data.echo4Id);
        echoData[3] = echo4Data;
      }
      if (data.echo5Id) {
        const echo5Data = await this.getEchoById(data.echo5Id);
        echoData[4] = echo5Data;
      }
      // set the echo data now
      await this.setCharacterEchoes(this.character, echoData);
      this.triggerCloseModal();
    }
  },
  computed: {
    ...mapState(useCharacterStore, ["characters"]),
    ...mapState(useInventoryStore, ["echoPresets"]),
    /**
     * The current character data
     * @returns {Object}
     */
    currentCharacter() {
      return this.characters[this.character] ?? {};
    },
    hasDefaultEchoPresets() {
      return this.defaultEchoPresets.length > 0;
    },
    hasEchoPresets() {
      return this.echoPresets.length > 0;
    }
  },
  async mounted() {
    this.characterData = await getCharByName(this.character);
    const echoes = this.characterData?.echoes ?? [];
    this.defaultEchoPresets = echoes;
  }
};
</script>
