// Each page sets its own tab title, and the calculator, which uses the
// site-wide one from index.html, gets it back when you return.
const SUFFIX = " — Wuthering Waves Calculator & Optimizer";
const BASE_TITLE = "Wuthering Waves Calculator & Optimizer";

const pages = [
  { path: "/updates", title: "Updates" },
  { path: "/convene", title: "Convene odds" },
  { path: "/privacy", title: "Privacy Policy" },
  { path: "/legal", title: "Legal" },
  { path: "/settings", title: "Settings" },
  { path: "/inventory", title: "Echo inventory" },
  { path: "/teams", title: "Team rotations" },
];

describe("page titles", () => {
  pages.forEach(({ path, title }) => {
    it(`${path} has its own title`, () => {
      cy.visit(path);
      cy.title().should("eq", `${title}${SUFFIX}`);
    });
  });

  it("puts the site-wide title back on the calculator", () => {
    cy.visit("/updates");
    cy.title().should("eq", `Updates${SUFFIX}`);
    cy.window().then((win) => {
      win.history.pushState({}, "", "/");
      win.dispatchEvent(new PopStateEvent("popstate"));
    });
    cy.location("pathname").should("eq", "/");
    cy.title().should("eq", BASE_TITLE);
  });

  it("sends the old /optimizer link to the calculator", () => {
    cy.visit("/optimizer");
    cy.location("pathname").should("eq", "/");
  });
});
