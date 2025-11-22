<script lang="tsx" setup>
import type { VNodeChild } from 'vue'
import type { IconSource, Rounded, Size } from '@/types'
import { onClickOutside, onKeyStroke, useElementHover, useEventListener, useToggle } from '@vueuse/core'
import { computed, provide, ref, watchEffect } from 'vue'
import { useRounded } from '@/utils'
import { isDivider, isLabel, isMenuItem, someHasIcon } from '@/utils/menu'
import { MenuItem } from '.'

export type MenuData = MenuItemData | MenuDividerData | MenuLabelData

export interface MenuItemData {
  title?: string
  value?: number | string | symbol
  icon?: IconSource
  render?: () => VNodeChild
  children?: MenuData[]
  size?: Size
  disabled?: boolean
  closeOnSelect?: boolean
  onSelect?: (context: MenuItemSelectContext) => void
}

export interface MenuItemSelectContext {
  value?: number | string | symbol
  event: Event
  data: MenuItemData
}

export interface MenuDividerData {
  role: 'divider'
}

export interface MenuLabelData {
  role: 'label'
  title: string
}

export interface MenuProps {
  rounded?: Rounded
  color?: string
}

const props = withDefaults(defineProps<{
  rounded?: Rounded
  enterActiveClass?: string
  leaveActiveClass?: string
  data?: MenuData[]
  trigger?: 'click' | 'hover' | 'contextmenu'
  classes?: {
    wrapper?: string | string[] | Record<string, boolean>
    trigger?: string | string[] | Record<string, boolean>
    dropdown?: string | string[] | Record<string, boolean>
  }
} & MenuProps>(), {
  rounded: 'md',
  size: 'md',
  enterActiveClass: 'animate-keyframes-zoom-in animate-duration-0.1s',
  leaveActiveClass: 'animate-keyframes-zoom-out animate-duration-0.1s',
  trigger: 'click',
  color: 'primary',
})

const emits = defineEmits<{
  select: [value: number | string | symbol]
}>()

const model = defineModel<boolean>({
  default: undefined,
})
const modelValue = computed(() => model.value)
const [value, toggle] = useToggle()
const finalValue = computed(() => {
  if (modelValue.value === undefined) {
    return value.value
  }
  return modelValue.value
})

function setOpenState(target: boolean) {
  if (modelValue.value === undefined) {
    toggle(target)
    return
  }
  model.value = target
}

function toggleOpen(target?: boolean) {
  const nextValue = typeof target === 'boolean' ? target : !finalValue.value
  setOpenState(nextValue)
}

const rounded = useRounded(props)
const menuWrapperRef = ref<HTMLElement | null>(null)
const menuTriggerRef = ref<HTMLElement | null>(null)
const menuDropdownRef = ref<HTMLElement | null>(null)

useEventListener(menuTriggerRef, 'click', (e) => {
  if (props.trigger !== 'click') {
    return
  }
  e.stopPropagation()
  e.preventDefault()
  toggleOpen()
})

const hover = useElementHover(menuTriggerRef, {
  delayLeave: 100,
})

const dropdownHover = useElementHover(menuDropdownRef, {
  delayLeave: 100,
})

watchEffect(() => {
  if (props.trigger !== 'hover') {
    return
  }
  if (hover.value || dropdownHover.value) {
    toggleOpen(true)
  }
  else {
    toggleOpen(false)
  }
})

const openPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

useEventListener(menuTriggerRef, 'contextmenu', (e) => {
  if (props.trigger !== 'contextmenu') {
    return
  }
  e.stopPropagation()
  e.preventDefault()
  toggleOpen()
  const baseDom = menuWrapperRef.value
  const rect = baseDom?.getBoundingClientRect()
  if (!rect) {
    return
  }
  openPosition.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
})

onClickOutside(menuDropdownRef, () => {
  toggleOpen(false)
}, {
  capture: true,
})

useEventListener(globalThis, 'contextmenu', () => {
  toggleOpen(false)
})

