<template>
  <Nav cur-page="team-rotations" :disable-mobile-nav="true"></Nav>
  <div class="page-team-rotations w-full px-4 py-6 md:px-6 lg:px-10 text-base-content">
    <template v-if="!selectedTeamId">
      <header class="mb-6 max-w-4xl">
        <h1 class="text-2xl md:text-3xl font-semibold mb-2">Team Rotations</h1>
        <p class="text-base-content/80 text-sm md:text-base">
          Build a team of up to 3 characters, chain together their actions into a
          rotation, and see the team's total damage and DPS.
        </p>
      </header>

      <div class="teams__header flex flex-wrap items-center justify-between gap-4 mb-4 rounded-lg bg-base-200 p-1 pl-3">
        <h3 class="text-sm font-semibold">Teams</h3>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-test-team-rotations-new
            @click="handleCreateTeam">
            + New Team
          </button>
          <AppOverflowMenu
            aria-label="More team actions"
            data-test="team-rotations-overflow-menu">
            <li>
              <button
                type="button"
                data-test-team-rotations-toggle-import
                @click="isImportOpen = true">
                Import Team
              </button>
            </li>
            <li>
              <button
                type="button"
                data-test-team-rotations-toggle-presets
                @click="isPresetsOpen = true">
                List Presets
              </button>
            </li>
          </AppOverflowMenu>
        </div>
      </div>

      <AppFilterPanel
        panel-key="team-rotations"
        class="mb-4"
        :active-count="activeFilterCount"
        :clear-disabled="!activeFilterCount"
        @clear="clearFilters">
        <template #bar>
          <div class="join" data-test-team-rotations-view-toggle>
            <button
              type="button"
              class="btn btn-sm join-item"
              :class="{ 'btn-active': viewMode === 'grid' }"
              title="Grid view"
              aria-label="Grid view"
              data-test-team-rotations-view-grid
              @click="viewMode = 'grid'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4">
                <path
                  d="M0 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32L0 96zM0 416c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32L32 608c-17.7 0-32-14.3-32-32l0-160zM288 96c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-160zM288 416c0-17.7 14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32l-160 0c-17.7 0-32-14.3-32-32l0-160z"
                  fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              class="btn btn-sm join-item"
              :class="{ 'btn-active': viewMode === 'list' }"
              title="List view"
              aria-label="List view"
              data-test-team-rotations-view-list
              @click="viewMode = 'list'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4">
                <path
                  d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"
                  fill="currentColor" />
              </svg>
            </button>
          </div>
        </template>

        <div class="flex items-center gap-2 flex-wrap">
          <AppRichSelect
            v-model="characterFilter"
            class="w-48"
            :options="characterFilterOptions"
            searchable
            allow-empty
            empty-label="Filter by character"
            placeholder="Filter by character"
            aria-label="Filter teams by character"
            size="sm"
            data-test-team-rotations-filter />
          <div class="w-48">
            <AppRichSelect
              v-model="statusFilter"
              :options="statusFilterOptions"
              allow-empty
              empty-label="All statuses"
              aria-label="Filter teams by status"
              size="sm"
              data-test-team-rotations-status-filter>
              <template #selected="{ option }">
                <span class="flex items-center gap-1.5 min-w-0">
                  <span
                    v-if="option?.dotClass"
                    class="size-2 rounded-full shrink-0"
                    :class="String(option.dotClass)"></span>
                  <span class="truncate">{{ option?.label ?? "All statuses" }}</span>
                </span>
              </template>
              <template #option="{ option }">
                <span
                  v-if="option.dotClass"
                  class="size-2 rounded-full shrink-0"
                  :class="String(option.dotClass)"></span>
                <span>{{ option.label }}</span>
              </template>
            </AppRichSelect>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-ghost rounded inline-flex items-center gap-1.5 px-2"
            :class="{ 'btn-active': favoritesFilter }"
            data-test-team-rotations-favorites-filter
            @click="favoritesFilter = !favoritesFilter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-4 shrink-0"
              aria-hidden="true">
              <path
                v-if="favoritesFilter"
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
            <span>Favorites</span>
          </button>
        </div>
      </AppFilterPanel>

      <div
        v-if="!teams.length"
        class="teams__empty flex flex-col items-center justify-center text-center py-16 px-4 rounded-lg bg-base-200/60"
        data-test-team-rotations-empty>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          class="size-14 opacity-40 mb-4"
          fill="currentColor">
          <path
            d="M320 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160zM96 224a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM640 288a64 64 0 1 1 -128 0 64 64 0 1 1 128 0zM144 480c0-53 43-96 96-96l160 0c53 0 96 43 96 96l0 16c0 17.7-14.3 32-32 32L176 528c-17.7 0-32-14.3-32-32l0-16zM48 528c-8.8 0-16-7.2-16-16l0-16c0-38.2 21.4-71.4 52.9-88.2C82 415.4 80 423.5 80 432l0 96c0 5.6 .9 11 2.6 16L48 528zM592 528l-34.6 0c1.7-5 2.6-10.4 2.6-16l0-96c0-8.5-2-16.6-5.5-23.8C586.6 408.6 608 441.8 608 480l0 16c0 8.8-7.2 16-16 16z" />
        </svg>
        <h2 class="text-lg font-semibold mb-1">No teams yet</h2>
        <p class="text-base-content/70 mb-4 max-w-md">
          Create a team of up to 3 characters to start building a rotation and see
          its total damage and DPS.
        </p>
        <button type="button" class="btn btn-primary btn-sm" @click="handleCreateTeam">
          + New Team
        </button>
      </div>

      <div
        v-else-if="!filteredTeams.length"
        class="teams__empty flex flex-col items-center justify-center text-center py-16 px-4 rounded-lg bg-base-200/60"
        data-test-team-rotations-no-matches>
        <p class="text-base-content/70">No teams found with that character.</p>
      </div>

      <template v-else>
        <div
          class="teams__summary mb-6 rounded-lg bg-base-200 p-4"
          data-test-team-rotations-summary>
          <div class="flex items-center justify-between gap-2 flex-wrap mb-3">
            <h3 class="text-sm font-semibold">All Teams Summary</h3>
            <div class="flex items-center gap-2">
              <span class="text-xs opacity-70">Sort teams by:</span>
              <div class="join" data-test-team-rotations-sort-metric>
              <input
                v-model="sortMetric"
                value="normal"
                class="join-item btn btn-xs"
                type="radio"
                name="team-sort-metric"
                aria-label="Normal" />
              <input
                v-model="sortMetric"
                value="avg"
                class="join-item btn btn-xs"
                type="radio"
                name="team-sort-metric"
                aria-label="Average" />
              <input
                v-model="sortMetric"
                value="crit"
                class="join-item btn btn-xs"
                type="radio"
                name="team-sort-metric"
                aria-label="Crit" />
              <input
                v-model="sortMetric"
                value="name"
                class="join-item btn btn-xs"
                type="radio"
                name="team-sort-metric"
                aria-label="Name (A-Z)" />
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 text-sm">
            <button
              v-if="strongestTeamByDamage"
              type="button"
              class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
              data-test-team-rotations-leaderboard="damage"
              @click="selectedTeamId = strongestTeamByDamage!.team.id; showSummary = false">
              <div class="text-xs opacity-70 mb-1">Strongest Team (Dmg)</div>
              <div class="font-semibold truncate">{{ strongestTeamByDamage.team.name }}</div>
              <div>{{ displayDamage(strongestTeamByDamage.value) }}</div>
            </button>
            <button
              v-if="bestDpsTeam"
              type="button"
              class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
              data-test-team-rotations-leaderboard="dps"
              @click="selectedTeamId = bestDpsTeam!.team.id; showSummary = false">
              <div class="text-xs opacity-70 mb-1">Best DPS</div>
              <div class="font-semibold truncate">{{ bestDpsTeam.team.name }}</div>
              <div>{{ displayDamage(bestDpsTeam.value) }}</div>
            </button>
            <button
              v-if="strongestHitTeam"
              type="button"
              class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
              data-test-team-rotations-leaderboard="strongest-hit"
              @click="selectedTeamId = strongestHitTeam!.team.id; showSummary = false">
              <div class="text-xs opacity-70 mb-1">Strongest Hit</div>
              <div class="font-semibold truncate">{{ strongestHitTeam.team.name }}</div>
              <div>{{ displayDamage(strongestHitTeam.value) }}</div>
            </button>
            <button
              v-if="mostHealingTeam"
              type="button"
              class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
              data-test-team-rotations-leaderboard="healing"
              @click="selectedTeamId = mostHealingTeam!.team.id; showSummary = false">
              <div class="text-xs opacity-70 mb-1">Most Healing</div>
              <div class="font-semibold truncate">{{ mostHealingTeam.team.name }}</div>
              <div>{{ displayDamage(mostHealingTeam.value) }}</div>
            </button>
            <button
              v-if="mostShieldTeam"
              type="button"
              class="card bg-base-100 p-3 text-left hover:bg-base-300 transition-colors"
              data-test-team-rotations-leaderboard="shield"
              @click="selectedTeamId = mostShieldTeam!.team.id; showSummary = false">
              <div class="text-xs opacity-70 mb-1">Most Shield</div>
              <div class="font-semibold truncate">{{ mostShieldTeam.team.name }}</div>
              <div>{{ displayDamage(mostShieldTeam.value) }}</div>
            </button>
          </div>
        </div>

        <AppBulkActionBar
          :visible="hasTeamSelection"
          :count="selectedTeamIds.length">
          <template #selection>
            <button
              type="button"
              class="btn btn-sm btn-ghost"
              @click="selectTeamsOnPage"
              data-test-bulk-team-select-page>
              Select page
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost"
              @click="selectAllFilteredTeams"
              data-test-bulk-team-select-all>
              Select all ({{ filteredTeams.length }})
            </button>
            <button
              type="button"
              class="btn btn-sm btn-ghost"
              @click="clearTeamSelection"
              data-test-bulk-team-clear>
              Clear selection
            </button>
          </template>
          <div class="join">
            <button
              type="button"
              class="btn btn-sm btn-ghost join-item"
              v-tooltip="'Favorite selected teams'"
              aria-label="Favorite selected"
              data-test-bulk-team-favorite
              @click="bulkFavoriteTeams(true)">
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
              v-tooltip="'Unfavorite selected teams'"
              aria-label="Unfavorite selected"
              data-test-bulk-team-unfavorite
              @click="bulkFavoriteTeams(false)">
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
          <div class="divider divider-horizontal mx-0 hidden sm:flex"></div>
          <button
            type="button"
            class="btn btn-sm btn-error"
            @click="bulkDeleteTeams"
            data-test-bulk-team-delete>
            Delete
          </button>
        </AppBulkActionBar>

        <ul
          v-if="viewMode === 'grid'"
          class="teams__list grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          data-test-team-rotations-list>
          <li
            v-for="team in paginatedTeams"
            :key="team.id"
            class="card bg-base-200 shadow hover:bg-base-300 transition-colors cursor-pointer relative"
            :class="{
              'ring-2 ring-primary/60': teamRotationsStore.isFavoriteTeam(team.id),
            }"
            :data-test-team-rotations-item="team.name"
            @click="selectedTeamId = team.id; showSummary = false">
            <label
              class="absolute top-0 left-0 z-10 flex items-center justify-center rounded-md p-1 cursor-pointer"
              :aria-label="`Select team ${team.name}`"
              @click.stop>
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="isTeamSelected(team.id)"
                :data-test-team-select="team.name"
                @change="toggleTeamSelect(team.id)" />
            </label>
            <div class="card-body gap-3 p-4">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold flex items-center gap-2 min-w-0">
                  <span
                    class="badge badge-sm badge-ghost shrink-0"
                    data-test-team-rotations-rank>
                    #{{ teamRank(team.id) }}
                  </span>
                  <span class="truncate">{{ team.name }}</span>
                </h3>
                <div class="flex items-center gap-1 shrink-0" @click.stop>
                  <FavoriteHeartButton
                    :active="teamRotationsStore.isFavoriteTeam(team.id)"
                    :test-id="team.name"
                    @toggle="teamRotationsStore.toggleFavoriteTeam(team.id)" />
                  <TeamBuildStatus
                    :status="getTeamBuildStatus(team)"
                    interactive
                    :team-id="team.id" />
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs"
                    title="Delete team"
                    :data-test-team-rotations-delete="team.name"
                    @click="handleDeleteTeam(team.id, team.name)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4">
                      <path
                        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                        fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex gap-4">
                <div
                  v-for="(characterId, index) in team.characterIds"
                  :key="index"
                  class="flex flex-col items-center gap-1 w-20 min-w-0">
                  <div
                    class="size-16 rounded-full bg-base-300 border bg-cover bg-center"
                    :style="
                      characterId
                        ? { backgroundImage: `url(${characterImage(characterId)})` }
                        : {}
                    "></div>
                  <span class="text-xs truncate w-full text-center opacity-80">
                    {{ characterId ? displayName(characterId) : "Empty" }}
                  </span>
                </div>
              </div>
              <div class="text-xs opacity-70 flex flex-wrap gap-x-3 gap-y-1">
                <span>{{ team.actions.length }} action{{ team.actions.length === 1 ? "" : "s" }}</span>
                <span v-if="team.duration">{{ team.duration }}s rotation</span>
              </div>
              <div class="text-sm" data-test-team-rotations-total-dmg>
                <span class="font-bold">Total DMG:</span>
                Normal: {{ teamTotalDamage(team.id, "normal") }} /
                Average: {{ teamTotalDamage(team.id, "avg") }} /
                Crit: {{ teamTotalDamage(team.id, "crit") }}
              </div>
            </div>
          </li>
        </ul>

        <ul v-else class="teams__list flex flex-col gap-2" data-test-team-rotations-list>
          <li
            v-for="team in paginatedTeams"
            :key="team.id"
            class="card bg-base-200 shadow hover:bg-base-300 transition-colors cursor-pointer"
            :class="{
              'ring-2 ring-primary/60': teamRotationsStore.isFavoriteTeam(team.id),
            }"
            :data-test-team-rotations-item="team.name"
            @click="selectedTeamId = team.id; showSummary = false">
            <div class="card-body flex-row flex-wrap items-center gap-3 p-3">
              <label
                class="flex items-center justify-center cursor-pointer shrink-0"
                :aria-label="`Select team ${team.name}`"
                @click.stop>
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :checked="isTeamSelected(team.id)"
                  :data-test-team-select="team.name"
                  @change="toggleTeamSelect(team.id)" />
              </label>
              <span
                class="badge badge-sm badge-ghost shrink-0"
                data-test-team-rotations-rank>
                #{{ teamRank(team.id) }}
              </span>
              <div class="flex -space-x-2 shrink-0">
                <div
                  v-for="(characterId, index) in team.characterIds"
                  v-show="characterId"
                  :key="index"
                  class="size-9 rounded-full bg-base-300 border-2 border-base-200 bg-cover bg-center"
                  :style="
                    characterId
                      ? { backgroundImage: `url(${characterImage(characterId)})` }
                      : {}
                  "></div>
              </div>
              <div class="min-w-[8rem] flex-1">
                <div class="font-semibold truncate">{{ team.name }}</div>
                <div class="text-xs opacity-70 flex flex-wrap gap-x-2">
                  <span>{{ team.actions.length }} action{{ team.actions.length === 1 ? "" : "s" }}</span>
                  <span v-if="team.duration">{{ team.duration }}s rotation</span>
                </div>
              </div>
              <div class="text-sm shrink-0" data-test-team-rotations-total-dmg>
                <span class="font-bold">Total DMG:</span>
                Normal: {{ teamTotalDamage(team.id, "normal") }} /
                Average: {{ teamTotalDamage(team.id, "avg") }} /
                Crit: {{ teamTotalDamage(team.id, "crit") }}
              </div>
              <div class="flex items-center gap-1 shrink-0" @click.stop>
                <FavoriteHeartButton
                  :active="teamRotationsStore.isFavoriteTeam(team.id)"
                  :test-id="team.name"
                  @toggle="teamRotationsStore.toggleFavoriteTeam(team.id)" />
                <TeamBuildStatus
                  :status="getTeamBuildStatus(team)"
                  interactive
                  :team-id="team.id" />
                <button
                  type="button"
                  class="btn btn-ghost btn-xs"
                  title="Delete team"
                  :data-test-team-rotations-delete="team.name"
                  @click="handleDeleteTeam(team.id, team.name)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="size-4">
                    <path
                      d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"
                      fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <PaginationControls v-model="page" :total-pages="totalPages" />
        </div>
      </template>
    </template>

    <template v-else-if="showSummary">
      <TeamRotationSummary :team-id="selectedTeamId" @back="showSummary = false" />
    </template>

    <template v-else>
      <button
        type="button"
        class="btn btn-ghost btn-sm mb-4"
        data-test-team-rotation-back
        @click="selectedTeamId = null">
        ← Back to Teams
      </button>
      <TeamRotationTeamEditor
        :key="selectedTeamId"
        :team-id="selectedTeamId"
        @view-summary="showSummary = true" />
    </template>

    <TeamRotationsImportModal v-model:open="isImportOpen" @import="importTeamData" />
    <TeamRotationsPresetsModal
      v-model:open="isPresetsOpen"
      :presets="teamRotationPresets"
      @import="handleImportPreset" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import Nav from "./navigation/Nav.vue";
