<template>
  <div class="calculator-character-workspace flex flex-col gap-4">
    <WorkspaceBuildMeta
      :character="character"
      :weapon-type="weaponType"
      @change-screen="$emit('change-screen', $event)" />

    <div class="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div class="flex flex-col gap-4">
        <WorkspaceForteRail
          :character="character"
          :attack-info="attackInfo"
          @character-talent-updated="$emit('character-talent-updated', $event)" />
      </div>
      <div class="flex flex-col gap-4">
        <template v-if="buffs.length && !isLoading">
          <WorkspaceBuffs
            :character="character"
            :buffs="buffs"
            @updated-character-buffs="$emit('updated-character-buffs')" />
        </template>
        <WorkspaceResonanceChain
          v-if="resonanceChainBuffs.length && !isLoading"
          :character="character"
          :buffs="resonanceChainBuffs"
          @updated-character-resonance-chains="$emit('updated-character-resonance-chains')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WorkspaceBuildMeta from "./WorkspaceBuildMeta.vue";
import WorkspaceForteRail from "./WorkspaceForteRail.vue";
import WorkspaceBuffs from "./WorkspaceBuffs.vue";
import WorkspaceResonanceChain from "./WorkspaceResonanceChain.vue";

interface CharacterBuffListItem {
  key: string;
  name: string;
  details: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  modifiers?: { modifier?: string; modifierValue?: number; modifierValueTalentRef?: string }[];
}

interface ResonanceChainBuffRow {
  key: string;
  name?: string;
  icon?: string;
  details?: string;
  alwaysEnabled?: boolean;
  hasStacks?: boolean;
  minStacks?: number;
  maxStacks?: number;
  buffAttackTargetSelection?: {
    configKey: string;
    defaultValue?: string;
    label?: string;
    options: { value: string; label: string }[];
  };
}

interface AttackInfo {
  icon?: string;
  description?: string;
}

interface Props {
  character: string;
  weaponType?: string;
  buffs?: CharacterBuffListItem[];
  resonanceChainBuffs?: ResonanceChainBuffRow[];
  isLoading?: boolean;
  attackInfo?: {
    basic?: AttackInfo;
    skill?: AttackInfo;
    forte?: AttackInfo;
    liberation?: AttackInfo;
    intro?: AttackInfo;
  };
}

withDefaults(defineProps<Props>(), {
  buffs: () => [],
  resonanceChainBuffs: () => [],
  isLoading: false,
  attackInfo: () => ({}),
});

defineEmits<{
  "character-talent-updated": [payload: { type: string; value: string }];
  "updated-character-buffs": [];
  "updated-character-resonance-chains": [];
  "change-screen": [screen: string];
}>();
</script>
