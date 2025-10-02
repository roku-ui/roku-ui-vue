<script setup lang="ts">
import { useElementBounding, useEventListener } from '@vueuse/core'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useColors, useContainerFilledCS } from '@/shared'

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
    ticks?: number[]
    color?: string
    minWidth?: number
    reverse?: boolean
    alignTicksToStep?: boolean
  }>(),
  {
    size: 'md',
    animate: false,
    min: 0,
    max: 100,
    step: 1,
    color: 'primary',
    minWidth: 12,
    reverse: false,
    alignTicksToStep: false,
  },
)

function minMaxStepToOptions(min: number, max: number, step: number) {
  const options = []
  const numSteps = Math.round((max - min) / step)

  for (let i = 0; i <= numSteps; i++) {
    const value = Number((min + i * step).toFixed(10))
    options.push(value)
  }

  // Ensure max is included if it's not already the last option
  const lastOption = options.at(-1)
  if (lastOption !== undefined && Math.abs(lastOption - max) > Number.EPSILON) {
    options.push(max)
  }

  return options
}

function getTicks(tickNum: number, options: any[], min: number, max: number, useOptions: boolean = false, alignToStep: boolean = false) {
  const ticks: any[] = []
  if (tickNum === 0) {
    return ticks
  }
  if (tickNum === 1) {
    ticks.push(useOptions ? options[0] : min)
    return ticks
  }

  if (useOptions) {
    // 当使用 custom options 时，从 options 中选择 tick
    ticks.push(options[0])
    if (tickNum > 2) {
      const step = (options.length - 1) / (tickNum - 1)
      for (let i = 1; i < tickNum - 1; i++) {
        ticks.push(options[Math.round(i * step)])
      }
    }
    if (options.length > 1) {
      ticks.push(options.at(-1))
    }
  }
  else if (alignToStep) {
    // 当需要对齐到 step 时，从 options 中选择 tick
    ticks.push(options[0])
    if (tickNum > 2) {
      const step = (options.length - 1) / (tickNum - 1)
      for (let i = 1; i < tickNum - 1; i++) {
        ticks.push(options[Math.round(i * step)])
      }
    }
    if (options.length > 1) {
      ticks.push(options.at(-1))
    }
  }
  else {
    // 默认情况下，均匀分布在 min 到 max 之间
    for (let i = 0; i < tickNum; i++) {
      const value = min + (max - min) * (i / (tickNum - 1))
      ticks.push(Number(value.toFixed(2)))
    }
  }
  return ticks
}

const tickNum = computed(() => {
  // 确保 ticks 和 tickNum 不能同时存在
  if (props.ticks !== undefined && props.tickNum !== undefined) {
    console.warn('Slider: ticks and tickNum cannot be used together. Using ticks.')
  }

  if (props.ticks !== undefined) {
    return props.ticks.length
  }

  if (props.tickNum !== undefined) {
    return props.tickNum
  }

  // 如果使用 custom options 且没有明确设置 tickNum，默认显示所有选项
  if (props.options !== undefined) {
    return props.options.length
  }
  return 0
})
const options = computed(() => props.options === undefined ? minMaxStepToOptions(props.min, props.max, props.step) : props.options)
const ticks = computed(() => {
  // 如果使用自定义 ticks 数组，直接返回
  if (props.ticks !== undefined) {
    return props.ticks
  }

  // 否则使用原来的逻辑
  return getTicks(tickNum.value, options.value, props.min, props.max, props.options !== undefined, props.alignTicksToStep)
})

const model = defineModel<any>({
  default: undefined,

})
const length = computed(() => options.value.length ?? 0)
const currentIndex = ref(options.value.includes(model.value) ? options.value.indexOf(model.value) : 0)

function optionToIndex(option: any) {
  let res = options.value.indexOf(option)
  if (res === -1) {
    // 如果 model 是数字，则从 options 中找到最接近的值
    if (typeof option === 'number') {
      let minDiff = Infinity
      for (let i = 0; i < options.value.length; i++) {
        const diff = Math.abs(options.value[i] - option)
        if (diff < minDiff) {
          minDiff = diff
          res = i
        }
      }
    }
    else {
      res = 0
    }
  }
  return res
}

function valueToPosition(value: any, min: number, max: number, isCustomOptions: boolean = false) {
  if (isCustomOptions) {
    // 对于 custom options，使用 optionToIndex 计算位置
    const index = optionToIndex(value)
    const length = options.value.length
    if (length === 1) {
      return 0
    }
    return (index / (length - 1)) * 100
  }

  if (typeof value !== 'number') {
    return 0
  }
  if (max === min) {
    return 0
  }
  return ((value - min) / (max - min)) * 100
}

const color = computed(() => props.color)
const colors = useColors(color.value)
const filledColor = computed(() => colors.value[4])
const indicatorOuterCls = 'dark:bg-white bg-[var(--i-bg)]'
const indicatorInnerCls = 'dark:bg-[var(--i-bg)] bg-white'
const containerFilledCS = useContainerFilledCS(color)

watchEffect(() => {
  if (currentIndex.value < 0) {
    return
  }
  model.value = options.value[currentIndex.value]
})

watchEffect(() => {
  currentIndex.value = optionToIndex(model.value)
})

