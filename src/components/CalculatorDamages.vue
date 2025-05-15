<template>
  <div class="card card-bordered card-compact shadow my-6 bg-primary">
    <div class="card-body text-white">
      All damages are total damage. If an attack hits multiple times, it will
      show the total damage. Hover over the damage to see it broken down per
      hit.
    </div>
  </div>
  <h4 class="damage__title">
    <span class="text-lg font-bold">
      {{ chosenChar.value?.basicAttacks?.name ?? "Basic Attacks" }}
    </span>
    <span class="damage__title__button" @click="toggleBasicDetails">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </h4>
  <div
    v-if="isBasicDetailsShown"
    class="card card-bordered card-compact shadow my-6 bg-base-100">
    <div
      class="card-body"
      v-html="chosenChar.value?.basicAttacks?.description"></div>
  </div>
  <table class="calculator__damages table table-zebra">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <CalculatorDamage
        v-for="damageInstance in allDamages?.value?.basicAttacks"
        :key="damageInstance.key"
        :character="character"
        :type="damageInstance.type"
        :label="damageInstance.label"
        :damage="damageInstance.damage"
        :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
    </tbody>
  </table>
  <h4 class="damage__title pt-8">
    <span class="text-lg font-bold">
      {{ chosenChar.value?.skillAttacks?.name ?? "Skill Attacks" }}
    </span>
    <span class="damage__title__button" @click="toggleSkillDetails">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </h4>
  <div
    v-if="isSkillDetailsShown"
    class="card card-bordered card-compact shadow my-6 bg-base-100">
    <div
      class="card-body"
      v-html="chosenChar.value?.skillAttacks?.description"></div>
  </div>
  <table class="calculator__damages table table-zebra table-sm">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <CalculatorDamage
        v-for="damageInstance in allDamages?.value?.skillAttacks"
        :key="damageInstance.key"
        :character="character"
        :type="damageInstance.type"
        :label="damageInstance.label"
        :damage="damageInstance.damage"
        :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
    </tbody>
  </table>
  <h4 class="damage__title pt-8">
    <span class="text-lg font-bold">
      {{ chosenChar.value?.liberationAttacks?.name ?? "Liberation Attacks" }}
    </span>
    <span class="damage__title__button" @click="toggleLiberationDetails">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </h4>
  <div
    v-if="isLiberationDetailsShown"
    class="card card-bordered card-compact shadow my-6 bg-base-100">
    <div
      class="card-body"
      v-html="chosenChar.value?.liberationAttacks?.description"></div>
  </div>
  <table class="calculator__damages table table-zebra table-sm">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <CalculatorDamage
        v-for="damageInstance in allDamages?.value?.liberationAttacks"
        :key="damageInstance.key"
        :character="character"
        :type="damageInstance.type"
        :label="damageInstance.label"
        :damage="damageInstance.damage"
        :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
    </tbody>
  </table>
  <h4 class="damage__title pt-8">
    <span class="text-lg font-bold">
      {{
        chosenChar.value?.forteCircuitAttacks?.name ?? "Forte Circuit Attacks"
      }}
    </span>
    <span class="damage__title__button" @click="toggleForteCircuitDetails">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </h4>
  <div
    v-if="isForteCircuitDetailsShown"
    class="card card-bordered card-compact shadow my-6 bg-base-100">
    <div
      class="card-body"
      v-html="chosenChar.value?.forteCircuitAttacks?.description"></div>
  </div>
  <table class="calculator__damages table table-zebra table-sm">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <CalculatorDamage
        v-for="damageInstance in allDamages?.value?.forteCircuitAttacks"
        :key="damageInstance.key"
        :character="character"
        :type="damageInstance.type"
        :label="damageInstance.label"
        :damage="damageInstance.damage"
        :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
    </tbody>
  </table>
  <h4 class="damage__title pt-8">
    <span class="text-lg font-bold">
      {{ chosenChar.value?.introAttacks?.name ?? "Intro Attacks" }}
    </span>
    <span class="damage__title__button" @click="toggleIntroDetails">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </h4>
  <div
    v-if="isIntroDetailsShown"
    class="card card-bordered card-compact shadow my-6 bg-base-100">
    <div
      class="card-body"
      v-html="chosenChar.value?.introAttacks?.description"></div>
  </div>
  <table class="calculator__damages table table-zebra table-sm">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <CalculatorDamage
        v-for="damageInstance in allDamages?.value?.introAttacks"
        :key="damageInstance.key"
        :character="character"
        :type="damageInstance.type"
        :label="damageInstance.label"
        :damage="damageInstance.damage"
        :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
    </tbody>
  </table>

  <h4 class="damage__title pt-8">
    <span class="text-lg font-bold">
      {{ chosenChar.value?.outroAttacks?.name ?? "Outro Attacks" }}
    </span>
    <span class="damage__title__button" @click="toggleOutroDetails">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </h4>
  <div
    v-if="isOutroDetailsShown"
    class="card card-bordered card-compact shadow my-6 bg-base-100">
    <div
      class="card-body"
      v-html="chosenChar.value?.outroAttacks?.description"></div>
  </div>
  <table class="calculator__damages table table-zebra table-sm">
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th class="w-20">Normal</th>
        <th class="w-20">Average</th>
        <th class="w-20">Crit</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="!allDamages?.value?.outroAttacks?.length">
        <tr>
          <td>N/A</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </template>
      <template v-else>
        <CalculatorDamage
          v-for="damageInstance in allDamages?.value?.outroAttacks"
          :key="damageInstance.key"
          :character="character"
          :type="damageInstance.type"
          :label="damageInstance.label"
          :damage="damageInstance.damage"
          :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
      </template>
    </tbody>
  </table>

  <template v-if="allDamages?.value?.echoSetAttacks?.length">
    <h4 class="damage__title pt-8">
      <span class="text-lg font-bold">
        {{ chosenChar.value?.echoSetAttacks?.name ?? "Echo Set Attacks" }}
      </span>
      <span
        v-if="false"
        class="damage__title__button"
        @click="toggleOutroDetails">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
            fill="#FFFFFF" />
        </svg>
      </span>
    </h4>
    <div
      v-if="false"
      class="card card-bordered card-compact shadow my-6 bg-base-100">
      <div
        class="card-body"
        v-html="chosenChar.value?.outroAttacks?.description"></div>
    </div>
    <table class="calculator__damages table table-zebra table-sm">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th class="w-20">Normal</th>
          <th class="w-20">Average</th>
          <th class="w-20">Crit</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="!allDamages?.value?.echoSetAttacks?.length">
          <tr>
            <td>N/A</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </template>
        <template v-else>
          <CalculatorDamage
            v-for="damageInstance in allDamages?.value?.echoSetAttacks"
            :key="damageInstance.key"
            :character="character"
            :type="damageInstance.type"
            :label="damageInstance.label"
            :damage="damageInstance.damage"
            :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
        </template>
      </tbody>
    </table>
  </template>

  <template v-if="allDamages?.value?.utilityAttacks?.length">
    <h4 class="damage__title pt-8">
      <span class="text-lg font-bold">
        {{ chosenChar.value?.utilityAttacks?.name ?? "Utility Attacks" }}
      </span>
      <span
        v-if="false"
        class="damage__title__button"
        @click="toggleOutroDetails">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
            fill="#FFFFFF" />
        </svg>
      </span>
    </h4>
    <div
      v-if="false"
      class="card card-bordered card-compact shadow my-6 bg-base-100">
      <div
        class="card-body"
        v-html="chosenChar.value?.utilityAttacks?.description"></div>
    </div>
    <table class="calculator__damages table table-zebra table-sm">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th class="w-20">Normal</th>
          <th class="w-20">Average</th>
          <th class="w-20">Crit</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="!allDamages?.value?.utilityAttacks?.length">
          <tr>
            <td>N/A</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </template>
        <template v-else>
          <CalculatorDamage
            v-for="damageInstance in allDamages?.value?.utilityAttacks"
            :key="damageInstance.key"
            :character="character"
            :type="damageInstance.type"
            :label="damageInstance.label"
            :damage="damageInstance.damage"
            :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
        </template>
      </tbody>
    </table>
  </template>

  <template
    v-if="
      allDamages?.value?.elementalReactions?.length || isMissingSpectroData
    ">
    <h4 class="damage__title pt-8">
      <span class="text-lg font-bold">Elemental Effects</span>
      <span
        v-if="false"
        class="damage__title__button"
        @click="toggleOutroDetails">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path
            d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
            fill="#FFFFFF" />
        </svg>
      </span>
    </h4>
    <div
      v-if="false"
      class="card card-bordered card-compact shadow my-6 bg-base-100">
      <div
        class="card-body"
        v-html="chosenChar.value?.elementalReactions?.description"></div>
    </div>
    <div
      v-if="isMissingSpectroData"
      class="card card-bordered card-compact shadow my-6 bg-primary">
      <div class="card-body text-white">
        We do not have Spectro Frazzle data for this character level. Join the
        Discord and help us fill out this data!
      </div>
    </div>
    <table
      v-if="!isMissingSpectroData"
      class="calculator__damages table table-zebra table-sm">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th class="w-20">Normal</th>
          <th class="w-20">Average</th>
          <th class="w-20">Crit</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="!allDamages?.value?.elementalReactions?.length">
          <tr>
            <td>N/A</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </template>
        <template v-else>
          <CalculatorDamage
            v-for="damageInstance in allDamages?.value?.elementalReactions"
            :key="damageInstance.key"
            :character="character"
            :type="damageInstance.type"
            :label="damageInstance.label"
            :damage="damageInstance.damage"
            :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
        </template>
      </tbody>
    </table>
  </template>

  <h4 class="damage__title pt-8">
    <span class="text-lg font-bold">{{ echoName ?? "Echo" }} Attacks</span>
    <span class="damage__title__button" @click="toggleEchoDetails">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"
          fill="#FFFFFF" />
      </svg>
    </span>
  </h4>
  <div
    v-if="isEchoDetailsShown"
    class="card card-bordered card-compact shadow my-6 bg-base-100">
    <div class="card-body" v-html="echoDetails"></div>
  </div>
  <template v-if="!allDamages?.value?.echoAttacks?.length">
    <div class="calculation__damage__item calculation__damage__item--fill">
      {{ charName }} does not have an echo with actions.
    </div>
  </template>
  <template v-else>
    <table class="calculator__damages table table-zebra table-sm">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th class="w-20">Normal</th>
          <th class="w-20">Average</th>
          <th class="w-20">Crit</th>
        </tr>
      </thead>
      <tbody>
        <CalculatorDamage
          v-for="damageInstance in allDamages?.value?.echoAttacks"
          :key="damageInstance.key"
          :character="character"
          :type="damageInstance.type"
          :label="damageInstance.label"
          :damage="damageInstance.damage"
          :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
      </tbody>
    </table>
  </template>

  <template v-if="rotationsList.length && allDamages.value?.rotations">
    <div
      v-for="rotation in allDamages.value.rotations"
      class="rotation__item pt-8"
      :key="rotation.id"
      :data-test-damages-list-rotation="rotation.name">
      <h3 class="text-2xl font-bold" v-tooltip="rotation.description">
        {{ rotation.name }}
      </h3>
      <h4 class="text">
        <span class="font-bold">Total DMG</span> Normal: {{ displayDamage(rotation.damageAggregation.normalDamage) }} / Average: {{ displayDamage(rotation.damageAggregation.avgDamage) }} / Crit: {{ displayDamage(rotation.damageAggregation.critDamage) }}
      </h4>
      <h4 v-if="rotation.damageAggregation.healing" class="text calculation__damage__item--healing">
        <span class="font-bold">Total Healing</span> {{ displayDamage(rotation.damageAggregation.healing) }}
      </h4>
      <h4 v-if="rotation.damageAggregation.shield" class="text calculation__damage__item--shield">
        <span class="font-bold">Total Shield</span> {{ displayDamage(rotation.damageAggregation.shield) }}
      </h4>

      <template v-if="!rotation.attacks?.length">
        <div class="calculation__damage__item">No attacks in this rotation</div>
      </template>
      <template v-else>
        <CalculatorDamageChart
          :key="rotation.id"
          :character="character"
          :rotation="rotation"
          :unique-key="rotation.id"
          :name="rotation.name"
          :char-buffs-data="charBuffsData"
          :char-resonance-chains-data="charResonanceChainsData" />
        <table class="calculator__damages table table-zebra table-sm">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th class="w-20">Normal</th>
              <th class="w-20">Average</th>
              <th class="w-20">Crit</th>
            </tr>
          </thead>
          <tbody>
            <CalculatorDamage
              v-for="damageInstance in rotation.attacks"
              :key="damageInstance.key"
              :character="character"
              :type="damageInstance.type"
              :label="damageInstance.label"
              :damage="damageInstance.damage"
              :is-enabled="damageInstance.isEnabled"
              :original-is-enabled="damageInstance.originalIsEnabled"
              :always-crit="damageInstance.alwaysCrit"></CalculatorDamage>
          </tbody>
          <tfoot>
            <tr
              v-if="rotation.damageAggregation.normalDamage"
              class="rotation-total-damage">
              <td>Total Damage</td>
              <td>
                {{ displayDamage(rotation.damageAggregation.normalDamage) }}
              </td>
              <td>{{ displayDamage(rotation.damageAggregation.avgDamage) }}</td>
              <td>
                {{ displayDamage(rotation.damageAggregation.critDamage) }}
              </td>
            </tr>
            <tr
              v-if="rotation.damageAggregation.healing"
              class="calculation__damage__item--healing">
              <td>Total Healing</td>
              <td>{{ displayDamage(rotation.damageAggregation.healing) }}</td>
              <td></td>
              <td></td>
            </tr>
            <tr
              v-if="rotation.damageAggregation.shield"
              class="calculation__damage__item--shield">
              <td>Total Shield</td>
              <td>{{ displayDamage(rotation.damageAggregation.shield) }}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </template>
    </div>
  </template>
