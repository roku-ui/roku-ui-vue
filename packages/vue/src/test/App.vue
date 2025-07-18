<script setup lang="tsx">
import { computed, ref } from 'vue'
import { primaryColor, surfaceColor } from '..'

import AppShellDemo from './demo/AppShellDemo.vue'
import AvatarDemo from './demo/AvatarDemo.vue'
import ButtonDemo from './demo/ButtonDemo.vue'
import CalendarDemo from './demo/CalendarDemo.vue'
import CalendarFieldDemo from './demo/CalendarFieldDemo.vue'
import ChatDemo from './demo/ChatDemo.vue'
import FormDemo from './demo/FormDemo.vue'
import LayoutDemo from './demo/LayoutDemo.vue'
import MediaDemo from './demo/MediaDemo.vue'
import ModalDemo from './demo/ModalDemo.vue'
import NavigationDemo from './demo/NavigationDemo.vue'
import NotificationDemo from './demo/NotificationDemo.vue'
import PopoverDemo from './demo/PopoverDemo.vue'
import RatingDemo from './demo/RatingDemo.vue'
import SelectAreaDemo from './demo/SelectAreaDemo.vue'
import SelectDemo from './demo/SelectDemo.vue'
import SliderDemo from './demo/SliderDemo.vue'
import SwitchDemo from './demo/SwitchDemo.vue'
import TagsDemo from './demo/TagsDemo.vue'
import TooltipDemo from './demo/TooltipDemo.vue'
import WaterfallDemo from './demo/WaterfallDemo.vue'

const currentPage = ref('AppShell')

const demoPages = [
  { key: 'AppShell', title: 'App Shell', component: AppShellDemo },
  { key: 'Avatar', title: 'Avatar', component: AvatarDemo },
  { key: 'Button', title: 'Button', component: ButtonDemo },
  { key: 'Calendar', title: 'Calendar', component: CalendarDemo },
  { key: 'CalendarField', title: 'Calendar Field', component: CalendarFieldDemo },
  { key: 'Chat', title: 'Chat', component: ChatDemo },
  { key: 'Form', title: 'Form Controls', component: FormDemo },
  { key: 'Layout', title: 'Layout', component: LayoutDemo },
  { key: 'Media', title: 'Media & Colors', component: MediaDemo },
  { key: 'Modal', title: 'Modal & Drawer', component: ModalDemo },
  { key: 'Navigation', title: 'Navigation', component: NavigationDemo },
  { key: 'Notification', title: 'Notification', component: NotificationDemo },
  { key: 'Popover', title: 'Popover', component: PopoverDemo },
  { key: 'Rating', title: 'Rating', component: RatingDemo },
  { key: 'Select', title: 'Select', component: SelectDemo },
  { key: 'SelectArea', title: 'Select Area', component: SelectAreaDemo },
  { key: 'Tags', title: 'Tags', component: TagsDemo },
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
</script>

<template>
  <RokuProvider class="roku-scrollbar !scrollbar-thumb-hover-color-surface-4 !dark:scrollbar-thumb-hover-color-surface-5">
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
        <Paper class="w-full flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-3">
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
          <div class="flex items-center gap-3">
            <SchemeSwitch />
            <ColorInput v-model="primaryColor" />
            <ColorInput v-model="surfaceColor" />
          </div>
        </Paper>
      </template>

      <template #navbar>
        <div class="h-full flex flex-col">
          <div class="border-b border-surface p-4">
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
      <div class="h-full overflow-y-auto bg-surface-base">
        <div class="container m-auto">
          <component :is="currentComponent" />
        </div>
      </div>
    </AppShell>
  </RokuProvider>
</template>
