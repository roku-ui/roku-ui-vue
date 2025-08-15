<script setup lang="tsx">
import { computed, provide, ref, watch } from 'vue'
import { defaultThemeData } from '@/shared'

import {
  AppShell,
  ColorInput,
  ModalSystem,
  NotificationSystem,
  Paper,
  RokuProvider,
  SchemeSwitch,
  Tag,
  TreeList,
} from '../components'
import AppShellDemo from './demo/AppShellDemo.vue'
import AvatarDemo from './demo/AvatarDemo.vue'
import ButtonDemo from './demo/ButtonDemo.vue'
import CalendarDemo from './demo/CalendarDemo.vue'
import CalendarInputDemo from './demo/CalendarInputDemo.vue'
import ChatDemo from './demo/ChatDemo.vue'
import ComponentDefaultsDemo from './demo/ComponentDefaultsDemo.vue'
import FormDemo from './demo/FormDemo.vue'
import LayoutDemo from './demo/LayoutDemo.vue'
import MediaDemo from './demo/MediaDemo.vue'
import ModalDemo from './demo/ModalDemo.vue'
import ModernColorDemo from './demo/ModernColorDemo.vue'
import NavigationDemo from './demo/NavigationDemo.vue'
import NotificationDemo from './demo/NotificationDemo.vue'
import PopoverDemo from './demo/PopoverDemo.vue'
import ProgressDemo from './demo/ProgressDemo.vue'
import RatingDemo from './demo/RatingDemo.vue'
import SelectAreaDemo from './demo/SelectAreaDemo.vue'
import SelectDemo from './demo/SelectDemo.vue'
import SliderDemo from './demo/SliderDemo.vue'
import SwitchDemo from './demo/SwitchDemo.vue'
import TagsDemo from './demo/TagsDemo.vue'
import TextFieldDemo from './demo/TextFieldDemo.vue'
import ThemeManagerDemo from './demo/ThemeManagerDemo.vue'
import TooltipDemo from './demo/TooltipDemo.vue'
import WaterfallDemo from './demo/WaterfallDemo.vue'

const currentPage = ref('AppShell')

const demoPages = [
  { key: 'AppShell', title: 'App Shell', component: AppShellDemo },
  { key: 'Avatar', title: 'Avatar', component: AvatarDemo },
  { key: 'Button', title: 'Button', component: ButtonDemo },
  { key: 'Calendar', title: 'Calendar', component: CalendarDemo },
  { key: 'CalendarInput', title: 'Calendar Input', component: CalendarInputDemo },
  { key: 'Chat', title: 'Chat', component: ChatDemo },
  { key: 'ComponentDefaults', title: 'Component Defaults', component: ComponentDefaultsDemo },
  { key: 'Form', title: 'Form Controls', component: FormDemo },
  { key: 'Layout', title: 'Layout', component: LayoutDemo },
  { key: 'Media', title: 'Media & Colors', component: MediaDemo },
  { key: 'Modal', title: 'Modal & Drawer', component: ModalDemo },
  { key: 'ModernColor', title: 'Modern Color System', component: ModernColorDemo },
  { key: 'Navigation', title: 'Navigation', component: NavigationDemo },
  { key: 'Notification', title: 'Notification', component: NotificationDemo },
  { key: 'Popover', title: 'Popover', component: PopoverDemo },
  { key: 'Progress', title: 'Progress', component: ProgressDemo },
  { key: 'Rating', title: 'Rating', component: RatingDemo },
  { key: 'Select', title: 'Select', component: SelectDemo },
  { key: 'SelectArea', title: 'Select Area', component: SelectAreaDemo },
  { key: 'Tags', title: 'Tags', component: TagsDemo },
  { key: 'TextField', title: 'TextField', component: TextFieldDemo },
  { key: 'ThemeManager', title: 'Theme Manager', component: ThemeManagerDemo },
  { key: 'Tooltip', title: 'Tooltip', component: TooltipDemo },
  { key: 'Waterfall', title: 'Waterfall', component: WaterfallDemo },
  { key: 'Slider', title: 'Slider', component: SliderDemo },
  { key: 'Switch', title: 'Switch', component: SwitchDemo },
]

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

const currentComponent = computed(() => {
  const page = demoPages.find(p => p.key === currentPage.value)
  return page?.component || AppShellDemo
})

// Create reactive theme colors for the demo
const primaryColor = ref('#0067cc')
const surfaceColor = ref('#121212')

const globalTheme = ref({
  ...defaultThemeData,
})

watch([primaryColor, surfaceColor], () => {
  globalTheme.value.colors.primary = primaryColor.value
  globalTheme.value.colors.surface = surfaceColor.value
}, { deep: true })

// 提供主题更新函数给子组件
function updateGlobalTheme(newTheme: any) {
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
      gap="0"
    >
      <template #header>
        <Paper class="px-6 py-4 flex w-full items-center justify-between">
          <div class="flex gap-3 items-center">
            <h1 class="text-2xl text-surface font-bold">
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
        </Paper>
      </template>

      <template #navbar>
        <div class="flex flex-col h-full">
          <div class="p-4 border-b border-surface">
            <h2 class="text-lg text-surface font-semibold">
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
          <component :is="currentComponent" />
        </div>
      </div>
    </AppShell>
  </RokuProvider>
</template>
