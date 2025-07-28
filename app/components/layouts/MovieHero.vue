<!-- components/layouts/MovieHero.vue -->
<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['show-details'])

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};

const imageUrl = computed(() => {
  return props.movie.backdrop?.url || 
         props.movie.poster?.url || 
         '/fallback-image.jpg';
});

const showDetails = () => {
  emit('show-details', props.movie)
}
</script>

<template>
  <div class="relative w-full h-[924px] overflow-hidden">
    <div class="absolute top-0 right-0 w-[150%] h-[150%] overflow-hidden">
      <NuxtImg
        :src="imageUrl"
        class="absolute left-[470px] top-[470px] w-full h-full object-center object-cover transform -translate-y-1/2 -translate-x-0"
        :alt="movie?.name || 'Кадр из фильма'"
        loading="eager"
        :modifiers="{ quality: 90, format: 'webp' }"
        @error="handleImageError"
      />
    </div>

    <!-- Градиент -->
    <div
      class="absolute inset-0 w-full h-full bg-gradient-to-b from-white/0 via-black/70 to-black/90 from-30% to-74%"
    ></div>

    <!-- Блок с названием -->
    <div class="absolute w-[1280px] left-[79px] top-[374px] p-0">
      <h1 class="text-white tracking-[1.5px] font-[Bebas_Neue] text-[72px] uppercase font-bold mb-4">
        {{ movie?.name || 'Название фильма' }}
      </h1>

      <div
        v-if="movie?.description"
        class="text-white font-urbanist font-normal text-[18px] leading-[27px] tracking-normal max-w-[600px] line-clamp-4 mb-10"
      >
        {{ movie.description }}
      </div>

      <button
        @click="showDetails"
        class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-lg transition-all duration-300 transform cursor-pointer hover:scale-110 active:scale-95 shadow-xl hover:shadow-red-700/60 text-xl relative overflow-hidden group"
      >
        <span class="relative z-10 flex items-center justify-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Смотреть
        </span>
        <span
          class="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
        ></span>
      </button>
    </div>
  </div>
</template>