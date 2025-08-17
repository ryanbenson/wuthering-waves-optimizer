<template>
    <div class="presetEcho">
                <div
              class="echo__item__image rounded-full border border-solid neutral-content size-16 bg-cover min-w-16 text-center"
              :class="{
                'border-amber-300': rank === '5' || rank === 5,
                'border-violet-600': rank === '4' || rank === 4,
                'border-blue-500': rank === '3' || rank === 3,
                'border-green-500': rank === '2' || rank === 2,
              }"
              :style="{
                backgroundImage: `url(${echoImage})`,
              }"></div>
            </div>
</template>

<script>
import {
  mainEchoesData,
  getEchoData,
  getCostByClass,
} from "../echoes/index.ts";
import { mapActions } from "pinia";
import { useInventoryStore } from "../stores/inventory";
export default {
    name: 'EchoCustomPresetEcho',
    props: {
        echoId: {
            type: String,
            required: true,
        }
    },
    methods: {
        ...mapActions(useInventoryStore, [
            "getEchoById",
        ]),
    },
    computed: {
        echoData() {
            return this.getEchoById(this.echoId);
        },
        echoImage() {
            const defaultImageUrl =
                "https://ryanbenson.github.io/wuthering-waves-assets/images/echoes/monsters.png";
            if (!this.echoData?.echo) {
                return defaultImageUrl;
            }
            const echoData = getEchoData(this.echoData.echo);
            return echoData?.image ?? defaultImageUrl;
        },
        rank() {
            return this.echoData?.rank ?? 5;
        }
    }
}
</script>