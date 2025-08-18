<template>
    <div class="optimizer-filters">
        <div class="optimizer-filters__sets">
            <h3>Choose echo sets</h3>
            <div class="optimizer-filters__sets--two flex gap-2">
                <button
                    v-for="set in echoSets"
                    :key="set"
                    @click="toggleSetFilter(set)"
                    class="size-8 rounded p-[.15rem]"
                    :class="{'btn-active': isSetFilterActive(set)}"
                >
                    <img :src="getSetIcon(set)" :alt="set" />
                </button>
            </div>
        </div>
    </div>
    <div class="mt-4">Processed {{ processedCombos }} of {{  totalCombos }}</div>
    <progress class="progress progress-primary w-56" :value="processedCombos" :max="totalCombos"></progress>
    <div>
        <button class="btn btn-primary" @click="handleOptimize">Optimize</button>
    </div>
    <pre>{{ optimizerResults }}</pre>
    <pre>{{ setFilters }}</pre>
</template>

<script>
import { echoSetLabelMap, getEchoSetIconByType } from "../echoes/stats";
export default {
    name: "CalculatorOptimizer",
    props: {
        character: {
            type: String,
            required: true,
        },
        totalCombos: {
            type: Number
        },
        processedCombos: {
            type: Number
        },
        optimizerResults: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            echoSetLabelMap,
            // filters
            setFilters: [],
        }
    },
    methods: {
        echoSetLabelMap,
        getEchoSetIconByType,
        handleOptimize() {
            this.$emit('optimizer:optimize', this.setFilters)
        },
        toggleSetFilter(set) {
            const index = this.setFilters.findIndex((setFilter) => { return setFilter === set});
            if (index >= 0) {
                // remove the set from the filter list
                this.setFilters.splice(index, 1);
            } else {
                this.setFilters.push(set);
            }
        },
        isSetFilterActive(set) {
            return this.setFilters.find((setFilter) => { return setFilter === set});
        },
        getSetIcon(set) {
            return this.getEchoSetIconByType(set);
        },
    },
    computed: {
        echoSets() {
            return Object.keys(this.echoSetLabelMap);
        }
    }
}
</script>