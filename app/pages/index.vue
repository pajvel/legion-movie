<!-- pages/index.vue -->
<script setup>
import { useKinopoiskApi } from "@/composables/useKinopoiskApi"
import MovieHero from "@/components/layouts/MovieHero.vue"
import MoviesSection from "@/components/MoviesSection.vue"

const { fetchMovie, fetchTrendingMovies, fetchRussianMovies, fetchRussianSeries } = useKinopoiskApi()

// Состояние
const heroMovies = ref([])
const trendingMovies = ref([])
const russianMovies = ref([])
const russianSeries = ref([])
const isLoading = ref(true)
const currentHeroIndex = ref(0)
const intervalRef = ref(null)
const isModalOpen = ref(false)
const selectedContent = ref(null)

// Только 3 указанных фильма
const heroMovieIds = [
  "1143242",  // Джентльмены
  "111543",   // Темный рыцарь
  "1334852"   // Указанный ID
]

const openModal = (content) => {
  selectedContent.value = content
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Переключение между героями
const rotateHeroes = () => {
  if (heroMovies.value.length > 0) {
    currentHeroIndex.value = (currentHeroIndex.value + 1) % heroMovies.value.length
  }
}

// Ручное переключение по точкам
const setHeroIndex = (index) => {
  if (index >= 0 && index < heroMovies.value.length) {
    currentHeroIndex.value = index
  }
}

onMounted(async () => {
  try {
    // Загрузка только трех указанных фильмов
    const heroPromises = heroMovieIds.map(async id => {
      try {
        return await fetchMovie(id)
      } catch (error) {
        console.error(`Не удалось загрузить фильм ${id}:`, error)
        return null
      }
    })

    // Параллельная загрузка всех данных
    const [heroes, trends, movies, series] = await Promise.all([
      Promise.all(heroPromises),
      fetchTrendingMovies(),
      fetchRussianMovies(),
      fetchRussianSeries()
    ])
    
    // Фильтрация неудачных запросов
    heroMovies.value = heroes.filter(movie => movie !== null)
    trendingMovies.value = trends
    russianMovies.value = movies
    russianSeries.value = series
    
    // Запуск автоматического переключения только если есть герои
    if (heroMovies.value.length > 0) {
      intervalRef.value = setInterval(rotateHeroes, 8000)
    }
    
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error)
  } finally {
    isLoading.value = false
  }
})

// Очистка интервала при размонтировании
onBeforeUnmount(() => {
  if (intervalRef.value) {
    clearInterval(intervalRef.value)
  }
})
</script>

<template>
  <div class="min-h-screen h-full bg-[#1b1b1b]">
    <!-- Слайдер героев -->
    <div v-if="heroMovies.length > 0" class="relative h-[924px] overflow-hidden">
      <div class="flex h-full transition-transform duration-500 ease-in-out"
           :style="{ transform: `translateX(-${currentHeroIndex * 100}%)` }">
        <div v-for="(movie, index) in heroMovies" 
             :key="index"
             class="w-full flex-shrink-0 h-full">
          <MovieHero 
            :movie="movie" 
            @show-details="openModal"
          />
        </div>
      </div>
      
      <!-- Индикаторы (3 точки) -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        <button v-for="(_, index) in heroMovies"
                :key="index"
                @click="setHeroIndex(index)"
                class="w-3 h-3 rounded-full transition-all duration-300"
                :class="{
                  'bg-[#FF4C4C] w-6': currentHeroIndex === index,
                  'bg-gray-400 bg-opacity-50': currentHeroIndex !== index
                }">
        </button>
      </div>
    </div>
    
    <!-- Загрузчик -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
    
    <!-- Основной контент -->
    <div v-else class="w-full pb-20">
      <div class="w-[1280px] mx-auto space-y-12">
        <MoviesSection title="Лучшие" :items="trendingMovies" />
        <MoviesSection title="Русские фильмы" :items="russianMovies" />
        <MoviesSection title="Русские сериалы" :items="russianSeries" />
      </div>
    </div>

    <ContentModal 
      v-if="selectedContent"
      :content="selectedContent"
      :is-open="isModalOpen"
      @show-details="openModal"
      @close="closeModal"
    />
  </div>
</template>

<style>
/* Плавная анимация слайдера */
.transition-transform {
  transition-property: transform;
}
</style>