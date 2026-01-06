// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@hypernym/nuxt-gsap'],
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
});