const menuCurrentIdx = ref<number[]>([-1])
watchEffect(() => {
  if (!finalValue.value) {
    menuCurrentIdx.value = [-1]
  }
})
provide('menuCurrentIdx', menuCurrentIdx)

function getLength(data: MenuData[], idx: number[]): number {
  const items = data
  if (idx.length <= 1) {
    return items.length
  }
  const first = idx[0]
  if (first === undefined || first < 0 || first >= items.length) {
    return 0
  }
  const cur = items[first]
  if (!isMenuItem(cur) || cur.children === undefined) {
    return 0
  }
  return getLength(cur.children, idx.slice(1))
}

const maxIdx = computed(() => {
  if (props.data === undefined) {
    return 0
  }
  return getLength(props.data, menuCurrentIdx.value)
})
const items = computed(() => props.data)
const currentItem = computed(() => {
  const item = getMenuItemData(items.value, menuCurrentIdx.value)
  return isMenuItem(item) ? item : undefined
})
const hasIcon = computed(() => someHasIcon(props.data))

function isNavigableItem(item?: MenuData): item is MenuItemData {
  return isMenuItem(item) && item.disabled !== true && !item.render
}

function isSelectableItem(item?: MenuData): item is MenuItemData {
  if (!isMenuItem(item) || item.disabled) {
    return false
  }
  return item.value !== undefined || typeof item.onSelect === 'function'
}

function shouldCloseOnSelect(item: MenuItemData) {
  if (!isSelectableItem(item)) {
    return false
  }
  return item.closeOnSelect !== false
}

function handleItemSelect(item: MenuItemData, event: Event) {
  if (item.disabled) {
    return
  }
  const context: MenuItemSelectContext = {
    value: item.value,
    event,
    data: item,
  }
  item.onSelect?.(context)
  if (item.value !== undefined) {
    emits('select', item.value)
  }
  if (shouldCloseOnSelect(item)) {
    toggleOpen(false)
  }
}

onKeyStroke('ArrowDown', (e) => {
  if (!finalValue.value || maxIdx.value === 0) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value
  const parentIdx = idx.slice(0, -1)
  const lastIdx = idx.at(-1) ?? -1
  let nextIdx = (lastIdx + 1) % maxIdx.value
  let attempts = 0
  while (attempts < maxIdx.value) {
    const candidate = getMenuItemData(items.value, [...parentIdx, nextIdx])
    if (isNavigableItem(candidate)) {
      menuCurrentIdx.value = [...parentIdx, nextIdx]
      return
    }
    nextIdx = (nextIdx + 1) % maxIdx.value
    attempts += 1
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (!finalValue.value || maxIdx.value === 0) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value
  const parentIdx = idx.slice(0, -1)
  const lastIdx = idx.at(-1) ?? -1
  let nextIdx = lastIdx === -1 ? (maxIdx.value - 1 + maxIdx.value) % maxIdx.value : (lastIdx - 1 + maxIdx.value) % maxIdx.value
  let attempts = 0
  while (attempts < maxIdx.value) {
    const candidate = getMenuItemData(items.value, [...parentIdx, nextIdx])
    if (isNavigableItem(candidate)) {
      menuCurrentIdx.value = [...parentIdx, nextIdx]
      return
    }
    nextIdx = (nextIdx - 1 + maxIdx.value) % maxIdx.value
    attempts += 1
  }
})

onKeyStroke('ArrowRight', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const item = currentItem.value
  if (!item || item.children === undefined) {
    return
  }
  let childIdx = 0
  while (childIdx < item.children.length) {
    const child = item.children[childIdx]
    if (isNavigableItem(child)) {
      menuCurrentIdx.value = [...menuCurrentIdx.value, childIdx]
      return
    }
    childIdx += 1
  }
})

onKeyStroke('ArrowLeft', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  if (menuCurrentIdx.value.length > 1) {
    menuCurrentIdx.value = menuCurrentIdx.value.slice(0, -1)
  }
})

