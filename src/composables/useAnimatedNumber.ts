import { ref, watch, onBeforeUnmount, type Ref } from "vue";

const ANIMATION_DURATION_MS = 550;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

/**
 * Tweens a displayed number toward `source` whenever it changes, and reports
 * the signed delta of that change for a short window afterward (for a
 * "+1,234" flash) — the Live Result Bar's hero number, not a general-purpose
 * utility. Respects `prefers-reduced-motion` by jumping straight to the
 * target instead of tweening.
 */
export function useAnimatedNumber(source: Ref<number | null>) {
  const displayValue = ref<number | null>(source.value);
  const delta = ref<number | null>(null);

  let frame: number | null = null;
  let deltaTimer: ReturnType<typeof setTimeout> | null = null;

  function stopFrame() {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  watch(source, (next, prev) => {
    stopFrame();

    if (next === null) {
      displayValue.value = null;
      delta.value = null;
      return;
    }

    if (prev === null || prev === undefined) {
      displayValue.value = next;
      return;
    }

    if (next === prev) return;

    if (prefersReducedMotion()) {
      displayValue.value = next;
    } else {
      const from = prev;
      const to = next;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / ANIMATION_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        displayValue.value = Math.round(from + (to - from) * eased);
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        } else {
          frame = null;
        }
      };
      frame = requestAnimationFrame(step);
    }

    const diff = next - prev;
    delta.value = diff;
    if (deltaTimer) clearTimeout(deltaTimer);
    deltaTimer = setTimeout(() => {
      delta.value = null;
    }, 1600);
  });

  onBeforeUnmount(() => {
    stopFrame();
    if (deltaTimer) clearTimeout(deltaTimer);
  });

  return { displayValue, delta };
}
