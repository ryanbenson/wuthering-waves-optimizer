import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorBuildCardImageAdjustPanel from "../../src/components/CalculatorBuildCardImageAdjustPanel.vue";
import {
  DEFAULT_IMAGE_TRANSFORM,
  type ImageTransform,
} from "../../src/utils/imageTransform";

const TEST_ID = "background";

function renderPanel(modelValue: Partial<ImageTransform> | null = null) {
  return render(CalculatorBuildCardImageAdjustPanel, {
    props: { label: "Background", testId: TEST_ID, modelValue },
  });
}

describe("CalculatorBuildCardImageAdjustPanel", () => {
  it("shows defaults when no transform is provided", () => {
    const { container } = renderPanel();

    const fitSelect = container.querySelector(
      `[data-test-image-adjust-fit="${TEST_ID}"]`,
    ) as HTMLSelectElement;
    const scaleInput = container.querySelector(
      `[data-test-image-adjust-scale="${TEST_ID}"]`,
    ) as HTMLInputElement;
    expect(fitSelect.value).toBe(DEFAULT_IMAGE_TRANSFORM.fit);
    expect(Number(scaleInput.value)).toBe(DEFAULT_IMAGE_TRANSFORM.scale);
  });

  it("emits update:modelValue with the full merged transform when the fit changes", async () => {
    const { container, emitted } = renderPanel({ scale: 150 });

    const fitSelect = container.querySelector(
      `[data-test-image-adjust-fit="${TEST_ID}"]`,
    ) as HTMLSelectElement;
    await fireEvent.update(fitSelect, "repeat");

    const events = emitted()["update:modelValue"];
    expect(events?.[0]?.[0]).toEqual({
      ...DEFAULT_IMAGE_TRANSFORM,
      scale: 150,
      fit: "repeat",
    });
  });

  it("emits update:modelValue with a numeric scale when the slider moves", async () => {
    const { container, emitted } = renderPanel();

    const scaleInput = container.querySelector(
      `[data-test-image-adjust-scale="${TEST_ID}"]`,
    ) as HTMLInputElement;
    await fireEvent.update(scaleInput, "200");

    const events = emitted()["update:modelValue"];
    expect(events?.[0]?.[0]).toEqual({ ...DEFAULT_IMAGE_TRANSFORM, scale: 200 });
  });

  it("emits reset when the reset button is clicked", async () => {
    const { container, emitted } = renderPanel();

    const resetButton = container.querySelector(
      `[data-test-image-adjust-reset="${TEST_ID}"]`,
    ) as HTMLElement;
    await fireEvent.click(resetButton);

    expect(emitted().reset).toBeTruthy();
  });
});
