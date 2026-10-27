<template>
  <template v-if="isOpen">
    <div
      class="echo-edit-panel-scrim"
      data-test-echo-edit-panel-scrim
      @click="emit('close')"></div>
    <div
      ref="panelEl"
      class="echo-edit-panel flex flex-col focus:outline-none"
      :class="{ 'echo-edit-panel--inventory': context === 'inventory' }"
      data-test-echo-edit-panel
      tabindex="-1"
      @keydown.esc="emit('close')">
      <div class="echo-edit-panel__handle" aria-hidden="true"></div>

      <EchoEditHeader
        :target="target"
        :show-browse="context === 'build'"
        show-odds
        @close="emit('close')"
        @open-echoes-browser="emit('open-echoes-browser')"
        @open-odds="oddsDialogRef?.open()" />

      <EchoEditFields :target="target" />
    </div>
  </template>
  <EchoOddsDialog
    ref="oddsDialogRef"
    :target="target"
    @edit-weights="emit('open-weights-editor')" />
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import type { EchoEditTarget } from "../composables/useEchoEditFields";
import EchoEditFields from "./EchoEditFields.vue";
import EchoEditHeader from "./EchoEditHeader.vue";
import EchoOddsDialog from "./EchoOddsDialog.vue";

defineOptions({ name: "CalculatorEchoEditPanel" });

const props = defineProps<{
  context: "build" | "inventory";
  echoId: string | null;
  character?: string;
  index?: number;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  "open-echoes-browser": [];
  "open-weights-editor": [];
}>();

const target = computed<EchoEditTarget>(() =>
  props.context === "build"
    ? { context: "build", character: props.character ?? "", index: props.index ?? 0 }
    : { context: "inventory", echoId: props.echoId },
);

// The header's "Odds" button opens the echo's odds in a dialog.
const oddsDialogRef = ref<InstanceType<typeof EchoOddsDialog> | null>(null);

// Focus the panel on open so Escape (bound via @keydown.esc on this element)
// actually has something to bubble from.
const panelEl = ref<HTMLElement | null>(null);
watch(
  () => props.isOpen,
  async (open) => {
    if (!open) return;
    await nextTick();
    panelEl.value?.focus();
  },
);

// The panel's own content scrolls independently of the page behind it —
// without this, a tall page (the inventory grid, or the build strip) keeps
// its own scrollbar active at the same time, which reads as two scrollbars
// fighting for the same edge of the screen. Restores whatever value was
// there before (not a hardcoded "auto") so this doesn't fight
// AppLayout.vue's own route-based body-scroll rule on close.
let previousBodyOverflow: string | null = null;
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (previousBodyOverflow !== null) {
      document.body.style.overflow = previousBodyOverflow;
      previousBodyOverflow = null;
    }
  },
);
onUnmounted(() => {
  if (previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow;
  }
});

// Header chrome (EchoEditHeader.vue, which also owns the echo/set picker)
// stays separate from the field-editing body (EchoEditFields.vue) — see
// docs/adr/0030-echoes-tab-v3-redesign.md decision #6. Both self-source via
// useEchoEditFields(target) rather than prop-drilling a dozen refs.
</script>

<style scoped>
/*
 * Base styling docks as a flex child (build context — the parent supplies
 * a flex row so this actually pushes the build strip aside on desktop).
 * --inventory overrides this to a self-contained fixed panel, since the
 * Inventory page has no equivalent flex ancestor to dock against.
 */
.echo-edit-panel {
  flex: 0 0 380px;
  min-width: 0;
  border-left: 1px solid oklch(var(--b3));
  background: oklch(var(--b1));
}

.echo-edit-panel--inventory {
  /* AppLayout.vue's nav is itself `position: fixed` at z-50, --nav-h tall
     (its content offsets below it by the same) — this needs to clear it the
     same way, not just out-z-index it, or it'd cover the nav instead. */
  position: fixed;
  top: var(--nav-h);
  right: 0;
  bottom: var(--nav-bottom-h);
  width: 380px;
  max-width: 100%;
  z-index: 51;
  box-shadow: -12px 0 30px rgba(0, 0, 0, 0.15);
}

.echo-edit-panel-scrim {
  display: none;
}

.echo-edit-panel__handle {
  display: none;
}

@media (max-width: 768px) {
  .echo-edit-panel-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 49;
  }

  .echo-edit-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    flex: none;
    width: 100%;
    max-height: 80vh;
    border-left: none;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 -12px 30px rgba(0, 0, 0, 0.25);
    z-index: 50;
  }

  .echo-edit-panel__handle {
    display: block;
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: oklch(var(--b3));
    margin: 8px auto 0;
    flex: none;
  }
}
</style>
