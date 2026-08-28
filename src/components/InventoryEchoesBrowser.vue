<template>
  <InventoryEchoEditPanel
    v-if="isLiveResultBarEnabled"
    ref="inventoryEchoEditRef"></InventoryEchoEditPanel>
  <InventoryEchoEdit v-else ref="inventoryEchoEditRef"></InventoryEchoEdit>
  <CalculatorEchoImporter
    ref="echoesImporter"
    inventory-only></CalculatorEchoImporter>
  <CalculatorEchoRatingGuide ref="echoRatingGuide"></CalculatorEchoRatingGuide>
  <EchoRatingWeightsEditor
    ref="echoRatingWeightsEditor"></EchoRatingWeightsEditor>
  <div class="py-4">
    <div
      class="echoes__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
      <h3 class="text-sm font-semibold">Inventory</h3>
      <div class="flex flex-wrap items-center gap-2">
        <button class="btn btn-sm btn-primary" @click="createEcho">
          Add echo
        </button>
        <button class="btn btn-sm" @click="handleOpenEchoesImporter">
          Import echoes
        </button>
        <AppOverflowMenu
          aria-label="More inventory actions"
          data-test="inventory-overflow-menu">
          <li>
            <button type="button" @click="handleOpenWeightsEditor">
              Customize Rating Weights
            </button>
          </li>
          <li>
            <button type="button" @click="handleOpenRatingGuide">
              <span class="text-primary">Rating Guide</span>
            </button>
          </li>
          <li class="menu-title px-2 py-1"><hr class="border-base-300" /></li>
          <li>
            <button
              type="button"
              class="text-error"
              :disabled="trashEchoCount === 0"
              v-tooltip="
                'Permanently delete all echoes marked as trash. Locked echoes are skipped.'
              "
              data-test-delete-trash-echoes
              @click="deleteAllTrash">
              Delete trash ({{ trashEchoCount }})
            </button>
          </li>
        </AppOverflowMenu>
      </div>
    </div>

    <AppFilterPanel
      panel-key="inventory-echoes"
      class="mb-6"
      :active-count="activeFilterCount"
      :clear-disabled="!activeFilterCount"
      @clear="resetFilters">
      <!-- Diagnostics: these filter the list too, so they live here instead
           of competing with Add/Import for header space. -->
      <div class="echoes__filters__row flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium opacity-60 mr-1">Diagnostics</span>
        <button
          type="button"
          class="btn btn-sm btn-neutral"
          :class="{ 'btn-active btn-warning': duplicatesFilter }"
          v-tooltip="'Show only exact duplicate echoes in your inventory'"
          data-test-find-duplicates
          @click="toggleDuplicatesFilter">
          Find duplicates
          <span
            v-if="duplicateEchoCount > 0"
            class="badge badge-sm"
            :class="duplicatesFilter ? 'badge-neutral' : 'badge-warning'">
            {{ duplicateEchoCount }}
          </span>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-neutral"
          :class="{ 'btn-active btn-warning': incompleteFilter }"
          v-tooltip="
            'Show only echoes missing an echo, set, main stat, or a substat'
          "
          data-test-find-incomplete
          @click="toggleIncompleteFilter">
          Incomplete echoes
          <span
            v-if="incompleteEchoCount > 0"
            class="badge badge-sm"
            :class="incompleteFilter ? 'badge-neutral' : 'badge-warning'">
            {{ incompleteEchoCount }}
          </span>
        </button>
      </div>

      <!-- Basics: what the echo is -->
      <div class="echoes__filters__row flex flex-wrap items-center gap-2">
        <AppRichSelect
          v-model="costFilter"
          :options="costFilterOptions"
          allow-empty
          empty-label="Cost"
          aria-label="Cost filter"
          class="w-fit min-w-[150px]" />
        <AppRichSelect
          v-model="mainStatFilter"
          :options="mainStatFilterOptions"
          allow-empty
          empty-label="Main stat"
          aria-label="Main stat filter"
          class="w-fit min-w-[150px]" />
        <AppRichSelect
          v-model="echo"
          :options="echoSelectOptions"
          searchable
          allow-empty
          empty-label="Echo"
          aria-label="Echo filter"
          class="w-fit min-w-[200px]" />
      </div>

      <!-- Status flags -->
      <div class="echoes__filters__row flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium opacity-60 mr-1">Status</span>
        <div class="join">
          <button
            type="button"
            class="btn btn-sm btn-ghost join-item"
            :class="{ 'btn-active': favoriteFilter }"
            v-tooltip="'Show only favorite echoes'"
            aria-label="Show favorites only"
            data-test-filter-favorites
            @click="favoriteFilter = !favoriteFilter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-4"
              aria-hidden="true">
              <path
                v-if="favoriteFilter"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="currentColor" />
              <path
                v-else
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost join-item"
            :class="{ 'btn-active': lockedFilter }"
            v-tooltip="'Show only locked echoes'"
            aria-label="Show locked only"
            data-test-filter-locked
            @click="lockedFilter = !lockedFilter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="size-4"
              aria-hidden="true">
              <path
                d="M144 144c0-44.2 35.8-80 80-80c31.5 0 58.7 18.1 72 44.5c7.6 15.1 26.2 21.2 41.3 13.6s21.2-26.2 13.6-41.3C337.9 31.1 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48L64 192c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-16 0-16 0 0-48zm0 96l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z"
                fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost join-item"
            :class="{ 'btn-active text-error': trashFilter }"
            v-tooltip="'Show only echoes marked as trash'"
            aria-label="Show trash only"
            data-test-filter-trash
            @click="trashFilter = !trashFilter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              class="size-4"
              aria-hidden="true">
              <path
                d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l0 320c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320-64 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-96 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-64 0z"
                fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost join-item"
            :class="{ 'btn-active text-info': tempFilter }"
            v-tooltip="'Show only echoes marked as temporary'"
            aria-label="Show temporary only"
            data-test-filter-temp
            @click="tempFilter = !tempFilter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="size-4"
              aria-hidden="true">
              <circle
                cx="10"
                cy="10"
                r="8.5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5" />
              <line
                x1="10"
                y1="10"
                x2="10"
                y2="5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round" />
              <line
                x1="10"
                y1="10"
                x2="13.5"
                y2="12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round" />
            </svg>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-ghost join-item"
            :class="{ 'btn-active text-warning': ignoreFromOptimizerFilter }"
            v-tooltip="'Show only echoes excluded from the optimizer'"
            aria-label="Show ignored from optimizer only"
            data-test-filter-ignore-optimizer
            @click="ignoreFromOptimizerFilter = !ignoreFromOptimizerFilter">
            <EchoOptimizerVisibilityIcon :hidden="ignoreFromOptimizerFilter" />
          </button>
        </div>
      </div>

      <!-- Quality: CV / RV / Rating -->
      <div class="echoes__filters__row flex flex-wrap gap-6 w-full">
        <EchoCvRvRangeFilters
          v-model:cv-min="cvMin"
          v-model:cv-max="cvMax"
          v-model:rv-min="rvMin"
          v-model:rv-max="rvMax" />
        <EchoRatingRangeFilters
          v-model:rating-min="ratingMin"
          v-model:rating-max="ratingMax" />
      </div>

      <!-- Sets last -->
      <div class="echoes__filters__row flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium opacity-60 mr-1">Set</span>
        <div
          class="echoes__filters__sets echo-filters__sets flex flex-wrap"
          :class="{ 'echo-filters__sets--active': echoSet !== null }">
          <button
            v-for="setKey in echoSetsList"
            :key="setKey"
            type="button"
            @click="toggleEchoSetFilter(setKey)"
            class="rounded mr-1 p-[.3rem]"
            :class="[setKey, { 'btn-active': isEchoSetFilterActive(setKey) }]">
            <img
              :src="getEchoSetImage(setKey)"
              class="size-7"
              :class="setKey" />
          </button>
        </div>
      </div>
    </AppFilterPanel>
    <AppBulkActionBar
      :visible="hasSelection"
      :count="selectedEchoIds.length">
      <template #selection>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          @click="selectPage"
          data-test-bulk-select-page>
          Select page
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          @click="selectAllFiltered"
          data-test-bulk-select-all>
          Select all ({{ echoesList.length }})
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          @click="clearSelection"
          data-test-bulk-clear>
          Clear selection
        </button>
      </template>
      <div class="join">
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Favorite selected echoes'"
          aria-label="Favorite selected"
          data-test-bulk-favorite
          @click="bulkFavorite(true)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-4"
            aria-hidden="true">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Unfavorite selected echoes'"
          aria-label="Unfavorite selected"
          data-test-bulk-unfavorite
          @click="bulkFavorite(false)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="size-4"
            aria-hidden="true">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div class="join">
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Lock selected echoes'"
          aria-label="Lock selected"
          data-test-bulk-lock
          @click="bulkLock(true)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="size-4"
            aria-hidden="true">
            <path
              d="M144 144c0-44.2 35.8-80 80-80c31.5 0 58.7 18.1 72 44.5c7.6 15.1 26.2 21.2 41.3 13.6s21.2-26.2 13.6-41.3C337.9 31.1 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48L64 192c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-16 0-16 0 0-48zm0 96l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z"
              fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Unlock selected echoes'"
          aria-label="Unlock selected"
          data-test-bulk-unlock
          @click="bulkLock(false)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            class="size-4"
            aria-hidden="true">
            <path
              d="M384 192c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0 0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0zM224 80c-35.3 0-64 28.7-64 64l0 48 128 0 0-48c0-35.3-28.7-64-64-64z"
              fill="currentColor" />
          </svg>
        </button>
      </div>
      <div class="join">
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Mark selected echoes as trash'"
          data-test-bulk-trash
          @click="bulkTrash(true)">
          Mark trash
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Remove selected echoes from trash'"
          data-test-bulk-untrash
          @click="bulkTrash(false)">
          Unmark trash
        </button>
      </div>
      <div class="join">
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Mark selected echoes as temporary'"
          data-test-bulk-temp
          @click="bulkTemp(true)">
          Mark temp
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Unmark selected echoes as temporary'"
          data-test-bulk-untemp
          @click="bulkTemp(false)">
          Unmark temp
        </button>
      </div>
      <div class="join">
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Exclude selected echoes from the optimizer'"
          aria-label="Ignore selected from optimizer"
          data-test-bulk-ignore-optimizer
          @click="bulkIgnoreOptimizer(true)">
          <EchoOptimizerVisibilityIcon :hidden="true" />
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost join-item"
          v-tooltip="'Include selected echoes in the optimizer'"
          aria-label="Include selected in optimizer"
          data-test-bulk-include-optimizer
          @click="bulkIgnoreOptimizer(false)">
          <EchoOptimizerVisibilityIcon :hidden="false" />
        </button>
      </div>
      <div class="divider divider-horizontal mx-0 hidden sm:flex"></div>
      <button
        type="button"
        class="btn btn-sm btn-error"
        @click="bulkDelete"
        data-test-bulk-delete>
        Delete
      </button>
    </AppBulkActionBar>
    <div class="echoes__list">
      <template v-if="!echoesList.length">
        <div class="echoes__list--empty py-12 text-center w-full">
          No echoes found
          <template v-if="duplicatesFilter">
            <div class="mt-2 text-sm opacity-70">
              No exact duplicate echoes in your inventory.
            </div>
          </template>
          <template v-if="incompleteFilter">
            <div class="mt-2 text-sm opacity-70">
              No echoes are missing an echo, set, main stat, or a substat.
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="echoes__list__pagination flex justify-center py-4 items-center">
          <PaginationControls v-model="page" :total-pages="totalPages" />
        </div>
        <div
          class="echoes__list__items grid gap-4"
          :class="
            isCompact
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-1 md:grid-cols-2'
          ">
          <div
            v-for="echoRow in paginatedEchoesList"
            :key="echoRow.echoId"
            class="echo__item-wrap relative"
            :class="{ 'echo__item--selected': isSelected(echoRow.echoId) }">
            <label
              class="echo__item__select absolute top-0 left-0 z-10 flex items-center justify-center rounded-md p-1 cursor-pointer"
              :aria-label="`Select echo ${echoRow.echoId}`">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="isSelected(echoRow.echoId)"
                :data-test-echo-select="echoRow.echoId"
                @change="toggleSelect(echoRow.echoId)" />
            </label>
            <CalculatorEchoCard
              class="echo__item"
              v-bind="echoCardBinder(echoRow)"
              :hide-inventory="true"
              :compact="isCompact">
              <!-- Flag-on footer: status toggles (equipped-by, lock/trash-mark/
                   optimizer-ignore) and one-shot actions (Edit/Duplicate/Delete)
                   as two distinct clusters instead of one crowded button row —
                   see docs/adr/0014 decision #14. -->
              <div v-if="isLiveResultBarEnabled" class="echoes__item__foot flex items-center justify-between gap-2 flex-wrap">
                <div class="flex items-center gap-1.5 flex-wrap" data-test-echo-status-cluster>
                  <div v-if="getCharsEquipped(echoRow).length" class="avatar-group -space-x-6 rtl:space-x-reverse">
                    <div class="avatar" v-for="char in getCharsEquipped(echoRow)">
                      <div class="w-8 bg-accent-content">
                        <img :src="getCharImg(char)" />
                      </div>
                    </div>
                  </div>
                  <EchoLockTrashActions :echo-id="echoRow.echoId" />
                </div>
                <div class="flex items-center gap-1" data-test-echo-action-cluster>
                  <button
                    type="button"
                    class="btn btn-sm btn-square btn-primary"
                    v-tooltip="'Edit'"
                    aria-label="Edit"
                    @click="handleEditEcho(echoRow.echoId)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4" aria-hidden="true">
                      <path
                        d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c31.2-31.2 31.2-81.9 0-113.1L473.1 12.1C441.9-19.1 391.2-19.1 360 12.1L373.1 25zM64 32C28.7 32 0 60.7 0 96L0 448c0 35.3 28.7 64 64 64l352 0c35.3 0 64-28.7 64-64l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L64 480c-17.7 0-32-14.3-32-32L32 96c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 32z"
                        fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-square"
                    v-tooltip="'Duplicate'"
                    aria-label="Duplicate"
                    @click="duplicateEcho(echoRow.echoId)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-4" aria-hidden="true">
                      <path
                        d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"
                        fill="currentColor" />
                    </svg>
                  </button>
                  <span
                    v-tooltip="
                      echoRow.locked
                        ? 'This echo is locked and cannot be deleted'
                        : 'Delete this echo from your inventory'
                    ">
                    <button
                      type="button"
                      class="btn btn-sm btn-square btn-error"
                      aria-label="Delete"
                      :disabled="echoRow.locked"
                      @click="removeEcho(echoRow.echoId)">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="size-4" aria-hidden="true">
                        <path
                          d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l0 320c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320-64 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-96 0 0 48c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-48-64 0z"
                          fill="currentColor" />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>

              <!-- Flag-off footer — unchanged from before decision #14. -->
              <div v-else class="echoes__item__foot flex gap-2 justify-between items-center">
                <div class="echoes__items__foot__equipped">
                  <div class="avatar-group -space-x-6 rtl:space-x-reverse">
                    <div class="avatar" v-for="char in getCharsEquipped(echoRow)">
                      <div class="w-12 bg-accent-content">
                        <img :src="getCharImg(char)" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="echoes__item__foot__actions flex gap-2 items-center flex-wrap justify-end">
                  <EchoLockTrashActions :echo-id="echoRow.echoId" />
                  <button
                    @click="handleEditEcho(echoRow.echoId)"
                    class="btn btn-primary btn-sm min-w-16">
                    Edit
                  </button>
                  <button
                    @click="duplicateEcho(echoRow.echoId)"
                    class="btn btn-primary btn-sm min-w-16">
                    Duplicate
                  </button>
                  <span
                    v-tooltip="
                      echoRow.locked
                        ? 'This echo is locked and cannot be deleted'
                        : 'Delete this echo from your inventory'
                    ">
                    <button
                      @click="removeEcho(echoRow.echoId)"
                      class="btn btn-error btn-sm min-w-16"
                      :disabled="echoRow.locked">
                      Delete
                    </button>
                  </span>
                </div>
              </div>
            </CalculatorEchoCard>
          </div>
        </div>
        <div class="echoes__list__pagination flex justify-center py-4">
          <PaginationControls v-model="page" :total-pages="totalPages" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { mainEchoesData } from "../echoes/index.ts";