const wrapper = ref<HTMLElement>()
const indicator = ref<HTMLElement>()

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
  const rect = useElementBounding(wrapper)
  const { clientX } = event
  const left = rect.left.value
  const right = rect.right.value
  const width = right - left

  // Calculate the relative position (0 to 1)
  let relativeX = (clientX - left) / width
  if (props.reverse) {
    relativeX = 1 - relativeX
  }
  relativeX = Math.max(0, Math.min(relativeX, 1))

  // 始终使用所有可选择的 options，而不是被 tick 限制
  const targetArray = options.value
  const targetLength = length.value

  let closestValue = targetArray[0]
  let minDiff = Infinity

  for (let i = 0; i < targetLength; i++) {
    const optionRelativePos = targetLength === 1 ? 0 : i / (targetLength - 1)
    const diff = Math.abs(relativeX - optionRelativePos)
    if (diff < minDiff) {
      minDiff = diff
      closestValue = targetArray[i]
    }
  }

  currentIndex.value = optionToIndex(closestValue)
}

function pointDownEventCallback(event: PointerEvent) {
  event.preventDefault()
  event.stopPropagation()
  isMoving.value = true
  pointEventCallback(event)
}

useEventListener(wrapper, 'pointerdown', pointDownEventCallback)
onMounted(() => {
  useEventListener(document, 'pointermove', pointEventCallback)
  currentIndex.value = Math.max(0, optionToIndex(model.value))
})
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm': {
      return {
        wrapper: 'h-2',
        innerWrapper: 'px-0.5 h-1',
        content: 'h-1',
        tick: 'h-0.5 w-0.5 -translate-x-0.25 -translate-y-0.25',
        indicator: 'h-3 w-3 -translate-x-1.5 -translate-y-1.5',
        indicatorInner: 'h-1.5 w-1.5 -translate-x-0.75 -translate-y-0.75',
        progress: '-mx-0.5',
      }
    }

    case 'lg': {
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
    // case 'md':
    default: {
      return {
        wrapper: 'h-4',
        innerWrapper: 'px-1 h-2',
        content: 'h-2',
        tick: 'h-1 w-1 -translate-x-0.5 -translate-y-0.5',
        indicator: 'h-4 w-4 -translate-x-2 -translate-y-2',
        indicatorInner: 'h-2 w-2 -translate-x-1 -translate-y-1',
        progress: '-mx-1',
      }
    }
  }
})
const animateCls = computed(() => props.animate && !isMoving.value
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
  <div
    class="w-full relative"
    :style="{ minHeight: size === 'sm' ? '24px' : size === 'lg' ? '40px' : '32px' }"
  >
    <div
      ref="wrapper"
      type="size"
      class="flex cursor-pointer items-center"
      :class="[
        sizeCls.wrapper,
        tickNum > 0 ? '' : 'absolute top-1/2 transform -translate-y-1/2',
      ]"
      :style="{
        width: props.width ? `${props.width}rem` : '100%',
        minWidth: `${props.minWidth}rem`,
      }"
      @touchmove.prevent
    >
      <div
        class="bg-surface-variant-1 rounded-full"
        :class="sizeCls.innerWrapper"
        :style="{
          width: '100%',
        }"
      >
        <div
          class="flex relative"
          :class="sizeCls.content"
          :style="{
            width: `${props.width}rem`,
            minWidth: `${props.minWidth}rem`,
          }"
        >
          <div
            v-for="option in ticks"
            :key="option"
            :style="{
              left: `${props.reverse ? 100 - valueToPosition(option, props.min, props.max, props.options !== undefined) : valueToPosition(option, props.min, props.max, props.options !== undefined)}%`,
            }"
            class="bg-surface-variant-2 rounded-full top-50% absolute"
            :class="sizeCls.tick"
          />
          <div
            v-if="currentIndex !== -1"
            ref="indicator"
            class="rounded-full cursor-pointer top-50% absolute"
            :class="[sizeCls.indicator, animateCls.indicator, indicatorOuterCls]"
            :style="[
              `--i-bg: ${filledColor}`,
              {
                left: `${props.reverse ? 100 - (length === 1 ? 0 : (currentIndex / (length - 1)) * 100) : (length === 1 ? 0 : (currentIndex / (length - 1)) * 100)}%`,
              },
            ]"
          >
            <div
              class="rounded-full pointer-events-none left-50% top-50% absolute"
              :class="[sizeCls.indicatorInner, indicatorInnerCls]"
            />
          </div>
          <div
            class="rounded-full h-full pointer-events-none"
            :class="[
              containerFilledCS.class,
              sizeCls.progress,
              animateCls.progress,
            ]"
            :style="[
              containerFilledCS.style,
              {
                width: `${props.reverse ? 100 - (length === 1 ? 0 : (currentIndex / (length - 1)) * 100) : (length === 1 ? 0 : (currentIndex / (length - 1)) * 100)}%`,
              },
            ]"
          />
        </div>
      </div>
    </div>
    <div
      v-if="ticks.length > 0"
      class="text-surface-dimmed text-xs h-1em relative"
      :class="[
        props.size === 'sm' ? 'mx-0.5' : props.size === 'lg' ? 'mx-1.5' : 'mx-1',
      ]"
      :style="{
        width: props.width ? `calc(${props.width}rem - ${props.size === 'sm' ? '0.25rem' : props.size === 'lg' ? '0.75rem' : '0.5rem'})` : `calc(100% - ${props.size === 'sm' ? '0.25rem' : props.size === 'lg' ? '0.75rem' : '0.5rem'})`,
        minWidth: `calc(${props.minWidth}rem - ${props.size === 'sm' ? '0.25rem' : props.size === 'lg' ? '0.75rem' : '0.5rem'})`,
      }"
    >
      <div
        v-for="option, i in ticks"
        :key="i"
        :style="{
          left: `${props.reverse ? 100 - valueToPosition(option, props.min, props.max, props.options !== undefined) : valueToPosition(option, props.min, props.max, props.options !== undefined)}%`,
        }"
        class="text-center flex w-auto whitespace-nowrap items-center justify-center absolute -translate-x-50%"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
