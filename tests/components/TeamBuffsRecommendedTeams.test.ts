import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TeamBuffsRecommendedTeams from "../../src/components/teamBuffsWorkspace/TeamBuffsRecommendedTeams.vue";
import { getRecommendedTeams } from "../../src/characters/recommendedTeams";

// Issue #663
const teams = getRecommendedTeams("Augusta", [
  { members: ["Iuno", "Shorekeeper"], tags: ["Quickswap"] },
  { members: ["Iuno", "Verina"], tags: ["Budget"] },
]);

describe("TeamBuffsRecommendedTeams", () => {
  it("lists the teams and emits both members on Use team", async () => {
    const { getAllByRole, getByText, emitted } = render(TeamBuffsRecommendedTeams, {
      props: { teams, characterName: "Augusta" },
    });
    expect(getByText("Recommended teams for Augusta")).toBeTruthy();
    const useButtons = getAllByRole("button", { name: /^Use team/ });
    expect(useButtons).toHaveLength(2);

    await fireEvent.click(useButtons[1]);
    expect(emitted().use).toEqual([[{ members: ["Iuno", "Verina"], withBuffs: false, mode: "replace" }]]);
  });

  it("marks the team already in the slots, in either order", () => {
    const { container, queryAllByRole } = render(TeamBuffsRecommendedTeams, {
      props: { teams, slot1: "Shorekeeper", slot2: "Iuno" },
    });
    expect(container.querySelector('[data-test-recommended-teams-current="Iuno+Shorekeeper"]')).toBeTruthy();
    expect(queryAllByRole("button", { name: /^Use team/ })).toHaveLength(1);
  });

  it("filters by tag", async () => {
    const { container, getByRole } = render(TeamBuffsRecommendedTeams, { props: { teams } });
    await fireEvent.click(getByRole("button", { name: "Budget" }));
    const rows = container.querySelectorAll("[data-test-recommended-teams-row]");
    expect([...rows].map((r) => r.getAttribute("data-test-recommended-teams-row"))).toEqual(["Iuno+Verina"]);
  });

  it("says when there are no teams yet", () => {
    const { getByText } = render(TeamBuffsRecommendedTeams, { props: { teams: [], characterName: "Lily" } });
    expect(getByText("No recommended teams for Lily yet.")).toBeTruthy();
  });
});

// Issue #663 PR 2: "Also turn on their buffs".
describe("TeamBuffsRecommendedTeams with buffs", () => {
  const supportTeams = getRecommendedTeams("Carlotta", [{ members: ["Zhezhi", "Shorekeeper"] }]);

  async function renderWithBuffs(props: Record<string, unknown> = {}) {
    const utils = render(TeamBuffsRecommendedTeams, { props: { teams: supportTeams, ...props } });
    await fireEvent.click(utils.getByLabelText("Also turn on their buffs"));
    return utils;
  }

  it("shows each teammate's sequence and Sig, using saved copies", async () => {
    const { getByLabelText, container } = await renderWithBuffs({
      copies: { Shorekeeper: { sequence: 2, signature: true } },
    });
    expect((getByLabelText("Shorekeeper sequence") as HTMLSelectElement).value).toBe("2");
    expect((getByLabelText("Zhezhi sequence") as HTMLSelectElement).value).toBe("0");
    const sig = container.querySelector('[data-test-recommended-teams-signature="Shorekeeper"]') as HTMLInputElement;
    expect(sig.checked).toBe(true);
    // Zhezhi's signature weapon has no team buff.
    expect(container.querySelector('[data-test-recommended-teams-signature="Zhezhi"]')).toBeNull();
  });

  it("saves a changed sequence", async () => {
    const { getByLabelText, emitted } = await renderWithBuffs();
    await fireEvent.update(getByLabelText("Shorekeeper sequence"), "4");
    expect(emitted()["set-copy"]).toEqual([["Shorekeeper", { sequence: 4, signature: false }]]);
  });

  it("uses the team with buffs straight away when no team buffs are on", async () => {
    const { getByRole, emitted } = await renderWithBuffs({ hasActiveBuffs: false });
    await fireEvent.click(getByRole("button", { name: /^Use team/ }));
    expect(emitted().use).toEqual([[{ members: ["Zhezhi", "Shorekeeper"], withBuffs: true, mode: "replace" }]]);
  });

  it("asks before changing team buffs that are already on", async () => {
    const { getByRole, emitted, container } = await renderWithBuffs({ hasActiveBuffs: true });
    await fireEvent.click(getByRole("button", { name: /^Use team/ }));
    expect(emitted().use).toBeUndefined();
    await fireEvent.click(container.querySelector("[data-test-recommended-teams-add]") as HTMLElement);
    expect(emitted().use).toEqual([[{ members: ["Zhezhi", "Shorekeeper"], withBuffs: true, mode: "add" }]]);
  });
});