type MainEchoRow = (typeof mainEchoesData)[keyof typeof mainEchoesData];
type InventoryEchoRow = {
  echoId: string;
  locked?: boolean;
  trash?: boolean;
  temp?: boolean;
  ignoreFromOptimizer?: boolean;
  favorite?: boolean;
  rank?: number;
  type?: string | number | null;
  echoSet?: string | null;
  stat?: string | null;
  echo?: string | null;
  echoSubStatsType1?: string | null;
  echoSubStatsValue1?: unknown;
  echoSubStatsType2?: string | null;
  echoSubStatsValue2?: unknown;
  echoSubStatsType3?: string | null;
  echoSubStatsValue3?: unknown;
  echoSubStatsType4?: string | null;
  echoSubStatsValue4?: unknown;
  echoSubStatsType5?: string | null;
  echoSubStatsValue5?: unknown;
};
import {
  ECHO_CV_MAX,
  ECHO_RV_MAX,
  echoSetLabelMap,
  getEchoCritValue,
  getEchoRollValue,
  getEchoSetIconByType,
  getReadableSubStatLabel,
  statsTable,
} from "../echoes/stats";
import { useInventoryStore } from "../stores/inventory";
import { useSettingsStore } from "../stores/settings";
import { getEchoRatingGrade } from "../echoes/rating";
import CalculatorEchoCard from "./CalculatorEchoCard.vue";
import EchoCvRvRangeFilters from "./EchoCvRvRangeFilters.vue";
import EchoRatingRangeFilters from "./EchoRatingRangeFilters.vue";
import EchoLockTrashActions from "./EchoLockTrashActions.vue";
import EchoOptimizerVisibilityIcon from "./icons/EchoOptimizerVisibilityIcon.vue";
import InventoryEchoEdit from "./InventoryEchoEdit.vue";
import InventoryEchoEditPanel from "./InventoryEchoEditPanel.vue";
import CalculatorEchoImporter from "./CalculatorEchoImporter.vue";
import CalculatorEchoRatingGuide from "./CalculatorEchoRatingGuide.vue";
import EchoRatingWeightsEditor from "./EchoRatingWeightsEditor.vue";
import PaginationControls from "./PaginationControls.vue";
import AppRichSelect, {
  type AppRichSelectOption,
} from "./AppRichSelect.vue";
import AppOverflowMenu from "./AppOverflowMenu.vue";
import AppFilterPanel from "./AppFilterPanel.vue";
import AppBulkActionBar from "./AppBulkActionBar.vue";
import {
  buildEchoSelectOptions,
  buildSimpleSelectOptions,
} from "../utils/richSelectOptions";
import { randomString } from "../utils/strings";
import { getEchoIdentityKey } from "../utils/echoIdentity";
import { useConfirm } from "../composables/useConfirm";
import { useEchoInventory } from "../composables/useEchoInventory";
import { useToast } from "../composables/useToast";
import { useUiDensity } from "../composables/useUiDensity";

