<template>
  <Teleport :to="host">
    <!--
      A manual popover, not a modal <dialog>: popovers sit in the top layer
      (above open modals) without making the rest of the page inert. The old
      dialog switched to showModal() whenever another modal was open, which
      froze that modal for the toast's whole lifetime (e.g. Manage Builds
      ignored clicks for 4s after "copied to clipboard").

      While a modal is open, the page outside it is inert (popovers included),
      so the layer is teleported *into* the topmost modal to keep the toast's
      own dismiss button clickable.
    -->
    <div ref="layerEl" popover="manual" class="toast-layer">
      <slot />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
}>();

const layerEl = ref<HTMLElement | null>(null);
const host = ref<HTMLElement | "body">("body");
// Open modal dialogs, oldest first. The browser exposes no top-layer order,
// so it's tracked from open/close mutations.
const modalStack: HTMLDialogElement[] = [];
let observer: MutationObserver | undefined;

// jsdom (unit tests) has no Popover API; content still renders, just unlayered.
function supportsPopover(el: HTMLElement) {
  return typeof el.showPopover === "function";
}

function isShown(el: HTMLElement) {
  return el.matches(":popover-open");
}

function syncLayer({ raise = false } = {}) {
  const el = layerEl.value;
  if (!el || !supportsPopover(el)) return;

  if (!props.visible) {
    if (isShown(el)) el.hidePopover();
    return;
  }
  // The top layer stacks in open order, so a dialog opened after the toast
  // would cover it. Re-showing moves the toast back to the top.
  if (raise && isShown(el)) el.hidePopover();
  if (!isShown(el)) el.showPopover();
}

function trackDialog(dialog: HTMLDialogElement) {
  const index = modalStack.indexOf(dialog);
  if (index !== -1) modalStack.splice(index, 1);
  if (dialog.isConnected && dialog.matches(":modal")) modalStack.push(dialog);
}

function onMutations(records: MutationRecord[]) {
  for (const record of records) {
    if (record.target instanceof HTMLDialogElement) trackDialog(record.target);
  }
  // Drop dialogs removed from the page without closing.
  for (let i = modalStack.length - 1; i >= 0; i--) {
    if (!modalStack[i].isConnected) modalStack.splice(i, 1);
  }
  const top = modalStack[modalStack.length - 1] ?? "body";
  if (top !== host.value) {
    host.value = top; // the watcher re-shows the layer once it has moved
  } else {
    syncLayer({ raise: true });
  }
}

onMounted(() => {
  // Popovers don't toggle an `open` attribute, so this only fires for
  // dialogs (and <details>, which trackDialog ignores).
  observer = new MutationObserver(onMutations);
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["open"],
  });
  document.querySelectorAll("dialog").forEach((d) => trackDialog(d));
  host.value = modalStack[modalStack.length - 1] ?? "body";
  syncLayer();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  const el = layerEl.value;
  if (el && supportsPopover(el) && isShown(el)) el.hidePopover();
});

watch(
  () => props.visible,
  () => syncLayer(),
);

// Moving a popover to a new parent closes it.
watch(host, async () => {
  await nextTick();
  syncLayer();
});
</script>

<style scoped>
.toast-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  pointer-events: none;
  overflow: visible;
}

.toast-layer :deep(.toast.toast-top) {
  top: 5rem;
}

.toast-layer :deep(.alert) {
  pointer-events: auto;
}
</style>
