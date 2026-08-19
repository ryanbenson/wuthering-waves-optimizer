<template>
  <div
    class="build-card-portrait relative overflow-hidden border-solid neutral-content cursor-pointer"
    :class="[
      isDragging ? 'bg-base-300' : '',
      variant === 'cover'
        ? 'build-card-portrait--cover w-full h-full'
        : 'rounded-full border size-32 mb-2 mx-auto',
    ]"
    @click="triggerFileSelect"
    @dragover.prevent="onDragOver"
    @dragenter.prevent="onDragEnter"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    data-test-build-card-portrait>
    <div
      class="build-card-portrait__image absolute inset-0"
      :style="imageStyle"
      data-test-build-card-portrait-image></div>
    <input
      type="file"
      @change="onFileChange"
      ref="fileUpload"
      accept="image/*"
      class="hidden"
      data-test-build-card-portrait-input />
    <button
      v-if="currentPortrait"
      type="button"
      class="build-card-portrait__reset btn btn-xs btn-circle absolute top-2 right-2"
      @click.stop="resetPortrait"
      data-test-build-card-portrait-reset
      data-export-hide
      aria-label="Reset to default art">
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useCharacterStore } from "../stores/character";
import { useToast } from "../composables/useToast";
import { compressImageToDataUrl } from "../utils/imageCompression";
import { imageLayerStyle, type ImageTransform } from "../utils/imageTransform";

const props = withDefaults(
  defineProps<{
    character: string;
    currentPortrait?: string | null;
    defaultPortraitUrl: string;
    variant?: "avatar" | "cover";
    transform?: Partial<ImageTransform> | null;
  }>(),
  { variant: "avatar" },
);

const { showToast } = useToast();
const { setCharacterData } = useCharacterStore();

const fileUpload = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const dragCounter = ref(0);

const displayPortrait = computed(
  () => props.currentPortrait || props.defaultPortraitUrl,
);

const imageStyle = computed(() =>
  imageLayerStyle(displayPortrait.value, props.transform),
);

function triggerFileSelect() {
  fileUpload.value?.click();
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    void handleImageFile(file);
  }
  if (fileUpload.value) {
    fileUpload.value.value = "";
  }
}

function onDragOver(_e: DragEvent) {
  /* required to allow drop */
}

function onDragEnter(_e: DragEvent) {
  dragCounter.value++;
  isDragging.value = true;
}

function onDragLeave(_e: DragEvent) {
  dragCounter.value = Math.max(0, dragCounter.value - 1);
  if (dragCounter.value === 0) {
    isDragging.value = false;
  }
}

function onDrop(e: DragEvent) {
  dragCounter.value = 0;
  isDragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    void handleImageFile(file);
  }
}

async function handleImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file", "error");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    try {
      const dataUrl = compressImageToDataUrl(img);
      // A fresh image starts framed at the default cover/center/100% look —
      // any positioning dialed in for the *previous* portrait wouldn't mean
      // anything for a differently-cropped one.
      setCharacterData(props.character, {
        customPortrait: dataUrl,
        customPortraitTransform: null,
      });
      showToast("Portrait updated", "success");
    } catch {
      showToast("Failed to process image", "error");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };
  img.onerror = () => {
    showToast("Failed to load image", "error");
    URL.revokeObjectURL(objectUrl);
  };
  img.src = objectUrl;
}

function resetPortrait() {
  setCharacterData(props.character, {
    customPortrait: null,
    customPortraitTransform: null,
  });
  showToast("Reset to default art", "success");
}
</script>
