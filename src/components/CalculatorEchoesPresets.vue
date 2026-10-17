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
        CalculatorManageBuilds.vue. Only the active source's cards mount, so
        opening the modal doesn't run previews for a list nobody is looking at.
      -->
      <div v-if="isOpen && isV3" class="flex flex-col gap-4 py-4">
        <div class="flex flex-col gap-0.5">
          <h3 class="text-xl font-bold">Echo presets</h3>
          <p class="text-sm opacity-70">{{ character }}</p>
        </div>

        <div
          class="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-base-200 p-3"
          data-test-echo-presets-current>
          <div class="flex min-w-0 flex-col gap-0.5">
            <span class="text-xs opacity-70">Current echoes</span>
            <span class="truncate font-semibold">{{ currentTitle }}</span>
            <span v-if="currentDetail" class="text-xs" :class="status.kind === 'edited' ? 'text-warning' : 'opacity-70'">
              {{ currentDetail }}
            </span>
          </div>
          <button
            v-if="canSaveCurrent"
            type="button"
            class="btn btn-sm btn-primary"
            data-test-echo-presets-save
            @click="handleSave">
            Save as preset
          </button>
        </div>

        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2" role="group" aria-label="Preset source">
          <button
            v-for="source in sources"
            :key="source.key"
            type="button"
            class="flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-colors"
            :class="activeTab === source.key ? source.activeClass : 'border-base-300 hover:border-base-content/30'"
            :aria-pressed="activeTab === source.key"
            :data-test-echo-presets-tab="source.key"
            @click="activeTab = source.key">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-lg" :class="source.iconClass">
              <svg
                v-if="source.key === 'mine'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="size-[18px]"
                fill="currentColor"
                stroke="currentColor"
                stroke-width="2"
                stroke-linejoin="round"
                aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="size-[18px]"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <span class="flex min-w-0 flex-col gap-1">
              <span class="flex items-center gap-2 font-bold">
                {{ source.title }}
                <span class="text-xs font-semibold opacity-60">{{ source.count }}</span>
              </span>
              <span class="text-xs leading-relaxed opacity-80">{{ source.description }}</span>
            </span>
          </button>
        </div>

        <template v-if="activeTab === 'mine'">
          <div
            v-if="!hasEchoPresets"
            class="flex flex-col items-start gap-3 rounded-lg border border-dashed border-base-content/20 p-5"
            data-test-echo-presets-mine-empty>
            <p class="font-semibold">No saved presets yet</p>
            <p class="max-w-xl text-sm opacity-80">
              A preset remembers which five echoes from your inventory a character
              uses, so you can switch between builds or share echoes between
              characters without picking them again.
            </p>
            <div class="flex flex-wrap gap-2">
              <button v-if="canSaveCurrent" type="button" class="btn btn-sm btn-primary" @click="handleSave">
                Save current echoes as a preset
              </button>
              <button
                v-if="hasDefaultEchoPresets"
                type="button"
                class="btn btn-sm btn-outline"
                data-test-echo-presets-browse-community
                @click="activeTab = 'community'">
                See theorycrafter builds
              </button>
            </div>
          </div>
          <template v-else>
            <p class="text-sm opacity-70">Your presets are shared across all your characters.</p>
            <div class="echoes-presets-list">
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
                @delete="deleteCustomPreset(echoPreset.presetId)">
                <template #aside>
                  <span
                    v-if="appliedPresetId === echoPreset.presetId"
                    class="badge badge-success badge-outline text-nowrap"
                    data-test-echo-preset-applied>
                    {{ status.kind === "edited" ? "Applied, changed" : "Applied" }}
                  </span>
                  <span class="text-xs opacity-60">{{ equippedOnLabel(echoPreset.presetId) }}</span>
                </template>
              </EchoPresetV3Card>
            </div>
          </template>
        </template>

        <template v-else>
          <p v-if="!hasDefaultEchoPresets">No theorycrafter builds for this character yet.</p>
          <template v-else>
            <p class="text-sm opacity-70" data-test-echo-presets-community-intro>
              Use one as a target to compare against, or as a quick setup for a
              support or healer you don't want to build by hand.
            </p>
            <div class="echoes-presets-list">
              <EchoPresetV3Card
                v-for="defaultEchoPreset in defaultEchoPresets"
                :key="defaultEchoPreset.name"
                :character="character"
                :name="defaultEchoPreset.name"
                :description="defaultEchoPreset.description"
                :author="defaultEchoPreset.author"
                :slots="defaultEchoPreset.data?.echoes ?? {}"
                @apply="applyPreset(defaultEchoPreset)" />
            </div>
          </template>
        </template>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-base-content/10 pt-3 text-xs">
          <button type="button" class="link link-primary" data-test-echo-presets-guide @click="handleGuide">
            How presets work
          </button>
          <span class="opacity-60">The damage badge on each preset compares it with your current echoes.</span>
        </div>
      </div>

      <div v-else-if="isOpen" class="py-4">
        <h3 class="text-xl mb-4">Choose a preset to apply to your build</h3>
        <div role="tablist" class="tabs tabs-bordered">
          <input
            type="radio"
            name="echoes_presets_tabs"
            role="tab"
            class="tab whitespace-nowrap"
            aria-label="My Presets"
            :checked="activeTab === 'mine'"
            data-test-echo-presets-tab="mine"
            @change="activeTab = 'mine'" />
          <div role="tabpanel" class="tab-content mt-6">
            <template v-if="activeTab === 'mine'">
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
            aria-label="Other Presets"
            :checked="activeTab === 'community'"
            data-test-echo-presets-tab="community"
            @change="activeTab = 'community'" />
          <div role="tabpanel" class="tab-content mt-6">
            <template v-if="activeTab === 'community'">
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
            </template>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import EchoCustomPreset from "./EchoCustomPreset.vue";
