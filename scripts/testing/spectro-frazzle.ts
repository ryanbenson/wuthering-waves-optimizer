const levelScalingFactors: Record<string, number> = {
    '60': 52,
    '90': 498,
};
const stackScalingFactors: Record<string, number> = {
    '1': 1,
    '2': 1.81,
    '3': 2.624,
    '4': 3.432999,
    '5': 1.81 + 1.45 + 1.31 + 1.24,
    '6': 1.81 + 1.45 + 1.31 + 1.24 + 1.19,
    '7': 1.81 + 1.45 + 1.31 + 1.24 + 1.19 + 1.29,
    '8': 1.81 + 1.45 + 1.31 + 1.24 + 1.19 + 1.29 + 1.14,
    '9': 1.81 + 1.45 + 1.31 + 1.24 + 1.19 + 1.29 + 1.14 + 1.12,
    '10': 1.81 + 1.45 + 1.31 + 1.24 + 1.19 + 1.29 + 1.14 + 1.12 + 1.11
};
// TODO Support enemy level
function calculateDamage(charLevel: number, enemyLevel: number, stacks:number): number {
    return levelScalingFactors[charLevel.toString()] * stackScalingFactors[stacks.toString()];
}

// Test cases
const testCases = [
    { charLevel: 60, enemyLevel: 90, stacks: 1, expectedDamage: 52 },
    { charLevel: 60, enemyLevel: 90, stacks: 2, expectedDamage: 94 },
    { charLevel: 60, enemyLevel: 90, stacks: 3, expectedDamage: 136 },
    { charLevel: 60, enemyLevel: 90, stacks: 4, expectedDamage: 177 },
    { charLevel: 90, enemyLevel: 90, stacks: 1, expectedDamage: 498 },
    { charLevel: 90, enemyLevel: 90, stacks: 2, expectedDamage: 902 },
    { charLevel: 90, enemyLevel: 90, stacks: 3, expectedDamage: 1306 },
    { charLevel: 90, enemyLevel: 90, stacks: 4, expectedDamage: 1711 },
];

// Run test cases
testCases.forEach(({ charLevel, enemyLevel, stacks, expectedDamage }) => {
    const calculatedDamage = calculateDamage(charLevel, enemyLevel, stacks);
    console.log(
        `Char Level: ${charLevel}, Enemy Level: ${enemyLevel}, Stacks: ${stacks}, Calculated: ${calculatedDamage.toFixed(2)}, Expected: ${expectedDamage}`
    );
});
