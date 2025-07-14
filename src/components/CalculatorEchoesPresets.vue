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
        <p v-if="!hasEchoPresets">No echo presets available</p>
        <div v-else class="echoes-presets-list">
          <h3 class="text-xl mb-4">Choose a preset to apply to your build</h3>
          <div
            v-for="echoPreset in echoPresets"
            :key="echoPreset.name"
        class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2 cursor-pointer">
            <div class="card-body">
            <h2 class="card-title">{{ echoPreset.name }}</h2>
            <p>{{ echoPreset.description }}</p>
            <p class="italic">Author: {{ echoPreset.author }}</p>
            <button class="btn btn-primary" @click="applyPreset(echoPreset)">Apply preset</button>
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
export default {
  name: "CalculatorEchoImporter",
  components: {
    
  },
  props: {
    character: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      echoPresets: []
    }
  },
  methods: {
    ...mapActions(useCharacterStore, ["setCharacterEchoes"]),
    ...mapActions(useInventoryStore, [
      "saveEcho",
      "setEquippedData",
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
    hasEchoPresets() {
      return this.echoPresets.length > 0;
    }
  },
  async mounted() {
    this.characterData = await getCharByName(this.character);
    const echoes = this.characterData?.echoes ?? [];
    this.echoPresets = echoes;
  }
};
</script>
