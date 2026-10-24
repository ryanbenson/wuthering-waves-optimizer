---
status: accepted
date: 2026-10-20
tags: [components, navigation]
supersedes: [22, 24]
---

# 45. v3 navigation: a side rail, a section row, a phone bottom bar and a Scanners page

## Context

The top bar was one 80px row of icons: Calculator, Inventory, Convene and Teams on the left, the page's own sections (nine calculator screens) in the middle, and theme plus the utility menu on the right. None of the icons had labels. Three things no longer fit:

- **A logo and home spot.** The new logo had nowhere to go, and on a 375px phone the bar already overflowed (Teams slid under the theme button).
- **Informational pages.** Wavescan, the desktop echo scanner, is the most-asked-for feature in two years. It needs a findable page that explains it and sends people to wavescan.app, but it isn't a tool people use inside the app, so it shouldn't look like one.
- **Growth.** The calculator's sections were sharing the global bar, and a Theorycraft section is planned. Each new section made one row longer.
- **Two kinds of section nav.** Settings and Info had their own sidebar (`WorkspaceSideNav.vue`) inside the page, so with a rail they would have had two side navs next to each other.

Three directions were mocked up for desktop and phone: a labeled two-row header, a side rail, and a logo launcher. The two-row header was built first, but in use the calculator then stacked three bars at the top (main sections, page sections and the pinned Command Bar). The side rail moves the main sections out of that stack, so the top keeps only the page's sections and the Command Bar.

The icons stay the ones the old nav used (the game art from the assets repo, the v3 tuning icon for Calculator), now with labels.

## Decision

In the v3 UI only (classic keeps its icon bar, plus the logo and a Scanners link in its utility menu):

