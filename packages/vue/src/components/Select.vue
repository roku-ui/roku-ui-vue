<script setup lang="ts" generic="T extends { id: number | string | symbol;  [key: string]: any;} | string | symbol | number">
import { isClient } from '@vueuse/core'
import { useRounded } from '../utils/classGenerator'

const props = withDefaults(defineProps<{
  ariaLabel?: string
  options?: T[]
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
  noneText: 'No options',
  notFoundText: 'Not found',
  placeholder: '',
  rounded: 'md',
  searchable: false,
  filter: (label: string, text: string) => label.includes(text),
})

const emit = defineEmits<{
  change: [option: T | undefined]
  input: [searchWord: string]
}>()

const rounded = useRounded(props)

const model = defineModel<T | undefined>({ default: undefined })

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

function getLabel(option?: T) {
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

function getId(option?: T) {
  if (!option) {
    return undefined
  }
  if (typeof option === 'string' || typeof option === 'symbol' || typeof option === 'number') {
    return option
  }
  return option.id
}

const searchText = ref('')
watch(currentLabel, () => {
  searchText.value = currentLabel.value
})
watchEffect(() => {
  if (!focused.value) {
    searchText.value = currentLabel.value
  }
})
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
    keyboardIndex.value = (keyboardIndex.value + 1) % props.options.length
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (focused.value) {
    e.preventDefault()
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
function onItemPointerDown(option: T) {
  inputRef.value!.focus()
  if (!focused.value) {
    focused.value = true
    return
  }
  model.value = option
  focused.value = false
}
const colorCls = computed(() => {
  return {
    input: 'container-base focus:border-primary-container',
  }
})
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrapper: 'h-6 w-full py-1 pl-1.5 pr-6 text-sm',
        dropdown: 'text-sm children:py-1',
      }
    case 'lg':
      return {
        wrapper: 'h-10 w-full py-2 pl-3 pr-10 text-lg',
        dropdown: 'text-lg children:py-2',
      }
    default:
      return {
        wrapper: 'h-8 w-full py-1 pl-2 pr-8 text-base',
        dropdown: 'text-base children:py-1',
      }
  }
})
const dropdownRef = ref(null)
const { height } = useElementBounding(dropdownRef)
const { bottom } = useElementBounding(inputRef)
const hasArea = computed(() => {
  if (!focused.value) {
    return false
  }
  if (isClient) {
    if (height.value === 0) {
      return false
    }
    return (document.documentElement.clientHeight - bottom.value) > height.value
  }
  return false
})
function optionIsEq(a: T, b: T | undefined) {
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
</script>

<template>
  <div
    ref="wrapperRef"
    class="r-select-wrapper relative"
  >
    <div class="w-full flex items-center">
      <input
        ref="inputRef"
        :class="[colorCls.input, sizeCls.wrapper, rounded.class, searchCls]"
        class="r-select-input border outline-none outline-none focus-visible:outline-2"
        :placeholder="placeholder"
        :style="[rounded.style]"
        :readonly="!searchable"
        :value="searchText"
        :aria-label="ariaLabel"
        aria-haspopup="listbox"
        autocomplete="off"
        @input="onInput"
        @click="focused = true"
      >
      <i class="i-tabler-chevron-down pointer-events-none absolute right-2" />
    </div>
    <div
      v-if="focused"
      ref="dropdownRef"
      class="absolute z-10 mt-2 w-full flex-col overflow-hidden border container-base rounded p-1"
      :class="[sizeCls.dropdown, {
        'bottom-10': !hasArea,
      }]"
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
          :class="{
            'hover:bg-surface-low border-transparent': keyboardIndex !== i,
            'container-filled-primary text-white': keyboardIndex === i,
          }"
          class="flex cursor-pointer items-center justify-between gap-2 border rounded p-1 px-2"
          @pointerdown="onItemPointerDown(option)"
          @hover="hoverIndex = i"
        >
          <slot
            name="item"
            :data="option"
            :selected="optionIsEq(option, currentOption)"
          >
            {{ getLabel(option) }}
          </slot>
          <div v-if="optionIsEq(option, currentOption)">
            <i class="i-tabler-check h-3 w-3" />
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
