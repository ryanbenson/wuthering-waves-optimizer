<template>
    <h2>Rotations</h2>
    <div class="actions">
        <button>Create Rotation</button>
        <button>Import Rotation</button>
    </div>
    <div class="rotations__list">
        <div v-for="rotation in rotations" class="rotation" :key="rotation.id">
            <span class="rotation__name">
                <span>{{ rotation.name }}</span>
            </span>
            <div class="rotation__end">
                <div class="rotation__actions-count">{{ rotation.actions.length }} Actions</div>
                <div class="rotation__expand">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        character: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            rotations: [
                {
                    id: 'abc123',
                    name: 'Changli s2 solo',
                    description: 'Just having some fun',
                    actions: [
                        {
                            order: 0,
                            key: 'TrueSightCaptureDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 1,
                            key: 'TrueSightConquestDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 2,
                            key: 'FlamingVowDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 3,
                            key: 'BasicAttack1DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 4,
                            key: 'BasicAttack2DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 5,
                            key: 'BasicAttack3DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 6,
                            key: 'BasicAttack4DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 7,
                            key: 'TrueSightConquestDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 8,
                            key: 'FlamingVowDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 9,
                            key: 'RadianceofFealty',
                            count: 1,
                            buffs: []
                        },
                        {
                            order: 10,
                            key: 'FlamingVowDMG',
                            count: 1,
                            buffs: []
                        }
                    ]
                },
                {
                    id: 'abc123',
                    name: 'Changli Verina Taoqi',
                    description: 'Big number team, even if energy can be annoying',
                    actions: [
                        {
                            order: 0,
                            key: 'TrueSightCaptureDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 1,
                            key: 'TrueSightConquestDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 2,
                            key: 'FlamingVowDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 3,
                            key: 'BasicAttack1DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 4,
                            key: 'BasicAttack2DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 5,
                            key: 'BasicAttack3DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 6,
                            key: 'BasicAttack4DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 7,
                            key: 'TrueSightConquestDMG',
                            count: 2,
                            buffs: []
                        },
                    ]
                },
                {
                    id: 'abc123',
                    name: 'Changli s2 Verina Encore',
                    description: 'Just having some fun with duo fusion!',
                    actions: [
                        {
                            order: 0,
                            key: 'TrueSightCaptureDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 1,
                            key: 'TrueSightConquestDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 2,
                            key: 'FlamingVowDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 3,
                            key: 'BasicAttack1DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 4,
                            key: 'BasicAttack2DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 5,
                            key: 'BasicAttack3DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 6,
                            key: 'BasicAttack4DMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 7,
                            key: 'TrueSightConquestDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 8,
                            key: 'FlamingVowDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 9,
                            key: 'RadianceofFealty',
                            count: 1,
                            buffs: []
                        },
                        {
                            order: 10,
                            key: 'FlamingVowDMG',
                            count: 1,
                            buffs: []
                        },
                        {
                            order: 0,
                            key: 'TrueSightCaptureDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 1,
                            key: 'TrueSightConquestDMG',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 2,
                            key: 'FlamingVowDMG',
                            count: 2,
                            buffs: []
                        },
                    ]
                }
            ]
        }
    }
}
</script>


<style scoped lang="scss">
h2 {
    margin-top: 0;
}
.actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    button {
        background: #076b89;
        border: none;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }
}

.rotations__list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.rotation {
    display: flex;
    justify-content: space-between;
    background: #415171;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;

    .rotation__name {
        display: flex;
        gap: 0.5rem;
    }

    .rotation__info {
        border: none;
        background-color: #121212;
        border-radius: 4rem;
        
        svg {
            width: 1rem;
            height: 1rem;
        }
    }
}
.rotation__end {
    display: flex;
    align-items: center;
    gap: 1rem;

    svg {
        width: 1rem;
        height: 1rem;
        filter: invert(100%);
    }
}
</style>