import AppRichSelect, { type AppRichSelectOption } from "./AppRichSelect.vue";
import PaginationControls from "./PaginationControls.vue";
import TeamRotationTeamEditor from "./TeamRotationTeamEditor.vue";
import TeamRotationSummary from "./TeamRotationSummary.vue";
import TeamBuildStatus from "./TeamBuildStatus.vue";
import FavoriteHeartButton from "./FavoriteHeartButton.vue";
import TeamRotationsImportModal from "./TeamRotationsImportModal.vue";
import TeamRotationsPresetsModal from "./TeamRotationsPresetsModal.vue";
import AppOverflowMenu from "./AppOverflowMenu.vue";
import AppFilterPanel from "./AppFilterPanel.vue";
import AppBulkActionBar from "./AppBulkActionBar.vue";
import {
  TEAM_BUILD_STATUSES,
  getTeamBuildStatus,
  getTeamBuildStatusDotClass,
  getTeamBuildStatusLabel,
  type TeamBuildStatus as TeamBuildStatusType,
} from "../teamRotations/teamBuildStatus";
import { useTeamRotationsStore } from "../stores/teamRotations";
import { useCharacterStore } from "../stores/character";
import { useInventoryStore } from "../stores/inventory";
import { useConfirm } from "../composables/useConfirm";
import { useToast } from "../composables/useToast";
import { getCharacterRosterDisplayName, getCharactersAvailable } from "../characters/characters";
import { calcTeamRotationDamage, calcStrongestHit } from "../calculator/teamRotation";
import { displayDamage } from "../utils/numbers";
import type { TeamExportData } from "../teamRotations/exportImport";
import { teamRotationPresets, type TeamRotationPreset } from "../teamRotations/presets";

