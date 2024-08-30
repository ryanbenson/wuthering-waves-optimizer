<template>
  <div class="calculations">
    <div class="calcations__nav">
      <ul>
        <li @click="changeScreen('character')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_002.png"
            class="icon"
            alt="Your Character" />
        </li>
        <li @click="changeScreen('weapon')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/T_IconAchv_014.png"
            class="icon"
            alt="Your Weapon" />
        </li>
        <li @click="changeScreen('echoes')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/echoes.png"
            class="icon"
            alt="Your Echoes" />
        </li>
        <li @click="changeScreen('constellations')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/constellations.png"
            class="icon"
            alt="Your Resonance Chains" />
        </li>
        <li @click="changeScreen('party')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/team.png"
            class="icon"
            alt="Team Buffs" />
        </li>
        <li @click="changeScreen('enemy')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/enemy.png"
            class="icon"
            alt="Your Enemy" />
        </li>
        <li class="calculations__nav--results" @click="changeScreen('results')">
          <img
            src="https://ryanbenson.github.io/wuthering-waves-assets/images/damages.png"
            class="icon"
            alt="Results" />
        </li>
      </ul>
    </div>
    <div class="calculations__screens">
      <div class="screen--character" v-show="curScreen === 'character'">
        <div>
          <div class="alert">Youhu is now available. ❄️</div>
          <div class="character__selection">
            <div
              class="character__selection__avatar"
              :style="{
                backgroundImage: `url(https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png)`,
              }"></div>
            <div class="character__selection__form">
              <div class="character__selection__form--character">
                <select name="character" v-model="character">
                  <optgroup label="5 Star">
                    <option
                      v-for="char in charactersList.five"
                      :key="char.key"
                      :value="char.key">
                      {{ char.name }}
                    </option>
                  </optgroup>
                  <optgroup label="4 Star">
                    <option
                      v-for="char in charactersList.four"
                      :key="char.key"
                      :value="char.key">
                      {{ char.name }}
                    </option>
                  </optgroup>
                </select>
                <label for="character">Character</label>
              </div>
              <CalculatorCharacterLevel
                :character="character"
                @character-level-updated="
                  handleCharacterLevelUpdated
                "></CalculatorCharacterLevel>
            </div>
          </div>
          <CalculatorTalents
            :character="character"
            :key="character"
            @character-talent-updated="
              handleCharacterTalentUpdated
            "></CalculatorTalents>
          <template v-if="chosenChar?.value?.buffs && isLoading === false">
            <CalculatorCharacterBuffs
              :key="character"
              :character="character"
              :buffs="chosenChar?.value?.buffs"
              :talent-data="characters?.[character]?.talents"
              @updated-character-buffs="
                handleUpdatedCharacterBuffs
              "></CalculatorCharacterBuffs>
          </template>
        </div>
      </div>

      <div class="screen--character" v-show="curScreen === 'weapon'">
        <CalculatorWeapons
          v-if="character"
          :key="character"
          :character="character"
          @update-weapon="handleWeaponUpdated"
          :weapon-type="weaponType"></CalculatorWeapons>
      </div>

      <div class="screen--character" v-show="curScreen === 'echoes'">
        <CalculatorEchoes
          :key="character"
          :character="character"
          @update-stats="updateStatsEchoes"></CalculatorEchoes>
      </div>

      <div class="screen--character" v-show="curScreen === 'constellations'">
        <template
          v-if="chosenChar?.value?.resonanceChains && isLoading === false">
          <CalculatorResonanceChains
            :key="character"
            :character="character"
            :buffs="chosenChar?.value?.resonanceChains"
            :talent-data="characters?.[character]?.talents"
            @updated-character-resonance-chains="
              handleUpdatedCharacterResonanceChains
            "></CalculatorResonanceChains>
        </template>
      </div>

      <div class="screen-character" v-show="curScreen === 'party'">
        <CalculatorPartyBuffs
          :character="character"
          @updated-team-buffs="handleUpdatedTeamBuffs"></CalculatorPartyBuffs>
      </div>
      <div class="screen--enemy" v-show="curScreen === 'enemy'">
        <CalculatorEnemy
          :character="character"
          @updated-enemy-data="handleUpdatedEnemy"></CalculatorEnemy>
      </div>
      <div class="screen--results" v-show="curScreen === 'results'">
        <div class="results__stats">
          <h2 class="mt-0">Stats</h2>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />Attack</span
            >
            <span>{{ totalAtk }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />HP</span
            >
            <span>{{ totalHp }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />Defense</span
            >
            <span>{{ totalDef }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />Crit
              Rate</span
            >
            <span>{{ displayPercentage(totalCritRate * 100) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />Crit
              DMG</span
            >
            <span>{{ displayPercentage(totalCritDMG * 100) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />Energy
              Regen</span
            >
            <span>{{ displayPercentage(energyRegen * 100) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />Basic
              Attack DMG Bonus</span
            >
            <span>{{ displayPercentage(BasicAttackDMGBonus) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />Heavy
              Attack DMG Bonus</span
            >
            <span>{{ displayPercentage(HeavyAttackDMGBonus) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />Resonance
              Skill DMG Bonus</span
            >
            <span>{{ displayPercentage(ResonanceSkillDMGBonus) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />Resonance
              Liberation DMG Bonus</span
            >
            <span>{{ displayPercentage(ResonanceLiberationDMGBonus) }}</span>
          </div>
          <div v-if="false">
            <span>Intro Skill DMG Bonus</span>
            <span>{{ displayPercentage(IntroSkillDMGBonus) }}</span>
          </div>
          <div v-if="false">
            <span>Outro Skill DMG Bonus</span>
            <span>{{ displayPercentage(OutroSkillDMGBonus) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
                class="glacio--active" />Glacio DMG Bonus</span
            >
            <span>{{ displayPercentage(Glacio) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
                class="fusion--active" />Fusion DMG Bonus</span
            >
            <span>{{ displayPercentage(Fusion) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
                class="electro--active" />Electro DMG Bonus</span
            >
            <span>{{ displayPercentage(Electro) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
                class="aero--active" />Aero DMG Bonus</span
            >
            <span>{{ displayPercentage(Aero) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
                class="spectro--active" />Spectro DMG Bonus</span
            >
            <span>{{ displayPercentage(Spectro) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
                class="havoc--active" />Havoc DMG Bonus</span
            >
            <span>{{ displayPercentage(Havoc) }}</span>
          </div>
          <div>
            <span
              ><img
                src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />Healing
              Bonus</span
            >
            <span>{{ displayPercentage(healingBonus * 100) }}</span>
          </div>
          <div v-if="false">
            <span>Defense Ignore</span>
            <span>{{ displayPercentage(DefIgnore * 100) }}</span>
          </div>
          <div v-if="false">
            <span>Total Deepen Effect</span>
            <span>{{ displayPercentage(TotalDeepenEffect * 100) }}</span>
          </div>
          <div v-if="false">
            <span>Resist Reduction</span>
            <span>{{ displayPercentage(ResistReduction) }}</span>
          </div>
        </div>
        <h2>Damage</h2>
        <div class="calculation__damage__item">
          <span>Name</span>
          <span>Normal</span>
          <span>Average</span>
          <span>Crit</span>
        </div>
        <h4>{{ chosenChar.value?.basicAttacks?.name ?? "Basic Attacks" }}</h4>
        <div
          v-for="damageInstance in allDamages?.value?.basicAttacks"
          :key="damageInstance.key"
          class="calculation__damage__item"
          :class="{
            'calculation__damage__item--healing':
              damageInstance.type === 'Healing',
            'calculation__damage__item--shield':
              damageInstance.type === 'Shield',
          }">
          <template v-if="damageInstance.type === 'Healing'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.healAmount) }}</span
            >
          </template>
          <template v-else-if="damageInstance.type === 'Shield'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
            >
          </template>
          <template v-else>
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationAvg,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationCrit,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.critDamage) }}</span
            >
          </template>
        </div>
        <h4>{{ chosenChar.value?.skillAttacks?.name ?? "Skill Attacks" }}</h4>
        <div
          v-for="damageInstance in allDamages?.value?.skillAttacks"
          :key="damageInstance.key"
          class="calculation__damage__item"
          :class="{
            'calculation__damage__item--healing':
              damageInstance.type === 'Healing',
            'calculation__damage__item--shield':
              damageInstance.type === 'Shield',
          }">
          <template v-if="damageInstance.type === 'Healing'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.healAmount) }}</span
            >
          </template>
          <template v-else-if="damageInstance.type === 'Shield'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
            >
          </template>
          <template v-else>
            <span>{{ damageInstance.label }} </span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationAvg,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationCrit,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.critDamage) }}</span
            >
          </template>
        </div>
        <h4>
          {{
            chosenChar.value?.liberationAttacks?.name ?? "Liberation Attacks"
          }}
        </h4>
        <div
          v-for="damageInstance in allDamages?.value?.liberationAttacks"
          :key="damageInstance.key"
          class="calculation__damage__item"
          :class="{
            'calculation__damage__item--healing':
              damageInstance.type === 'Healing',
            'calculation__damage__item--shield':
              damageInstance.type === 'Shield',
          }">
          <template v-if="damageInstance.type === 'Healing'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.healAmount) }}</span
            >
          </template>
          <template v-else-if="damageInstance.type === 'Shield'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
            >
          </template>
          <template v-else>
            <span>{{ damageInstance.label }} </span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationAvg,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationCrit,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.critDamage) }}</span
            >
          </template>
        </div>
        <h4>
          {{
            chosenChar.value?.forteCircuitAttacks?.name ??
            "Forte Circuit Attacks"
          }}
        </h4>
        <div
          v-for="damageInstance in allDamages?.value?.forteCircuitAttacks"
          :key="damageInstance.key"
          class="calculation__damage__item"
          :class="{
            'calculation__damage__item--healing':
              damageInstance.type === 'Healing',
            'calculation__damage__item--shield':
              damageInstance.type === 'Shield',
          }">
          <template v-if="damageInstance.type === 'Healing'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.healAmount) }}</span
            >
          </template>
          <template v-else-if="damageInstance.type === 'Shield'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
            >
          </template>
          <template v-else>
            <span>{{ damageInstance.label }} </span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationAvg,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationCrit,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.critDamage) }}</span
            >
          </template>
        </div>
        <h4>{{ chosenChar.value?.introAttacks?.name ?? "Intro Attacks" }}</h4>
        <div
          v-for="damageInstance in allDamages?.value?.introAttacks"
          :key="damageInstance.key"
          class="calculation__damage__item"
          :class="{
            'calculation__damage__item--healing':
              damageInstance.type === 'Healing',
            'calculation__damage__item--shield':
              damageInstance.type === 'Shield',
          }">
          <template v-if="damageInstance.type === 'Healing'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.healAmount) }}</span
            >
          </template>
          <template v-else-if="damageInstance.type === 'Shield'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
            >
          </template>
          <template v-else>
            <span>{{ damageInstance.label }} </span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationAvg,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationCrit,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.critDamage) }}</span
            >
          </template>
        </div>
        <h4>{{ chosenChar.value?.outroAttacks?.name ?? "Outro Attacks" }}</h4>
        <template v-if="!allDamages?.value?.outroAttacks.length">
          <div
            class="calculation__damage__item calculation__damage__item--fill">
            {{ character }} does not have outro attacks.
          </div>
        </template>
        <template v-else>
          <div
            v-for="damageInstance in allDamages?.value?.outroAttacks"
            :key="damageInstance.key"
            class="calculation__damage__item"
            :class="{
              'calculation__damage__item--healing':
                damageInstance.type === 'Healing',
              'calculation__damage__item--shield':
                damageInstance.type === 'Shield',
            }">
            <template v-if="damageInstance.type === 'Healing'">
              <span>{{ damageInstance.label }}</span>
              <span
                v-tooltip="{
                  content: damageInstance.damage.detailedCalculation,
                  html: true,
                }"
                >{{ displayDamage(damageInstance.damage.healAmount) }}</span
              >
            </template>
            <template v-else-if="damageInstance.type === 'Shield'">
              <span>{{ damageInstance.label }}</span>
              <span
                v-tooltip="{
                  content: damageInstance.damage.detailedCalculation,
                  html: true,
                }"
                >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
              >
            </template>
            <template v-else>
              <span>{{ damageInstance.label }} </span>
              <span
                v-tooltip="{
                  content: damageInstance.damage.detailedCalculation,
                  html: true,
                }"
                >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
              >
              <span
                v-tooltip="{
                  content: damageInstance.damage.detailedCalculationAvg,
                  html: true,
                }"
                >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
              >
              <span
                v-tooltip="{
                  content: damageInstance.damage.detailedCalculationCrit,
                  html: true,
                }"
                >{{ displayDamage(damageInstance.damage.critDamage) }}</span
              >
            </template>
          </div>
        </template>
      </div>
    </div>
    <div class="results">
      <div class="results__stats">
        <h2 class="mt-0">Stats</h2>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/atk.png" />Attack</span
          >
          <span>{{ totalAtk }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/hp.png" />HP</span
          >
          <span>{{ totalHp }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/def.png" />Defense</span
          >
          <span>{{ totalDef }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critrate.png" />Crit
            Rate</span
          >
          <span>{{ displayPercentage(totalCritRate * 100) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/critdamage.png" />Crit
            DMG</span
          >
          <span>{{ displayPercentage(totalCritDMG * 100) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/energyregen.png" />Energy
            Regen</span
          >
          <span>{{ displayPercentage(energyRegen * 100) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/basicatkdmgbonus.png" />Basic
            Attack DMG Bonus</span
          >
          <span>{{ displayPercentage(BasicAttackDMGBonus) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/heavyatkdmgbonus.png" />Heavy
            Attack DMG Bonus</span
          >
          <span>{{ displayPercentage(HeavyAttackDMGBonus) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/skilldmgbonus.png" />Resonance
            Skill DMG Bonus</span
          >
          <span>{{ displayPercentage(ResonanceSkillDMGBonus) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/liberationdmgbonus.png" />Resonance
            Liberation DMG Bonus</span
          >
          <span>{{ displayPercentage(ResonanceLiberationDMGBonus) }}</span>
        </div>
        <div v-if="false">
          <span>Intro Skill DMG Bonus</span>
          <span>{{ displayPercentage(IntroSkillDMGBonus) }}</span>
        </div>
        <div v-if="false">
          <span>Outro Skill DMG Bonus</span>
          <span>{{ displayPercentage(OutroSkillDMGBonus) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/glaciodmgbonus.png"
              class="glacio--active" />Glacio DMG Bonus</span
          >
          <span>{{ displayPercentage(Glacio) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/fusiondmgbonus.png"
              class="fusion--active" />Fusion DMG Bonus</span
          >
          <span>{{ displayPercentage(Fusion) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/electrodmgbonus.png"
              class="electro--active" />Electro DMG Bonus</span
          >
          <span>{{ displayPercentage(Electro) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/aerodmgbonus.png"
              class="aero--active" />Aero DMG Bonus</span
          >
          <span>{{ displayPercentage(Aero) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/spectrodmgbonus.png"
              class="spectro--active" />Spectro DMG Bonus</span
          >
          <span>{{ displayPercentage(Spectro) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/havocdmgbonus.png"
              class="havoc--active" />Havoc DMG Bonus</span
          >
          <span>{{ displayPercentage(Havoc) }}</span>
        </div>
        <div>
          <span
            ><img
              src="https://ryanbenson.github.io/wuthering-waves-assets/images/healingbonus.png" />Healing
            Bonus</span
          >
          <span>{{ displayPercentage(healingBonus * 100) }}</span>
        </div>
        <div v-if="false">
          <span>Defense Ignore</span>
          <span>{{ displayPercentage(DefIgnore * 100) }}</span>
        </div>
        <div v-if="false">
          <span>Total Deepen Effect</span>
          <span>{{ displayPercentage(TotalDeepenEffect * 100) }}</span>
        </div>
        <div v-if="false">
          <span>Resist Reduction</span>
          <span>{{ displayPercentage(ResistReduction) }}</span>
        </div>
      </div>
      <h2>Damage</h2>
      <div class="panel mb-1">
        All damages are total damage. If an attack hits multiple times, it will
        show the total damage. Hover over the damage to see it broken down per
        hit.
      </div>
      <div class="calculation__damage__item">
        <span>Name</span>
        <span>Normal</span>
        <span>Average</span>
        <span>Crit</span>
      </div>
      <h4>{{ chosenChar.value?.basicAttacks?.name ?? "Basic Attacks" }}</h4>
      <div
        v-for="damageInstance in allDamages?.value?.basicAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item"
        :class="{
          'calculation__damage__item--healing':
            damageInstance.type === 'Healing',
          'calculation__damage__item--shield': damageInstance.type === 'Shield',
        }">
        <template v-if="damageInstance.type === 'Healing'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.healAmount) }}</span
          >
        </template>
        <template v-else-if="damageInstance.type === 'Shield'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
          >
        </template>
        <template v-else>
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationAvg,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationCrit,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.critDamage) }}</span
          >
        </template>
      </div>
      <h4>{{ chosenChar.value?.skillAttacks?.name ?? "Skill Attacks" }}</h4>
      <div
        v-for="damageInstance in allDamages?.value?.skillAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item"
        :class="{
          'calculation__damage__item--healing':
            damageInstance.type === 'Healing',
          'calculation__damage__item--shield': damageInstance.type === 'Shield',
        }">
        <template v-if="damageInstance.type === 'Healing'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.healAmount) }}</span
          >
        </template>
        <template v-else-if="damageInstance.type === 'Shield'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
          >
        </template>
        <template v-else>
          <span>{{ damageInstance.label }} </span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationAvg,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationCrit,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.critDamage) }}</span
          >
        </template>
      </div>
      <h4>
        {{ chosenChar.value?.liberationAttacks?.name ?? "Liberation Attacks" }}
      </h4>
      <div
        v-for="damageInstance in allDamages?.value?.liberationAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item"
        :class="{
          'calculation__damage__item--healing':
            damageInstance.type === 'Healing',
          'calculation__damage__item--shield': damageInstance.type === 'Shield',
        }">
        <template v-if="damageInstance.type === 'Healing'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.healAmount) }}</span
          >
        </template>
        <template v-else-if="damageInstance.type === 'Shield'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
          >
        </template>
        <template v-else>
          <span>{{ damageInstance.label }} </span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationAvg,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationCrit,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.critDamage) }}</span
          >
        </template>
      </div>
      <h4>
        {{
          chosenChar.value?.forteCircuitAttacks?.name ?? "Forte Circuit Attacks"
        }}
      </h4>
      <div
        v-for="damageInstance in allDamages?.value?.forteCircuitAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item"
        :class="{
          'calculation__damage__item--healing':
            damageInstance.type === 'Healing',
          'calculation__damage__item--shield': damageInstance.type === 'Shield',
        }">
        <template v-if="damageInstance.type === 'Healing'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.healAmount) }}</span
          >
        </template>
        <template v-else-if="damageInstance.type === 'Shield'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
          >
        </template>
        <template v-else>
          <span>{{ damageInstance.label }} </span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationAvg,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationCrit,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.critDamage) }}</span
          >
        </template>
      </div>
      <h4>{{ chosenChar.value?.introAttacks?.name ?? "Intro Attacks" }}</h4>
      <div
        v-for="damageInstance in allDamages?.value?.introAttacks"
        :key="damageInstance.key"
        class="calculation__damage__item"
        :class="{
          'calculation__damage__item--healing':
            damageInstance.type === 'Healing',
          'calculation__damage__item--shield': damageInstance.type === 'Shield',
        }">
        <template v-if="damageInstance.type === 'Healing'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.healAmount) }}</span
          >
        </template>
        <template v-else-if="damageInstance.type === 'Shield'">
          <span>{{ damageInstance.label }}</span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
          >
        </template>
        <template v-else>
          <span>{{ damageInstance.label }} </span>
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculation,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationAvg,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
          >
          <span
            v-tooltip="{
              content: damageInstance.damage.detailedCalculationCrit,
              html: true,
            }"
            >{{ displayDamage(damageInstance.damage.critDamage) }}</span
          >
        </template>
      </div>
      <h4>{{ chosenChar.value?.outroAttacks?.name ?? "Outro Attacks" }}</h4>
      <template v-if="!allDamages?.value?.outroAttacks.length">
        <div class="calculation__damage__item">
          {{ character }} does not have outro attacks.
        </div>
      </template>
      <template v-else>
        <div
          v-for="damageInstance in allDamages?.value?.outroAttacks"
          :key="damageInstance.key"
          class="calculation__damage__item"
          :class="{
            'calculation__damage__item--healing':
              damageInstance.type === 'Healing',
            'calculation__damage__item--shield':
              damageInstance.type === 'Shield',
          }">
          <template v-if="damageInstance.type === 'Healing'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.healAmount) }}</span
            >
          </template>
          <template v-else-if="damageInstance.type === 'Shield'">
            <span>{{ damageInstance.label }}</span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.shieldAmount) }}</span
            >
          </template>
          <template v-else>
            <span>{{ damageInstance.label }} </span>
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculation,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.totalDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationAvg,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.avgDamage) }}</span
            >
            <span
              v-tooltip="{
                content: damageInstance.damage.detailedCalculationCrit,
                html: true,
              }"
              >{{ displayDamage(damageInstance.damage.critDamage) }}</span
            >
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { calcDamage, calcHeal, calcShield } from "../calculator/calculator";
import {
  getCharactersAvailable,
  getCharByName,
} from "../characters/characters";
import CalculatorEchoes from "./CalculatorEchoes.vue";
import CalculatorWeapons from "./CalculatorWeapons.vue";
import CalculatorCharacterBuffs from "./CalculatorCharacterBuffs.vue";
import CalculatorResonanceChains from "./CalculatorResonanceChains.vue";
import CalculatorPartyBuffs from "./CalculatorPartyBuffs.vue";
import CalculatorTalents from "./CalculatorTalents.vue";
import CalculatorCharacterLevel from "./CalculatorCharacterLevel.vue";
import CalculatorEnemy from "./CalculatorEnemy.vue";
import { mainEchoesData } from "../echoes";
import { allEchoBuffs } from "../buffs";
import { useCharacterStore } from "../stores/character";

const decimalFormatter = new Intl.NumberFormat("en", {
  style: "decimal",
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  // disabling for now. it's rounding oddly (1.8% is showing as 1.7%)
  // TODO: More testing for this
  // roundingMode: "floor",
});

export default defineComponent({
  name: "Calculator",
  components: {
    CalculatorEchoes,
    CalculatorEnemy,
    CalculatorWeapons,
    CalculatorCharacterBuffs,
    CalculatorCharacterLevel,
    CalculatorPartyBuffs,
    CalculatorResonanceChains,
    CalculatorTalents,
  },
  setup() {
    const characterStore = useCharacterStore();
    const { characters, activeCharacter } = storeToRefs(characterStore);
    const weaponData = reactive({});
    const charBuffsData = reactive({});
    const teamBuffsData = reactive({});
    const charResonanceChainsData = reactive({});

    const allDamages = reactive({});
    const chosenWeapon = reactive({});
    const chosenChar = reactive({});
    const echoStats = reactive({});
    const characterLevel = ref("90");
    const weaponType = ref("");
    const curScreen = ref("character");
    const damage = ref(0);
    const charactersList = ref([]);
    const character = ref("");
    const totalAtk = ref(0);
    const totalHp = ref(0);
    const totalDef = ref(0);
    const totalCritRate = ref(0.05);
    const totalCritDMG = ref(0.5);
    const energyRegen = ref(1);
    const healingBonus = ref(0);
    const shieldBonus = ref(0);
    const BasicAttackDMGBonus = ref(0);
    const HeavyAttackDMGBonus = ref(0);
    const ResonanceSkillDMGBonus = ref(0);
    const ResonanceLiberationDMGBonus = ref(0);
    const IntroSkillDMGBonus = ref(0);
    const OutroSkillDMGBonus = ref(0);
    const Glacio = ref(0);
    const Fusion = ref(0);
    const Electro = ref(0);
    const Aero = ref(0);
    const Spectro = ref(0);
    const Havoc = ref(0);
    const DefIgnore = ref(0);
    const BonusSpecificSkillDMGBonus = ref(0);
    const TotalDeepenEffect = ref(0);
    const ResistReduction = ref(0);
    const isLoading = ref(false);
    const enemyLevel = ref(90);
    const enemyResist = ref(0.1);

    charactersList.value = getCharactersAvailable();

    watch(character, async (charName) => {
      isLoading.value = true;
      const chosen = await getCharByName(charName);
      chosenChar.value = chosen;
      // set the character in the store
      characterStore.setActiveCharacter(charName);
      // update the character level
      characterLevel.value =
        characters.value?.[charName]?.characterLevel ?? "90";
      // update the weapons if needed
      if (weaponType.value !== chosenChar.value?.basic?.weapon) {
        weaponType.value = chosenChar.value?.basic?.weapon ?? "Swords";
      }
      // update the enemy data
      enemyLevel.value = characters.value?.[charName]?.enemyLevel ?? 90;
      enemyResist.value = characters.value?.[charName]?.enemyResist ?? 0.1;
      setTimeout(() => {
        isLoading.value = false;
      }, 10);
      calcCharStats();
    });

    // set the character to display, default to the first
    let initialCharacter = activeCharacter?.value;
    // it can be a blank string, if so, set it to the first item
    if (!initialCharacter) {
      initialCharacter = charactersList.value?.five?.[0]?.key ?? "Calcharo";
    }
    character.value = initialCharacter;

    // seed initial enemy data with store data or default
    enemyLevel.value = characters.value?.[character.value]?.enemyLevel ?? 90;
    enemyResist.value = characters.value?.[character.value]?.enemyResist ?? 0.1;

    // set the character value
    characterLevel.value =
      characters.value?.[character.value]?.characterLevel ?? "90";

    const talentData = reactive({
      basic: characters.value?.[character.value]?.talents?.basic ?? 10,
      skill: characters.value?.[character.value]?.talents?.skill ?? 10,
      forte: characters.value?.[character.value]?.talents?.forte ?? 10,
      liberation:
        characters.value?.[character.value]?.talents?.liberation ?? 10,
      intro: characters.value?.[character.value]?.talents?.intro ?? 10,
    });

    const addBuffs = (source, target) => {
      if (source) {
        target.attackPercent += source?.ATK ? source.ATK * 100 : 0;
        target.hpPercent += source?.HP ? source.HP * 100 : 0;
        target.defPercent += source?.DEF ? source.DEF * 100 : 0;
        target.attackFlat += source?.ATK_FLAT ?? 0;
        target.hpFlat += source?.HP_FLAT ?? 0;
        target.defFlat += source?.DEF_FLAT ?? 0;
        target.critRate += source?.CritRate ? source.CritRate * 100 : 0;
        target.critDMG += source?.CritDMG ? source.CritDMG * 100 : 0;
        target.energyRegen += source?.EnergyRegen ? source.EnergyRegen : 0;
        target.healingBonus += source?.HealingBonus ? source.HealingBonus : 0;
        target.shieldBonus += source?.ShieldBonus ? source.ShieldBonus : 0;
        target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
          ? source.BasicAttackDMGBonus * 100
          : 0;
        target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
          ? source.HeavyAttackDMGBonus * 100
          : 0;
        target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
          ? source.ResonanceSkillDMGBonus * 100
          : 0;
        target.introSkillDMGBonus += source?.IntroSkillDMGBonus
          ? source.IntroSkillDMGBonus * 100
          : 0;
        target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
          ? source.OutroSkillDMGBonus * 100
          : 0;
        target.resonanceLiberationDMGBonus +=
          source?.ResonanceLiberationDMGBonus
            ? source.ResonanceLiberationDMGBonus * 100
            : 0;
        target.glacio += source?.Glacio ? source.Glacio * 100 : 0;
        target.fusion += source?.Fusion ? source.Fusion * 100 : 0;
        target.electro += source?.Electro ? source.Electro * 100 : 0;
        target.aero += source?.Aero ? source.Aero * 100 : 0;
        target.spectro += source?.Spectro ? source.Spectro * 100 : 0;
        target.havoc += source?.Havoc ? source.Havoc * 100 : 0;
        target.defIgnore += source?.DEFIgnore ? source.DEFIgnore * 100 : 0;
        target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
          ? source.BonusSpecificSkillDMGBonus * 100
          : 0;
        target.totalDeepenEffect += source?.DMGDeepen ? source.DMGDeepen : 0;
        target.resistReduction += source?.ResistReduction
          ? source.ResistReduction * 100
          : 0;
      }
    };
    const addEchoBuffs = (source, target) => {
      if (source) {
        target.attackPercent += source?.ATK ? source.ATK : 0;
        target.hpPercent += source?.HP ? source.HP : 0;
        target.defPercent += source?.DEF ? source.DEF : 0;
        target.attackFlat += source?.ATK_FLAT ?? 0;
        target.hpFlat += source?.HP_FLAT ?? 0;
        target.defFlat += source?.DEF_FLAT ?? 0;
        target.critRate += source?.CritRate ? source.CritRate : 0;
        target.critDMG += source?.CritDMG ? source.CritDMG : 0;
        target.energyRegen += source?.EnergyRegen
          ? source.EnergyRegen / 100
          : 0;
        target.healingBonus += source?.HealingBonus
          ? source.HealingBonus / 100
          : 0;
        target.basicAttackDMGBonus += source?.BasicAttackDMGBonus
          ? source.BasicAttackDMGBonus
          : 0;
        target.heavyAttackDMGBonus += source?.HeavyAttackDMGBonus
          ? source.HeavyAttackDMGBonus
          : 0;
        target.resonanceSkillDMGBonus += source?.ResonanceSkillDMGBonus
          ? source.ResonanceSkillDMGBonus
          : 0;
        target.resonanceLiberationDMGBonus +=
          source?.ResonanceLiberationDMGBonus
            ? source.ResonanceLiberationDMGBonus
            : 0;
        target.outroSkillDMGBonus += source?.OutroSkillDMGBonus
          ? source.OutroSkillDMGBonus
          : 0;
        target.glacio += source?.Glacio ? source.Glacio : 0;
        target.fusion += source?.Fusion ? source.Fusion : 0;
        target.electro += source?.Electro ? source.Electro : 0;
        target.aero += source?.Aero ? source.Aero : 0;
        target.spectro += source?.Spectro ? source.Spectro : 0;
        target.havoc += source?.Havoc ? source.Havoc : 0;
        target.defIgnore += source?.DEFIgnore ? source.DEFIgnor : 0;
        target.bonusSpecificSkillDMGBonus += source?.BonusSpecificSkillDMGBonus
          ? source.BonusSpecificSkillDMGBonus
          : 0;
        target.totalDeepenEffect += source?.TotalDeepenEffect
          ? source.TotalDeepenEffect
          : 0;
        target.resistReduction += source?.ResistReduction
          ? source.ResistReduction
          : 0;
      }
    };

    const calcCharStats = (returnValue = false, injectStats = null) => {
      let stats = {
        attackPercent: 0,
        hpPercent: 0,
        defPercent: 0,
        attackFlat: 0,
        hpFlat: 0,
        defFlat: 0,
        critRate: 5,
        critDMG: 150,
        energyRegen: 1,
        healingBonus: 0,
        shieldBonus: 0,
        basicAttackDMGBonus: 0,
        heavyAttackDMGBonus: 0,
        resonanceSkillDMGBonus: 0,
        introSkillDMGBonus: 0,
        outroSkillDMGBonus: 0,
        resonanceLiberationDMGBonus: 0,
        glacio: 0,
        fusion: 0,
        electro: 0,
        aero: 0,
        spectro: 0,
        havoc: 0,
        defIgnore: 0,
        bonusSpecificSkillDMGBonus: 0,
        totalDeepenEffect: 0,
        resistReduction: 0,
      };
      let charHp = 0;
      let charAtk = 0;
      let charDef = 0;
      let weaponAtk = 0;

      let weaponModifer = null;
      let weaponModifierValue = 0;
      let weaponPassiveData = {};
      let resonanceChainsData = {};
      if (chosenChar.value) {
        const { hp, attack, defense } =
          chosenChar.value.getCharacterStatsByLevel(characterLevel.value);
        charHp = hp;
        charAtk = attack;
        charDef = defense;
      }

      if (charBuffsData.value) {
        addBuffs(charBuffsData.value, stats);
      }

      if (injectStats) {
        addBuffs(injectStats, stats);
      }

      if (charResonanceChainsData.value) {
        addBuffs(charResonanceChainsData.value, stats);

        resonanceChainsData = charResonanceChainsData.value ?? {};
        if (resonanceChainsData?.AllAttributeBonus) {
          const allAttributeBonus = resonanceChainsData.AllAttributeBonus * 100;
          stats.basicAttackDMGBonus += allAttributeBonus;
          stats.heavyAttackDMGBonus += allAttributeBonus;
          stats.resonanceSkillDMGBonus += allAttributeBonus;
          stats.resonanceLiberationDMGBonus += allAttributeBonus;
          stats.introSkillDMGBonus += allAttributeBonus;
          stats.outroSkillDMGBonus += allAttributeBonus;
        }
        if (resonanceChainsData?.AllElementAttributeBonus) {
          const allElementAttributeBonus =
            resonanceChainsData.AllElementAttributeBonus * 100;
          stats.glacio += allElementAttributeBonus;
          stats.fusion += allElementAttributeBonus;
          stats.electro += allElementAttributeBonus;
          stats.aero += allElementAttributeBonus;
          stats.spectro += allElementAttributeBonus;
          stats.havoc += allElementAttributeBonus;
        }
      }

      if (weaponData.value) {
        weaponAtk = weaponData.value?.attack;
        weaponModifer = weaponData.value?.modifier;
        weaponModifierValue = weaponData.value?.modifierValue;
        weaponPassiveData = weaponData.value?.weaponPassiveStats ?? {};

        weaponPassiveData = Object.fromEntries(
          Object.entries(weaponPassiveData).filter(([_, v]) => v != null)
        );

        addBuffs(weaponPassiveData, stats);

        if (weaponPassiveData?.AllElementAttributeBonus) {
          const allElementAttributeBonus =
            weaponPassiveData.AllElementAttributeBonus * 100;
          stats.glacio += allElementAttributeBonus;
          stats.fusion += allElementAttributeBonus;
          stats.electro += allElementAttributeBonus;
          stats.aero += allElementAttributeBonus;
          stats.spectro += allElementAttributeBonus;
          stats.havoc += allElementAttributeBonus;
        }

        if (weaponPassiveData?.AllResonanceDMG) {
          const allResonanceDMG = weaponPassiveData.AllResonanceDMG * 100;
          stats.resonanceSkillDMGBonus += allResonanceDMG;
          stats.resonanceLiberationDMGBonus += allResonanceDMG;
        }

        switch (weaponModifer) {
          case "ATK":
            stats.attackPercent += weaponModifierValue * 100;
            break;
          case "HP":
            stats.hpPercent += weaponModifierValue * 100;
            break;
          case "DEF":
            stats.defPercent += weaponModifierValue * 100;
            break;
          case "CritRate":
            stats.critRate += weaponModifierValue * 100;
            break;
          case "CritDMG":
            stats.critDMG += weaponModifierValue * 100;
            break;
          case "EnergyRegen":
            stats.energyRegen += weaponModifierValue;
            break;
          case "HealingBonus":
            stats.healingBonus += weaponModifierValue;
            break;
        }
      }

      if (echoStats) {
        addEchoBuffs(echoStats?.value, stats);
      }

      if (teamBuffsData.value) {
        addBuffs(teamBuffsData.value, stats);

        if (teamBuffsData?.value?.AllAttributeBonus) {
          const allAttributeBonus =
            teamBuffsData?.value?.AllAttributeBonus * 100;
          stats.basicAttackDMGBonus += allAttributeBonus;
          stats.heavyAttackDMGBonus += allAttributeBonus;
          stats.resonanceSkillDMGBonus += allAttributeBonus;
          stats.resonanceLiberationDMGBonus += allAttributeBonus;
          stats.introSkillDMGBonus += allAttributeBonus;
          stats.outroSkillDMGBonus += allAttributeBonus;
        }
        if (teamBuffsData?.value?.AllElementAttributeBonus) {
          const allElementAttributeBonus =
            teamBuffsData?.value.AllElementAttributeBonus * 100;
          stats.glacio += allElementAttributeBonus;
          stats.fusion += allElementAttributeBonus;
          stats.electro += allElementAttributeBonus;
          stats.aero += allElementAttributeBonus;
          stats.spectro += allElementAttributeBonus;
          stats.havoc += allElementAttributeBonus;
        }
      }

      // add any buffs that are based on total / additional stats
      if (charBuffsData.value) {
        const charBuffKeys = Object.keys(charBuffsData.value);
        // find any with "Additional" in it
        const additionalBasedBuffs = charBuffKeys.filter((buff) => {
          return buff.includes("AdditionalBase");
        });
        const charBuffDetails = chosenChar.value?.buffs ?? [];
        additionalBasedBuffs.forEach((buff) => {
          // find the buff data, it has more data we need
          let buffParams;
          for (const charBuffDetail of charBuffDetails) {
            const foundModifier = charBuffDetail.modifiers.find((modifier) => {
              return modifier.modifier === buff;
            });
            if (foundModifier) {
              buffParams = foundModifier;
              break;
            }
          }
          if (buffParams) {
            // now calc the amount we get
            let base = 0;
            let currentAmount = 0;
            switch (buffParams.modifierBasedOn) {
              case "EnergyRegen":
                // TODO: Verify this. updated theory is all ER, not added ER
                base = 0;
                currentAmount = stats.energyRegen;
                break;
              case "CritRate":
                base = 0.05;
                currentAmount = stats.critRate;
                break;
              case "CritDMG":
                base = 1.5;
                currentAmount = stats.critDMG;
                break;
              default:
                base = 0;
                break;
            }
            const additionalAmount = currentAmount - base;
            const steps = Math.floor(
              additionalAmount / buffParams.modifierStep
            );
            let buffValue = steps * buffParams.modifierValue;
            if (buffValue > buffParams.maximumValue) {
              buffValue = buffParams.maximumValue;
            }
            // now apply the buff
            switch (buffParams.modifierTargetAttr) {
              case "CritRate":
                stats.critRate += buffValue * 100;
                break;
              case "CritDMG":
                stats.critDMG += buffValue * 100;
                break;
              case "ATK":
                stats.attackPercent += buffValue * 100;
                break;
            }
          }
        });
      }

      if (returnValue) {
        switch (returnValue) {
          case "HP":
            return charHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
          case "DEF":
            return charDef * (1 + stats.defPercent / 100) + stats.defFlat;
          case "ATK":
          default:
            return (
              (charAtk + weaponAtk) * (1 + stats.attackPercent / 100) +
              stats.attackFlat
            );
        }
      }

      totalAtk.value =
        (charAtk + weaponAtk) * (1 + stats.attackPercent / 100) +
        stats.attackFlat;
      totalHp.value = charHp * (1 + stats.hpPercent / 100) + stats.hpFlat;
      totalDef.value = charDef * (1 + stats.defPercent / 100) + stats.defFlat;
      totalCritRate.value = stats.critRate / 100;
      totalCritDMG.value = stats.critDMG / 100;
      energyRegen.value = stats.energyRegen;
      healingBonus.value = stats.healingBonus;
      shieldBonus.value = stats.shieldBonus;
      BasicAttackDMGBonus.value = stats.basicAttackDMGBonus;
      HeavyAttackDMGBonus.value = stats.heavyAttackDMGBonus;
      ResonanceSkillDMGBonus.value = stats.resonanceSkillDMGBonus;
      IntroSkillDMGBonus.value = stats.introSkillDMGBonus;
      OutroSkillDMGBonus.value = stats.outroSkillDMGBonus;
      ResonanceLiberationDMGBonus.value = stats.resonanceLiberationDMGBonus;
      Glacio.value = stats.glacio;
      Fusion.value = stats.fusion;
      Electro.value = stats.electro;
      Aero.value = stats.aero;
      Spectro.value = stats.spectro;
      Havoc.value = stats.havoc;
      DefIgnore.value = stats.defIgnore / 100;
      BonusSpecificSkillDMGBonus.value = stats.bonusSpecificSkillDMGBonus;
      TotalDeepenEffect.value = stats.totalDeepenEffect;
      ResistReduction.value = stats.resistReduction;

      calcAllDamages();
    };

    const getElementDmgBonusByType = (element) => {
      let val = 0;
      switch (element) {
        case "Glacio":
          val = Glacio.value;
          break;
        case "Fusion":
          val = Fusion.value;
          break;
        case "Electro":
          val = Electro.value;
          break;
        case "Aero":
          val = Aero.value;
          break;
        case "Spectro":
          val = Spectro.value;
          break;
        case "Havoc":
          val = Havoc.value;
          break;
      }

      return val / 100;
    };

    const getDamageTypeBonusByType = (type) => {
      let val = 0;
      switch (type) {
        case "Basic":
          val = BasicAttackDMGBonus.value;
          break;
        case "Heavy":
          val = HeavyAttackDMGBonus.value;
          break;
        case "Skill":
          val = ResonanceSkillDMGBonus.value;
          break;
        case "Intro":
          val = IntroSkillDMGBonus.value;
          break;
        case "Outro":
          val = OutroSkillDMGBonus.value;
          break;
        case "Liberation":
          val = ResonanceLiberationDMGBonus.value;
          break;
        // do not divide this by 100
        case "Healing":
          return healingBonus.value;
        case "Shield":
          return shieldBonus.value;
      }

      return val / 100;
    };

    const getDamageValByAttr = (attribute = "attack") => {
      switch (attribute) {
        case "defense":
          return totalDef.value;
          break;
        case "hp":
          return totalHp.value;
          return;
        case "attack":
        default:
          return totalAtk.value;
          break;
      }
    };

    const calcAllDamages = () => {
      if (!chosenChar.value) return;

      const elementalDmgBonusDecimal = getElementDmgBonusByType(
        chosenChar.value?.basic?.element
      );

      const calculateAttackDamage = (
        attack,
        talentType,
        hasNoTalentLevel = false
      ) => {
        const attackType = attack.type;
        const attackElement = chosenChar.value?.basic?.element;
        const atkDefHpVal = getDamageValByAttr(attack?.attribute);
        const totalSkillDmgBonus = getDamageTypeBonusByType(attackType);
        let talent;
        if (hasNoTalentLevel) {
          talent = attack.talent;
        } else {
          talent = attack.talents[talentType];
        }
        const talentModifierAdd = charBuffsData.value?.[attack.key] ?? 0;
        const talentModifierAddFromResonanceChains =
          charResonanceChainsData.value?.[attack.key] ?? 0;
        const totalTalentModifierAdd =
          talentModifierAdd + talentModifierAddFromResonanceChains;
        const specificSkillDmgFromResonanceChains =
          charResonanceChainsData.value?.specificTalentBuffs?.[attack.key] ?? 0;
        // there are bonuses that are based on Max HP, Max ATK, Max DEF
        // we end up with DMG Bonus %, so we also / 100 in the end
        const specificSkillDmgFromResonanceChainsBasedOnMaxHp =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DMGBonus:MaxHP`
          ] ?? 0;
        const specificSkillDmgFromResonanceChainsBasedOnMaxAtk =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DMGBonus:MaxAtk`
          ] ?? 0;
        const specificSkillDmgFromResonanceChainsBasedOnMaxDef =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DMGBonus:MaxDef`
          ] ?? 0;
        const specificSkillDmgFromResonanceChainsBasedOnMaxHpVal =
          (totalHp.value * specificSkillDmgFromResonanceChainsBasedOnMaxHp) /
          100;
        const specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal =
          (totalAtk.value * specificSkillDmgFromResonanceChainsBasedOnMaxAtk) /
          100;
        const specificSkillDmgFromResonanceChainsBasedOnMaxDefVal =
          (totalDef.value * specificSkillDmgFromResonanceChainsBasedOnMaxDef) /
          100;
        // end max buff handlers
        const specificSkillDmgFromCharBuffs =
          charBuffsData.value?.specificTalentBuffs?.[attack.key] ?? 0;
        const genericSkillDmgBonusResChain =
          charResonanceChainsData.value?.DMGBonus ?? 0;
        const genericSkillDmgBonusSelfBuff = charBuffsData.value?.DMGBonus ?? 0;
        const genericSkillDmgBonusEchoBuff = echoStats.value?.DMGBonus ?? 0;
        const genericSkillDmgBonusTeamEchoBuff =
          teamBuffsData.value?.DMGBonus ?? 0;
        const extraDefIgnoreResonanceChain =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:DEFIgnore`
          ] ?? 0;
        const extraDefIgnoreCharBuff =
          charBuffsData.value?.specificTalentBuffs?.[
            `${attack.key}:DEFIgnore`
          ] ?? 0;
        const specificSkillExtraCritRate =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:CritRate`
          ] ?? 0;
        const specificSkillExtraCritDMG =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:CritDMG`
          ] ?? 0;
        let instanceDmgCritRate =
          totalCritRate.value + specificSkillExtraCritRate;
        const instanceDmgCritDMG =
          totalCritDMG.value + specificSkillExtraCritDMG;
        const talentModifierMultiply =
          charResonanceChainsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiply`
          ] ?? 0;
        const talentModifierMultiplySelfBuff =
          charBuffsData.value?.specificTalentBuffs?.[
            `${attack.key}:talentModifierMultiply`
          ] ?? 0;
        const totalDefIgnore =
          DefIgnore.value +
          extraDefIgnoreResonanceChain +
          extraDefIgnoreCharBuff;
        const specificSkillDmg =
          specificSkillDmgFromResonanceChains +
          specificSkillDmgFromCharBuffs +
          genericSkillDmgBonusResChain +
          genericSkillDmgBonusSelfBuff +
          genericSkillDmgBonusTeamEchoBuff +
          specificSkillDmgFromResonanceChainsBasedOnMaxHpVal +
          specificSkillDmgFromResonanceChainsBasedOnMaxAtkVal +
          specificSkillDmgFromResonanceChainsBasedOnMaxDefVal +
          genericSkillDmgBonusEchoBuff / 100;
        const teamBuffResistShredForCharElement =
          teamBuffsData.value?.[`ResistShred:${attackElement}`] ?? 0;
        const resonanceChainResistShredForCharElement =
          charResonanceChainsData.value?.[`ResistShred:${attackElement}`] ?? 0;
        const baseResistReduction = ResistReduction.value ?? 0;
        const totalResistReduction =
          baseResistReduction +
          teamBuffResistShredForCharElement +
          resonanceChainResistShredForCharElement;
        // damage deepen
        const baseTotalDeepenEffect = TotalDeepenEffect.value;
        // so far damage deepen is from team buffs, add more later if needed
        // get element first, then any skill specific ones next, then add together
        // NOTE: all outro attacks cannot use the DMGDeepen:element|attackType
        // as they expire before the outro attacks occur. so ignore these
        // for outro attacks
        let teamBuffDmgDeepenForCharElement =
          teamBuffsData.value?.[`DMGDeepen:${attackElement}`] ?? 0;
        let teamBuffDmgDeepenForAttackType =
          teamBuffsData.value?.[`DMGDeepen:${attackType}`] ?? 0;
        let teamBuffDmgDeepenForCoordinatedAttack =
          teamBuffsData.value?.[`DMGDeepen:Coordinated`] ?? 0;
        let coordinatedDmgDeepenEffect = 0;
        if (attack?.subType === "Coordinated") {
          coordinatedDmgDeepenEffect = teamBuffDmgDeepenForCoordinatedAttack;
        }
        if (attackType === "Outro") {
          teamBuffDmgDeepenForCharElement = 0;
          teamBuffDmgDeepenForAttackType = 0;
        }
        const totalDmgDeepen =
          baseTotalDeepenEffect +
          teamBuffDmgDeepenForCharElement +
          teamBuffDmgDeepenForAttackType +
          coordinatedDmgDeepenEffect;
        const totalTalentModifierMultiply =
          talentModifierMultiply + talentModifierMultiplySelfBuff;
        // check for any modifiers that change the individual instance of atk/hp/def
        // re-calculate the base for this specific instance of damage
        const modifyBaseAtk =
          charBuffsData.value?.specificTalentBuffs?.[`${attack.key}:ATK`] ?? 0;
        const modifyBaseHp =
          charBuffsData.value?.specificTalentBuffs?.[`${attack.key}:HP`] ?? 0;
        const modifyBaseDef =
          charBuffsData.value?.specificTalentBuffs?.[`${attack.key}:DEF`] ?? 0;
        let finalAtkDefHpVal = atkDefHpVal;
        if (modifyBaseAtk) {
          finalAtkDefHpVal = calcCharStats("ATK", { ATK: modifyBaseAtk });
        }
        if (modifyBaseHp) {
          finalAtkDefHpVal = calcCharStats("HP", { HP: modifyBaseHp });
        }
        if (modifyBaseDef) {
          finalAtkDefHpVal = calcCharStats("DEF", { DEF: modifyBaseDef });
        }

        if (attackType === "Healing") {
          const h = calcHeal(
            talent,
            finalAtkDefHpVal,
            totalSkillDmgBonus, // char stat of healing bonus
            specificSkillDmg, // any buffs for the skill
            totalTalentModifierAdd,
            totalTalentModifierMultiply
          );
          return h;
        }

        if (attackType === "Shield") {
          const h = calcShield(
            talent,
            finalAtkDefHpVal,
            totalSkillDmgBonus, // char stat of shield bonus
            specificSkillDmg, // any buffs for the skill
            totalTalentModifierAdd,
            totalTalentModifierMultiply
          );
          return h;
        }

        // sometimes an attack will always crit, if so, make that instance have max CR
        if (attack?.alwaysCrit) {
          instanceDmgCritRate = 1;
        }
        return calcDamage(
          characterLevel.value,
          enemyLevel.value,
          enemyResist.value,
          talent,
          finalAtkDefHpVal,
          totalDefIgnore,
          totalSkillDmgBonus,
          specificSkillDmg,
          elementalDmgBonusDecimal,
          totalDmgDeepen,
          totalResistReduction,
          instanceDmgCritRate,
          instanceDmgCritDMG,
          totalTalentModifierAdd,
          totalTalentModifierMultiply
        );
      };

      const processAttacks = (
        attacks,
        talentType,
        hasNoTalentLevel = false
      ) => {
        return (
          (attacks ?? [])
            .map((attack) => {
              let isEnabled = true;
              // if this attack requires a resonance chain to be unlocked, verify it's enabled
              const requiresResonanceChain =
                attack?.requiresResonanceChain ?? false;
              if (requiresResonanceChain) {
                const resonanceChainsEnabledAttacks =
                  charResonanceChainsData.value?.EnableAttack ?? [];
                const charBuffsEnabledAttacks =
                  charBuffsData.value?.EnableAttack ?? [];
                // merge all possible enabled attack arrays together
                const enabledAttacks = []
                  .concat(resonanceChainsEnabledAttacks)
                  .concat(charBuffsEnabledAttacks);
                const isAttackEnabled = enabledAttacks.includes(
                  attack.requiresResonanceChain
                );
                // flag this attack as enabled or not based on the resonance chain
                isEnabled = isAttackEnabled;
              }
              let talent;
              if (hasNoTalentLevel) {
                talent = attack.talent;
              } else {
                talent = attack.talents[talentType];
              }
              return {
                key: attack.key,
                label: attack.label,
                talent,
                damage: calculateAttackDamage(
                  attack,
                  talentType,
                  hasNoTalentLevel
                ),
                isEnabled,
                type: attack.type,
              };
            })
            // remove any attacks that are not enabled
            .filter((attack) => attack.isEnabled)
        );
      };

      allDamages.value = {
        basicAttacks: processAttacks(
          chosenChar.value.basicAttacks?.attacks,
          talentData.basic
        ),
        skillAttacks: processAttacks(
          chosenChar.value.skillAttacks?.attacks,
          talentData.skill
        ),
        liberationAttacks: processAttacks(
          chosenChar.value.liberationAttacks?.attacks,
          talentData.liberation
        ),
        forteCircuitAttacks: processAttacks(
          chosenChar.value.forteCircuitAttacks?.attacks,
          talentData.forte
        ),
        introAttacks: processAttacks(
          chosenChar.value.introAttacks?.attacks,
          talentData.intro
        ),
        introAttacks: processAttacks(
          chosenChar.value.introAttacks?.attacks,
          talentData.intro
        ),
        outroAttacks: processAttacks(
          chosenChar.value.outroAttacks?.attacks,
          talentData.intro,
          true // has no talent level
        ),
      };
    };

    const handleCalculation = () => {
      calcAllDamages();
    };

    const handleWeaponUpdated = (givenWeaponData) => {
      weaponData.value = givenWeaponData;
      calcCharStats();
    };

    const handleUpdatedCharacterBuffs = (givenCharBuffsData) => {
      charBuffsData.value = givenCharBuffsData;
      calcCharStats();
    };

    const handleUpdatedTeamBuffs = (givenTeamBuffs) => {
      teamBuffsData.value = givenTeamBuffs;
      calcCharStats();
    };

    const handleUpdatedCharacterResonanceChains = (
      givenResonanceChainsData
    ) => {
      charResonanceChainsData.value = givenResonanceChainsData;
      calcCharStats();
    };

    const updateStatsEchoes = (echoStatsGiven) => {
      echoStats.value = echoStatsGiven;
      calcCharStats();
    };

    const changeScreen = (screen: string) => {
      curScreen.value = screen;
    };

    const displayDamage = (damage: number) => {
      return Math.ceil(damage);
    };

    const displayPercentage = (percentage: number) => {
      return decimalFormatter.format(percentage) + "%";
    };

    const handleCharacterTalentUpdated = (data) => {
      talentData[data.type] = data.value;
      calcAllDamages();
    };

    const handleCharacterLevelUpdated = (level) => {
      // set the character level in the store
      characterLevel.value = level;
      calcCharStats();
    };

    const handleUpdatedEnemy = (data) => {
      enemyLevel.value = data.enemyLevel;
      enemyResist.value = data.enemyResist;
      calcAllDamages();
    };

    return {
      allDamages,
      character,
      characters,
      characterLevel,
      charactersList,
      chosenChar,
      chosenWeapon,
      curScreen,
      changeScreen,
      damage,
      displayDamage,
      displayPercentage,
      updateStatsEchoes,
      totalAtk,
      totalHp,
      totalDef,
      totalCritRate,
      totalCritDMG,
      energyRegen,
      healingBonus,
      weaponType,
      handleCharacterLevelUpdated,
      handleCharacterTalentUpdated,
      handleWeaponUpdated,
      handleUpdatedCharacterBuffs,
      handleUpdatedCharacterResonanceChains,
      handleUpdatedEnemy,
      handleUpdatedTeamBuffs,
      BasicAttackDMGBonus,
      HeavyAttackDMGBonus,
      ResonanceSkillDMGBonus,
      IntroSkillDMGBonus,
      OutroSkillDMGBonus,
      ResonanceLiberationDMGBonus,
      Glacio,
      Fusion,
      Electro,
      Aero,
      Spectro,
      Havoc,
      DefIgnore,
      BonusSpecificSkillDMGBonus,
      TotalDeepenEffect,
      ResistReduction,
      weaponData,
      isLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.calculations {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  height: 100vh;

  @media (max-width: 768px) {
    display: block;
    height: auto;
  }
}

.calculations__screens {
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.results {
  overflow-y: auto;
  padding: 2rem;
}

$sidebar-background-color: #121212;
$active-sidebar-link-color: #22252e;
$hover-sidebar-link-color: $active-sidebar-link-color;
$active-link-color: #98d7ec;
$tooltip-background-color: $sidebar-background-color;
.calcations__nav {
  display: inline-block;
  min-height: 100vh;
  background-color: #000;
  float: left;
  flex-basis: 80px;
  width: 80px;
  z-index: 999;

  ul {
    text-align: center;
    color: white;
    padding: 0;
    margin: 0;

    li {
      height: 64px;
      max-height: 64px;
      cursor: pointer;
      transition: all ease-out 120ms;
      list-style-type: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 0;

      .icon {
        width: 48px;
        height: 48px;
      }

      &:hover,
      &.active {
        background-color: $active-sidebar-link-color;

        i {
          color: $active-link-color;
        }
      }
    }
  }
  @media (max-width: 768px) {
    display: block;
    height: 48px;
    background: #000;
    height: 48px;
    min-height: 48px;
    width: 100%;
    position: sticky;
    top: 48px;
    left: 0;

    ul {
      display: flex;
      flex-direction: row;

      li {
        height: 48px;
        max-height: 48px;
        cursor: pointer;
        transition: all ease-out 0.12s;
        list-style-type: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 0;
        flex-basis: 48px;
        padding: 0 0.5rem;

        .icon {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
.calculation__damage__item {
  display: grid;
  grid-template-columns: 1fr 100px 100px 100px;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  &:nth-child(even) {
    background-color: transparent;
  }
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);

    @media (prefers-color-scheme: light) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr 80px 80px 80px;
    gap: 0.15rem;
  }
}
.character__stat__item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.alert {
  background: #126a5a;
  padding: 0.25rem 0.5rem;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: white;

  &.alert--info {
    background: #12526a;
  }
}
.screen--character {
  padding-top: 1rem;
  overflow: hidden;
}
.character__selection {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  grid-gap: 2rem;
}
.character__selection__form--character {
  margin-bottom: 1rem;
}
.character__selection__form {
  label {
    margin-left: 0.5rem;
  }
}
.character__selection__avatar {
  width: 100px;
  height: 100px;
  background-repeat: no-repeat;
  display: block;
  background-size: contain;
  border-radius: 100%;
  border: 1px solid white;
}
.results__stats {
  div {
    display: flex;
    justify-content: space-between;
    max-width: 400px;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;

    span {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
  div:nth-child(even) {
    background-color: transparent;
  }
  div:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.1);

    @media (prefers-color-scheme: light) {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  span img {
    // make the white icons darker on light mode for stats
    @media (prefers-color-scheme: light) {
      filter: contrast(0.25);
    }
  }
}
.results {
  display: block !important;

  h4 {
    padding-left: 0.5rem;
  }
}
.calculations__nav--results {
  display: none !important;
}
@media (max-width: 768px) {
  .calculations__nav--results {
    display: flex !important;
  }
  .results {
    display: none !important;
  }
}
.panel {
  margin-top: 1rem;
  background-color: #161616;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;

  @media (prefers-color-scheme: light) {
    background-color: #f8f8f8;
  }
}
.mb-1 {
  margin-bottom: 1rem;
}
.calculation__damage__item--fill {
  grid-template-columns: 1fr;
}
.calculation__damage__item--healing {
  color: #3bea3b;

  @media (prefers-color-scheme: light) {
    color: #13a813;
  }
}
.calculation__damage__item--shield {
  color: #00adff;

  @media (prefers-color-scheme: light) {
    color: #4a92ff;
  }
}
</style>
