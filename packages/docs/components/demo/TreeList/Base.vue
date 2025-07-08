<script setup lang="ts">
import { TreeList } from '@roku-ui/vue'

const code = computed(() => {
  return `<template>
  <TreeList
    :items="[
      {
        title: 'Root',
        open: true,
        children: [
          {
            value: 'child1',
            title: 'Child 1',
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
        ],
      },
    ]"
  />
</template>`
})
</script>

<template>
  <Demo :code="code">
    <template #preview>
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
    </template>
  </Demo>
</template>
