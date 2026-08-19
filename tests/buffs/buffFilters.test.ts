import { describe, it, expect } from "vitest";
import { buffIsUsed, buffMatchesSearch, stripBuffDetailsHtml } from "../../src/buffs/buffFilters";

describe("stripBuffDetailsHtml", () => {
  it("removes tags but keeps the text content", () => {
    expect(stripBuffDetailsHtml("<p>Increases <b>ATK</b> by 10%</p>")).toBe(
      " Increases  ATK  by 10% ",
    );
  });
});

describe("buffMatchesSearch", () => {
  const buff = {
    name: "Concerto Boost",
    details: "<p>Increases <b>Crit Rate</b> by 10% for 20s.</p>",
  };

  it("matches on the buff name, case-insensitively", () => {
    expect(buffMatchesSearch(buff, "concerto")).toBe(true);
    expect(buffMatchesSearch(buff, "CONCERTO")).toBe(true);
  });

  it("matches on the buff description, ignoring HTML tags", () => {
    expect(buffMatchesSearch(buff, "crit rate")).toBe(true);
  });

  it("returns false when neither name nor description matches", () => {
    expect(buffMatchesSearch(buff, "healing")).toBe(false);
  });

  it("treats a blank/whitespace query as matching everything", () => {
    expect(buffMatchesSearch(buff, "")).toBe(true);
    expect(buffMatchesSearch(buff, "   ")).toBe(true);
  });
});

describe("buffIsUsed", () => {
  it("is used when the user has enabled it", () => {
    expect(buffIsUsed({ name: "Foo", details: "" }, true)).toBe(true);
  });

  it("is not used when disabled and not always-enabled", () => {
    expect(buffIsUsed({ name: "Foo", details: "" }, false)).toBe(false);
  });

  it("counts an always-enabled buff as used even if isEnabled is false", () => {
    expect(buffIsUsed({ name: "Foo", details: "", alwaysEnabled: true }, false)).toBe(true);
  });
});
