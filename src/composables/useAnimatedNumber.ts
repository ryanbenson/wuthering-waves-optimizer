import { ref, watch, onBeforeUnmount, type Ref } from "vue";

const ANIMATION_DURATION_MS = 550;

/**
 * How long a burst of same-action `source` changes can keep landing before
 * the delta's baseline resets. One build change (e.g. an echo swap) can
 * legitimately settle across more than one reactive tick — the swapped
 * slot's own stats land first, and a *derived*, separately-stored value like
 * `echoSetBonus` (recomputed by a different watcher chain reacting to the
 * slot change, not written atomically with it — see
 * `useEchoSlotAssignment.ts`) lands a tick later, once it exists at all.
 * Both ticks are genuine, not spurious, so this only needs to bridge real
 * same-action reactive lag (observed on the order of single-digit ms), not
 * cover for two actual separate user actions.
 */
const BURST_SETTLE_MS = 250;

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
 *
 * The reported delta is measured against a *burst baseline*, not just the
 * immediately-preceding value: when several `source` changes land within
 * `BURST_SETTLE_MS` of each other (same identity throughout), they're
 * treated as one logical change and diffed against the value from *before*
 * the burst started. Without this, a build change whose real effect
 * crystallizes over more than one reactive tick — the swapped echo's own
 * stats on one tick, a separately-recomputed `echoSetBonus` catching up a
 * tick later — gets reported as only its *last* segment's delta, which can
 * be a fraction of (or even the opposite direction from) the real total
 * change. Reported: a real -45K drop from an echo swap that broke a 5pc set
 * bonus showed only "-17K" (the raw-stat segment alone; the set-bonus
 * segment that followed a tick later silently replaced it instead of adding
 * to it).
 */
export function useAnimatedNumber(
  source: Ref<number | null>,
  identity: Ref<unknown> = ref(null),
) {
  const displayValue = ref<number | null>(source.value);
  const delta = ref<number | null>(null);

  let frame: number | null = null;
  let deltaTimer: ReturnType<typeof setTimeout> | null = null;
  let burstTimer: ReturnType<typeof setTimeout> | null = null;
  /** The value `source` held just before the current burst began. */
  let burstBaseline: number | null = null;

  function stopFrame() {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  function clearBurst() {
    if (burstTimer) {
      clearTimeout(burstTimer);
      burstTimer = null;
    }
    burstBaseline = null;
  }

  watch([source, identity], ([next, nextIdentity], [prev, prevIdentity]) => {
    stopFrame();

    if (next === null) {
      displayValue.value = null;
      delta.value = null;
      clearBurst();
      if (deltaTimer) {
        clearTimeout(deltaTimer);
        deltaTimer = null;
      }
      return;
    }

    if (prev === null || prev === undefined || nextIdentity !== prevIdentity) {
      displayValue.value = next;
      delta.value = null;
      clearBurst();
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

    // A burst already in progress keeps its original baseline — only its
    // settle countdown restarts. Otherwise this tick starts a new burst,
    // baselined on the value from just before it.
    if (burstTimer) {
      clearTimeout(burstTimer);
    } else {
      burstBaseline = prev;
    }
    const diff = next - (burstBaseline ?? prev);
    delta.value = diff;
    if (deltaTimer) clearTimeout(deltaTimer);
    deltaTimer = setTimeout(() => {
      delta.value = null;
    }, 1600);

    burstTimer = setTimeout(() => {
      burstTimer = null;
      burstBaseline = null;
    }, BURST_SETTLE_MS);
  });

  onBeforeUnmount(() => {
    stopFrame();
    if (deltaTimer) clearTimeout(deltaTimer);
    clearBurst();
  });

  return { displayValue, delta };
}
