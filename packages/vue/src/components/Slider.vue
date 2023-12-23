<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: any
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
    options: any[]
    width?: number
  }>(),
  {
    size: 'md',
    animate: true,
    width: 12,
  },
)

const emit = defineEmits(['update:modelValue'])

const length = computed(() => props.options.length ?? 0)
const currentIndex = ref(!props.options.includes(props.modelValue) ? 0 : props.options.indexOf(props.modelValue))

watchEffect(() => {
  emit('update:modelValue', props.options[currentIndex.value])
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
        class="rounded-full bg-neutral-7"
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
            v-for="option, i in options"
            :key="option"
            :style="{
              left: `${(i / (length - 1)) * 100}%`,
            }"
            class="absolute top-50% rounded-full bg-white"
            :class="sizeCls.tick"
          />
          <div
            ref="indicator"
            class="absolute top-50% cursor-pointer rounded-full bg-white"
            :class="[sizeCls.indicator, animateCls.indicator]"
            :style="{
              left: `${(currentIndex / (length - 1)) * 100}%`,
            }"
          >
            <div
              class="pointer-events-none absolute left-50% top-50% rounded-full bg-sky-5"
              :class="sizeCls.indicatorInner"
            />
          </div>
          <div
            class="pointer-events-none h-full rounded-full bg-sky-5"
            :class="[sizeCls.progress, animateCls.progress]"
            :style="{
              width: `${(currentIndex / (length - 1)) * 100}%`,
            }"
          />
        </div>
      </div>
    </div>
    <div
      class="relative mx-1 h-1em text-xs op56"
      :style="{
        width: `${props.width}rem`,
      }"
    >
      <div
        v-for="option, i in options"
        :key="option"
        :style="{
          left: `${(i / (length - 1)) * 100}%`,
        }"
        class="absolute w-auto flex rounded-full -translate-x-50%"
        :class="sizeCls.tick"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
