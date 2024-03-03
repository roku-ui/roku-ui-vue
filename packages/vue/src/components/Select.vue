<script setup lang="ts">
import { isClient } from '@vueuse/core'
import { useRounded } from '../utils/classGenerator'

type Option = {
  id: number | string | symbol
  label: string
} | string | symbol | number

const props = withDefaults(defineProps<{
  ariaLabel?: string
  options?: Option[]
  size?: 'sm' | 'md' | 'lg'
  noneText?: string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
  placeholder?: string
  searchable?: boolean
}>(), {
  modelValue: undefined,
  options() {
    return []
  },
  size: 'md',
  noneText: 'No options',
  placeholder: '',
  rounded: 'md',
  searchable: false,
})

const emit = defineEmits(['change'])

const rounded = useRounded(props)

const model = defineModel<string | symbol | number | undefined>({ default: undefined })

const inputRef = ref(null)
const wrapperRef = ref(null)

const { focused } = useFocus(inputRef)
const index = computed(() => props.options.map((d => getId(d))).indexOf(model.value))

const hoverIndex = ref(-1)
const keyboardIndex = ref(-1)

watchEffect(() => {
  if (!focused.value) {
    keyboardIndex.value = -1
  }
})

watchEffect(() => {
  model.value = getId(props.options[index.value])
})

watch(model, () => {
  emit('change', model.value)
})

const options = props.options

const currentOption = computed(() => options[index.value])
const currentLabel = computed(() => getLabel(currentOption.value))
function getLabel(option?: Option) {
  if (!option) {
    return ''
  }
  if (typeof option === 'string' || typeof option === 'symbol' || typeof option === 'number') {
    return String(option)
  }
  return option.label
}

function getId(option?: Option) {
  if (!option) {
    return undefined
  }
  if (typeof option === 'string' || typeof option === 'symbol' || typeof option === 'number') {
    return option
  }
  return option.id
}

onKeyStroke('ArrowDown', (e) => {
  if (focused.value) {
    e.preventDefault()
    keyboardIndex.value = (keyboardIndex.value + 1) % options.length
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (focused.value) {
    e.preventDefault()
    keyboardIndex.value = (keyboardIndex.value - 1 + options.length) % options.length
  }
})

onKeyStroke('Enter', () => {
  if (focused.value && keyboardIndex.value !== -1) {
    model.value = getId(options[keyboardIndex.value])
    focused.value = false
  }
})
function onItemPointerDown(option: Option) {
  if (!focused.value) {
    focused.value = true
    return
  }
  model.value = getId(option)
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

const searchText = ref('')
watchEffect(() => {
  searchText.value = currentLabel.value
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchText.value = target.value
}
function shouldDisplay(data: Option, text: string) {
  return String(getLabel(data)).includes(text)
}

const filtedOptions = computed(() => {
  if (props.searchable && searchText.value !== currentLabel.value) {
    return options.filter((d) => {
      return shouldDisplay(d, searchText.value)
    })
  }
  return options
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
        :class="[colorCls.input, sizeCls.wrapper, rounded.class]"
        class="r-select-input cursor-pointer border outline-none outline-none focus-visible:outline-2"
        :placeholder="placeholder"
        :style="[rounded.style]"
        :readonly="!searchable"
        :value="searchText"
        :aria-label="ariaLabel"
        aria-haspopup="listbox"
        autocomplete="off"
        @input="onInput"
        @focus="focused = true"
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
        {{ noneText }}
      </div>
      <template v-else>
        <div
          v-for="option, i in filtedOptions"
          :key="getId(option)"
          :class="{
            'hover:bg-surface-high border-transparent': keyboardIndex !== i,
            'container-filled-primary': keyboardIndex === i,
          }"
          class="flex cursor-pointer items-center justify-between gap-2 border rounded p-1 px-2"
          @pointerdown="onItemPointerDown(option)"
          @hover="hoverIndex = i"
        >
          {{ getLabel(option) }}
          <div v-if="option === currentOption">
            <i class="i-tabler-check h-3 w-3" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
