<script setup lang="tsx">
import type { Rounded } from '@/types'
import { useRounded } from '@/utils'
import { computed, nextTick, onMounted, ref, Transition, watch, watchEffect } from 'vue'

interface TreeListButtonData {
  title: string
  value: string
}

interface TreeListHeaderData {
  title: string
}

interface TreeListTitleData {
  title: string
  children: TreeListItemData[]
  open?: boolean
}

type TreeListItemData = TreeListButtonData | TreeListHeaderData | TreeListTitleData

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
function isButton(item: TreeListItemData): item is TreeListButtonData {
  return 'value' in item
}

// function flattenTree(tree: TreeListItem[], parent?: TreeListItem, level: number = 0): TreeListItemFlat[] {
//   return tree.reduce((acc, item) => {
//     const flatItem: TreeListItemFlat = { ...item, parent, level }
//     if (isTitle(item)) {
//       const children = flattenTree(item.children, flatItem, level + 1)
//       return [...acc, flatItem, ...children]
//     }
//     return [...acc, flatItem]
//   }, [] as TreeListItemFlat[])
// }

// const flatItems = computed(() => flattenTree(props.items))
const buttonLeftIndicator = 'before:absolute before:left-4 before:h-full before:border-l-1 before:content-[""]'
const buttonItemClass = 'relative py-1 w-full flex items-center gap-2 cursor-pointer'
const buttonNormalItemClass = computed(() => `${buttonItemClass} hover:bg-surface-variant-1 hover:text-surface text-surface-dimmed`)
const buttonActiveItemClass = computed(() => `${buttonItemClass} text-primary before:border-primary bg-surface-variant-1 hover:bg-surface-variant-2`)
const titleNormalItemClass = computed(() => [buttonItemClass, 'text-surface font-bold hover:bg-surface-variant-1'])
const treeListRef = ref<HTMLUListElement | null>(null)

const lastUpdate = ref(0)

onMounted(() => {
  const treeListDom = treeListRef.value
  if (treeListDom) {
    const observer = new MutationObserver(() => {
      nextTick(() => {
        lastUpdate.value += 1
      })
    })
    observer.observe(treeListDom, {
      childList: true,
      subtree: true,
      attributes: true,
    })
    // 当子树动画结束时，更新高度
    treeListDom.addEventListener('transitionend', () => {
      setTimeout(() => {
        lastUpdate.value += 1
      }, 100)
    })
  }
})

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

function TreeListButton({ data, level }: { data: TreeListButtonData, level: number }) {
  return (
    <li
      class={[
        rounded.value.class,
        buttonLeftIndicator,
        {
          [buttonNormalItemClass.value]: model.value !== data.value,
          [buttonActiveItemClass.value]: model.value === data.value,
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
    </li>
  )
}

function TreeListTitle({ data, level }: { data: TreeListTitleData, level: number }) {
  const isOpen = computed(() => status.value.get(data))
  const dom = ref<HTMLLIElement | null>(null)
  const self = ref<HTMLButtonElement | null>(null)
  //   watch([dom, self, isOpen, lastUpdate], () => {
  //     if (dom.value && self.value) {
  //       if (isOpen.value) {
  //         dom.value.style.height = `${dom.value.scrollHeight}px`
  //       }
  //       else {
  //         dom.value.style.height = `${self.value.scrollHeight}px`
  //       }
  //     }
  //   })
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
                if (isButton(child)) {
                  return <TreeListButton data={child} level={level + 1} />
                }
                else if (isTitle(child)) {
                  return <TreeListTitle data={child} level={level + 1} />
                }
                return null
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
    class="flex flex-col"
  >
    <template
      v-for="item, i in items" :key="i"
    >
      <TreeListButton v-if="isButton(item)" :data="item" :level="0" />
      <TreeListTitle
        v-else-if="isTitle(item)"
        :data="item"
        :level="0"
      />
    </template>
  </ul>
</template>
