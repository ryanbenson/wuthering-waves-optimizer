<template>
  <div class="custom__buffs">
    <div class="actions mb-4">
      <button
        class="btn btn-primary"
        @click="handleResetCustomBuffs"
        data-test-custom-buff-reset-btn>
        Reset Custom Buffs
      </button>
    </div>
    <div class="custom__buffs-list w-max">
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
            ATK %
          </span>
        </div>
        <input
          type="number"
          v-model="ATK"
          name="ATK"
          id="ATK"
          class="input input-md input-bordered"
          data-test-custom-buff-atk />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />
            Flat ATK
          </span>
        </div>
        <input
          type="number"
          v-model="ATK_FLAT"
          name="ATK_FLAT"
          id="ATK_FLAT"
          class="input input-md input-bordered"
          data-test-custom-buff-atk-flat />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
            HP %
          </span>
        </div>
        <input
          type="number"
          v-model="HP"
          name="HP"
          id="HP"
          class="input input-md input-bordered"
          data-test-custom-buff-hp />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />
            Flat HP
          </span>
        </div>
        <input
          type="number"
          v-model="HP_FLAT"
          name="HP_FLAT"
          id="HP_FLAT"
          class="input input-md input-bordered"
          data-test-custom-buff-hp-flat />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
            DEF %
          </span>
        </div>
        <input
          type="number"
          v-model="DEF"
          name="DEF"
          id="DEF"
          class="input input-md input-bordered"
          data-test-custom-buff-def />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />
            Flat DEF
          </span>
        </div>
        <input
          type="number"
          v-model="DEF_FLAT"
          name="DEF_FLAT"
          id="DEF_FLAT"
          class="input input-md input-bordered"
          data-test-custom-buff-def-flat />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />
            Crit Rate
          </span>
        </div>
        <input
          type="number"
          v-model="CritRate"
          name="CritRate"
          id="CritRate"
          class="input input-md input-bordered"
          data-test-custom-buff-crit-rate />
      </label>

      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />
            Crit DMG
          </span>
        </div>
        <input
          type="number"
          v-model="CritDMG"
          name="CritDMG"
          id="CritDMG"
          class="input input-md input-bordered"
          data-test-custom-buff-crit-dmg />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />
            Energy Regen
          </span>
        </div>
        <input
          type="number"
          v-model="EnergyRegen"
          name="EnergyRegen"
          id="EnergyRegen"
          class="input input-md input-bordered"
          data-test-custom-buff-energy-regen />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />
            Basic Attack DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="BasicAttackDMGBonus"
          name="BasicAttackDMGBonus"
          id="BasicAttackDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-basic />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />
            Heavy Attack DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="HeavyAttackDMGBonus"
          name="HeavyAttackDMGBonus"
          id="HeavyAttackDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-heavy />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />
            Resonance Skill DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="ResonanceSkillDMGBonus"
          name="ResonanceSkillDMGBonus"
          id="ResonanceSkillDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-skill />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />
            Resonance Liberation DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="ResonanceLiberationDMGBonus"
          name="ResonanceLiberationDMGBonus"
          id="ResonanceLiberationDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-liberation />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
              class="glacio--active" />
            Glacio DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Glacio"
          name="Glacio"
          id="Glacio"
          class="input input-md input-bordered"
          data-test-custom-buff-glacio />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
              class="fusion--active" />
            Fusion DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Fusion"
          name="Fusion"
          id="Fusion"
          class="input input-md input-bordered"
          data-test-custom-buff-fusion />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
              class="electro--active" />
            Electro DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Electro"
          name="Electro"
          id="Electro"
          class="input input-md input-bordered"
          data-test-custom-buff-electro />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
              class="aero--active" />
            Aero DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Aero"
          name="Aero"
          id="Aero"
          class="input input-md input-bordered"
          data-test-custom-buff-aero />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
              class="spectro--active" />
            Spectro DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Spectro"
          name="Spectro"
          id="Spectro"
          class="input input-md input-bordered"
          data-test-custom-buff-spectro />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
              class="havoc--active" />
            Havoc DMG Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="Havoc"
          name="Havoc"
          id="Havoc"
          class="input input-md input-bordered"
          data-test-custom-buff-havoc />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            <img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />
            Healing Bonus
          </span>
        </div>
        <input
          type="number"
          v-model="HealingBonus"
          name="HealingBonus"
          id="HealingBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-healing />
      </label>
      <label class="form-control mb-4">
        <div class="label">Coordinated DMG Bonus</div>
        <input
          type="number"
          v-model="CoordinatedDMGBonus"
          name="CoordinatedDMGBonus"
          id="CoordinatedDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-coordinated />
      </label>
      <label class="form-control mb-4">
        <div class="label">Echo DMG Bonus</div>
        <input
          type="number"
          v-model="EchoDMGBonus"
          name="EchoDMGBonus"
          id="EchoDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-echo />
      </label>
      <label class="form-control mb-4">
        <div class="label">Tune Break DMG Bonus</div>
        <input
          type="number"
          v-model="TuneBreakDMGBonus"
          name="TuneBreakDMGBonus"
          id="TuneBreakDMGBonus"
          class="input input-md input-bordered"
          data-test-custom-buff-tune-break />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            DMG Amplify
          </span>
        </div>
        <input
          type="number"
          v-model="DamageAmplify"
          name="DamageAmplify"
          id="DamageAmplify"
          class="input input-md input-bordered"
          data-test-custom-buff-amplify />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            Resist Shred
          </span>
        </div>
        <input
          type="number"
          v-model="ResistShred"
          name="ResistShred"
          id="ResistShred"
          class="input input-md input-bordered"
          data-test-custom-buff-resist-shred />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            DEF Ignore
          </span>
        </div>
        <input
          type="number"
          v-model="DefIgnore"
          name="DefIgnore"
          id="DefIgnore"
          class="input input-md input-bordered"
          data-test-custom-buff-def-ignore />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            DEF Reduction
          </span>
        </div>
        <input
          type="number"
          v-model="DefReduction"
          name="DefReduction"
          id="DefReduction"
          class="input input-md input-bordered"
          data-test-custom-buff-def-reduction />
      </label>
      <label class="form-control mb-4">
        <div class="label">
          <span class="label-text mr-2 flex items-center gap-1">
            Special Multiplier (Vulnerability)
          </span>
        </div>
        <input
          type="number"
          v-model="SpecialMultiplier"
          name="specialMultiplier"
          id="specialMultiplier"
          class="input input-md input-bordered"
          data-test-custom-buff-special-multiplier />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WritableComputedRef } from "vue";
