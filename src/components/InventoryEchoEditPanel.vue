<template>
  <CalculatorEchoEditPanel
    context="inventory"
    :echo-id="echoId"
    :is-open="isOpen"
    @close="isOpen = false"></CalculatorEchoEditPanel>
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

const echoId = ref<string | null>(null);
const isOpen = ref(false);

function setEchoId(id: string | null) {
  echoId.value = id;
}
function handleOpenModal() {
  isOpen.value = true;
}

defineExpose({ setEchoId, handleOpenModal });
</script>
