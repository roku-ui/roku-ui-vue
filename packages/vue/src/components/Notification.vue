<script setup lang="ts">
import type { Size } from '@/types'
import { computed } from 'vue'
import { Btn, Progress } from '@/components'
import { useContainerDefaultCS, useContainerFilledCS, useTextCS, useTheme } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    icon?: string
    loading?: boolean
    withBorder?: boolean
    closeable?: boolean
    rounded?: 'sm' | 'md' | 'lg' | 'none' | string | number
    block?: boolean
    color?: string
    size?: Size
    complete?: number
    total?: number
    showLeftIndicator?: boolean
  }>(),
  {
    type: 'info',
    border: false,
    color: undefined,
    rounded: undefined,
    block: false,
    size: undefined,
    total: 100,
    showLeftIndicator: false,
  },
)

const theme = useTheme()

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? theme.value.defaultSize,
  color: props.color ?? theme.value.defaultColor,
  rounded: props.rounded ?? theme.value.rounded,
}))

defineEmits(['close'])
defineSlots<{
  closeIcon?: (props: any) => any
  message?: (props: any) => any
}>()

const rounded = useRounded(effectiveProps.value)
const color = computed(() => effectiveProps.value.color)
const containerFilledCS = useContainerFilledCS(color)
const textCS = useTextCS(color)
const containerSurfaceCS = useContainerDefaultCS()
const shapeClass = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return 'min-h-10 p-1'
    }
    case 'lg': {
      return 'min-h-16 p-4'
    }
    // case 'md':
    default: {
      return 'min-h-16 p-3'
    }
  }
})
</script>

<template>
  <div
    class="overflow-hidden"
    :class="[
      { 'border-0': !withBorder },
      rounded.class,
      {
        'max-w-100': !block,
        'w-full': block,
      },
    ]"
    :style="[rounded.style]"
    v-bind="containerSurfaceCS"
  >
    <div
      class="pl-4 flex gap-2 min-w-80 w-full items-center relative"
      :class="[shapeClass, textCS.class]"
    >
      <div
        v-if="icon"
        :class="[textCS.class]"
        :style="textCS.style"
        class="leading-0"
      >
        <i
          v-if="loading"
          class="h-container w-container i-tabler-loader-2 shrink-0 animate-spin"
        />
        <i
          v-else
          class="h-container w-container shrink-0"
          :class="icon"
        />
      </div>
      <div
        v-else-if="showLeftIndicator"
      >
        <div
          class="rounded-full bg-[var(--d-bg)] h-[calc(100%-0.5rem)] w-1 left-[0.25rem] top-[0.25rem] absolute dark:bg-[var(--d-bg)]"
          :class="[{
            'animate-pulse': loading,
          }]"
          v-bind="containerFilledCS"
        />
      </div>
      <div class="grow-1">
        <div
          v-if="title"
          class="text-[var(--l-text)] dark:text-[var(--d-text)]"
          :style="textCS.style"
          :class="[{
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          }, textCS.class]"
        >
          {{ title }}
        </div>

        <slot
          v-if="$slots.message"
          name="message"
        />
        <div
          v-else-if="message"
          class="text-surface-dimmed"
          :class="{
            'text-xs': size === 'sm',
            'text-sm': size === 'md' || size === 'lg',
          }"
        >
          {{ message }}
        </div>
      </div>
      <Btn
        v-if="closeable"
        icon
        variant="transparent"
        color="white"
        @click="$emit('close')"
      >
        <slot
          v-if="$slots.closeIcon"
          name="closeIcon"
        />
        <i
          v-else
          class="i-fluent-dismiss-12-filled"
        />
      </Btn>
    </div>
    <Progress
      v-if="complete"
      :value="complete"
      :max="total"
    />
  </div>
</template>
