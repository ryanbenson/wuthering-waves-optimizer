---
status: accepted
date: 2026-08-05
tags: [product, content, legal-ish]
---

# 9. Ship only officially released content

## Context

Datamines and leaks appear before Kuro Games ships content. Shipping unreleased characters, weapons, echoes, or sets in production creates accuracy risk (numbers change), user confusion, and unwanted association with leak sources. The project also avoids advertising third-party datamine sites in the product UI.

## Decision

**Production builds expose only content Kuro has officially released** (in-game or official news/site). Contributors may prepare data ahead of time from leaks, but that content must be **completely unreachable** in the app until release (not selectable, not linked, not behind a trivial client-side toggle that still ships the data for everyone).

User-facing copy must **not** link to or name datamine sites (for example encore.moe). Internal scripts/CLI may still fetch from APIs for authoring.

## Consequences

- Pros: Aligns with fair play / official sources; reduces wrong-number incidents from placeholder data; clearer release discipline.
- Cons: Launch-day content pushes are crunchy; feature flags must actually exclude data, not only hide UI chrome.

## Guidance

- **Do** gate unreleased modules so they cannot be imported into the production character/weapon/echo registries.
- **Do** remove temporary gates in the same release that officially ships the content.
- **Don’t** leave leaked entries in `getCharactersAvailable()` / weapon lists “disabled” but still loadable via deep links or leftover keys if that exposes them in prod.
- **Don’t** add user-visible credits or links to datamine websites.

## Related

- README “Content Guidelines”
- ADR [0008](./0008-per-character-modules.md)
