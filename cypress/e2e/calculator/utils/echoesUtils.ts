import { subStatsTable } from "../../../../src/echoes/stats";

export function configureEcho(echoNumber: number, echoData: any, cy: any) {
  // click echo image to open modal
  cy.get(`[data-test-echo-item="${echoNumber}"] .echo__item__image`).click();
  // should get default untitled rotation
  cy.get(`#echoModal${echoNumber}`).should("be.visible");
  // choose the value SentryConstruct as main echo
  cy.get(`#echoModal${echoNumber} .main-echo-selector`).select(
    echoData.mainEcho,
  );
  // choose crit rate as main stat
  cy.get(`#echoModal${echoNumber} .echo-main-stat-selector`).select(
    echoData.mainStat,
  );
  // choose the set
  cy.get(
    `#echoModal${echoNumber} [data-test-echo-set="${echoData.set}"]`,
  ).click();
  // choose the sub stats: e.g. CritRate, CritDMG, ATK, ATK_FLAT, ResonanceSkillDMGBonus,
  // then set the values: e.g. 7.5, 16.2, 9.4, 50, 10.9
  // note that for the range, the value is the index of the value in the substats table, not the value itself

  const subStats = Object.keys(echoData.subStats);
  // for each substat, check the checkbox and set the value
  subStats.forEach((subStat) => {
    cy.get(
      `#echoModal${echoNumber} [data-test-substat-checkbox="${subStat}"]`,
    ).check();
    // get the index from the table that is stat[value]
    const subStatValue = echoData.subStats[subStat];
    const subStatIndex = subStatsTable[subStat].findIndex(
      (statValue) => statValue === subStatValue,
    );
    cy.get(`#echoModal${echoNumber} [data-test-substat-range="${subStat}"]`)
      .invoke("val", subStatIndex)
      .trigger("input")
      .trigger("change");
    cy.get(
      `#echoModal${echoNumber} [data-test-substat-label="${subStat}"]`,
    ).should("contain.text", echoData.subStats[subStat].toString());
  });

  //   cy.get(`#echoModal${echoNumber} [data-test-substat-checkbox="CritRate"]`).check();
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-checkbox="CritDMG"]`).check();
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-checkbox="ATK"]`).check();
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-checkbox="ATK_FLAT"]`).check();
  //   cy.get(
  //     `#echoModal${echoNumber} [data-test-substat-checkbox="ResonanceSkillDMGBonus"]`,
  //   ).check();
  //   // remember that the values for the range is the step value, not the actual value
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-range="CritRate"]`)
  //     .invoke("val", 2)
  //     .trigger("input")
  //     .trigger("change");
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-label="CritRate"]`).should(
  //     "contain.text",
  //     "7.5",
  //   );
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-range="CritDMG"]`)
  //     .invoke("val", 3)
  //     .trigger("input")
  //     .trigger("change");
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-label="CritDMG"]`).should(
  //     "contain.text",
  //     "16.2",
  //   );
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-range="ATK"]`)
  //     .invoke("val", 4)
  //     .trigger("input")
  //     .trigger("change");
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-label="ATK"]`).should(
  //     "contain.text",
  //     "9.4",
  //   );
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-range="ATK_FLAT"]`)
  //     .invoke("val", 2)
  //     .trigger("input")
  //     .trigger("change");
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-label="ATK_FLAT"]`).should(
  //     "contain.text",
  //     "50",
  //   );
  //   cy.get(`#echoModal${echoNumber} [data-test-substat-range="ResonanceSkillDMGBonus"]`)
  //     .invoke("val", 6)
  //     .trigger("input")
  //     .trigger("change");
  //   cy.get(
  //     `#echoModal${echoNumber} [data-test-substat-label="ResonanceSkillDMGBonus"]`,
  //   ).should("contain.text", "10.9");

  // then close the modal by clicking data-test-echo-modal-close
  cy.get(`#echoModal${echoNumber} [data-test-echo-modal-close]`).click();
}
