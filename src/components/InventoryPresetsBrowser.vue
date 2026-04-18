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

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useInventoryStore } from "../stores/inventory";
import { useCharacterStore } from "../stores/character";
import EchoCustomPreset from "./EchoCustomPreset.vue";

const page = ref(1);
const perPage = 10;
const modalId = "inventoryPresetEditName";
const echoPresetName = ref<string | null>(null);
const echoPresetId = ref<string | null>(null);

const inventoryStore = useInventoryStore();
const characterStore = useCharacterStore();
const { echoPresets } = storeToRefs(inventoryStore);
const { getEchoPresetData, getEchoPresetCharacters } = inventoryStore;
const { patchEchoPreset, deleteEchoPreset, deleteEquippedPreset } =
  inventoryStore;
const { setCharacterData } = characterStore;

const presetsList = computed(() => {
  const copyOfList = JSON.parse(JSON.stringify(echoPresets.value));
  return copyOfList;
});

const paginatedPresetsList = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = page.value * perPage;
  return presetsList.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(presetsList.value.length / perPage),
);

const echoPresetData = computed(() =>
  echoPresetId.value ? getEchoPresetData(echoPresetId.value) : undefined,
);

function prevPage() {
  if (page.value <= 1) {
    page.value = 1;
  } else {
    page.value--;
  }
}

function nextPage() {
  if (page.value >= totalPages.value) {
    page.value = totalPages.value;
  } else {
    page.value++;
  }
}

function editEchoPresetName(presetId: string, presetName: string) {
  echoPresetId.value = presetId;
  echoPresetName.value = presetName;
  handleOpenModal();
}

function handleOpenModal() {
  const modalEl = document.getElementById(modalId) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function handleCloseModal() {
  const modalEl = document.getElementById(modalId) as HTMLDialogElement | null;
  modalEl?.close();
}

async function handleSavePreset() {
  const presetData = JSON.parse(JSON.stringify(echoPresetData.value));
  const data = Object.assign({}, presetData, { name: echoPresetName.value });
  await patchEchoPreset(presetData.presetId, data);
  resetForm();
  handleCloseModal();
}

function resetForm() {
  echoPresetId.value = null;
  echoPresetName.value = null;
}

function getCharsEquipped(presetId: string) {
  return getEchoPresetCharacters(presetId);
}

function getCharImg(character: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
}

async function handleDeleteEchoPreset(presetId: string) {
  const allCharacters = getCharsEquipped(presetId);
  for (const character of allCharacters) {
    await deleteEquippedPreset(character);
    const data = { echoPresetId: null };
    await setCharacterData(character, data);
  }
  await deleteEchoPreset(presetId);
}
</script>
