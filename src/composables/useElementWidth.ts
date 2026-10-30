import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";

/**
 * An element's rendered width, kept up to date as it resizes. Charts draw at
 * this width in real pixels, so their text stays readable on a phone instead
 * of shrinking with a scaled viewBox. `fallback` is used before mount and
 * where there's no layout (jsdom).
 */
export function useElementWidth(target: Ref<HTMLElement | null>, fallback = 640) {
  const width = ref(fallback);
  let observer: ResizeObserver | null = null;

  function update(el: HTMLElement) {
    const measured = Math.round(el.getBoundingClientRect().width);
    if (measured > 0) width.value = measured;
  }

  function observe(el: HTMLElement | null) {
    observer?.disconnect();
    observer = null;
    if (!el) return;
    update(el);
    if (typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver(() => update(el));
    observer.observe(el);
  }

  onMounted(() => {
    watch(target, observe, { immediate: true, flush: "post" });
  });

  onUnmounted(() => observer?.disconnect());

  return width;
}
