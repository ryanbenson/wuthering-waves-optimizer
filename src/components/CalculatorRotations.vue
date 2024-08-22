<template>
    <h2>Rotations</h2>
    <div class="actions">
        <button>Create Rotation</button>
        <button>Import Rotation</button>
    </div>
    <div class="rotations__list">
        <CalculatorRotation
            v-for="rotation in rotations"
            :key="rotation.id"
            :character-data="characterData"
            :id="rotation.id"
            :name="rotation.name"
            :description="rotation.description"
            :actions="rotation.actions"
        >  
        </CalculatorRotation>
    </div>
</template>

<script>
import { getCharByName } from '../characters/characters.ts';
import CalculatorRotation from './CalculatorRotation.vue';
export default {
    props: {
        character: {
            type: String,
            required: true,
        },
        characterData: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    components: {
        CalculatorRotation
    },
    data() {
        return {
            rotations: [
                {
                    id: 'abc123',
                    name: 'Changli s2 solo',
                    description: 'This is Changli s2 rotation when she is solo. It requires more Basic Attacks due to not being able to leverage her outros and intros, so building forte circuit attacks require more work.',
                    actions: [
                        {
                            order: 1,
                            key: 'TrueSightCaptureDMG',
                            type: 'skill',
                            count: 2,
                            buffs: [
                                {
                                    modifier: 'ATK',
                                    modifierValue: 0.2
                                },
                                {
                                    modifier: 'CritRate',
                                    modifierValue: 0.2
                                }
                            ]
                        },
                        {
                            order: 2,
                            key: 'TrueSightConquestDMG',
                            type: 'skill',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 3,
                            key: 'FlamingVowDMG',
                            type: 'forteCircuit',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 4,
                            key: 'BasicAttack1DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 5,
                            key: 'BasicAttack2DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 6,
                            key: 'BasicAttack3DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 7,
                            key: 'BasicAttack4DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 8,
                            key: 'TrueSightConquestDMG',
                            type: 'skill',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 9,
                            key: 'FlamingVowDMG',
                            type: 'forteCircuit',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 10,
                            key: 'RadianceofFealty',
                            type: 'liberation',
                            count: 1,
                            buffs: []
                        },
                        {
                            order: 11,
                            key: 'FlamingVowDMG',
                            type: 'forteCircuit',
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
                            type: 'skill',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 1,
                            key: 'TrueSightConquestDMG',
                            type: 'skill',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 2,
                            key: 'FlamingVowDMG',
                            type: 'forteCircuit',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 3,
                            key: 'BasicAttack1DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 4,
                            key: 'BasicAttack2DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 5,
                            key: 'BasicAttack3DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 6,
                            key: 'BasicAttack4DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 7,
                            key: 'TrueSightConquestDMG',
                            type: 'skill',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 8,
                            key: 'FlamingVowDMG',
                            type: 'forteCircuit',
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
                            type: 'skill',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 1,
                            key: 'TrueSightConquestDMG',
                            type: 'skill',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 2,
                            key: 'FlamingVowDMG',
                            type: 'forteCircuit',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 3,
                            key: 'BasicAttack1DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 4,
                            key: 'BasicAttack2DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 5,
                            key: 'BasicAttack3DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                        {
                            order: 6,
                            key: 'BasicAttack4DMG',
                            type: 'basic',
                            count: 2,
                            buffs: []
                        },
                    ]
                }
            ]
        }
    },
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
</style>