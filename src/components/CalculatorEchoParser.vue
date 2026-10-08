<template>
  <div v-if="debug" class="image-container" style="width: 960px; height: 540px">
    <img
      :src="imageSrc"
      ref="imageRef"
      width="960"
      height="540"
      @load="onImageLoad" />
    <div
      class="debug-box"
      v-for="(box, i) in allBoxes"
      :key="i"
      :style="getFixedBoxStyle(box)"></div>
  </div>
  <div v-if="!isV3" class="echo-parser">
    <h2 class="text-xl font-bold">
      Upload, or paste your image from the wuwa discord bot
    </h2>
    <p>
      <span class="text-primary">File must be 1920x1080.</span>
      Get the highest quality image possible, try to use the image from the bot
      itself. Either directly download, or open in browser to get your image
      from the bot.
    </p>
    <p class="mt-2">Tips and notes:</p>
    <ul class="list-disc list-inside ml-4 mb-4">
      <li class="font-bold">
        The processing won't be perfect. You may need to tweak the results you
        get.
      </li>
      <li>
        Don't share in Discord, Reddit, etc. then use the image that you
        uploaded there, because they lower the quality.
      </li>
      <li>The higher the quality the image, the better the results.</li>
      <li>It will take a little bit of time to parse it.</li>
      <li>
        It only supports English right now. You'll get mixed results with other
        languages.
      </li>
      <li>
        Hop into the main WuWa Discord, or our WutheringTools Discord to use the
        bot. Type /bind to connect your account ,then /create to generate the
        image. The bot is made by Kuro, so your account information is safe.
      </li>
    </ul>
    <div
      v-if="!inventoryOnly"
      class="flex gap-2 items-center justify-center">
      <div class="form-control mb-2" @click.stop>
        <label class="label inline-flex justify-start">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            v-model="isSavingToInventory" />
          <span class="label-text ml-2 font-bold">Save to Inventory?</span>
        </label>
      </div>
    </div>
    <div
      class="flex items-center gap-4 p-4 border-2 border-primary border-dotted rounded"
      :class="{ 'bg-base-300': isDragging }"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop">
      <input
        type="file"
        @change="onFileChange"
        ref="fileUpload"
        accept="image/*"
        class="file-input file-input-sm file-input-primary hidden" />
      <div class="flex flex-col gap-2 items-center w-full">
        <span
          v-if="isLoading"
          class="loading loading-spinner loading-md"></span>
        <span>Drag &amp; drop an image here, or paste</span>
        <a
          href="#"
          @click.prevent="triggerFileSelect"
          class="text-blue-600 underline">
          Or click here to choose an image
        </a>
      </div>
    </div>
    <template v-if="debug">
      <div v-if="echoes.length">
        <h3>Parsed Echoes:</h3>
        <pre>{{ JSON.stringify(echoes, null, 2) }}</pre>
      </div>
    </template>
  </div>
  <div v-else class="echo-parser flex flex-col gap-4">
    <div>
      <h2 class="text-xl font-bold">Import echoes from a screenshot</h2>
      <p class="text-sm opacity-70">
        Upload or paste a 1920×1080 image from the WuWa Discord bot.
      </p>
    </div>
    <div
      class="flex flex-col items-center justify-center gap-2 p-8 border-2 border-primary/60 border-dashed rounded-lg transition-colors"
      :class="isDragging ? 'bg-primary/10' : 'bg-base-200/40'"
      data-test-echo-import-dropzone
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop">
      <input
        type="file"
        @change="onFileChange"
        ref="fileUpload"
        accept="image/*"
        class="hidden" />
      <span v-if="isLoading" class="loading loading-spinner loading-md"></span>
      <span class="font-semibold">Drop an image here, or paste it</span>
      <button type="button" class="btn btn-sm btn-primary" @click="triggerFileSelect">
        Choose image
      </button>
    </div>
    <label
      v-if="!inventoryOnly"
      class="flex items-center justify-between gap-4 rounded-lg border border-base-300 px-4 py-3 cursor-pointer"
      @click.stop>
      <span class="flex flex-col">
        <span class="font-semibold text-sm">Save to inventory</span>
        <span class="text-xs opacity-70">
          Keep these echoes in your inventory so you can reuse them on other characters.
        </span>
      </span>
      <input
        type="checkbox"
        class="toggle toggle-primary"
        data-test-echo-import-save-toggle
        v-model="isSavingToInventory" />
    </label>
    <div class="collapse collapse-arrow bg-base-200/60 rounded-lg">
      <input type="checkbox" aria-label="Show import tips" />
      <div class="collapse-title text-sm font-semibold">Tips &amp; how to get the image</div>
      <div class="collapse-content text-sm">
        <ul class="list-disc list-inside space-y-1">
          <li>In the WuWa Discord (or ours), run <code>/bind</code> once, then <code>/create</code> to generate the image. The bot is made by Kuro, so your account is safe.</li>
          <li>Use the bot's original image. Re-uploads through Discord, Reddit, etc. lower quality and hurt parsing.</li>
          <li>Parsing takes a moment and isn't perfect — check the results afterwards.</li>
          <li>English only for now.</li>
        </ul>
      </div>
    </div>
    <template v-if="debug">
      <div v-if="echoes.length">
        <h3>Parsed Echoes:</h3>
        <pre>{{ JSON.stringify(echoes, null, 2) }}</pre>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { createWorker } from "tesseract.js";
