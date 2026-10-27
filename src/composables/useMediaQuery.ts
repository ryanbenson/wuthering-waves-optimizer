import { onUnmounted, ref } from "vue";

/** Whether a CSS media query matches, kept up to date as the window resizes. */
export function useMediaQuery(query: string) {
  const list = typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query) : null;
  const matches = ref(list?.matches ?? false);

  function update(event: MediaQueryListEvent) {
    matches.value = event.matches;
  }

  list?.addEventListener("change", update);
  onUnmounted(() => list?.removeEventListener("change", update));

  return matches;
}
