<template>
  <CalculatorEchoEditPanel
    context="inventory"
    :echo-id="echoId"
    :is-open="isOpen"
    :reference-image-url="referenceImageUrl"
    @close="handleClose"></CalculatorEchoEditPanel>
</template>

<script setup lang="ts">
// Labs-flagged replacement for InventoryEchoEdit.vue, used only when the
// liveResultBar flag is on (see docs/adr/0014). Exposes the same
// {setEchoId, setReferenceImage, handleOpenModal} API as InventoryEchoEdit.vue so
// InventoryEchoesBrowser.vue's call sites work unchanged regardless of
// which of the two is actually mounted.
import { ref } from "vue";
import CalculatorEchoEditPanel from "./CalculatorEchoEditPanel.vue";

defineOptions({ name: "InventoryEchoEditPanel" });

const echoId = ref<string | null>(null);
const isOpen = ref(false);
const referenceImageUrl = ref<string | null>(null);

function setEchoId(id: string | null) {
  echoId.value = id;
}
/** The scanner's in-game capture for this echo — cleared on close so it never shows for a later, unrelated edit. */
function setReferenceImage(url: string | null) {
  referenceImageUrl.value = url;
}
function handleOpenModal() {
  isOpen.value = true;
}
function handleClose() {
  isOpen.value = false;
  referenceImageUrl.value = null;
}

defineExpose({ setEchoId, setReferenceImage, handleOpenModal });
</script>
