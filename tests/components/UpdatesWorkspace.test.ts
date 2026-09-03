import { render, fireEvent } from "@testing-library/vue";
import UpdatesWorkspace from "../../src/components/UpdatesWorkspace.vue";
import { updateEntries } from "../../src/content/updates";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("UpdatesWorkspace", () => {
  // Renders all 400+ historical entries into the DOM (by design - see ADR
  // 0023, collapsed content must stay real DOM for crawlers), which is
  // slow enough under full-suite parallel load to flake on the default
  // 5s timeout even though it reliably finishes in ~2.5s in isolation.
  it("groups the two most recent months as always-visible, everything older under one collapsed 'Earlier' details", () => {
    render(UpdatesWorkspace);

    const monthKeys = new Set(updateEntries.map((e) => e.date.slice(0, 7)));
    const monthCount = monthKeys.size;

    const earlier = document.querySelector("[data-test-updates-earlier]");
    expect(earlier).toBeTruthy();
    expect((earlier as HTMLDetailsElement).open).toBe(false);

    // Every entry's date is present somewhere on the page (either in the
    // always-visible recent section or inside the collapsed <details>,
    // which keeps its content in the DOM rather than unmounting it).
    updateEntries.forEach((entry) => {
      expect(
        document.querySelector(`[data-test-updates-day="${entry.date}"]`),
      ).toBeTruthy();
    });

    if (monthCount > 2) {
      expect(earlier?.textContent).toContain("Earlier — back to");
    }
  }, 15000);

  it("filters to matching days and their whole content when searching", async () => {
    render(UpdatesWorkspace);
    const search = document.querySelector(
      "[data-test-updates-search]",
    ) as HTMLInputElement;

    const needle = updateEntries[updateEntries.length - 1].items[0].slice(0, 12);
    await fireEvent.update(search, needle);

    const dayCards = document.querySelectorAll("[data-test-updates-day]");
    expect(dayCards.length).toBeGreaterThan(0);
    dayCards.forEach((card) => {
      expect(card.textContent?.toLowerCase()).toContain(needle.toLowerCase());
    });

    // No results collapses to the empty state, not a blank page.
    await fireEvent.update(search, "xyzxyz-no-such-update-exists");
    expect(
      document.querySelector("[data-test-updates-no-results]"),
    ).toBeInTheDocument();
  });

  it("expand-all opens the collapsed Earlier details", async () => {
    render(UpdatesWorkspace);
    const earlier = document.querySelector(
      "[data-test-updates-earlier]",
    ) as HTMLDetailsElement | null;
    if (!earlier) return; // fewer than 3 months of data - nothing to expand

    expect(earlier.open).toBe(false);
    const expandAll = document.querySelector(
      "[data-test-updates-expand-all]",
    ) as HTMLElement;
    await fireEvent.click(expandAll);
    expect(earlier.open).toBe(true);
  });
});
