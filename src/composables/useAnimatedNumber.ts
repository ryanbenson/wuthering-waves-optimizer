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
 *
 * `identity`, when given, names *what* `source` currently measures (e.g. a
 * `"target::damageType"` string). `source` can jump for two entirely
 * different reasons: the thing being measured got better/worse (a real
 * delta, worth flashing), or the thing being measured itself silently
 * changed underneath the caller — e.g. Calculator.vue reselecting the Live
 * Result Bar's pinned target when it transiently fails to resolve during a
 * recompute (see the reselection logic around `liveResultBarTarget` there),
 * or the user toggling the damage-type control. Diffing across that second
 * case produces a delta between two unrelated quantities — reported as a
 * wildly-wrong-magnitude or wrong-signed "+25K" flash for a build change
 * that only actually moved the number by ~1K. When `identity` changes
 * between the previous and current call, this is treated like the very
 * first resolution: `displayValue` snaps to the new number with no delta,
 * rather than animating a comparison that was never meaningful.
 */
export function useAnimatedNumber(
  source: Ref<number | null>,
  identity: Ref<unknown> = ref(null),
) {
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

  watch([source, identity], ([next, nextIdentity], [prev, prevIdentity]) => {
    stopFrame();

    if (next === null) {
      displayValue.value = null;
      delta.value = null;
      return;
    }

    if (prev === null || prev === undefined || nextIdentity !== prevIdentity) {
      displayValue.value = next;
      delta.value = null;
      if (deltaTimer) {
        clearTimeout(deltaTimer);
        deltaTimer = null;
      }
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
