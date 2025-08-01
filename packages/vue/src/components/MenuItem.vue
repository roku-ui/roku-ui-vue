<script setup lang="ts">
import type { MenuData, MenuItemData, MenuProps } from './Menu.vue'
import { useElementHover } from '@vueuse/core'
import { computed, inject, ref, watchEffect } from 'vue'
import { useRounded } from '@/utils'
import { isDivider, isLabel, someHasIcon } from '@/utils/menu'
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
  // 如果 idx 是 menuCurrentIdx 的前缀，且不完全相等，则返回 true
  return menuCurrentIdx.value.length > props.idx.length
    && menuCurrentIdx.value.slice(0, props.idx.length).join(',') === props.idx.join(',')
})

const color = computed(() => {
  return props.color
})
const outlineCS = useOutlineCS(color)
const select = inject<(value: number | string | symbol) => void>('selectMenuItem', () => {
  console.error('selectMenuItem is not provided')
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
</script>

<template>
  <div
    v-if="isLabel(data)"
    class="text-xs text-surface-dimmed px-2 py-1"
  >
    {{ data.title }}
  </div>
  <div
    v-else-if="isDivider(data)"
    class="my-2 border-t border-surface"
  />
  <template
    v-else
  >
    <button
      ref="menuItemRef"
      type="button"
      :tabindex="-1"
      class="px-2 flex gap-2 h-8 w-full cursor-pointer items-center relative focus-visible:outline hover:bg-surface-variant-2"
      :class="[
        rounded.class,
        {
          'z-1': isFocusing,
          'bg-surface-variant-2': isOpen,
        }]"
      v-bind="outlineCS"
      :style="[rounded.style]"
      @pointerdown="() => {
        const d = (data as MenuItemData)
        if (d.value) {
          select(d.value)
        }
      }"
    >
      <i
        v-if="data.icon"
        :class="data.icon"
        class="flex-shrink-0 w-5"
      />
      <i
        v-else-if="props.hasIcon"
        class="flex-shrink-0 w-5"
      />
      <div class="text-left flex-grow text-truncate">
        {{ data.title }}
      </div>
      <i
        v-if="data.children"
        class="i-tabler-chevron-right flex-shrink-0"
      />
      <menu
        v-if="data.children && (hover || isOpen || isFocusing)"
        ref="menuDropdownRef"
        class="ml-1 p-2 border border bg-surface bg-surface w-64 left-100% top-0 absolute"
        :class="rounded.class"
        :style="[rounded.style, menuPositionStyle]"
      >
        <MenuItem
          v-for="child, i in data.children"
          :key="i"
          :has-icon="someHasIcon(data.children)"
          :data="child"
          :idx="[...idx, i]"
        />
      </menu>
    </button>
  </template>
</template>
