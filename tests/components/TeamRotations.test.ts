import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { render, waitFor, fireEvent } from "@testing-library/vue";
import TeamRotations from "../../src/components/TeamRotations.vue";
import { useTeamRotationsStore } from "../../src/stores/teamRotations";
import { useCharacterStore } from "../../src/stores/character";
import { calcTeamRotationDamage } from "../../src/calculator/teamRotation";

const ACTIVE_TEAM_ID_KEY = "teamRotationsActiveTeamId";

// Only the damage calc is faked; the pure DPS helpers (headlineDps,
// rotationDpsReadings) stay real.
vi.mock("../../src/calculator/teamRotation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../src/calculator/teamRotation")>()),
  calcTeamRotationDamage: vi.fn().mockResolvedValue({
    perCharacter: {},
    actionResults: [],
    total: { normalDamage: 0, avgDamage: 0, critDamage: 0, healing: 0, shield: 0 },
    dps: { normal: 0, avg: 0, crit: 0 },
    timing: null,
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

describe("TeamRotations per-slot build override in list stats", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    calcTeamRotationDamageMock.mockClear();
  });

  const pinnedBuild = { id: "build-pinned", name: "Pinned", weapon: "PinnedWeapon" };

  function seedCharacters() {
    const characterStore = useCharacterStore();
    characterStore.characters = {
      Calcharo: { weapon: "ActiveWeapon", builds: [pinnedBuild], activeBuildId: "build-active" },
      Changli: { weapon: "OtherWeapon" },
    };
    return characterStore;
  }

  it("forwards the team's pinned buildIds to the damage calc", async () => {
    seedCharacters();
    const store = useTeamRotationsStore();
    const team = store.createTeam("Team 1");
    store.setTeamCharacter(team.id, 0, "Calcharo");
    store.setTeamCharacterBuild(team.id, 0, "build-pinned");

    renderTeamRotations();

    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalled());
    const [input] = calcTeamRotationDamageMock.mock.calls.at(-1)!;
    expect(input.buildIds).toEqual(["build-pinned", null, null]);
  });

  it("recomputes when a slot's pinned build changes", async () => {
    seedCharacters();
    const store = useTeamRotationsStore();
    const team = store.createTeam("Team 1");
    store.setTeamCharacter(team.id, 0, "Calcharo");

    renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));
    calcTeamRotationDamageMock.mockClear();

    store.setTeamCharacterBuild(team.id, 0, "build-pinned");

    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));
  });

  it("recomputes a team when one of its slot characters' data changes", async () => {
    const characterStore = seedCharacters();
    const store = useTeamRotationsStore();
    const team = store.createTeam("Team 1");
    store.setTeamCharacter(team.id, 0, "Calcharo");

    renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));
    calcTeamRotationDamageMock.mockClear();

    characterStore.characters.Calcharo.weapon = "NewWeapon";

    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));
  });

  it("does not recompute when a character not on the team changes", async () => {
    const characterStore = seedCharacters();
    const store = useTeamRotationsStore();
    const team = store.createTeam("Team 1");
    store.setTeamCharacter(team.id, 0, "Calcharo");

    renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));
    calcTeamRotationDamageMock.mockClear();

    characterStore.characters.Changli.weapon = "NewWeapon";
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(calcTeamRotationDamageMock).not.toHaveBeenCalled();
  });

  it("does not recompute when only the active build changes on a slot pinned to another build", async () => {
    const characterStore = seedCharacters();
    const store = useTeamRotationsStore();
    const team = store.createTeam("Team 1");
    store.setTeamCharacter(team.id, 0, "Calcharo");
    store.setTeamCharacterBuild(team.id, 0, "build-pinned");

    renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));
    calcTeamRotationDamageMock.mockClear();

    characterStore.characters.Calcharo.weapon = "NewWeapon";
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(calcTeamRotationDamageMock).not.toHaveBeenCalled();
  });
});

describe("TeamRotations active-team session memory (#507)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    calcTeamRotationDamageMock.mockClear();
    sessionStorage.clear();
  });

  it("remembers the selected team across a remount, e.g. after navigating away and back", async () => {
    const store = useTeamRotationsStore();
    const team1 = store.createTeam("Team 1");
    store.createTeam("Team 2");

    const { container, unmount } = renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(2));

    await fireEvent.click(container.querySelector('[data-test-team-rotations-item="Team 1"]')!);
    expect(sessionStorage.getItem(ACTIVE_TEAM_ID_KEY)).toBe(team1.id);

    unmount();

    renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(2));
    expect(document.querySelector("[data-test-team-rotation-back]")).toBeTruthy();
    expect(document.querySelector("[data-test-team-rotations-list]")).toBeFalsy();
  });

  it("clears the remembered team once the user explicitly returns to the team list", async () => {
    const store = useTeamRotationsStore();
    store.createTeam("Team 1");

    const { container } = renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));

    await fireEvent.click(container.querySelector('[data-test-team-rotations-item="Team 1"]')!);
    expect(sessionStorage.getItem(ACTIVE_TEAM_ID_KEY)).not.toBeNull();

    await fireEvent.click(container.querySelector("[data-test-team-rotation-back]")!);
    expect(sessionStorage.getItem(ACTIVE_TEAM_ID_KEY)).toBeNull();
    expect(container.querySelector("[data-test-team-rotations-list]")).toBeTruthy();
  });

  it("falls back to the team list when the remembered team id no longer exists", async () => {
    sessionStorage.setItem(ACTIVE_TEAM_ID_KEY, "deleted-team-id");
    const store = useTeamRotationsStore();
    store.createTeam("Team 1");

    const { container } = renderTeamRotations();
    await waitFor(() => expect(calcTeamRotationDamageMock).toHaveBeenCalledTimes(1));

    expect(container.querySelector("[data-test-team-rotations-list]")).toBeTruthy();
  });
});
