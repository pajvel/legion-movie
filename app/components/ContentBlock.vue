<!-- components/ContentBlock.vue -->
<template>
  <div class="flex bg-[#222222] rounded-xl overflow-hidden shadow-lg h-[260px] transition-all duration-300 hover:shadow-red-900/30 hover:-translate-y-1">
    <!-- Минималистичный номер слева -->
    <div class="w-12 flex-shrink-0 flex items-center justify-center border-r border-[#333333]">
      <span class="text-[#FF4C4C] text-xl font-light">{{ index }}</span>
    </div>

    <!-- Постер -->
    <div class="w-[180px] h-full flex-shrink-0">
      <NuxtImg
        :src="movie.poster?.url || '/placeholder-movie.jpg'"
        class="w-full h-full object-cover"
        :alt="movie.name"
      />
    </div>

    <!-- Информация -->
    <div class="flex-1 p-5 flex flex-col">
      <h2 class="text-white text-xl font-medium mb-2">{{ movie.name }}</h2>
      
      <div class="flex items-center gap-3 text-gray-400 text-sm mb-3">
        <span>{{ movie.year }}</span>
        <span v-if="movie.movieLength">{{ movie.movieLength }} мин.</span>
        <span v-if="movie.ageRating" class="text-xs border border-gray-600 px-1 rounded">
          {{ movie.ageRating }}+
        </span>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <div class="text-[#FF4C4C] text-sm font-medium">
          {{ movie.rating?.kp?.toFixed(1) || '—' }}
        </div>
        <span class="text-gray-500 text-xs">КиноПоиск</span>
      </div>
    
      <p class="text-gray-400 text-sm line-clamp-3 mb-4 leading-snug">
        {{ movie.shortDescription || movie.description || 'Описание отсутствует' }}
      </p>
      
      <div v-if="movie.seasonsCount" class="flex items-center gap-1 text-xs text-gray-400 mt-1">
        <span>{{ movie.seasonsCount }} сезонов</span>
        <span v-if="movie.seriesLength">• {{ movie.seriesLength }} мин/серия</span>
      </div>  
      
      <button
        @click="$emit('show-details', movie)"
        class="mt-auto self-start text-[#FF4C4C] hover:text-white text-sm border border-[#FF4C4C] hover:bg-[#FF4C4C] px-4 py-1.5 rounded transition-colors duration-200"
      >
        Подробнее
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  movie: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

defineEmits(['show-details'])
</script>