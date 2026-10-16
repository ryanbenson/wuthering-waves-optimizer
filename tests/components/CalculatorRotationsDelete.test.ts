import { describe, it, expect, beforeEach } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorRotations from "../../src/components/CalculatorRotations.vue";
import { useCharacterStore } from "../../src/stores/character";
import { useConfirm } from "../../src/composables/useConfirm";

const ROW = '[data-test-rotations-row-delete="Std rotation"]';

describe("CalculatorRotations delete", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useCharacterStore().characters = {
      Hiyuki: { rotations: [{ id: "r1", name: "Std rotation", order: 0, actions: [] }] },
    } as any;
  });

  it("asks before deleting a rotation and keeps it on cancel", async () => {
    const { container } = render(CalculatorRotations, {
      props: { character: "Hiyuki" },
      global: { directives: { tooltip: () => {} } },
    });
    await flushPromises();
    const { confirmRequest, settle } = useConfirm();

    await fireEvent.click(container.querySelector(ROW)!);
    expect(confirmRequest.value?.message).toContain("Std rotation");
    settle(false);
    await flushPromises();
    expect(container.querySelector(ROW)).not.toBeNull();
    expect((useCharacterStore().characters as any).Hiyuki.rotations).toHaveLength(1);

    await fireEvent.click(container.querySelector(ROW)!);
    settle(true);
    await flushPromises();
    expect(container.querySelector(ROW)).toBeNull();
    expect((useCharacterStore().characters as any).Hiyuki.rotations).toHaveLength(0);
  });
});
