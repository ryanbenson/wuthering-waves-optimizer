export function testStats(stats: StatTests, cy: any) {
  stats.forEach(({ selector, value }) => {
    cy.get(`.results ${selector}`).should("contain.text", value);
  });
}