import {
  buildCardRegions,
  isBuildCardSize,
  parseBuildCard,
  preprocessForOcr,
  RECOMMENDED_OCR_PARAMS,
  type BuildCardEchoSlot,
  type Region,
} from "@wutheringtools/build-card-scanner";
import { mainEchoesData, echoCostClassMap } from "../echoes/index";
import { getEchoSetIconByType, echoSetImageMap } from "../echoes/stats";
import EchoParserWorker from "../workers/echoParser.worker?worker";
import { useToast } from "../composables/useToast";
import { useSettingsStore } from "../stores/settings";
import { isV3UiEnabled } from "../utils/uiVersion";

const { showToast } = useToast();

// Card layout, text parsing and the read order live in @wutheringtools/build-card-scanner;
// this component supplies the OCR (tesseract.js) and image matching (echoParser.worker).
type RegionCoords = Region;
type ParsedEchoSlot = BuildCardEchoSlot;

const props = withDefaults(
  defineProps<{
    inventoryOnly?: boolean;
  }>(),
  { inventoryOnly: false },
);

const emit = defineEmits<{
  "echoes-parsed": [echoes: ParsedEchoSlot[], saveToInventory: boolean];
}>();

const echoes = ref<ParsedEchoSlot[]>([]);
const imageElement = ref<HTMLImageElement | null>(null);
const imageSrc = ref<string | undefined>(undefined);
const imageDimensions = ref({ width: 1, height: 1 });
const debug = ref(false);
const isLoading = ref(false);
const isDragging = ref(false);
const dragCounter = ref(0);
type TessWorker = Awaited<ReturnType<typeof createWorker>>;

const worker = ref<TessWorker | null>(null);
const echoParserWorker = ref<Worker | null>(null);
const imageBitmap = ref<ImageBitmap | null>(null);
const settingsStore = useSettingsStore() as any;
const isV3 = computed(() => isV3UiEnabled(settingsStore));
// v3 saves to inventory by default; the legacy checkbox stays opt-in.
const defaultSaveToInventory = () => isV3.value;
const isSavingToInventory = ref(defaultSaveToInventory());

const fileUpload = ref<HTMLInputElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

const echoCoordinates = buildCardRegions();

const allBoxes = computed(() =>
  echoCoordinates.flatMap((echo) => [
    echo.cost,
    echo.echoImage,
    echo.mainStatLabel,
    echo.set,
    ...echo.substats,
  ]),
);

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    void handleImageFile(file);
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
  dragCounter.value--;
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

function triggerFileSelect() {
  fileUpload.value?.click();
}

function reset() {
  imageElement.value = null;
  imageSrc.value = undefined;
  echoes.value = [];
  isLoading.value = false;
  imageBitmap.value = null;
  if (fileUpload.value) {
    fileUpload.value.value = "";
  }
  isSavingToInventory.value = defaultSaveToInventory();
}

function sendToParent() {
  emit(
    "echoes-parsed",
    echoes.value,
    props.inventoryOnly || isSavingToInventory.value,
  );
}

function onImageLoad() {
  const img = imageRef.value;
  if (!img) return;
  imageDimensions.value = {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

function getFixedBoxStyle(box: RegionCoords) {
  return {
    position: "absolute" as const,
    left: `${box.x * 0.5}px`,
    top: `${box.y * 0.5}px`,
    width: `${box.width * 0.5}px`,
    height: `${box.height * 0.5}px`,
    border: "1px dashed red",
    boxSizing: "border-box" as const,
    pointerEvents: "none" as const,
    background: "rgba(255, 0, 0, 0.1)",
  };
}

async function extractTextFromRegion(coords: RegionCoords) {
  const w = worker.value;
  const img = imageElement.value;
  if (!w || !img) return "";
  const canvas = document.createElement("canvas");
  canvas.width = coords.width;
  canvas.height = coords.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  ctx.drawImage(
    img,
    coords.x,
    coords.y,
    coords.width,
    coords.height,
    0,
    0,
    coords.width,
    coords.height,
  );
  const imageData = ctx.getImageData(0, 0, coords.width, coords.height);
  preprocessForOcr(imageData.data);
  ctx.putImageData(imageData, 0, 0);
  const result = await w.recognize(canvas.toDataURL());
  return result.data.text.trim();
}

async function initEchoParserWorker() {
  return new Promise<void>((resolve) => {
    echoParserWorker.value = new EchoParserWorker();
    const w = echoParserWorker.value;
    const readyHandler = (e: MessageEvent) => {
      if (e.data?.type === "ready") {
        w?.removeEventListener("message", readyHandler);
        resolve();
      }
    };
    w?.addEventListener("message", readyHandler);
    const echoReferences = Object.values(mainEchoesData ?? {}).map((echo) => ({
      key: echo.key,
      imageUrl: echo.image,
    }));
    w?.postMessage({
      type: "init",
      data: { echoReferences },
    });
  });
}

async function setSourceImageInWorker() {
  const w = echoParserWorker.value;
  const bmp = imageBitmap.value;
  if (!w || !bmp) {
    return;
  }
  return new Promise<void>((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "ready") {
        w.removeEventListener("message", handler);
        resolve();
      }
    };
    w.addEventListener("message", handler);
    w.postMessage(
      {
        type: "setSourceImage",
        data: {
          sourceImageBitmap: bmp,
        },
      },
      [bmp],
    );
  });
}

