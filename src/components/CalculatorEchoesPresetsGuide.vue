<template>
  <AppModal
    ref="modalRef"
    :title="isV3 ? 'How presets work' : 'Presets Guide'"
    max-width-class="max-w-5xl"
    :lazy="false">
    <p class="mt-2">
      This is a quick guide to help you understand how presets work so you
      can use them well.
    </p>
    <p class="mt-2">
      <strong>Important to know:</strong>
      presets are just references to your inventory's echoes. That's really
      all it is. So when you make a preset, it's just a group of references
      to your inventory that you can quickly swap around. Any information
      about your echo (stats, sub stats, etc.) are not stored in your
      preset, as that stays on your echo itself.
    </p>
    <p class="mt-2">
      <strong>What to avoid</strong>
      : If you make a preset, then change an echo's information like
      substats, then make a second preset with the same list of echoes, both
      presets will be copies of one another. So swapping between those two
      will not change your character's build.
    </p>
    <h1 class="text-lg mt-4">Managing presets</h1>
    <p v-if="isV3" class="mt-2">
      You can import from your WuWa export, grab from your inventory, or
      manually make new echoes. Then open the Presets menu, choose "Save
      current echoes as preset", and give it a name. If any echoes are not
      in your inventory, it will save them there. And now you have a preset
      that you can use for any character.
    </p>
    <p v-else class="mt-2">
      You can import from your WuWa export, grab from your inventory, or
      manually make new echoes. Then click "Save Preset", and give it a
      name. If any echoes are not in your inventory, it will save them
      there. And now you have a preset that you can use for any character.
    </p>
    <p class="mt-2">
      You can now make changes to your existing echoes substats, etc. and it
      will keep saving those changes to your echoes, and any preset that
      uses those echoes.
      <strong>
        So if you "Save Preset" again and give it a new name, if it's the
        same echoes from your inventory, the two presets will always be
        copies of one another.
      </strong>
    </p>
    <p v-if="isV3" class="mt-2">
      If you remove or replace an echo while a preset is applied, the
      Presets button shows a dot. Its menu lets you update the preset with
      your new echoes, save them as a new preset, or revert to the preset.
    </p>
    <p v-else class="mt-2">
      If you remove an echo, or replace an echo from your inventory, while
      you have a preset equipped to your character, it will un-equip that
      preset since the echoes have changed. If you save a new preset now, it
      will be unique!
    </p>
    <p class="mt-2">
      You can see in your inventory the list of presets you have saved and
      who has equipped them as well. And there's no limit to how many times
      you can equip a preset.
    </p>
    <h1 class="text-lg mt-4">Using presets</h1>
    <template v-if="isV3">
      <p class="mt-2">
        Open the Presets menu and choose "Browse all presets". "My presets"
        are the ones you saved, and "Theorycrafter builds" are recommended
        builds for this character. Click "Apply preset" on any of them and
        it will update your character with that build.
      </p>
      <p class="mt-2">
        Theorycrafter builds aren't using echoes from your inventory, but you
        can save them to your presets from the Presets menu.
      </p>
    </template>
    <template v-else>
      <p class="mt-2">
        You can click "Use presets" to find your list of echoes, and any Other
        (app-provided) presets. You can click "Apply preset" on any of them
        and it will update your character with that build.
      </p>
      <p class="mt-2">
        Note that Other (app-provided) presets aren't using echoes from your
        inventory, but you can save them if you want.
      </p>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";
import AppModal from "./AppModal.vue";

const settingsStore = useSettingsStore() as any;
const isV3 = computed(() => isV3UiEnabled(settingsStore));

const modalRef = ref<InstanceType<typeof AppModal> | null>(null);

function triggerOpenModal() {
  modalRef.value?.triggerOpenModal();
}

function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
}

defineExpose({ triggerOpenModal, triggerCloseModal });
</script>
