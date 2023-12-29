<script setup lang="ts">
type Option = {
  id: number | string | symbol
  label: string
} | string | symbol | number

const props = withDefaults(defineProps<{
  options?: Option[]
  modelValue?: string | symbol | number
  size?: 'sm' | 'md' | 'lg'
  noneText?: string
}>(), {
  modelValue: undefined,
  options() {
    return []
  },
  size: 'md',
  noneText: 'No options',
})

const emit = defineEmits(['update:modelValue', 'change'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const inputRef = ref(null)
const wrapperRef = ref(null)

const { focused } = useFocus(inputRef)
const index = computed(() => props.options.map((d => getId(d))).indexOf(value.value))

const hoverIndex = ref(-1)
const keyboardIndex = ref(-1)

watchEffect(() => {
  if (!focused.value) {
    keyboardIndex.value = -1
  }
})

watchEffect(() => {
  value.value = getId(props.options[index.value])
})

watch(value, () => {
  emit('change', value.value)
})

const options = props.options

const currentOption = computed(() => options[index.value])
const currentLabel = computed(() => getLabel(currentOption.value))
function getLabel(option?: Option) {
  if (!option) {
    return undefined
  }
  if (typeof option === 'string' || typeof option === 'symbol' || typeof option === 'number') {
    return option
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
    value.value = getId(options[keyboardIndex.value])
    focused.value = false
  }
})
function onItemPointerDown(option: Option) {
  if (!focused.value) {
    focused.value = true
    return
  }
  value.value = getId(option)
  focused.value = false
}
const colorCls = computed(() => {
  return {
    input: 'container-default focus:border-primary-7',
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
</script>

<template>
  <div
    ref="wrapperRef"
    class="r-select-wrapper relative"
  >
    <div class="w-full flex items-center">
      <input
        ref="inputRef"
        :class="[colorCls.input, sizeCls.wrapper]"
        class="r-select-input cursor-pointer border rounded outline-none"
        placeholder="Select"
        readonly
        :value="currentLabel"
        aria-haspopup="listbox"
        autocomplete="off"
        @focus="focused = true"
      >
      <i class="i-tabler-chevron-down pointer-events-none absolute right-2" />
    </div>
    <div
      v-if="focused"
      :class="sizeCls.dropdown"
      class="absolute z-1 mt-2 w-full flex-col overflow-hidden border container-default rounded p-1"
    >
      <div
        v-if="options.length === 0"
        class="flex cursor-default items-center justify-between gap-2 rounded p-1 px-2"
      >
        {{ noneText }}
      </div>
      <template v-else>
        <div
          v-for="option, i in options"
          :key="getId(option)"
          :class="{
            'hover:bg-surface-7': keyboardIndex !== i,
            'container-filled-primary': keyboardIndex === i,
          }"
          class="flex cursor-pointer items-center justify-between gap-2 rounded p-1 px-2"
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
