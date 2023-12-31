<script setup lang="ts">
import { Btn, RokuProvider, ThemeSwitch } from '@roku-ui/vue'

useSeoMeta({
  title: 'Roku UI',
  description: 'Roku UI is a Vue 3 component library for Roku UI.',
  ogTitle: '[og:title]',
  ogDescription: '[og:description]',
  ogImage: '[og:image]',
  ogUrl: '[og:url]',
  twitterTitle: '[twitter:title]',
  twitterDescription: '[twitter:description]',
  twitterImage: '[twitter:image]',
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
      href: '/favicon.png',
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
    <div class="fixed z-10 h-12 w-100vw flex items-center gap-2 border-b border-surface-border bg-surface-base pl-2 pr-2 md:pl-[calc(33vw-256px+32px)]!">
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
        <div>
          Logo
        </div>
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

<style>
:root{
  --r-color-primary-0: 229 247 255;
  --r-color-primary-1: 211 235 250;
  --r-color-primary-2: 169 212 241;
  --r-color-primary-3: 124 189 233;
  --r-color-primary-4: 87 169 224;
  --r-color-primary-5: 63 156 220;
  --r-color-primary-6: 48 150 220;
  --r-color-primary-7: 31 130 196;
  --r-color-primary-8: 15 115 176;
  --r-color-primary-9: 0 100 156;
  --r-color-primary-10: 8 47 73;
  --r-color-secondary-0: 233 251 240;
  --r-color-secondary-1: 220 241 227;
  --r-color-secondary-2: 186 223 199;
  --r-color-secondary-3: 150 206 169;
  --r-color-secondary-4: 119 191 144;
  --r-color-secondary-5: 99 181 128;
  --r-color-secondary-6: 88 176 119;
  --r-color-secondary-7: 71 154 100;
  --r-color-secondary-8: 59 138 88;
  --r-color-secondary-9: 44 119 73;
  --r-color-secondary-10: 2 44 34;
  --r-color-tertiary-0: 255 247 225;
  --r-color-tertiary-1: 255 237 205;
  --r-color-tertiary-2: 252 217 158;
  --r-color-tertiary-3: 249 196 107;
  --r-color-tertiary-4: 247 178 63;
  --r-color-tertiary-5: 246 167 36;
  --r-color-tertiary-6: 245 161 19;
  --r-color-tertiary-7: 218 140 4;
  --r-color-tertiary-8: 195 125 0;
  --r-color-tertiary-9: 170 106 0;
  --r-color-tertiary-10: 87 37 8;
  --r-color-error-0: 255 234 234;
  --r-color-error-1: 252 213 213;
  --r-color-error-2: 242 168 169;
  --r-color-error-3: 234 122 122;
  --r-color-error-4: 226 83 83;
  --r-color-error-5: 222 57 57;
  --r-color-error-6: 221 43 43;
  --r-color-error-7: 196 30 31;
  --r-color-error-8: 175 23 26;
  --r-color-error-9: 154 9 19;
  --r-color-error-10: 69 10 10;
  --r-color-surface-0: 250 250 250;
  --r-color-surface-1: 245 245 245;
  --r-color-surface-2: 229 229 229;
  --r-color-surface-3: 212 212 212;
  --r-color-surface-4: 163 163 163;
  --r-color-surface-5: 115 115 115;
  --r-color-surface-6: 82 82 82;
  --r-color-surface-7: 64 64 64;
  --r-color-surface-8: 38 38 38;
  --r-color-surface-9: 23 23 23;
  --r-color-surface-10: 10 10 10;
  color-scheme: light dark;
  font-family: Roboto, sans-serif;
  background-color: rgb(var(--r-color-surface-low));
}
</style>
