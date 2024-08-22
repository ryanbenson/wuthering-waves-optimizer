<template>
    <div class="rotation__action">
        <div class="rotation__action__info">
            <div class="name">
                <div class="order">#{{ order }}</div>
                <div class="count">x{{ count }}</div>
                <span>{{ attackLabel }}</span>
            </div>
            <div class="rotation__action__end">
                <div class="type">{{ type }}</div>
                <div class="buffsCount">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z" fill="#FFF"/>
                    </svg>
                    <span>{{ buffsCount }}</span>
                </div>
                <div class="actions">
                    <button class="action--remove">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM152 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z" fill="#FFF"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        characterData: {
            type: Object,
            default() {
                return {};
            }
        },
        actionKey: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
        buffs: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data() {
        return {
            countData: 0,
            skillKeyMap: {
                basic: 'basicAttacks',
                skill: 'skillAttacks',
                forteCircuit: 'forteCircuitAttacks',
                liberation: 'liberationAttacks',
                intro: 'introAttacks',
                outro: 'outroAttacks'
            }
        }
    },
    computed: {
        skillType() {
            return this.skillKeyMap[this.type] ?? null;
        },
        skillAttacks() {
            return this.characterData?.[this.skillType]?.attacks ?? [];
        },
        attackData() {
            return this.skillAttacks.find((attack) => {
                return attack.key === this.actionKey;
            });
        },
        attackLabel() {
            return this.attackData?.label ?? null;
        },
        buffsCount() {
            return this.buffs.length;
        }
    },
    mounted() {
        this.countData = this.count;
        console.log(this.characterData?.basicAttacks);
    }
}
</script>

<style scoped lang="scss">
.rotation__action {
    background: rgba(0, 0, 0, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
}
.name {
    span {
        font-weight: bold;
    }
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.type {
    text-transform: capitalize;
    padding: 0.25rem 0.75rem;
    background: #303173;
    border-radius: 2rem;
}
.rotation__action__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.rotation__action__end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.order,
.count {
    background: rgba(0, 0, 0, 0.25);
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
}
.buffsCount {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: rgba(0, 0, 0, 0.25);
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;

    svg {
        width: 1rem;
        height: 1rem;
    }
}
.action--remove {
    background: transparent;
    border: none;
    padding: 0;

    svg {
        width: 1rem;
        height: 1rem;
    }
}
</style>