import { computed, watch } from "vue";
import { useCharacterStore } from "../stores/character";

type CustomBuffKey =
  | "ATK"
  | "ATK_FLAT"
  | "HP"
  | "HP_FLAT"
  | "DEF"
  | "DEF_FLAT"
  | "CritRate"
  | "CritDMG"
  | "EnergyRegen"
  | "BasicAttackDMGBonus"
  | "HeavyAttackDMGBonus"
  | "ResonanceSkillDMGBonus"
  | "ResonanceLiberationDMGBonus"
  | "EchoDMGBonus"
  | "Glacio"
  | "Fusion"
  | "Electro"
  | "Aero"
  | "Spectro"
  | "Havoc"
  | "HealingBonus"
  | "DamageAmplify"
  | "ResistShred"
  | "DefIgnore"
  | "DefReduction"
  | "CoordinatedDMGBonus"
  | "TuneBreakDMGBonus"
  | "SpecialMultiplier";

interface StoreCharacterSlice {
  customBuffs?: Partial<Record<CustomBuffKey, number>>;
}

interface ProcessedCustomBuffs {
  ATK: number;
  ATK_FLAT: number;
  HP: number;
  HP_FLAT: number;
  DEF: number;
  DEF_FLAT: number;
  CritRate: number;
  CritDMG: number;
  EnergyRegen: number;
  BasicAttackDMGBonus: number;
  HeavyAttackDMGBonus: number;
  ResonanceSkillDMGBonus: number;
  ResonanceLiberationDMGBonus: number;
  EchoDMGBonus: number;
  Glacio: number;
  Fusion: number;
  Electro: number;
  Aero: number;
  Spectro: number;
  Havoc: number;
  HealingBonus: number;
  DamageAmplify: number;
  ResistShred: number;
  DefIgnore: number;
  DefReduction: number;
  CoordinatedDMGBonus: number;
  TuneBreakDMGBonus: number;
  SpecialMultiplier: number;
}

