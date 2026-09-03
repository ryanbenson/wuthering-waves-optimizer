---
status: accepted
date: 2026-09-03
tags: [components, content]
---

# 25. Privacy & Legal formatting consistency (Labs-flagged, shares the `liveResultBar` flag)

## Context

Privacy and Legal were explicitly out of scope for the rest of this
redesign wave (ADRs [0021](./0021-utility-nav-dropdown-redesign.md)–[0024](./0024-info-page-nested-routes-redesign.md))
— a possible tab-merge between the two was raised in design review and
never decided, so both were left untouched. Separately, `PrivacyView.vue`
had a plain rendering bug unrelated to the redesign: its `.page-privacy`
class carried `padding: 2rem 3rem` with no `max-width`, while
`LegalView.vue`'s equivalent `.page-info` class had both — so Privacy
rendered noticeably wider/differently formatted than every other content
page even before any v3.0 work touched it. Design feedback flagged both
issues together ("the privacy and legal pages look different in text
formatting than the other pages").

The tab-merge question is still undecided and out of scope here — this
ADR is only about matching visual formatting, not changing information
architecture.

## Decision

1. **The `max-width`/padding bug is fixed unconditionally, not
   flag-gated.** `PrivacyView.vue`'s legacy branch now uses the same
   `.page-info`-shaped container (padding, 640px max-width, responsive
   margin) `LegalView.vue` already had. This is a plain layout bug fix
   that benefits every visitor regardless of the flag, not a redesign
   decision.

2. **Both pages gain a v3.0 branch behind the existing `liveResultBar`
   flag**, matching the header/card vocabulary used everywhere else in
   this wave (`bg-base-200 rounded-xl p-4`, `text-[.65rem] font-bold
   uppercase tracking-wider opacity-50` section eyebrows). Each stays at
   its own route (`/privacy`, `/legal`) — not merged into one page with
   tabs, since that IA question was never actually decided and this pass
   is scoped to formatting only.

## Consequences

- Pros: closes a real, pre-existing visual inconsistency (the `max-width`
  bug) for every visitor, and gives both pages the same polish as the rest
  of the v3.0 wave for flag-on visitors.
- Cons: the tab-merge question from the original design review is still
  open — if it's decided later, both files change again.

## Related

- `src/pages/PrivacyView.vue`, `LegalView.vue`
- ADRs [0013](./0013-live-result-bar-labs-flag.md)–[0024](./0024-info-page-nested-routes-redesign.md)
  — the shared-flag pattern this follows