const teamRotationsStore = useTeamRotationsStore();
const { teams } = storeToRefs(teamRotationsStore);
const characterStore = useCharacterStore();
const { characters } = storeToRefs(characterStore);
const inventoryStore = useInventoryStore();
const { echoes: inventoryEchoes } = storeToRefs(inventoryStore);
const { confirm } = useConfirm();
const { showToast } = useToast();

// Remembers the active team for the current browser session (sessionStorage,
// not localStorage) so leaving to another page — e.g. "Configure Character"
// routing to "/" — and returning to /teams re-mounts this component back
// into the same team instead of dropping to the team list (#507). Validated
// against the live team list since the stored id can point at a team that
// was deleted (in this tab or another) since it was saved.
const ACTIVE_TEAM_ID_KEY = "teamRotationsActiveTeamId";
const storedActiveTeamId = sessionStorage.getItem(ACTIVE_TEAM_ID_KEY);
const selectedTeamId = ref<string | null>(
  storedActiveTeamId && teams.value.some((team: any) => team.id === storedActiveTeamId)
    ? storedActiveTeamId
    : null,
);
const showSummary = ref(false);

watch(selectedTeamId, (teamId) => {
  if (teamId) {
    sessionStorage.setItem(ACTIVE_TEAM_ID_KEY, teamId);
  } else {
    sessionStorage.removeItem(ACTIVE_TEAM_ID_KEY);
  }
});