</template>

<script>
import { displayDamage } from "../utils/numbers";
import { getEchoData } from "../echoes";
import CalculatorDamage from "./CalculatorDamage.vue";
import CalculatorDamageChart from "./CalculatorDamageChart.vue";
export default {
  props: {
    character: {
      type: String,
      required: true,
    },
    allDamages: {
      type: Object,
      required: true,
    },
    rotationsList: {
      type: Array,
      required: true,
    },
    chosenChar: {
      type: Object,
      required: true,
    },
    chosenEchoName: {
      type: String,
      default: null,
    },
    isMissingSpectroData: {
      type: Boolean,
      default: false,
    },
    charBuffsData: {
      type: Object,
      required: true,
    },
    charResonanceChainsData: {
      type: Object,
      required: true,
    },
  },
  components: {
    CalculatorDamage,
    CalculatorDamageChart,
  },
  data() {
    return {
      isBasicDetailsShown: false,
      isSkillDetailsShown: false,
      isLiberationDetailsShown: false,
      isForteCircuitDetailsShown: false,
      isIntroDetailsShown: false,
      isOutroDetailsShown: false,
      isEchoDetailsShown: false,
    };
  },
  methods: {
    displayDamage,
    toggleBasicDetails() {
      this.isBasicDetailsShown = !this.isBasicDetailsShown;
    },
    toggleSkillDetails() {
      this.isSkillDetailsShown = !this.isSkillDetailsShown;
    },
    toggleLiberationDetails() {
      this.isLiberationDetailsShown = !this.isLiberationDetailsShown;
    },
    toggleForteCircuitDetails() {
      this.isForteCircuitDetailsShown = !this.isForteCircuitDetailsShown;
    },
    toggleIntroDetails() {
      this.isIntroDetailsShown = !this.isIntroDetailsShown;
    },
    toggleOutroDetails() {
      this.isOutroDetailsShown = !this.isOutroDetailsShown;
    },
    toggleEchoDetails() {
      this.isEchoDetailsShown = !this.isEchoDetailsShown;
    },
  },
  computed: {
    echoData() {
      if (!this.chosenEchoName) {
        return null;
      }
      return getEchoData(this.chosenEchoName);
    },
    echoName() {
      if (!this.chosenEchoName) {
        return null;
      }
      return this.echoData?.name ?? null;
    },
    echoDetails() {
      if (!this.chosenEchoName) {
        return null;
      }
      return this.echoData?.details ?? null;
    },
    charName() {
      if (!this.chosenChar) {
        return null;
      }
      return this.chosenChar?.value?.basic?.name ?? null;
    },
  },
};
</script>

<style lang="scss" scoped>
.calculation__damage__item--healing {
  color: #3bea3b;
}
.calculation__damage__item--shield {
  color: #00adff;
}
.damage__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .damage__title__button {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    cursor: pointer;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
}
html[data-theme="light"] {
  .calculation__damage__item--healing {
    color: #13a813;
  }
  .calculation__damage__item--shield {
    color: #4a92ff;
  }
}
</style>

<style lang="scss">
.skilldescription {
  .Title {
    font-weight: bold;
  }
}

.calculator__damages {
  td {
    padding: 0.5rem;
    font-size: 16px;
  }
}
</style>
