<template>
  <dialog id="modal-manage-builds" class="modal" @close="handleDialogClose">
    <form method="dialog" class="modal-backdrop" @click="triggerCloseModal">
      <button>close</button>
    </form>
    <div class="modal-box max-w-2xl">
      <form method="dialog" @click="triggerCloseModal">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          data-test-manage-builds-close>
          ✕
        </button>
      </form>
      <h3 class="font-bold text-lg mb-4">{{ mode === "pick" ? "Choose Build" : "Manage Builds" }}</h3>

      <!-- Rows (and their CalculatorBuildPreviewRow children) only mount
      while the dialog is actually open: this component itself is mounted
      continuously (e.g. inside CalculatorCharacterSelect for the whole time
      the Calculator page is open), and each preview does real async work
      (weapon lookup, a full buildCharacterCalculationContext call) — gating
      on isOpen keeps that work from running in the background on every
      character/build edit, and doubles as the mechanism that keeps a
      re-opened modal's previews fresh (they naturally recompute against
      current data on every mount, so no extra reactivity wiring is needed
      here to catch build data changing while the modal was closed). -->
      <div v-if="isOpen" class="flex flex-col gap-2">
        <button
          v-if="mode === 'pick'"
          type="button"
          class="flex flex-col items-start gap-1 p-2 rounded-box border border-dashed bg-base-200 text-left"
          :class="{ 'border-primary': !selectedBuildId }"
          data-test-build-picker-active-option
          @click="handleSelect(null)">
          <span class="font-semibold text-sm">Follow active build</span>
          <span class="text-xs opacity-70">
            Uses whichever build is active for this character ({{ activeBuild?.name ?? "none" }}) —
            stays in sync if the active build changes later.
          </span>
        </button>

        <div
          v-for="build in builds"
          :key="build.id"
          class="flex flex-col gap-2 p-2 rounded-box bg-base-200"
          :class="{
            'border-2 border-primary': build.id === activeBuildId,
            'bg-base-300': mode === 'pick' && build.id === selectedBuildId && build.id !== activeBuildId,
          }"
          :data-test-manage-builds-row="build.name">
          <div class="flex items-center gap-2">
            <template v-if="mode === 'manage'">
              <input
                :value="build.name"
                type="text"
                class="input input-bordered input-sm flex-1 min-w-0"
                :data-test-manage-builds-name="build.id"
                @input="handleRename(build.id, ($event.target as HTMLInputElement).value)" />
              <span v-if="build.id === activeBuildId" class="badge badge-primary badge-sm shrink-0">
                Active
              </span>
              <button
                v-else
                type="button"
                class="btn btn-ghost btn-xs shrink-0"
                :data-test-manage-builds-equip="build.id"
                @click="handleEquip(build.id)">
                Equip
              </button>
              <button
                type="button"
                class="btn btn-ghost btn-xs shrink-0"
                :class="{ 'text-error': builds.length > 1 }"
                :disabled="builds.length <= 1"
                :title="builds.length <= 1 ? 'Can\'t delete your only build' : 'Delete build'"
                :data-test-manage-builds-delete="build.id"
                @click="handleDelete(build.id, build.name)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-4">
                  <path
                    d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                    fill="currentColor" />
                </svg>
              </button>
            </template>
            <template v-else>
              <span class="flex-1 min-w-0 font-semibold text-sm truncate">
                {{ build.name }}
              </span>
              <span v-if="build.id === activeBuildId" class="badge badge-ghost badge-sm shrink-0">
                Active
              </span>
              <button
                type="button"
                class="btn btn-primary btn-xs shrink-0"
                :data-test-build-picker-select="build.id"
                @click="handleSelect(build.id)">
                Use This Build
              </button>
            </template>
          </div>
          <CalculatorBuildPreviewRow :character-id="character" :build-id="build.id" />
        </div>
      </div>

      <template v-if="mode === 'manage'">
        <div class="divider my-3"></div>

        <div class="flex flex-wrap items-center gap-2">
          <input
            v-model.trim="newBuildName"
            type="text"
            placeholder="New build name"
            class="input input-bordered input-sm flex-1 min-w-0"
            data-test-manage-builds-new-name />
          <button
            type="button"
            class="btn btn-primary btn-sm"
            data-test-manage-builds-create-active
            @click="handleCreate('active')">
            Duplicate Active
          </button>
          <button
            type="button"
            class="btn btn-sm"
            data-test-manage-builds-create-blank
            @click="handleCreate('blank')">
            Start Blank
          </button>
        </div>
      </template>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useCharacterStore } from "../stores/character";
import { useConfirm } from "../composables/useConfirm";
import CalculatorBuildPreviewRow from "./CalculatorBuildPreviewRow.vue";

defineOptions({ name: "CalculatorManageBuilds" });

interface Props {
  character: string;
  /**
   * "manage" (default, Character view): rename/delete/create/equip.
   * "pick" (Team Rotations' per-slot build override): read-only rich
   * preview + a select action per build, plus a "follow active build"
   * pseudo-option — no create/delete, since creating a build here would
   * silently re-equip it as the character's active build elsewhere
   * (`createBuild` always equips), violating "picking a build for a team
   * slot never changes the character's own active build" (issue #278).
   */
  mode?: "manage" | "pick";
  /** "pick" mode only: the slot's currently-pinned build id, or null/undefined for "follow active". */
  selectedBuildId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "manage",
  selectedBuildId: null,
});

const emit = defineEmits<{
  "select-build": [buildId: string | null];
}>();

const characterStore = useCharacterStore();
const { confirm } = useConfirm();

const newBuildName = ref("");
const isOpen = ref(false);

const builds = computed(() => characterStore.getBuilds(props.character));
const activeBuildId = computed(() => characterStore.getActiveBuildId(props.character));
const activeBuild = computed(() => characterStore.getActiveBuild(props.character));

function handleRename(buildId: string, name: string) {
  characterStore.renameBuild(props.character, buildId, name);
}

function handleEquip(buildId: string) {
  characterStore.equipBuild(props.character, buildId);
}

function handleSelect(buildId: string | null) {
  emit("select-build", buildId);
  triggerCloseModal();
}

async function handleDelete(buildId: string, buildName: string) {
  if (builds.value.length <= 1) {
    return;
  }
  const confirmed = await confirm(`Do you really want to delete "${buildName}"?`, {
    title: "Delete build",
    confirmLabel: "Delete",
    variant: "error",
  });
  if (!confirmed) {
    return;
  }
  characterStore.deleteBuild(props.character, buildId);
}

function handleCreate(from: "active" | "blank") {
  characterStore.createBuild(props.character, newBuildName.value, { from });
  newBuildName.value = "";
}

function triggerOpenModal() {
  const modalEl = document.getElementById("modal-manage-builds") as HTMLDialogElement | null;
  modalEl?.showModal();
  isOpen.value = true;
}

function triggerCloseModal() {
  const modalEl = document.getElementById("modal-manage-builds") as HTMLDialogElement | null;
  modalEl?.close();
  isOpen.value = false;
}

// Catches every way the native <dialog> can close that doesn't go through
// triggerCloseModal (Escape key, or the browser's own default handling of
// the backdrop <form method="dialog">) — same reasoning as
// ConfirmDialog.vue's own handleDialogClose.
function handleDialogClose() {
  isOpen.value = false;
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>
