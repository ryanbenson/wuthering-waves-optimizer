/**
 * DaisyUI's focus-driven `.dropdown` opens when its trigger takes focus and
 * closes on click-away, but clicking the trigger again leaves it open (the
 * trigger keeps focus). Bind this to the dropdown root's `mousedown` so a
 * second click on the trigger closes it. Clicks inside the open content are
 * left alone.
 */
export function closeDropdownOnTriggerReclick(event: MouseEvent) {
  const dropdown = event.currentTarget as HTMLElement | null;
  const target = event.target as HTMLElement | null;
  if (!dropdown || !target || target.closest(".dropdown-content")) return;
  if (!target.closest('[role="button"]') || !dropdown.matches(":focus-within")) return;
  // Stop the trigger from taking focus again, then drop the focus that keeps it open.
  event.preventDefault();
  (document.activeElement as HTMLElement | null)?.blur();
}
