<script setup lang="ts">
import { useElementBounding, useEventListener } from '@vueuse/core'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useColors, useContainerFilledCS } from '../shared'

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
    color?: string
    minWidth?: number
  }>(),
  {
    size: 'md',
    animate: false,
    min: 0,
    max: 100,
    step: 1,
    color: 'primary',
    minWidth: 12,
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
  const ticks: any[] = []
  if (tickNum === 0) {
    return ticks
  }
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
  const index = Math.round(((clientX - left) / width) * (length.value - 1))
  if (index < 0) {
    currentIndex.value = 0
    return
  }
  if (index > length.value - 1) {
    currentIndex.value = length.value - 1
    return
  }
  currentIndex.value = index
}

watchEffect(() => {
  currentIndex.value = optionToIndex(model.value)
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
  currentIndex.value = Math.max(0, optionToIndex(model.value))
})
const sizeCls = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrapper: 'h-2',
        innerWrapper: 'px-0.5 h-1',
        content: 'h-1',
        tick: 'h-0.5 w-0.5 -translate-x-0.25 -translate-y-0.25',
        indicator: 'h-3 w-3 -translate-x-1.5 -translate-y-1.5',
        indicatorInner: 'h-1.5 w-1.5 -translate-x-0.75 -translate-y-0.75',
        progress: '-mx-0.5',
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
    case 'md':
    default:
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
  <div class="relative w-full">
    <div
      ref="wrapper"
      type="size"
      class="w-full flex cursor-pointer items-center"
      :class="sizeCls.wrapper"
      @touchmove.prevent
    >
      <div
        class="w-full rounded-full bg-surface-3 transition-background-color,border-color,color dark:bg-surface-7"
        :class="sizeCls.innerWrapper"
      >
        <div
          class="relative flex"
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
              left: `${(optionToIndex(option) / (length - 1)) * 100}%`,
            }"
            class="absolute top-50% rounded-full bg-surface-0"
            :class="sizeCls.tick"
          />
          <div
            v-if="currentIndex !== -1"
            ref="indicator"
            class="absolute top-50% cursor-pointer rounded-full transition-background-color,border-color,color"
            :class="[sizeCls.indicator, animateCls.indicator, indicatorOuterCls]"
            :style="[
              `--i-bg: ${filledColor}`,
              {
                left: `${(currentIndex / (length - 1)) * 100}%`,
              },
            ]"
          >
            <div
              class="pointer-events-none absolute left-50% top-50% rounded-full"
              :class="[sizeCls.indicatorInner, indicatorInnerCls]"
            />
          </div>
          <div
            class="pointer-events-none h-full rounded-full"
            :class="[
              containerFilledCS.class,
              sizeCls.progress,
              animateCls.progress,
            ]"
            :style="[
              containerFilledCS.style,
              {
                width: `${(currentIndex / (length - 1)) * 100}%`,
              },
            ]"
          />
        </div>
      </div>
    </div>
    <div
      v-if="ticks.length > 0"
      class="text-surface-on-low relative mx-1 h-1em text-xs"
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