const { confirm } = useConfirm();
const { showToast } = useToast();
const { isCompact } = useUiDensity();
const {
  trashEchoes,
  trashEchoCount,
  getEchoFlags,
  removeEchoFully,
  removeEchoesFully,
  removeAllTrashEchoes,
  bulkSetLocked,
  bulkSetTrash,
  bulkSetTemp,
  bulkSetIgnoreFromOptimizer,
  bulkSetFavorite,
} = useEchoInventory();

const inventoryEchoEditRef = ref<
  | InstanceType<typeof InventoryEchoEdit>
  | InstanceType<typeof InventoryEchoEditPanel>
  | null
>(null);
const isLiveResultBarEnabled = computed(
  () => settingsStore.labs?.liveResultBar?.isEnabled ?? false,
);
const echoesImporter = ref<InstanceType<typeof CalculatorEchoImporter> | null>(
  null,
);
const echoRatingGuide = ref<any>(null);
const echoRatingWeightsEditor = ref<any>(null);

const echoSet = ref<string | null>(null);
const echo = ref<string | null>(null);
const costFilter = ref<number | null>(null);
const mainStatFilter = ref<string | null>(null);
const lockedFilter = ref(false);
const trashFilter = ref(false);
const tempFilter = ref(false);
const ignoreFromOptimizerFilter = ref(false);
const favoriteFilter = ref(false);
const duplicatesFilter = ref(false);
const incompleteFilter = ref(false);
const cvMin = ref(0);
const cvMax = ref(ECHO_CV_MAX);
const rvMin = ref(0);
const rvMax = ref(ECHO_RV_MAX);
// Matches the 0-100% shown on the Echo Rating badge itself.
const RATING_PERCENT_MIN = 0;
const RATING_PERCENT_MAX = 100;
const ratingMin = ref(RATING_PERCENT_MIN);
const ratingMax = ref(RATING_PERCENT_MAX);
const selectedEchoIds = ref<string[]>([]);
const hasSelection = computed(() => selectedEchoIds.value.length > 0);
const activeFilterCount = computed(() => {
  let count = 0;
  if (echoSet.value) count += 1;
  if (echo.value) count += 1;
  if (costFilter.value) count += 1;
  if (mainStatFilter.value) count += 1;
  if (lockedFilter.value) count += 1;
  if (trashFilter.value) count += 1;
  if (tempFilter.value) count += 1;
  if (ignoreFromOptimizerFilter.value) count += 1;
  if (favoriteFilter.value) count += 1;
  if (duplicatesFilter.value) count += 1;
  if (incompleteFilter.value) count += 1;
  if (cvMin.value > 0 || cvMax.value < ECHO_CV_MAX) count += 1;
  if (rvMin.value > 0 || rvMax.value < ECHO_RV_MAX) count += 1;
  if (ratingMin.value > RATING_PERCENT_MIN || ratingMax.value < RATING_PERCENT_MAX) count += 1;
  return count;
});
const page = ref(1);
const perPage = 20;

