<template>
  <div class="calculator-character-workspace flex flex-col gap-4">
    <WorkspaceIdentityBar
      :character="character"
      :character-name="characterName || character"
      :rarity="rarity"
      :element="element"
      :weapon-type="weaponType"
      @open-character-browser="openCharacterBrowser"
      @create-build="openManageBuilds"
      @manage-builds="openManageBuilds"
      @character-level-updated="$emit('character-level-updated', $event)" />

    <WorkspaceBuildMeta
      :character="character"
      :weapon-type="weaponType"
      @change-screen="$emit('change-screen', $event)" />

    <!-- Mode is a core toggle — it changes which self-buffs and Resonance
         Chain buffs are active, so it sits above Forte/Buffs/Resonance
         Chain rather than tucked inside one of those panels. -->
    <div
      v-if="characterStances.length > 1 && !isLoading"
      class="workspace-mode bg-base-200 rounded-xl p-3">
      <CalculatorCharacterStance
        :character="character"
        :stances="characterStances"
        @updated-character-stance="$emit('updated-character-stance', $event)" />
    </div>

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

    <CalculatorCharacterBrowser
      :character="character"
      ref="characterBrowserRef"
      @character-browser:chosen-character="handleChosenCharacter" />
    <CalculatorManageBuilds :character="character" ref="manageBuildsRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CalculatorCharacterBrowser from "../CalculatorCharacterBrowser.vue";
import CalculatorCharacterStance from "../CalculatorCharacterStance.vue";
import CalculatorManageBuilds from "../CalculatorManageBuilds.vue";
import { useCharacterStore } from "../../stores/character";
import WorkspaceIdentityBar from "./WorkspaceIdentityBar.vue";
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
  characterName?: string;
  rarity?: number;
  element?: string;
  weaponType?: string;
  buffs?: CharacterBuffListItem[];
  resonanceChainBuffs?: ResonanceChainBuffRow[];
  characterStances?: string[];
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
  characterStances: () => [],
  isLoading: false,
  attackInfo: () => ({}),
});

const emit = defineEmits<{
  "updated-chosen-character": [key: string];
  "character-level-updated": [level: string];
  "character-talent-updated": [payload: { type: string; value: string }];
  "updated-character-stance": [stance: string];
  "updated-character-buffs": [];
  "updated-character-resonance-chains": [];
  "change-screen": [screen: string];
}>();

const characterStore = useCharacterStore();

const characterBrowserRef = ref<{ triggerOpenModal: () => void } | null>(null);
const manageBuildsRef = ref<{ triggerOpenModal: () => void } | null>(null);

function openCharacterBrowser() {
  characterBrowserRef.value?.triggerOpenModal();
}

function openManageBuilds() {
  manageBuildsRef.value?.triggerOpenModal();
}

function handleChosenCharacter(nextCharacter: string) {
  characterStore.ensureCharacterBuilds(nextCharacter);
  emit("updated-chosen-character", nextCharacter);
}
</script>

<style scoped lang="scss">
// CalculatorCharacterStance.vue is reused unmodified (so the legacy screen
// keeps its exact look when the labs flag is off) — this overrides just the
// "Mode" label's typography for this workspace's context, where it's a
// prominent top-level toggle rather than a small aside above the Forte
// sliders. Deep-scoped so it doesn't leak into the legacy layout.
.workspace-mode {
  :deep(.character__stance) {
    margin: 0;
  }
  :deep(.mode__label) {
    position: static;
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    opacity: 0.5;
    margin-bottom: 0.5rem;
  }
}
</style>
