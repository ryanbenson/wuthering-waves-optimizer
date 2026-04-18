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
  <div class="echo-parser">
    <div v-if="errorImageSize" class="alert alert-error mb-4">
      <div class="flex-1">
        <label>Image must be 1920x1080</label>
      </div>
    </div>
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
    <div class="flex gap-2 items-center justify-center">
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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { createWorker } from "tesseract.js";
import { mainEchoesData, getEchoData, getCostByClass } from "../echoes/index";
import { getEchoSetIconByType, echoSetImageMap } from "../echoes/stats";
import EchoParserWorker from "../workers/echoParser.worker?worker";

type RegionCoords = { x: number; y: number; width: number; height: number };

type EchoSlotCoords = {
  cost: RegionCoords;
  mainStatLabel: RegionCoords;
  substats: RegionCoords[];
  echoImage: RegionCoords;
  set: RegionCoords;
};

type ParsedSubstat = { subStat: string; subStatValue: string };

type ParsedEchoSlot = {
  cost: number | string | null;
  mainStatLabel: string;
  substats: ParsedSubstat[];
  echo: string | null;
  set: string | null;
};

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
const errorImageSize = ref(false);
const isSavingToInventory = ref(false);

const fileUpload = ref<HTMLInputElement | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);

const echoCoordinates = computed((): EchoSlotCoords[] => {
  const spacingX = 374;
  const baseY = 674;
  const echoesCoords: EchoSlotCoords[] = [];
  for (let i = 0; i < 5; i++) {
    const offsetX = i * spacingX;
    echoesCoords.push({
      cost: { x: 336 + offsetX, y: baseY, width: 18, height: 24 },
      mainStatLabel: { x: 215 + offsetX, y: 720, width: 173, height: 40 },
      substats: [
        { x: 64 + offsetX, y: 880, width: 320, height: 38 },
        { x: 64 + offsetX, y: 918, width: 320, height: 38 },
        { x: 64 + offsetX, y: 950, width: 320, height: 38 },
        { x: 64 + offsetX, y: 984, width: 320, height: 38 },
        { x: 64 + offsetX, y: 1019, width: 320, height: 38 },
      ],
      echoImage: { x: 22 + offsetX, y: 650, width: 192, height: 182 },
      set: { x: 264 + offsetX, y: 660, width: 56, height: 56 },
    });
  }
  return echoesCoords;
});

const allBoxes = computed(() =>
  echoCoordinates.value.flatMap((echo) => [
    echo.cost,
    echo.echoImage,
    echo.mainStatLabel,
    echo.set,
    ...echo.substats,
  ]),
);

const allFourCostEchoes = computed(() =>
  Object.values(mainEchoesData ?? {}).filter(
    (echo) => echo.class === "Overlord" || echo.class === "Calamity",
  ),
);

const allThreeCostEchoes = computed(() =>
  Object.values(mainEchoesData ?? {}).filter((echo) => echo.class === "Elite"),
);

const allOneCostEchoes = computed(() =>
  Object.values(mainEchoesData ?? {}).filter((echo) => echo.class === "Common"),
);

function keyImageMap(
  echoesList: { key: string; image: string }[],
): Record<string, string> {
  const map: Record<string, string> = {};
  echoesList.forEach((echo) => {
    map[echo.key] = echo.image;
  });
  return map;
}

const allFourCostEchoesKeyImageMap = computed(() =>
  keyImageMap(allFourCostEchoes.value as { key: string; image: string }[]),
);
const allThreeCostEchoesKeyImageMap = computed(() =>
  keyImageMap(allThreeCostEchoes.value as { key: string; image: string }[]),
);
const allOneCostEchoesKeyImageMap = computed(() =>
  keyImageMap(allOneCostEchoes.value as { key: string; image: string }[]),
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
  isSavingToInventory.value = false;
}

function sendToParent() {
  emit("echoes-parsed", echoes.value, isSavingToInventory.value);
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

function ensureValidSubStatValue(mainStat: string, value: string) {
  if (mainStat === "Crit. Rate" && value === "17.5%") {
    return "7.5%";
  }
  if (mainStat === "Crit. Rate" && value === "1.5%") {
    return "7.5%";
  }
  return value;
}

function convertCanvasToGrayscale(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);
}

