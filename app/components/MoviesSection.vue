<!-- components/MoviesSection.vue -->
<script setup>
import { ref } from 'vue'
import { useKinopoiskApi } from '@/composables/useKinopoiskApi';
const { fetchMovie } = useKinopoiskApi();

const props = defineProps({
  title: String,
  items: Array
})

const postersContainer = ref(null)
const scrollOffset = ref(0)
const scrollProgress = ref(0)
const isScrollingLeft = ref(false)
const isScrollingRight = ref(false)
const currentHover = ref(null)
const isModalOpen = ref(false)
const selectedContent = ref(null)

const maxScroll = () => {
  if (!postersContainer.value) return 0
  return postersContainer.value.scrollWidth - postersContainer.value.clientWidth
}

const updateScrollState = () => {
  const progress = Math.abs(scrollOffset.value) / maxScroll() * 100
  scrollProgress.value = Math.min(100, Math.max(0, progress))
  isScrollingLeft.value = scrollOffset.value < 0
  isScrollingRight.value = Math.abs(scrollOffset.value) < maxScroll()
}

const scrollLeft = () => {
  scrollOffset.value = Math.min(0, scrollOffset.value + 600)
  updateScrollState()
}

const scrollRight = () => {
  scrollOffset.value = Math.max(-maxScroll(), scrollOffset.value - 600)
  updateScrollState()
}

const handleLineClick = (e) => {
  const line = e.currentTarget
  const clickPosition = e.clientX - line.getBoundingClientRect().left
  const percentage = clickPosition / line.clientWidth
  scrollOffset.value = -percentage * maxScroll()
  updateScrollState()
}

const openModal = async (item) => {
  // Если нет данных об актерах/фактах - догружаем
  if (!item.persons || !item.facts) {
    const fullData = await fetchMovie(item.id); // Используем тот же метод, что и в MovieHero
    selectedContent.value = fullData;
    console.log('Догруженные данные:', fullData); // Проверяем, что пришло
  } else {
    selectedContent.value = item;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="flex flex-col w-full mt-10 relative">
    <!-- Заголовок с полоской прокрутки -->
    <div class="w-[1280px] mx-auto px-4 mb-4 flex items-center justify-between">
      <h2 class="text-white text-3xl font-bold">
        {{ title }}
      </h2>
      
      <!-- Полоска прокрутки -->
      <div class="flex items-center w-32 ml-4">
        <div 
          class="h-1 w-full bg-gray-700/50 rounded-full relative cursor-pointer"
          @click="handleLineClick"
        >
          <div 
            class="h-full bg-[#FF4C4C] absolute left-0 top-0 rounded-full transition-all duration-300"
            :style="{ width: scrollProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Контейнер с постерами -->
    <div class="relative w-[1280px] mx-auto h-[420px]">
      <!-- Стрелка влево -->
      <button 
        @click="scrollLeft"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center bg-black/70 rounded-full text-white hover:bg-[#FF4C4C] transition-all duration-300 transform hover:scale-110"
        :class="{ 'opacity-0': !isScrollingLeft }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Видимая область -->
      <div class="w-full h-full overflow-hidden">
        <div 
          ref="postersContainer"
          class="flex gap-8 px-16 h-full items-center transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(${scrollOffset}px)` }"
        >
          <div 
            v-for="(item, index) in items" 
            :key="item.id"
            class="flex-shrink-0 w-[280px] h-[400px] relative transition-all duration-300 group" 
          >
            <!-- Эффект свечения -->
            <div class="absolute inset-0 rounded-lg overflow-hidden">
              <div 
                class="absolute inset-0 border-2 border-transparent group-hover:border-[#FF4C4C] transition-all duration-300 rounded-lg"
                style="box-shadow: 0 0 0 0 rgba(255, 76, 76, 0.4); transition: box-shadow 0.3s ease, border-color 0.3s ease;"
                :style="{ 
                  'box-shadow': currentHover === index ? '0 0 0 3px #FF4C4C, 0 0 25px 10px rgba(255, 76, 76, 0.3)' : 'none',
                  'border-color': currentHover === index ? '#FF4C4C' : 'transparent'
                }"
              ></div>
            </div>

            <!-- Карточка фильма -->
            <div 
              class="block h-full rounded-lg overflow-hidden relative cursor-pointer"
              @click="openModal(item)"
              @mouseenter="currentHover = index"
              @mouseleave="currentHover = null"
            >
              <!-- Постер -->
              <NuxtImg
                :src="item.poster?.url || '/placeholder-movie.jpg'"
                :alt="item.name"
                class="w-full h-full object-cover transition-transform duration-300"
                :class="{ 'scale-105': currentHover === index }"
              />
              
              <!-- Затемнение -->
              <div 
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 transition-opacity duration-300"
                :class="{ 'opacity-100': currentHover === index }"
              ></div>
              
              <!-- Информация -->
              <div 
                class="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300"
                :class="{ 'opacity-100': currentHover === index }"
              >
                <div class="bg-[#FF4C4C] text-black text-xs font-bold px-2 py-1 rounded self-start mb-2">
                  {{ item.rating?.kp?.toFixed(1) || '—' }}
                </div>
                <h3 class="text-white font-bold text-lg mb-1">{{ item.name }}</h3>
                <div class="text-gray-300 text-sm mb-2">{{ item.year }}</div>
                <p class="text-gray-300 text-sm line-clamp-3">{{ item.description || 'Описание отсутствует' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Стрелка вправо -->
      <button 
        @click="scrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center bg-black/70 rounded-full text-white hover:bg-[#FF4C4C] transition-all duration-300 transform hover:scale-110"
        :class="{ 'opacity-0': !isScrollingRight }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>

  <ContentModal 
      v-if="selectedContent"
      :content="selectedContent"
      :is-open="isModalOpen"
      @show-details="openModal"
      @close="closeModal"
    />
</template>