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
    <h2>Upload image from the wuwa discord bot</h2>
    <input
      type="file"
      @change="onFileChange"
      accept="image/*"
      class="file-input file-input-sm file-input-primary" />
    <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
    <div v-if="echoes.length">
      <h3>Parsed Echoes:</h3>
      <pre>{{ JSON.stringify(echoes, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { createWorker } from "tesseract.js";
import { mainEchoesData } from "../echoes/index";

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
        border: "2px dashed red",
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
        console.log(matchedEcho);

        results.push({ cost, mainStatLabel: mainStatLabel.trim(), substats, echo: matchedEcho });
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
    coords.height
  );
  return canvas; // 👈 return the canvas here
},
compareImages(ctxA, ctxB) {
  const width = 192;
  const height = 182;

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
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
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
      } else if(Number(cost) === 3) {
        images = this.allThreeCostEchoesKeyImageMap;
      } else {
        images = this.allOneCostEchoesKeyImageMap;
      }
      // console.log(images, cost);
      for (const [name, iconImgUrl] of Object.entries(images)) {
        // console.log(name ,iconImgUrl); 
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
    async loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // needed if loading from other domains'
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });
    }
  },
  computed: {
    // echoCoordinates() {
    //   // ✏️ Replace these with real coordinates
    //   return [
    //     {
    //       cost: { x: 313, y: 655, width: 61, height: 61 },
    //       mainStatLabel: { x: 211, y: 720, width: 173, height: 40 },
    //       // mainStatValue: { x: 0, y: 30, width: 100, height: 30 }, // we infer the value from the cost and main stat type
    //       substats: [
    //         { x: 64, y: 880, width: 320, height: 38 },
    //         { x: 64, y: 918, width: 320, height: 38 },
    //         { x: 64, y: 952, width: 320, height: 38 },
    //         { x: 64, y: 986, width: 320, height: 38 },
    //         { x: 64, y: 1021, width: 320, height: 38 },
    //       ],
    //     },
    //     // ⬇ Repeat for Echo 2–5
    //   ];
    // },
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
            { x: 64 + offsetX, y: 1020, width: 320, height: 38 },
          ],
          echoImage: { x: 22 + offsetX, y: 650, width: 192, height: 182 },
        });
      }

      return echoes;
    },
    allBoxes() {
      return this.echoCoordinates.flatMap((echo) => [
        echo.cost,
        echo.echoImage,
        echo.mainStatLabel,
        // echo.mainStatValue, // if you bring it back
        ...echo.substats,
      ]);
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
    const threeCostEchoImages = Object.values(this.allThreeCostEchoesKeyImageMap);
    const fourCostEchoImages = Object.values(this.allFourCostEchoesKeyImageMap);
    const echoImages = [...oneCostEchoImages, ...threeCostEchoImages, ...fourCostEchoImages];
    echoImages.forEach((file) => {
      const img = new Image();
      img.src = file;
    });
  }
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
