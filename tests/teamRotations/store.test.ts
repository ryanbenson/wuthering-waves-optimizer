import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useTeamRotationsStore } from "../../src/stores/teamRotations";

describe("useTeamRotationsStore.importTeam", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("creates a new team with a fresh id, distinct from any id in the imported data", () => {
    const store = useTeamRotationsStore();
    const team = store.importTeam({
      name: "Imported Team",
      characterIds: ["Carlotta", "Shorekeeper", null],
      actions: [{ id: "stale-id", slot: 0, order: 1, key: "Foo", type: "basic" }],
      duration: 30,
      enemyConfig: { enemyLevel: 95 },
      mode: "advanced",
    });

    expect(team.id).toBeTruthy();
    expect(store.teams).toHaveLength(1);
    expect(store.getTeamById(team.id)).toEqual(team);

    // Action ids are regenerated too, never reusing whatever was imported.
    expect(team.actions[0].id).not.toBe("stale-id");
    expect(team.actions[0]).toMatchObject({ slot: 0, order: 1, key: "Foo", type: "basic" });
  });

  it("fills in enemy config defaults for fields the import omitted", () => {
    const store = useTeamRotationsStore();
    const team = store.importTeam({
      name: "Partial",
      characterIds: ["Carlotta", null, null],
      actions: [],
      duration: null,
      enemyConfig: { enemyLevel: 95 },
    });

    expect(team.enemyConfig).toMatchObject({
      enemyLevel: 95,
      enemyResist: 0.1,
      enemyType: "Calamity",
    });
  });

  it("defaults an unrecognized mode to basic, and an empty name to a placeholder", () => {
    const store = useTeamRotationsStore();
    const team = store.importTeam({
      name: "",
      characterIds: [null, null, null],
      actions: [],
      duration: null,
      enemyConfig: {},
      mode: "not-a-real-mode",
    });

    expect(team.mode).toBe("basic");
    expect(team.name).toBe("Imported Team");
  });

  it("doesn't affect other teams already in the store", () => {
    const store = useTeamRotationsStore();
    const existing = store.createTeam("Existing");
    store.importTeam({ name: "New", characterIds: [null, null, null], actions: [] });

    expect(store.teams).toHaveLength(2);
    expect(store.getTeamById(existing.id)?.name).toBe("Existing");
  });
});

describe("useTeamRotationsStore.setTeamStatus", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("sets the given team's buildStatus", () => {
    const store = useTeamRotationsStore();
    const team = store.createTeam("Team 1");

    store.setTeamStatus(team.id, "in-progress");

    expect(store.getTeamById(team.id)?.buildStatus).toBe("in-progress");
  });

  it("does nothing for an unknown team id", () => {
    const store = useTeamRotationsStore();
    store.createTeam("Team 1");

    expect(() => store.setTeamStatus("no-such-id", "finished")).not.toThrow();
  });

  it("only affects the targeted team", () => {
    const store = useTeamRotationsStore();
    const teamA = store.createTeam("Team A");
    const teamB = store.createTeam("Team B");

    store.setTeamStatus(teamA.id, "finished");

    expect(store.getTeamById(teamA.id)?.buildStatus).toBe("finished");
    expect(store.getTeamById(teamB.id)?.buildStatus).toBeUndefined();
  });
});
