<script setup lang="ts">
import { Avatar, Menu, Paper } from '@roku-ui/vue'
import { computed, h } from 'vue'

const code = computed(() => {
  return `<template>
  <Menu
    :data="[
      {
        render: customRender,
      },
      { value: 'item1', title: 'Item 1', icon: 'i-tabler-activity' },
      { value: 'item2', title: 'Item 2', icon: 'i-tabler-alert-triangle' },
      {
        title: 'Item 3',
        icon: 'i-tabler-alert-circle',
        children: [
          {
            value: 'item3.1',
            title: 'Item 3.1',
            icon: 'i-tabler-alert-triangle',
          },
          {
            value: 'item3.2',
            title: 'Item 3.2',
            icon: 'i-tabler-alert-circle',
          },
        ],
      },
    ]"
    trigger="contextmenu"
    @select="console.log"
  >
    <Paper>
      Context Menu
    </Paper>
  </Menu>
</template>`
})

function customRender() {
  return h('div', { class: 'flex gap-2' }, [
    h(Avatar, { size: 'sm', name: 'Avatar' }),
    h('div', {}, [
      h('div', { class: 'text-surface' }, 'Custom Render'),
      h('div', { class: 'text-surface-dimmed' }, 'Custom Render'),
    ]),
  ])
}
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <Menu
        :data="[
          {
            render: customRender,
          },
          { value: 'item1', title: 'Item 1', icon: 'i-tabler-activity' },
          { value: 'item2', title: 'Item 2', icon: 'i-tabler-alert-triangle' },
          {
            title: 'Item 3',
            icon: 'i-tabler-alert-circle',
            children: [
              {
                value: 'item3.1',
                title: 'Item 3.1',
                icon: 'i-tabler-alert-triangle',
              },
              {
                value: 'item3.2',
                title: 'Item 3.2',
                icon: 'i-tabler-alert-circle',
              },
            ],
          },
        ]"
        trigger="contextmenu"
        @select="console.log"
      >
        <Paper>
          Context Menu
        </Paper>
      </Menu>
    </template>
  </Demo>
</template>
