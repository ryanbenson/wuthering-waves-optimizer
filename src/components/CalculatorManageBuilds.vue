<template>
  <dialog id="modal-manage-builds" class="modal">
    <form method="dialog" class="modal-backdrop" @click="triggerCloseModal">
      <button>close</button>
    </form>
    <div class="modal-box">
      <form method="dialog" @click="triggerCloseModal">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          data-test-manage-builds-close>
          ✕
        </button>
      </form>
      <h3 class="font-bold text-lg mb-4">Manage Builds</h3>

      <div class="flex flex-col gap-2">
        <div
          v-for="build in builds"
          :key="build.id"
          class="flex items-center gap-2 p-2 rounded-box"
          :class="{ 'bg-base-200': build.id === activeBuildId }"
          :data-test-manage-builds-row="build.name">
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
        </div>
      </div>

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
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useCharacterStore } from "../stores/character";
import { useConfirm } from "../composables/useConfirm";

defineOptions({ name: "CalculatorManageBuilds" });

interface Props {
  character: string;
}

const props = defineProps<Props>();

const characterStore = useCharacterStore();
const { confirm } = useConfirm();

const newBuildName = ref("");

const builds = computed(() => characterStore.getBuilds(props.character));
const activeBuildId = computed(() => characterStore.getActiveBuildId(props.character));

function handleRename(buildId: string, name: string) {
  characterStore.renameBuild(props.character, buildId, name);
}

function handleEquip(buildId: string) {
  characterStore.equipBuild(props.character, buildId);
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
}

function triggerCloseModal() {
  const modalEl = document.getElementById("modal-manage-builds") as HTMLDialogElement | null;
  modalEl?.close();
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>
