<script lang="tsx" setup>
import type { VNodeChild } from 'vue'
import type { Rounded, Size } from '@/types'
import { onClickOutside, onKeyStroke, useElementHover, useEventListener, useToggle } from '@vueuse/core'
import { computed, provide, ref, watchEffect } from 'vue'
import { useRounded } from '@/utils'
import { isDivider, isLabel, isMenuItem, someHasIcon } from '@/utils/menu'
import { MenuItem } from '.'

export type MenuData = MenuItemData | MenuDividerData | MenuLabelData

export interface MenuItemData {
  title?: string
  value?: number | string | symbol
  icon?: string
  render?: () => VNodeChild
  children?: MenuData[]
  size?: Size
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
  // check model value is undefined or boolean
  if (modelValue.value === undefined) {
    return value.value
  }
  return modelValue.value
})

const rounded = useRounded(props)
const menuWrapperRef = ref<HTMLElement | null>(null)
const menuTriggerRef = ref<HTMLElement | null>(null)
const menuDropdownRef = ref<HTMLElement | null>(null)

useEventListener(menuTriggerRef, 'pointerup', (e) => {
  if (props.trigger !== 'click' || e.button !== 0) {
    return
  }
  e.stopPropagation()
  e.preventDefault()
  toggle()
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
    toggle(true)
  }
  else {
    toggle(false)
  }
})

const openPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })

useEventListener(menuTriggerRef, 'contextmenu', (e) => {
  if (props.trigger !== 'contextmenu') {
    return
  }
  e.stopPropagation()
  e.preventDefault()
  toggle()
  const baseDom = menuWrapperRef.value
  const rect = baseDom?.getBoundingClientRect()
  if (!rect) {
    return
  }
  openPosition.value = { x: e.clientX - rect.left, y: e.clientY - rect.top }
})

onClickOutside(menuDropdownRef, () => {
  toggle(false)
}, {
  capture: true,
})

useEventListener(globalThis, 'contextmenu', () => {
  toggle(false)
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
  const children = cur.children
  return getLength(children, idx.slice(1))
}

const maxIdx = computed(() => {
  if (props.data === undefined) {
    return 0
  }
  return getLength(props.data, menuCurrentIdx.value)
})
const items = computed(() => {
  return props.data
})
onKeyStroke('ArrowDown', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value

  const lastIdx = idx.at(-1)
  if (lastIdx === undefined || lastIdx === -1) {
    menuCurrentIdx.value = [0]
    return
  }
  let nextIdx = (lastIdx + 1) % maxIdx.value
  let attempts = 0
  while (
    attempts < maxIdx.value
    && (!isMenuItem(getMenuItemData(items.value, [...idx.slice(0, -1), nextIdx])) || getMenuItemData(items.value, [...idx.slice(0, -1), nextIdx])?.render)
  ) {
    nextIdx = (nextIdx + 1) % maxIdx.value
    attempts++
  }
  menuCurrentIdx.value = [...idx.slice(0, -1), nextIdx]
})

onKeyStroke('ArrowUp', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const idx = menuCurrentIdx.value
  const lastIdx = idx.at(-1)
  if (lastIdx === undefined) {
    menuCurrentIdx.value = [maxIdx.value - 1]
    return
  }
  if (lastIdx === -1 && idx.length === 1) {
    menuCurrentIdx.value = [maxIdx.value - 1]
    return
  }
  let nextIdx = (lastIdx - 1 + maxIdx.value) % maxIdx.value
  let attempts = 0
  // jump to the next item that is not render
  while (
    attempts < maxIdx.value
    && (!isMenuItem(getMenuItemData(items.value, [...idx.slice(0, -1), nextIdx]))
    || getMenuItemData(items.value, [...idx.slice(0, -1), nextIdx])?.render)
  ) {
    nextIdx = (nextIdx - 1 + maxIdx.value) % maxIdx.value
    attempts++
  }
  menuCurrentIdx.value = [...idx.slice(0, -1), nextIdx]
})

