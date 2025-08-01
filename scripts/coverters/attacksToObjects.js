function parseAttackData(rawData) {
  const levels = {};
  let currentLevel = null;

  // Split lines and trim
  const lines = rawData
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect "Level X:"
    const levelMatch = line.match(/^Level\s+(\d+):$/);
    if (levelMatch) {
      currentLevel = parseInt(levelMatch[1], 10);
      levels[currentLevel] = {};
      continue;
    }

    // Next line should be the value
    const attackName = line;
    const attackValue = lines[++i]; // The next line
    levels[currentLevel][attackName] = attackValue;
  }

  // Collect all unique attack names
  const allAttackNames = Object.values(levels).reduce((acc, levelData) => {
    Object.keys(levelData).forEach((name) => acc.add(name));
    return acc;
  }, new Set());

  // Convert to desired array
  const result = Array.from(allAttackNames).map((name) => {
    const key = name.replace(/[^a-zA-Z0-9]/g, ""); // remove spaces and special chars
    const talents = {};
    for (let lvl = 1; lvl <= 10; lvl++) {
      talents[lvl] = levels[lvl][name];
    }
    return {
      key,
      label: name,
      talents,
      type: "Basic",
    };
  });

  return result;
}

// Example usage
const rawData = `
Level 1:
Stage 1 DMG
26.88%*2
Stage 2 DMG
48.00%
Stage 3 DMG
16.44%*6
Heavy Attack DMG
40.16%*2
Scarlet Coda DMG
16.61%*2+6.23%*8+249.03%
DMG Multiplier Increase per Aftersound
41.53%
Mid-air Attack DMG
64.00%
Dodge Counter DMG
61.36%

Level 2:
Stage 1 DMG
29.09%*2
Stage 2 DMG
51.94%
Stage 3 DMG
17.79%*6
Heavy Attack DMG
43.46%*2
Scarlet Coda DMG
17.97%*2+6.74%*8+269.46%
DMG Multiplier Increase per Aftersound
44.9%
Mid-air Attack DMG
69.25%
Dodge Counter DMG
66.40%

// ... include rest of data
`;

const result = parseAttackData(rawData);
console.log(JSON.stringify(result, null, 2));
