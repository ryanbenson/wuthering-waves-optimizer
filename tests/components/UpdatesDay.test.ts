import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import UpdatesDay from "../../src/components/updates/UpdatesDay.vue";
import { UPDATE_TAGS, type UpdateEntry } from "../../src/content/updates";

const LABELS: Record<(typeof UPDATE_TAGS)[number], string> = {
  feature: "New feature",
  improvement: "Improvement",
  qol: "Quality of life",
  content: "Game content",
  fix: "Fix",
  labs: "Labs",
};

describe("UpdatesDay tags (issue #714)", () => {
  it("renders a labelled, coloured pill for every tag", () => {
    const entry: UpdateEntry = {
      date: "2026-11-14",
      dateLabel: "November 14, 2026",
      items: UPDATE_TAGS.map((tag) => `A ${tag} bullet`),
      itemDetails: Object.fromEntries(UPDATE_TAGS.map((tag, index) => [index, { tag }])),
    };
    const { container } = render(UpdatesDay, { props: { entry } });
    const pills = [...container.querySelectorAll("[data-test-updates-tag]")];

    expect(pills.map((pill) => pill.textContent?.trim())).toEqual(UPDATE_TAGS.map((tag) => LABELS[tag]));
    for (const pill of pills) {
      expect(pill.className).toMatch(/bg-\w+\/20/);
      expect(pill.className).toContain("text-base-content");
    }
  });

  it("renders no pill for an untagged bullet", () => {
    const entry: UpdateEntry = { date: "2026-01-01", dateLabel: "January 1, 2026", items: ["Old bullet"] };
    const { container } = render(UpdatesDay, { props: { entry } });
    expect(container.querySelector("[data-test-updates-tag]")).toBeNull();
  });
});
