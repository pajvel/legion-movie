<!-- components/SearchResults.vue -->
<template>
  <div v-if="showResults" class="absolute top-full left-0 w-full mt-2 bg-[#222222] rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
    <div v-if="loading" class="p-4 text-center text-gray-400">
      Загрузка...
    </div>
    <div v-else-if="results.length === 0" class="p-4 text-center text-gray-400">
      Ничего не найдено
    </div>
    <div v-else>
      <div 
        v-for="item in results"
        :key="item.id"
        class="flex items-center p-3 hover:bg-[#333333] transition-colors border-b border-[#333333] last:border-0 cursor-pointer"
        @click="openModal(item)"
      >
        <NuxtImg 
          :src="item.poster?.previewUrl || '/placeholder-movie.jpg'"
          class="w-12 h-16 object-cover rounded mr-3"
        />
        <div>
          <div class="text-white font-medium">{{ item.name }}</div>
          <div class="text-gray-400 text-sm">
            {{ item.year }} • 
            <span class="text-[#FF4C4C]">
              {{ item.type === 'movie' ? 'Фильм' : 'Сериал' }}
            </span>
            <span v-if="item.rating?.kp" class="ml-2">
              {{ item.rating.kp.toFixed(1) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ContentModal 
    v-if="selectedContent"
    :content="selectedContent"
    :is-open="isModalOpen"
    @close="closeModal"
  />
</template>

<script setup>
import { useSeriesApi } from '@/composables/useSeriesApi'

const props = defineProps({
  results: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  showResults: Boolean
})

const emit = defineEmits(['close-search'])

const isModalOpen = ref(false)
const selectedContent = ref(null)
const { fetchSeriesDetails } = useSeriesApi();
const { fetchMovie } = useSeriesApi();

const openModal = async (item) => {
  if (!item.persons || !item.facts) {
    selectedContent.value = item.type === 'movie' 
      ? await fetchMovie(item.id)
      : await fetchSeriesDetails(item.id);
  } else {
    selectedContent.value = item;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false
}
</script>