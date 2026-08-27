<template>
  <div
    ref="rootRef"
    class="app-overflow-menu dropdown"
    :class="[align === 'end' ? 'dropdown-end' : undefined, { 'dropdown-open': isOpen }]">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost app-overflow-menu__trigger"
      :class="size === 'xs' ? 'btn-xs' : 'btn-sm'"
      :aria-label="ariaLabel"
      :aria-expanded="isOpen"
      :data-test="dataTest"
      @click="toggleMenu">
      <slot name="trigger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-4 fill-current"
          aria-hidden="true">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </slot>
    </div>
    <ul
      v-show="isOpen"
      tabindex="0"
      class="app-overflow-menu__content dropdown-content menu menu-sm z-20 mt-2 w-56 rounded-box bg-base-200 p-1 text-base-content shadow"
      @click="closeMenu">
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

withDefaults(
  defineProps<{
    ariaLabel?: string;
    align?: "start" | "end";
    size?: "sm" | "xs";
    dataTest?: string;
  }>(),
  {
    ariaLabel: "More actions",
    align: "end",
    size: "sm",
    dataTest: undefined,
  },
);

// Explicit open state, not daisyUI's CSS-only :focus-within — that relied
// entirely on the trigger's real DOM focus, which doesn't hold up in every
// ancestor context (e.g. nested inside another interactive element, like
// CalculatorEchoTile.vue's root <button>) and could leave the menu
// permanently visible instead of hidden by default. Same fix already
// applied to AppRichSelect.vue's dropdown for the same reason.
const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

function toggleMenu(event: MouseEvent) {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
  (document.activeElement as HTMLElement | null)?.blur();
}

function onDocumentPointerDown(event: Event) {
  if (!isOpen.value) return;
  const target = event.target as Node | null;
  if (target && rootRef.value?.contains(target)) return;
  closeMenu();
}

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
});
</script>
