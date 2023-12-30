<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
    width?: number
    options?: any[]
    min?: number
    max?: number
    step?: number
    tickNum?: number
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
  }>(),
  {
    size: 'md',
    animate: false,
    width: 12,
    min: 0,
    max: 100,
    step: 1,
    color: 'primary',
  },
)

function minMaxStepToOptions(min: number, max: number, step: number) {
  const options = []
  for (let i = min; i <= max; i += step) {
    options.push(i)
  }
  if (options[options.length - 1] !== max) {
    options.push(max)
  }
  return options
}

function getTicks(tickNum: number, options: any[]) {
  const ticks = []
  ticks.push(options[0])
  const step = (options.length - 1) / (tickNum - 1)
  for (let i = 1; i < tickNum - 1; i++) {
    ticks.push(options[Math.round(i * step)])
  }
  ticks.push(options[options.length - 1])
  return ticks
}

const tickNum = computed(() => {
  if (props.options) {
    return props.options.length
  }
  else {
    return props.tickNum ?? 0
  }
})
const options = computed(() => props.options === undefined ? minMaxStepToOptions(props.min, props.max, props.step) : props.options)
const ticks = computed(() => getTicks(tickNum.value, options.value))

const model = defineModel<any>({
  default: undefined,
})
const length = computed(() => options.value.length ?? 0)
const currentIndex = ref(!options.value.includes(model.value) ? 0 : options.value.indexOf(model.value))

const currentTheme = useCurrentTheme()

function optionToIndex(option: any) {
  return options.value.indexOf(option)
}

watchEffect(() => {
  model.value = options.value[currentIndex.value]
})

const wrapper = ref<HTMLElement>()
const indicator = ref<HTMLElement>()

const rect = useElementBounding(wrapper)
const isMoving = ref(false)

function pointEventCallback(event: PointerEvent) {
  if (!isMoving.value) {
    return
  }
  const isPointerDown = event.buttons === 1
  if (!isPointerDown) {
    isMoving.value = false
    return
  }
  event.preventDefault()
  event.stopPropagation()
  const { clientX } = event
  const left = rect.left.value
  const right = rect.right.value
  const width = right - left
  const index = Math.round(((clientX - left) / width) * (length.value - 1))
  if (index < 0 || index > length.value - 1) {
    return
  }
  currentIndex.value = index
}

watchEffect(() => {
  currentIndex.value = optionToIndex(model.value)
})

const colorCls = computed(() => {
  switch (props.color) {
    case 'primary':
      return 'bg-primary-container'
    case 'secondary':
      return 'bg-secondary-container'
    case 'tertiary':
      return 'bg-tertiary-container'
    case 'error':
      return 'bg-error-container'
  }
})

function pointDownEventCallback(event: PointerEvent) {
  event.preventDefault()
  event.stopPropagation()
  isMoving.value = true
  pointEventCallback(event)
}

useEventListener(wrapper, 'pointerdown', pointDownEventCallback)
onMounted(() => {
  useEventListener(document, 'pointermove', pointEventCallback)
})
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrapper: 'h-2',
        innerWrapper: 'px-0.5 h-1',
        content: 'h-1',
        tick: 'h-0.5 w-0.5 -translate-x-0.25 -translate-y-0.25',
        indicator: 'h-2 w-2 -translate-x-1 -translate-y-1',
        indicatorInner: 'h-1 w-1 -translate-x-0.5 -translate-y-0.5',
        progress: '-mx-0.5',
      }
    case 'md':
      return {
        wrapper: 'h-4',
        innerWrapper: 'px-1 h-2',
        content: 'h-2',
        tick: 'h-1 w-1 -translate-x-0.5 -translate-y-0.5',
        indicator: 'h-4 w-4 -translate-x-2 -translate-y-2',
        indicatorInner: 'h-2 w-2 -translate-x-1 -translate-y-1',
        progress: '-mx-1',
      }
    case 'lg':
      return {
        wrapper: 'h-6',
        innerWrapper: 'px-1.5 h-3',
        content: 'h-3',
        tick: 'h-1.5 w-1.5 -translate-x-0.75 -translate-y-0.75',
        indicator: 'h-6 w-6 -translate-x-3 -translate-y-3',
        indicatorInner: 'h-3 w-3 -translate-x-1.5 -translate-y-1.5',
        progress: '-mx-1.5',
      }
  }
})
const animateCls = computed(() => props.animate
  ? {
      indicator: 'transition-left',
      progress: 'transition-width',
    }
  : {
      indicator: '',
      progress: '',
    })
</script>

<template>
  <div class="relative inline-block">
    <div
      ref="wrapper"
      type="size"
      class="flex cursor-pointer items-center"
      :class="sizeCls.wrapper"
      @touchmove.prevent
    >
      <div
        class="rounded-full bg-surface-high"
        :class="sizeCls.innerWrapper"
      >
        <div
          class="relative flex"
          :class="sizeCls.content"
          :style="{
            width: `${props.width}rem`,
          }"
        >
          <div
            v-for="option in ticks"
            :key="option"
            :style="{
              left: `${(optionToIndex(option) / (length - 1)) * 100}%`,
            }"
            class="absolute top-50% rounded-full bg-white"
            :class="sizeCls.tick"
          />
          <div
            ref="indicator"
            class="absolute top-50% cursor-pointer rounded-full"
            :class="[sizeCls.indicator, animateCls.indicator, {
              'bg-white': currentTheme === 'dark',
              [colorCls]: currentTheme === 'light',
            }]"
            :style="{
              left: `${(currentIndex / (length - 1)) * 100}%`,
            }"
          >
            <div
              class="pointer-events-none absolute left-50% top-50% rounded-full"
              :class="[sizeCls.indicatorInner, {
                [colorCls]: currentTheme === 'dark',
                'bg-white': currentTheme === 'light',
              }]"
            />
          </div>
          <div
            class="pointer-events-none h-full rounded-full"
            :class="[sizeCls.progress, animateCls.progress, colorCls]"
            :style="{
              width: `${(currentIndex / (length - 1)) * 100}%`,
            }"
          />
        </div>
      </div>
    </div>
    <div
      class="text-surface-onlow relative mx-1 h-1em text-xs"
      :style="{
        width: `${props.width}rem`,
      }"
    >
      <div
        v-for="option, i in ticks"
        :key="i"
        :style="{
          left: `${(optionToIndex(option) / (length - 1)) * 100}%`,
        }"
        class="absolute w-auto flex rounded-full -translate-x-50%"
        :class="sizeCls.tick"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