const inventoryStore = useInventoryStore();
const settingsStore = useSettingsStore();
const { echoes } = storeToRefs(inventoryStore);
const { getEchoEquippedChars, saveEcho, getEchoById } = inventoryStore;

const duplicateIdentityCounts = computed(() => {
  const counts = new Map<string, number>();
  for (const inventoryEcho of (echoes.value ?? []) as InventoryEchoRow[]) {
    if (!inventoryEcho.echo) {
      continue;
    }
    const key = getEchoIdentityKey(inventoryEcho);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
});

const duplicateEchoCount = computed(() => {
  let count = 0;
  for (const inventoryEcho of (echoes.value ?? []) as InventoryEchoRow[]) {
    if (!inventoryEcho.echo) {
      continue;
    }
    if ((duplicateIdentityCounts.value.get(getEchoIdentityKey(inventoryEcho)) ?? 0) > 1) {
      count += 1;
    }
  }
  return count;
});

function isEchoIncomplete(e: InventoryEchoRow) {
  if (!e.echo) return true;
  if (!e.echoSet) return true;
  if (!e.stat || e.stat === "none") return true;
  const subStatTypes = [
    e.echoSubStatsType1,
    e.echoSubStatsType2,
    e.echoSubStatsType3,
    e.echoSubStatsType4,
    e.echoSubStatsType5,
  ];
  const filledSubStatCount = subStatTypes.filter(
    (t) => t && t !== "none",
  ).length;
  return filledSubStatCount < 5;
}

const incompleteEchoCount = computed(() => {
  let count = 0;
  for (const inventoryEcho of (echoes.value ?? []) as InventoryEchoRow[]) {
    if (isEchoIncomplete(inventoryEcho)) {
      count += 1;
    }
  }
  return count;
});

watch(
  [
    mainStatFilter,
    echoSet,
    echo,
    costFilter,
    lockedFilter,
    trashFilter,
    tempFilter,
    ignoreFromOptimizerFilter,
    favoriteFilter,
    duplicatesFilter,
    incompleteFilter,
    cvMin,
    cvMax,
    rvMin,
    rvMax,
  ],
  () => {
    page.value = 1;
  },
);

const echoSetsList = computed(() => Object.keys(echoSetLabelMap));

const echoesList = computed(() => {
  let allEchoes = (echoes.value ?? []) as InventoryEchoRow[];
  if (allEchoes.length <= 0) {
    return allEchoes;
  }
  if (echoSet.value) {
    allEchoes = allEchoes.filter((e) => e.echoSet === echoSet.value);
  }
  if (echo.value) {
    allEchoes = allEchoes.filter((e) => e.echo === echo.value);
  }
  if (costFilter.value) {
    allEchoes = allEchoes.filter((e) => e.type === costFilter.value);
  }
  if (mainStatFilter.value) {
    allEchoes = allEchoes.filter((e) => e.stat === mainStatFilter.value);
  }
  if (lockedFilter.value) {
    allEchoes = allEchoes.filter((e) => e.locked);
  }
  if (trashFilter.value) {
    allEchoes = allEchoes.filter((e) => e.trash);
  }
  if (tempFilter.value) {
    allEchoes = allEchoes.filter((e) => e.temp);
  }
  if (ignoreFromOptimizerFilter.value) {
    allEchoes = allEchoes.filter((e) => e.ignoreFromOptimizer);
  }
  if (favoriteFilter.value) {
    allEchoes = allEchoes.filter((e) => e.favorite);
  }
  if (duplicatesFilter.value) {
    allEchoes = allEchoes.filter((e) => {
      if (!e.echo) {
        return false;
      }
      return (duplicateIdentityCounts.value.get(getEchoIdentityKey(e)) ?? 0) > 1;
    });
    allEchoes = allEchoes
      .slice()
      .sort((a, b) =>
        getEchoIdentityKey(a).localeCompare(getEchoIdentityKey(b)),
      );
  }
  if (incompleteFilter.value) {
    allEchoes = allEchoes.filter((e) => isEchoIncomplete(e));
  }
  const cvFilterActive = cvMin.value > 0 || cvMax.value < ECHO_CV_MAX;
  const rvFilterActive = rvMin.value > 0 || rvMax.value < ECHO_RV_MAX;
  const ratingFilterActive =
    ratingMin.value > RATING_PERCENT_MIN || ratingMax.value < RATING_PERCENT_MAX;
  if (cvFilterActive || rvFilterActive || ratingFilterActive) {
    allEchoes = allEchoes.filter((e) => {
      if (cvFilterActive) {
        const cv = getEchoCritValue(e);
        if (cv < cvMin.value || cv > cvMax.value) return false;
      }
      if (rvFilterActive) {
        const rv = getEchoRollValue(e);
        if (rv < rvMin.value || rv > rvMax.value) return false;
      }
      if (ratingFilterActive) {
        const { percent } = getEchoRatingGrade(e, settingsStore.echoRatingWeights);
        if (percent < ratingMin.value || percent > ratingMax.value) return false;
      }
      return true;
    });
  }
  return allEchoes;
});

const paginatedEchoesList = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = page.value * perPage;
  return echoesList.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(echoesList.value.length / perPage),
);

