<template>
  <AppModal ref="modalRef" title="Forte Details" max-width-class="max-w-3xl" :lazy="false">
    <div role="tablist" class="tabs tabs-bordered">
      <template v-for="track in tracks" :key="track.key">
        <input
          type="radio"
          name="workspace-forte-details-tabs"
          role="tab"
          class="tab whitespace-nowrap"
          :aria-label="track.label"
          :checked="activeTab === track.key"
          @change="activeTab = track.key" />
        <div role="tabpanel" class="tab-content pt-4">
          <div class="flex items-center gap-2 mb-2">
            <img v-if="track.icon" :src="track.icon" alt="" class="size-6" />
            <h4 class="font-semibold">{{ track.name || track.label }}</h4>
          </div>
          <div
            v-if="track.description"
            class="text-sm opacity-80 leading-relaxed"
            v-html="track.description"></div>
          <p v-else class="text-sm opacity-50">No details available.</p>
        </div>
      </template>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppModal from "../AppModal.vue";

interface AttackInfo {
  name?: string;
  icon?: string;
  description?: string;
}

interface Props {
  attackInfo?: {
    basic?: AttackInfo;
    skill?: AttackInfo;
    forte?: AttackInfo;
    liberation?: AttackInfo;
    intro?: AttackInfo;
  };
}

const props = withDefaults(defineProps<Props>(), { attackInfo: () => ({}) });

const TRACK_DEFS: { key: "basic" | "skill" | "forte" | "liberation" | "intro"; label: string }[] = [
  { key: "basic", label: "Basic Attack" },
  { key: "skill", label: "Resonance Skill" },
  { key: "forte", label: "Forte Circuit" },
  { key: "liberation", label: "Resonance Liberation" },
  { key: "intro", label: "Intro Skill" },
];

const tracks = TRACK_DEFS.map((def) => ({
  ...def,
  get icon() {
    return props.attackInfo[def.key]?.icon;
  },
  get name() {
    return props.attackInfo[def.key]?.name;
  },
  get description() {
    return props.attackInfo[def.key]?.description;
  },
}));

const activeTab = ref<string>("basic");
const modalRef = ref<InstanceType<typeof AppModal> | null>(null);

function triggerOpenModal(initialTab?: string) {
  if (initialTab) {
    activeTab.value = initialTab;
  }
  modalRef.value?.triggerOpenModal();
}

function triggerCloseModal() {
  modalRef.value?.triggerCloseModal();
}

defineExpose({
  triggerOpenModal,
  triggerCloseModal,
});
</script>
