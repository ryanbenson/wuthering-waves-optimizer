import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import EchoDuplicateReviewList from "../../src/components/EchoDuplicateReviewList.vue";

const item = (index: number, selected: boolean) => ({
  index,
  selected,
  isDuplicate: !selected,
  echo: { echoId: `e${index}`, echo: "BellBorneGeochelone", echoSet: "FreezingFrost", rank: 5, stat: "CritRate", type: 4 },
});

const props = (overrides: Record<string, unknown>) => ({
  items: [item(0, false), item(1, false)],
  inventoryOnly: true,
  hasSelectedEchoes: false,
  ...overrides,
});

describe("EchoDuplicateReviewList", () => {
  it("offers Apply without saving when nothing is ticked, so a rescan of known echoes still applies", async () => {
    const { getByText, queryByText, emitted } = render(EchoDuplicateReviewList, {
      props: props({ applyWithoutSaving: true }),
    });
    expect(queryByText(/Save 0 selected/)).toBeNull();

    await fireEvent.click(getByText("Apply without saving"));
    expect(emitted().applyToCharacterOnly).toHaveLength(1);
  });

  it("goes back to Save once something is ticked", () => {
    const { getByText, queryByText } = render(EchoDuplicateReviewList, {
      props: props({ applyWithoutSaving: true, items: [item(0, true), item(1, false)], hasSelectedEchoes: true }),
    });
    expect(getByText("Save 1 selected")).toBeTruthy();
    expect(queryByText("Apply without saving")).toBeNull();
  });

  it("keeps the plain inventory import as it was", () => {
    const { getByText, queryByText } = render(EchoDuplicateReviewList, { props: props({}) });
    expect((getByText("Save 0 selected") as HTMLButtonElement).disabled).toBe(true);
    expect(queryByText("Apply without saving")).toBeNull();
  });
});
