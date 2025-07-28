<template>
  <div class="min-h-screen h-full bg-[#1b1b1b]">
    <!-- Фиксированный хедер с отступом 4px сверху -->
    <div class="fixed top-4 inset-x-0 z-50">
      <AllHeader />
    </div>
    
    <!-- Основной контент с отступом под хедер --> <!-- 76px (хедер) + 4px (отступ) + 4px (доп.пространство) -->
      <NuxtPage />

  </div>
</template>

<script setup>
import AllHeader from "@/components/layouts/AllHeader.vue";
</script>