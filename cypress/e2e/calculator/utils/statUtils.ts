export function testStats(stats: StatTests, cy: any) {
  stats.forEach(({ selector, value }) => {
    cy.get(selector).should("contain.text", value);
  });
}
