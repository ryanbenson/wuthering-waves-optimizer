<template>
  <!-- Same focus-driven dropdown as ThemeChooser.vue: it closes on click-away. -->
  <div
    class="dropdown dropdown-end block"
    :class="placementClass"
    data-test-options-menu
    @mousedown="closeDropdownOnTriggerReclick">
    <slot name="trigger">
      <div tabindex="0" role="button" class="btn btn-ghost btn-square" aria-label="More">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block size-6 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
        </svg>
      </div>
    </slot>
    <div
      tabindex="0"
      class="dropdown-content z-50 bg-base-200 text-base-content rounded-box border border-white/5 shadow-2xl outline-1 outline-black/5"
      :class="contentClass">
      <!-- Classic UI: flat list. -->
      <ul v-if="!isV3" class="menu w-56">
        <li class="mb-2">
          <RouterLink
            to="/settings"
            @click="closeMenu"
            :class="{ active: curPage === 'settings' }"
            data-test-options-settings>
            Settings
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink
            to="/scanners"
            @click="closeMenu"
            :class="{ active: curPage === 'scanners' }"
            data-test-options-scanners>
            Scanners
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink
            to="/info"
            @click="closeMenu"
            :class="{ active: curPage === 'info' }">
            Info
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink
            to="/updates"
            @click="closeMenu"
            :class="{ active: curPage === 'updates' }">
            Updates
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink
            to="/privacy"
            @click="closeMenu"
            :class="{ active: curPage === 'privacy' }">
            Privacy
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink
            to="/legal"
            @click="closeMenu"
            :class="{ active: curPage === 'legal' }">
            Legal
          </RouterLink>
        </li>
        <li class="mb-2">
          <a
            href="https://discord.gg/pDKjxNjJWW"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu">
            Discord
          </a>
        </li>
        <li>
          <a
            href="https://github.com/ryanbenson/wuthering-waves-optimizer"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu">
            GitHub
          </a>
        </li>
      </ul>

      <!-- v3 UI: grouped, with icons. -->
      <ul v-else v-show="!showAppearance" class="menu subnav--v3 w-56" data-test-options-menu-v3>
        <li class="subnav__eyebrow">Workspace</li>
        <li class="mb-1">
          <RouterLink
            to="/settings"
            @click="closeMenu"
            :class="{ active: curPage === 'settings' }"
            data-test-options-settings>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
            Settings
          </RouterLink>
        </li>
        <li v-if="appearance" class="mb-1">
          <button
            ref="appearanceButtonRef"
            type="button"
            class="w-full flex items-center gap-[0.55rem]"
            aria-haspopup="true"
            data-test-options-appearance
            @click="openAppearance(true)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 000 18z" fill="currentColor"></path></svg>
            Appearance
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4 ml-auto opacity-60"><path d="M9 18l6-6-6-6"></path></svg>
          </button>
        </li>
        <li class="mb-1">
          <button
            type="button"
            class="w-full flex items-center gap-[0.55rem]"
            data-test-options-classic-ui
            @click="switchToClassicUi">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M19 12H5"></path><path d="M11 18l-6-6 6-6"></path></svg>
            Switch to classic UI
          </button>
        </li>

        <li class="subnav__eyebrow">Resources</li>
        <li class="mb-1">
          <RouterLink
            to="/scanners"
            @click="closeMenu"
            :class="{ active: curPage === 'scanners' }"
            data-test-options-scanners>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M4 12h16"></path></svg>
            Scanners
            <span
              v-if="isScannersNew"
              class="badge badge-primary badge-sm text-[10px] font-semibold uppercase tracking-wide"
              data-test-options-scanners-new>
              New
            </span>
          </RouterLink>
        </li>
        <li class="mb-1">
          <RouterLink
            to="/info"
            @click="closeMenu"
            :class="{ active: curPage === 'info' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Info
          </RouterLink>
        </li>
        <li class="mb-1">
          <RouterLink
            to="/updates"
            @click="closeMenu"
            :class="{ active: curPage === 'updates' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg>
            Updates
          </RouterLink>
        </li>
        <li class="mb-1">
          <RouterLink
            to="/privacy"
            @click="closeMenu"
            :class="{ active: curPage === 'privacy' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Privacy
          </RouterLink>
        </li>
        <li class="mb-1">
          <RouterLink
            to="/legal"
            @click="closeMenu"
            :class="{ active: curPage === 'legal' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
            Legal
          </RouterLink>
        </li>

        <li class="subnav__eyebrow">Community</li>
        <li class="mb-1">
          <a
            href="https://discord.gg/pDKjxNjJWW"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path></svg>
            Discord
          </a>
        </li>
        <li>
          <a
            href="https://github.com/ryanbenson/wuthering-waves-optimizer"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            GitHub
          </a>
        </li>
      </ul>

      <!-- Phones: theme and density, which have no button of their own there.
           v-show, not v-if: ThemeOptions applies the saved theme on mount. -->
      <div v-if="isV3 && appearance" v-show="showAppearance" data-test-options-appearance-panel>
        <ul class="menu subnav--v3 w-56 pb-0">
          <li>
            <button
              ref="backButtonRef"
              type="button"
              class="w-full flex items-center gap-[0.55rem]"
              data-test-options-appearance-back
              @click="openAppearance(false)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="size-4"><path d="M15 18l-6-6 6-6"></path></svg>
              Appearance
            </button>
          </li>
        </ul>
        <ThemeOptions :show-interface="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import ThemeOptions from "../ThemeOptions.vue";
