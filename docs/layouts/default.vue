<script setup lang="ts">
import { Btn, RokuProvider, ThemeSwitch } from '@roku-ui/vue'

useSeoMeta({
  title: 'Roku UI',
  description: 'Roku UI is a Vue 3 component library.',
  ogTitle: 'Roku UI',
  ogDescription: 'Roku UI is a Vue 3 component library.',
  ogImage: '/icon.png',
  ogUrl: 'https://roku-ui.vercel.app/',
  twitterTitle: 'Roku UI',
  twitterDescription: 'Roku UI is a Vue 3 component library.',
  twitterImage: '/icon.png',
  twitterCard: 'summary',
})

useHead({
  htmlAttrs: {
    lang: 'zh-Hans',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/icon.png',
    },
  ],
})

const sideBarOpen = ref(false)
const size = useWindowSize()
const ltMd = computed(() => size.width.value < 768)
function toggleSideBar() {
  sideBarOpen.value = !sideBarOpen.value
}
</script>

<template>
  <RokuProvider>
    <div class="fixed z-10 h-12 w-100vw flex items-center gap-2 border-b border-surface-border bg-surface-base pl-2 pr-2 transition-all md:pl-[calc(33vw-256px+32px)]!">
      <div>
        <Btn
          icon
          :class="{
            '!hidden': !ltMd,
          }"
          size="sm"
          @click="toggleSideBar"
        >
          <i class="i-tabler-menu" />
        </Btn>
        <img
          class="h-6 w-6"
          src="/icon.png"
        >
      </div>
      <div>
        <ThemeSwitch />
      </div>
    </div>
    <div class="min-h-100vh flex">
      <SideBar :is-open="sideBarOpen" />
      <div class="max-w-42rem w-full flex-grow px-4 prose md:ml-[calc(33vw+2rem)] md:mr-8">
        <div class="pb-24">
          <slot />
        </div>
      </div>
    </div>
  </RokuProvider>
</template>
