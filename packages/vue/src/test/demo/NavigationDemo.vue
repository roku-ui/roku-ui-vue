<script setup lang="ts">
import { h, ref } from 'vue'
import Avatar from '@/components/Avatar.vue'

const tab = ref(0)
const tabs = ref(0)

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
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold">
      Navigation Demo
    </h1>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        TreeList
      </h2>

      <Paper
        class="min-h-50"
        with-border
        no-padding
      >
        <TreeList
          class="min-w-60"
          :items="[
            {
              title: 'Root',
              open: true,
              children: [
                {
                  value: 'child1',
                  title: 'Child 1',
                  attrs: {},
                },
                {
                  title: 'Child 2',
                  children: [
                    {
                      value: 'child2.1',
                      title: 'Child 2.1',
                    },
                    {
                      title: 'HEADER',
                    },
                    {
                      value: 'child2.2',
                      title: 'Child 2.2',
                    },
                  ],
                },
                {
                  title: 'Child 3',
                  children: [
                    {
                      value: 'child3.1',
                      title: 'Child 3.1',
                    },
                    {
                      value: 'child3.2',
                      title: 'Child 3.2',
                    },
                    {
                      value: 'child3.3',
                      title: 'Child 3.3',
                      attrs: {
                        href: 'https://www.google.com',
                        target: '_blank',
                      },
                    },
                  ],
                },
              ],
            },
          ]"
        />
      </Paper>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Menus
      </h2>

      <div class="flex flex-wrap gap-4">
        <Menu
          :data="[
            {
              render: customRender,
            },
            { role: 'divider' },
            { role: 'label', title: 'Item 1' },
            { value: 'item1', title: 'Item 1', icon: 'i-tabler-activity' },
            { value: 'item2', title: 'Item2Item2Item2Item2Item2', icon: 'i-tabler-alert-triangle' },
            { role: 'divider' },
            {
              title: 'Item 3Item 3Item 3Item 3Item 3Item 3',
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
                  icon: 'i-tabler-alert-triangle' },
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
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">
        Tabs
      </h2>

      <Paper>
        <Tabs v-model="tabs">
          <TabItem :value="0">
            Tab 0
          </TabItem>
          <TabItem
            v-for="i in 3"
            :key="i"
            :value="i"
            @click="() => console.log(i)"
          >
            Tab {{ i }}
          </TabItem>
          <TabItem :value="4">
            Tab 4
          </TabItem>
        </Tabs>
        {{ tabs }}
      </Paper>

      <Paper>
        <Tabs
          v-model="tab"
          direction="vertical"
        >
          <TabItem :value="0">
            Tab 0
          </TabItem>
          <TabItem :value="1">
            Tab 1
          </TabItem>
        </Tabs>
      </Paper>
    </section>
  </div>
</template>