1. **Desktop side rail** (`navigation/NavRail.vue`, from `lg`): the logo (home) with the "Wuthering Tools" name under it in Red Hat Display (`public/fonts/red-hat-display-regular.woff2`), wrapping to two lines, the main sections with labels (`MAIN_SECTIONS` in `navigation/navSections.ts`), then at the bottom a **Scanners** link, the theme menu and the utility menu (`navigation/NavUtilityMenu.vue`, shared by both UIs). Both menus open beside the rail. Clicking the logo on the calculator returns to the Character screen.
2. **Desktop section row** (`navigation/NavSectionTabs.vue`): the page's own sections, right of the rail. A page opts in by passing `sections` (a `NavSections` object) to `<Nav>` and handling `select-section`. Pages without sections have no top bar at all. Pages with up to six sections show labels at every width; with more (the calculator), labels and group dividers show from `xl`, and at `lg` the icons alone fit beside the rail, with the label as a tooltip. The rail is as wide as the row is tall (64px), so the two bars match.
3. **Settings and Info use the section row too**, replacing their in-page sidebar (ADR 0022 and 0024). `SETTINGS_SECTIONS` keeps Settings' groups (General, Your Data, Labs) and its Labs badge, with `SettingsView.vue` holding the open section. `INFO_SECTIONS` is keyed by route path, so Info's tabs push its nested routes. `WorkspaceSideNav.vue` is deleted.
4. **Phones** (below `lg`): a header (`navigation/NavPhoneHeader.vue`) with a hamburger that opens the page's sections, the logo and the current section's name (or the page's, for pages without sections). A fixed bottom bar (`navigation/NavBottomBar.vue`) has the main sections plus **More**, which opens the utility menu upwards (Settings, Appearance, Scanners, Info, Updates, Privacy, Legal, Discord, GitHub). Theme and density are rarely changed, so on phones they sit under More → Appearance rather than in the header; `ThemeOptions.vue` holds those lists for both the desktop theme menu and that panel, and applies the saved theme when it mounts, so it stays mounted (hidden) in the More menu. The bottom bar slides away while the page scrolls down and comes back on any scroll up or near the top (`composables/useScrollCollapse.ts`), so phones get the room back while reading. It moves with a transform, so `--nav-bottom-h` and the page padding don't change, and it stays while focus is in it (the More menu is open). The calculator's Command Bar shrinks at the same time (ADR 0046).
5. **Rendered, not hidden.** `Nav.vue` picks the desktop or phone pieces with a media query (`composables/useMediaQuery.ts`) rather than CSS, so each control and its `data-test-*` attribute is on the page once.
6. **A Scanners page** at `/scanners` (`pages/ScannersView.vue`) explains Wavescan, links to wavescan.app in a new tab, and links back to `/settings?section=wavescan`, which opens Settings on its Wavescan section in both UIs.
7. **Measured nav size.** The top bar's height now varies (0 on desktop pages without sections, 64px with them, 56px on phones, 80px in classic), and the rail takes width. `Nav.vue` measures them into `--nav-h`, `--nav-rail-w` and `--nav-bottom-h` on `<html>` via `composables/useSizeCssVar.ts`. Every layout offset that hard-coded 80px reads these instead: `AppLayout.vue` (which also offsets by the rail), `Calculator.vue`, `CalculatorCommandBar.vue`, `CalculatorEchoEditPanel.vue`, `TeamRotationSummaryHeader.vue` and `ToastLayer.vue`.

Existing `data-test-*` selectors are kept on the new controls (`data-test-nav-calculator`, `data-test-calculator-nav="…"`, `data-test-calculator-mobile-nav="…"`, `data-test-inventory-nav="…"`, `data-test-options-menu`), so existing specs keep working.

## Consequences

- The calculator's top has two bars, not three: its sections and the Command Bar.
- Every main section and page section has a label (page sections from `xl` on desktop). Adding a section is one entry in `navSections.ts`. The rail has room for several more main sections, such as Theorycraft, before it needs to scroll.
- Desktop content is 64px narrower. At 1024px the Command Bar wraps to two lines, as it already did at slightly smaller widths.
- Every page with sections now switches them the same way, on desktop and phones. On phones Settings and Info lose their always-visible tab strip; their sections are behind the hamburger like the calculator's.
- Wavescan has a permanent but quiet entry in the rail and in both utility menus, plus its own page.
- Phones get one-tap access to the main sections; the page's sections are one tap further, behind the switcher.
- Anything positioned against the nav must use the CSS variables, never 80px.
- The classic UI keeps its own bar and slots (`CalculatorSubNav.vue`, `CalculatorMobileSubNav.vue` and the inventory pair). They can go when classic is retired.

## Guidance

- New page sections: add a `NavSections` entry in `navSections.ts` (an item can carry a `badge`) and pass it to `<Nav>` only when `isV3UiEnabled()`. New main sections: add to `MAIN_SECTIONS`; they appear in the rail and the bottom bar.
- Icons go in `NAV_ICONS` as `{ src }` (white-on-transparent game art) or `{ paths }` (an SVG, drawn the same white). Both are inverted in light themes, and inactive items are dimmed with opacity so the two kinds match. Add `scale` when an icon's glyph looks bigger or smaller than the rest. Draw them with `NavIcon.vue`, whose classes opt out of `style.css`'s light-theme rules that fill nav svg paths black.
- The nav's dropdowns (theme, utility menu, phone sections) bind `utils/dropdownToggle.ts` so clicking their button again closes them; DaisyUI's focus-driven dropdown otherwise only closes on click-away.
- Offsets: `top: var(--nav-h)`, `margin-left: var(--nav-rail-w)`, `calc(100vh - var(--nav-h) - var(--nav-bottom-h))`.
- Keep Wavescan quiet: a link, not a primary button, in the nav.

## Related

- `src/components/navigation/` — `Nav.vue`, `NavRail.vue`, `NavSectionTabs.vue`, `NavPhoneHeader.vue`, `NavBottomBar.vue`, `NavUtilityMenu.vue`, `NavIcon.vue`, `navSections.ts`
- `src/pages/ScannersView.vue`, `src/pages/SettingsView.vue`, `src/pages/InfoView.vue`, `src/composables/useSizeCssVar.ts`, `src/composables/useMediaQuery.ts`
- `cypress/e2e/navV3.cy.ts`, `cypress/e2e/navLogo.cy.ts`, `cypress/e2e/settingsWorkspaceFlagged.cy.ts`, `cypress/e2e/infoWorkspaceFlagged.cy.ts`
- ADR [0022](./0022-settings-page-redesign.md) and [0024](./0024-info-page-nested-routes-redesign.md) — Settings' and Info's sidebar, which the section row replaces
- ADR [0019](./0019-command-bar-merged-live-result-bar-and-identity.md) — the Command Bar and the v3 tuning icon, which the rail keeps for Calculator
- ADR [0021](./0021-utility-nav-dropdown-redesign.md) — the utility menu, which now also lists Scanners
- [wavescan-import.md](../wavescan-import.md) — what happens to the file people bring back
