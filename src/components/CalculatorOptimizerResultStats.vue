<template>
    <table class="calculator__stats table table-xs table-zebra">
            <tbody>
            <tr class="stat-atk" :class="{'bg-primary text-white': targetType === 'Stat' && targetObject === 'totalAtk'}">
                <td class="w-10">
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
                </td>
                <td>Attack</td>
                <td
                class="text-right"
                v-tooltip="{
                    content: atkTooltipContent,
                    html: true,
                }">
                {{ displayInt(finalStats.totalAtk) }}
                </td>
            </tr>
            <tr class="stat-hp" :class="{'bg-primary text-white': targetType === 'Stat' && targetObject === 'totalHp'}">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
                </td>
                <td>HP</td>
                <td
                class="text-right"
                v-tooltip="{
                    content: hpTooltipContent,
                    html: true,
                }">
                {{ displayInt(finalStats.totalHp) }}
                </td>
            </tr>
            <tr class="stat-def" :class="{'bg-primary text-white': targetType === 'Stat' && targetObject === 'totalDef'}">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
                </td>
                <td>Defense</td>
                <td
                class="text-right"
                v-tooltip="{
                    content: defTooltipContent,
                    html: true,
                }">
                {{ displayInt(finalStats.totalDef) }}
                </td>
            </tr>
            <tr class="stat-cr" :class="{'bg-primary text-white': targetType === 'Stat' && targetObject === 'totalCritRate'}">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />
                </td>
                <td>Crit Rate</td>
                <td class="text-right">{{ displayPercentage(finalStats.totalCritRate * 100) }}</td>
            </tr>
            <tr class="stat-cd" :class="{'bg-primary text-white': targetType === 'Stat' && targetObject === 'totalCritDMG'}">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />
                </td>
                <td>Crit DMG</td>
                <td class="text-right">{{ displayPercentage(finalStats.totalCritDMG * 100) }}</td>
            </tr>
            <tr class="stat-er" :class="{'bg-primary text-white': targetType === 'Stat' && targetObject === 'energyRegen'}">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />
                </td>
                <td>Energy Regen</td>
                <td class="text-right">{{ displayPercentage(finalStats.energyRegen * 100) }}</td>
            </tr>
            <tr class="stat-basic">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />
                </td>
                <td>Basic Attack DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.basicAttackDMGBonus) }}</td>
            </tr>
            <tr class="stat-heavy">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />
                </td>
                <td>Heavy Attack DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.heavyAttackDMGBonus) }}</td>
            </tr>
            <tr class="stat-skill">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />
                </td>
                <td>Resonance Skill DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.resonanceSkillDMGBonus) }}</td>
            </tr>
            <tr class="stat-liberation">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />
                </td>
                <td>Resonance Liberation DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.resonanceLiberationDMGBonus) }}</td>
            </tr>
            <tr class="stat-glacio" v-if="characterElement === 'Glacio'">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
                    class="glacio--active" />
                </td>
                <td>Glacio DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.glacio) }}</td>
            </tr>
            <tr class="stat-fusion" v-if="characterElement === 'Fusion'">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
                    class="fusion--active" />
                </td>
                <td>Fusion DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.fusion) }}</td>
            </tr>
            <tr class="stat-electro" v-if="characterElement === 'Electro'">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
                    class="electro--active" />
                </td>
                <td>Electro DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.electro) }}</td>
            </tr>
            <tr class="stat-aero" v-if="characterElement === 'Aero'">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
                    class="aero--active" />
                </td>
                <td>Aero DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.aero) }}</td>
            </tr>
            <tr class="stat-spectro" v-if="characterElement === 'Spectro'">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
                    class="spectro--active" />
                </td>
                <td>Spectro DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.spectro) }}</td>
            </tr>
            <tr class="stat-havoc" v-if="characterElement === 'Havoc'">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
                    class="havoc--active" />
                </td>
                <td>Havoc DMG Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.havoc) }}</td>
            </tr>
            <tr class="stat-healing">
                <td>
                <img
                    src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />
                </td>
                <td>Healing Bonus</td>
                <td class="text-right">{{ displayPercentage(finalStats.healingBonus * 100) }}</td>
            </tr>
            </tbody>
        </table>
</template>

<script>
import { displayPercentage, displayInt } from "../utils/numbers";
export default {
    name: 'CalculatorOptimizerResultStats',
    props: {
        finalStats: {
            type: Object,
            required: true,
        }
    },
    methods: {
        displayInt,
        displayPercentage,
    },
    computed: {
        hpTooltipContent() {
            return null;
        },
        atkTooltipContent() {
            return null;
        },
        defTooltipContent() {
            return null;
        }
        // TODO: Implement, but need to collect base and weapon info
        // hpTooltipContent() {
        //     console.log(this.context.finalStats)
        //   return `<span class="Highlight">${this.context.finalStats.baseHp}</span> * (1 + <span class="Highlight">${this.context.finalStats.totalHpPercent}%</span>) + <span class="Highlight">${this.context.finalStats.totalHpFlat}</span>`;
        // },
        // atkTooltipContent() {
        //   return `(<span class="Highlight">${this.context.finalStats.baseAtk}</span> + <span class="Highlight">${this.context.finalStats.weaponAtk}</span>) * (1 + <span class="Highlight">${this.totalAtkPercent}%</span>) + <span class="Highlight">${this.context.finalStats.totalAtkFlat}</span>`;
        // },
        // defTooltipContent() {
        //   return `<span class="Highlight">${this.context.finalStats.baseDef}</span> * (1 + <span class="Highlight">${this.context.finalStats.totalDefPercent}%</span>) + <span class="Highlight">${this.context.finalStats.totalDefFlat}</span>`;
        // },
    }
}
</script>