import EchoPresetV3Card from "./EchoPresetV3Card.vue";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import {
  useCommunityEchoPresets,
  type EchoPresetsOpenOptions,
  type EchoPresetsTab,
} from "../composables/useCommunityEchoPresets";
import { useEchoPresetStatus } from "../composables/useEchoPresetStatus";
import { trackEvent } from "../utils/analytics";

const props = defineProps<{ character: string }>();
const emit = defineEmits<{
  /** Open the save-preset dialog for the current echoes. */
  save: [];
  /** Open the presets guide. */
  guide: [];
}>();

const characterStore = useCharacterStore();
const inventoryStore = useInventoryStore();
const { echoPresets } = storeToRefs(inventoryStore);

const settingsStore = useSettingsStore() as any;
const isV3 = computed(() => isV3UiEnabled(settingsStore));

const activeTab = ref<EchoPresetsTab>("mine");
const openSource = ref("header");

const status = useEchoPresetStatus(() => props.character);

const sources = computed(() => [
  {
    key: "mine" as const,
    title: "My presets",
    count: echoPresets.value?.length ?? 0,
    description: "Echoes from your own inventory. Applying equips those exact echoes.",
    activeClass: "border-primary bg-primary/5",
    iconClass: "bg-primary/15 text-primary",
  },
  {
    key: "community" as const,
    title: "Theorycrafter builds",
    count: defaultEchoPresets.value.length,
    description:
      "Recommended reference builds for this character. Applying fills your slots with idealized echoes, so your inventory isn't touched.",
    activeClass: "border-accent bg-accent/5",
    iconClass: "bg-accent/15 text-accent",
  },
]);

const currentTitle = computed(() => {
  const current = status.value;
  if (current.kind === "empty") return "No echoes equipped";
  if (current.kind === "unsaved") return "Unsaved build";
  if (current.kind === "theorycrafter") return `Theorycrafter: ${current.name}`;
  return `My preset: ${current.name}`;
});

const currentDetail = computed(() => {
  const current = status.value;
  if (current.kind === "edited") {
    return `${current.changedSlots} ${current.changedSlots === 1 ? "echo" : "echoes"} changed since you applied it.`;
  }
  if (current.kind === "theorycrafter" && current.author) return `by ${current.author}`;
  return null;
});

// Matching a saved preset already has nothing new to save.
const canSaveCurrent = computed(() => status.value.kind !== "empty" && status.value.kind !== "active");

const appliedPresetId = computed(() =>
  status.value.kind === "active" || status.value.kind === "edited" ? status.value.presetId : null,
);

function equippedOnLabel(presetId: string) {
  const characters = inventoryStore.getEchoPresetCharacters(presetId) as string[];
  return characters.length ? `Equipped on ${characters.join(", ")}` : "Not equipped";
}

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

const isOpen = ref(false);

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
  isOpen.value = true;
  const modalEl = document.getElementById("modal-echoes-presets");
  (modalEl as HTMLDialogElement | null)?.showModal();
  trackEvent("echo-presets-opened", { source: openSource.value, tab: activeTab.value });
}
function triggerCloseModal() {
  isOpen.value = false;
  const modalEl = document.getElementById("modal-echoes-presets");
  (modalEl as HTMLDialogElement | null)?.close();
}
function handleClose() {
  triggerCloseModal();
}
function handleSave() {
  triggerCloseModal();
  emit("save");
}
function handleGuide() {
  triggerCloseModal();
  emit("guide");
}
async function applyPreset(presetData: any) {
  const data = JSON.parse(JSON.stringify(presetData)); // clone so we don't use the raw data
  await characterStore.setCharacterEchoes(props.character, {}); // flush first
  await characterStore.setCharacterEchoes(props.character, data.data.echoes);
  await inventoryStore.removeCharacterFromAllEquipped(props.character);
  // These echoes aren't the saved preset's any more; remember the build they came from instead.
  await inventoryStore.deleteEquippedPreset(props.character);
  await characterStore.setCharacterData(props.character, {
    echoPresetId: null,
    echoPresetSource: { name: data.name, author: data.author ?? null },
  });
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
    await characterStore.setCharacterData(props.character, { echoPresetSource: null });
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