async function matchEchoRegion(
  coords: RegionCoords,
  filteredEchoKeys: string[] | null = null,
): Promise<string | null> {
  const w = echoParserWorker.value;
  if (!w) {
    return null;
  }
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "echoMatch") {
        w.removeEventListener("message", handler);
        resolve(e.data.echoMatch.echoKey as string);
      } else if (e.data?.type === "error") {
        w.removeEventListener("message", handler);
        console.error("Echo match error:", e.data.error);
        resolve(null);
      }
    };
    w.addEventListener("message", handler);
    w.postMessage({
      type: "parseEcho",
      data: {
        echoCoords: coords,
        filteredEchoKeys,
      },
    });
  });
}

async function matchSetRegionFirst(
  coords: RegionCoords,
): Promise<string | null> {
  const w = echoParserWorker.value;
  if (!w) {
    return null;
  }
  const allSetImageUrls: Record<string, string> = {};
  for (const [setKey, imageUrl] of Object.entries(echoSetImageMap)) {
    allSetImageUrls[setKey] = imageUrl;
  }
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "setMatch") {
        w.removeEventListener("message", handler);
        resolve(e.data.setMatch.setKey as string);
      } else if (e.data?.type === "error") {
        w.removeEventListener("message", handler);
        console.error("Set match error:", e.data.error);
        resolve(null);
      }
    };
    w.addEventListener("message", handler);
    w.postMessage({
      type: "matchSetFirst",
      data: {
        setCoords: coords,
        allSetImageUrls,
      },
    });
  });
}

async function matchSetRegion(
  coords: RegionCoords,
  echoSets: string[],
): Promise<string | null> {
  const w = echoParserWorker.value;
  if (!w) {
    return null;
  }
  const setImageUrls: Record<string, string> = {};
  for (const set of echoSets) {
    setImageUrls[set] = getEchoSetIconByType(set);
  }
  return new Promise((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "setMatch") {
        w.removeEventListener("message", handler);
        resolve(e.data.setMatch.setKey as string);
      } else if (e.data?.type === "error") {
        w.removeEventListener("message", handler);
        console.error("Set match error:", e.data.error);
        resolve(null);
      }
    };
    w.addEventListener("message", handler);
    w.postMessage({
      type: "matchSet",
      data: {
        setCoords: coords,
        possibleSets: echoSets,
        setImageUrls,
      },
    });
  });
}

function parseEchoes(): Promise<ParsedEchoSlot[]> {
  return parseBuildCard(
    {
      readText: extractTextFromRegion,
      matchSet: (region, possibleSets) =>
        possibleSets === null
          ? matchSetRegionFirst(region)
          : matchSetRegion(region, possibleSets),
      matchEcho: matchEchoRegion,
    },
    { echoes: mainEchoesData, echoCostByClass: echoCostClassMap },
  );
}

async function handleImageFile(file: File) {
  const img = new Image();
  img.onload = async () => {
    isLoading.value = true;
    console.time("Parse");
    imageElement.value = img;
    imageSrc.value = img.src;
    if (!isBuildCardSize(img.naturalWidth, img.naturalHeight)) {
      showToast("Image must be 1920x1080", "error");
      reset();
      return;
    }

    imageBitmap.value = await createImageBitmap(img);

    worker.value = await createWorker("eng");
    await worker.value.setParameters({
      tessedit_char_whitelist: RECOMMENDED_OCR_PARAMS.tessedit_char_whitelist,
      tessedit_pageseg_mode: RECOMMENDED_OCR_PARAMS.tessedit_pageseg_mode as never,
    });

    await initEchoParserWorker();
    await setSourceImageInWorker();

    echoes.value = await parseEchoes();
    console.timeEnd("Parse");
    isLoading.value = false;
    worker.value.terminate();
    worker.value = null;
    if (echoParserWorker.value) {
      echoParserWorker.value.terminate();
      echoParserWorker.value = null;
    }
    imageBitmap.value = null;
    sendToParent();
    reset();
  };
  img.src = URL.createObjectURL(file);
}

function onPaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (const item of Array.from(items)) {
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        void handleImageFile(file);
        break;
      }
    }
  }
}

onMounted(() => {
  document.addEventListener("paste", onPaste);
});

onBeforeUnmount(() => {
  document.removeEventListener("paste", onPaste);
  if (echoParserWorker.value) {
    echoParserWorker.value.terminate();
    echoParserWorker.value = null;
  }
  imageBitmap.value = null;
});
</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  max-width: 100%;
  display: block;
}

.debug-box {
  position: absolute;
  border: 1px dashed red;
  z-index: 10;
}
</style>
