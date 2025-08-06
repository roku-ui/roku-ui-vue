<script setup lang="ts" generic="T = any">
import type { Color } from '@/types'
import { isClient, onClickOutside, onKeyStroke, useElementBounding } from '@vueuse/core'
import { computed, ref, watch, watchEffect } from 'vue'
import { useContainerDefaultCS, useContainerDefaultVariantCS, useContainerFilledCS, useInputColorStyle, useTheme } from '@/shared'
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
  labelKey?: keyof T
  labelGetter?: (option: T) => string
}>(), {
  options() {
    return []
  },
  size: undefined,
  color: undefined,
  noneText: 'No options',
  notFoundText: 'Not found',
  placeholder: '',
  rounded: undefined,
  searchable: false,
  filter: (label: string, text: string) => label.includes(text),
  labelKey: undefined,
  labelGetter: undefined,
})

const emit = defineEmits<{
  change: [option: T | undefined]
  input: [searchWord: string]
}>()

const theme = useTheme()

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? theme.value.defaultSize,
  color: props.color ?? theme.value.defaultColor,
  rounded: props.rounded ?? theme.value.rounded,
}))

const rounded = useRounded(effectiveProps.value)

const model = defineModel<T | undefined>()
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

function getLabel(option?: T): string {
  if (option == null) {
    return ''
  }

  // 优先使用 labelGetter
  if (props.labelGetter) {
    return props.labelGetter(option)
  }

  // 其次使用 labelKey
  if (props.labelKey && typeof option === 'object' && option !== null) {
    const value = (option as any)[props.labelKey]
    return value == null ? '' : String(value)
  }

  // 兜底逻辑：对于基本类型直接返回字符串
  if (typeof option === 'string' || typeof option === 'symbol' || typeof option === 'number') {
    return String(option)
  }

  // 对于对象类型，尝试常见的属性名
  if (typeof option === 'object' && option !== null) {
    const obj = option as any
    if (obj.label != null) {
      return String(obj.label)
    }
    if (obj.name != null) {
      return String(obj.name)
    }
    if (obj.title != null) {
      return String(obj.title)
    }
    if (obj.text != null) {
      return String(obj.text)
    }
  }

  // 最后兜底返回字符串化的选项
  return String(option)
}

// 移除 getId 函数，直接使用选项本身作为唯一标识

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
    keyboardIndex.value = (keyboardIndex.value + 1) % filtedOptions.value.length
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
    keyboardIndex.value = (keyboardIndex.value - 1 + filtedOptions.value.length) % filtedOptions.value.length
  }
})

onKeyStroke('Enter', () => {
  if (focused.value && keyboardIndex.value !== -1) {
    model.value = filtedOptions.value[keyboardIndex.value]
    inputRef.value!.focus()
    focused.value = false
  }
})
function onItemPointerDown(option: T) {
  inputRef.value!.focus()
  if (!focused.value) {
    focused.value = true
    return
  }
  model.value = option
  focused.value = false
}
const color = computed(() => effectiveProps.value.color)
const colorStyle = useInputColorStyle(color, 'default')

const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
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

function optionIsEq(a: T, b: T | undefined): boolean {
  if (b == null) {
    return false
  }

  return a === b
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
    <div class="flex w-full items-center">
      <input
        ref="inputRef"
        :class="[sizeCls.wrapper, rounded.class, searchCls]"
        class="custom-input-colors outline-none border focus-visible:outline-2"
        :placeholder="placeholder"
        :style="[rounded.style, colorStyle]"
        :readonly="!searchable"
        :value="searchText"
        :aria-label="ariaLabel"
        aria-haspopup="listbox"
        :aria-expanded="focused"
        :aria-activedescendant="keyboardIndex !== -1 ? `option-${keyboardIndex}` : undefined"
        autocomplete="off"
        @input="onInput"
        @click="focused = true"
      >
      <i class="i-fluent-chevron-down-12-filled pointer-events-none right-2 absolute" />
    </div>
    <div
      v-if="focused"
      ref="dropdownRef"
      class="p-1 border rounded flex-col w-full absolute z-10 overflow-auto"
      :class="[containerCS.class, sizeCls.dropdown]"
      :style="[containerCS.style, dropdownMaxHeight]"
      role="listbox"
    >
      <div
        v-if="options.length === 0"
        class="p-1 px-2 rounded flex gap-2 cursor-default items-center justify-between"
      >
        <slot name="none">
          {{ noneText }}
        </slot>
      </div>
      <template v-else>
        <div
          v-for="option, i in filtedOptions"
          :id="`option-${i}`"
          :key="i"
          :class="[
            keyboardIndex === i && fillCS.class,
            hoverIndex === i && keyboardIndex === -1 && containerVariantCS.class,
          ]"
          :style="[
            keyboardIndex === i && fillCS.style,
            hoverIndex === i && keyboardIndex === -1 && containerVariantCS.style,
          ]"
          class="p-1 px-2 rounded flex gap-2 cursor-pointer items-center justify-between"
          role="option"
          :aria-selected="optionIsEq(option, currentOption)"
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
          class="p-1 px-2 rounded flex gap-2 cursor-default items-center justify-between"
        >
          <slot name="not-found">
            {{ notFoundText }}
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>