const mainEchoesDataComputed = computed(() => ({ ...mainEchoesData }));

const mainEchoOptions = computed(() => {
  const buckets: Record<MainEchoRow["class"], MainEchoRow[]> = {
    Calamity: [],
    Overlord: [],
    Elite: [],
    Common: [],
  };
  const mainEchoValues = Object.values(mainEchoesDataComputed.value);
  mainEchoValues.forEach((e) => {
    if (e?.class && buckets[e.class]) {
      buckets[e.class].push(e);
    }
  });
  return buckets;
});

const allMainStats = computed(() => {
  const fourSlotOptions = Object.keys(statsTable["4"]);
  const threeSlotOptions = Object.keys(statsTable["3"]);
  const oneSlotOptions = Object.keys(statsTable["1"]);
  const allOptions = [
    ...fourSlotOptions,
    ...threeSlotOptions,
    ...oneSlotOptions,
  ];
  return [...new Set(allOptions)];
});

const costFilterOptions = buildSimpleSelectOptions(
  [4, 3, 1],
  (cost) => `${cost} Cost`,
);
const mainStatFilterOptions = computed((): AppRichSelectOption[] =>
  buildSimpleSelectOptions(allMainStats.value, (stat) =>
    getReadableSubStatLabel(String(stat)),
  ),
);
const echoSelectOptions = computed((): AppRichSelectOption[] =>
  buildEchoSelectOptions(mainEchoOptions.value),
);

