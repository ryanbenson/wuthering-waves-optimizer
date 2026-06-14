export function formatReviewChecklist(notices: string[]): string {
  if (notices.length === 0) {
    return "";
  }

  const header = `Manual review needed (${notices.length} item${notices.length === 1 ? "" : "s"}):`;
  const items = notices.map(
    (notice, index) => `  [ ] ${index + 1}. ${notice}`,
  );

  return [header, "", ...items].join("\n");
}

export function printReviewChecklist(notices: string[]): void {
  const checklist = formatReviewChecklist(notices);
  if (checklist) {
    console.log(`\n${checklist}`);
  }
}
