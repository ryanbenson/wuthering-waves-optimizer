import { describe, it, expect } from "vitest";
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
});
