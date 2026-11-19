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

  it("also turns on the teammates' typical buffs for their sequence and signature weapon", () => {
    visitWithLab(true);
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();

    cy.get("[data-test-recommended-teams-with-buffs]").check();
    cy.get('[data-test-recommended-teams-sequence="Shorekeeper"]').first().select("S2");
    cy.get('[data-test-recommended-teams-signature="Shorekeeper"]').first().check();
    cy.get('[data-test-recommended-teams-use="Shorekeeper+Zhezhi"]').click();

    cy.get('[data-test-team-buffs-slot-name="2"]').should("contain.text", "Shorekeeper");
    for (const key of [
      "OutroSkillWhitening",
      "OutroSkillBinaryButterfly",
      "SophisticatedStellarealmCritRate",
      "SequenceNode2NightsGiftandRefusal",
      "StellarSymphonyATK",
      "RejuvenatingGlow",
      "MoonlitClouds",
      "ImpermanenceHeron",
    ]) {
      cy.get(`[data-test-team-buffs-buff-enabled="${key}"]`).should("be.checked");
    }
    // Zhezhi at S0: her S4 buff stays off.
    cy.get('[data-test-team-buffs-buff-enabled="SequenceNode4HuesSpectrum"]').should("not.be.checked");
    cy.get('[data-test-team-buffs-buff-input-base="SophisticatedStellarealmCritRate"]').should("have.value", "250");

    // The sequence and Sig are remembered for next time.
    cy.reload();
    cy.get('[data-test-calculator-nav="team"]').click();
    cy.get("[data-test-recommended-teams-with-buffs]").check();
    cy.get('[data-test-recommended-teams-sequence="Shorekeeper"]').first().should("have.value", "2");
  });

  it("asks whether to replace or add when team buffs are already on", () => {
    visitWithLab(true);
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();
    cy.get('[data-test-team-buffs-buff-enabled="MidnightVeil"]').check();

    cy.get("[data-test-recommended-teams-with-buffs]").check();
    cy.get('[data-test-recommended-teams-use="Shorekeeper+Zhezhi"]').click();
    cy.get("[data-test-recommended-teams-dialog]").should("be.visible");
    cy.get("[data-test-recommended-teams-replace]").click();

    cy.get('[data-test-team-buffs-buff-enabled="MidnightVeil"]').should("not.be.checked");
    cy.get('[data-test-team-buffs-buff-enabled="OutroSkillBinaryButterfly"]').should("be.checked");
  });

  it("isn't shown with the lab off", () => {
    visitWithLab(false);
    cy.selectWorkspaceCharacter("Carlotta");
    cy.get('[data-test-calculator-nav="team"]').click();
    cy.get('[data-test-team-buffs-slot-avatar="1"]').should("be.visible");
    cy.get("[data-test-recommended-teams]").should("not.exist");
  });
});
