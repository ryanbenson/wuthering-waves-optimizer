import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, fireEvent } from "@testing-library/vue";
import EchoScannerResultCard from "../../src/components/EchoScannerResultCard.vue";
import EchoScannerGuide from "../../src/components/EchoScannerGuide.vue";
import type { ScanCandidate } from "../../src/scanner/types";

function candidate(overrides: Partial<ScanCandidate> = {}): ScanCandidate {
  return {
    id: "c1",
    captureIndex: 7,
    slot: {
      cost: 4,
      mainStatLabel: "Crit. DMG",
      substats: [{ subStat: "DEF", subStatValue: "60" }],
      echo: "Jué",
      set: null,
    },
    confidence: { name: "high", cost: "high", mainStat: "high", set: "high", substats: ["low"] },
    needsMainStatSelection: false,
    substatSource: "columns",
    signature: "sig",
    rawHeaderText: "Jue wll",
    rawStatsText: "DEF 60",
    panelPreviewUrl: "data:image/jpeg;base64,AAAA",
    ...overrides,
  };
}

function renderCard(props: Partial<InstanceType<typeof EchoScannerResultCard>["$props"]> = {}) {
  return render(EchoScannerResultCard, {
    props: {
      candidate: candidate(),
      attention: true,
      reviewed: false,
      inInventory: false,
      inventoryOnly: true,
      ...props,
    },
    global: { directives: { tooltip: () => {} } },
  });
}

describe("EchoScannerResultCard", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("shows the capture number, the flag, and the in-game capture open for a flagged echo", () => {
    const { getByText, getByAltText } = renderCard();
    getByText("#7");
    getByText("Check substats");
    getByAltText("In-game capture #7");
  });

  it("emits toggle-reviewed from Looks right", async () => {
    const { getByText, emitted } = renderCard();
    await fireEvent.click(getByText("Looks right"));
    expect(emitted()["toggle-reviewed"]).toHaveLength(1);
  });

  it("keeps the capture collapsed for an echo that isn't flagged", () => {
    const { queryByAltText, getByText } = renderCard({
      attention: false,
      candidate: candidate({ confidence: { name: "high", cost: "high", mainStat: "high", set: "high", substats: [] } }),
    });
    expect(queryByAltText("In-game capture #7")).toBeNull();
    getByText("Show in-game capture");
  });

  it("marks unknown and already-owned echoes", () => {
    const { getByText, queryByText } = renderCard({
      candidate: candidate({ slot: { ...candidate().slot, echo: null } }),
      inInventory: true,
    });
    getByText("Unknown echo");
    getByText("Already in inventory");
    // Nothing to confirm on an unknown echo.
    expect(queryByText("Looks right")).toBeNull();
  });
});

describe("EchoScannerGuide", () => {
  it("renders the click-wait-click steps and closes", async () => {
    const { getByText, emitted } = render(EchoScannerGuide);
    getByText("Back in the game: click, wait, click");
    await fireEvent.click(getByText("Got it"));
    expect(emitted().close).toHaveLength(1);
  });
});
