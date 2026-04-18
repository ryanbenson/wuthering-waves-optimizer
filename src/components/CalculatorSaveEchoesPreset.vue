<template>
  <dialog id="modal-save-echo-preset" class="modal">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div class="modal-box">
      <form method="dialog" @click="handleClose">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div class="py-4">
        <div
          v-if="existingPreset"
          role="alert"
          class="alert alert-warning p-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span
            >You already have a preset with these echoes:
            {{ existingEchoPresetName }}</span
          >
        </div>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Give your preset a name</span>
          </div>
          <input
            type="text"
            v-model.trim="echoPresetName"
            class="input input-bordered w-full" />
          <div class="label">
            <span class="label-text-alt"
              >Any unsaved echoes will be saved to your inventory.</span
            >
          </div>
        </label>
        <button class="btn btn-primary btn-sm mt-4" @click="handleSavePreset">
          Save
        </button>
        <div></div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useInventoryStore } from "../stores/inventory";

defineOptions({ name: "CalculatorSaveEchoesPreset" });

const emit = defineEmits<{
  "on-save-echo-preset": [payload: { name: string | null }];
}>();

const inventoryStore = useInventoryStore();

const echoPresetName = ref<string | null>(null);
const existingPreset = ref<string | null>(null);

const existingEchoPresetName = computed(() => {
  const id = existingPreset.value;
  if (!id) return "";
  const data = inventoryStore.getEchoPresetData(id) as { name?: string } | undefined;
  return data?.name ?? "";
});

function triggerOpenModal() {
  const modalEl = document.getElementById(
    "modal-save-echo-preset",
  ) as HTMLDialogElement | null;
  modalEl?.showModal();
}

function reset() {
  echoPresetName.value = null;
  existingPreset.value = null;
}

function triggerCloseModal() {
  const modalEl = document.getElementById(
    "modal-save-echo-preset",
  ) as HTMLDialogElement | null;
  modalEl?.close();
  reset();
}

function handleClose() {
  reset();
  triggerCloseModal();
}

function handleSavePreset() {
  emit("on-save-echo-preset", {
    name: echoPresetName.value,
  });
  triggerCloseModal();
}

function setPresetName(name: string | null) {
  echoPresetName.value = name;
}

function setPresetId(presetId: string | null) {
  existingPreset.value = presetId;
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
  setPresetName,
  setPresetId,
});
</script>
