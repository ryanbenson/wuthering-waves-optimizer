<template>
  <Nav cur-page="convene" :disable-mobile-nav="true"></Nav>
  <div class="page-convene w-full px-4 py-6 md:px-6 lg:px-10 text-base-content">
    <header class="mb-8 max-w-4xl">
      <h1 class="text-2xl md:text-3xl font-semibold mb-2">Convene odds</h1>
      <p class="text-base-content/80 text-sm md:text-base space-y-3">
        <span class="block">
          Estimate the chance of pulling enough promotional 5★ copies with your Astrite, Lunite
          (1:1 with Astrite in the shop), and wishes.
        </span>
        <span class="block">
          <strong class="text-base-content">Character</strong>
          (featured resonator): 50/50 on the rate-up 5★, with the next 5★ guaranteed rate-up if you
          miss. The 5★ pity curve below comes from a large-sample analysis of player convenes (not
          Kuro’s server code): ~1.848% of pulls are 5★ (~54.1 pulls expected to any 5★), ~81.15
          pulls expected to a featured 5★; published banner rates are ~1.8% for 5★ and ~12% for 4★.
        </span>
        <span class="block">
          <strong class="text-base-content">Weapon</strong>
          (featured weapon): same 5★ curve as other non-beginner banners; every 5★ is the
          promotional weapon (100%). Featured 4★ weapon rules are not modeled here.
        </span>
        <span class="block text-xs opacity-70">
          5★ curve: 0.8% flat pulls 1–65; +4% per pull 66–70; +8% per pull 71–75; +10% per pull
          76–78; 100% on pull 79 (counting from the last 5★). The 4★ floor after nine consecutive
          3★ pulls (counter resets on any 4★ or 5★) is omitted: 5★ is resolved first, so it does not
          change how many 5★s you get.
        </span>
      </p>
    </header>

    <div
      class="convene-layout grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[1fr_min(34rem,44vw)] xl:grid-cols-[1fr_min(36rem,38vw)] 2xl:grid-cols-[1fr_40rem] items-start">
      <div class="card bg-base-200 shadow-lg min-w-0">
        <div class="card-body gap-4">
          <h2 class="card-title text-lg">Your resources</h2>
          <label class="form-control w-full">
            <span class="label-text">Astrite</span>
            <input
              v-model.number="astrite"
              type="number"
              min="0"
              step="160"
              class="input input-bordered w-full"
              data-test-convene-astrite />
          </label>
          <label class="form-control w-full">
            <span class="label-text">Lunite (same value as Astrite for wishes)</span>
            <input
              v-model.number="lunite"
              type="number"
              min="0"
              step="160"
              class="input input-bordered w-full"
              data-test-convene-lunite />
          </label>
          <label class="form-control w-full">
            <span class="label-text">Wishes (in addition to Astrite + Lunite)</span>
            <input
              v-model.number="extraWishes"
              type="number"
              min="0"
              class="input input-bordered w-full"
              data-test-convene-wishes />
          </label>

          <div class="divider my-0">Days until you pull</div>
          <p class="text-xs opacity-70">
            Daily dailies grant {{ DAILY_ASTRITE_BASE }} Astrite; the Lunite subscription adds
            {{ DAILY_ASTRITE_SUBSCRIPTION_EXTRA }} Astrite/day on top of that ({{ dailyAstriteIfSubscribed }}/day
            total).
          </p>
          <label class="form-control w-full">
            <span class="label-text">Days until you wish on this banner</span>
            <input
              v-model.number="daysUntilPull"
              type="number"
              min="0"
              step="1"
              class="input input-bordered w-full"
              data-test-convene-days />
          </label>
          <label class="label cursor-pointer justify-start gap-3">
            <input v-model="dailiesLuniteSubscription" type="checkbox" class="checkbox" />
            <span class="label-text">Lunite subscription on dailies (+{{ DAILY_ASTRITE_SUBSCRIPTION_EXTRA }} Astrite/day)</span>
          </label>

          <div class="divider my-0">Weekly &amp; monthly Astrite</div>
          <p class="text-xs opacity-70">
            How many times you expect to clear this content before you pull (e.g. weeks or resets
            left on the banner). Reward amounts are fixed per run/period.
          </p>
          <label class="form-control w-full">
            <span class="label-text text-xs">
              Fantasies of the Thousand Gateways ({{ ASTRITE_FANTASIES_THOUSAND_GATEWAYS }} Astrite each)
            </span>
            <input
              v-model.number="runsFantasiesThousandGateways"
              type="number"
              min="0"
              step="1"
              class="input input-bordered input-sm w-full"
              data-test-convene-runs-fantasies />
          </label>
          <label class="form-control w-full">
            <span class="label-text text-xs">
              Tower of Adversity ({{ ASTRITE_TOWER_OF_ADVERSITY }} Astrite each)
            </span>
            <input
              v-model.number="runsTowerOfAdversity"
              type="number"
              min="0"
              step="1"
              class="input input-bordered input-sm w-full"
              data-test-convene-runs-tower />
          </label>
          <label class="form-control w-full">
            <span class="label-text text-xs">
              Whimpering Wastes ({{ ASTRITE_WHIMPERING_WASTES }} Astrite each)
            </span>
            <input
              v-model.number="runsWhimperingWastes"
              type="number"
              min="0"
              step="1"
              class="input input-bordered input-sm w-full"
              data-test-convene-runs-wastes />
          </label>

          <div class="divider my-0">Events &amp; other Astrite</div>
          <p class="text-xs opacity-70">
            Add any in-game events, mail, codes, or other Astrite you expect before you wish. Name
            is free-form; amount is added to your Astrite pool.
          </p>
          <div class="flex flex-col gap-2">
            <div
              v-for="(ev, evIdx) in eventAstriteRows"
              :key="ev.id"
              class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end p-3 rounded-lg bg-base-300/50">
              <label class="form-control flex-1 min-w-0">
                <span class="label-text text-xs">Event / source</span>
                <input
                  v-model="ev.name"
                  type="text"
                  class="input input-bordered input-sm w-full"
                  placeholder="e.g. Version livestream codes"
                  data-test-convene-event-name />
              </label>
              <label class="form-control w-full sm:w-36 shrink-0">
                <span class="label-text text-xs">Astrite</span>
                <input
                  v-model.number="ev.astrite"
                  type="number"
                  min="0"
                  step="1"
                  class="input input-bordered input-sm w-full"
                  data-test-convene-event-astrite />
              </label>
              <button
                type="button"
                class="btn btn-ghost btn-sm text-error sm:self-end shrink-0"
                @click="removeEventAstriteRow(evIdx)">
                Remove
              </button>
            </div>
            <button type="button" class="btn btn-outline btn-sm w-fit" @click="addEventAstriteRow">
              Add event row
            </button>
          </div>

          <div class="divider my-0">Planned Lunite top-ups</div>
          <p class="text-xs opacity-70">
            Add one row per bundle line. “Initial top-up” applies only to the
            <em>first</em> purchase in that row; further copies in the same row use normal totals.
            If you already used a tier’s bonus, leave the box unchecked (or use another row without
            bonus). Same tier can appear on multiple rows (e.g. 1× with bonus, 2× without).
          </p>
          <div class="flex flex-col gap-3">
            <div
              v-for="(row, idx) in topUpLines"
              :key="row.id"
              class="flex flex-col gap-3 p-3 rounded-lg bg-base-300/50">
              <div class="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                <label class="form-control flex-1 min-w-0">
                  <span class="label-text text-xs">Bundle</span>
                  <select v-model.number="row.tierIndex" class="select select-bordered select-sm w-full">
                    <option v-for="(t, ti) in LUNITE_TOPUP_TIERS" :key="ti" :value="ti">
                      ${{ t.priceUsd.toFixed(2) }} — {{ t.totalNormal }} / {{ t.totalFirstBonus }} Lunite
                    </option>
                  </select>
                </label>
                <label class="form-control w-full sm:w-28 shrink-0">
                  <span class="label-text text-xs">Qty</span>
                  <input
                    v-model.number="row.quantity"
                    type="number"
                    min="0"
                    step="1"
                    class="input input-bordered input-sm w-full" />
                </label>
                <button
                  type="button"
                  class="btn btn-ghost btn-sm text-error sm:self-end shrink-0"
                  @click="removeTopUpLine(idx)">
                  Remove
                </button>
              </div>
              <label class="label cursor-pointer justify-start gap-3 py-0 min-h-0">
                <input v-model="row.firstPurchaseBonus" type="checkbox" class="checkbox checkbox-sm mt-0.5 shrink-0" />
                <span class="label-text text-xs leading-snug whitespace-normal text-left">
                  First purchase in row uses initial top-up bonus
                </span>
              </label>
            </div>
            <button type="button" class="btn btn-outline btn-sm w-fit" @click="addTopUpLine">
              Add top-up row
            </button>
          </div>
          <p v-if="topUpLines.length > 0" class="text-xs opacity-80">
            Top-ups: <strong>{{ luniteFromTopUps }}</strong> Lunite,
            <strong>${{ topUpUsdTotal.toFixed(2) }}</strong> USD
          </p>

          <p class="text-sm opacity-80">
            Total wishes:
            <strong>{{ totalWishes }}</strong>
            <br />
            <span class="text-xs">
              Astrite for wishes: <strong>{{ totalAstriteForWishes }}</strong>
              ({{ astriteOnHand }} on hand + {{ astriteFromDailies }} from dailies over
              {{ daysUntilPullRounded }} day{{ daysUntilPullRounded === 1 ? "" : "s" }} at
              {{ dailyAstriteRate }}/day<template v-if="astriteFromStaticContent > 0">
                + {{ astriteFromStaticContent }} from Tower / Gateways / Wastes</template><template v-if="astriteFromCustomEvents > 0">
                + {{ astriteFromCustomEvents }} from events</template>)
              <br />
              Lunite for wishes: <strong>{{ totalLuniteForWishes }}</strong>
              ({{ luniteOnHand }} on hand + {{ luniteFromTopUps }} from top-ups)
              <br />
              → {{ wishesFromCurrency }} wishes at 160 Astrite+Lunite each, plus
              {{ extraWishes }} direct wishes
            </span>
          </p>

          <div class="divider my-0">Banner</div>
          <div class="btn-group w-full">
            <button
              type="button"
              class="btn flex-1"
              :class="mode === 'character' ? 'btn-active' : ''"
              @click="mode = 'character'">
              Character
            </button>
            <button
              type="button"
              class="btn flex-1"
              :class="mode === 'weapon' ? 'btn-active' : ''"
              @click="mode = 'weapon'">
              Weapon
            </button>
          </div>

          <label class="form-control w-full">
            <span class="label-text">
              {{ mode === "character" ? "Target resonance (copies)" : "Target refinement (copies)" }}
            </span>
            <select v-model.number="targetIndex" class="select select-bordered w-full">
              <option v-for="opt in targetOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </label>
          <p class="text-xs opacity-70">
            {{ mode === "character" ? "S0 is your first copy; S6 needs 7 featured pulls." : "R0 is your first copy; each refinement needs one more featured weapon." }}
          </p>

          <details class="collapse collapse-arrow bg-base-300 rounded-lg">
            <summary class="collapse-title font-medium text-sm">Advanced (optional)</summary>
            <div class="collapse-content flex flex-col gap-3 pt-2">
              <label class="form-control w-full">
                <span class="label-text">
                  {{
                    mode === "character"
                      ? "Already have this resonator (current resonance)"
                      : "Already have this weapon (current refinement)"
                  }}
                </span>
                <select v-model.number="currentOwnedIndex" class="select select-bordered w-full">
                  <option v-for="opt in currentOwnershipOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </label>
              <p v-if="additionalCopiesNeeded > 0" class="text-xs opacity-70">
                Need
                <strong>{{ additionalCopiesNeeded }}</strong>
                more promotional 5★ pull{{ additionalCopiesNeeded > 1 ? "s" : "" }} to reach
                {{ goalLabel }}.
              </p>
              <label class="form-control w-full">
                <span class="label-text">
                  5★ pity (pulls since last 5★, 0–{{ maxFiveStarPityInput }})
                </span>
                <input
                  v-model.number="startingPity"
                  type="number"
                  min="0"
                  :max="maxFiveStarPityInput"
                  class="input input-bordered w-full" />
              </label>
              <label v-if="mode === 'character'" class="label cursor-pointer justify-start gap-3">
                <input v-model="guaranteedNextFeatured" type="checkbox" class="checkbox" />
                <span class="label-text">Next 5★ is guaranteed featured (lost last 50/50)</span>
              </label>
            </div>
          </details>
        </div>
      </div>

      <aside
        class="card bg-base-200 shadow-lg min-w-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
        <div class="card-body gap-4 flex flex-col">
          <h2 class="card-title text-lg shrink-0">Results</h2>
          <div class="results-content shrink-0">
            <p
              v-if="additionalCopiesNeeded > 0 && totalWishes <= 0"
              class="text-warning">
              Add Astrite, Lunite, or wishes to simulate.
            </p>
            <template v-else-if="additionalCopiesNeeded <= 0">
              <p class="text-lg text-success">
                You already meet {{ goalLabel }} (or higher) with your current progress.
              </p>
              <p v-if="totalWishes > 0" class="text-sm opacity-80">
                Average promotional 5★
                {{ mode === "character" ? "resonators" : "weapons" }} in {{ totalWishes }} wishes:
                <strong>{{ result.meanFeatured.toFixed(2) }}</strong>
              </p>
              <p class="text-xs opacity-60">
                Based on {{ iterations.toLocaleString() }} simulated banners. Not official; RNG and
                banner details can differ.
              </p>
            </template>
            <template v-else>
              <p class="text-lg">
                Chance to reach your goal:
                <strong class="text-primary">{{ formatPct(result.targetMetRate) }}</strong>
              </p>
              <p class="text-sm opacity-80">
                Average promotional 5★
                {{ mode === "character" ? "resonators" : "weapons" }} in {{ totalWishes }} wishes:
                <strong>{{ result.meanFeatured.toFixed(2) }}</strong>
              </p>
              <p class="text-xs opacity-60">
                Based on {{ iterations.toLocaleString() }} simulated banners. Not official; RNG and
                banner details can differ.
              </p>
            </template>
          </div>

          <div class="divider my-0 shrink-0"></div>
          <h3 class="font-semibold text-base shrink-0">Chance for each milestone</h3>
          <p class="text-sm opacity-70 shrink-0">
            Probability of pulling <em>at least</em> that many <em>additional</em> promotional 5★
            copies within your wish budget (only 5★ pity is simulated).
          </p>
          <div
            v-if="totalWishes > 0 && result.stepProbabilities.length"
            class="convene-chart-wrap w-full flex-1 min-h-[280px] max-h-[min(52vh,520px)]">
            <canvas ref="chartCanvas" class="block w-full h-full"></canvas>
          </div>
          <p v-else class="text-sm opacity-50 italic py-8 text-center border border-dashed border-base-content/20 rounded-lg">
            Add wishes and a goal that still needs pulls to see the milestone chart here.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chart from "chart.js/auto";
