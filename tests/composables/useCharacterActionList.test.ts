import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useCharacterActionList } from "../../src/composables/useCharacterActionList";

const CHARACTER_DATA = {
  basicAttacks: {
    attacks: [
      { key: "BasicAttack1DMG", label: "Basic Attack 1 DMG", type: "Basic" },
      { key: "HeavyAttackDMG", label: "Heavy Attack DMG", type: "Heavy" },
    ],
  },
  skillAttacks: {
    attacks: [{ key: "SkillDMG", label: "Resonance Skill DMG", type: "Skill" }],
  },
  // A group without a `key`/`label` pair should be skipped rather than
  // throwing or producing a broken entry.
  liberationAttacks: {
    attacks: [{ type: "Liberation" }],
  },
};

describe("useCharacterActionList", () => {
  it("is empty when characterData is null/undefined", () => {
    expect(useCharacterActionList(ref(null)).value).toEqual([]);
    expect(useCharacterActionList(ref(undefined)).value).toEqual([]);
  });

  it("flattens basic/skill/etc attack groups into MatchableActions with short action-type groups", () => {
    const list = useCharacterActionList(ref(CHARACTER_DATA));
    expect(list.value).toContainEqual({ key: "BasicAttack1DMG", label: "Basic Attack 1 DMG", group: "basic" });
    expect(list.value).toContainEqual({ key: "HeavyAttackDMG", label: "Heavy Attack DMG", group: "basic" });
    expect(list.value).toContainEqual({ key: "SkillDMG", label: "Resonance Skill DMG", group: "skill" });
  });

  it("skips attacks missing a key or label", () => {
    const list = useCharacterActionList(ref(CHARACTER_DATA));
    expect(list.value.some((a) => a.group === "liberation")).toBe(false);
  });

  it("is reactive to characterData changes", () => {
    const data = ref<Record<string, unknown> | null>(null);
    const list = useCharacterActionList(data);
    expect(list.value).toEqual([]);
    data.value = CHARACTER_DATA;
    expect(list.value.length).toBeGreaterThan(0);
  });
});
