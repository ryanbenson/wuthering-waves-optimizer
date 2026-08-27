import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import CalculatorRotationQuickAdd from "../../src/components/CalculatorRotationQuickAdd.vue";
import type { MatchableAction } from "../../src/utils/actionTextMatch";

const ACTIONS: MatchableAction[] = [
  { key: "IntroSkillDMG", label: "Intro Skill", group: "intro" },
  { key: "OutroSkillDMG", label: "Outro Skill", group: "outro" },
  { key: "OutroWildfireDMG", label: "Outro: Wildfire Mark", group: "outro" },
  { key: "HeavyAttackDMG", label: "Heavy Attack", group: "basic" },
];

function renderQuickAdd() {
  return render(CalculatorRotationQuickAdd, { props: { actions: ACTIONS } });
}

describe("CalculatorRotationQuickAdd", () => {
  it("adds a single action via Enter and clears the input", async () => {
    const { getByPlaceholderText, emitted } = renderQuickAdd();
    const input = getByPlaceholderText(/type an action name/i) as HTMLInputElement;

    await fireEvent.update(input, "Intro Skill");
    await fireEvent.keyDown(input, { key: "Enter" });

    expect(emitted("add-actions")).toEqual([[[{ key: "IntroSkillDMG", type: "intro", count: 1 }]]]);
    expect(input.value).toBe("");
  });

  it("does nothing on Enter when the query doesn't match anything", async () => {
    const { getByPlaceholderText, emitted } = renderQuickAdd();
    const input = getByPlaceholderText(/type an action name/i) as HTMLInputElement;

    await fireEvent.update(input, "zzzzzzz");
    await fireEvent.keyDown(input, { key: "Enter" });

    expect(emitted("add-actions")).toBeUndefined();
  });

  it("parses a matched, ambiguous, and unmatched paste in one batch, respecting count suffixes", async () => {
    const { getByPlaceholderText, getByText, container, emitted } = renderQuickAdd();
    await fireEvent.click(getByText("📋 Paste a whole rotation"));

    const textarea = container.querySelector("[data-test-rotation-quick-add-textarea]") as HTMLTextAreaElement;
    await fireEvent.update(textarea, "Heavy Attack x2\nOutr\nnothing like this exists");

    // Matched line contributes to the count immediately, but Add stays
    // disabled while the ambiguous line has no pick yet — unmatched never
    // counts and never blocks.
    const addBtn = getByText(/^Add \d+ actions?$/) as HTMLButtonElement;
    expect(addBtn.textContent?.trim()).toBe("Add 1 action");
    expect(addBtn.disabled).toBe(true);

    const picker = container.querySelector('[data-test-rotation-quick-add-paste-pick="1"]') as HTMLSelectElement;
    expect(picker).not.toBeNull();
    await fireEvent.update(picker, "OutroWildfireDMG");

    expect(getByText(/^Add \d+ actions?$/).textContent?.trim()).toBe("Add 2 actions");
    expect((getByText(/^Add \d+ actions?$/) as HTMLButtonElement).disabled).toBe(false);

    await fireEvent.click(getByText(/^Add \d+ actions?$/));

    expect(emitted("add-actions")).toEqual([
      [
        [
          { key: "HeavyAttackDMG", type: "basic", count: 2 },
          { key: "OutroWildfireDMG", type: "outro", count: 1 },
        ],
      ],
    ]);
    // Submitting resets the paste panel.
    expect(getByPlaceholderText(/type an action name/i)).toBeTruthy();
    expect(container.querySelector("[data-test-rotation-quick-add-paste]")).toBeNull();
  });

  it("keeps the Add button disabled while any ambiguous line is unresolved", async () => {
    const { getByText, container } = renderQuickAdd();
    await fireEvent.click(getByText("📋 Paste a whole rotation"));
    const textarea = container.querySelector("[data-test-rotation-quick-add-textarea]") as HTMLTextAreaElement;
    await fireEvent.update(textarea, "Outr");

    const addBtn = container.querySelector("[data-test-rotation-quick-add-submit]") as HTMLButtonElement;
    expect(addBtn.disabled).toBe(true);
  });
});
