<script setup lang="ts" generic="T extends { id: number | string | symbol;  [key: string]: any;} | string | symbol | number">
import type { Reactive } from 'vue'
import type { Color } from '@/types'
import { isClient } from '@vueuse/core'
import { computed, ref, watch, watchEffect } from 'vue'
import { useContainerDefaultCS, useContainerDefaultVariantCS, useContainerFilledCS, useInputColorStyle } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(defineProps<{
  ariaLabel?: string
  options?: T[]
  color?: Color
  size?: 'sm' | 'md' | 'lg'
  noneText?: string
  notFoundText?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  placeholder?: string
  searchable?: boolean
  filter?: (label: string, text: string) => boolean
}>(), {
  options() {
    return []
  },
  size: 'md',
  color: 'primary',
  noneText: 'No options',
  notFoundText: 'Not found',
  placeholder: '',
  rounded: 'md',
  searchable: false,
  filter: (label: string, text: string) => label.includes(text),
})

const emit = defineEmits<{
  change: [option: T | Reactive<T> | undefined]
  input: [searchWord: string]
}>()

const rounded = useRounded(props)

const model = defineModel<T | Reactive<T> | undefined>()
const inputRef = ref<null | HTMLInputElement>(null)
const wrapperRef = ref(null)
const focused = ref(false)
onClickOutside(wrapperRef, () => {
  focused.value = false
})

const hoverIndex = ref(-1)
const keyboardIndex = ref(-1)

watchEffect(() => {
  if (!focused.value) {
    keyboardIndex.value = -1
  }
})

watch(model, () => {
  emit('change', model.value)
})

const currentOption = computed(() => model.value)
const currentLabel = computed(() => getLabel(currentOption.value))
const currentIndex = computed(() => props.options.findIndex(d => optionIsEq(d, currentOption.value)))
const searchText = ref(currentLabel.value)

watch(currentLabel, () => {
  searchText.value = currentLabel.value
})

function getLabel(option?: Reactive<T> | T) {
  if (!option) {
    return ''
  }
  if (typeof option === 'string' || typeof option === 'symbol' || typeof option === 'number') {
    return String(option)
  }
  if (option.label) {
    return option.label
  }
  return option.id
}

function getId(option?: Reactive<T> | T) {
  if (!option) {
    return
  }
  if (typeof option === 'string' || typeof option === 'symbol' || typeof option === 'number') {
    return option
  }
  return option.id
}

function onInput(event: Event) {
  focused.value = true
  const target = event.target as HTMLInputElement
  searchText.value = target.value
  emit('input', searchText.value)
}
const filtedOptions = computed(() => {
  if (props.searchable && searchText.value !== currentLabel.value) {
    return props.options.filter((d) => {
      return props.filter(getLabel(d), searchText.value)
    })
  }
  return props.options
})

onKeyStroke('ArrowDown', (e) => {
  if (focused.value) {
    e.preventDefault()
    if (keyboardIndex.value === -1 && hoverIndex.value !== -1) {
      // 细节 1：如果键盘索引为 -1 且鼠标索引不为 -1，则将键盘索引设置为鼠标索引
      keyboardIndex.value = hoverIndex.value
    }
    else if (keyboardIndex.value === -1 && hoverIndex.value === -1 && currentIndex.value !== -1) {
      // 细节 2：如果键盘索引为 -1 且鼠标索引为 -1 且当前索引不为 -1，则将键盘索引设置为当前索引
      keyboardIndex.value = currentIndex.value
    }
    keyboardIndex.value = (keyboardIndex.value + 1) % props.options.length
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (focused.value) {
    e.preventDefault()
    if (keyboardIndex.value === -1 && hoverIndex.value !== -1) {
      keyboardIndex.value = hoverIndex.value
    }
    else if (keyboardIndex.value === -1 && hoverIndex.value === -1 && currentIndex.value !== -1) {
      keyboardIndex.value = currentIndex.value
    }
    keyboardIndex.value = (keyboardIndex.value - 1 + props.options.length) % props.options.length
  }
})

onKeyStroke('Enter', () => {
  if (focused.value && keyboardIndex.value !== -1) {
    model.value = filtedOptions.value[keyboardIndex.value]
    inputRef.value!.focus()
    focused.value = false
  }
})
function onItemPointerDown(option: T | Reactive<T>) {
  inputRef.value!.focus()
  if (!focused.value) {
    focused.value = true
    return
  }
  model.value = option
  focused.value = false
}
const color = computed(() => props.color)
const colorStyle = useInputColorStyle(color, 'default')

const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return {
        wrapper: 'h-6 w-full py-1 pl-1.5 pr-6 text-sm',
        dropdown: 'text-sm children:py-1',
      }
    }
    case 'lg': {
      return {
        wrapper: 'h-10 w-full py-2 pl-3 pr-10 text-lg',
        dropdown: 'text-lg children:py-2',
      }
    }
    default: {
      return {
        wrapper: 'h-8 w-full py-1 pl-2 pr-8 text-base',
        dropdown: 'text-base children:py-1',
      }
    }
  }
})
const dropdownRef = ref(null)
const { bottom, top } = useElementBounding(inputRef)
watch([focused], () => {
  // 细节 3：当下拉框收起时，重置键盘索引和鼠标索引
  keyboardIndex.value = -1
  hoverIndex.value = -1
})

