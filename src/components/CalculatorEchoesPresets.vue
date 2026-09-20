<template>
  <dialog id="modal-echoes-presets" class="modal" @close="isOpen = false">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box max-w-5xl">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <!--
        Cards only mount while the dialog is open. This component itself is
        mounted for the whole time the Echoes tab is, and each v3 card runs
        real damage/stat calculations against the character's *current*
        build — computed once at mount they went stale (or ran before data
        was ready) and showed the wrong diff. Mounting on open recomputes
        against the live build every time, same approach as
        CalculatorManageBuilds.vue.
      -->
      <div v-if="isOpen" class="py-4">
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
              <template v-if="isV3">
                <EchoPresetV3Card
                  v-for="echoPreset in echoPresets"
                  :key="echoPreset.presetId"
                  :character="character"
                  :name="echoPreset.name"
                  :description="echoPreset.description"
                  :slots="presetSlots(echoPreset)"
                  :is-applying="applyingPresetId === echoPreset.presetId"
                  deletable
                  @apply="applyCustomPreset(echoPreset)"
                  @delete="deleteCustomPreset(echoPreset.presetId)" />
              </template>
              <EchoCustomPreset
                v-else
                v-for="echoPreset in echoPresets"
                :key="echoPreset.name"
                :preset-id="echoPreset.presetId"
                :name="echoPreset.name"
                :echo-1-id="echoPreset.echo1Id"
                :echo-2-id="echoPreset.echo2Id"
                :echo-3-id="echoPreset.echo3Id"
                :echo-4-id="echoPreset.echo4Id"
                :echo-5-id="echoPreset.echo5Id"
                :is-applying="applyingPresetId === echoPreset.presetId"
                @apply="applyCustomPreset(echoPreset)" />
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
              <template v-if="isV3">
                <EchoPresetV3Card
                  v-for="defaultEchoPreset in defaultEchoPresets"
                  :key="defaultEchoPreset.name"
                  :character="character"
                  :name="defaultEchoPreset.name"
                  :description="defaultEchoPreset.description"
                  :author="defaultEchoPreset.author"
                  :slots="defaultEchoPreset.data?.echoes ?? {}"
                  @apply="applyPreset(defaultEchoPreset)" />
              </template>
              <div
                v-else
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
import { computed, nextTick, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { getCharByName } from "../characters/characters.ts";
import EchoCustomPreset from "./EchoCustomPreset.vue";
import EchoPresetV3Card from "./EchoPresetV3Card.vue";
import { useSettingsStore } from "../stores/settings";
const props = defineProps<{ character: string }>();

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const { echoPresets } = storeToRefs(inventoryStore);

const settingsStore = useSettingsStore() as any;
const isV3 = computed(() => settingsStore.labs?.liveResultBar?.isEnabled ?? false);

// Stable per-preset slot maps (keyed by presetId) so the card's preview
// watcher doesn't re-run on every parent render.
const slotsCache = new Map<string, { key: string; slots: Record<number, any> }>();
function presetSlots(preset: any): Record<number, any> {
  const ids = [preset.echo1Id, preset.echo2Id, preset.echo3Id, preset.echo4Id, preset.echo5Id];
  const key = ids.join("|");
  const cached = slotsCache.get(preset.presetId);
  if (cached?.key === key) return cached.slots;
  const slots: Record<number, any> = {};
  ids.forEach((echoId, i) => {
    if (echoId) slots[i] = { echoId };
  });
  slotsCache.set(preset.presetId, { key, slots });
  return slots;
}

// Mirrors EchoCustomPreset's delete: unequip from any character using it first.
async function deleteCustomPreset(presetId: string) {
  for (const char of inventoryStore.getEchoPresetCharacters(presetId)) {
    await inventoryStore.deleteEquippedPreset(char);
    await characterStore.setCharacterData(char, { echoPresetId: null });
  }
  await inventoryStore.deleteEchoPreset(presetId);
}

const defaultEchoPresets = ref<any[]>([]);
const applyingPresetId = ref<string | null>(null);
const MIN_APPLYING_MS = 150;

function waitForUiPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
}

const isOpen = ref(false);

function triggerOpenModal() {
  isOpen.value = true;
  const modalEl = document.getElementById("modal-echoes-presets");
  (modalEl as HTMLDialogElement | null)?.showModal();
}
function triggerCloseModal() {
  isOpen.value = false;
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
  if (applyingPresetId.value) {
    return;
  }

  applyingPresetId.value = presetData.presetId;
  const startedAt = Date.now();

  await nextTick();
  await waitForUiPaint();

  try {
    inventoryStore.applyEchoPreset(props.character, presetData);

    const remaining = MIN_APPLYING_MS - (Date.now() - startedAt);
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    triggerCloseModal();
  } finally {
    applyingPresetId.value = null;
  }
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
