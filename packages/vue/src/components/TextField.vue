<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useId } from '@/composables'
import { useComponentDefaults, useInputColorStyle, useTheme } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

const props = withDefaults(
  defineProps<{
    onChange?: (value: string) => void
    color?: 'primary' | 'secondary' | 'tertiary' | 'error'
    error?: boolean
    disabled?: boolean
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number
    size?: 'sm' | 'md' | 'lg'
    password?: boolean
    placeholder?: string
    label?: string
    format?: (value: string) => string
    partialVisible?: boolean
    visibleStart?: number
    visibleEnd?: number
  }>(),
  {
    color: undefined,
    rounded: undefined,
    size: undefined,
    visibleStart: 2,
    visibleEnd: 2,
  },
)
const theme = useTheme()
const componentDefaults = useComponentDefaults('TextField')

// 创建带有 theme 默认值的有效 props
const effectiveProps = computed(() => ({
  ...props,
  color: props.color ?? componentDefaults?.color ?? theme.value.defaultColor,
  rounded: props.rounded ?? componentDefaults?.rounded ?? theme.value.rounded,
  size: props.size ?? componentDefaults?.size ?? theme.value.defaultSize,
}))
const model = defineModel<string | number>()
const sizeCls = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return {
        wrapper: 'h-6 text-xs gap-1 px-2',
        input: 'py-1',
      }
    }
    case 'lg': {
      return {
        wrapper: 'h-10 text-base gap-2 px-3',
        input: 'py-2',
      }
    }
    // case 'md':
    default: {
      return {
        wrapper: 'h-8 text-sm gap-2 px-3',
        input: 'py-1',
      }
    }
  }
})

const labelSizeCls = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return 'text-xs'
    }
    case 'lg': {
      return 'md-md'
    }
    // case 'md':
    default: {
      return 'text-sm'
    }
  }
})
const color = computed(() => effectiveProps.value.color)
const colorStyle = useInputColorStyle(color)
const disabledCls = computed(() => {
  if (props.disabled) {
    return 'pointer-events-none select-none filter opacity-60'
  }
  return ''
})

const rounded = useRounded(effectiveProps.value)

const input = ref<HTMLInputElement | null>(null)
defineExpose({
  el: input,
})
const attrs = useAttrs()
const id = useId(attrs)

// 获取部分可见的遮罩值
function getMaskedValue(value: string) {
  if (!value || value.length <= props.visibleStart + props.visibleEnd) {
    return value
  }

  const start = value.slice(0, props.visibleStart)
  const end = value.slice(-props.visibleEnd)
  const hiddenLength = value.length - props.visibleStart - props.visibleEnd
  const masked = '*'.repeat(hiddenLength)

  return start + masked + end
}

// 处理输入事件
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const currentValue = target.value

  if (props.password && props.partialVisible) {
    // 部分可见密码模式：立即更新真实值，然后替换显示值
    model.value = currentValue

    // 保存光标位置
    const cursorPos = target.selectionStart || 0

    // 立即替换为遮罩值
    const maskedValue = getMaskedValue(currentValue)
    target.value = maskedValue

    // 恢复光标位置
    target.setSelectionRange(cursorPos, cursorPos)
  }
  else {
    // 普通模式
    if (props.format && typeof props.format === 'function') {
      const formattedValue = props.format(currentValue)
      target.value = formattedValue
      model.value = formattedValue
    }
    else {
      model.value = currentValue
    }
  }
}
</script>

<template>
  <div
    :style="[colorStyle]"
    v-bind="$attrs"
  >
    <label
      v-if="$slots.label || label"
      :for="id"
      class="mb-1 block"
      :class="[labelSizeCls]"
    >
      <slot
        v-if="$slots.label"
        name="label"
      />
      <span
        v-else
      >
        {{ label }}
      </span>
    </label>
    <div
      class="custom-input-colors outline-none border inline-flex items-center"
      :class="[disabledCls, rounded.class, sizeCls.wrapper]"
      :style="[rounded.style]"
    >
      <div
        v-if="$slots.leftSection"
        class="flex items-center justify-center"
      >
        <slot name="leftSection" />
      </div>
      <input
        :id="id"
        v-bind="$attrs"
        ref="input"
        v-model="model"
        :disabled="disabled"
        class="outline-none bg-transparent flex-1"
        :class="[sizeCls.input]"
        :placeholder="placeholder"
        :type="props.password && !props.partialVisible ? 'password' : 'text'"
        @input="handleInput"
      >
      <div
        v-if="$slots.rightSection"
        class="flex items-center justify-center"
      >
        <slot name="rightSection" />
      </div>
    </div>
  </div>
</template>
