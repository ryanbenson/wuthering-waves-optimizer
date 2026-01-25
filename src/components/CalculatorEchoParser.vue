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

<script>
import { createWorker } from "tesseract.js";
import { mainEchoesData, getEchoData, getCostByClass } from "../echoes/index";
import { getEchoSetIconByType, echoSetImageMap } from "../echoes/stats";
import EchoParserWorker from "../workers/echoParser.worker?worker";

export default {
  name: "EchoParser",
  data() {
    return {
      echoes: [],
      imageElement: null,
      imageSrc: null,
      imageDimensions: { width: 1, height: 1 },
      debug: false,
      isLoading: false,
      isDragging: false,
      dragCounter: 0,
      worker: null,
      echoParserWorker: null,
      imageBitmap: null,
      errorImageSize: false,
      isSavingToInventory: false,
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.handleImageFile(file);
      }
    },
    onDragOver(e) {
      /* required to allow drop */
    },
    onDragEnter(e) {
      this.dragCounter++;
      this.isDragging = true;
    },
    onDragLeave(e) {
      this.dragCounter--;
      if (this.dragCounter === 0) {
        this.isDragging = false;
      }
    },
    onDrop(e) {
      this.dragCounter = 0;
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        this.handleImageFile(file);
      }
    },
    triggerFileSelect() {
      this.$refs.fileUpload.click();
    },
    async handleImageFile(file) {
      this.errorImageSize = false;
      const img = new Image();
      img.onload = async () => {
        this.isLoading = true;
        console.time("Parse");
        this.imageElement = img;
        this.imageSrc = img.src;
        // validate that the image is 1920x1080
        if (img.naturalWidth !== 1920 || img.naturalHeight !== 1080) {
          this.errorImageSize = true;
          this.reset();
          return;
        }

        // Create ImageBitmap for worker
        this.imageBitmap = await createImageBitmap(img);

        // Initialize OCR worker
        this.worker = await createWorker("eng");
        const whitelist =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%+ ";
        await this.worker.setParameters({
          tessedit_char_whitelist: whitelist,
          tessedit_pageseg_mode: 7,
        });

        // Initialize echo parser worker
        await this.initEchoParserWorker();
        // Set the source image in the worker
        await this.setSourceImageInWorker();

        this.echoes = await this.parseEchoes();
        console.timeEnd("Parse");
        this.isLoading = false;
        this.worker.terminate();
        this.worker = null;
        if (this.echoParserWorker) {
          this.echoParserWorker.terminate();
          this.echoParserWorker = null;
        }
        // Note: imageBitmap is transferred to worker, so it's detached and can't be closed here
        this.imageBitmap = null;
        this.sendToParent();
        this.reset();
      };
      img.src = URL.createObjectURL(file);
    },

    reset() {
      this.imageElement = null;
      this.imageSrc = null;
      this.echoes = [];
      this.isLoading = false;
      // imageBitmap is transferred to worker, so it's detached and handled by worker cleanup
      this.imageBitmap = null;
      this.$refs.fileUpload.value = null;
      this.isSavingToInventory = false;
    },

    sendToParent() {
      this.$emit("echoes-parsed", this.echoes, this.isSavingToInventory);
    },

    onImageLoad() {
      const img = this.$refs.imageRef;
      this.imageDimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
    },
    getFixedBoxStyle(box) {
      // Your input coords are based on 1920x1080, and this scales them by 0.5 for a 960x540 preview
      return {
        position: "absolute",
        left: `${box.x * 0.5}px`,
        top: `${box.y * 0.5}px`,
        width: `${box.width * 0.5}px`,
        height: `${box.height * 0.5}px`,
        border: "1px dashed red",
        boxSizing: "border-box",
        pointerEvents: "none",
        background: "rgba(255, 0, 0, 0.1)",
      };
    },

    async parseEchoes() {
      const results = [];

      for (const echo of this.echoCoordinates) {
        let cost = await this.extractTextFromRegion(echo.cost, true);
        if (cost === "<B>") {
          cost = 4;
        } else if (cost) {
          // Ensure cost is a number, not a string
          const costNum = parseInt(cost, 10);
          if (!isNaN(costNum)) {
            cost = costNum;
          } else {
            // If parsing fails, try to extract number from string
            const match = String(cost).match(/\d+/);
            if (match) {
              cost = parseInt(match[0], 10);
            } else {
              cost = null; // Can't determine cost
            }
          }
        }
        const mainStatLabel = await this.extractTextFromRegion(
          echo.mainStatLabel,
        );

        const substats = [];
        for (const sub of echo.substats) {
          const raw = await this.extractTextFromRegion(sub);

          // 🧼 Clean up newlines and weird characters
          const cleaned = raw
            .replace(/\n/g, " ")
            .replace(/[^\w.%+ ]/g, "")
            .trim();
          const match = cleaned.match(/(.+?)\s+(\d+(\.\d+)?%?)(\s|$)/);
          if (match) {
            substats.push({
              subStat: match[1].trim(),
              subStatValue: this.ensureValidSubStatValue(
                match[1].trim(),
                match[2].trim(),
              ),
            });
          } else if (cleaned) {
            substats.push({ subStat: cleaned, subStatValue: "" });
          }
        }

        // NEW LOGIC: Match echo set first, then filter echoes by that set AND cost
        // This reduces search space from 100+ to just 1-5 echoes per set+cost combination
        const matchedSet = await this.matchSetRegionFirst(echo.set);
        let matchedEcho = null;
        let set = matchedSet;
        
        if (matchedSet) {
          // Get all echoes that belong to this set
          let filteredEchoKeys = Object.values(mainEchoesData ?? {})
            .filter((echoData) => echoData.sets?.includes(matchedSet))
            .map((echoData) => echoData.key);
          
          // CRITICAL: Also filter by cost if we have it
          // This reduces from 5-10 echoes to just 1-5 echoes per set+cost
          if (cost) {
            filteredEchoKeys = filteredEchoKeys.filter((echoKey) => {
              const echoData = getEchoData(echoKey);
              const echoCost = getCostByClass(echoData.class);
              return echoCost === cost;
            });
          }
          
          // Match echo from filtered list (only 1-5 echoes instead of 100+)
          matchedEcho = await this.matchEchoRegion(echo.echoImage, filteredEchoKeys);
          
          if (matchedEcho) {
            const echoData = getEchoData(matchedEcho);
            // Set cost from echo class if not already determined
            if (!cost) {
              cost = getCostByClass(echoData.class);
            }
          }
        } else {
          // Fallback: if set matching fails, try matching echo without filter
          matchedEcho = await this.matchEchoRegion(echo.echoImage);
          if (matchedEcho) {
            const echoData = getEchoData(matchedEcho);
            if (!cost) {
              cost = getCostByClass(echoData.class);
            }
            // Try to match set from the matched echo's possible sets
            const echoSets = echoData.sets ?? [];
            if (echoSets.length === 1) {
              set = echoSets[0];
            } else {
              set = await this.matchSetRegion(echo.set, echoSets);
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
    },

    ensureValidSubStatValue(mainStat, value) {
      if (mainStat === "Crit. Rate" && value === "17.5%") {
        return "7.5%";
      }
      if (mainStat === "Crit. Rate" && value === "1.5%") {
        return "7.5%";
      }
      return value;
    },

    extractTextFromRegion(coords) {
      const canvas = document.createElement("canvas");
      canvas.width = coords.width;
      canvas.height = coords.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        this.imageElement,
        coords.x,
        coords.y,
        coords.width,
        coords.height,
        0,
        0,
        coords.width,
        coords.height,
      );
      // Convert to grayscale and increase contrast for better OCR accuracy
      this.convertCanvasToGrayscale(ctx, coords.width, coords.height);
      this.increaseContrast(ctx, coords.width, coords.height);
      return this.worker.recognize(canvas.toDataURL()).then((result) => {
        const text = result.data.text.trim();
        return text;
      });
    },
    // Removed extractImageRegion, compareImages, and imageToCanvasCtx as they're now in the worker
    async initEchoParserWorker() {
      return new Promise((resolve, reject) => {
        this.echoParserWorker = new EchoParserWorker();

        // Wait for worker to be ready
        const readyHandler = (e) => {
          if (e.data.type === "ready") {
            this.echoParserWorker.removeEventListener("message", readyHandler);
            resolve();
          }
        };
        this.echoParserWorker.addEventListener("message", readyHandler);

        // Initialize worker with all echo references
        const echoReferences = Object.values(mainEchoesData ?? {}).map(
          (echo) => ({
            key: echo.key,
            imageUrl: echo.image,
          }),
        );

        this.echoParserWorker.postMessage({
          type: "init",
          data: { echoReferences },
        });
      });
    },

    async setSourceImageInWorker() {
      if (!this.echoParserWorker || !this.imageBitmap) {
        return;
      }

      return new Promise((resolve, reject) => {
        const handler = (e) => {
          if (e.data.type === "ready") {
            this.echoParserWorker.removeEventListener("message", handler);
            resolve();
          }
        };

        this.echoParserWorker.addEventListener("message", handler);

        // Transfer the image bitmap to the worker (can only transfer once)
        this.echoParserWorker.postMessage(
          {
            type: "setSourceImage",
            data: {
              sourceImageBitmap: this.imageBitmap,
            },
          },
          [this.imageBitmap],
        );
      });
    },

    async matchEchoRegion(coords, filteredEchoKeys = null) {
      if (!this.echoParserWorker) {
        return null;
      }

      return new Promise((resolve, reject) => {
        const handler = (e) => {
          if (e.data.type === "echoMatch") {
            this.echoParserWorker.removeEventListener("message", handler);
            resolve(e.data.echoMatch.echoKey);
          } else if (e.data.type === "error") {
            this.echoParserWorker.removeEventListener("message", handler);
            console.error("Echo match error:", e.data.error);
            resolve(null);
          }
        };

        this.echoParserWorker.addEventListener("message", handler);

        // Send coordinates and filtered echo keys if provided
        this.echoParserWorker.postMessage({
          type: "parseEcho",
          data: {
            echoCoords: coords,
            filteredEchoKeys: filteredEchoKeys,
          },
        });
      });
    },

    async matchSetRegionFirst(coords) {
      if (!this.echoParserWorker) {
        return null;
      }

      // Build all set image URLs map
      const allSetImageUrls = {};
      for (const [setKey, imageUrl] of Object.entries(echoSetImageMap)) {
        allSetImageUrls[setKey] = imageUrl;
      }

      return new Promise((resolve, reject) => {
        const handler = (e) => {
          if (e.data.type === "setMatch") {
            this.echoParserWorker.removeEventListener("message", handler);
            resolve(e.data.setMatch.setKey);
          } else if (e.data.type === "error") {
            this.echoParserWorker.removeEventListener("message", handler);
            console.error("Set match error:", e.data.error);
            resolve(null);
          }
        };

        this.echoParserWorker.addEventListener("message", handler);

        // Match against ALL sets first
        this.echoParserWorker.postMessage({
          type: "matchSetFirst",
          data: {
            setCoords: coords,
            allSetImageUrls,
          },
        });
      });
    },
    async matchSetRegion(coords, echoSets) {
      if (!this.echoParserWorker) {
        return null;
      }

      // Build set image URLs map
      const setImageUrls = {};
      for (const set of echoSets) {
        setImageUrls[set] = getEchoSetIconByType(set);
      }

      return new Promise((resolve, reject) => {
        const handler = (e) => {
          if (e.data.type === "setMatch") {
            this.echoParserWorker.removeEventListener("message", handler);
            resolve(e.data.setMatch.setKey);
          } else if (e.data.type === "error") {
            this.echoParserWorker.removeEventListener("message", handler);
            console.error("Set match error:", e.data.error);
            resolve(null);
          }
        };

        this.echoParserWorker.addEventListener("message", handler);

        // Just send coordinates, worker already has the source image
        this.echoParserWorker.postMessage({
          type: "matchSet",
          data: {
            setCoords: coords,
            possibleSets: echoSets,
            setImageUrls,
          },
        });
      });
    },
    // Removed loadImage as it's now handled in the worker
    convertCanvasToGrayscale(ctx, width, height) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Convert each pixel to grayscale using luminance formula
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Use standard luminance formula: 0.299*R + 0.587*G + 0.114*B
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = gray; // R
        data[i + 1] = gray; // G
        data[i + 2] = gray; // B
        // Alpha channel (data[i + 3]) remains unchanged
      }

      ctx.putImageData(imageData, 0, 0);
    },
    increaseContrast(ctx, width, height, factor = 1.5) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Increase contrast by pushing values away from midpoint (128)
      // Formula: newValue = ((value - 128) * factor) + 128
      for (let i = 0; i < data.length; i += 4) {
        // Apply to all RGB channels (they're all the same after grayscale conversion)
        const gray = data[i];
        const adjusted = Math.max(
          0,
          Math.min(255, (gray - 128) * factor + 128),
        );
        data[i] = adjusted; // R
        data[i + 1] = adjusted; // G
        data[i + 2] = adjusted; // B
        // Alpha channel (data[i + 3]) remains unchanged
      }

      ctx.putImageData(imageData, 0, 0);
    },
    onPaste(event) {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            this.handleImageFile(file);
            break;
          }
        }
      }
    },
  },
  computed: {
    echoCoordinates() {
      const spacingX = 374; // distance between Echoes horizontally
      const baseX = 64; // starting X position for Echo 1
      const baseY = 674; // base Y position stays the same for all

      const echoes = [];

      for (let i = 0; i < 5; i++) {
        const offsetX = i * spacingX;
        echoes.push({
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

      return echoes;
    },
    allBoxes() {
      return this.echoCoordinates.flatMap((echo) => [
        echo.cost,
        echo.echoImage,
        echo.mainStatLabel,
        echo.set,
        // echo.mainStatValue, // if you bring it back
        ...echo.substats,
      ]);
    },
    allCostEchoesImageMap() {
      const echoes = Object.values(mainEchoesData ?? {});
      const map = {};
      echoes.forEach((echo) => {
        map[echo.key] = echo.image;
      });
      return map;
    },
    allFourCostEchoes() {
      const echoes = Object.values(mainEchoesData ?? {}).filter(
        (echo) => echo.class === "Overlord" || echo.class === "Calamity",
      );
      return echoes;
    },
    allFourCostEchoesKeyImageMap() {
      const map = {};
      this.allFourCostEchoes.forEach((echo) => {
        map[echo.key] = echo.image;
      });
      return map;
    },
    allThreeCostEchoes() {
      const echoes = Object.values(mainEchoesData ?? {}).filter(
        (echo) => echo.class === "Elite",
      );
      return echoes;
    },
    allThreeCostEchoesKeyImageMap() {
      const map = {};
      this.allThreeCostEchoes.forEach((echo) => {
        map[echo.key] = echo.image;
      });
      return map;
    },
    allOneCostEchoes() {
      const echoes = Object.values(mainEchoesData ?? {}).filter(
        (echo) => echo.class === "Common",
      );
      return echoes;
    },
    allOneCostEchoesKeyImageMap() {
      const map = {};
      this.allOneCostEchoes.forEach((echo) => {
        map[echo.key] = echo.image;
      });
      return map;
    },
  },
  mounted() {
    const oneCostEchoImages = Object.values(this.allOneCostEchoesKeyImageMap);
    const threeCostEchoImages = Object.values(
      this.allThreeCostEchoesKeyImageMap,
    );
    const fourCostEchoImages = Object.values(this.allFourCostEchoesKeyImageMap);
    const echoImages = [
      ...oneCostEchoImages,
      ...threeCostEchoImages,
      ...fourCostEchoImages,
    ];
    echoImages.forEach((file) => {
      const img = new Image();
      img.src = file;
    });

    document.addEventListener("paste", this.onPaste);
  },
  beforeUnmount() {
    document.removeEventListener("paste", this.onPaste);
    if (this.echoParserWorker) {
      this.echoParserWorker.terminate();
      this.echoParserWorker = null;
    }
    // imageBitmap is transferred to worker, so it's detached and handled by worker cleanup
    this.imageBitmap = null;
  },
};
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
