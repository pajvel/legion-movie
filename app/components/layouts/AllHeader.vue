<!-- components/layouts/AllHeader.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useSeriesApi } from '../../composables/useSeriesApi'

const route = useRoute()
const searchQuery = ref('')
const searchResults = ref([])
const searchLoading = ref(false)
const showSearchResults = ref(false)

const isActive = (path: string) => {
  return route.path === path || 
         (path !== '/' && route.path.startsWith(path))
}

const { searchContent } = useSeriesApi()

const performSearch = async (query: string) => {
  if (!query || query.trim().length < 2) {
    searchResults.value = []
    return
  }
  
  try {
    searchLoading.value = true
    const { results } = await searchContent(query)
    searchResults.value = results
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}

const debouncedSearch = useDebounceFn(performSearch, 500)

watch(searchQuery, (newVal) => {
  if (newVal) {
    debouncedSearch(newVal)
  } else {
    searchResults.value = []
  }
})

const handleSearchFocus = () => {
  showSearchResults.value = true
  if (searchQuery.value.trim().length >= 2) {
    performSearch(searchQuery.value)
  }
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

const closeSearch = () => {
  showSearchResults.value = false
  searchQuery.value = ''
}
</script>

<template>
  <header class="sticky top-6 mx-auto w-[calc(100%-40px)] max-w-[1280px] h-[76px] box-border border border-[#333333] rounded-[8px] bg-[#151515]/90 transition-all duration-300 flex items-center">
    <div class="pt-[16px] pb-[16px] px-[44px] w-full h-[54px] flex items-center justify-between">
      <!-- Логотип -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <NuxtImg src="/logo.svg" width="44px" />
        <div class="font-montserrat tracking-[1.5px] uppercase font-bold text-[25px]">
          <span class="text-white">LEGION</span>
          <span class="text-[#FF4C4C]">MOVIE</span>
        </div>
      </div>
      
      <!-- Навигация -->
      <nav class="flex-1 flex justify-center px-8">
        <div class="flex items-center gap-12 font-montserrat text-white">
          <NuxtLink 
            to="/" 
            :class="{
              'text-[#FF4C4C] font-bold text-[20px]': isActive('/'),
              'hover:text-[#FF4C4C] text-[18px]': !isActive('/')
            }"
            class="transition-colors duration-300"
          >
            ГЛАВНАЯ
          </NuxtLink>
          <NuxtLink 
            to="/movies" 
            :class="{
              'text-[#FF4C4C] font-bold text-[20px]': isActive('/movies'),
              'hover:text-[#FF4C4C] text-[18px]': !isActive('/movies')
            }"
            class="transition-colors duration-300"
          >
            ФИЛЬМЫ
          </NuxtLink>
          <NuxtLink 
            to="/series" 
            :class="{
              'text-[#FF4C4C] font-bold text-[20px]': isActive('/series'),
              'hover:text-[#FF4C4C] text-[18px]': !isActive('/series')
            }"
            class="transition-colors duration-300"
          >
            СЕРИАЛЫ
          </NuxtLink>
          <NuxtLink 
            to="/russkoe" 
            :class="{
              'text-[#FF4C4C] font-bold text-[20px]': isActive('/russkoe'),
              'hover:text-[#FF4C4C] text-[18px]': !isActive('/russkoe')
            }"
            class="transition-colors duration-300"
          >
            РУССКОЕ
          </NuxtLink>
        </div>
      </nav>

      <!-- Поиск -->
      <div class="relative w-[220px] flex-shrink-0">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск фильмов..."
          class="w-full bg-[#333333]/50 border border-[#444444] rounded-[20px] py-2 px-4 pr-10 text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF4C4C]/50 focus:border-transparent transition-all duration-300"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        >
        <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] hover:text-[#FF4C4C] transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        <SearchResults 
          :results="searchResults"
          :loading="searchLoading"
          :show-results="showSearchResults"
          @close-search="closeSearch"
        />
      </div>
    </div>
  </header>
</template>