interface Props {
  character: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "custom-buffs-updated": [data: ProcessedCustomBuffs];
}>();

const characterStore = useCharacterStore();

const currentCharacter = computed((): StoreCharacterSlice => {
  const raw = characterStore.characters[props.character];
  return (raw as StoreCharacterSlice | undefined) ?? {};
});

function makeCustomBuffField(key: CustomBuffKey): WritableComputedRef<number> {
  return computed({
    get(): number {
      return currentCharacter.value.customBuffs?.[key] ?? 0;
    },
    async set(value: number) {
      await characterStore.setCharacterData(props.character, {
        customBuffs: { [key]: value },
      });
    },
  });
}

const ATK = makeCustomBuffField("ATK");
const ATK_FLAT = makeCustomBuffField("ATK_FLAT");
const HP = makeCustomBuffField("HP");
const HP_FLAT = makeCustomBuffField("HP_FLAT");
const DEF = makeCustomBuffField("DEF");
const DEF_FLAT = makeCustomBuffField("DEF_FLAT");
const CritRate = makeCustomBuffField("CritRate");
const CritDMG = makeCustomBuffField("CritDMG");
const EnergyRegen = makeCustomBuffField("EnergyRegen");
const BasicAttackDMGBonus = makeCustomBuffField("BasicAttackDMGBonus");
const HeavyAttackDMGBonus = makeCustomBuffField("HeavyAttackDMGBonus");
const ResonanceSkillDMGBonus = makeCustomBuffField("ResonanceSkillDMGBonus");
const ResonanceLiberationDMGBonus = makeCustomBuffField(
  "ResonanceLiberationDMGBonus",
);
const EchoDMGBonus = makeCustomBuffField("EchoDMGBonus");
const Glacio = makeCustomBuffField("Glacio");
const Fusion = makeCustomBuffField("Fusion");
const Electro = makeCustomBuffField("Electro");
const Aero = makeCustomBuffField("Aero");
const Spectro = makeCustomBuffField("Spectro");
const Havoc = makeCustomBuffField("Havoc");
const HealingBonus = makeCustomBuffField("HealingBonus");
const DamageAmplify = makeCustomBuffField("DamageAmplify");
const ResistShred = makeCustomBuffField("ResistShred");
const DefIgnore = makeCustomBuffField("DefIgnore");
const DefReduction = makeCustomBuffField("DefReduction");
const CoordinatedDMGBonus = makeCustomBuffField("CoordinatedDMGBonus");
const TuneBreakDMGBonus = makeCustomBuffField("TuneBreakDMGBonus");
const SpecialMultiplier = makeCustomBuffField("SpecialMultiplier");

const customBuffFieldRefs: WritableComputedRef<number>[] = [
  ATK,
  ATK_FLAT,
  HP,
  HP_FLAT,
  DEF,
  DEF_FLAT,
  CritRate,
  CritDMG,
  EnergyRegen,
  BasicAttackDMGBonus,
  HeavyAttackDMGBonus,
  ResonanceSkillDMGBonus,
  ResonanceLiberationDMGBonus,
  EchoDMGBonus,
  Glacio,
  Fusion,
  Electro,
  Aero,
  Spectro,
  Havoc,
  HealingBonus,
  DamageAmplify,
  ResistShred,
  DefIgnore,
  DefReduction,
  CoordinatedDMGBonus,
  TuneBreakDMGBonus,
  SpecialMultiplier,
];

