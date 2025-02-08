export const testAttacks = (attackTests: AttackTests, cy: any) => {
  attackTests.forEach(({ selector, values }) => {
    cy.get(selector).should(($el) => {
      values.forEach((text) => {
        expect($el).to.contain.text(text);
      });
    });
  });
};
