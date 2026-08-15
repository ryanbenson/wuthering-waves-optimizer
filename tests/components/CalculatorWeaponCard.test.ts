import { describe, it, expect } from "vitest";
import { render } from "@testing-library/vue";
import CalculatorWeaponCard from "../../src/components/CalculatorWeaponCard.vue";

describe("CalculatorWeaponCard signature badge", () => {
  it("does not render a signature badge by default", () => {
    const { container } = render(CalculatorWeaponCard, {
      props: { name: "Azure Oath", nameKey: "AzureOath", rarity: 5 },
    });
    expect(container.querySelector("[data-test-weapon-signature-badge]")).toBeNull();
  });

  it("renders a signature badge when isSignature is true", () => {
    const { container, getByText } = render(CalculatorWeaponCard, {
      props: {
        name: "Azure Oath",
        nameKey: "AzureOath",
        rarity: 5,
        isSignature: true,
      },
    });
    expect(container.querySelector("[data-test-weapon-signature-badge]")).toBeTruthy();
    expect(getByText("Signature")).toBeTruthy();
  });
});