const VIEW_MODE_KEY = "teamRotationsViewMode";
const viewMode = ref<"grid" | "list">(
  localStorage.getItem(VIEW_MODE_KEY) === "list" ? "list" : "grid",
);
watch(viewMode, (mode) => {
  localStorage.setItem(VIEW_MODE_KEY, mode);
});

function displayName(characterId: string) {
  return getCharacterRosterDisplayName(characterId);
}

function characterImage(characterId: string) {
  return `https://ryanbenson.github.io/wuthering-waves-assets/images/${characterId}.png`;
}

function handleCreateTeam() {
  const team = teamRotationsStore.createTeam(`Team ${teams.value.length + 1}`);
  selectedTeamId.value = team.id;
}

const isImportOpen = ref(false);
const isPresetsOpen = ref(false);

function importTeamData(data: TeamExportData) {
  const team = teamRotationsStore.importTeam(data);
  showToast(`"${team.name}" has been imported.`, "success");
  isImportOpen.value = false;
  isPresetsOpen.value = false;
  selectedTeamId.value = team.id;
}

function handleImportPreset(preset: TeamRotationPreset) {
  importTeamData(preset.data);
}

async function handleDeleteTeam(teamId: string, teamName: string) {
  const confirmed = await confirm(`Do you really want to delete "${teamName}"?`, {
    title: "Delete team",
    confirmLabel: "Delete",
    variant: "error",
  });
  if (!confirmed) {
    return;
  }
  teamRotationsStore.deleteTeam(teamId);
  if (selectedTeamId.value === teamId) {
    selectedTeamId.value = null;
  }
  selectedTeamIds.value = selectedTeamIds.value.filter((id) => id !== teamId);
}

