<template>
  <div class="damage-breakdown">
    <div class="font-bold mt-2 text-lg text-primary">
      {{ attackLabel }}
    </div>
    <div
      v-if="damage.totalDamageContext.type === 'spectroFrazzle'"
      class="damage-breakdown--spectroFrazzle">
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="font-bold text-secondary">
          {{ displayDamage(damage.damage) }}
        </span>
        = (1000 ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.resistModifier * 100, 2)
          }}
        </span>
        ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.defModifier * 100, 10)
          }}
        </span>
        ×
        <span class="text-primary">{{ damage.totalDamageContext.stacks }}</span>
        ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.motionValue * 100, 5)
          }}
        </span>
        × (1 +
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.DMGDeepen * 100, 2) }}
        </span>
        ))
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Defense modifier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(damage.totalDamageContext.defModifier * 100, 10)
          }}
        </span>
        = (800 + 8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.charLevel }}
        </span>
        ) / (800 + 8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.charLevel }}
        </span>
        + (8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.enemyLevel }}
        </span>
        + 792) × (1 -
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.defIgnore * 100) }}
        </span>
        ))
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Resistance modifier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(damage.totalDamageContext.resistModifier * 100)
          }}
        </span>
        <template
          v-if="
            damage.totalDamageContext.enemyResist > 0 ||
            damage.totalDamageContext.enemyResist -
              damage.totalDamageContext.resistenceReduction >=
              0
          ">
          = 1 - (
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}
          </span>
          -
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.resistenceReduction * 100,
              )
            }}
          </span>
          )
        </template>
        <template v-else>
          = 1 + (
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.resistenceReduction * 100,
              )
            }}
          </span>
          -
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}
          </span>
          ) / 2
        </template>
      </div>
    </div>
    <div
      v-if="damage.totalDamageContext.type === 'aeroErosion'"
      class="damage-breakdown--aeroErosion">
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="font-bold text-secondary">
          {{ displayDamage(damage.damage) }}
        </span>
        = (1000 ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.resistModifier * 100, 2)
          }}
        </span>
        ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.defModifier * 100, 10)
          }}
        </span>
        ×
        <span class="text-primary">{{ damage.totalDamageContext.stacks }}</span>
        ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.motionValue * 100, 5)
          }}
        </span>
        × (1 +
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.DMGDeepen * 100, 2) }}
        </span>
        ))
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Defense modifier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(damage.totalDamageContext.defModifier * 100, 10)
          }}
        </span>
        = (800 + 8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.charLevel }}
        </span>
        ) / (800 + 8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.charLevel }}
        </span>
        + (8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.enemyLevel }}
        </span>
        + 792) × (1 -
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.defIgnore * 100) }}
        </span>
        ))
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Resistance modifier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(damage.totalDamageContext.resistModifier * 100)
          }}
        </span>
        <template
          v-if="
            damage.totalDamageContext.enemyResist > 0 ||
            damage.totalDamageContext.enemyResist -
              damage.totalDamageContext.resistenceReduction >=
              0
          ">
          = 1 - (
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}
          </span>
          -
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.resistenceReduction * 100,
              )
            }}
          </span>
          )
        </template>
        <template v-else>
          = 1 + (
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.resistenceReduction * 100,
              )
            }}
          </span>
          -
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}
          </span>
          ) / 2
        </template>
      </div>
    </div>
    <div
      v-if="damage.totalDamageContext.type === 'healing'"
      class="damage-breakdown--healing">
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="font-bold text-secondary">
          {{ displayDamage(damage.healAmount) }}
        </span>
        = (
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.talentVal * 100, 10) }}
        </span>
        ×
        <span class="text-primary">
          {{ damage.totalDamageContext.finalAtkDefHpVal }}
        </span>
        +
        <span class="text-primary">
          {{ damage.totalDamageContext.flatBase }}
        </span>
        ) × (1 +
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.totalHealBonus * 100)
          }}
        </span>
        )
      </div>
      <div class="divider mt-2"></div>
      <div class="mv-breakdown">
        <div class="total-mv">
          <div class="font-bold mt-2 text-lg text-primary">Total MV</div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            (
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.originalTalentVal * 100,
                  2,
                )
              }}
            </span>
            +
            <span class="text-primary">
              {{ damage.totalDamageContext.talentModifierAdd }}
            </span>
            × ( 1 +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierMultiply * 100,
                  2,
                )
              }}
            </span>
            ) × ( 1 +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierSpecialMultiply * 100,
                  2,
                )
              }}
            </span>
            ) ) +
            <span class="text-primary">
              {{ damage.totalDamageContext.originalFlatBase }}
            </span>
            × ( 1 +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierMultiply * 100,
                  2,
                )
              }}
            </span>
            ) × ( 1 +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierSpecialMultiply * 100,
                  2,
                )
              }}
            </span>
            )
          </div>
        </div>
        <div class="total-mv">
          <div class="font-bold mt-2 text-lg text-primary">
            Total Healing Bonus
          </div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            <span class="text-secondary">
              {{
                displayPercentage(
                  damage.totalDamageContext.totalHealBonus * 100,
                  2,
                )
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="damage.totalDamageContext.type === 'shield'"
      class="damage-breakdown--shield">
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="font-bold text-secondary">
          {{ displayDamage(damage.shieldAmount) }}
        </span>
        = (
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.talentVal * 100, 10) }}
        </span>
        ×
        <span class="text-primary">
          {{ damage.totalDamageContext.finalAtkDefHpVal }}
        </span>
        +
        <span class="text-primary">
          {{ damage.totalDamageContext.flatBase }}
        </span>
        ) × (1 +
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.totalShieldBonus * 100)
          }}
        </span>
        )
      </div>
      <div class="divider mt-2"></div>
      <div class="mv-breakdown">
        <div class="total-mv">
          <div class="font-bold mt-2 text-lg text-primary">Total MV</div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            (
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.originalTalentVal * 100,
                  2,
                )
              }}
            </span>
            +
            <span class="text-primary">
              {{ damage.totalDamageContext.talentModifierAdd }}
            </span>
            × ( 1 +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierMultiply * 100,
                  2,
                )
              }}
            </span>
            ) ) +
            <span class="text-primary">
              {{ damage.totalDamageContext.originalFlatBase }}
            </span>
            × ( 1 +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierMultiply * 100,
                  2,
                )
              }}
            </span>
            )
          </div>
        </div>
        <div class="total-mv">
          <div class="font-bold mt-2 text-lg text-primary">
            Total Shield Bonus
          </div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            <span class="text-secondary">
              {{
                displayPercentage(
                  damage.totalDamageContext.totalShieldBonus * 100,
                  2,
                )
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        damage.totalDamageContext.type === 'attack' &&
        damage.totalDamageContext.isFixed === true
      "
      class="damage-breakdown--attack-fixed">
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="font-bold text-secondary">
          {{ displayDamage(damage.totalDamage) }}
        </span>
      </div>
    </div>
    <div
      v-if="
        damage.totalDamageContext.type === 'attack' &&
        damage.totalDamageContext.isFixed === false
      "
      class="damage-breakdown--attack">
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <div>
          <span class="font-bold text-secondary">
            {{ displayDamage(damage.totalDamage) }}
          </span>
          =
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.totalTalentValue * 100,
                10,
              )
            }}
          </span>
          ×
          <span class="text-primary">
            {{ damage.totalDamageContext.attack }}
          </span>
          × (1 +
          <span class="text-primary">
            {{
              displayPercentage(damage.totalDamageContext.totalDmgBonus * 100)
            }}
          </span>
          ) × (1 +
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.totalDeepenEffect * 100,
              )
            }}
          </span>
          ) × (1 +
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.specialMultiplier * 100,
              )
            }}
          </span>
          ) ×
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.defenseModifier * 100,
                10,
              )
            }}
          </span>
          ×
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.resistValue * 100) }}
          </span>
        </div>
      </div>
      <div class="divider mt-2"></div>
      <div class="mv-breakdown">
        <div class="total-mv">
          <div class="font-bold mt-2 text-lg text-primary">Total MV</div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            <span class="text-secondary font-bold">
              {{
                displayPercentage(
                  damage.totalDamageContext.totalTalentValue * 100,
                  2,
                )
              }}
            </span>
            = (
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.rawTotalTalent * 100,
                  2,
                )
              }}
            </span>
            +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierAdd * 100,
                )
              }}
            </span>
            ) × (1 +
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.talentModifierMultiply * 100,
                )
              }}
            </span>
            )
          </div>
        </div>
        <div class="defense-breakdown">
          <div class="font-bold mt-2 text-lg text-primary">
            Defense modifier
          </div>
          <div class="formula bg-base-200 p-2 rounded-md font-mono">
            <span class="text-secondary font-bold">
              {{
                displayPercentage(
                  damage.totalDamageContext.defenseModifier * 100,
                  10,
                )
              }}
            </span>
            = (800 + 8 ×
            <span class="text-primary">
              {{ damage.totalDamageContext.charLevel }}
            </span>
            ) / (800 + 8 ×
            <span class="text-primary">
              {{ damage.totalDamageContext.charLevel }}
            </span>
            + (8 ×
            <span class="text-primary">
              {{ damage.totalDamageContext.enemyLevel }}
            </span>
            + 792) (1 -
            <span class="text-primary">
              {{ displayPercentage(damage.totalDamageContext.defIgnore * 100) }}
            </span>
            ) × (1 -
            <span class="text-primary">
              {{
                displayPercentage(damage.totalDamageContext.defReduction * 100)
              }}
            </span>
            ))
          </div>
        </div>
        <div class="font-bold mt-2 text-lg text-primary">
          Resistance modifier
        </div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <span class="text-secondary font-bold">
            {{ displayPercentage(damage.totalDamageContext.resistValue * 100) }}
          </span>
          <template
            v-if="
              damage.totalDamageContext.enemyResist > 0 ||
              damage.totalDamageContext.enemyResist -
                damage.totalDamageContext.resistenceReduction >=
                0
            ">
            = 1 - (
            <span class="text-primary">
              {{
                displayPercentage(damage.totalDamageContext.enemyResist * 100)
              }}
            </span>
            -
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.resistenceReduction * 100,
                )
              }}
            </span>
            )
          </template>
          <template v-else>
            = 1 + (
            <span class="text-primary">
              {{
                displayPercentage(
                  damage.totalDamageContext.resistenceReduction * 100,
                )
              }}
            </span>
            -
            <span class="text-primary">
              {{
                displayPercentage(damage.totalDamageContext.enemyResist * 100)
              }}
            </span>
            ) / 2
          </template>
        </div>
      </div>
      <div class="total-dmg-bonus">
        <div class="font-bold mt-2 text-lg text-primary">Total DMG Bonus</div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <div class="font-bold text-secondary">
            {{
              displayPercentage(damage.totalDamageContext.totalDmgBonus * 100)
            }}
          </div>
        </div>
      </div>
      <div class="total-dmg-bonus">
        <div class="font-bold mt-2 text-lg text-primary">Total Amplify</div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <div class="font-bold text-secondary">
            {{
              displayPercentage(
                damage.totalDamageContext.totalDeepenEffect * 100,
              )
            }}
          </div>
        </div>
      </div>
      <div class="total-dmg-bonus">
        <div class="font-bold mt-2 text-lg text-primary">
          Total Special Multiplier (Vuln)
        </div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <div class="font-bold text-secondary">
            {{
              displayPercentage(
                damage.totalDamageContext.specialMultiplier * 100,
              )
            }}
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="crit-dmg">
        <div class="font-bold mt-2 text-lg text-primary">Crit Damage</div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <span class="font-bold text-secondary">
            {{ displayDamage(damage.critDamage) }}
          </span>
          =
          <span class="text-primary">
            {{ displayDamage(damage.totalDamage) }}
          </span>
          ×
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.critDamage * 100) }}
          </span>
        </div>
      </div>
      <div class="avg-dmg">
        <div class="font-bold mt-2 text-lg text-primary">Average Damage</div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <span class="font-bold text-secondary">
            {{ displayDamage(damage.avgDamage) }}
          </span>
          =
          <span class="text-primary">
            {{ displayDamage(damage.totalDamage) }}
          </span>
          × (1 +
          <template v-if="damage.totalDamageContext.critRate > 1">
            (
            <span class="text-primary">
              {{ displayPercentage(damage.totalDamageContext.critRate * 100) }}
            </span>
            -
            <span class="text-primary">
              {{
                displayPercentage(
                  (damage.totalDamageContext.critRate - 1) * 100,
                )
              }}
            </span>
            )
          </template>
          <template v-else>
            <span class="text-primary">
              {{ displayPercentage(damage.totalDamageContext.critRate * 100) }}
            </span>
          </template>
          × (
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.critDamage * 100) }}
          </span>
          - 1))
        </div>
      </div>
    </div>
    <div
      v-if="damage.totalDamageContext.type === 'tuneBreak'"
      class="damage-breakdown--tuneBreak">
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="font-bold text-secondary">
          {{ displayDamage(damage.totalDamage) }}
        </span>
        =
        <span class="text-primary">
          {{ damage.totalDamageContext.levelModifier }}
        </span>
        × (
        <span class="text-primary">
          1 +
          {{
            displayPercentage(
              damage.totalDamageContext.talentModifierMultiply * 100,
              2,
            )
          }}
        </span>
        ) ×
        × (
        <span class="text-primary">
          1 +
          {{
            displayPercentage(
              damage.totalDamageContext.specialMultiplier * 100,
              2,
            )
          }}
        </span>
        ) ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.totalTalent * 100, 2)
          }}
        </span>
        ×
        <span class="text-primary">
          {{
            displayPercentage(
              damage.totalDamageContext.defenseModifier * 100,
              10,
            )
          }}
        </span>
        ×
        <span class="text-primary">
          {{
            displayPercentage(damage.totalDamageContext.resistModifier * 100)
          }}
        </span>
        × (
        <span class="text-primary">
          1 +
          {{ displayPercentage(damage.totalDamageContext.bonusDmg * 100) }}
        </span>
        ) ×
        <span class="text-primary">
          {{ damage.totalDamageContext.enemyTypeMultiplier }}
        </span>
        × (
        <span class="text-primary">
          1 +
          {{
            displayPercentage(damage.totalDamageContext.tuneBreakBoost * 100)
          }}
        </span>
        )
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Level Modifier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{ damage.totalDamageContext.levelModifier }}
        </span>
      </div>
      <div class="font-bold mt-2 text-lg text-primary">DMG Multiplier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(
              damage.totalDamageContext.talentModifierMultiply * 100,
              2,
            )
          }}
        </span>
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Tune AMP</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{ damage.totalDamageContext.talent }}
        </span>
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Defense modifier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(
              damage.totalDamageContext.defenseModifier * 100,
              10,
            )
          }}
        </span>
        = (800 + 8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.charLevel }}
        </span>
        ) / (800 + 8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.charLevel }}
        </span>
        + (8 ×
        <span class="text-primary">
          {{ damage.totalDamageContext.enemyLevel }}
        </span>
        + 792) × (1 -
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.defIgnore * 100) }}
        </span>
        ) × (1 -
        <span class="text-primary">
          {{ displayPercentage(damage.totalDamageContext.defReduction * 100) }}
        </span>
        ))
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Resistance modifier</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(damage.totalDamageContext.resistModifier * 100)
          }}
        </span>
        <template
          v-if="
            damage.totalDamageContext.enemyResist > 0 ||
            damage.totalDamageContext.enemyResist -
              damage.totalDamageContext.resistenceReduction >=
              0
          ">
          = 1 - (
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}
          </span>
          -
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.resistenceReduction * 100,
              )
            }}
          </span>
          )
        </template>
        <template v-else>
          = 1 + (
          <span class="text-primary">
            {{
              displayPercentage(
                damage.totalDamageContext.resistenceReduction * 100,
              )
            }}
          </span>
          -
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.enemyResist * 100) }}
          </span>
          ) / 2
        </template>
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Bonus DMG</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{ displayPercentage(damage.totalDamageContext.bonusDmg * 100) }}
        </span>
      </div>
      <div class="font-bold mt-2 text-lg text-primary">
        Enemy Type Multiplier
      </div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{ damage.totalDamageContext.enemyTypeMultiplier }}
        </span>
      </div>
      <div class="font-bold mt-2 text-lg text-primary">Tune Break Boost</div>
      <div class="formula bg-base-200 p-2 rounded-md font-mono">
        <span class="text-secondary font-bold">
          {{
            displayPercentage(damage.totalDamageContext.tuneBreakBoost * 100)
          }}
        </span>
      </div>
      <div class="divider"></div>
      <div class="crit-dmg">
        <div class="font-bold mt-2 text-lg text-primary">Crit Damage</div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <span class="font-bold text-secondary">
            {{ displayDamage(damage.critDamage) }}
          </span>
          =
          <span class="text-primary">
            {{ displayDamage(damage.totalDamage) }}
          </span>
          ×
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.critDamage * 100) }}
          </span>
        </div>
      </div>
      <div class="avg-dmg">
        <div class="font-bold mt-2 text-lg text-primary">Average Damage</div>
        <div class="formula bg-base-200 p-2 rounded-md font-mono">
          <span class="font-bold text-secondary">
            {{ displayDamage(damage.avgDamage) }}
          </span>
          =
          <span class="text-primary">
            {{ displayDamage(damage.totalDamage) }}
          </span>
          × (1 +
          <template v-if="damage.totalDamageContext.critRate > 1">
            (
            <span class="text-primary">
              {{ displayPercentage(damage.totalDamageContext.critRate * 100) }}
            </span>
            -
            <span class="text-primary">
              {{
                displayPercentage(
                  (damage.totalDamageContext.critRate - 1) * 100,
                )
              }}
            </span>
            )
          </template>
          <template v-else>
            <span class="text-primary">
              {{ displayPercentage(damage.totalDamageContext.critRate * 100) }}
            </span>
          </template>
          × (
          <span class="text-primary">
            {{ displayPercentage(damage.totalDamageContext.critDamage * 100) }}
          </span>
          - 1))
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { displayDamage, displayInt } from "../utils/numbers";
import { displayPercentage } from "../utils/numbers";
export default {
  name: "CalculatorDamageBreakdown",
  props: {
    character: {
      type: String,
      required: true,
    },
    attackKey: {
      type: String,
      required: true,
    },
    attackLabel: {
      type: String,
      required: true,
    },
    damage: {
      type: Object,
      required: true,
    },
  },
  methods: {
    displayDamage,
    displayPercentage,
    displayInt,
  },
};
</script>
