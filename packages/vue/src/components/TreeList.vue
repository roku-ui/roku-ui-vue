<script setup lang="tsx">
import type { Rounded } from '@/types'
import type { VNode } from 'vue'
import { useRounded } from '@/utils'
import { computed, h, ref, Transition, watchEffect } from 'vue'

interface TreeListLinkData {
  title: string
  value: string
  attrs?: Record<string, any>
  is?: string | VNode
}

interface TreeListHeaderData {
  title: string
}

interface TreeListTitleData {
  title: string
  children: TreeListItemData[]
  open?: boolean
}

type TreeListItemData = TreeListLinkData | TreeListHeaderData | TreeListTitleData

const props = withDefaults(defineProps<{
  items: TreeListItemData[]
  rounded?: Rounded
}>(), {
  rounded: 'md',
})

const rounded = useRounded(props)

const model = defineModel<string>()

function isTitle(item: TreeListItemData): item is TreeListTitleData {
  return 'children' in item
}
function isLink(item: TreeListItemData): item is TreeListLinkData {
  return 'value' in item
}

const linkLeftIndicator = 'before:absolute before:left-4 before:h-full before:border-r before:content-[""]'
const linkItemClass = 'relative h-8 py-1 w-full flex items-center gap-2 cursor-pointer'
const linkNormalItemClass = computed(() => `${linkItemClass} hover:bg-surface-variant-1 hover:text-surface text-surface-dimmed`)
const linkActiveItemClass = computed(() => `${linkItemClass} text-primary before:border-primary bg-surface-variant-1 hover:bg-surface-variant-2`)
const titleNormalItemClass = computed(() => [linkItemClass, 'text-surface font-bold hover:bg-surface-variant-1'])
const treeListRef = ref<HTMLUListElement | null>(null)

const status = ref<Map<TreeListItemData, boolean>>(new Map())

function travel(data: TreeListItemData, level: number) {
  if (isTitle(data)) {
    status.value.set(data, data.open ?? false)
    data.children.forEach((child) => {
      travel(child, level + 1)
    })
  }
}

watchEffect(() => {
  props.items.forEach((item) => {
    if (isTitle(item)) {
      travel(item, 0)
    }
  })
})

function TreeListLink({ data, level }: { data: TreeListLinkData, level: number }) {
  const Comp = (props: any) => data.is ? h(data.is, props, data.title) : h('a', props, data.title)
  return (
    <li>
      <Comp
        {...data.attrs}
        class={[
          rounded.value.class,
          linkLeftIndicator,
          {
            [linkNormalItemClass.value]: model.value !== data.value,
            [linkActiveItemClass.value]: model.value === data.value,
          },
        ]}
        style={
          [
            {
              paddingLeft: `${32 + level * 4}px`,
            },
            rounded.value.style,
          ]
        }
        onClick={() => model.value = data.value}
      >
        {data.title}
      </Comp>
    </li>
  )
}

function TreeListHeader({ data, level }: { data: TreeListHeaderData, level: number }) {
  return (
    <li
      class={[
        'flex items-center relative py-2 text-surface-dimmed font-bold tracking-widest',
      ]}
      style={
        [
          {
            paddingLeft: `${32 + level * 4}px`,
          },
          rounded.value.style,
        ]
      }
    >
      <div class="absolute left-4 h-1/2 translate-y-1/2 border-r" />
      <div class="absolute left-[calc(1rem+0.6px)] h-2 w-2 border rounded-sm bg-surface-variant-1 -translate-x-1/2" />
      {data.title}
    </li>
  )
}

function TreeListTitle({ data, level }: { data: TreeListTitleData, level: number }) {
  const isOpen = computed(() => status.value.get(data))
  const dom = ref<HTMLLIElement | null>(null)
  const self = ref<HTMLButtonElement | null>(null)
  return (
    <li
      class="transition-height"
      ref={dom}
    >
      <button
        ref={self}
        onClick={() => status.value.set(data, !status.value.get(data))}
        class={[
          rounded.value.class,
          titleNormalItemClass.value,
        ]}
        style={
          [
            {
              paddingLeft: `${32 + level * 4}px`,
            },
            rounded.value.style,
          ]
        }
      >
        <i class={['i-tabler-chevron-down absolute left-2 h-4 w-4 py-1 transition-transform', isOpen.value ? 'rotate-0' : '-rotate-90']} />
        {data.title}
      </button>
      <Transition
        onBeforeEnter={(el) => {
          if (el instanceof HTMLElement) {
            el.style.height = `${0}px`
          }
        }}
        onEnter={(el) => {
          if (el instanceof HTMLElement) {
            el.style.height = `${el.scrollHeight}px`
          }
        }}
        onAfterEnter={(el) => {
          if (el instanceof HTMLElement) {
            el.style.height = 'auto'
          }
        }}
        onBeforeLeave={(el) => {
          if (el instanceof HTMLElement) {
            el.style.height = `${el.scrollHeight}px`
          }
        }}
        onLeave={(el) => {
          if (el instanceof HTMLElement) {
            el.style.height = `${0}px`
          }
        }}
        css
        mode="out-in"
      >
        {
          status.value.get(data)
          && (
            <ul class="overflow-hidden transition-height">
              {data.children.map((child) => {
                if (isLink(child)) {
                  return <TreeListLink data={child} level={level + 1} />
                }
                else if (isTitle(child)) {
                  return <TreeListTitle data={child} level={level + 1} />
                }
                else {
                  return <TreeListHeader data={child} level={level + 1} />
                }
              })}
            </ul>
          )
        }
      </Transition>
    </li>
  )
}
</script>

<template>
  <ul
    ref="treeListRef"
    class="flex flex-col text-sm"
  >
    <template
      v-for="item, i in items" :key="i"
    >
      <TreeListLink v-if="isLink(item)" :data="item" :level="0" />
      <TreeListTitle
        v-else-if="isTitle(item)"
        :data="item"
        :level="0"
      />
    </template>
  </ul>
</template>
