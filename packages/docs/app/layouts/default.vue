<script setup lang="ts">
import { Btn, RokuProvider, SchemeSwitch, useMergedCS, useThemeData } from '@roku-ui/vue'
import { surfaceBorderCS, surfaceCS } from '~/utils/colors'

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
function toggleSideBar() {
  sideBarOpen.value = !sideBarOpen.value
}
const primary = ref('#3F9CDC')
const secondary = ref('#5999A6')
const tertiary = ref('#F76C22')
const error = ref('#F95858')
const surface = ref('#121212')
const theme = useThemeData('custom', {
  primary,
  secondary,
  tertiary,
  error,
  surface,
})
provide('docThemeColor', {
  primary,
  secondary,
  tertiary,
  error,
  surface,
})
const mergedCS = useMergedCS(surfaceBorderCS, surfaceCS)
</script>

<template>
  <RokuProvider
    theme="default"
    :themes="{
      default: theme,
    }"
  >
    <NuxtLoadingIndicator
      color="rgb(var(--r-color-primary-container))"
    />
    <div
      v-bind="mergedCS"
      class="pl-2 pr-2 border-b flex gap-2 h-12 w-100vw items-center fixed z-10 md:pl-[calc(33vw-288px+32px)]!"
    >
      <div>
        <Btn
          icon
          class="!hidden"
          size="sm"
          @click="toggleSideBar"
        >
          <i class="i-tabler-menu" />
        </Btn>
        <NuxtLink to="/">
          <img
            width="24px"
            height="24px"
            alt="Roku UI"
            src="/icon.png"
          >
        </NuxtLink>
      </div>
      <SchemeSwitch
        circle-translation
        animation
      />
    </div>
    <div class="flex min-h-100vh">
      <SideBar :is-open="sideBarOpen" />
      <div class="px-4 flex-grow max-w-42rem w-full prose md:ml-[calc(33vw+2rem)] md:mr-8">
        <div class="pb-24">
          <slot />
        </div>
      </div>
    </div>
  </RokuProvider>
</template>

<style>
::view-transition-image-pair(root) {
  isolation: auto;
}
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
  display: block;
}
</style>
