<script setup lang="ts">
import type { Color } from '@/types'
import { onKeyStroke } from '@vueuse/core'
import { computed, provide, ref } from 'vue'
import { useContainerFilledCS, useCS, useTheme } from '@/shared'

export interface StepItem {
  title: string
  description?: string
  icon?: string
  status?: 'wait' | 'process' | 'finish' | 'error'
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue?: number
  items: StepItem[]
  direction?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  color?: Color
  type?: 'default' | 'navigation' | 'dot' | 'simple'
  clickable?: boolean
  linear?: boolean
  showDescription?: boolean
  alternativeLabel?: boolean
  responsive?: boolean
  progressDot?: boolean
  labelPlacement?: 'horizontal' | 'vertical'
}>(), {
  modelValue: 0,
  direction: 'horizontal',
  size: 'md',
  color: 'primary',
  type: 'default',
  clickable: true,
  linear: true,
  showDescription: true,
  alternativeLabel: false,
  responsive: true,
  progressDot: false,
  labelPlacement: 'horizontal',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [current: number, previous: number]
  'click': [index: number]
}>()

const theme = useTheme()
const stepRef = ref<HTMLElement | null>(null)

const effectiveProps = computed(() => ({
  ...props,
  size: props.size ?? theme.value.defaultSize,
  color: props.color ?? theme.value.defaultColor,
}))

const currentStep = computed({
  get: () => props.modelValue,
  set: (value: number) => {
    if (value !== props.modelValue) {
      emit('update:modelValue', value)
      emit('change', value, props.modelValue)
    }
  },
})

// Provide context to child components
provide('step-context', {
  currentStep,
  items: props.items,
  direction: props.direction,
  size: effectiveProps.value.size,
  color: effectiveProps.value.color,
  type: props.type,
  clickable: props.clickable,
  linear: props.linear,
  showDescription: props.showDescription,
  alternativeLabel: props.alternativeLabel,
  progressDot: props.progressDot,
  labelPlacement: props.labelPlacement,
})

// Calculate processed items with status
const processedItems = computed(() => {
  return props.items.map((item, index) => {
    let status = item.status
    if (!status) {
      if (index < currentStep.value) {
        status = 'finish'
      }
 else if (index === currentStep.value) {
        status = 'process'
      }
 else {
        status = 'wait'
      }
    }
    return {
      ...item,
      status,
      index,
    }
  })
})

// Handle step click
function handleStepClick(index: number) {
  if (!props.clickable || processedItems.value[index].disabled) {
 return
}

  if (props.linear && index > currentStep.value + 1) {
 return
}

  currentStep.value = index
  emit('click', index)
}

// Keyboard navigation
onKeyStroke('ArrowLeft', (e) => {
  if (!stepRef.value?.contains(document.activeElement)) {
 return
}
  e.preventDefault()

  if (props.direction === 'horizontal' && currentStep.value > 0) {
    const newIndex = currentStep.value - 1
    if (!processedItems.value[newIndex].disabled) {
      currentStep.value = newIndex
    }
  }
})

onKeyStroke('ArrowRight', (e) => {
  if (!stepRef.value?.contains(document.activeElement)) {
 return
}
  e.preventDefault()

  if (props.direction === 'horizontal' && currentStep.value < props.items.length - 1) {
    const newIndex = currentStep.value + 1
    if (!processedItems.value[newIndex].disabled) {
      currentStep.value = newIndex
    }
  }
})

onKeyStroke('ArrowUp', (e) => {
  if (!stepRef.value?.contains(document.activeElement)) {
 return
}
  e.preventDefault()

  if (props.direction === 'vertical' && currentStep.value > 0) {
    const newIndex = currentStep.value - 1
    if (!processedItems.value[newIndex].disabled) {
      currentStep.value = newIndex
    }
  }
})

onKeyStroke('ArrowDown', (e) => {
  if (!stepRef.value?.contains(document.activeElement)) {
 return
}
  e.preventDefault()

  if (props.direction === 'vertical' && currentStep.value < props.items.length - 1) {
    const newIndex = currentStep.value + 1
    if (!processedItems.value[newIndex].disabled) {
      currentStep.value = newIndex
    }
  }
})

