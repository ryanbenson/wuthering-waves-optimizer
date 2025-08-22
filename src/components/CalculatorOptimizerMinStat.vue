<template>
<div class="flex gap-2">
    <select v-model="inputStat" class="select w-full max-w-xs">
        <option disabled selected>Pick your stat</option>
        <option v-for="stat in availableStats" :value="stat.stat" :disabled="stat.disabled">{{ stat.label }}</option>
    </select>
    <input type="text" v-model.trim="inputMinValue" placeholder="Minimum stat value desired" class="input w-full max-w-xs" />
    <button @click="handleRemove" class="btn btn-xs">X</button>
</div>
</template>

<script>
export default {
    name: "CalculatorOptimizerMinStats",
    props: {
        character: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        stat: {
            type: String,
            default: null,
        },
        minValue: {
            type: Number,
            default: null,
        },
        allStats: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            inputStat: null,
            inputMinValue: null,
        };
    },
    watch: {
        inputStat: function() {
            this.updatedData();
        },
        inputMinValue: function() {
            this.updatedData();
        }
    },
    methods: {
        updatedData() {
            this.$emit('updated-min-stat', { id: this.id, stat: this.inputStat, minValue: this.inputMinValue });
        },
        handleRemove() {
            this.$emit('remove-min-stat', { id: this.id });
        }
    },
    computed: {
        statsToChooseFrom() {
            return {
                totalAtk: "ATK",
                totalHp: "HP",
                totalDef: "DEF",
                totalCritRate: "Crit Rate",
                totalCritDMG: "Crit DMG",
                energyRegen: "Energy Regen",
                basicAttackDMGBonus: "Basic Attack DMG Bonus",
                heavyAttackDMGBonus: "Heavy Attack DMG Bonus",
                resonanceSkillDMGBonus: "Resonance Skill DMG Bonus",
                resonanceLiberationDMGBonus: "Resonance Liberation DMG Bonus",
            };
        },
        availableStats() {
            const statsOptionsList = [];
            Object.entries(this.statsToChooseFrom).forEach((statOption) => {
                const [stat, label] = statOption;
                const found = this.allStats.find((usedStat) => {
                    return usedStat.stat === stat;
                });
                statsOptionsList.push({ stat, label, disabled: found });
            });
            return statsOptionsList;
        }
    },
    mounted() {
        this.inputStat = this.stat;
        this.inputMinValue = this.minValue;
    }
}
</script>