function increaseContrast(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  factor = 1.5,
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    const adjusted = Math.max(0, Math.min(255, (gray - 128) * factor + 128));
    data[i] = adjusted;
    data[i + 1] = adjusted;
    data[i + 2] = adjusted;
  }
  ctx.putImageData(imageData, 0, 0);
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
  convertCanvasToGrayscale(ctx, coords.width, coords.height);
  increaseContrast(ctx, coords.width, coords.height);
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

async function parseEchoes(): Promise<ParsedEchoSlot[]> {
  const results: ParsedEchoSlot[] = [];

  for (const echo of echoCoordinates.value) {
    let cost: number | string | null = await extractTextFromRegion(echo.cost);
    if (cost === "<B>") {
      cost = 4;
    } else if (cost) {
      const costNum = parseInt(String(cost), 10);
      if (!isNaN(costNum)) {
        cost = costNum;
      } else {
        const match = String(cost).match(/\d+/);
        if (match) {
          cost = parseInt(match[0], 10);
        } else {
          cost = null;
        }
      }
    }
    const mainStatLabel = await extractTextFromRegion(echo.mainStatLabel);

    const substats: ParsedSubstat[] = [];
    for (const sub of echo.substats) {
      const raw = await extractTextFromRegion(sub);
      const cleaned = raw
        .replace(/\n/g, " ")
        .replace(/[^\w.%+ ]/g, "")
        .trim();
      const m = cleaned.match(/(.+?)\s+(\d+(\.\d+)?%?)(\s|$)/);
      if (m) {
        substats.push({
          subStat: m[1].trim(),
          subStatValue: ensureValidSubStatValue(m[1].trim(), m[2].trim()),
        });
      } else if (cleaned) {
        substats.push({ subStat: cleaned, subStatValue: "" });
      }
    }

    const matchedSet = await matchSetRegionFirst(echo.set);
    let matchedEcho: string | null = null;
    let set: string | null = matchedSet;

    if (matchedSet) {
      let filteredEchoKeys = Object.values(mainEchoesData ?? {})
        .filter((echoData) => echoData.sets?.includes(matchedSet))
        .map((echoData) => echoData.key);

      if (cost) {
        filteredEchoKeys = filteredEchoKeys.filter((echoKey) => {
          const echoData = getEchoData(echoKey);
          const echoCost = getCostByClass(echoData.class);
          return echoCost === cost;
        });
      }

      matchedEcho = await matchEchoRegion(echo.echoImage, filteredEchoKeys);

      if (matchedEcho) {
        const echoData = getEchoData(matchedEcho);
        if (!cost) {
          cost = getCostByClass(echoData.class);
        }
      }
    } else {
      matchedEcho = await matchEchoRegion(echo.echoImage);
      if (matchedEcho) {
        const echoData = getEchoData(matchedEcho);
        if (!cost) {
          cost = getCostByClass(echoData.class);
        }
        const echoSets = echoData.sets ?? [];
        if (echoSets.length === 1) {
          set = echoSets[0];
        } else {
          set = await matchSetRegion(echo.set, echoSets);
        }
      }
    }

    results.push({
      cost,
      mainStatLabel: mainStatLabel.trim(),
      substats,
      echo: matchedEcho,
      set,
    });
  }

  return results;
}

async function handleImageFile(file: File) {
  errorImageSize.value = false;
  const img = new Image();
  img.onload = async () => {
    isLoading.value = true;
    console.time("Parse");
    imageElement.value = img;
    imageSrc.value = img.src;
    if (img.naturalWidth !== 1920 || img.naturalHeight !== 1080) {
      errorImageSize.value = true;
      reset();
      return;
    }

    imageBitmap.value = await createImageBitmap(img);

    worker.value = await createWorker("eng");
    const whitelist =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%+ ";
    await worker.value.setParameters({
      tessedit_char_whitelist: whitelist,
      tessedit_pageseg_mode: 7 as never,
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
  const echoImages = [
    ...Object.values(allOneCostEchoesKeyImageMap.value),
    ...Object.values(allThreeCostEchoesKeyImageMap.value),
    ...Object.values(allFourCostEchoesKeyImageMap.value),
  ];
  echoImages.forEach((url) => {
    const img = new Image();
    img.src = url;
  });

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
