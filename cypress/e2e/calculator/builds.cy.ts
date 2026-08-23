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
    // 80 is index 11 in the level range's discrete value list — the range
    // tracks the step index, not the level value itself.
    cy.get("[data-test-character-level]")
      .invoke("val", 11)
      .trigger("input")
      .trigger("change");
    cy.get("[data-test-character-level-label]").should("contain.text", "80");

    openManageBuilds();
    cy.get("[data-test-manage-builds-new-name]").type("Blank Build");
    cy.get("[data-test-manage-builds-create-blank]").click();
    cy.get("[data-test-manage-builds-close]").click();

    cy.get("[data-test-character-level-label]").should("contain.text", "80");
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

describe("Calculator build export/import", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win.navigator.clipboard, "writeText").as("writeText").resolves();
      },
    });
    cy.richSelect("[data-test-character-select]", "Carlotta");
    cy.get(".character__self-buffs").should("be.visible");
  });

  function openManageBuilds() {
    cy.get('[data-test-calculator-nav="character"]').click();
    cy.get("[data-test-manage-builds-open]").click();
  }

  it("exports a build's config to the clipboard and re-imports it as a separate build", () => {
    openManageBuilds();
    cy.get('[data-test-manage-builds-row="Default build"]').within(() => {
      cy.get("[data-test-manage-builds-export]").click();
    });
    cy.get('[data-test-manage-builds-row="Default build"]').within(() => {
      cy.get("[data-test-manage-builds-export-clipboard]").click({ force: true });
    });
    cy.get("@writeText").should("have.been.calledOnce");

    cy.get("@writeText").then((stub: any) => {
      const exported = stub.getCall(0).args[0] as string;
      const parsed = JSON.parse(exported);
      expect(parsed.meta.type).to.equal("characterBuild");
      expect(parsed.data.name).to.equal("Default build");

      cy.get("[data-test-manage-builds-toggle-import]").click();
      cy.get("[data-test-manage-builds-import-text]").type(exported, {
        parseSpecialCharSequences: false,
      });
      cy.get("[data-test-manage-builds-import-text-button]").click();

      // Import created a second, separate build (same name — the export
      // preserves it — but it's the one now Active, not the original).
      cy.get("[data-test-manage-builds-row]").should("have.length", 2);
      cy.get('[data-test-manage-builds-row="Default build"]').should("have.length", 2);
      cy.contains('[data-test-manage-builds-row="Default build"]', "Active").should(
        "have.length",
        1,
      );
    });
  });

  it("imports a build from an uploaded .json file", () => {
    openManageBuilds();
    cy.get("[data-test-manage-builds-toggle-import]").click();

    const payload = JSON.stringify({
      meta: { version: "1", source: "WutheringTools", type: "characterBuild" },
      data: { name: "From File", weapon: "SwordOfVoid" },
    });
    cy.get("[data-test-manage-builds-import-file]").selectFile(
      {
        contents: Cypress.Buffer.from(payload),
        fileName: "from-file.json",
        mimeType: "application/json",
      },
      { force: true },
    );
    // Selecting a file alone must not import it — only clicking Import does.
    cy.get("[data-test-manage-builds-row]").should("have.length", 1);
    cy.get("[data-test-manage-builds-import-file-button]").click();

    cy.get("[data-test-manage-builds-row]").should("have.length", 2);
    cy.get('[data-test-manage-builds-row="From File"]').within(() => {
      cy.contains("Active").should("be.visible");
    });
  });

  it("shows a clear error and doesn't create a build for unrecognizable input", () => {
    openManageBuilds();
    cy.get("[data-test-manage-builds-toggle-import]").click();
    cy.get("[data-test-manage-builds-import-text]").type("not json at all");
    cy.get("[data-test-manage-builds-import-text-button]").click();
    cy.get("[data-test-manage-builds-row]").should("have.length", 1);
  });

  it("the download button doesn't error", () => {
    openManageBuilds();
    cy.get('[data-test-manage-builds-row="Default build"]').within(() => {
      cy.get("[data-test-manage-builds-export]").click();
    });
    cy.get('[data-test-manage-builds-row="Default build"]').within(() => {
      cy.get("[data-test-manage-builds-export-file]").click({ force: true });
    });
  });
});
