<template>
<div class="presetEchoes card card-bordered card-compact bg-base-100 shadow mb-2">
    <div class="card-body">
        <h2 class="card-title">{{ name }}</h2>
        <div class="mb-2 flex gap-2">
            <span class="echo__item__cost badge text-nowrap" :class="critValueBadgeClass">
                CV {{ formattedCritValue }}%
            </span>
            <span class="echo__item__cost badge text-nowrap" :class="rollValueBadgeClass">
                RV {{ totalRv }}%
            </span>
        </div>
        <div class="flex gap-2">
            <EchoCustomPresetEcho
                v-if="echo1Id"
                key="echo1"
                :echo-id="echo1Id"
            />
            <EchoCustomPresetEcho
                v-if="echo2Id"
                key="echo2"
                :echo-id="echo2Id"
            />
            <EchoCustomPresetEcho
                v-if="echo3Id"
                key="echo3"
                :echo-id="echo3Id"
            />
            <EchoCustomPresetEcho
                v-if="echo4Id"
                key="echo4"
                :echo-id="echo4Id"
            />
            <EchoCustomPresetEcho
                v-if="echo5Id"
                key="echo5"
                :echo-id="echo5Id"
            />
        </div>
        <button v-if="!disableAction" class="btn btn-sm btn-primary max-w-40 mt-2">Apply preset</button>
        <slot></slot>
    </div>
</div>
</template>

