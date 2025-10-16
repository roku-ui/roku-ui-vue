<script setup lang="ts">
import type { MenuData } from '../../components/Menu.vue'
import { h, ref } from 'vue'
import { Btn, Menu, Paper } from '@/components'
import Avatar from '@/components/Avatar.vue'

const lastAction = ref<string>('None')
const controlledOpen = ref(false)

function renderProfile() {
  return h('div', { class: 'flex items-center gap-3 px-2 py-1.5' }, [
    h(Avatar, { size: 'sm', name: 'Alex Parker' }),
    h('div', { class: 'flex flex-col leading-tight' }, [
      h('span', { class: 'font-medium text-surface' }, 'Alex Parker'),
      h('span', { class: 'text-xs text-surface-dimmed' }, 'Product Manager'),
    ]),
  ])
}

const accountMenu = [
  { render: renderProfile },
  { role: 'divider' },
  { value: 'profile', title: 'View Profile', icon: 'i-tabler-user' },
  { value: 'billing', title: 'Billing', icon: 'i-tabler-credit-card' },
  {
    title: 'Notifications',
    icon: 'i-tabler-bell',
    children: [
      { value: 'notif.all', title: 'View All' },
      { value: 'notif.settings', title: 'Notification Settings' },
    ],
  },
  { role: 'divider' },
  { value: 'signout', title: 'Sign Out', icon: 'i-tabler-logout-2', closeOnSelect: true },
] satisfies MenuData[]

const hoverMenu = [
  { value: 'today', title: 'Today', icon: 'i-tabler-sun' },
  { value: 'week', title: 'This Week', icon: 'i-tabler-calendar-week' },
  { value: 'month', title: 'This Month', icon: 'i-tabler-calendar-month' },
  {
    title: 'Custom Range',
    icon: 'i-tabler-calendar-event',
    children: [
      { value: 'range.7', title: 'Last 7 Days' },
      { value: 'range.30', title: 'Last 30 Days' },
      { value: 'range.90', title: 'Last 90 Days' },
    ],
  },
] satisfies MenuData[]

const contextMenu = [
  { value: 'open', title: 'Open', icon: 'i-tabler-folder-open' },
  { value: 'duplicate', title: 'Duplicate', icon: 'i-tabler-copy' },
  { value: 'share', title: 'Share', icon: 'i-tabler-share' },
  { role: 'divider' },
  { value: 'archive', title: 'Archive', icon: 'i-tabler-archive', disabled: true },
  { value: 'delete', title: 'Delete', icon: 'i-tabler-trash', closeOnSelect: true },
] satisfies MenuData[]

function handleSelect(value?: number | string | symbol) {
  if (value === undefined) {
    lastAction.value = 'Custom handler'
    return
  }
  lastAction.value = String(value)
}

function handleControlledSelect(value?: number | string | symbol) {
  handleSelect(value)
  controlledOpen.value = false
}
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Menu Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Account Actions
      </h2>

      <div class="flex flex-wrap gap-4">
        <Menu
          :data="accountMenu"
          @select="handleSelect"
        >
          <Btn>
            Open Account Menu
          </Btn>
        </Menu>

        <Menu
          v-model="controlledOpen"
          :data="accountMenu"
          @select="handleControlledSelect"
        >
          <Btn color="neutral">
            Controlled Menu · {{ controlledOpen ? 'Open' : 'Closed' }}
          </Btn>
        </Menu>
      </div>

      <p class="text-sm text-surface-dimmed">
        Last action: {{ lastAction }}
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Hover Trigger
      </h2>

      <Menu
        trigger="hover"
        :data="hoverMenu"
        @select="handleSelect"
      >
        <Paper class="cursor-pointer px-4 py-2">
          Hover to open
        </Paper>
      </Menu>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Context Menu
      </h2>

      <Menu
        :data="contextMenu"
        trigger="contextmenu"
        @select="handleSelect"
      >
        <Paper class="px-6 py-10 text-center">
          Right-click to open menu
        </Paper>
      </Menu>
    </section>
  </div>
</template>
