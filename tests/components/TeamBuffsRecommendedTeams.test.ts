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
    expect(emitted().use).toEqual([[["Iuno", "Verina"]]]);
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
