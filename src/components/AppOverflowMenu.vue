<template>
  <div
    class="app-overflow-menu dropdown"
    :class="align === 'end' ? 'dropdown-end' : undefined">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost app-overflow-menu__trigger"
      :class="size === 'xs' ? 'btn-xs' : 'btn-sm'"
      :aria-label="ariaLabel"
      :data-test="dataTest">
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
      tabindex="0"
      class="app-overflow-menu__content dropdown-content menu menu-sm z-20 mt-2 w-56 rounded-box bg-base-200 p-1 text-base-content shadow"
      @click="closeMenu">
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
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

// DaisyUI's dropdown is CSS-only (:focus-within), so nothing collapses it
// after picking an item — without this it stays open, floating over
// whatever's underneath, and can intercept later clicks.
function closeMenu() {
  (document.activeElement as HTMLElement | null)?.blur();
}
</script>
