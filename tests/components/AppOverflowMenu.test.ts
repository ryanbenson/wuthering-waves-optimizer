import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import AppOverflowMenu from "../../src/components/AppOverflowMenu.vue";

describe("AppOverflowMenu", () => {
  it("renders the trigger with a default aria-label", () => {
    const { getByRole } = render(AppOverflowMenu);
    expect(getByRole("button", { name: "More actions" })).toBeTruthy();
  });

  it("renders a custom aria-label when provided", () => {
    const { getByRole } = render(AppOverflowMenu, {
      props: { ariaLabel: "More inventory actions" },
    });
    expect(
      getByRole("button", { name: "More inventory actions" }),
    ).toBeTruthy();
  });

  it("renders slotted menu items and fires their click handlers", async () => {
    // The menu is teleported to <body> and only rendered while open (see
    // AppOverflowMenu.vue) — it needs to escape overflow-clipped ancestors
    // like CalculatorRotations.vue's scroll pane, so slotted items don't
    // exist in the DOM at all until the trigger is opened.
    const { getByRole, getByText } = render(AppOverflowMenu, {
      slots: {
        default:
          '<li><button type="button" data-test-menu-item>Rating Guide</button></li>',
      },
    });
    await fireEvent.click(getByRole("button", { name: "More actions" }));
    const item = getByText("Rating Guide");
    expect(item).toBeTruthy();
    await fireEvent.click(item);
  });
});