function getEchoSetImage(set: string) {
  return getEchoSetIconByType(set);
}

function toggleEchoSetFilter(set: string) {
  echoSet.value = echoSet.value === set ? null : set;
}

function isEchoSetFilterActive(set: string) {
  return echoSet.value === set;
}

function echoCardBinder(e: InventoryEchoRow) {
  const str = (v: unknown) => (v == null ? "" : String(v));
  const numish = (v: unknown): number | string =>
    v == null ? 0 : (v as number | string);
  return {
    rank: e.rank ?? 5,
    type: str(e.type),
    echoId: e.echoId,
    echoSet: str(e.echoSet),
    stat: str(e.stat),
    echo: str(e.echo),
    echoSubStatsType1: str(e.echoSubStatsType1),
    echoSubStatsValue1: numish(e.echoSubStatsValue1),
    echoSubStatsType2: str(e.echoSubStatsType2),
    echoSubStatsValue2: numish(e.echoSubStatsValue2),
    echoSubStatsType3: str(e.echoSubStatsType3),
    echoSubStatsValue3: numish(e.echoSubStatsValue3),
    echoSubStatsType4: str(e.echoSubStatsType4),
    echoSubStatsValue4: numish(e.echoSubStatsValue4),
    echoSubStatsType5: str(e.echoSubStatsType5),
    echoSubStatsValue5: numish(e.echoSubStatsValue5),
  };
}

