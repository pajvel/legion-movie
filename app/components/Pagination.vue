<!-- components/Pagination.vue -->
<template>
  <div class="flex justify-center mt-8 mb-12">
    <div class="flex items-center gap-1 bg-[#222222] p-2 rounded-lg">
      <button 
        @click="goToPage(1)" 
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded-md disabled:opacity-30 hover:bg-[#333333] transition-colors"
      >
        &laquo;
      </button>
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded-md disabled:opacity-30 hover:bg-[#333333] transition-colors"
      >
        &lsaquo;
      </button>

      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          @click="goToPage(page)"
          :class="{
            'bg-[#FF4C4C] text-white': page === currentPage,
            'hover:bg-[#333333]': page !== currentPage
          }"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        >
          {{ page }}
        </button>
        <span v-else class="px-2">...</span>
      </template>

      <button 
        @click="goToPage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded-md disabled:opacity-30 hover:bg-[#333333] transition-colors"
      >
        &rsaquo;
      </button>
      <button 
        @click="goToPage(totalPages)" 
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded-md disabled:opacity-30 hover:bg-[#333333] transition-colors"
      >
        &raquo;
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-changed'])

const visiblePages = computed(() => {
  const pages = []
  const range = 2 // Сколько страниц показывать вокруг текущей
  
  let start = Math.max(1, props.currentPage - range)
  let end = Math.min(props.totalPages, props.currentPage + range)
  
  // Добавляем первую страницу и разделитель если нужно
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  
  // Добавляем основной диапазон
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  // Добавляем последнюю страницу и разделитель если нужно
  if (end < props.totalPages) {
    if (end < props.totalPages - 1) pages.push('...')
    pages.push(props.totalPages)
  }
  
  return pages
})

const goToPage = (page) => {
  if (page === '...') return
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-changed', page)
  }
}
</script>