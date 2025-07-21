<script setup lang="ts">
import { Avatar, Btn, Menu } from '@roku-ui/vue'
import { h } from 'vue'

const code = computed(() => {
  return `<template>
  <Menu
    :data="[
      {
        render: customRender,
      },
      { role: 'divider' },
      { role: 'label', title: 'Item 1' },
      { value: 'item1', title: 'Item 1', icon: 'i-tabler-activity' },
      { value: 'item2', title: 'Item 2', icon: 'i-tabler-alert-triangle' },
      { role: 'divider' },
      {
        title: 'Item 3',
        icon: 'i-tabler-alert-circle',
        children: [
          {
            value: 'item3.1',
            title: 'Item 3.1',
          },
          {
            value: 'item3.2',
            title: 'Item 3.2',
            icon: 'i-tabler-alert-circle',
          },
        ],
      },
    ]"
    @select="console.log"
  >
    <Btn>Menu</Btn>
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
          { role: 'divider' },
          { role: 'label', title: 'Item 1' },
          { value: 'item1', title: 'Item 1', icon: 'i-tabler-activity' },
          { value: 'item2', title: 'Item 2', icon: 'i-tabler-alert-triangle' },
          { role: 'divider' },
          {
            title: 'Item 3',
            icon: 'i-tabler-alert-circle',
            children: [
              {
                value: 'item3.1',
                title: 'Item 3.1',
              },
              {
                value: 'item3.1',
                title: 'Item 3.1',
                icon: 'i-tabler-alert-triangle',
              },
              { role: 'divider' },
              {
                value: 'item3.2',
                title: 'Item 3.2',
                icon: 'i-tabler-alert-circle',
                children: [
                  {
                    value: 'item3.2.1',
                    title: 'Item 3.2.1',
                  },
                  {
                    value: 'item3.2.2',
                    title: 'Item 3.2.2',
                  },
                ],
              },
            ],
          },
        ]"
        @select="console.log"
      >
        <Btn>Menu</Btn>
      </Menu>
    </template>
  </Demo>
</template>