function handleEditEcho(echoId: string) {
  inventoryEchoEditRef.value?.setEchoId(echoId);
  inventoryEchoEditRef.value?.handleOpenModal();
}

function toggleDuplicatesFilter() {
  duplicatesFilter.value = !duplicatesFilter.value;
}

function toggleIncompleteFilter() {
  incompleteFilter.value = !incompleteFilter.value;
}

function resetFilters() {
  echoSet.value = null;
  echo.value = null;
  mainStatFilter.value = null;
  costFilter.value = null;
  lockedFilter.value = false;
  trashFilter.value = false;
  tempFilter.value = false;
  ignoreFromOptimizerFilter.value = false;
  favoriteFilter.value = false;
  duplicatesFilter.value = false;
  incompleteFilter.value = false;
  cvMin.value = 0;
  cvMax.value = ECHO_CV_MAX;
  rvMin.value = 0;
  rvMax.value = ECHO_RV_MAX;
  ratingMin.value = RATING_PERCENT_MIN;
  ratingMax.value = RATING_PERCENT_MAX;
}

function isSelected(echoId: string) {
  return selectedEchoIds.value.includes(echoId);
}

function toggleSelect(echoId: string) {
  if (isSelected(echoId)) {
    selectedEchoIds.value = selectedEchoIds.value.filter((id) => id !== echoId);
  } else {
    selectedEchoIds.value = [...selectedEchoIds.value, echoId];
  }
}

function clearSelection() {
  selectedEchoIds.value = [];
}

function selectPage() {
  const pageIds = paginatedEchoesList.value.map((e) => e.echoId);
  selectedEchoIds.value = [
    ...new Set([...selectedEchoIds.value, ...pageIds]),
  ];
}

function selectAllFiltered() {
  selectedEchoIds.value = echoesList.value.map((e) => e.echoId);
}

function bulkFavorite(favorite: boolean) {
  bulkSetFavorite(selectedEchoIds.value, favorite);
  showToast(
    favorite
      ? `Favorited ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`
      : `Unfavorited ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`,
    "success",
  );
}

function bulkLock(locked: boolean) {
  bulkSetLocked(selectedEchoIds.value, locked);
  showToast(
    locked
      ? `Locked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`
      : `Unlocked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"}.`,
    "success",
  );
}

function bulkTrash(trash: boolean) {
  bulkSetTrash(selectedEchoIds.value, trash);
  showToast(
    trash
      ? `Marked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} as trash.`
      : `Unmarked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} as trash.`,
    "success",
  );
}

function bulkTemp(temp: boolean) {
  bulkSetTemp(selectedEchoIds.value, temp);
  showToast(
    temp
      ? `Marked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} as temporary.`
      : `Unmarked ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} as temporary.`,
    "success",
  );
}

function bulkIgnoreOptimizer(ignore: boolean) {
  bulkSetIgnoreFromOptimizer(selectedEchoIds.value, ignore);
  showToast(
    ignore
      ? `Excluded ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} from optimizer.`
      : `Included ${selectedEchoIds.value.length} echo${selectedEchoIds.value.length === 1 ? "" : "es"} in optimizer.`,
    "success",
  );
}

function describeEcho(e: { echo?: string | null; type?: unknown; rank?: number }) {
  const key = e.echo ? String(e.echo) : null;
  const name = (key && mainEchoesData[key as keyof typeof mainEchoesData]?.name) || key || "Unknown echo";
  const cost = e.type != null && e.type !== "" ? `${e.type} Cost` : null;
  const rank = e.rank != null ? `Rank ${e.rank}` : null;
  const details = [cost, rank].filter(Boolean).join(", ");
  return details ? `${name} (${details})` : name;
}

