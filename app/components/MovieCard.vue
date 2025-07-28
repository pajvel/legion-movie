<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: String,
  items: Array
})

const scrollContainer = ref(null)
const scrollProgress = ref(0)
const isScrollingLeft = ref(false)
const isScrollingRight = ref(false)

const updateScrollProgress = () => {
  const el = scrollContainer.value
  const maxScroll = el.scrollWidth - el.clientWidth
  scrollProgress.value = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0
  
  isScrollingLeft.value = el.scrollLeft > 0
  isScrollingRight.value = el.scrollLeft < maxScroll
}

const scroll = (amount) => {
  scrollContainer.value.scrollBy({
    left: amount,
    behavior: 'smooth'
  })
}

const handleLineWheel = (e) => {
  scrollContainer.value.scrollBy({
    left: e.deltaY * 6,
    behavior: 'smooth'
  })
}

onMounted(() => {
  scrollContainer.value.addEventListener('scroll', updateScrollProgress)
  updateScrollProgress()
})

onBeforeUnmount(() => {
  scrollContainer.value?.removeEventListener('scroll', updateScrollProgress)
})
</script>

<template>
  <div class="flex flex-col w-full mt-10 relative">
    <!-- Заголовок с линией прокрутки -->
    <div class="w-[1280px] mx-auto px-4 mb-4 flex items-center justify-between">
      <h2 class="text-white text-3xl font-bold">
        {{ title }}
      </h2>
      
      <!-- Линия прогресса -->
      <div class="flex items-center w-32 ml-4">
        <div 
          class="h-1 w-full bg-gray-700/50 rounded-full relative cursor-ns-resize"
          @wheel.prevent="handleLineWheel"
        >
          <div 
            class="h-full bg-[#FF4C4C] absolute left-0 top-0 rounded-full transition-all duration-300"
            :style="{ width: scrollProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Блок с фильмами -->
    <div class="relative" style="height: 360px"> <!-- Фиксированная высота под постер -->
      <!-- Стрелка влево -->
      <button 
        @click="scroll(-600)"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center bg-gradient-to-r from-black/60 to-transparent rounded-full text-white hover:bg-[#FF4C4C] transition-all duration-300 shadow-xl hover:shadow-red-500/30 transform hover:scale-110 backdrop-blur-sm"
        :class="{ 'opacity-0': !isScrollingLeft }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Контейнер с фильмами -->
      <div 
        ref="scrollContainer"
        class="w-[1280px] mx-auto flex gap-6 px-4 overflow-x-auto overflow-y-hidden h-full items-center scrollbar-hidden"
        @scroll="updateScrollProgress"
      >
        <div 
          v-for="item in items" 
          :key="item.id"
          class="flex-shrink-0 w-[240px] h-[340px] relative" 
        >
          <!-- Обертка карточки с эффектами -->
          <div class="block bg-stone-900 rounded-lg overflow-hidden relative h-full transition-all duration-300 group hover:shadow-[0_0_0_3px_rgba(255,76,76,0.8)] hover:shadow-red-500/50">
            <NuxtLink :to="`/movie/${item.id}`" class="block h-full">
              <div class="relative pt-[150%]">
                <!-- Постер -->
                <NuxtImg
                  :src="item.poster?.url || '/placeholder-movie.jpg'"
                  :alt="item.name"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  :modifiers="{ quality: 80, format: 'webp', width: 300 }"
                />
                
                <!-- Затемнение -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300"></div>
                
                <!-- Информация -->
                <div class="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="bg-[#FF4C4C] text-black text-xs font-bold px-2 py-1 rounded self-start mb-2">
                    {{ item.rating?.kp?.toFixed(1) || '—' }}
                  </div>
                  <h3 class="text-white font-bold text-lg mb-1">
                    {{ item.name }}
                  </h3>
                  <div class="text-gray-300 text-sm mb-2">
                    {{ item.year }}
                  </div>
                  <p class="text-gray-300 text-sm line-clamp-3">
                    {{ item.description || 'Описание отсутствует' }}
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Стрелка вправо -->
      <button 
        @click="scroll(600)"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-16 h-16 flex items-center justify-center bg-gradient-to-l from-black/60 to-transparent rounded-full text-white hover:bg-[#FF4C4C] transition-all duration-300 shadow-xl hover:shadow-red-500/30 transform hover:scale-110 backdrop-blur-sm"
        :class="{ 'opacity-0': !isScrollingRight }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>



<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>