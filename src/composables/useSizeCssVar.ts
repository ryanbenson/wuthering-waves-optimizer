import { onMounted, onUnmounted, watch, type Ref } from "vue";

/**
 * Keeps a CSS variable on <html> equal to an element's rendered height (or
 * width), e.g. `--nav-h` for the fixed top nav, so layout offsets follow it
 * instead of a hard-coded 80px. With `resetTo`, the variable goes back to that
 * value when the component unmounts (Vue runs the old page's unmount before
 * the new page's mount, so the next nav's value wins).
 */
export function useSizeCssVar(
  target: Ref<HTMLElement | null>,
  name: string,
  options: { dimension?: "height" | "width"; resetTo?: string } = {},
) {
  const { dimension = "height", resetTo } = options;
  const root = document.documentElement;
  let observer: ResizeObserver | null = null;

  function update(el: HTMLElement) {
    root.style.setProperty(name, `${Math.round(el.getBoundingClientRect()[dimension])}px`);
  }

  function observe(el: HTMLElement | null) {
    observer?.disconnect();
    observer = null;
    if (!el) {
      if (resetTo !== undefined) root.style.setProperty(name, resetTo);
      return;
    }
    update(el);
    if (typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver(() => update(el));
    observer.observe(el);
  }

  onMounted(() => {
    watch(target, observe, { immediate: true, flush: "post" });
  });

  onUnmounted(() => {
    observer?.disconnect();
    if (resetTo !== undefined) root.style.setProperty(name, resetTo);
  });
}
