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
    <h2 class="text-xl font-bold">Upload image from the wuwa discord bot</h2>
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
    </ul>
    <div class="flex items-center flex-start gap-4">
      <input
        type="file"
        @change="onFileChange"
        ref="fileUpload"
        accept="image/*"
        class="file-input file-input-sm file-input-primary" />
      <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
    </div>
    <div v-if="echoes.length">
      <h3>Parsed Echoes:</h3>
      <pre>{{ JSON.stringify(echoes, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { createWorker } from "tesseract.js";
import { mainEchoesData, getEchoData } from "../echoes/index";
import { getEchoSetIconByType } from "../echoes/stats";

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
      worker: null,
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const img = new Image();
      img.onload = async () => {
        this.isLoading = true;
        console.time("Parse");
        this.imageElement = img;
        this.imageSrc = img.src;
        this.worker = await createWorker("eng");
        let whitelist =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.%+ ";
        await this.worker.setParameters({
          tessedit_char_whitelist: whitelist, // your whitelist
          tessedit_pageseg_mode: 7, // PSM 7: Treat the image as a single text line
        });
        this.echoes = await this.parseEchoes();
        console.timeEnd("Parse");
        this.isLoading = true;
        this.worker.terminate();
        this.worker = null;
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
      this.$refs.fileUpload.value = null;
    },

    sendToParent() {
      this.$emit("echoes-parsed", this.echoes);
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

        // get the echo reference
        const matchedEcho = await this.matchEchoRegion(echo.echoImage, cost);
        let set = null;
        if (matchedEcho) {
          const echoData = getEchoData(matchedEcho);
          const echoSets = echoData.sets ?? [];
          if (echoSets.length === 1) {
            set = echoSets[0];
          } else {
            set = await this.matchSetRegion(echo.set, echoSets);
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
      return this.worker.recognize(canvas.toDataURL()).then((result) => {
        const text = result.data.text.trim();
        return text;
      });
    },
    extractImageRegion(coords) {
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
      return canvas; // 👈 return the canvas here
    },
    compareImages(ctxA, ctxB, width = 192, height = 182) {
      const dataA = ctxA.getImageData(0, 0, width, height).data;
      const dataB = ctxB.getImageData(0, 0, width, height).data;

      let diff = 0;
      for (let i = 0; i < dataA.length; i += 4) {
        const rDiff = dataA[i] - dataB[i];
        const gDiff = dataA[i + 1] - dataB[i + 1];
        const bDiff = dataA[i + 2] - dataB[i + 2];
        diff += rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
      }

      return diff;
    },
    imageToCanvasCtx(img, width = 192, height = 182) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      return ctx;
    },
    async matchEchoRegion(coords, cost) {
      const regionCanvas = await this.extractImageRegion(coords);
      const regionCtx = regionCanvas.getContext("2d");

      let bestMatch = null;
      let lowestDiff = Infinity;
      let images = [];
      if (Number(cost) === 4) {
        images = this.allFourCostEchoesKeyImageMap;
      } else if (Number(cost) === 3) {
        images = this.allThreeCostEchoesKeyImageMap;
      } else if (Number(cost) === 1) {
        images = this.allOneCostEchoesKeyImageMap;
      } else {
        images = this.allCostEchoesImageMap;
      }
      for (const [name, iconImgUrl] of Object.entries(images)) {
        // convert the icon/avatar into a canvas context
        const iconImgObj = await this.loadImage(iconImgUrl);
        const iconCtx = this.imageToCanvasCtx(iconImgObj);
        const diff = this.compareImages(regionCtx, iconCtx);
        if (diff < lowestDiff) {
          lowestDiff = diff;
          bestMatch = name;
        }
      }

      return bestMatch;
    },
    async matchSetRegion(coords, echoSets) {
      const regionCanvas = await this.extractImageRegion(coords);
      const regionCtx = regionCanvas.getContext("2d");
      // need to resize the echo set extracted icon to 32 to compare
      const resizedCanvas = document.createElement("canvas");
      resizedCanvas.width = 32;
      resizedCanvas.height = 32;
      const resizedCtx = resizedCanvas.getContext("2d");
      resizedCtx.drawImage(regionCanvas, 0, 0, 32, 32);

      let bestMatch = null;
      let lowestDiff = Infinity;
      let images = [];
      for (const set of echoSets) {
        const setImageSrc = getEchoSetIconByType(set);
        // convert the icon/avatar into a canvas context
        const iconImgObj = await this.loadImage(setImageSrc);
        const iconCtx = this.imageToCanvasCtx(iconImgObj, 32, 32);
        const diff = this.compareImages(resizedCtx, iconCtx, 32, 32);
        if (diff < lowestDiff) {
          lowestDiff = diff;
          bestMatch = set;
        }
      }

      return bestMatch;
    },
    async loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // needed if loading from other domains'
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });
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
