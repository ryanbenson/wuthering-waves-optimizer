import { describe, it, expect, vi, afterEach } from "vitest";
import { nextTick, ref } from "vue";
import { useAnimatedNumber } from "../../src/composables/useAnimatedNumber";

describe("useAnimatedNumber", () => {
  it("reports a positive delta when the same thing is measured and its value increases", async () => {
    const source = ref<number | null>(1000);
    const identity = ref("Rotation:r1::Average");
    const { delta } = useAnimatedNumber(source, identity);

    source.value = 1500;
    await nextTick();

    expect(delta.value).toBe(500);
  });

  it("reports a negative delta for a real decrease", async () => {
    const source = ref<number | null>(1000);
    const identity = ref("Rotation:r1::Average");
    const { delta } = useAnimatedNumber(source, identity);

    source.value = 850;
    await nextTick();

    expect(delta.value).toBe(-150);
  });

  // Regression test for a reported bug: equipping an echo that raised real
  // damage by ~1K flashed "+25K"; another swap that *lowered* damage flashed
  // a positive "+15K". Root cause — Calculator.vue can silently reselect the
  // Live Result Bar's pinned target mid-recompute (the previously-pinned
  // attack/rotation transiently fails to resolve and falls back to a
  // completely different, differently-scaled one), so `source` jumps for a
  // reason that has nothing to do with the build change the user just made.
  it("does not flash a delta when the underlying target silently changes, even though the raw number jumped", async () => {
    const source = ref<number | null>(1000);
    const identity = ref("Rotation:r1::Average");
    const { delta, displayValue } = useAnimatedNumber(source, identity);

    // Both change together in one tick, exactly like a single reactive
    // recompute reselecting the target and its resolved value at once.
    source.value = 26000;
    identity.value = "Attack:liberationAttacks|Big::Average";
    await nextTick();

    expect(delta.value).toBeNull();
    expect(displayValue.value).toBe(26000);
  });

  it("does not flash a delta when only the damage-type mode changes", async () => {
    const source = ref<number | null>(1000);
    const identity = ref("Rotation:r1::Average");
    const { delta, displayValue } = useAnimatedNumber(source, identity);

    source.value = 1400;
    identity.value = "Rotation:r1::Crit";
    await nextTick();

    expect(delta.value).toBeNull();
    expect(displayValue.value).toBe(1400);
  });

  it("still flashes a real delta immediately after an identity change settles", async () => {
    const source = ref<number | null>(1000);
    const identity = ref("Rotation:r1::Average");
    const { delta } = useAnimatedNumber(source, identity);

    // The target reselects (no delta, per the tests above)...
    source.value = 26000;
    identity.value = "Attack:liberationAttacks|Big::Average";
    await nextTick();
    expect(delta.value).toBeNull();

    // ...then a real build change moves that same (new) target's value —
    // this SHOULD flash, proving the fix doesn't just permanently disable
    // deltas after any reselection.
    source.value = 27000;
    await nextTick();
    expect(delta.value).toBe(1000);
  });

  it("shows no delta on the very first resolution", async () => {
    const source = ref<number | null>(null);
    const { delta, displayValue } = useAnimatedNumber(source);

    source.value = 1000;
    await nextTick();

    expect(delta.value).toBeNull();
    expect(displayValue.value).toBe(1000);
  });

  it("clears both value and delta when the source becomes unresolved", async () => {
    const source = ref<number | null>(1000);
    const { delta, displayValue } = useAnimatedNumber(source);
    source.value = 1500;
    await nextTick();
    expect(delta.value).toBe(500);

    source.value = null;
    await nextTick();
    expect(delta.value).toBeNull();
    expect(displayValue.value).toBeNull();
  });

  it("works without an identity argument (backward compatible default)", async () => {
    const source = ref<number | null>(1000);
    const { delta } = useAnimatedNumber(source);
    source.value = 1200;
    await nextTick();
    expect(delta.value).toBe(200);
  });

  describe("multi-tick settle (same action, separate reactive flushes)", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    // Regression test for a third variant of the reported bug, found after
    // the identity fix above: even with the *same* target/damageType
    // throughout, one build change can legitimately settle across more than
    // one reactive tick — an echo's own stats land on the write that swaps
    // it in, but a *derived*, separately-stored value like echoSetBonus is
    // recomputed by a different watcher chain reacting to that change, one
    // tick later (see useEchoSlotAssignment.ts's doc comment). Diffing each
    // tick against only its immediately-preceding value reports just the
    // *last* segment. Reported: a real -45K drop (an echo swap that broke a
    // 5pc set bonus) showed only "-17K" — the raw-stat segment alone.
    it("sums a same-action settle into one cumulative delta, not just its last segment", async () => {
      const source = ref<number | null>(100000);
      const identity = ref("Rotation:r1::Average");
      const { delta } = useAnimatedNumber(source, identity);

      // Tick 1: the swapped echo's own (worse) stats land — a -17K segment.
      source.value = 83000;
      await nextTick();
      expect(delta.value).toBe(-17000);

      // Tick 2, moments later (same action settling): the set bonus catches
      // up and drops out — a further -28K segment. Real total: -45K.
      source.value = 55000;
      await nextTick();
      expect(delta.value).toBe(-45000);
    });

    it("keeps summing across more than two segments of the same settle", async () => {
      const source = ref<number | null>(100000);
      const { delta } = useAnimatedNumber(source);

      source.value = 95000; // -5K
      await nextTick();
      source.value = 90000; // further -5K
      await nextTick();
      source.value = 70000; // further -20K
      await nextTick();

      expect(delta.value).toBe(-30000);
    });

    it("does not merge two genuinely separate actions into one delta", async () => {
      vi.useFakeTimers();
      const source = ref<number | null>(100000);
      const { delta } = useAnimatedNumber(source);

      source.value = 90000;
      await nextTick();
      expect(delta.value).toBe(-10000);

      // Let the burst window fully elapse — a later, unrelated action should
      // be measured on its own, not folded into the earlier one.
      vi.advanceTimersByTime(1000);

      source.value = 95000;
      await nextTick();
      expect(delta.value).toBe(5000);
    });
  });
});
