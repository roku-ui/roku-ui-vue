// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/content',
  ],
  components: [
    {
      path: '~/components/demo',
      global: true,
      pathPrefix: true,
      prefix: 'Demo',
    },
    {
      path: '~/components',
      global: false,
      pathPrefix: true,
    },
  ],
  content: {
    highlight: {
      theme: 'github-dark',
    },
  },
})
