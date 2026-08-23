import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCharacterStore } from "../../src/stores/character";
import { useInventoryStore } from "../../src/stores/inventory";

describe("useCharacterStore builds", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("ensureCharacterBuilds", () => {
    it("synthesizes a Default build from the character's current fields", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", {
        characterLevel: "90",
        talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
        weapon: "SwordOfVoid",
      });

      store.ensureCharacterBuilds("Carlotta");

      const builds = store.getBuilds("Carlotta");
      expect(builds).toHaveLength(1);
      expect(builds[0].name).toBe("Default build");
      expect(builds[0].weapon).toBe("SwordOfVoid");
      expect(builds[0]).not.toHaveProperty("characterLevel");
      expect(builds[0]).not.toHaveProperty("talents");
      expect(store.getActiveBuildId("Carlotta")).toBe(builds[0].id);
    });

    it("is a no-op when builds already exist", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", { weapon: "SwordOfVoid" });
      store.ensureCharacterBuilds("Carlotta");
      const firstBuilds = store.getBuilds("Carlotta");

      store.ensureCharacterBuilds("Carlotta");

      expect(store.getBuilds("Carlotta")).toBe(firstBuilds);
      expect(store.getBuilds("Carlotta")).toHaveLength(1);
    });

    it("creates the character record when it doesn't exist yet", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");

      expect(store.getBuilds("Carlotta")).toHaveLength(1);
      expect(store.getBuilds("Carlotta")[0].name).toBe("Default build");
    });
  });

  describe("createBuild", () => {
    it("duplicates the active build's fields by default and activates the new one", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", { weapon: "SwordOfVoid" });
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");

      const build = store.createBuild("Carlotta", "Burst");

      expect(build.name).toBe("Burst");
      expect(build.weapon).toBe("SwordOfVoid");
      expect(store.getBuilds("Carlotta")).toHaveLength(2);
      expect(store.getActiveBuildId("Carlotta")).toBe(build.id);
      expect(store.getActiveBuildId("Carlotta")).not.toBe(defaultId);
      expect(store.characters.Carlotta.weapon).toBe("SwordOfVoid");
    });

    it("starts blank when from: 'blank' is passed", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", { weapon: "SwordOfVoid", buffs: { Foo: { isEnabled: true } } });
      store.ensureCharacterBuilds("Carlotta");

      const build = store.createBuild("Carlotta", "Fresh", { from: "blank" });

      expect(build.weapon).toBeUndefined();
      expect(build.buffs).toBeUndefined();
      expect(store.characters.Carlotta.weapon).toBeUndefined();
    });

    it("defaults an empty name to 'New Build'", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");

      const build = store.createBuild("Carlotta", "");

      expect(build.name).toBe("New Build");
    });
  });

  describe("importBuild", () => {
    it("creates a new build from the given fields, with a fresh id, and equips it", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", { weapon: "SwordOfVoid" });
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");

      const build = store.importBuild("Carlotta", { name: "Imported", weapon: "AnotherWeapon" });

      expect(build.id).not.toBe(defaultId);
      expect(build.name).toBe("Imported");
      expect(build.weapon).toBe("AnotherWeapon");
      expect(store.getBuilds("Carlotta")).toHaveLength(2);
      expect(store.getActiveBuildId("Carlotta")).toBe(build.id);
      expect(store.characters.Carlotta.weapon).toBe("AnotherWeapon");
    });

    it("defaults a missing name to 'Imported Build'", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");

      const build = store.importBuild("Carlotta", { weapon: "SwordOfVoid" });

      expect(build.name).toBe("Imported Build");
    });

    it("creates the character record when it doesn't exist yet", () => {
      const store = useCharacterStore();

      const build = store.importBuild("Carlotta", { name: "Imported", weapon: "SwordOfVoid" });

      // ensureCharacterBuilds synthesizes a "Default build" first, so the
      // imported build is the second entry, but it's the one left equipped.
      expect(store.characters.Carlotta.builds).toHaveLength(2);
      expect(store.getActiveBuildId("Carlotta")).toBe(build.id);
    });
  });

  describe("renameBuild", () => {
    it("renames the given build", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");
      const buildId = store.getActiveBuildId("Carlotta");

      store.renameBuild("Carlotta", buildId, "My Build");

      expect(store.getBuilds("Carlotta")[0].name).toBe("My Build");
    });

    it("ignores an empty name", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");
      const buildId = store.getActiveBuildId("Carlotta");

      store.renameBuild("Carlotta", buildId, "");

      expect(store.getBuilds("Carlotta")[0].name).toBe("Default build");
    });
  });

  describe("deleteBuild", () => {
    it("refuses to delete the only build", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");
      const buildId = store.getActiveBuildId("Carlotta");

      const result = store.deleteBuild("Carlotta", buildId);

      expect(result).toBe(false);
      expect(store.getBuilds("Carlotta")).toHaveLength(1);
    });

    it("deletes a non-active build", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");
      const second = store.createBuild("Carlotta", "Second");
      store.equipBuild("Carlotta", defaultId);

      const result = store.deleteBuild("Carlotta", second.id);

      expect(result).toBe(true);
      expect(store.getBuilds("Carlotta")).toHaveLength(1);
      expect(store.getActiveBuildId("Carlotta")).toBe(defaultId);
    });

    it("falls back to the first remaining build when deleting the active one", () => {
      const store = useCharacterStore();
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");
      store.createBuild("Carlotta", "Second");
      const activeId = store.getActiveBuildId("Carlotta");
      expect(activeId).not.toBe(defaultId);

      const result = store.deleteBuild("Carlotta", activeId);

      expect(result).toBe(true);
      expect(store.getBuilds("Carlotta")).toHaveLength(1);
      expect(store.getActiveBuildId("Carlotta")).toBe(defaultId);
    });
  });

  describe("equipBuild", () => {
    it("commits live edits back into the outgoing build before switching", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", { weapon: "SwordOfVoid" });
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");
      const second = store.createBuild("Carlotta", "Second", { from: "blank" });

      // live-edit the (now active) second build
      store.setCharacterData("Carlotta", { weapon: "AnotherWeapon" });

      store.equipBuild("Carlotta", defaultId);

      const secondBuild = store.getBuilds("Carlotta").find((b: any) => b.id === second.id);
      expect(secondBuild.weapon).toBe("AnotherWeapon");
    });

    it("applies the target build's fields onto the live record", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", { weapon: "SwordOfVoid" });
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");
      store.createBuild("Carlotta", "Second", { from: "blank" });

      store.equipBuild("Carlotta", defaultId);

      expect(store.characters.Carlotta.weapon).toBe("SwordOfVoid");
      expect(store.getActiveBuildId("Carlotta")).toBe(defaultId);
    });

    it("preserves characterLevel and talents across a switch", () => {
      const store = useCharacterStore();
      store.setCharacterData("Carlotta", {
        characterLevel: "90",
        talents: { basic: 10, skill: 10, forte: 10, liberation: 10, intro: 10 },
        weapon: "SwordOfVoid",
      });
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");
      const second = store.createBuild("Carlotta", "Second", { from: "blank" });

      store.equipBuild("Carlotta", defaultId);
      store.equipBuild("Carlotta", second.id);

      expect(store.characters.Carlotta.characterLevel).toBe("90");
      expect(store.characters.Carlotta.talents).toEqual({
        basic: 10,
        skill: 10,
        forte: 10,
        liberation: 10,
        intro: 10,
      });
    });

    it("syncs the inventory equipped map to the newly-active build's echoes", () => {
      const store = useCharacterStore();
      const inventoryStore = useInventoryStore();
      store.ensureCharacterBuilds("Carlotta");
      const defaultId = store.getActiveBuildId("Carlotta");
      const second = store.createBuild("Carlotta", "Second", { from: "blank" });

      // real echo-equip path (keeps character.echoes and inventory.equipped in sync)
      store.applyEchoLoadout("Carlotta", { echoIds: ["echo-2", null, null, null, null] });
      expect(inventoryStore.equipped["echo-2"]?.Carlotta).toBe(0);

      store.equipBuild("Carlotta", defaultId);

      // default build has no stored echoes, so switching to it unequips echo-2
      expect(inventoryStore.equipped["echo-2"]?.Carlotta).toBeUndefined();

      store.equipBuild("Carlotta", second.id);

      // switching back restores what was committed into the Second build on the way out
      expect(inventoryStore.equipped["echo-2"]?.Carlotta).toBe(0);
    });
  });
});