function getMenuItemData(items: MenuData[] | undefined, idx: number[]): MenuData | undefined {
  if (idx.length === 0 || items === undefined) {
    return undefined
  }
  let cur: MenuData[] | undefined = items
  for (let i = 0; i < idx.length - 1; i++) {
    if (!cur) {
      return undefined
    }
    const pointer = idx[i]
    if (pointer === undefined || pointer < 0 || pointer >= cur.length) {
      return undefined
    }
    const node: MenuData | undefined = cur[pointer]
    if (!node || !isMenuItem(node) || node.children === undefined) {
      return undefined
    }
    cur = node.children
  }
  const lastIdx = idx.at(-1)
  if (!cur || lastIdx === undefined || lastIdx < 0 || lastIdx >= cur.length) {
    return undefined
  }
  return cur[lastIdx]
}

provide('selectMenuItem', (item: MenuItemData, event: Event) => {
  handleItemSelect(item, event)
})

onKeyStroke('Enter', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const item = currentItem.value
  if (isSelectableItem(item)) {
    handleItemSelect(item, e)
  }
})

const dropdownPositionClass = computed(() => {
  return props.trigger === 'contextmenu' ? '' : 'absolute mt-2'
})

useEventListener(globalThis, 'scroll', () => {
  if (finalValue.value) {
    toggleOpen(false)
  }
})

const dropdownPositionStyle = computed(() => {
  const windowWidth = window.innerWidth
  const dropDownWidth = menuDropdownRef.value?.clientWidth ?? 0
  const dropDownLeft = menuDropdownRef.value?.getBoundingClientRect().left ?? 0
  const hasRightPosition = windowWidth - dropDownLeft > dropDownWidth

  const windowHeight = window.innerHeight
  const dropDownHeight = menuDropdownRef.value?.clientHeight ?? 0
  const dropDownTop = menuDropdownRef.value?.getBoundingClientRect().top ?? 0
  const hasBottomPosition = windowHeight - dropDownTop > dropDownHeight

  if (props.trigger === 'contextmenu') {
    return {
      left: `${hasRightPosition ? openPosition.value.x : openPosition.value.x - dropDownWidth}px`,
      top: `${hasBottomPosition ? openPosition.value.y : openPosition.value.y - dropDownHeight}px`,
      position: 'absolute',
    } as const
  }
  return {}
})
</script>

<template>
  <div
    ref="menuWrapperRef"
    :class="[props.classes?.wrapper, {
      relative: !props.classes?.wrapper,
    }]"
  >
    <div
      ref="menuTriggerRef"
      :class="[
        props.classes?.trigger,
        {
          'w-inherit h-inherit': !props.classes?.trigger,
        },
      ]"
    >
      <slot />
    </div>
    <Transition
      :enter-active-class="props.enterActiveClass"
      :leave-active-class="props.leaveActiveClass"
    >
      <menu
        v-if="finalValue && props.data?.length"
        class="m-0 p-0 list-none flex justify-center relative z-10"
        :style="dropdownPositionStyle"
        role="menu"
        aria-orientation="vertical"
        :aria-hidden="finalValue ? 'false' : 'true'"
      >
        <div
          ref="menuDropdownRef"
          :class="[rounded.class, dropdownPositionClass]"
          :style="[rounded.style]"
          class="bg-container border-container p-2 border w-64 shadow-lg"
        >
          <template
            v-for="item, i in props.data"
            :key="i"
          >
            <div
              v-if="isLabel(item)"
              class="text-surface-variant-3 text-surface-dimmed text-xs px-2 py-1"
              role="presentation"
              aria-hidden="true"
            >
              {{ item.title }}
            </div>
            <div
              v-else-if="isDivider(item)"
              class="border-surface my-2 border-t"
              role="separator"
            />
            <template v-else>
              <component
                :is="item.render"
                v-if="item.render"
              />
              <MenuItem
                v-else
                v-bind="{ ...props, data: item }"
                :idx="[i]"
                :has-icon="hasIcon"
              />
            </template>
          </template>
        </div>
      </menu>
    </Transition>
  </div>
</template>
