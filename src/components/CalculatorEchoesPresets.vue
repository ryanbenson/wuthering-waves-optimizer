<template>
  <AppModal
    id="modal-echoes-presets"
    ref="modalRef"
    :title="isV3 ? 'Echo presets' : 'Choose a preset to apply to your build'"
    max-width-class="max-w-5xl">
    <!--
      Cards only mount while the dialog is open (AppModal is lazy).
      This component itself is mounted for the whole time the Echoes tab is,
      and each v3 card runs real damage/stat calculations against the
      character's *current* build — computed once at mount they went stale
      (or ran before data was ready) and showed the wrong diff. Mounting on
      open recomputes against the live build every time, same approach as
      CalculatorManageBuilds.vue. Only the active tab's cards mount, so
      opening the modal doesn't run previews for a tab nobody is looking at.
    -->
    <div role="tablist" class="tabs tabs-bordered">
      <input
        type="radio"
        name="echoes_presets_tabs"
        role="tab"
        class="tab whitespace-nowrap"
        :aria-label="mineTabLabel"
        :checked="activeTab === 'mine'"
        data-test-echo-presets-tab="mine"
        @change="activeTab = 'mine'" />
      <div role="tabpanel" class="tab-content mt-6">
        <template v-if="activeTab === 'mine'">
          <div
            v-if="!hasEchoPresets && isV3"
            class="flex flex-col items-start gap-3 rounded-lg bg-base-200 p-4"
            data-test-echo-presets-mine-empty>
            <p>
              You haven't saved any presets yet. Set up your echoes, then use
              <strong>Presets → Save current echoes</strong> to keep them.
            </p>
            <button
              v-if="hasDefaultEchoPresets"
              type="button"
              class="btn btn-sm btn-outline btn-primary"
              data-test-echo-presets-browse-community
              @click="activeTab = 'community'">
              Browse {{ defaultEchoPresets.length }} theorycrafter
              {{ defaultEchoPresets.length === 1 ? "build" : "builds" }}
            </button>
          </div>
          <p v-else-if="!hasEchoPresets">No echo presets available</p>
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
        </template>
      </div>

      <input
        type="radio"
        name="echoes_presets_tabs"
        role="tab"
        class="tab whitespace-nowrap"
        :aria-label="communityTabLabel"
        :checked="activeTab === 'community'"
        data-test-echo-presets-tab="community"
        @change="activeTab = 'community'" />
      <div role="tabpanel" class="tab-content mt-6">
        <template v-if="activeTab === 'community'">
          <p v-if="isV3 && hasDefaultEchoPresets" class="text-sm opacity-80 mb-4" data-test-echo-presets-community-intro>
            Baseline theorycrafter builds from the community. Use one as a
            reference, or as a quick setup for a support or healer you don't
            want to build by hand.
          </p>
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
        </template>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import EchoCustomPreset from "./EchoCustomPreset.vue";
import EchoPresetV3Card from "./EchoPresetV3Card.vue";
import AppModal from "./AppModal.vue";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import {
  useCommunityEchoPresets,
  type EchoPresetsOpenOptions,
  type EchoPresetsTab,
} from "../composables/useCommunityEchoPresets";
import { trackEvent } from "../utils/analytics";

const props = defineProps<{ character: string }>();

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const { echoPresets } = storeToRefs(inventoryStore);

const settingsStore = useSettingsStore() as any;
const isV3 = computed(() => isV3UiEnabled(settingsStore));

const activeTab = ref<EchoPresetsTab>("mine");
const openSource = ref("header");

const mineTabLabel = computed(() =>
  isV3.value ? `My presets (${echoPresets.value?.length ?? 0})` : "My Presets",
);
const communityTabLabel = computed(() =>
  isV3.value ? `Theorycrafter builds (${defaultEchoPresets.value.length})` : "Other Presets",
);

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

const defaultEchoPresets = useCommunityEchoPresets(() => props.character);
const applyingPresetId = ref<string | null>(null);
const MIN_APPLYING_MS = 150;

function waitForUiPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
}

const modalRef = ref<InstanceType<typeof AppModal> | null>(null);

const hasDefaultEchoPresets = computed(() => defaultEchoPresets.value.length > 0);
const hasEchoPresets = computed(() => (echoPresets.value?.length ?? 0) > 0);

/**
 * v3 opens on "My presets" unless it would be empty and there are
 * theorycrafter builds to show instead. Classic always opens on its first tab.
 */
function resolveInitialTab(requested?: EchoPresetsTab): EchoPresetsTab {
  if (requested) return requested;
  if (isV3.value && !hasEchoPresets.value && hasDefaultEchoPresets.value) return "community";
  return "mine";
}

function triggerOpenModal(options: EchoPresetsOpenOptions = {}) {
  activeTab.value = resolveInitialTab(options.tab);
  openSource.value = options.source ?? "header";
  modalRef.value?.triggerOpenModal();
}
function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
}
async function applyPreset(presetData: any) {
  const data = JSON.parse(JSON.stringify(presetData)); // clone so we don't use the raw data
  await characterStore.setCharacterEchoes(props.character, {}); // flush first
  await characterStore.setCharacterEchoes(props.character, data.data.echoes);
  await inventoryStore.removeCharacterFromAllEquipped(props.character);
  trackEvent("echo-preset-applied", { kind: "community", source: openSource.value });
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
    trackEvent("echo-preset-applied", { kind: "custom", source: openSource.value });

    const remaining = MIN_APPLYING_MS - (Date.now() - startedAt);
    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }

    triggerCloseModal();
  } finally {
    applyingPresetId.value = null;
  }
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>