async function bulkDelete() {
  const ids = [...selectedEchoIds.value];
  if (!ids.length) return;

  const lockedCount = ids.filter((id) => getEchoFlags(id).locked).length;
  const deletableIds = ids.filter((id) => !getEchoFlags(id).locked);
  const deletableCount = deletableIds.length;
  if (deletableCount <= 0) {
    showToast("All selected echoes are locked and cannot be deleted.", "warning");
    return;
  }

  const lockedNote =
    lockedCount > 0
      ? ` ${lockedCount} locked echo${lockedCount === 1 ? "" : "es"} will be skipped.`
      : "";
  const confirmed = await confirm(
    `Delete ${deletableCount} echo${deletableCount === 1 ? "" : "es"}? This cannot be undone.${lockedNote}`,
    {
      title: "Delete selected echoes",
      confirmLabel: "Delete",
      variant: "error",
      items: deletableIds.map((id) => describeEcho(getEchoById(id) ?? {})),
    },
  );
  if (!confirmed) return;

  const { deleted, skippedLocked } = await removeEchoesFully(ids);
  clearSelection();
  if (deleted > 0) {
    showToast(
      `Deleted ${deleted} echo${deleted === 1 ? "" : "es"}${
        skippedLocked
          ? ` (${skippedLocked} locked skipped)`
          : ""
      }.`,
      "success",
    );
  } else if (skippedLocked > 0) {
    showToast("No echoes deleted; all selected were locked.", "warning");
  }
}

function getCharsEquipped(e: { echoId: string }) {
  return getEchoEquippedChars(e.echoId);
}

function getCharImg(character: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${character}.png`;
}

async function removeEcho(echoId: string) {
  const { locked } = getEchoFlags(echoId);
  if (locked) {
    showToast("This echo is locked and cannot be deleted.", "warning");
    return;
  }

  const confirmed = await confirm("Do you really want to delete this echo?", {
    title: "Delete echo",
    confirmLabel: "Delete",
    variant: "error",
  });
  if (!confirmed) return;

  await removeEchoFully(echoId);
  selectedEchoIds.value = selectedEchoIds.value.filter((id) => id !== echoId);
}

async function deleteAllTrash() {
  const count = trashEchoCount.value;
  if (count <= 0) return;

  const confirmed = await confirm(
    `Delete ${count} echo${count === 1 ? "" : "es"} marked as trash? This cannot be undone.`,
    {
      title: "Delete trash echoes",
      confirmLabel: "Delete all",
      variant: "error",
      items: trashEchoes.value.map((e: InventoryEchoRow) => describeEcho(e)),
    },
  );
  if (!confirmed) return;

  const deletedCount = await removeAllTrashEchoes();
  if (deletedCount > 0) {
    clearSelection();
    showToast(
      `Deleted ${deletedCount} trash echo${deletedCount === 1 ? "" : "es"}.`,
      "success",
    );
  }
}

async function duplicateEcho(sourceEchoId: string) {
  const source = getEchoById(sourceEchoId);
  if (!source) return;

  const echoId = randomString();
  await saveEcho({
    ...source,
    echoId,
    locked: false,
    trash: false,
    temp: false,
    ignoreFromOptimizer: false,
    favorite: false,
  });
}

async function createEcho() {
  const echoId = randomString();
  const echoData = {
    echo: null,
    type: null,
    rank: 5,
    stat: null,
    echoId,
    echoSet: null,
    echoSubStatsType1: null,
    echoSubStatsValue1: null,
    echoSubStatsType2: null,
    echoSubStatsValue2: null,
    echoSubStatsType3: null,
    echoSubStatsValue3: null,
    echoSubStatsType4: null,
    echoSubStatsValue4: null,
    echoSubStatsType5: null,
    echoSubStatsValue5: null,
  };
  await saveEcho(echoData);
  handleEditEcho(echoId);
}

function handleOpenEchoesImporter() {
  echoesImporter.value?.triggerOpenModal();
}

function handleOpenRatingGuide() {
  echoRatingGuide.value?.triggerOpenModal?.();
}

function handleOpenWeightsEditor() {
  echoRatingWeightsEditor.value?.triggerOpenModal?.({ mode: "global" });
}
</script>

<style lang="scss" scoped>
html[data-theme-style="light"] {
  .modal-backdrop {
    opacity: 0.5;
  }
}
.echo__item--selected {
  outline: 2px solid oklch(var(--p));
  outline-offset: 2px;
  border-radius: var(--rounded-box, 1rem);
}
.echo-filters__sets--active {
  button {
    opacity: 0.6;
  }
  button.btn-active {
    opacity: 1;
  }
}
</style>
