<template>
  <dialog id="inventoryPresetEditName" class="modal">
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
    <div class="modal-box max-w-xl">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          data-test-echo-modal-close>
          ✕
        </button>
      </form>
      <div class="py-4">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Update your preset name</span>
          </div>
          <input type="text" v-model.trim="echoPresetName" class="input input-bordered w-full" />
        </label>
        <button class="btn btn-primary btn-sm mt-4" @click="handleSavePreset">Update</button>
      </div>
    </div>
  </dialog>
  <div class="py-4">
    <div class="echoes__list">
      <template v-if="!echoPresets.length">
        <div class="echoes__list--empty py-12 text-center w-full">
          No presets found
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
          <EchoCustomPreset
            v-for="echoPreset in paginatedPresetsList"
            :key="echoPreset.name"
            :preset-id="echoPreset.presetId"
            :name="echoPreset.name"
            :echo-1-id="echoPreset.echo1Id"
            :echo-2-id="echoPreset.echo2Id"
            :echo-3-id="echoPreset.echo3Id"
            :echo-4-id="echoPreset.echo4Id"
            :echo-5-id="echoPreset.echo5Id"
            :disable-action="true"
            :show-equipped-chars="true"
          >
            <div
              class="echoes__item__foot flex gap-2 justify-between items-center">
              <div class="echoes__items__foot__equipped">
                <div class="avatar-group -space-x-6 rtl:space-x-reverse">
                  <div class="avatar" v-for="char in getCharsEquipped(echoPreset.presetId)">
                    <div class="w-12 bg-accent-content">
                      <img :src="getCharImg(char)" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="echoes__item__foot__actions flex gap-2">
                <button
                  @click="editEchoPresetName(echoPreset.presetId, echoPreset.name)"
                  class="btn btn-primary btn-sm min-w-16">
                  Edit
                </button>
                <button
                  @click="handleDeleteEchoPreset(echoPreset.presetId)"
                  class="btn btn-error btn-sm min-w-16">
                  Delete
                </button>
              </div>
            </div>
          </EchoCustomPreset>
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
import { mapActions, mapState } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import EchoCustomPreset from "./EchoCustomPreset.vue";
export default {
  name: "InventoryPresetsBrowser",
  props: {},
  data() {
    return {
      page: 1,
      perPage: 10,
      modalId: "inventoryPresetEditName",
      echoPresetName: null,
      echoPresetId: null,
    };
  },
  components: {
    EchoCustomPreset,
  },
  computed: {
    ...mapState(useInventoryStore, ["echoPresets", "getEchoPresetData", "getEchoPresetCharacters"]),
    presetsList() {
      const copyOfList = JSON.parse(JSON.stringify(this.echoPresets));
      return copyOfList;
    },
    paginatedPresetsList() {
      const start = (this.page - 1) * this.perPage;
      const end = this.page * this.perPage;
      const slicedList = this.presetsList.slice(start, end);
      return slicedList;
    },
    totalPages() {
      return Math.ceil(this.presetsList.length / this.perPage);
    },
    echoPresetData() {
      return this.getEchoPresetData(this.echoPresetId);
    },
  },
  methods: {
    ...mapActions(useInventoryStore, ["patchEchoPreset", "deleteEchoPreset", "deleteEquippedPreset"]),
    ...mapActions(useCharacterStore, ["setCharacterData"]),
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
    editEchoPresetName(presetId, presetName) {
      this.echoPresetId = presetId;
      this.echoPresetName = presetName;
      this.handleOpenModal();
    },
    handleOpenModal() {
      const modalEl = document.getElementById(this.modalId);
      modalEl.showModal();
    },
    handleCloseModal() {
      const modalEl = document.getElementById(this.modalId);
      modalEl.close();
    },
    async handleSavePreset() {
      const presetData = JSON.parse(JSON.stringify(this.echoPresetData));
      const data = Object.assign({}, presetData, { name: this.echoPresetName });
      await this.patchEchoPreset(presetData.presetId, data);
      this.resetForm();
      this.handleCloseModal();
    },
    resetForm() {
      this.echoPresetId = null;
      this.echoPresetName = null;
    },
    getCharsEquipped(presetId) {
      return this.getEchoPresetCharacters(presetId);
    },
    getCharImg(character) {
      return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
    },
    // we'll delete the references to it in the equipped list, and the preset
    // but we won't clear out the echo configs on the characters themselves, we'll leave those
    async handleDeleteEchoPreset(presetId) {
      // delete all of the character references for this preset first before we clear up the preset itself
      const allCharacters = this.getCharsEquipped(presetId);
      for (const character of allCharacters) {
        await this.deleteEquippedPreset(character);
        // also remove the presetId reference in the character data
        const data = { echoPresetId: null };
        await this.setCharacterData(character, data);
      }
      await this.deleteEchoPreset(presetId);
    }
  },
};
</script>
