---
status: accepted
date: 2026-10-20
tags: [components, navigation]
supersedes: [0019]
---

# 45. v3 header: labeled two-row navigation, a Scanners page and a measured nav height

## Context

The top bar was one 80px row of icons: Calculator, Inventory, Convene and Teams on the left, the page's own sections (nine calculator screens) in the middle, and theme plus the utility menu on the right. None of the icons had labels. Three things no longer fit:

- **A logo and home spot.** The new logo had nowhere to go, and on a 375px phone the bar already overflowed (Teams slid under the theme button).
- **Informational pages.** Wavescan, the desktop echo scanner, is the most-asked-for feature in two years. It needs a findable page that explains it and sends people to wavescan.app, but it isn't a tool people use inside the app, so it shouldn't look like one.
- **Growth.** The calculator's sections were sharing the global bar, and a Theorycraft section is planned. Each new section made one row longer.

Three directions were mocked up for desktop and phone: a labeled two-row header, a side rail, and a logo launcher. The two-row header was picked as the smallest change for regular users that still leaves room to grow.

## Decision

In the v3 UI only (classic keeps its icon bar, plus the logo and a Scanners link in its utility menu):

1. **Row one** (`navigation/NavV3Header.vue`): the logo (with the "Wuthering Tools" wordmark from `xl`), the main sections as labeled tabs (`MAIN_SECTIONS` in `navigation/navSections.ts`), a quiet **Wavescan · Desktop app** link to `/scanners`, the theme menu and the utility menu (`navigation/NavUtilityMenu.vue`, now shared by both UIs). The logo replaces v3's tuning icon as the home link. Clicking it on the calculator returns to the Character screen.
2. **Row two** (`navigation/NavSectionTabs.vue`, desktop from `lg`): the page's own sections. A page opts in by passing `sections` (a `NavSections` object) to `<Nav>` and handling `select-section`. The calculator groups its sections into Build, Analyze and Share. Group labels show from `xl`, and tab icons too, so the row fits at 1024px.
3. **Phones** (below `lg`): row one shows the logo and the current page's name, which opens a section switcher with every main section, then Wavescan, Info, Updates and Settings. The page's sections move to a fixed bottom bar (`navigation/NavBottomBar.vue`). The calculator shows Character, Echoes, Optimizer and Rotations, and the rest sit behind **All**. When the active section is one of those, the All slot shows it instead.
4. **A Scanners page** at `/scanners` (`pages/ScannersView.vue`) explains Wavescan, links to wavescan.app in a new tab, and links back to `/settings?section=wavescan`, which opens Settings on its Wavescan section in both UIs.
5. **Measured nav height.** The bar's height now varies (60px, 108px with row two, 80px in classic). `Nav.vue` measures it into `--nav-h` on `<html>`, and the bottom bar into `--nav-bottom-h`, both via `composables/useHeightCssVar.ts`. Every layout offset that hard-coded 80px reads these instead: `AppLayout.vue`, `Calculator.vue`, `CalculatorCommandBar.vue`, `CalculatorEchoEditPanel.vue`, `TeamRotationSummaryHeader.vue` and `ToastLayer.vue`.

Existing `data-test-*` selectors are kept on the new controls (`data-test-nav-calculator`, `data-test-calculator-nav="…"`, `data-test-calculator-mobile-nav="…"`, `data-test-inventory-nav="…"`, `data-test-options-menu`), so existing specs keep working.

## Consequences

- Every tool and section has a label. Adding a section is one entry in `navSections.ts`, and adding a main section is one entry in `MAIN_SECTIONS`. Row one fits about two more tabs at 1024px before it needs the side-rail direction.
- Wavescan has a permanent but quiet entry in row one, the phone switcher and both utility menus, plus its own page.
- Phones lose the hamburger list but gain one-tap access to the four most-used calculator sections.
- Pages that don't pass `sections` get a single 60px row, so the header height differs by page. Anything positioned against the nav must use `--nav-h`, never 80px.
- The classic UI keeps its own bar and slots (`CalculatorSubNav.vue`, `CalculatorMobileSubNav.vue` and the inventory pair). They can go when classic is retired.

## Guidance

- New page sections: add a `NavSections` entry in `navSections.ts` and pass it to `<Nav>` only when `isV3UiEnabled()`. Don't add icons to row one for page sections.
- Use `NavIcon.vue` for icons in the header. Its `.nav-icon` class opts out of `style.css`'s light-theme rule that fills every nav and dropdown `svg path` black.
- Offsets below the fixed nav: `top: var(--nav-h)`, `top-[var(--nav-h)]`, or `calc(100vh - var(--nav-h) - var(--nav-bottom-h))`.
- Keep Wavescan quiet: a link, not a primary button, in the header.

## Related

- `src/components/navigation/` — `Nav.vue`, `NavV3Header.vue`, `NavSectionTabs.vue`, `NavBottomBar.vue`, `NavUtilityMenu.vue`, `NavIcon.vue`, `navSections.ts`
- `src/pages/ScannersView.vue`, `src/composables/useHeightCssVar.ts`
- `cypress/e2e/navV3Header.cy.ts`, `cypress/e2e/navLogo.cy.ts`
- ADR [0019](./0019-command-bar-merged-live-result-bar-and-identity.md) — the v3 tuning icon this replaces
- ADR [0021](./0021-utility-nav-dropdown-redesign.md) — the utility menu, which now also lists Scanners
- [wavescan-import.md](../wavescan-import.md) — what happens to the file people bring back
