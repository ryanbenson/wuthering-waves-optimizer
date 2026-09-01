<template>
  <div
    class="flex items-start gap-2 rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
    :class="enabled ? 'bg-primary/10' : 'hover:bg-base-100'"
    :data-test-team-buffs-buff-row="def.key"
    @click="!def.alwaysEnabled && emit('toggle')">
    <input
      type="checkbox"
      class="toggle toggle-primary toggle-sm mt-0.5 shrink-0"
      :checked="enabled"
      :disabled="def.alwaysEnabled"
      @click.stop
      @change="emit('toggle')"
      :data-test-team-buffs-buff-enabled="def.key" />
    <div class="flex-1 min-w-0 text-xs leading-relaxed">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-semibold text-[.8rem]">{{ def.name }}</span>
        <img
          v-if="def.imageUrl"
          :src="def.imageUrl"
          :alt="def.name"
          class="w-4 h-4 object-contain rounded-full"
          loading="lazy" />
        <span v-if="sequenceNodeRequirement" class="text-[.6rem] font-bold uppercase opacity-50">{{
          sequenceNodeRequirement
        }}</span>
      </div>
      <div class="opacity-70 mt-0.5" v-html="def.details"></div>
      <div v-if="def.hasStacks || def.hasRefinements || def.inputBase" class="flex flex-wrap items-center gap-2 mt-1.5" @click.stop>
        <template v-if="def.hasStacks">
          <span class="text-[.6rem] font-bold uppercase opacity-40">Stacks</span>
          <input
            type="number"
            class="input input-xs input-bordered w-14 text-right font-mono"
            min="0"
            :max="def.maxStacks"
            :value="stacks"
            @input="emit('set-stacks', ($event.target as HTMLInputElement).value)"
            :data-test-team-buffs-buff-stacks="def.key" />
          <button
            type="button"
            class="btn btn-xs btn-ghost"
            @click="emit('set-max-stacks')"
            :data-test-team-buffs-buff-stacks-max="def.key">
            Max ({{ def.maxStacks }})
          </button>
        </template>
        <template v-if="def.hasRefinements">
          <span class="text-[.6rem] font-bold uppercase opacity-40">Refinement</span>
          <select
            class="select select-xs select-bordered"
            :value="refinement"
            @change="emit('set-refinement', ($event.target as HTMLSelectElement).value)"
            :data-test-team-buffs-buff-refinement="def.key">
            <option v-for="r in ['1', '2', '3', '4', '5']" :key="r" :value="r">R{{ r }}</option>
          </select>
        </template>
        <template v-if="def.inputBase">
          <span class="text-[.6rem] font-bold uppercase opacity-40">{{ def.modifierBasedOn }}</span>
          <input
            type="number"
            class="input input-xs input-bordered w-16 text-right font-mono"
            :value="baseAttrValue"
            @input="emit('set-base-attr-value', ($event.target as HTMLInputElement).value)"
            :data-test-team-buffs-buff-input-base="def.key" />
        </template>
      </div>
    </div>
    <span class="font-mono text-xs shrink-0 pt-0.5" :class="enabled ? 'text-accent' : 'opacity-40'">{{
      contribution
    }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getSequenceNodeRequirement } from "../../buffs/teamBuffs";
import type { PartyBuffDef } from "../CalculatorTeamBuffsWorkspace.vue";

const props = defineProps<{
  def: PartyBuffDef;
  enabled: boolean;
  stacks: number;
  refinement: string;
  baseAttrValue: number;
  contribution: string;
}>();

const emit = defineEmits<{
  toggle: [];
  "set-stacks": [value: string];
  "set-max-stacks": [];
  "set-refinement": [value: string];
  "set-base-attr-value": [value: string];
}>();

const sequenceNodeRequirement = computed(() => getSequenceNodeRequirement(props.def.name));
</script>
