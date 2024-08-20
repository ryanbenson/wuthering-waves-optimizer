<template>
    <h2>Rotations</h2>
    <button>Add new rotation</button>
    <div>Current rotations</div>
</template>

<script>
export default {
    props: {
        character: {
            type: String,
            required: true,
        }
    }
}
</script>