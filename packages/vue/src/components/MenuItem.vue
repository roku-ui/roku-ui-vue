<script setup lang="ts">
import type { MenuData, MenuItemData, MenuProps } from './Menu.vue'
import { useElementHover } from '@vueuse/core'
import { computed, inject, ref, watchEffect } from 'vue'
import { useRounded } from '@/utils'
import { isDivider, isLabel, isMenuItem, someHasIcon } from '@/utils/menu'
import { MenuItem, useOutlineCS } from '..'

const props = withDefaults(defineProps<{
  data: MenuData
  idx: number[]
  hasIcon: boolean
} & MenuProps>(), {
  rounded: 'md',
  color: 'primary',
})
const menuItemRef = ref<HTMLElement | null>(null)
const hover = useElementHover(menuItemRef, {
  delayLeave: 100,
})
const rounded = useRounded({ rounded: props.rounded })
const menuCurrentIdx = inject('menuCurrentIdx', ref<number[]>([]))

const isFocusing = computed(() => {
  return menuCurrentIdx.value.join(',') === props.idx.join(',')
})
watchEffect(() => {
  if (isFocusing.value) {
    menuItemRef.value?.focus()
  }
})

const isOpen = computed(() => {
  return menuCurrentIdx.value.length > props.idx.length
    && menuCurrentIdx.value.slice(0, props.idx.length).join(',') === props.idx.join(',')
})
const menuItemData = computed<MenuItemData | undefined>(() => {
  if (!isMenuItem(props.data)) {
    return
  }
  return props.data
})
const itemId = computed(() => `menu-item-${props.idx.join('-')}`)
const isDisabled = computed(() => menuItemData.value?.disabled === true)
const submenuId = computed(() => menuItemData.value?.children ? `${itemId.value}-submenu` : undefined)
const childHasIcon = computed(() => someHasIcon(menuItemData.value?.children))

const color = computed(() => {
  return props.color
})
const outlineCS = useOutlineCS(color)
const select = inject<(item: MenuItemData, event: Event) => void>('selectMenuItem', (item) => {
  console.error('selectMenuItem is not provided', item)
})
const menuDropdownRef = ref<HTMLElement | null>(null)
const menuPositionStyle = computed(() => {
  const windowWidth = window.innerWidth
  const dropDownWidth = menuDropdownRef.value?.clientWidth ?? 0
  const dropDownLeft = menuDropdownRef.value?.getBoundingClientRect().left ?? 0
  const hasRightPosition = windowWidth - dropDownLeft > dropDownWidth

  const windowHeight = window.innerHeight
  const dropDownHeight = menuDropdownRef.value?.clientHeight ?? 0
  const dropDownTop = menuDropdownRef.value?.getBoundingClientRect().top ?? 0
  const hasBottomPosition = windowHeight - dropDownTop > dropDownHeight
  return {
    left: hasRightPosition ? '100%' : 'auto',
    right: hasRightPosition ? 'auto' : '100%',
    top: hasBottomPosition ? '0' : 'auto',
    bottom: hasBottomPosition ? 'auto' : '0',
  }
})

function handlePointerDown(event: PointerEvent) {
  const item = menuItemData.value
  if (!item) {
    return
  }
  if (isDisabled.value) {
    event.preventDefault()
    return
  }
  select(item, event)
}
</script>

<template>
  <div
    v-if="isLabel(data)"
    class="px-2 py-1 text-xs text-surface-dimmed"
    role="presentation"
    aria-hidden="true"
  >
    {{ data.title }}
  </div>
  <div
    v-else-if="isDivider(data)"
    class="my-2 border-t border-surface"
    role="separator"
  />
  <template v-else-if="menuItemData">
    <button
      v-bind="outlineCS"
      :id="itemId"
      ref="menuItemRef"
      type="button"
      :tabindex="-1"
      class="relative inline-flex h-9 w-full items-center gap-2 px-2 outline-none focus-visible:outline-2 focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors duration-150 hover:bg-elevated focus-visible:bg-elevated"
      :class="[
        rounded.class,
        {
          'z-1': isFocusing,
          'bg-elevated': isOpen || isFocusing,
          'ring-2 ring-primary/40 ring-offset-1 ring-offset-transparent': isFocusing,
          'cursor-pointer': !isDisabled,
          'cursor-not-allowed opacity-60': isDisabled,
        },
      ]"
      :style="[rounded.style]"
      role="menuitem"
      :aria-haspopup="menuItemData?.children ? 'menu' : undefined"
      :aria-expanded="menuItemData?.children ? (isOpen ? 'true' : 'false') : undefined"
      :aria-controls="submenuId"
      :aria-disabled="isDisabled ? 'true' : undefined"
      @pointerdown="handlePointerDown"
    >
      <i
        v-if="menuItemData?.icon"
        :class="menuItemData?.icon"
        class="w-5 flex-shrink-0 text-surface-dimmed"
      />
      <i
        v-else-if="props.hasIcon"
        class="w-5 flex-shrink-0 text-transparent"
      />
      <div class="flex-grow text-left text-surface truncate">
        {{ menuItemData?.title }}
      </div>
      <i
        v-if="menuItemData?.children"
        class="i-tabler-chevron-right flex-shrink-0 text-surface-dimmed"
        aria-hidden="true"
      />
      <menu
        v-if="menuItemData?.children && (hover || isOpen || isFocusing)"
        :id="submenuId"
        ref="menuDropdownRef"
        class="absolute left-full top-0 ml-1 w-64 border border-container bg-container p-2 shadow-md list-none m-0"
        :class="rounded.class"
        :style="[rounded.style, menuPositionStyle]"
        role="menu"
        aria-orientation="vertical"
      >
        <MenuItem
          v-for="child, i in menuItemData.children ?? []"
          :key="i"
          :has-icon="childHasIcon"
          :data="child"
          :idx="[...idx, i]"
        />
      </menu>
    </button>
  </template>
  <template v-else>
    <div class="hidden" />
  </template>
</template>
