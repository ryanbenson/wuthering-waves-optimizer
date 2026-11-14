import { describe, it, expect } from "vitest";
import { UPDATE_TAGS, updateEntries } from "../../src/content/updates";

describe("changelog item details (issue #714)", () => {
  const tagged = updateEntries.flatMap((entry) =>
    Object.entries(entry.itemDetails ?? {}).map(([index, details]) => ({ entry, index: Number(index), details })),
  );

  it("has tagged bullets to check", () => {
    expect(tagged.length).toBeGreaterThan(0);
  });

  it("only uses known tags", () => {
    for (const { entry, index, details } of tagged) {
      if (details.tag === undefined) continue;
      expect(UPDATE_TAGS, `${entry.date} item ${index}`).toContain(details.tag);
    }
  });

  it("only points at bullets that exist", () => {
    for (const { entry, index } of tagged) {
      expect(Number.isInteger(index) && index >= 0 && index < entry.items.length, `${entry.date} item ${index}`).toBe(true);
    }
  });
});
