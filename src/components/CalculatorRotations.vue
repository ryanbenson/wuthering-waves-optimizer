<template>
    <h2>Rotations</h2>
    <div class="actions">
        <button>Create Rotation</button>
        <button>Import Rotation</button>
    </div>
    <div class="rotations__list">
        <div class="rotation">
            <span class="rotation__name">Changli S2 Solo
                <VDropdown :triggers="['hover', 'click', 'touch']">
                    <!-- This will be the popover target (for the events and position) -->
                    <button>(?)</button>
                    <!-- This will be the content of the popover -->
                    <template #popper>
                        <span>Mostly spamming stuff</span>
                    </template>
                </VDropdown>
            </span>
            <div class="rotation__actions-count">12 actions</div>
        </div>
        <div class="rotation">
            <span class="rotation__name" v-tooltip="'Verina > Taoqi > Changli'">Changli S2 Verina Taoqi (?)</span>
            <div class="rotation__actions-count">14 actions</div>
        </div>
        <div class="rotation">
            <span class="rotation__name" v-tooltip="'Verina > Changli > Encore'">Changli S2 Verina Encore (?)</span>
            <div class="rotation__actions-count">10 actions</div>
        </div>
    </div>
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


<style scoped lang="scss">
$sidebar-background-color: #121212;
$active-sidebar-link-color: #22252e;
$hover-sidebar-link-color: $active-sidebar-link-color;
$active-link-color: #98d7ec;
$tooltip-background-color: $sidebar-background-color;
</style>