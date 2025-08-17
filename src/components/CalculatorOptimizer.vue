<template>
    <div>Processed {{ processedCombos }} of {{  totalCombos }}</div>
    <progress class="progress progress-primary w-56" :value="processedCombos" :max="totalCombos"></progress>
    <div>
        <button class="btn btn-primary" @click="handleOptimize">Optimize</button>
    </div>
    <pre>{{ optimizerResults }}</pre>
</template>

<script>
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
    methods: {
        handleOptimize() {
            this.$emit('optimizer:optimize')
        },
    }
}
</script>