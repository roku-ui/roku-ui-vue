<script setup lang="ts">
import { NuxtLink } from '#components'
import { subTextCS } from '@/utils/colors'
import { Btn, useButtonCS } from '@roku-ui/vue'

defineProps<{
  isOpen: boolean
}>()
const contentComponents = await queryContent('components').find()
const btnCS = useButtonCS('transparent', 'default')
const btnActiveCS = useButtonCS('transparent', 'primary')
const route = useRoute()
</script>

<template>
  <div
    :class="{
      '-translate-x-100%': !isOpen,
      'translate-x-0': isOpen,
    }"
    class="bg-surface-low fixed top-12 z-10 h-100vh min-w-64 w-33vw flex flex-col items-end gap-2 transition-transform,background-color md:translate-x-0"
  >
    <div class="w-86 flex flex-col gap-8 px-8 py-6">
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
          <div
            class="text-sm"
            v-bind="subTextCS"
          >
            工具
          </div>
          <div>
            <Btn
              :is="NuxtLink"
              icon
              href="/tools/theme"
              variant="light"
            >
              <i class="i-tabler-color-filter" />
            </Btn>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-bind="subTextCS"
            class="text-sm"
          >
            组件
          </div>
          <div>
            <NuxtLink
              v-for="content in contentComponents"
              :key="content.slug"
              :to="content._path"
              :text="content.title"
              class="block rounded p-1 px-2"
              :class="[btnCS.class]"
              v-bind="btnCS"
              :style="[route.path === content._path ? btnActiveCS.style : btnCS.style]"
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
  color: rgb(var(--r-color-primary-3));
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
    var(--r-color-primary-3) / var(--un-outline-color-opacity)
  );
  outline-style: solid;
}
</style>
