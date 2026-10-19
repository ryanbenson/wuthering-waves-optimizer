<template>
  <AppChooserModal
    ref="modalRef"
    :title="title"
    max-width-class="max-w-lg"
    close-test-attr="data-test-echo-odds-close"
    @close="emit('close')">
    <EchoTuneOddsTab :target="target" @edit-weights="handleEditWeights" />
  </AppChooserModal>
</template>

<script setup lang="ts">
// The "Odds" button on calculator and inventory echo tiles (and the
// inventory's edit panel) opens this: the echo's Tune odds (a partly tuned
// echo) or, in a build, the odds of a fresh echo beating it (a finished
// one — scored with the build's character, so the inventory doesn't offer
// Odds on finished echoes). Teleported
// to <body> by AppChooserModal, so its clicks never reach the calculator
// tile's own click-to-expand handler. See docs/adr/0044-echo-tuning-odds.md.
import { computed, ref } from "vue";
import { useEchoEditFields, type EchoEditTarget } from "../composables/useEchoEditFields";
import { ECHO_SUBSTAT_SLOTS } from "../echoes/tuningOdds";
import AppChooserModal from "./AppChooserModal.vue";
import EchoTuneOddsTab from "./EchoTuneOddsTab.vue";

defineOptions({ name: "EchoOddsDialog" });

const props = defineProps<{ target: EchoEditTarget }>();
const emit = defineEmits<{ close: []; "edit-weights": [] }>();

const { slots, echoName } = useEchoEditFields(() => props.target);
const title = computed(() => {
  const tunedCount = slots.filter((slot) => slot.type.value && slot.type.value !== "none").length;
  const finished = props.target.context === "build" && tunedCount >= ECHO_SUBSTAT_SLOTS;
  const label = finished ? "Better echo odds" : "Tune odds";
  return echoName.value ? `${label} · ${echoName.value}` : label;
});

const modalRef = ref<InstanceType<typeof AppChooserModal> | null>(null);

function open() {
  modalRef.value?.triggerOpenModal();
}

// The weights editor is its own dialog: close this one first so the two
// don't stack.
function handleEditWeights() {
  modalRef.value?.triggerCloseModal();
  emit("edit-weights");
}

defineExpose({ open });
</script>