// 自动计算下拉最大高度，优先向下，空间不足时向上
const dropdownMaxHeight = computed(() => {
  if (!focused.value || !isClient) {
    return null
  }
  const windowHeight = document.documentElement.clientHeight
  const spaceBelow = windowHeight - bottom.value - 16 // 预留边距
  const spaceAbove = top.value - 16
  // 期望最大高度（假设单项高度 32px，最多 8 项）
  const defaultMax = 32 * 8
  if (spaceBelow >= defaultMax) {
    return { maxHeight: `${defaultMax}px` }
  }
  if (spaceBelow >= 100) {
    return { maxHeight: `${spaceBelow}px` }
  }
  if (spaceAbove >= defaultMax) {
    return { maxHeight: `${defaultMax}px`, bottom: '100%' }
  }
  if (spaceAbove >= 100) {
    return { maxHeight: `${spaceAbove}px`, bottom: '100%' }
  }
  // 上下都不够，兜底 100px
  return { maxHeight: '100px' }
})

function optionIsEq(a: Reactive<T> | T, b: Reactive<T> | T | undefined) {
  if (!b) {
    return false
  }
  if (typeof a === 'string' || typeof a === 'symbol' || typeof a === 'number') {
    return a === b
  }
  if (typeof b === 'string' || typeof b === 'symbol' || typeof b === 'number') {
    return false
  }
  return a.id === b.id
}
const searchCls = computed(() => {
  if (props.searchable) {
    return 'cursor-text'
  }
  return 'cursor-pointer'
})
const containerCS = useContainerDefaultCS()
const containerVariantCS = useContainerDefaultVariantCS()
const fillCS = useContainerFilledCS(color)
function onMousemove(i: number) {
  // 细节 4：鼠标移动时，设置鼠标索引，重置键盘索引
  hoverIndex.value = i
  keyboardIndex.value = -1
}
</script>

<template>
  <div
    ref="wrapperRef"
    class="relative"
    :style="colorStyle"
  >
    <div class="w-full flex items-center">
      <input
        ref="inputRef"
        :class="[sizeCls.wrapper, rounded.class, searchCls]"
        class="border custom-input-colors outline-none outline-none focus-visible:outline-2"
        :placeholder="placeholder"
        :style="[rounded.style, colorStyle]"
        :readonly="!searchable"
        :value="searchText"
        :aria-label="ariaLabel"
        aria-haspopup="listbox"
        autocomplete="off"
        @input="onInput"
        @click="focused = true"
      >
      <i class="i-fluent-chevron-down-12-filled pointer-events-none absolute right-2" />
    </div>
    <div
      v-if="focused"
      ref="dropdownRef"
      class="absolute z-10 w-full flex-col overflow-auto border rounded p-1"
      :class="[containerCS.class, sizeCls.dropdown]"
      :style="[containerCS.style, dropdownMaxHeight]
      "
      :bottom="dropdownMaxHeight && dropdownMaxHeight.bottom ? dropdownMaxHeight.bottom : undefined"
    >
      <div
        v-if="options.length === 0"
        class="flex cursor-default items-center justify-between gap-2 rounded p-1 px-2"
      >
        <slot name="none">
          {{ noneText }}
        </slot>
      </div>
      <template v-else>
        <div
          v-for="option, i in filtedOptions"
          :key="getId(option)"
          :class="[
            keyboardIndex === i && fillCS.class,
            hoverIndex === i && keyboardIndex === -1 && containerVariantCS.class,
          ]"
          :style="[
            keyboardIndex === i && fillCS.style,
            hoverIndex === i && keyboardIndex === -1 && containerVariantCS.style,
          ]"
          class="flex cursor-pointer items-center justify-between gap-2 rounded p-1 px-2"
          @pointerdown="onItemPointerDown(option)"
          @mousemove="onMousemove(i)"
          @mouseleave="hoverIndex = -1"
        >
          <slot
            name="item"
            :data="option"
            :selected="optionIsEq(option, currentOption)"
          >
            {{ getLabel(option) }}
          </slot>
          <div v-if="optionIsEq(option, currentOption)">
            <i class="i-fluent-checkmark-12-filled h-3 w-3" />
          </div>
        </div>
        <div
          v-if="searchable && filtedOptions.length === 0"
          class="flex cursor-default items-center justify-between gap-2 rounded p-1 px-2"
        >
          <slot name="not-found">
            {{ notFoundText }}
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>