<script>
import EchoCustomPresetEcho from "./EchoCustomPresetEcho.vue";
import { getRollValue } from "../echoes/stats";
import { mapActions, mapState } from "pinia";
import { useInventoryStore } from "../stores/inventory";
export default {
    name: 'EchoCustomPreset',
    props: {
        presetId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        echo1Id: {
            type: String,
        },
        echo2Id: {
            type: String,
        },
        echo3Id: {
            type: String,
        },
        echo4Id: {
            type: String,
        },
        echo5Id: {
            type: String,
        },
        disableAction: {
            type: Boolean,
            default: false,
        },
        showEquippedChars: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        EchoCustomPresetEcho,
    },
    data() {
        return {
            totalRv: 0,
            totalCv: 0,
        };
    },
    methods: {
        ...mapActions(useInventoryStore, [
            "getEchoById",
        ]),
        async getEchoRv(echoId) {
            if (!echoId) {
                return 0;
            }
            const echoData = await this.getEchoById(echoId);
            if (!echoData) {
                return 0;
            }
            const echoSubStatData = this.getEchoStatsFormatted(echoData);
            return getRollValue(echoSubStatData);
        },
        async getEchoCv(echoId) {
            if (!echoId) {
                return 0;
            }
            const echoData = await this.getEchoById(echoId);
            if (!echoData) {
                return 0;
            }

            let cv = 0;
            for (let i = 1; i <= 5; i++) {
                const typeKey = `echoSubStatsType${i}`;
                const valueKey = `echoSubStatsValue${i}`;
                
                if (echoData[typeKey] === 'CritRate') {
                    cv += echoData[valueKey] * 2; // Double the value for CritRate
                } else if (echoData[typeKey] === 'CritDMG') {
                    cv += echoData[valueKey]; // Add the value for CritDMG
                }
            }
            return cv;
        },
        getEchoStatsFormatted(data) {
            const substatType1 = data.echoSubStatsType1;
            const substatType2 = data.echoSubStatsType2;
            const substatType3 = data.echoSubStatsType3;
            const substatType4 = data.echoSubStatsType4;
            const substatType5 = data.echoSubStatsType5;
            const echoData = {};
            if (substatType1) {
                echoData[substatType1.toString()] = data.echoSubStatsValue1 ?? 0;
            }
            if (substatType2) {
                echoData[substatType2.toString()] = data.echoSubStatsValue2 ?? 0;
            }
            if (substatType3) {
                echoData[substatType3.toString()] = data.echoSubStatsValue3 ?? 0;
            }
            if (substatType4) {
                echoData[substatType4.toString()] = data.echoSubStatsValue4 ?? 0;
            }
            if (substatType5) {
                echoData[substatType5.toString()] = data.echoSubStatsValue5 ?? 0;
            }
            return echoData;
        },
    },
    computed: {
        rollValueBadgeClass() {
            // divide by 5 because it's a total of all 5 echo RVs
            const rv = (this.totalRv / 5) ?? 0;
            
            // Ensure cv is within the valid range
            const percentage = Math.min(Math.max(rv, 0), 600);

            let bgColor;
            let color = 'text-white';
            let boxShadow;
            let borderColor;

            if (percentage <= 180) {
                bgColor = 'bg-emerald-800';  // Dark Green
                borderColor = 'border-emerald-800';
            } else if (percentage <= 220) {
                bgColor = 'bg-green-500';  // Lighter Green
                borderColor = 'border-green-500';
            } else if (percentage <= 300) {
                bgColor = 'bg-blue-600';   // Blue
                borderColor = 'border-blue-600';
                color = 'text-black';
            } else if (percentage < 400) {
                bgColor = 'bg-purple-600'; // Purple
                borderColor = 'border-purple-600';
                color = 'text-black';
            } else {
                bgColor = 'bg-yellow-500'; // Gold or Red (depending on preference)
                borderColor = 'border-yellow-500';
                color = 'text-black';
            }
            if (percentage >= 450) {
                boxShadow = 'shadow-md shadow-yellow-500/50';
            }

            return [
                bgColor,  // Dynamically return the class based on the cv
                color,
                borderColor,
                boxShadow,
            ];
        },
    formattedCritValue() {
      const num = this.totalCv ?? 0;
      if (Number.isInteger(num)) {
        return num;  // If it's an integer, return it as is
      } else {
        const rounded = num.toFixed(1);  // Round to 1 decimal place
        return (rounded.endsWith('.0')) ? parseInt(rounded) : parseFloat(rounded);  // Remove the '.0' if it's a whole number
      }
    },
    critValueBadgeClass() {
      const cv = (this.totalCv / 5) ?? 0;
      
      // Ensure cv is within the valid range
      const percentage = Math.min(Math.max(cv, 0), 42);

      let bgColor;
      let color = 'text-white';
      let boxShadow;
      let borderColor;

      if (percentage <= 7) {
        bgColor = 'bg-emerald-800';  // Dark Green
        borderColor = 'border-emerald-800';
      } else if (percentage <= 14) {
        bgColor = 'bg-green-500';  // Lighter Green
        borderColor = 'border-green-500';
      } else if (percentage <= 21) {
        bgColor = 'bg-blue-600';   // Blue
        borderColor = 'border-blue-600';
        color = 'text-black';
      } else if (percentage <= 28) {
        bgColor = 'bg-purple-600'; // Purple
        borderColor = 'border-purple-600';
        color = 'text-black';
      } else if (percentage <= 35) {
        bgColor = 'bg-purple-400'; // Lighter Purple
        borderColor = 'border-purple-400';
        color = 'text-black';
      } else {
        bgColor = 'bg-yellow-500'; // Gold or Red (depending on preference)
        borderColor = 'border-yellow-500';
        color = 'text-black';
      }
      if (percentage >= 40) {
        boxShadow = 'shadow-md shadow-yellow-500/50';
      }

      return [
        bgColor,  // Dynamically return the class based on the cv
        color,
        borderColor,
        boxShadow,
      ];
    },
    },
    async mounted() {
        const echo1Rv = await this.getEchoRv(this.echo1Id);
        const echo2Rv = await this.getEchoRv(this.echo2Id);
        const echo3Rv = await this.getEchoRv(this.echo3Id);
        const echo4Rv = await this.getEchoRv(this.echo4Id);
        const echo5Rv = await this.getEchoRv(this.echo5Id);
        this.totalRv = echo1Rv + echo2Rv + echo3Rv + echo4Rv + echo5Rv;

        const echo1Cv = await this.getEchoCv(this.echo1Id);
        const echo2Cv = await this.getEchoCv(this.echo2Id);
        const echo3Cv = await this.getEchoCv(this.echo3Id);
        const echo4Cv = await this.getEchoCv(this.echo4Id);
        const echo5Cv = await this.getEchoCv(this.echo5Id);
        this.totalCv = echo1Cv + echo2Cv + echo3Cv + echo4Cv + echo5Cv;
    }
}
</script>
