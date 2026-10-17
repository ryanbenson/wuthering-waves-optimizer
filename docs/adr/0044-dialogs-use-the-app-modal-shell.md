---
status: accepted
date: 2026-10-18
tags: [components, ui]
supersedes: [26, 27]
---

# 44. Dialogs with a close button use the `AppModal` shell

## Context

The five choosers ([ADR 0026](./0026-chooser-modals-redesign.md)) share `AppChooserModal.vue`: one header row with the title on the left and the ✕ on the right, and a body that scrolls under it. The other dialogs (guides, editors, echo pickers, the scanner, the screenshot importer, What's new, and the classic UI's choosers) each built their own: a ✕ placed `absolute right-2 top-2` in the box's corner and, when there was one, a title further down in the body. The ✕ didn't line up with the title, and because `.modal-box` itself scrolled, the ✕ scrolled away on long dialogs (issue #632).

## Decision

- Every dialog that can be closed is an `<AppModal>`: title, optional `header-actions`, ✕, in one row that stays put while the body scrolls. Actions that sat next to a dialog's title (Reset to Default, the scanner's How to scan and its guide's Got it) go in `header-actions`.
- Three props cover what plain dialogs did differently. Their defaults are what the choosers already did, so the choosers don't change:
  - `lazy`: `false` keeps the body mounted while closed, for dialogs whose parent reaches into it before opening or that keep state between opens.
  - `closeOnBackdrop`: `false` for dialogs that only closed from the ✕ or Esc.
  - `sheet`: `false` keeps a small form a centred card on phones instead of a full-screen sheet.
- Attributes pass through to the `<dialog>`, so the `id`s and `data-test-*` that tests rely on keep working.
- Dialogs without a title got one, reusing the v3 choosers' wording where they match ("Choose character", "Browse weapons", "Choose enemy").
- Dialogs that closed from a Close/Cancel button at the bottom (the rotation and team import dialogs, Rotation presets) get the ✕ instead; the button's `data-test-*` moves to the ✕. The scanner's capture preview, which had no close button, gets one too.
- Left as it is: `ConfirmDialog.vue`, a question with its own answer buttons, where a ✕ would be a third answer.
- `AppChooserModal.vue` is renamed `AppModal.vue`, and its classes `app-chooser-modal*` become `app-modal*`: it is no longer only for choosers.

## Consequences

- Pros: one header and one close/scroll behaviour for every dialog; the ✕ no longer scrolls away; a new dialog gets both by using the shell.
- Cons: dialogs are teleported to `<body>`, so tests and styles can't reach them through their parent element. Body padding is the shell's 1rem instead of the box's 1.5rem. The classic UI's dialogs get the header too.

## Guidance

- **Do** build new dialogs that have a ✕ on `AppModal`. **Don't** hand-roll `<dialog class="modal">` with an absolute ✕.
- **Do** open and close through the ref's `triggerOpenModal()`/`triggerCloseModal()`. `close` is emitted only when the user closes the dialog (✕, backdrop, Esc, a `method="dialog"` form); cleanup that must also follow a programmatic close belongs in the function that closes it.
- **Don't** scope Cypress queries to a dialog through its page; use the dialog's own `data-test-*`.

## Related

- `src/components/AppModal.vue`, `tests/components/AppModal.test.ts`
- `cypress/e2e/dialogHeader.cy.ts`
- [ADR 0026](./0026-chooser-modals-redesign.md); issue #632