const buffsData = computed((): ProcessedCustomBuffs => {
  const ATK_ = ATK.value ? ATK.value / 100 : 0;
  const HP_ = HP.value ? HP.value / 100 : 0;
  const DEF_ = DEF.value ? DEF.value / 100 : 0;
  const ATK_FLAT_ = ATK_FLAT.value ? ATK_FLAT.value : 0;
  const HP_FLAT_ = HP_FLAT.value ? HP_FLAT.value : 0;
  const DEF_FLAT_ = DEF_FLAT.value ? DEF_FLAT.value : 0;
  const CritRate_ = CritRate.value ? CritRate.value / 100 : 0;
  const CritDMG_ = CritDMG.value ? CritDMG.value / 100 : 0;
  const EnergyRegen_ = EnergyRegen.value ? EnergyRegen.value / 100 : 0;
  const BasicAttackDMGBonus_ = BasicAttackDMGBonus.value
    ? BasicAttackDMGBonus.value / 100
    : 0;
  const HeavyAttackDMGBonus_ = HeavyAttackDMGBonus.value
    ? HeavyAttackDMGBonus.value / 100
    : 0;
  const ResonanceSkillDMGBonus_ = ResonanceSkillDMGBonus.value
    ? ResonanceSkillDMGBonus.value / 100
    : 0;
  const ResonanceLiberationDMGBonus_ = ResonanceLiberationDMGBonus.value
    ? ResonanceLiberationDMGBonus.value / 100
    : 0;
  const EchoDMGBonus_ = EchoDMGBonus.value ? EchoDMGBonus.value / 100 : 0;
  const Glacio_ = Glacio.value ? Glacio.value / 100 : 0;
  const Fusion_ = Fusion.value ? Fusion.value / 100 : 0;
  const Electro_ = Electro.value ? Electro.value / 100 : 0;
  const Aero_ = Aero.value ? Aero.value / 100 : 0;
  const Spectro_ = Spectro.value ? Spectro.value / 100 : 0;
  const Havoc_ = Havoc.value ? Havoc.value / 100 : 0;
  const HealingBonus_ = HealingBonus.value ? HealingBonus.value / 100 : 0;
  const DamageAmplify_ = DamageAmplify.value ? DamageAmplify.value / 100 : 0;
  const ResistShred_ = ResistShred.value ? ResistShred.value / 100 : 0;
  const DefIgnore_ = DefIgnore.value ? DefIgnore.value / 100 : 0;
  const DefReduction_ = DefReduction.value ? DefReduction.value / 100 : 0;
  const CoordinatedDMGBonus_ = CoordinatedDMGBonus.value
    ? CoordinatedDMGBonus.value / 100
    : 0;
  const TuneBreakDMGBonus_ = TuneBreakDMGBonus.value
    ? TuneBreakDMGBonus.value / 100
    : 0;
  const SpecialMultiplier_ = SpecialMultiplier.value
    ? SpecialMultiplier.value / 100
    : 0;
  return {
    ATK: ATK_,
    ATK_FLAT: ATK_FLAT_,
    HP: HP_,
    HP_FLAT: HP_FLAT_,
    DEF: DEF_,
    DEF_FLAT: DEF_FLAT_,
    CritRate: CritRate_,
    CritDMG: CritDMG_,
    EnergyRegen: EnergyRegen_,
    BasicAttackDMGBonus: BasicAttackDMGBonus_,
    HeavyAttackDMGBonus: HeavyAttackDMGBonus_,
    ResonanceSkillDMGBonus: ResonanceSkillDMGBonus_,
    ResonanceLiberationDMGBonus: ResonanceLiberationDMGBonus_,
    EchoDMGBonus: EchoDMGBonus_,
    Glacio: Glacio_,
    Fusion: Fusion_,
    Electro: Electro_,
    Aero: Aero_,
    Spectro: Spectro_,
    Havoc: Havoc_,
    HealingBonus: HealingBonus_,
    DamageAmplify: DamageAmplify_,
    ResistShred: ResistShred_,
    DefIgnore: DefIgnore_,
    DefReduction: DefReduction_,
    CoordinatedDMGBonus: CoordinatedDMGBonus_,
    TuneBreakDMGBonus: TuneBreakDMGBonus_,
    SpecialMultiplier: SpecialMultiplier_,
  };
});

function updatedStats() {
  const data = JSON.parse(
    JSON.stringify(buffsData.value),
  ) as ProcessedCustomBuffs;
  emit("custom-buffs-updated", data);
}

watch(
  buffsData,
  () => {
    updatedStats();
  },
  { immediate: true },
);

function handleResetCustomBuffs() {
  for (const field of customBuffFieldRefs) {
    field.value = 0;
  }
}
</script>

<style lang="scss" scoped>
html[data-theme="light"] {
  img {
    filter: contrast(0);
  }
}
</style>
