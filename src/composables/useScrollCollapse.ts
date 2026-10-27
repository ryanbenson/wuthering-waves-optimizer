import { onMounted, onUnmounted, ref } from "vue";

/** Within this many px of the top, the chrome always shows. */
export const SCROLL_COLLAPSE_TOP_PX = 80;
/** Ignore scrolls smaller than this, so a jittery finger doesn't flicker it. */
export const SCROLL_COLLAPSE_MIN_DELTA_PX = 8;

/**
 * Whether phone chrome should be tucked away after a scroll from `lastY` to
 * `y`: down hides it, any real scroll up (or reaching the top) brings it back,
 * and a tiny move keeps whatever it was.
 */
export function nextScrollCollapsed(collapsed: boolean, lastY: number, y: number): boolean {
  if (y <= SCROLL_COLLAPSE_TOP_PX) return false;
  const delta = y - lastY;
  if (Math.abs(delta) < SCROLL_COLLAPSE_MIN_DELTA_PX) return collapsed;
  return delta > 0;
}

// One state for the whole page, so everything that tucks away does it together.
const isCollapsed = ref(false);
let lastY = 0;
let frame = 0;
let users = 0;

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const y = window.scrollY;
    const next = nextScrollCollapsed(isCollapsed.value, lastY, y);
    // Keep the reference point until a move counts, so slow scrolls still add up.
    if (next !== isCollapsed.value || Math.abs(y - lastY) >= SCROLL_COLLAPSE_MIN_DELTA_PX) lastY = y;
    isCollapsed.value = next;
  });
}

/**
 * Phones: true while the page is being scrolled down, for chrome that slides
 * out of the way (the v3 bottom bar). Only the window's own scroll counts, not
 * scrolling inside a menu or panel.
 */
export function useScrollCollapse() {
  onMounted(() => {
    if (users++ === 0) {
      lastY = window.scrollY;
      isCollapsed.value = false;
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  });
  onUnmounted(() => {
    if (--users === 0) {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      isCollapsed.value = false;
    }
  });
  return { isCollapsed };
}