onKeyStroke('ArrowRight', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()

  // 如果当前没有选中任何项（末尾是 -1），先选择第一项
  if (menuCurrentIdx.value.at(-1) === -1) {
    menuCurrentIdx.value = [0]
    return
  }

  // 获取当前选中的菜单项
  const currentItem = getMenuItemData(items.value, menuCurrentIdx.value)
  if (!isMenuItem(currentItem) || !currentItem.children) {
    return
  }

  // 如果当前项有子菜单，进入子菜单的第一项
  let nextChildIdx = 0
  const children = currentItem.children

  // 找到第一个可选择的子菜单项
  while (nextChildIdx < children.length) {
    const childItem = children[nextChildIdx]
    if (isMenuItem(childItem) && !childItem.render) {
      break
    }
    nextChildIdx++
  }

  if (nextChildIdx < children.length) {
    menuCurrentIdx.value = [...menuCurrentIdx.value, nextChildIdx]
  }
})

onKeyStroke('ArrowLeft', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  // 如果当前的 Data 不是 ItemData 则什么都不做
  if (!isMenuItem(getMenuItemData(items.value, menuCurrentIdx.value))) {
    return
  }
  // 如果 menuCurrentIdx 长度 > 1，说明存在父级
  if (menuCurrentIdx.value.length > 1) {
    menuCurrentIdx.value = menuCurrentIdx.value.slice(0, -1)
  }
})

function getMenuItemData(items: MenuData[] | undefined, idx: number[]): MenuItemData | undefined {
  if (idx.length === 0) {
    return undefined
  }
  let cur = items
  for (let i = 0; i < idx.length - 1; i++) {
    if (cur === undefined) {
      return undefined
    }
    const seg = idx[i]
    if (seg === undefined || seg < 0 || seg >= cur.length) {
      return undefined
    }
    const ci = cur[seg]
    if (!isMenuItem(ci) || ci.children === undefined) {
      return undefined
    }
    cur = ci.children
  }
  if (cur === undefined) {
    return undefined
  }
  const lastIdx = idx.at(-1)
  if (lastIdx === undefined) {
    return undefined
  }
  if (lastIdx < 0 || lastIdx >= cur.length) {
    return undefined
  }
  return cur[lastIdx] as MenuItemData
}
provide('selectMenuItem', (value: number | string | symbol) => {
  emits('select', value)
  toggle(false)
})
onKeyStroke('Enter', (e) => {
  if (!finalValue.value) {
    return
  }
  e.preventDefault()
  const val = getMenuItemData(items.value, menuCurrentIdx.value)?.value
  if (val) {
    emits('select', val)
    toggle(false)
  }
})

const dropdownPositionClass = computed(() => {
  return props.trigger === 'contextmenu' ? '' : 'absolute mt-2'
})

useEventListener(globalThis, 'scroll', () => {
  if (finalValue.value) {
    toggle(false)
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

  return props.trigger === 'contextmenu'
    ? {
        left: `${hasRightPosition ? openPosition.value.x : openPosition.value.x - dropDownWidth}px`,
        top: `${hasBottomPosition ? openPosition.value.y : openPosition.value.y - dropDownHeight}px`,
        position: 'absolute',
      } as const
    : {}
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
        v-if="finalValue && data"
        class="flex justify-center relative z-1"
        :style="dropdownPositionStyle"
      >
        <div
          ref="menuDropdownRef"
          :class="[rounded.class, dropdownPositionClass]"
          :style="[rounded.style]"
          class="bg-surface p-2 border w-64"
        >
          <template
            v-for="item, i in props.data"
            :key="i"
          >
            <div
              v-if="isLabel(item)"
              class="text-surface-variant-3 text-surface-dimmed text-xs px-2 py-1"
            >
              {{ item.title }}
            </div>
            <div
              v-else-if="isDivider(item)"
              class="border-surface my-2 border-t"
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
                :has-icon="someHasIcon(props.data)"
              />
            </template>
          </template>
        </div>
      </menu>
    </Transition>
  </div>
</template>
