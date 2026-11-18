// Issue #663: Recommended teams on the Team Buffs tab, behind the
// "recommendedTeams" lab. Carlotta has curated teams in her basic.ts.
function visitWithLab(enabled: boolean) {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.setItem(
        "settings",
        JSON.stringify({ config: {}, labs: { recommendedTeams: { isEnabled: enabled } } }),
      );
    },
  });
}

describe("Recommended teams (recommendedTeams lab)", () => {
  it("fills both teammate slots from a recommended team", () => {
    visitWithLab(true);
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();

    cy.get("[data-test-recommended-teams]").should("contain.text", "Recommended teams for Carlotta");
    cy.get('[data-test-recommended-teams-use="Shorekeeper+Zhezhi"]').click();

    cy.get('[data-test-team-buffs-slot-name="1"]').should("contain.text", "Zhezhi");
    cy.get('[data-test-team-buffs-slot-name="2"]').should("contain.text", "Shorekeeper");
    cy.get('[data-test-recommended-teams-current="Shorekeeper+Zhezhi"]').should("be.visible");
    // Only the slots change; no buffs get turned on.
    cy.get("[data-test-team-buffs-empty]").should("be.visible");
  });

  it("isn't shown with the lab off", () => {
    visitWithLab(false);
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();
    cy.get('[data-test-team-buffs-slot-avatar="1"]').should("be.visible");
    cy.get("[data-test-recommended-teams]").should("not.exist");
  });
});
