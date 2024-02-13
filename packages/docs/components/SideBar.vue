<script setup lang="ts">
import { Btn } from '@roku-ui/vue'
import { NuxtLink } from '#components'

defineProps<{
  isOpen: boolean
}>()
const contentComponents = await queryContent('components').find()
</script>

<template>
  <div
    :class="{
      '-translate-x-100%': !isOpen,
      'translate-x-0': isOpen,
    }"
    class="fixed top-12 z-10 h-100vh min-w-64 w-33vw flex flex-col items-end gap-2 bg-surface-low transition-transform,background-color md:translate-x-0"
  >
    <div class="w-72 flex flex-col gap-8 px-8 py-6">
      <div>
        <div>
          <NuxtLink
            to="/"
            class="text-xl font-bold"
          >
            Roku UI - Vue
          </NuxtLink>
        </div>
        <NuxtLink
          to="/"
          class="text-sm op58"
        >
          @roku-ui/vue
        </NuxtLink>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="px-2 text-xs text-surface-on-low">
            工具
          </div>
          <div>
            <Btn
              :is="NuxtLink"
              icon
              href="/tools/theme"
              variant="ghost"
            >
              <i class="i-tabler-color-filter" />
            </Btn>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="px-2 text-xs text-surface-on-low">
            组件
          </div>
          <div>
            <NuxtLink
              v-for="content in contentComponents"
              :key="content.slug"
              :to="content._path"
              :text="content.title"
              class="content-link block rounded p-1 px-2 text-sm hover:bg-surface-border-base/25"
            >
              {{ content.title }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.content-link.router-link-active {
  color: rgb(var(--r-color-primary-containerl));
}
</style>

<style scoped>
* {
  outline-width: 2px;
  outline-offset: 1px;
}
*:focus-visible {
  --un-outline-color-opacity: 1;
  outline-color: rgb(
    var(--r-color-primary-container) / var(--un-outline-color-opacity)
  );
  outline-style: solid;
}
</style>
