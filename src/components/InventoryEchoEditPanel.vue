<template>
  <CalculatorEchoEditPanel
    context="inventory"
    :echo-id="echoId"
    :is-open="isOpen"
    @close="handleClose"
    @open-weights-editor="emit('open-weights-editor')"></CalculatorEchoEditPanel>
</template>

<script setup lang="ts">
// Labs-flagged replacement for InventoryEchoEdit.vue, used only when the
// liveResultBar flag is on (see docs/adr/0014). Exposes the same
// {setEchoId, handleOpenModal} API as InventoryEchoEdit.vue so
// InventoryEchoesBrowser.vue's call sites work unchanged regardless of
// which of the two is actually mounted.
import { ref } from "vue";
import CalculatorEchoEditPanel from "./CalculatorEchoEditPanel.vue";

defineOptions({ name: "InventoryEchoEditPanel" });

const emit = defineEmits<{ "open-weights-editor": [] }>();

const echoId = ref<string | null>(null);
const isOpen = ref(false);

function setEchoId(id: string | null) {
  echoId.value = id;
}
function handleOpenModal() {
  isOpen.value = true;
}
function handleClose() {
  isOpen.value = false;
}

defineExpose({ setEchoId, handleOpenModal });
</script>