// Character filter — finds teams that have the chosen character in any slot.
const characterFilter = ref<string | null>(null);

const characterFilterOptions = computed((): AppRichSelectOption[] => {
  const roster = getCharactersAvailable();
  const mapBucket = (chars: typeof roster.five, group: string): AppRichSelectOption[] =>
    chars.map((char) => ({
      value: char.key,
      label: char.name,
      group,
      image: characterImage(char.key),
    }));
  return [...mapBucket(roster.five, "5 Star"), ...mapBucket(roster.four, "4 Star")];
});

// Status filter — same enum/dropdown pattern as the character browser's
// build-status filter (CalculatorCharacterBrowser.vue).
const statusFilter = ref<TeamBuildStatusType | null>(null);

const statusFilterOptions = computed((): AppRichSelectOption[] =>
  TEAM_BUILD_STATUSES.map((status) => ({
    value: status,
    label: getTeamBuildStatusLabel(status),
    dotClass: getTeamBuildStatusDotClass(status),
  })),
);

// Favorites filter — same "toggle button + heart icon" pattern as the
// character browser's Favorites filter.
const favoritesFilter = ref(false);

const activeFilterCount = computed(() => {
  let count = 0;
  if (characterFilter.value) count += 1;
  if (statusFilter.value) count += 1;
  if (favoritesFilter.value) count += 1;
  return count;
});

