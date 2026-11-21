import { describe, it, expect } from "vitest";
import {
  eligibleEchoSets,
  setFilterFor,
  shownEchoSets,
} from "../../src/echoes/recommendedEchoSets";

describe("eligibleEchoSets", () => {
  it("uses the saved sets when there are any", () => {
    expect(eligibleEchoSets(["MoltenRift"], ["FrostyResolve"])).toEqual(["MoltenRift"]);
  });

  it("falls back to the recommended sets when nothing (or an empty list) is saved", () => {
    expect(eligibleEchoSets(undefined, ["FrostyResolve"])).toEqual(["FrostyResolve"]);
    expect(eligibleEchoSets([], ["FrostyResolve"])).toEqual(["FrostyResolve"]);
    expect(eligibleEchoSets(null, undefined)).toEqual([]);
  });

  it("returns a copy, so the result can't alias the saved or recommended list", () => {
    const recommended = ["FrostyResolve"];
    expect(eligibleEchoSets(undefined, recommended)).not.toBe(recommended);
  });
});

describe("shownEchoSets", () => {
  const all = ["A", "B", "C", "D"];

  it("shows every set when Recommended only is off or there are no recommendations", () => {
    expect(shownEchoSets(all, ["C"], [], false)).toEqual(all);
    expect(shownEchoSets(all, [], [], true)).toEqual(all);
  });

  it("narrows to the recommended and selected sets, in the row's own order", () => {
    expect(shownEchoSets(all, ["D", "B"], ["A"], true)).toEqual(["A", "B", "D"]);
  });
});

describe("setFilterFor", () => {
  it("filters by the selected sets first, then the recommended ones while Recommended only is on", () => {
    expect(setFilterFor(["C"], ["A"], true)).toEqual(["A"]);
    expect(setFilterFor(["C"], [], true)).toEqual(["C"]);
    expect(setFilterFor(["C"], [], false)).toEqual([]);
  });
});
