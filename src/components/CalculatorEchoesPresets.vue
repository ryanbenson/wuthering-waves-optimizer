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
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            class="tab whitespace-nowrap"
            aria-label="My Presets"
            :checked="true" />
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
                @click="applyCustomPreset(echoPreset)" />
            </div>
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            class="tab whitespace-nowrap"
            aria-label="Other Presets" />
          <div role="tabpanel" class="tab-content mt-6">
            <p v-if="!hasDefaultEchoPresets">
              No default echo presets available
            </p>
            <div v-else class="echoes-presets-list">
              <div
                v-for="defaultEchoPreset in defaultEchoPresets"
                :key="defaultEchoPreset.name"
                class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2">
                <div class="card-body">
                  <h2 class="card-title">{{ defaultEchoPreset.name }}</h2>
                  <p>{{ defaultEchoPreset.description }}</p>
                  <p class="italic">Author: {{ defaultEchoPreset.author }}</p>
                  <button
                    class="btn btn-sm btn-primary max-w-40 mt-2"
                    @click="applyPreset(defaultEchoPreset)">
                    Apply preset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getCharByName } from "../characters/characters.ts";
import EchoCustomPreset from "./EchoCustomPreset.vue";
const props = defineProps<{ character: string }>();

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const { echoPresets } = storeToRefs(inventoryStore);

const defaultEchoPresets = ref<any[]>([]);

function triggerOpenModal() {
  const modalEl = document.getElementById("modal-echoes-presets");
  (modalEl as HTMLDialogElement | null)?.showModal();
}
function triggerCloseModal() {
  const modalEl = document.getElementById("modal-echoes-presets");
  (modalEl as HTMLDialogElement | null)?.close();
}
function handleClose() {
  triggerCloseModal();
}
async function applyPreset(presetData: any) {
      const data = JSON.parse(JSON.stringify(presetData)); // clone so we don't use the raw data
      await characterStore.setCharacterEchoes(props.character, {}); // flush first
      await characterStore.setCharacterEchoes(props.character, data.data.echoes);
      await inventoryStore.removeCharacterFromAllEquipped(props.character);
      triggerCloseModal();
    }
async function applyCustomPreset(presetData: any) {
      const data = JSON.parse(JSON.stringify(presetData)); // clone so we don't use the raw data
      await characterStore.setCharacterData(props.character, {
        echoPresetId: presetData.presetId,
      });
      await inventoryStore.setEquippedPresetData(props.character, presetData.presetId);
      await characterStore.setCharacterEchoes(props.character, {});
      await inventoryStore.removeCharacterFromAllEquipped(props.character);
      const echoData = {};
      if (data.echo1Id) {
        const echo1Data = await inventoryStore.getEchoById(data.echo1Id);
        (echoData as any)[0] = echo1Data;
        const equippedData = {};
        (equippedData as any)[props.character] = 0;
        await inventoryStore.setEquippedData(data.echo1Id, equippedData);
      }
      if (data.echo2Id) {
        const echo2Data = await inventoryStore.getEchoById(data.echo2Id);
        (echoData as any)[1] = echo2Data;
        const equippedData = {};
        (equippedData as any)[props.character] = 1;
        await inventoryStore.setEquippedData(data.echo2Id, equippedData);
      }
      if (data.echo3Id) {
        const echo3Data = await inventoryStore.getEchoById(data.echo3Id);
        (echoData as any)[2] = echo3Data;
        const equippedData = {};
        (equippedData as any)[props.character] = 2;
        await inventoryStore.setEquippedData(data.echo3Id, equippedData);
      }
      if (data.echo4Id) {
        const echo4Data = await inventoryStore.getEchoById(data.echo4Id);
        (echoData as any)[3] = echo4Data;
        const equippedData = {};
        (equippedData as any)[props.character] = 3;
        await inventoryStore.setEquippedData(data.echo4Id, equippedData);
      }
      if (data.echo5Id) {
        const echo5Data = await inventoryStore.getEchoById(data.echo5Id);
        (echoData as any)[4] = echo5Data;
        const equippedData = {};
        (equippedData as any)[props.character] = 4;
        await inventoryStore.setEquippedData(data.echo5Id, equippedData);
      }
      await characterStore.setCharacterEchoes(props.character, echoData);
      triggerCloseModal();
    }

const hasDefaultEchoPresets = computed(() => defaultEchoPresets.value.length > 0);
const hasEchoPresets = computed(() => (echoPresets.value?.length ?? 0) > 0);

onMounted(async () => {
  const characterData = await getCharByName(props.character);
  defaultEchoPresets.value = characterData?.echoes ?? [];
});

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>