// Container classes
const containerClasses = computed(() => {
  const base = 'step-container'
  const direction = props.direction === 'vertical' ? 'flex-col' : 'flex-row items-center'
  const type = props.type === 'navigation' ? 'step-navigation' : ''

  return [base, direction, type, 'flex'].filter(Boolean)
})

// Size classes
const sizeClasses = computed(() => {
  switch (effectiveProps.value.size) {
    case 'sm': {
      return {
        icon: 'w-8 h-8 text-sm',
        title: 'text-sm font-semibold',
        description: 'text-xs leading-relaxed',
        connector: props.direction === 'horizontal' ? 'h-0.5' : 'w-0.5',
        spacing: props.direction === 'horizontal' ? 'gap-3' : 'gap-2',
      }
    }
    case 'lg': {
      return {
        icon: 'w-12 h-12 text-lg',
        title: 'text-lg font-semibold',
        description: 'text-base leading-relaxed',
        connector: props.direction === 'horizontal' ? 'h-1' : 'w-1',
        spacing: props.direction === 'horizontal' ? 'gap-4' : 'gap-3',
      }
    }
    default: {
      return {
        icon: 'w-10 h-10 text-base',
        title: 'text-base font-semibold',
        description: 'text-sm leading-relaxed',
        connector: props.direction === 'horizontal' ? 'h-0.5' : 'w-0.5',
        spacing: props.direction === 'horizontal' ? 'gap-3' : 'gap-2.5',
      }
    }
  }
})

// Color systems for different states
const finishIconCS = useContainerFilledCS(computed(() => effectiveProps.value.color))
const finishTextCS = useCS({
  color: 'surface',
  type: 'text',
  index: { dark: 1, light: 1 },
})
const finishConnectorCS = useCS({
  color: computed(() => effectiveProps.value.color),
  type: 'bg',
  index: { dark: 5, light: 4 },
})

const processIconCS = useCS({
  color: computed(() => effectiveProps.value.color),
  type: 'border',
  index: { dark: 5, light: 4 },
})
const processTextCS = useCS({
  color: computed(() => effectiveProps.value.color),
  type: 'text',
  index: { dark: 5, light: 4 },
})

const waitIconCS = useCS({
  color: 'surface',
  type: 'border',
  index: { dark: 5, light: 4 },
})
const waitTextCS = useCS({
  color: 'surface',
  type: 'text',
  index: { dark: 5, light: 4 },
})
const waitConnectorCS = useCS({
  color: 'surface',
  type: 'bg',
  index: { dark: 6, light: 3 },
})

const errorIconCS = useCS({
  color: 'error',
  type: 'border',
  index: { dark: 5, light: 4 },
})
const errorTextCS = useCS({
  color: 'error',
  type: 'text',
  index: { dark: 5, light: 4 },
})

// Progress bar color system
const progressBarCS = useCS({
  color: computed(() => effectiveProps.value.color),
  type: 'bg',
  index: { dark: 5, light: 4 },
})

// Get color system based on status
function getColorSystem(status: string) {
  switch (status) {
    case 'finish': {
      return {
        icon: finishIconCS.value,
        title: finishTextCS.value,
        connector: finishConnectorCS.value,
      }
    }
    case 'process': {
      return {
        icon: {
          ...processIconCS.value,
          class: [...processIconCS.value.class, 'border-2'],
        },
        title: processTextCS.value,
        connector: waitConnectorCS.value,
      }
    }
    case 'error': {
      return {
        icon: {
          ...errorIconCS.value,
          class: [...errorIconCS.value.class, 'border-2'],
        },
        title: errorTextCS.value,
        connector: waitConnectorCS.value,
      }
    }
    default: { // wait
      return {
        icon: {
          ...waitIconCS.value,
          class: [...waitIconCS.value.class, 'border-2'],
        },
        title: waitTextCS.value,
        connector: waitConnectorCS.value,
      }
    }
  }
}

// Progress calculation
const progressPercent = computed(() => {
  if (props.items.length === 0) {
 return 0
}
  return ((currentStep.value + 1) / props.items.length) * 100
})
</script>

