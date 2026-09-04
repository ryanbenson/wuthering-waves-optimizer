<template>
  <!--
    Teleported to <body> so the dialog never inherits clipping or stacking
    context from whatever panel happens to host the chooser (the weapon and
    enemy browsers sit deep inside cards with their own overflow rules).
  -->
  <Teleport to="body">
  <dialog ref="dialogEl" class="modal app-chooser-modal" @close="handleDialogClose">
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
    <div
      v-if="isOpen"
      class="modal-box app-chooser-modal__box flex flex-col p-0 gap-0"
      :class="maxWidthClass">
      <div class="flex items-center gap-2 px-4 pt-4 pb-3 shrink-0">
        <button
          v-if="showBack"
          type="button"
          class="btn btn-sm btn-ghost gap-1 px-2"
          data-test-chooser-modal-back
          @click="emit('back')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h3 class="text-lg font-semibold flex-1 min-w-0 truncate">{{ title }}</h3>
        <slot name="header-actions" />
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost shrink-0"
          aria-label="Close"
          v-bind="closeTestAttrs"
          @click="handleClose">
          ✕
        </button>
      </div>

      <div v-if="$slots.toolbar" class="px-4 pb-3 shrink-0">
        <slot name="toolbar" />
      </div>

      <div class="app-chooser-modal__body flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        <slot />
      </div>

      <div
        v-if="$slots.footer"
        class="shrink-0 border-t border-base-300 px-4 py-3 bg-base-100">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    /**
     * Name of the `data-test-*` attribute to stamp on the close button. Each
     * chooser keeps whatever selector its own e2e specs already reference —
     * renaming one would silently break `cypress/support/commands.ts`'s
     * shared character-select commands and the enemy/echo specs.
     */
    closeTestAttr?: string | null;
    showBack?: boolean;
    maxWidthClass?: string;
  }>(),
  {
    title: "",
    closeTestAttr: null,
    showBack: false,
    maxWidthClass: "max-w-5xl",
  },
);

const emit = defineEmits<{ close: []; back: [] }>();

const dialogEl = ref<HTMLDialogElement | null>(null);
const isOpen = ref(false);

const closeTestAttrs = computed(() =>
  props.closeTestAttr ? { [props.closeTestAttr]: "" } : {},
);

async function triggerOpenModal() {
  isOpen.value = true;
  await nextTick();
  dialogEl.value?.showModal();
}

function triggerCloseModal() {
  dialogEl.value?.close();
  isOpen.value = false;
}

/**
 * Esc and the native backdrop both fire `close` on the dialog itself without
 * going through `handleClose` — keep `isOpen` honest in that case, and let
 * the parent reset filter state the same way it would on an explicit close.
 */
function handleDialogClose() {
  if (!isOpen.value) return;
  isOpen.value = false;
  emit("close");
}

function handleClose() {
  triggerCloseModal();
  emit("close");
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>

<style scoped>
/*
 * Phone widths get a full-bleed sheet rather than a floating card: the list
 * is the whole point of these modals, and a centered box wastes ~30% of a
 * small screen on backdrop. Above `sm` it stays DaisyUI's normal centered
 * modal-box.
 */
@media (max-width: 639px) {
  .app-chooser-modal__box {
    max-width: 100%;
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}

/*
 * Wide content inside a chooser (a long substat row, a filter pill strip)
 * scrolls within its own container rather than pushing the dialog sideways.
 */
.app-chooser-modal__body {
  overflow-x: hidden;
  overscroll-behavior: contain;
}
</style>