function clearFilters() {
  characterFilter.value = null;
  statusFilter.value = null;
  favoritesFilter.value = false;
}

// Bulk selection — same pattern as Inventory's echo browser.
const selectedTeamIds = ref<string[]>([]);
const hasTeamSelection = computed(() => selectedTeamIds.value.length > 0);

function isTeamSelected(teamId: string) {
  return selectedTeamIds.value.includes(teamId);
}

function toggleTeamSelect(teamId: string) {
  if (isTeamSelected(teamId)) {
    selectedTeamIds.value = selectedTeamIds.value.filter((id) => id !== teamId);
  } else {
    selectedTeamIds.value = [...selectedTeamIds.value, teamId];
  }
}

function clearTeamSelection() {
  selectedTeamIds.value = [];
}

function selectTeamsOnPage() {
  const pageIds = paginatedTeams.value.map((team: any) => team.id);
  selectedTeamIds.value = [...new Set([...selectedTeamIds.value, ...pageIds])];
}

function selectAllFilteredTeams() {
  selectedTeamIds.value = filteredTeams.value.map((team: any) => team.id);
}

function bulkFavoriteTeams(favorite: boolean) {
  for (const teamId of selectedTeamIds.value) {
    if (teamRotationsStore.isFavoriteTeam(teamId) !== favorite) {
      teamRotationsStore.toggleFavoriteTeam(teamId);
    }
  }
  const count = selectedTeamIds.value.length;
  showToast(
    favorite
      ? `Favorited ${count} team${count === 1 ? "" : "s"}.`
      : `Unfavorited ${count} team${count === 1 ? "" : "s"}.`,
    "success",
  );
}

async function bulkDeleteTeams() {
  const ids = [...selectedTeamIds.value];
  if (!ids.length) return;

  const confirmed = await confirm(
    `Delete ${ids.length} team${ids.length === 1 ? "" : "s"}? This cannot be undone.`,
    {
      title: "Delete selected teams",
      confirmLabel: "Delete",
      variant: "error",
    },
  );
  if (!confirmed) return;

  for (const teamId of ids) {
    teamRotationsStore.deleteTeam(teamId);
    if (selectedTeamId.value === teamId) {
      selectedTeamId.value = null;
    }
  }
  clearTeamSelection();
  showToast(`Deleted ${ids.length} team${ids.length === 1 ? "" : "s"}.`, "success");
}

const filteredTeams = computed(() => {
  return teams.value.filter((team: any) => {
    const matchesCharacter =
      !characterFilter.value || team.characterIds.includes(characterFilter.value);
    const matchesStatus =
      !statusFilter.value || getTeamBuildStatus(team) === statusFilter.value;
    const matchesFavorite =
      !favoritesFilter.value || teamRotationsStore.isFavoriteTeam(team.id);
    return matchesCharacter && matchesStatus && matchesFavorite;
  });
});

