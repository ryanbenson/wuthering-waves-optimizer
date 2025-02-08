describe('Home E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage successfully and have the correct title', () => {
    cy.title().should('eq', 'Wuthering Waves Calculator & Optimizer');
  });

  it('should display the navigation bar with current chunks', () => {
    cy.get('.navbar').should('be.visible');
    cy.get('.navbar-start').should('be.visible');
    cy.get('.navbar-end').should('be.visible');
    cy.get('.navbar-center').should('be.visible');
  });

  it('should have an accessible damage calculator page', () => {
    cy.get('.calculator__content').should('be.visible');
  });

  it('should accept inputs for character details, and buffs', () => {
    cy.get('.character__selection__form--character select').select('Changli');
    cy.get('select[name=characterLevel]').select('80');
    cy.get('.character__buffs').should('be.visible');
    cy.get('.data-input--talents').should('be.visible');
    // Changli stats calculations
    cy.get('.stat-atk').should('contain.text', '412')
    cy.get('.stat-hp').should('contain.text', '9,133')
    cy.get('.stat-def').should('contain.text', '967')
    cy.get('.stat-cr').should('contain.text', '5.0%')
    cy.get('.stat-cd').should('contain.text', '150.0%')
    cy.get('.stat-er').should('contain.text', '100.0%')
    cy.get('.stat-basic').should('contain.text', '0.0%')
    cy.get('.stat-heavy').should('contain.text', '0.0%')
    cy.get('.stat-skill').should('contain.text', '0.0%')
    cy.get('.stat-liberation').should('contain.text', '0.0%')
    cy.get('.stat-glacio').should('contain.text', '0.0%')
    cy.get('.stat-fusion').should('contain.text', '0.0%')
    cy.get('.stat-electro').should('contain.text', '0.0%')
    cy.get('.stat-aero').should('contain.text', '0.0%')
    cy.get('.stat-spectro').should('contain.text', '0.0%')
    cy.get('.stat-havoc').should('contain.text', '0.0%')
    cy.get('.stat-healing').should('contain.text', '0.0%');
    // Damages validations
    const attackTests = [
      { selector: '.basic-attack-1-dmg', values: ['Basic Attack 1 DMG', '107', '110', '161'] },
      { selector: '.basic-attack-2-dmg', values: ['Basic Attack 2 DMG', '129', '132', '193'] },
      { selector: '.basic-attack-3-dmg', values: ['Basic Attack 3 DMG', '198', '203', '297'] },
      { selector: '.basic-attack-4-dmg', values: ['Basic Attack 4 DMG', '306', '314', '459'] },
      { selector: '.mid-air-attack-1-dmg', values: ['Mid-Air Attack 1 DMG', '111', '114', '167'] },
      { selector: '.mid-air-attack-2-dmg', values: ['Mid-Air Attack 2 DMG', '185', '189', '277'] },
      { selector: '.mid-air-attack-3-dmg', values: ['Mid-Air Attack 3 DMG', '239', '245', '359'] },
      { selector: '.mid-air-attack-4-dmg', values: ['Mid-Air Attack 4 DMG', '230', '235', '344'] },
      { selector: '.heavy-attack-dmg', values: ['Heavy Attack DMG', '225', '231', '338'] },
      { selector: '.mid-air-heavy-attack-dmg', values: ['Mid-Air Heavy Attack DMG', '223', '229', '335'] },
      { selector: '.dodge-counter-dmg', values: ['Dodge Counter DMG', '449', '460', '673'] },
      { selector: '.true-sight-capture-dmg', values: ['True Sight - Capture DMG', '741', '760', '1111'] },
      { selector: '.true-sight-conquest-dmg', values: ['True Sight - Conquest DMG', '534', '547', '800'] },
      { selector: '.true-sight-charge-dmg', values: ['True Sight - Charge DMG', '329', '337', '493'] },
      { selector: '.radiance-of-fealty-dmg', values: ['Radiance of Fealty DMG', '2194', '2249', '3291'] },
      { selector: '.flaming-sacrifice-dmg', values: ['Flaming Sacrifice DMG', '1184', '1213', '1775'] },
      { selector: '.obedience-of-rules-dmg', values: ['Obedience of Rules DMG', '269', '276', '403'] }
    ];
    attackTests.forEach(({ selector, values }) => {
      cy.get(selector).should(($el) => {
        values.forEach((text) => {
          expect($el).to.contain.text(text);
        });
      });
    });
  });

  it('should calculate and display the correct damage output and stats', () => {
    cy.get('.stat-atk').should('contain.text', 'Attack')
    cy.get('.stat-hp').should('contain.text', 'HP')
    cy.get('.stat-def').should('contain.text', 'Defense')
    cy.get('.stat-cr').should('contain.text', 'Crit Rate')
    cy.get('.stat-cd').should('contain.text', 'Crit DMG')
    cy.get('.stat-er').should('contain.text', 'Energy Regen')
    cy.get('.stat-basic').should('contain.text', 'Basic Attack DMG Bonus')
    cy.get('.stat-heavy').should('contain.text', 'Heavy Attack DMG Bonus')
    cy.get('.stat-skill').should('contain.text', 'Resonance Skill DMG Bonus')
    cy.get('.stat-liberation').should('contain.text', 'Resonance Liberation DMG Bonus')
    cy.get('.stat-glacio').should('contain.text', 'Glacio DMG Bonus')
    cy.get('.stat-fusion').should('contain.text', 'Fusion DMG Bonus')
    cy.get('.stat-electro').should('contain.text', 'Electro DMG Bonus')
    cy.get('.stat-aero').should('contain.text', 'Aero DMG Bonus')
    cy.get('.stat-spectro').should('contain.text', 'Spectro DMG Bonus')
    cy.get('.stat-havoc').should('contain.text', 'Havoc DMG Bonus')
    cy.get('.stat-healing').should('contain.text', 'Healing Bonus');
    cy.get('.damage__title').should('contain.text', 'Basic Attacks: Gnawing Fangs')
      .and('contain.text', 'Resonance Skill: Extermination Order')
      .and('contain.text', 'Resonance Liberation: Phantom Etching')
      .and('contain.text', 'Forte Circuit: Hunting Mission')
      .and('contain.text', 'Intro Skill: Wanted Outlaw')
      .and('contain.text', 'Outro Skill: Shadowy Raid')
      .and('contain.text', 'Echo Attacks');
    // Stats calculations
    cy.get('.stat-atk').should('contain.text', '437')
    cy.get('.stat-hp').should('contain.text', '10,500')
    cy.get('.stat-def').should('contain.text', '1,185')
    cy.get('.stat-cr').should('contain.text', '5.0%')
    cy.get('.stat-cd').should('contain.text', '150.0%')
    cy.get('.stat-er').should('contain.text', '100.0%')
    cy.get('.stat-basic').should('contain.text', '0.0%')
    cy.get('.stat-heavy').should('contain.text', '0.0%')
    cy.get('.stat-skill').should('contain.text', '0.0%')
    cy.get('.stat-liberation').should('contain.text', '0.0%')
    cy.get('.stat-glacio').should('contain.text', '0.0%')
    cy.get('.stat-fusion').should('contain.text', '0.0%')
    cy.get('.stat-electro').should('contain.text', '0.0%')
    cy.get('.stat-aero').should('contain.text', '0.0%')
    cy.get('.stat-spectro').should('contain.text', '0.0%')
    cy.get('.stat-havoc').should('contain.text', '0.0%')
    cy.get('.stat-healing').should('contain.text', '0.0%');
    // Damages validations
    cy.get('.stage-1-dmg').should('contain.text', 'Stage 1 DMG')
      .and('contain.text', '181')
      .and('contain.text', '185')
      .and('contain.text', '271')
    cy.get('.stage-2-dmg').should('contain.text', 'Stage 2 DMG')
      .and('contain.text', '197')
      .and('contain.text', '201')
      .and('contain.text', '295')
  });

  it('should enable character buffs and it affects the stats and damages', () => {
    cy.get('.character__self-buffs .character__buffs .card').each(($card) => {
      console.log($card);
      cy.wrap($card).find("input[type=checkbox]").click();
    });
    // Stats calculations
    cy.get('.stat-atk').should('contain.text', '489')
    cy.get('.stat-hp').should('contain.text', '10,500')
    cy.get('.stat-def').should('contain.text', '1,185')
    cy.get('.stat-cr').should('contain.text', '5.0%')
    cy.get('.stat-cd').should('contain.text', '166.0%')
    cy.get('.stat-er').should('contain.text', '100.0%')
    cy.get('.stat-basic').should('contain.text', '0.0%')
    cy.get('.stat-heavy').should('contain.text', '0.0%')
    cy.get('.stat-skill').should('contain.text', '0.0%')
    cy.get('.stat-liberation').should('contain.text', '10.0%')
    cy.get('.stat-glacio').should('contain.text', '0.0%')
    cy.get('.stat-fusion').should('contain.text', '0.0%')
    cy.get('.stat-electro').should('contain.text', '0.0%')
    cy.get('.stat-aero').should('contain.text', '0.0%')
    cy.get('.stat-spectro').should('contain.text', '0.0%')
    cy.get('.stat-havoc').should('contain.text', '0.0%')
    cy.get('.stat-healing').should('contain.text', '0.0%');
    // Damages validations
    cy.get('.stage-1-dmg').should('contain.text', 'Stage 1 DMG')
      .and('contain.text', '202')
      .and('contain.text', '209')
      .and('contain.text', '336')
    cy.get('.stage-2-dmg').should('contain.text', 'Stage 2 DMG')
      .and('contain.text', '220')
      .and('contain.text', '227')
      .and('contain.text', '365')
  });

  it('should display correctly on various screen sizes', () => {
    const sizes = ['iphone-6', 'ipad-2', [1024, 768]];
    sizes.forEach((size) => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }
      cy.get('.navbar').should('be.visible');
      cy.get('.calculator__content').should('be.visible');
    });
  });
});
