<script setup lang="tsx">
import { computed, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defaultThemeData } from '@/shared'

import {
  AppShell,
  AppShellHeader,
  ColorInput,
  ModalSystem,
  NotificationSystem,
  RokuProvider,
  SchemeSwitch,
  Tag,
  TreeList,
} from '../components'
import { defaultDemoRouteName, demoPages, isDemoRouteName } from './demoPages'

const route = useRoute()
const router = useRouter()

const currentPage = computed<string>({
  get: () => {
    const name = route.name
    if (typeof name === 'string' && isDemoRouteName(name)) {
      return name
    }
    return defaultDemoRouteName
  },
  set: (value: string) => {
    if (!isDemoRouteName(value)) {
      return
    }
    if (route.name === value) {
      return
    }
    void router.push({ name: value })
  },
})

const treeListItems = computed(() => [
  {
    title: 'Components',
    open: true,
    children: demoPages.map(page => ({
      value: page.key,
      title: page.title,
    })),
  },
])

const primaryColor = ref('#0067cc')
const surfaceColor = ref('#121212')

const globalTheme = ref({
  ...defaultThemeData,
})

watch([primaryColor, surfaceColor], () => {
  globalTheme.value.colors.primary = primaryColor.value
  globalTheme.value.colors.surface = surfaceColor.value
}, { deep: true })

function updateGlobalTheme(newTheme: any): void {
  globalTheme.value = { ...newTheme }
}

provide('globalTheme', globalTheme)
provide('updateGlobalTheme', updateGlobalTheme)
</script>

<template>
  <RokuProvider
    :theme-obj="globalTheme"
    class="roku-scrollbar !scrollbar-thumb-hover-color-surface-4 !dark:scrollbar-thumb-hover-color-surface-5"
  >
    <NotificationSystem />
    <ModalSystem />

    <AppShell
      header-height="64px"
      navbar-width="280px"
      :header-spans-nav="true"
      :header-spans-aside="false"
      padding="0"
    >
      <template #header>
        <AppShellHeader
          :bordered="false"
          padding="24px"
          align="between"
        >
          <div class="flex gap-3 items-center">
            <h1 class="text-surface text-2xl font-bold">
              Roku UI Vue
            </h1>
            <Tag
              color="primary"
              size="sm"
            >
              Demo
            </Tag>
          </div>
          <div class="flex gap-3 items-center">
            <SchemeSwitch />
            <ColorInput v-model="primaryColor" />
            <ColorInput v-model="surfaceColor" />
          </div>
        </AppShellHeader>
      </template>

      <template #navbar>
        <div class="flex flex-col h-full">
          <div class="border-surface p-4 border-b">
            <h2 class="text-surface text-lg font-semibold">
              Components
            </h2>
          </div>
          <div class="flex-1 overflow-y-auto">
            <TreeList
              v-model="currentPage"
              :items="treeListItems"
            />
          </div>
        </div>
      </template>
      <div class="bg-surface-base h-full overflow-y-auto">
        <div class="m-auto container">
          <RouterView v-slot="{ Component }">
            <component
              :is="Component"
              v-if="Component"
            />
          </RouterView>
        </div>
      </div>
    </AppShell>
  </RokuProvider>
</template>