// Sort metric — shared by the leaderboard cards above and the team grid
// below, which doubles as the "ranked list": sorted strongest to weakest by
// whichever metric is selected, with a per-team #rank badge.
const sortMetric = ref<"normal" | "avg" | "crit" | "name">("avg");

// The leaderboard cards below always need a numeric normal/avg/crit metric,
// even while the ranked list itself is sorted alphabetically.
const leaderboardMetric = computed(() =>
  sortMetric.value === "name" ? "avg" : sortMetric.value,
);

const sortedTeams = computed(() => {
  if (sortMetric.value === "name") {
    return [...filteredTeams.value].sort((a: any, b: any) =>
      String(a.name ?? "").localeCompare(String(b.name ?? "")),
    );
  }
  return [...filteredTeams.value].sort((a: any, b: any) => {
    const aValue = teamStats.value[a.id]?.[leaderboardMetric.value] ?? 0;
    const bValue = teamStats.value[b.id]?.[leaderboardMetric.value] ?? 0;
    return bValue - aValue;
  });
});

function teamRank(teamId: string): number {
  const index = sortedTeams.value.findIndex((t: any) => t.id === teamId);
  return index === -1 ? 0 : index + 1;
}

// Pagination, matching the Inventory page's PaginationControls pattern.
const page = ref(1);
const perPage = 12;

const paginatedTeams = computed(() => {
  const start = (page.value - 1) * perPage;
  return sortedTeams.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTeams.value.length / perPage)),
);

watch(characterFilter, () => {
  page.value = 1;
});

watch(statusFilter, () => {
  page.value = 1;
});

watch(favoritesFilter, () => {
  page.value = 1;
});

watch(totalPages, (nextTotalPages) => {
  if (page.value > nextTotalPages) {
    page.value = nextTotalPages;
  }
});

// Per-team stats, powering both each card's "Total DMG" line and the
// cross-team summary/sort below. Cached per team id and only recomputed
// when that team's damage-relevant fields actually change (see
// teamStatsCache below) — a single team edit used to recompute every saved
// team's damage on every keystroke (#438); now it's a fingerprint-gated
// cache hit for everything but the team that changed.
interface TeamSummaryStats {
  normal: number;
  avg: number;
  crit: number;
  dpsNormal: number;
  dpsAvg: number;
  dpsCrit: number;
  hitNormal: number;
  hitAvg: number;
  hitCrit: number;
  healing: number;
  shield: number;
}

const teamStats = ref<Record<string, TeamSummaryStats>>({});
let statsComputeToken = 0;

// Fingerprint of just the fields that feed calcTeamRotationDamage, so an
// edit to unrelated team fields (name, favorite, buildStatus) doesn't count
// as "changed" and force a recompute.
function computeTeamFingerprint(team: any): string {
  return JSON.stringify({
    characterIds: team.characterIds,
    actions: team.actions,
    duration: team.duration,
    enemyConfig: team.enemyConfig,
  });
}

async function computeStatsForTeam(team: any): Promise<TeamSummaryStats> {
  const result = await calcTeamRotationDamage(
    {
      name: team.name,
      characterIds: team.characterIds,
      actions: team.actions,
      duration: team.duration,
    },
    characters.value,
    team.enemyConfig,
    inventoryEchoes.value,
  );
  const strongest = calcStrongestHit(result.actionResults);
  // calcRotationDps divides by team.duration with no zero/NaN guard —
  // a team with no duration set (the default for a new team) would
  // otherwise report Infinity DPS and "win" the leaderboard despite
  // having the lowest actual damage. Treat "no duration" as "no DPS
  // to report" instead, same as every other DPS display in the app
  // already gates on `duration` being truthy.
  const hasDuration = Number(team.duration) > 0;
  return {
    normal: result.total.normalDamage ?? 0,
    avg: result.total.avgDamage ?? 0,
    crit: result.total.critDamage ?? 0,
    dpsNormal: hasDuration ? result.dps.normal : 0,
    dpsAvg: hasDuration ? result.dps.avg : 0,
    dpsCrit: hasDuration ? result.dps.crit : 0,
    hitNormal: strongest.normal,
    hitAvg: strongest.avg,
    hitCrit: strongest.crit,
    healing: result.total.healing ?? 0,
    shield: result.total.shield ?? 0,
  };
}

