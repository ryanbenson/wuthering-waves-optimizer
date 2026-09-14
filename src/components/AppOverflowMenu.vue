<template>
  <div ref="rootRef" class="app-overflow-menu" :class="{ 'app-overflow-menu--open': isOpen }">
    <div
      ref="triggerRef"
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
    <!-- Teleported + fixed-positioned (computed from the trigger's own
    bounding rect) rather than daisyUI's normal absolute dropdown-content:
    this menu shows up in places like CalculatorRotations.vue's header,
    nested inside a scrollable/overflow-clipped panel
    (.calculations__screens) — an absolutely-positioned menu there gets
    silently clipped whenever that ancestor's content is short (e.g. an
    empty rotations list), cutting off exactly the options a first-time
    user needs (Import/List Presets). Teleporting to <body> escapes every
    such ancestor unconditionally instead of depending on how tall
    surrounding content happens to be. -->
    <Teleport to="body">
      <ul
        v-if="isOpen"
        ref="menuRef"
        class="app-overflow-menu__content menu menu-sm z-50 w-56 rounded-box bg-base-200 p-1 text-base-content shadow fixed"
        :style="menuStyle"
        @click="closeMenu">
        <slot />
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const props = withDefaults(
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
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const menuStyle = reactive({ top: "0px", left: "0px" });

const MENU_GAP_PX = 4;
const MENU_WIDTH_FALLBACK_PX = 224; // w-56, before the menu itself has been measured

function updatePosition() {
  const trigger = triggerRef.value;
  if (!trigger) return;
  const triggerRect = trigger.getBoundingClientRect();
  const menu = menuRef.value;
  const menuHeight = menu?.offsetHeight ?? 0;
  const menuWidth = menu?.offsetWidth || MENU_WIDTH_FALLBACK_PX;

  const spaceBelow = window.innerHeight - triggerRect.bottom - MENU_GAP_PX;
  const spaceAbove = triggerRect.top - MENU_GAP_PX;
  const opensUpward = menuHeight > 0 && spaceBelow < menuHeight && spaceAbove > spaceBelow;
  const top = opensUpward
    ? triggerRect.top - menuHeight - MENU_GAP_PX
    : triggerRect.bottom + MENU_GAP_PX;

  const preferredLeft =
    props.align === "end" ? triggerRect.right - menuWidth : triggerRect.left;
  const left = Math.min(
    Math.max(MENU_GAP_PX, preferredLeft),
    window.innerWidth - menuWidth - MENU_GAP_PX,
  );

  menuStyle.top = `${Math.max(MENU_GAP_PX, top)}px`;
  menuStyle.left = `${left}px`;
}

async function toggleMenu(event: MouseEvent) {
  event.stopPropagation();
  if (isOpen.value) {
    closeMenu();
    return;
  }
  isOpen.value = true;
  await nextTick();
  updatePosition();
}

function closeMenu() {
  isOpen.value = false;
  (document.activeElement as HTMLElement | null)?.blur();
}

function onDocumentPointerDown(event: Event) {
  if (!isOpen.value) return;
  const target = event.target as Node | null;
  if (
    target &&
    (rootRef.value?.contains(target) || menuRef.value?.contains(target))
  ) {
    return;
  }
  closeMenu();
}

function onViewportChange() {
  if (!isOpen.value) return;
  updatePosition();
}

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true);
  window.addEventListener("resize", onViewportChange);
  window.addEventListener("scroll", onViewportChange, true);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true);
  window.removeEventListener("resize", onViewportChange);
  window.removeEventListener("scroll", onViewportChange, true);
});
</script>
