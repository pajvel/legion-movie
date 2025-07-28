export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      kinopoiskApiKey: process.env.KINOPOISK_API_KEY || '',
      kinopoiskSeriesApiKey: process.env.KINOPOISK_SERIES_API_KEY || ''
    }
  },
  vite: {
    define: {
      'window.FormData': 'FormData',
      'global.FormData': 'FormData'
    },
    optimizeDeps: {
      exclude: ['form-data',  'axios']
    }
  },
  imports: {
    dirs: ['composables']
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  devtools: { enabled: false }
})