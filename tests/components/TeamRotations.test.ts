import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, waitFor } from "@testing-library/vue";
import TeamRotations from "../../src/components/TeamRotations.vue";
import { useTeamRotationsStore } from "../../src/stores/teamRotations";
import { calcTeamRotationDamage } from "../../src/calculator/teamRotation";

vi.mock("../../src/calculator/teamRotation", () => ({
  calcTeamRotationDamage: vi.fn().mockResolvedValue({
    perCharacter: {},
    actionResults: [],
    total: { normalDamage: 0, avgDamage: 0, critDamage: 0, healing: 0, shield: 0 },
    dps: { normal: 0, avg: 0, crit: 0 },
  }),
  calcStrongestHit: vi.fn().mockReturnValue({ normal: 0, avg: 0, crit: 0 }),
}));

function renderTeamRotations() {
  return render(TeamRotations, {
    global: {
      stubs: {
        Nav: true,
        AppRichSelect: true,
        PaginationControls: true,
        TeamRotationTeamEditor: true,
        TeamRotationSummary: true,
        TeamBuildStatus: true,
        FavoriteHeartButton: true,
      },
    },
  });
}

const calcTeamRotationDamageMock = vi.mocked(calcTeamRotationDamage);

describe("TeamRotations per-team stats recompute (#438)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    calcTeamRotationDamageMock.mockClear();
  });

  it("computes stats once per team on initial load", async () => {
    const store = useTeamRotationsStore();
    store.createTeam("Team 1");
    store.createTeam("Team 2");
    store.createTeam("Team 3");

    renderTeamRotations();

    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(3));
  });

  it("recomputes only the edited team, not every saved team", async () => {
    const store = useTeamRotationsStore();
    const team1 = store.createTeam("Team 1");
    store.createTeam("Team 2");
    store.createTeam("Team 3");

    renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(3));
    calcTeamRotationDamageMock.mockClear();

    store.setTeamActions(team1.id, [
      { id: "action-1", slot: 0, order: 1, key: "Foo", type: "basic", isDisabled: false },
    ]);

    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));
    // Give any (incorrect) extra recompute a chance to fire before asserting it didn't.
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1);
  });

  it("does not recompute when an edit doesn't touch damage-relevant fields", async () => {
    const store = useTeamRotationsStore();
    const team1 = store.createTeam("Team 1");
    store.createTeam("Team 2");

    renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(2));
    calcTeamRotationDamageMock.mockClear();

    store.renameTeam(team1.id, "Renamed Team");
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(calcTeamRotationDamageMock).not.toHaveBeenCalled();
  });

  it("prunes a deleted team out of the rendered list and stats", async () => {
    const store = useTeamRotationsStore();
    const team1 = store.createTeam("Team 1");
    store.createTeam("Team 2");

    const { container } = renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(2));

    store.deleteTeam(team1.id);

    await waitFor(() => {
      expect(container.querySelectorAll('[data-test-team-rotations-item="Team 1"]')).toHaveLength(0);
    });
  });
});