<template>
  <div
    ref="stepRef"
    :class="containerClasses"
    class="step-wrapper w-full"
    role="tablist"
    :aria-orientation="direction"
  >
    <!-- Progress bar for simple type -->
    <div
      v-if="type === 'simple'"
      class="mb-6 w-full"
    >
      <div class="text-sm text-surface-2 mb-3 flex items-center justify-between dark:text-surface-2">
        <span class="font-medium">Step {{ currentStep + 1 }} of {{ items.length }}</span>
        <span class="font-semibold">{{ Math.round(progressPercent) }}%</span>
      </div>
      <div class="rounded-full bg-surface-3 h-2.5 w-full dark:bg-surface-6">
        <div
          class="rounded-full h-full transition-all duration-300"
          v-bind="progressBarCS"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
      <div class="text-sm text-surface-1 font-medium mt-3 dark:text-surface-1">
        {{ processedItems[currentStep]?.title }}
      </div>
    </div>

    <!-- Steps -->
    <template
      v-for="(item, index) in processedItems"
      :key="index"
    >
      <!-- Step item -->
      <div
        class="step-item flex transition-colors duration-200 items-start relative"
        :class="[
          direction === 'vertical' ? 'mb-6 last:mb-0' : 'flex-shrink-0',
          direction === 'horizontal' && alternativeLabel ? 'flex-col items-center text-center' : '',
          clickable && !item.disabled ? 'cursor-pointer' : '',
          item.disabled ? 'opacity-40 cursor-not-allowed' : '',
          type === 'navigation' ? 'step-navigation-item p-2 rounded-lg' : '',
          sizeClasses.spacing,
        ]"
        role="tab"
        :aria-selected="index === currentStep"
        :aria-disabled="item.disabled"
        tabindex="0"
        @click="handleStepClick(index)"
        @keydown.enter="handleStepClick(index)"
        @keydown.space.prevent="handleStepClick(index)"
      >
        <!-- Icon/Number container -->
        <div
          class="step-icon-container rounded-full flex flex-shrink-0 transition-colors duration-200 items-center justify-center"
          :class="[
            sizeClasses.icon,
            progressDot ? 'w-4 h-4 border-0' : '',
            type === 'dot' ? 'w-3 h-3 border-0' : '',
          ]"
          v-bind="getColorSystem(item.status).icon"
        >
          <!-- Custom icon -->
          <span
            v-if="item.icon && !progressDot && type !== 'dot'"
            :class="item.icon"
          />
          <!-- Number -->
          <span
            v-else-if="!progressDot && type !== 'dot'"
            class="font-medium"
          >
            {{ item.status === 'finish' ? '✓' : index + 1 }}
          </span>
        </div>

        <!-- Content -->
        <div
          v-if="type !== 'dot' && type !== 'simple'"
          class="step-content flex-1 min-w-0"
          :class="[
            direction === 'horizontal' && !alternativeLabel ? 'ml-4' : '',
            direction === 'vertical' ? 'ml-0 mt-3' : '',
            alternativeLabel && direction === 'horizontal' ? 'text-center mt-3' : '',
          ]"
        >
          <!-- Title -->
          <div
            class="step-title leading-tight transition-colors duration-200"
            :class="sizeClasses.title"
            v-bind="getColorSystem(item.status).title"
          >
            {{ item.title }}
          </div>

          <!-- Description -->
          <div
            v-if="showDescription && item.description"
            class="step-description text-surface-4 mt-1.5 transition-colors duration-200 dark:text-surface-3"
            :class="sizeClasses.description"
          >
            {{ item.description }}
          </div>
        </div>
      </div>

      <!-- Connector line -->
      <div
        v-if="index < items.length - 1 && type !== 'simple'"
        class="step-connector transition-colors duration-200"
        :class="[
          direction === 'horizontal'
            ? ['flex-1 mx-4 self-center', sizeClasses.connector, 'rounded-full']
            : ['ml-5 -mt-2 mb-2', sizeClasses.connector, 'min-h-6 rounded-full', 'w-0.5'],
        ]"
        v-bind="index < currentStep
          ? getColorSystem('finish').connector
          : getColorSystem('wait').connector"
      />
    </template>
  </div>
</template>
