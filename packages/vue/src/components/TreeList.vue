<script setup lang="tsx">
import type { VNode } from 'vue'
import type { Rounded } from '@/types'
import { computed, h, ref, watchEffect } from 'vue'
import { useRounded } from '@/index'
import { AutoHeightTransition } from '.'

export interface TreeListLeafData {
  icon?: string | VNode
  title: string
  value: string
  attrs?: Record<string, any>
  is?: string | VNode
}

export interface TreeListHeaderData {
  icon?: string | VNode
  title: string
}

export interface TreeListCollapseData {
  title: string
  icon?: string | VNode
  value?: string
  children?: TreeListItemData[]
  open?: boolean
}

export type TreeListItemData = TreeListLeafData | TreeListHeaderData | TreeListCollapseData

const props = withDefaults(defineProps<{
  items: TreeListItemData[]
  rounded?: Rounded
}>(), {
  rounded: 'md',
})

const slots = defineSlots<{
  link?: (props: { data: TreeListLeafData, level: number }) => any
  title?: (props: { data: TreeListCollapseData, level: number }) => any
  header?: (props: { data: TreeListHeaderData, level: number }) => any
}>()

const rounded = useRounded(props)

const model = defineModel<string>()

function hasChildren(item: TreeListItemData): item is TreeListCollapseData {
  return 'children' in item
}
function isLink(item: TreeListItemData): item is TreeListLeafData {
  return 'value' in item && !('children' in item)
}

const itemLeftIndicator = 'before:absolute before:left-4 before:h-full before:border-r before:content-[""]'
const itemClass = 'relative h-8 py-1 pr-1 w-full flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:bg-surface-variant-1'
const linkNormalItemClass = computed(() => `${itemClass} hover:bg-surface-variant-1 hover:text-surface text-surface-dimmed`)
const linkActiveItemClass = computed(() => `${itemClass} text-primary before:border-primary bg-surface-variant-2`)
const titleNormalItemClass = computed(() => [itemClass, 'text-surface font-bold hover:bg-surface-variant-1'])
const titleActiveItemClass = computed(() => [itemClass, 'text-primary font-bold bg-surface-variant-1'])
const treeListRef = ref<HTMLUListElement | null>(null)
const status = ref<Map<TreeListItemData, boolean>>(new Map())

function travel(data: TreeListItemData, level: number) {
  if (hasChildren(data)) {
    status.value.set(data, data.open ?? false)
    if (data.children) {
      for (const child of data.children) {
        travel(child, level + 1)
      }
    }
  }
}

watchEffect(() => {
  for (const item of props.items) {
    if (hasChildren(item)) {
      travel(item, 0)
    }
  }
})

function TreeListLink({ data, level }: { data: TreeListLeafData, level: number }) {
  if (slots.link) {
    return slots.link({ data, level })
  }
  const content = data.title
  const Comp = (props: any) => data.is
    ? h(data.is, props, { default: () => {
        return content
      } })
    : h('a', props, { default: () => content })

  return (
    <li
      class="relative"
    >
      <Comp
        tabindex={0}
        class={[
          rounded.value.class,
          itemLeftIndicator,
          {
            [linkNormalItemClass.value]: model.value !== data.value,
            [linkActiveItemClass.value]: model.value === data.value,
          },
        ]}
        style={
          [
            {
              paddingLeft: `${32 + level * 8}px`,
            },
            rounded.value.style,
          ]
        }
        onClick={() => model.value = data.value}
        onKeyup={(e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            model.value = data.value
          }
        }}
        {...data.attrs}
      />
    </li>
  )
}

function TreeListHeader({ data, level }: { data: TreeListHeaderData, level: number }) {
  return (
    <li
      class={[
        'flex items-center relative py-2 text-surface-dimmed font-bold tracking-widest text-xs',
      ]}
      style={
        [
          {
            paddingLeft: `${32 + level * 8}px`,
          },
          rounded.value.style,
        ]
      }
    >
      <div class="absolute left-4 h-1/2 translate-y-[calc(50%+3px)] border-r" />
      <div class="absolute left-[calc(1rem+0.6px)] h-2 w-2 border rounded-sm bg-surface-variant-1 -translate-x-1/2" />
      {
        slots.header
          ? slots.header({ data, level })
          : (
              <>
                {
                  data.icon && (
                    <i
                      class={[
                        'h-4 w-4 py-1',
                        data.icon,
                      ]}
                    />
                  )
                }
                {data.title}
              </>
            )
      }
    </li>
  )
}

function TreeListCollapse({ data, level }: { data: TreeListCollapseData, level: number }) {
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
        onClick={() => {
          if (data.value) {
            if (model.value === data.value && isOpen.value) {
              status.value.set(data, false)
            }
            else {
              model.value = data.value
              status.value.set(data, true)
            }
          }
          else {
            status.value.set(data, !status.value.get(data))
          }
        }}
        class={[
          rounded.value.class,
          model.value === data.value ? titleActiveItemClass.value : titleNormalItemClass.value,
        ]}
        style={
          [
            {
              paddingLeft: `${32 + level * 8}px`,
            },
            rounded.value.style,
          ]
        }
      >
        <i class={[
          'i-tabler-chevron-down absolute left-2 h-4 w-4 py-1 transition-transform',
          isOpen.value ? 'rotate-0' : '-rotate-90',
        ]}
        />
        {
          slots.title
            ? slots.title({ data, level })
            : (
                <>
                  {data.icon && (
                    <i
                      class={[
                        'h-4 w-4 py-1',
                        data.icon,
                      ]}
                    />
                  )}
                  <span class="truncate">
                    {data.title}
                  </span>
                </>
              )
        }

      </button>
      <AutoHeightTransition>
        {
          status.value.get(data)
          && (
            <ul class="overflow-hidden transition-height">
              {
                data.children?.map((child) => {
                  if (isLink(child)) {
                    return <TreeListLink data={child} level={level + 1} />
                  }
                  else if (hasChildren(child)) {
                    return <TreeListCollapse data={child} level={level + 1} />
                  }
                  else {
                    return <TreeListHeader data={child} level={level + 1} />
                  }
                })
              }
            </ul>
          )
        }
      </AutoHeightTransition>
    </li>
  )
}

function TreeListItem({ data, level }: { data: TreeListItemData, level: number }) {
  if (isLink(data)) {
    return <TreeListLink data={data} level={level} />
  }
  else if (hasChildren(data)) {
    return <TreeListCollapse data={data} level={level} />
  }
  else {
    return <TreeListHeader data={data} level={level} />
  }
}
</script>

<template>
  <ul
    ref="treeListRef"
    class="flex flex-col text-sm"
  >
    <TreeListItem
      v-for="item, i in items"
      :key="i"
      :data="item"
      :level="0"
    />
  </ul>
</template>