import Nav from "../components/navigation/Nav.vue";
import {
  ASTRITE_PER_WISH,
  MAX_PULLS_SINCE_LAST_FIVE,
  runMonteCarlo,
  type ConveneMode,
  type ConveneSimulationResult,
} from "../convene/simulateConvene";
import {
  DAILY_ASTRITE_BASE,
  DAILY_ASTRITE_SUBSCRIPTION_EXTRA,
  LUNITE_TOPUP_TIERS,
  luniteFromTopUpLine,
  usdFromTopUpLine,
} from "../convene/luniteTopUps";
import {
  ASTRITE_FANTASIES_THOUSAND_GATEWAYS,
  ASTRITE_TOWER_OF_ADVERSITY,
  ASTRITE_WHIMPERING_WASTES,
  astriteFromStaticContentRuns,
} from "../convene/contentAstrite";

interface TopUpLineRow {
  id: number;
  tierIndex: number;
  quantity: number;
  firstPurchaseBonus: boolean;
}

interface EventAstriteRow {
  id: number;
  name: string;
  astrite: number;
}

const EMPTY_RESULT: ConveneSimulationResult = {
  targetMetRate: 0,
  meanFeatured: 0,
  stepProbabilities: [],
};

export default defineComponent({
  name: "ConveneView",
  components: { Nav },
  data() {
    return {
      astrite: 0,
      lunite: 0,
      extraWishes: 0,
      mode: "character" as ConveneMode,
      /** S0 => 0, S6 => 6 (copies = index + 1). -1 = no copy yet. */
      currentOwnedIndex: -1,
      /** S0 => 0, S6 => 6 (copies = index + 1) */
      targetIndex: 0,
      startingPity: 0,
      guaranteedNextFeatured: false,
      result: EMPTY_RESULT,
      iterations: 20_000,
      debounceId: null as ReturnType<typeof setTimeout> | null,
      maxFiveStarPityInput: MAX_PULLS_SINCE_LAST_FIVE,
      daysUntilPull: 0,
      dailiesLuniteSubscription: false,
      topUpLines: [] as TopUpLineRow[],
      nextTopUpLineId: 1,
      runsFantasiesThousandGateways: 0,
      runsTowerOfAdversity: 0,
      runsWhimperingWastes: 0,
      eventAstriteRows: [] as EventAstriteRow[],
      nextEventAstriteRowId: 1,
      DAILY_ASTRITE_BASE,
      DAILY_ASTRITE_SUBSCRIPTION_EXTRA,
      LUNITE_TOPUP_TIERS,
      ASTRITE_FANTASIES_THOUSAND_GATEWAYS,
      ASTRITE_TOWER_OF_ADVERSITY,
      ASTRITE_WHIMPERING_WASTES,
    };
  },
  computed: {
    daysUntilPullRounded(): number {
      return Math.max(0, Math.floor(Number(this.daysUntilPull) || 0));
    },
    dailyAstriteRate(): number {
      return (
        DAILY_ASTRITE_BASE +
        (this.dailiesLuniteSubscription ? DAILY_ASTRITE_SUBSCRIPTION_EXTRA : 0)
      );
    },
    dailyAstriteIfSubscribed(): number {
      return DAILY_ASTRITE_BASE + DAILY_ASTRITE_SUBSCRIPTION_EXTRA;
    },
    astriteOnHand(): number {
      return Math.max(0, Math.floor(Number(this.astrite) || 0));
    },
    luniteOnHand(): number {
      return Math.max(0, Math.floor(Number(this.lunite) || 0));
    },
    astriteFromDailies(): number {
      return this.daysUntilPullRounded * this.dailyAstriteRate;
    },
    astriteFromStaticContent(): number {
      return astriteFromStaticContentRuns(
        this.runsFantasiesThousandGateways,
        this.runsTowerOfAdversity,
        this.runsWhimperingWastes,
      );
    },
    astriteFromCustomEvents(): number {
      let sum = 0;
      for (const row of this.eventAstriteRows) {
        sum += Math.max(0, Math.floor(Number(row.astrite) || 0));
      }
      return sum;
    },
    totalAstriteForWishes(): number {
      return (
        this.astriteOnHand +
        this.astriteFromDailies +
        this.astriteFromStaticContent +
        this.astriteFromCustomEvents
      );
    },
    luniteFromTopUps(): number {
      let sum = 0;
      for (const row of this.topUpLines) {
        const ti = Math.min(
          LUNITE_TOPUP_TIERS.length - 1,
          Math.max(0, Math.floor(row.tierIndex)),
        );
        const tier = LUNITE_TOPUP_TIERS[ti];
        if (!tier) continue;
        sum += luniteFromTopUpLine(
          tier,
          row.quantity,
          row.firstPurchaseBonus,
        );
      }
      return sum;
    },
    topUpUsdTotal(): number {
      let sum = 0;
      for (const row of this.topUpLines) {
        const ti = Math.min(
          LUNITE_TOPUP_TIERS.length - 1,
          Math.max(0, Math.floor(row.tierIndex)),
        );
        const tier = LUNITE_TOPUP_TIERS[ti];
        if (!tier) continue;
        sum += usdFromTopUpLine(tier, row.quantity);
      }
      return sum;
    },
    totalLuniteForWishes(): number {
      return this.luniteOnHand + this.luniteFromTopUps;
    },
    wishesFromCurrency(): number {
      return Math.floor(
        (this.totalAstriteForWishes + this.totalLuniteForWishes) /
          ASTRITE_PER_WISH,
      );
    },
    totalWishes(): number {
      return (
        this.wishesFromCurrency + Math.max(0, Math.floor(Number(this.extraWishes) || 0))
      );
    },
    /** Promotional copies already owned (0 if you do not have the unit yet). */
    copiesOwnedBefore(): number {
      if (this.currentOwnedIndex < 0) return 0;
      return this.currentOwnedIndex + 1;
    },
    additionalCopiesNeeded(): number {
      const targetCopies = this.targetIndex + 1;
      return Math.max(0, targetCopies - this.copiesOwnedBefore);
    },
    goalLabel(): string {
      return this.mode === "character" ? `S${this.targetIndex}` : `R${this.targetIndex}`;
    },
    currentOwnershipOptions(): { value: number; label: string }[] {
      const out: { value: number; label: string }[] = [
        {
          value: -1,
          label:
            this.mode === "character"
              ? "No copy yet (0 promotional pulls on this resonator)"
              : "No copy yet (0 promotional pulls on this weapon)",
        },
      ];
      const max = this.mode === "character" ? 6 : 5;
      for (let i = 0; i <= max; i++) {
        if (this.mode === "character") {
          out.push({
            value: i,
            label: `S${i} (${i + 1} featured pull${i > 0 ? "s" : ""} so far)`,
          });
        } else {
          out.push({
            value: i,
            label: `R${i} (${i + 1} featured pull${i > 0 ? "s" : ""} so far)`,
          });
        }
      }
      return out;
    },
    targetOptions(): { value: number; label: string }[] {
      const n = this.mode === "character" ? 7 : 6;
      const out: { value: number; label: string }[] = [];
      for (let i = 0; i < n; i++) {
        if (this.mode === "character") {
          out.push({ value: i, label: `S${i} (${i + 1} featured pull${i > 0 ? "s" : ""})` });
        } else {
          out.push({ value: i, label: `R${i} (${i + 1} featured pull${i > 0 ? "s" : ""})` });
        }
      }
      return out;
    },
  },
  watch: {
    astrite: "scheduleSim",
    lunite: "scheduleSim",
    extraWishes: "scheduleSim",
    daysUntilPull: "scheduleSim",
    dailiesLuniteSubscription: "scheduleSim",
    topUpLines: {
      deep: true,
      handler: "scheduleSim",
    },
    runsFantasiesThousandGateways: "scheduleSim",
    runsTowerOfAdversity: "scheduleSim",
    runsWhimperingWastes: "scheduleSim",
    eventAstriteRows: {
      deep: true,
      handler: "scheduleSim",
    },
    mode() {
      if (this.targetIndex >= this.targetOptions.length) {
        this.targetIndex = Math.max(0, this.targetOptions.length - 1);
      }
      const maxOwned = this.mode === "character" ? 6 : 5;
      if (this.currentOwnedIndex > maxOwned) {
        this.currentOwnedIndex = maxOwned;
      }
      this.scheduleSim();
    },
    currentOwnedIndex: "scheduleSim",
    targetIndex: "scheduleSim",
    startingPity: "scheduleSim",
    guaranteedNextFeatured: "scheduleSim",
    result() {
      this.$nextTick(() => this.renderChart());
    },
  },
  mounted() {
    this.runSim();
  },
  beforeUnmount() {
    if (this.debounceId) clearTimeout(this.debounceId);
    this.destroyChart();
  },
  methods: {
    addTopUpLine() {
      this.topUpLines.push({
        id: this.nextTopUpLineId++,
        tierIndex: LUNITE_TOPUP_TIERS.length - 1,
        quantity: 1,
        firstPurchaseBonus: false,
      });
    },
    removeTopUpLine(index: number) {
      this.topUpLines.splice(index, 1);
    },
    addEventAstriteRow() {
      this.eventAstriteRows.push({
        id: this.nextEventAstriteRowId++,
        name: "",
        astrite: 0,
      });
    },
    removeEventAstriteRow(index: number) {
      this.eventAstriteRows.splice(index, 1);
    },
    formatPct(x: number): string {
      return `${(100 * x).toFixed(1)}%`;
    },
    scheduleSim() {
      if (this.debounceId) clearTimeout(this.debounceId);
      this.debounceId = setTimeout(() => {
        this.debounceId = null;
        this.runSim();
      }, 280);
    },
    runSim() {
      const pity = Math.min(
        MAX_PULLS_SINCE_LAST_FIVE,
        Math.max(0, Math.floor(Number(this.startingPity) || 0)),
      );
      const baseParams = {
        wishes: Math.max(0, this.totalWishes),
        mode: this.mode,
        startingPity: pity,
        guaranteedNextFeatured: this.mode === "character" && this.guaranteedNextFeatured,
        copiesOwnedBefore: this.copiesOwnedBefore,
      };

      if (this.additionalCopiesNeeded <= 0) {
        this.result = runMonteCarlo(
          { ...baseParams, maxCopies: 0 },
          this.iterations,
        );
        this.$nextTick(() => this.renderChart());
        return;
      }

      if (this.totalWishes <= 0) {
        this.result = EMPTY_RESULT;
        this.$nextTick(() => this.renderChart());
        return;
      }

      this.result = runMonteCarlo(
        { ...baseParams, maxCopies: this.additionalCopiesNeeded },
        this.iterations,
      );
    },
    destroyChart() {
      const canvas = this.$refs.chartCanvas as HTMLCanvasElement | undefined;
      if (canvas) {
        const existing = Chart.getChart(canvas);
        if (existing) existing.destroy();
      }
    },
    renderChart() {
      const canvas = this.$refs.chartCanvas as HTMLCanvasElement | undefined;
      if (!canvas || !this.result.stepProbabilities.length) {
        this.destroyChart();
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      this.destroyChart();

      const labels = this.result.stepProbabilities.map((s) => s.label);
      const values = this.result.stepProbabilities.map((s) => Math.round(s.probability * 1000) / 10);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Chance (%)",
              data: values,
              backgroundColor: "rgba(56, 189, 248, 0.55)",
              borderColor: "rgba(56, 189, 248, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: { display: true, text: "Probability (%)" },
            },
            x: {
              ticks: { maxRotation: 45, minRotation: 0 },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label(ctx) {
                  return ` ${ctx.parsed.y}%`;
                },
              },
            },
          },
        },
      });
    },
  },
});
</script>

<style scoped lang="scss">
.page-convene {
  padding-bottom: 3rem;
}

/* Fixed height so Chart.js (maintainAspectRatio: false) can size the canvas in the sidebar. */
.convene-chart-wrap {
  min-height: 280px;
  height: min(52vh, 520px);
}
</style>
