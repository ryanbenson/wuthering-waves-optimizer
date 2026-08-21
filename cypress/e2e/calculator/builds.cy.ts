describe("Calculator multiple builds", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible"); // wait for things to load
  });

  function openManageBuilds() {
    cy.get('[data-test-calculator-nav="character"]').click();
    cy.get("[data-test-manage-builds-open]").click();
  }

  // Every mounted AppRichSelect renders a [data-test-rich-select-menu], even
  // closed ones, so interactions must scope from the specific trigger's own
  // `.app-rich-select` wrapper (same approach as the `richSelect` custom
  // command) rather than a bare global selector.
  function pickFirstRealWeapon() {
    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get("[data-test-weapon-select]").first().as("weaponTrigger");
    cy.get("@weaponTrigger").scrollIntoView().click({ force: true });
    cy.get("@weaponTrigger")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open")
      .within(() => {
        cy.get("[data-test-rich-select-option]")
          .not('[data-test-rich-select-option="null"]')
          .first()
          .invoke("text")
          .then((name) => {
            cy.wrap(name.trim()).as("pickedWeaponName");
          });
        cy.get("[data-test-rich-select-option]")
          .not('[data-test-rich-select-option="null"]')
          .first()
          .click({ force: true });
      });
  }

  function switchBuildTo(buildName: string) {
    cy.get('[data-test-calculator-nav="character"]').click();
    cy.get("[data-test-build-select]").first().as("buildSelectTrigger");
    cy.get("@buildSelectTrigger").scrollIntoView().click({ force: true });
    cy.get("@buildSelectTrigger")
      .closest(".app-rich-select")
      .should("have.class", "dropdown-open")
      .within(() => {
        cy.contains("[data-test-rich-select-option]", buildName).click({ force: true });
      });
  }

  it("gives a fresh character a single Default build that can't be deleted", () => {
    openManageBuilds();
    cy.get("[data-test-manage-builds-row]").should("have.length", 1);
    cy.get('[data-test-manage-builds-name]').should("have.value", "Default build");
    cy.get("[data-test-manage-builds-delete]").should("be.disabled");
  });

  it("duplicating the active build carries its data over and equips the new build", () => {
    pickFirstRealWeapon();

    openManageBuilds();
    cy.get("[data-test-manage-builds-new-name]").type("Burst Build");
    cy.get("[data-test-manage-builds-create-active]").click();

    cy.get("[data-test-manage-builds-row]").should("have.length", 2);
    cy.get('[data-test-manage-builds-row="Burst Build"]').within(() => {
      cy.get('[data-test-manage-builds-name]').should("have.value", "Burst Build");
      cy.contains("Active").should("be.visible");
    });
    cy.get("[data-test-manage-builds-close]").click();

    cy.get("@pickedWeaponName").then((name) => {
      cy.get('[data-test-calculator-nav="weapon"]').click();
      cy.get("[data-test-weapon-select]").should("contain.text", name as unknown as string);
    });
  });

  it("starting a build blank does not carry the active build's weapon over", () => {
    pickFirstRealWeapon();

    openManageBuilds();
    cy.get("[data-test-manage-builds-new-name]").type("Blank Build");
    cy.get("[data-test-manage-builds-create-blank]").click();
    cy.get("[data-test-manage-builds-close]").click();

    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "Choose a weapon");
  });

  it("switching builds via the header dropdown swaps build data and switching back restores it", () => {
    pickFirstRealWeapon();

    openManageBuilds();
    cy.get("[data-test-manage-builds-new-name]").type("Blank Build");
    cy.get("[data-test-manage-builds-create-blank]").click();
    cy.get("[data-test-manage-builds-close]").click();

    cy.get('[data-test-calculator-nav="weapon"]').click();
    cy.get("[data-test-weapon-select]").should("contain.text", "Choose a weapon");

    // switch back to Default via the build select
    switchBuildTo("Default build");

    cy.get("@pickedWeaponName").then((name) => {
      cy.get('[data-test-calculator-nav="weapon"]').click();
      cy.get("[data-test-weapon-select]").should("contain.text", name as unknown as string);
    });
  });

  it("keeps characterLevel shared across builds while switching build-scoped data", () => {
    cy.richSelect("[data-test-character-level]", "80");

    openManageBuilds();
    cy.get("[data-test-manage-builds-new-name]").type("Blank Build");
    cy.get("[data-test-manage-builds-create-blank]").click();
    cy.get("[data-test-manage-builds-close]").click();

    cy.get("[data-test-character-level]").should("contain.text", "80");
  });

  it("blocks deleting a character's last remaining build", () => {
    pickFirstRealWeapon();

    openManageBuilds();
    cy.get("[data-test-manage-builds-new-name]").type("Second Build");
    cy.get("[data-test-manage-builds-create-active]").click();

    cy.get("[data-test-manage-builds-row]").should("have.length", 2);

    // delete every build we can, until only one — un-deletable — remains
    cy.get("[data-test-manage-builds-delete]:not(:disabled)").first().click();
    cy.contains("button", "Delete").click();

    cy.get("[data-test-manage-builds-row]").should("have.length", 1);
    cy.get("[data-test-manage-builds-delete]").should("be.disabled");
  });
});