// Component-instance cache (not module-level, so it can't go stale across
// mounts): one entry per team id holding the fingerprint it was computed
// from, so recomputeTeamStats can tell which teams actually need work.
const teamStatsCache = new Map<string, { fingerprint: string; stats: TeamSummaryStats }>();

function pruneTeamStatsCache() {
  const liveIds = new Set(teams.value.map((team: any) => team.id));
  for (const id of teamStatsCache.keys()) {
    if (!liveIds.has(id)) {
      teamStatsCache.delete(id);
    }
  }
}

function publishTeamStats() {
  teamStats.value = Object.fromEntries(
    [...teamStatsCache.entries()].map(([id, entry]) => [id, entry.stats]),
  );
}

function waitForUiPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
}

// How many teams to compute per batch before yielding to the browser, so a
// first load with lots of teams doesn't block the main thread in one long
// synchronous burst.
const STATS_BATCH_SIZE = 5;

async function recomputeTeamStats() {
  const token = ++statsComputeToken;
  pruneTeamStatsCache();

  // Only the currently-filtered teams are ever shown (cards or leaderboard),
  // so that's the whole working set — not every team ever saved.
  const stale = filteredTeams.value.filter((team: any) => {
    const cached = teamStatsCache.get(team.id);
    return !cached || cached.fingerprint !== computeTeamFingerprint(team);
  });

  if (stale.length === 0) {
    publishTeamStats();
    return;
  }

  for (let i = 0; i < stale.length; i += STATS_BATCH_SIZE) {
    if (token !== statsComputeToken) {
      return;
    }
    const batch = stale.slice(i, i + STATS_BATCH_SIZE);
    await Promise.all(
      batch.map(async (team: any) => {
        const stats = await computeStatsForTeam(team);
        teamStatsCache.set(team.id, { fingerprint: computeTeamFingerprint(team), stats });
      }),
    );
    if (token !== statsComputeToken) {
      return;
    }
    publishTeamStats();
    if (i + STATS_BATCH_SIZE < stale.length) {
      await waitForUiPaint();
    }
  }
}

// Coalesce same-tick triggers from both watchers below into a single
// recomputeTeamStats() call, rather than kicking off two overlapping runs
// (harmless due to statsComputeToken, but wasted duplicate work).
let recomputeQueued = false;
function scheduleRecomputeTeamStats() {
  if (recomputeQueued) {
    return;
  }
  recomputeQueued = true;
  queueMicrotask(() => {
    recomputeQueued = false;
    void recomputeTeamStats();
  });
}

watch(teams, scheduleRecomputeTeamStats, { deep: true, immediate: true });
// A filter change can reveal teams that were never in the previously-visible
// set (so never cached) without necessarily mutating `teams` itself.
watch(filteredTeams, scheduleRecomputeTeamStats);

function teamTotalDamage(teamId: string, variant: "normal" | "avg" | "crit"): string {
  const stats = teamStats.value[teamId];
  return stats !== undefined ? String(displayDamage(stats[variant])) : "—";
}

// Cross-team leaderboard — one "strongest team" per metric, scoped to
// whatever's currently visible (character/status filters), so the summary
// always matches what the list below actually shows. All find the max
// among teams with real (non-zero) values, so an all-zero roster (e.g. no
// actions configured yet) shows nothing rather than an arbitrary team.
function strongestTeamBy(getValue: (stats: TeamSummaryStats) => number) {
  let best: { team: any; value: number } | null = null;
  for (const team of filteredTeams.value as any[]) {
    const stats = teamStats.value[team.id];
    if (!stats) continue;
    const value = getValue(stats);
    if (value > 0 && (!best || value > best.value)) {
      best = { team, value };
    }
  }
  return best;
}

const strongestTeamByDamage = computed(() =>
  strongestTeamBy((stats) => stats[leaderboardMetric.value]),
);
const bestDpsTeam = computed(() =>
  strongestTeamBy((stats) =>
    leaderboardMetric.value === "normal"
      ? stats.dpsNormal
      : leaderboardMetric.value === "crit"
        ? stats.dpsCrit
        : stats.dpsAvg,
  ),
);
const strongestHitTeam = computed(() =>
  strongestTeamBy((stats) =>
    leaderboardMetric.value === "normal"
      ? stats.hitNormal
      : leaderboardMetric.value === "crit"
        ? stats.hitCrit
        : stats.hitAvg,
  ),
);
const mostHealingTeam = computed(() => strongestTeamBy((stats) => stats.healing));
const mostShieldTeam = computed(() => strongestTeamBy((stats) => stats.shield));
</script>
