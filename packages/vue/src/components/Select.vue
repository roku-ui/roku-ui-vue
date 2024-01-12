<script setup lang="ts">
type Option = {
  id: number | string | symbol
  label: string
} | string | symbol | number

const props = withDefaults(defineProps<{
  options?: Option[]
  size?: 'sm' | 'md' | 'lg'
  noneText?: string
  placeholder?: string
}>(), {
  modelValue: undefined,
  options() {
    return []
  },
  size: 'md',
  noneText: 'No options',
  placeholder: '',
})

const emit = defineEmits(['change'])

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
        :placeholder="placeholder"
        readonly
        :value="currentLabel"
        aria-haspopup="listbox"
        autocomplete="off"
        tabindex="-1"
        @focus="focused = true"
      >
      <i class="i-tabler-chevron-down pointer-events-none absolute right-2" />
    </div>
    <div
      v-if="focused"
      :class="sizeCls.dropdown"
      class="absolute z-1 mt-2 w-full flex-col overflow-hidden border container-base rounded p-1"
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
            'hover:bg-surface-high': keyboardIndex !== i,
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
