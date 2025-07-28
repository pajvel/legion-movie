<!-- components/ContentModal.vue -->
<template>
  <Transition name="modal-fade">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      @click.self="close"
    >
      <!-- Затемнение с blur-эффектом -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-lg"></div>

      <!-- Основной контейнер -->
      <Transition name="modal-scale">
        <div 
          class="relative w-full max-w-6xl h-[90vh] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl overflow-hidden shadow-2xl border border-[#ffffff08]"
          :style="{
            'box-shadow': '0 25px 50px -12px rgba(255, 76, 76, 0.25)'
          }"
        >
          <!-- Кнопка закрытия -->
          <button 
            @click="close"
            class="absolute top-5 right-5 z-20 p-2 bg-[#ffffff10] rounded-full hover:bg-[#FF4C4C] transition-all duration-300 group"
            aria-label="Закрыть"
          >
            <svg class="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Контент -->
          <div class="h-full flex flex-col md:flex-row">
            <!-- Левая часть (постер) -->
            <div class="relative w-full md:w-2/5 h-80 md:h-auto bg-[#0f0f0f] overflow-hidden">
              <NuxtImg
                :src="content.poster?.url || '/placeholder-movie.jpg'"
                class="absolute inset-0 w-full h-full object-cover transition-all duration-700 hover:scale-105"
                :alt="content.name"
                width="800"
                height="1200"
                loading="eager"
                :modifiers="{ quality: 90, format: 'webp' }"
              />
              
              <!-- Градиент поверх постера -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <!-- Основная информация -->
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <h1 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {{ content.name }}
                </h1>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span 
                    v-for="genre in content.genres || []" 
                    :key="genre.name"
                    class="px-3 py-1 bg-[#FF4C4C] text-black text-xs font-bold rounded-full"
                  >
                    {{ genre.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Правая часть (информация) -->
            <div class="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <!-- Мета-информация -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div class="bg-[#ffffff08] p-3 rounded-xl">
                  <div class="text-gray-400 text-xs mb-1">Год</div>
                  <div class="text-white font-medium">{{ content.year || '—' }}</div>
                </div>
                <div class="bg-[#ffffff08] p-3 rounded-xl">
                  <div class="text-gray-400 text-xs mb-1">Рейтинг</div>
                  <div class="text-[#FF4C4C] font-bold">{{ content.rating?.kp?.toFixed(1) || '—' }}</div>
                </div>
                <div class="bg-[#ffffff08] p-3 rounded-xl">
                  <div class="text-gray-400 text-xs mb-1">Длительность</div>
                  <div class="text-white font-medium">
                    {{ content.movieLength || content.seriesLength || '—' }} мин
                  </div>
                </div>
                <div class="bg-[#ffffff08] p-3 rounded-xl">
                  <div class="text-gray-400 text-xs mb-1">Страна</div>
                  <div class="text-white">
                    {{ content.countries?.[0]?.name || '—' }}
                  </div>
                </div>
              </div>

              <!-- Описание -->
              <div class="mb-8">
                <h2 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="w-1 h-6 bg-[#FF4C4C] mr-2"></span>
                  О фильме
                </h2>
                <p class="text-gray-300 leading-relaxed">
                  {{ content.description || 'Описание отсутствует' }}
                </p>
              </div>

              <!-- Актерский состав -->
              <div v-if="actors.length" class="mb-8">
                <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                  <span class="w-1 h-6 bg-[#FF4C4C] mr-2"></span>
                  Актерский состав
                </h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div 
                    v-for="actor in actors.slice(0, 10)" 
                    :key="actor.id"
                    class="group"
                  >
                    <div class="relative overflow-hidden rounded-lg aspect-[2/3] mb-2">
                      <NuxtImg
                        v-if="actor.photo"
                        :src="actor.photo"
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        :alt="actor.name"
                        width="200"
                        height="300"
                        loading="lazy"
                      />
                      <div v-else class="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div class="text-center">
                      <div class="text-white font-medium truncate">{{ actor.name }}</div>
                      <div class="text-gray-400 text-xs mt-1">{{ getProfessionName(actor.enProfession) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Дополнительная информация -->
              <div v-if="content.budget || content.premiere" class="mb-8">
                <h2 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="w-1 h-6 bg-[#FF4C4C] mr-2"></span>
                  Детали
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-if="content.budget?.value" class="bg-[#ffffff08] p-4 rounded-xl">
                    <div class="text-gray-400 text-sm mb-1">Бюджет</div>
                    <div class="text-white font-medium">
                      {{ content.budget.value.toLocaleString() }} {{ content.budget.currency }}
                    </div>
                  </div>
                  <div v-if="content.premiere?.world" class="bg-[#ffffff08] p-4 rounded-xl">
                    <div class="text-gray-400 text-sm mb-1">Премьера в мире</div>
                    <div class="text-white">{{ formatDate(content.premiere.world) }}</div>
                  </div>
                  <div v-if="content.slogan" class="md:col-span-2 bg-[#ffffff08] p-4 rounded-xl">
                    <div class="text-gray-400 text-sm mb-1">Слоган</div>
                    <div class="text-white italic">"{{ content.slogan }}"</div>
                  </div>
                </div>
              </div>

              <!-- Интересные факты -->
              <div v-if="facts.length" class="mb-4">
                <h2 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="w-1 h-6 bg-[#FF4C4C] mr-2"></span>
                  Интересные факты
                </h2>
                <div class="space-y-3">
                  <div 
                    v-for="(fact, index) in facts.slice(0, 3)"
                    :key="index"
                    class="bg-[#ffffff08] p-4 rounded-xl transition-all hover:bg-[#ffffff12]"
                  >
                    <div class="text-white text-sm" v-html="fact.value.replace(/<.*?>/g, '')"></div>
                  </div>
                </div>
              </div>

              <!-- Кнопка Кинопоиска -->
              <a
                :href="`https://www.kinopoisk.ru/film/${content.id}/`"
                target="_blank"
                class="mt-6 inline-flex items-center justify-center gap-2 bg-[#FF4C4C] hover:bg-[#FF3A3A] text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Открыть на Кинопоиске
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const actors = computed(() => {
  return props.content.persons?.filter(p => 
    ['actor', 'director', 'producer'].includes(p.enProfession)
  ) || []
})

const facts = computed(() => {
  return props.content.facts || []
})

const getProfessionName = (profession) => {
  const professions = {
    'actor': 'Актер',
    'director': 'Режиссер',
    'producer': 'Продюсер',
    'writer': 'Сценарист'
  }
  return professions[profession] || profession
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
/* Анимация затемнения */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Анимация модального окна */
.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Кастомный скроллбар */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #FF4C4C #1a1a1a;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1a1a1a;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #FF4C4C;
  border-radius: 3px;
}
</style>