import { useClassicUi } from "../../composables/useClassicUi";
import { closeDropdownOnTriggerReclick } from "../../utils/dropdownToggle";
import { SCANNERS_NEW_UNTIL, isNewUntil } from "./navSections";

defineOptions({
  name: "NavUtilityMenu",
});

// "right" opens beside the v3 side rail; "up" opens above the phone bottom bar,
// which passes its own trigger.
const props = withDefaults(
  defineProps<{
    curPage: string;
    isV3: boolean;
    placement?: "down" | "right" | "up";
    /** v3 phones: an Appearance item with the theme and density lists. */
    appearance?: boolean;
  }>(),
  { placement: "down", appearance: false },
);

defineSlots<{ trigger?(): any }>();

const isScannersNew = isNewUntil(SCANNERS_NEW_UNTIL);

const placementClass = computed(() => ({
  "dropdown-right": props.placement === "right",
  "dropdown-top": props.placement === "up",
}));
const contentClass = computed(() => {
  if (props.placement === "right") return "ml-2 w-max";
  if (props.placement === "up") return "mb-3 max-h-[calc(100vh-var(--nav-bottom-h)-5rem)] overflow-y-auto";
  return ["top-px", props.isV3 ? "mt-14" : "mt-16"];
});

function closeMenu() {
  showAppearance.value = false;
  (document.activeElement as HTMLElement | null)?.blur();
}

// Swapping panels hides the focused button, which would close this
// focus-driven dropdown, so focus moves to the other panel's button.
const showAppearance = ref(false);
const appearanceButtonRef = ref<HTMLButtonElement | null>(null);
const backButtonRef = ref<HTMLButtonElement | null>(null);
async function openAppearance(open: boolean) {
  showAppearance.value = open;
  await nextTick();
  (open ? backButtonRef : appearanceButtonRef).value?.focus();
}

// Same switch as the theme menu's Interface → Classic (ADR 0038).
const { setClassicUi } = useClassicUi();
function switchToClassicUi() {
  setClassicUi(true, "utility-menu");
  closeMenu();
}
</script>

<style lang="scss" scoped>
// The global stylesheet's leftover `a` purple, which the classic bar's own
// styles used to cover; the v3 rail and bottom bar don't.
.dropdown-content a,
.dropdown-content a:hover {
  color: inherit;
}

.subnav--v3 {
  .subnav__eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.5;
    padding: 0.35rem 0.6rem 0.15rem;
  }
  a {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }
}
</style>
