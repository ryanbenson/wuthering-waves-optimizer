<template>
  <AppModal
    ref="modalRef"
    title="Save echo preset"
    max-width-class="max-w-lg"
    :lazy="false"
    :sheet="false"
    @close="reset">
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
      <div v-if="isV3" class="label mt-2">
        <span class="label-text">Description (optional)</span>
      </div>
      <textarea
        v-if="isV3"
        v-model.trim="echoPresetDescription"
        rows="3"
        maxlength="500"
        placeholder="What is this build for?"
        data-test-echo-preset-description
        class="textarea textarea-bordered w-full"></textarea>
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
  </AppModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import AppModal from "./AppModal.vue";

defineOptions({ name: "CalculatorSaveEchoesPreset" });

const emit = defineEmits<{
  "on-save-echo-preset": [payload: { name: string | null; description: string }];
}>();

const inventoryStore = useInventoryStore();

const settingsStore = useSettingsStore() as any;
const isV3 = computed(() => isV3UiEnabled(settingsStore));

const echoPresetName = ref<string | null>(null);
const echoPresetDescription = ref("");
const existingPreset = ref<string | null>(null);

const existingEchoPresetName = computed(() => {
  const id = existingPreset.value;
  if (!id) return "";
  const data = inventoryStore.getEchoPresetData(id) as { name?: string } | undefined;
  return data?.name ?? "";
});

const modalRef = ref<InstanceType<typeof AppModal> | null>(null);

function triggerOpenModal() {
  modalRef.value?.triggerOpenModal();
}

function reset() {
  echoPresetName.value = null;
  echoPresetDescription.value = "";
  existingPreset.value = null;
}

function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
  reset();
}

function handleSavePreset() {
  emit("on-save-echo-preset", {
    name: echoPresetName.value,
    description: isV3.value ? echoPresetDescription.value : "",
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
