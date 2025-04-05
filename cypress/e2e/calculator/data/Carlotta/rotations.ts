export const carlottaRotationTest001Damages: AttackTests = [
  {
    selector: `[data-test-damages-list-rotation="Test001"] .basic-attack-stage-1-dmg`,
    values: ["Basic Attack Stage 1 DMG", "5750", "5893", "8624"],
  },
  {
    selector: `[data-test-damages-list-rotation="Test001"] .fatal-finale-dmg`,
    values: ["Fatal Finale DMG", "1344", "1713", "2015"],
  },
  {
    selector: `[data-test-damages-list-rotation="Test001"] .rotation-total-damage`,
    values: ["Total Damage", "7093", "7606", "10639"],
  },
];

export const carlottaRotationStats: StatTests = [
  { selector: ".stat-atk", value: "462" },
  { selector: ".stat-hp", value: "12,450" },
  { selector: ".stat-def", value: "1,197" },
  { selector: ".stat-cr", value: "5.0%" },
  { selector: ".stat-cd", value: "150.0%" },
  { selector: ".stat-er", value: "100.0%" },
  { selector: ".stat-basic", value: "0.0%" },
  { selector: ".stat-heavy", value: "0.0%" },
  { selector: ".stat-skill", value: "0.0%" },
  { selector: ".stat-liberation", value: "0.0%" },
  { selector: ".stat-glacio", value: "0.0%" },
  { selector: ".stat-fusion", value: "0.0%" },
  { selector: ".stat-electro", value: "0.0%" },
  { selector: ".stat-aero", value: "0.0%" },
  { selector: ".stat-spectro", value: "0.0%" },
  { selector: ".stat-havoc", value: "0.0%" },
  { selector: ".stat-healing", value: "0.0%" },
];
