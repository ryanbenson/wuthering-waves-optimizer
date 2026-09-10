import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TeamBuffsWorkspaceRow from "../../src/components/teamBuffsWorkspace/TeamBuffsWorkspaceRow.vue";
import type { PartyBuffDef } from "../../src/components/CalculatorTeamBuffsWorkspace.vue";

function baseDef(overrides: Partial<PartyBuffDef> = {}): PartyBuffDef {
  return {
    key: "SophisticatedStellarealmCritRate",
    name: "Sophisticated Stellarealm",
    details: "d",
    hasStacks: false,
    modifiers: [],
    minStacks: 0,
    maxStacks: 0,
    alwaysEnabled: false,
    inputBase: true,
    modifierBasedOn: "Energy Regen",
    ...overrides,
  };
}

describe("TeamBuffsWorkspaceRow", () => {
  it("emits the realistic base attr value when the Suggested button is clicked (issue #514)", async () => {
    const emitted: string[] = [];
    const { container } = render(TeamBuffsWorkspaceRow, {
      props: {
        def: baseDef({ realisticBaseAttrValue: 250 }),
        enabled: true,
        stacks: 0,
        refinement: "1",
        baseAttrValue: 0,
        contribution: "—",
        "onSet-base-attr-value": (value: string) => emitted.push(value),
      },
    });

    await fireEvent.click(
      container.querySelector(
        '[data-test-team-buffs-buff-input-base-suggested="SophisticatedStellarealmCritRate"]',
      )!,
    );

    expect(emitted).toEqual(["250"]);
  });

  it("does not render the Suggested button when no realistic value is configured", () => {
    const { container } = render(TeamBuffsWorkspaceRow, {
      props: {
        def: baseDef(),
        enabled: true,
        stacks: 0,
        refinement: "1",
        baseAttrValue: 0,
        contribution: "—",
      },
    });

    expect(
      container.querySelector(
        '[data-test-team-buffs-buff-input-base-suggested="SophisticatedStellarealmCritRate"]',
      ),
    ).toBeNull();
  });
});
