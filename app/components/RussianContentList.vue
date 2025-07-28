<!-- components/RussianContentList.vue -->
<template>
  <div class="min-h-screen h-full bg-[#1b1b1b] pt-[90px] pb-10">
    <div class="w-[880px] mx-auto">
      <h1 class="text-white text-2xl font-bold mb-6">Лучшее русское кино</h1>
      
      <div v-if="loading" class="space-y-6 mb-8">
        <div v-for="n in 20" :key="n" class="flex bg-[#222222] rounded-xl h-[260px] animate-pulse">
          <div class="w-12 flex-shrink-0 bg-[#333333]"></div>
          <div class="w-[180px] h-full flex-shrink-0 bg-[#333333]"></div>
          <div class="flex-1 p-5">
            <div class="h-6 bg-[#333333] rounded mb-4 w-3/4"></div>
            <div class="h-4 bg-[#333333] rounded mb-6 w-1/2"></div>
            <div class="h-4 bg-[#333333] rounded mb-6 w-1/4"></div>
          </div>
        </div>
      </div>

      <div v-else class="space-y-6 mb-8">
        <ContentBlock 
          v-for="(item, index) in content"
          :key="`${currentPage}-${item.id || index}`"
          :movie="item"
          :index="(currentPage - 1) * 20 + index + 1"
          @show-details="openModal"
        />
      </div>

      <div class="flex justify-center mt-8">
        <div class="flex items-center gap-2 bg-[#222222] px-4 py-2 rounded-lg">
          <button 
            v-for="page in 5"
            :key="page"
            @click="changePage(page)"
            :class="{
              'bg-[#FF4C4C] text-white': page === currentPage,
              'hover:bg-[#333333]': page !== currentPage
            }"
            class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <ContentModal 
      v-if="selectedContent"
      :content="selectedContent"
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
  import { useSeriesApi } from '@/composables/useSeriesApi'

const route = useRoute()
const router = useRouter()
const { fetchTopRussianContent } = useSeriesApi()

const content = ref([])
const loading = ref(false)
const currentPage = ref(1)
const isModalOpen = ref(false)
const selectedContent = ref(null)

const { fetchMovie } = useKinopoiskApi();
const { fetchSeriesDetails } = useSeriesApi();

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

const loadContent = async (page) => {
  try {
    loading.value = true
    const result = await fetchTopRussianContent(page)
    content.value = result.content
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  currentPage.value = page
  router.push({ query: { page } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadContent(page)
}

onMounted(() => {
  const pageFromUrl = parseInt(route.query.page) || 1
  currentPage.value = Math.min(5, Math.max(1, pageFromUrl))
  loadContent(currentPage.value)
})
</script>