<template>
  <div class="build-card-backdrop" aria-hidden="true">
    <!-- Default: the character art, blurred and darkened into a tinted
         backdrop, so every character gets a matching card with no upload. -->
    <template v-if="blurred">
      <div
        v-if="url"
        class="build-card-backdrop__blur"
        :style="{ backgroundImage: `url(${url})`, opacity: BLUR_OPACITY * opacity }"></div>
      <div class="build-card-backdrop__tint"></div>
    </template>
    <!-- A chosen background: shown as-is under one even scrim. Panels sit on
         top with a uniform translucent fill, so the image reads the same
         behind every panel. -->
    <template v-else>
      <div class="build-card__background-layer" :style="layerStyle"></div>
      <div class="build-card-backdrop__scrim"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { imageLayerStyle, type ImageTransform } from "../../utils/imageTransform";

const props = withDefaults(
  defineProps<{
    url: string | null;
    blurred: boolean;
    transform?: Partial<ImageTransform> | null;
    /** 0-1, from the Customize panel's opacity slider. */
    opacity?: number;
  }>(),
  { transform: null, opacity: 1 },
);

// The blurred default is already slightly see-through at full opacity.
const BLUR_OPACITY = 0.9;

const layerStyle = computed(() => ({
  ...imageLayerStyle(props.url, props.transform),
  opacity: String(props.opacity),
}));
</script>

<style scoped>
.build-card-backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--card-bg);
}

.build-card-backdrop__blur {
  position: absolute;
  left: -10%;
  top: -30%;
  width: 120%;
  height: 160%;
  background-size: cover;
  background-position: center 30%;
  filter: blur(70px) saturate(1.4) brightness(0.55);
}

.build-card-backdrop__tint {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 20% 30%, color-mix(in srgb, var(--card-accent) 10%, transparent) 0%, transparent 45%),
    linear-gradient(180deg, rgba(8, 11, 22, 0.25) 0%, rgba(8, 11, 22, 0.65) 100%);
}

.build-card__background-layer {
  position: absolute;
  inset: 0;
  transform-origin: center;
}

.build-card-backdrop__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(6, 9, 18, 0.15) 0%, rgba(6, 9, 18, 0.35) 45%, rgba(6, 9, 18, 0.45) 100%);
}
</style>
