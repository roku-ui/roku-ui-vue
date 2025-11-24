<script setup lang="ts">
import type { Color, IconSource, Rounded } from '@/types'
import { onKeyStroke } from '@vueuse/core'
import { computed, provide, ref } from 'vue'
import { COLOR_BG, SURFACE_BG, useContainerFilledCS, useCS, useMergedCS, useSurfaceCS, useTheme } from '@/shared'
import { useRounded } from '@/utils/classGenerator'

interface StatusStyleBundle {
  icon: { style: Record<string, string>, class: string[] | string }
  title: { style: Record<string, string>, class: string[] | string }
  connector: { style: Record<string, string>, class: string[] | string }
}

type StatusStyleKey = 'finish' | 'process' | 'error' | 'wait'

export interface StepItem {
  title: string
  description?: string
  icon?: IconSource
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
  iconRounded?: Rounded
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
  iconRounded: 'none',
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

const isVertical = computed(() => props.direction === 'vertical')
const isHorizontal = computed(() => !isVertical.value)

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

function isFocusWithinStep(): boolean {
  return Boolean(stepRef.value?.contains(document.activeElement))
}

function switchTo(index: number, reason: 'click' | 'keyboard') {
  const target = processedItems.value[index]
  if (!target || target.disabled) {
    return
  }
  if (reason === 'click' && !props.clickable) {
    return
  }
  if (props.linear && index > currentStep.value + 1) {
    return
  }
  if (index === currentStep.value) {
    return
  }
  currentStep.value = index
  if (reason === 'click') {
    emit('click', index)
  }
}

// Handle step click
function handleStepClick(index: number) {
  switchTo(index, 'click')
}

// Keyboard navigation
const navigationConfigs: Array<{
  key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'
  allowed: () => boolean
  target: () => number
}> = [
  {
    key: 'ArrowLeft',
    allowed: () => isHorizontal.value && currentStep.value > 0,
    target: () => currentStep.value - 1,
  },
  {
    key: 'ArrowRight',
    allowed: () => isHorizontal.value && currentStep.value < props.items.length - 1,
    target: () => currentStep.value + 1,
  },
  {
    key: 'ArrowUp',
    allowed: () => isVertical.value && currentStep.value > 0,
    target: () => currentStep.value - 1,
  },
  {
    key: 'ArrowDown',
    allowed: () => isVertical.value && currentStep.value < props.items.length - 1,
    target: () => currentStep.value + 1,
  },
]

for (const { key, allowed, target } of navigationConfigs) {
  onKeyStroke(key, (event) => {
    if (!isFocusWithinStep() || !allowed()) {
      return
    }
    event.preventDefault()
    switchTo(target(), 'keyboard')
  })
}

// Container classes
const containerClasses = computed(() => {
  const base = 'step-container'
  const direction = isVertical.value ? 'flex-col' : 'flex-row items-center'
  const type = props.type === 'navigation' ? 'step-navigation' : ''

  return [base, direction, type, 'flex'].filter(Boolean)
})

// Size classes
const sizePresets = {
  sm: {
    icon: 'h-6 w-6 text-xs',
    title: 'text-sm font-semibold',
    description: 'text-xs leading-relaxed',
    spacing: {
      horizontal: 'gap-1.5',
      vertical: 'gap-1.5',
    },
    connector: {
      horizontal: 'h-0.5',
      vertical: 'w-0.5',
    },
    connectorX: 'mx-2',
    connectorOffsetV: 'ml-3',
  },
  md: {
    icon: 'h-7 w-7 text-sm',
    title: 'text-base font-semibold',
    description: 'text-sm leading-relaxed',
    spacing: {
      horizontal: 'gap-1.5',
      vertical: 'gap-2',
    },
    connector: {
      horizontal: 'h-0.5',
      vertical: 'w-0.5',
    },
    connectorX: 'mx-2.5',
    connectorOffsetV: 'ml-3.5',
  },
  lg: {
    icon: 'h-8 w-8 text-base',
    title: 'text-lg font-semibold',
    description: 'text-base leading-relaxed',
    spacing: {
      horizontal: 'gap-2',
      vertical: 'gap-2.5',
    },
    connector: {
      horizontal: 'h-0.5',
      vertical: 'w-0.5',
    },
    connectorX: 'mx-3',
    connectorOffsetV: 'ml-4',
  },
} as const

const sizeClasses = computed(() => {
  const sizeKey = effectiveProps.value.size ?? 'md'
  const preset = sizePresets[sizeKey]
  return {
    icon: preset.icon,
    title: preset.title,
    description: preset.description,
    spacing: isHorizontal.value ? preset.spacing.horizontal : preset.spacing.vertical,
    connector: isHorizontal.value ? preset.connector.horizontal : preset.connector.vertical,
    connectorX: preset.connectorX,
    connectorOffsetV: preset.connectorOffsetV,
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

const finishIconCombinedCS = useMergedCS([finishIconCS], ['shadow-sm'])
const processIconBgCS = useCS({
  color: computed(() => effectiveProps.value.color),
  type: 'bg',
  index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
  alpha: { dark: 0.2, light: 0.1 },
})
const processIconCombinedCS = useMergedCS([processIconCS, processIconBgCS], ['border-2'])
const waitIconBgCS = useCS({
  color: 'surface',
  type: 'bg',
  index: { dark: SURFACE_BG.container.dark, light: SURFACE_BG.container.light },
  alpha: { dark: 0.2, light: 0.12 },
})
const waitIconCombinedCS = useMergedCS([waitIconCS, waitIconBgCS], ['border-2'])
const errorIconBgCS = useCS({
  color: 'error',
  type: 'bg',
  index: { dark: COLOR_BG.solid.dark, light: COLOR_BG.solid.light },
  alpha: { dark: 0.2, light: 0.1 },
})
const errorIconCombinedCS = useMergedCS([errorIconCS, errorIconBgCS], ['border-2'])

// Progress bar color system
const progressBarCS = useCS({
  color: computed(() => effectiveProps.value.color),
  type: 'bg',
  index: { dark: 5, light: 4 },
})
const progressTrackCS = useSurfaceCS('bg', { dark: 6, light: 3 })
const progressMetaTextCS = useSurfaceCS('text', { dark: 3, light: 2 })
const progressTitleTextCS = useSurfaceCS('text', { dark: 2, light: 1 })
const descriptionTextCS = useSurfaceCS('text', { dark: 3, light: 4 })

const iconRounded = computed(() => {
  return useRounded({
    rounded: props.iconRounded ?? theme.value.rounded,
  }).value
})

const isDotStyle = computed(() => props.progressDot || props.type === 'dot')

const iconShape = computed(() => {
  if (isDotStyle.value) {
    return {
      class: 'rounded-full',
      style: {},
    }
  }
  return iconRounded.value
})

const iconShapeClass = computed(() => {
  const raw = iconShape.value.class
  if (!raw) {
    return []
  }
  return Array.isArray(raw) ? raw : [raw]
})

const iconShapeStyle = computed(() => iconShape.value.style || {})

function normalizeClass(entry: string | string[] | undefined): string[] {
  if (!entry) {
    return []
  }
  return Array.isArray(entry) ? entry : [entry]
}

function normalizeStyle(entry: Record<string, string> | undefined): Record<string, string> {
  return entry ?? {}
}

const statusStylesLookup = computed<Record<StatusStyleKey, StatusStyleBundle>>(() => ({
  finish: {
    icon: finishIconCombinedCS.value,
    title: finishTextCS.value,
    connector: finishConnectorCS.value,
  },
  process: {
    icon: processIconCombinedCS.value,
    title: processTextCS.value,
    connector: waitConnectorCS.value,
  },
  error: {
    icon: errorIconCombinedCS.value,
    title: errorTextCS.value,
    connector: waitConnectorCS.value,
  },
  wait: {
    icon: waitIconCombinedCS.value,
    title: waitTextCS.value,
    connector: waitConnectorCS.value,
  },
}))

function resolveStatusStyles(status: StepItem['status'] = 'wait'): StatusStyleBundle {
  return statusStylesLookup.value[status]
}

const styledItems = computed(() => {
  return processedItems.value.map((item) => {
    const styles = resolveStatusStyles(item.status)
    return {
      ...item,
      styles,
      iconClassList: normalizeClass(styles.icon.class),
      iconStyle: normalizeStyle(styles.icon.style),
    }
  })
})

const connectorStyles = computed(() => ({
  active: statusStylesLookup.value.finish.connector,
  idle: statusStylesLookup.value.wait.connector,
}))

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
      class="mb-4 w-full"
    >
      <div
        class="text-sm mb-2 flex items-center justify-between"
        v-bind="progressMetaTextCS"
      >
        <span class="font-medium">Step {{ currentStep + 1 }} of {{ items.length }}</span>
        <span class="font-semibold">{{ Math.round(progressPercent) }}%</span>
      </div>
      <div
        class="rounded-full h-2 w-full"
        v-bind="progressTrackCS"
      >
        <div
          class="rounded-full h-full"
          v-bind="progressBarCS"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
      <div
        class="text-sm font-medium mt-2"
        v-bind="progressTitleTextCS"
      >
        {{ styledItems[currentStep]?.title }}
      </div>
    </div>

    <!-- Steps -->
    <template
      v-for="(item, index) in styledItems"
      :key="item.index"
    >
      <!-- Step item -->
      <div
        class="step-item flex relative"
        :class="[
          direction === 'vertical' ? 'items-start mb-4 last:mb-0' : 'items-center flex-shrink-0',
          direction === 'horizontal' && alternativeLabel ? 'flex-col items-center text-center' : '',
          clickable && !item.disabled ? 'cursor-pointer' : '',
          item.disabled ? 'opacity-40 cursor-not-allowed' : '',
          type === 'navigation' ? 'step-navigation-item px-1 py-0.5 rounded-md' : '',
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
          class="step-icon-container flex flex-shrink-0 items-center justify-center relative overflow-hidden"
          :class="[
            sizeClasses.icon,
            ...iconShapeClass,
            progressDot ? 'w-4 h-4 border-0' : '',
            type === 'dot' ? 'w-3 h-3 border-0' : '',
            ...item.iconClassList,
          ]"
          :style="[iconShapeStyle, item.iconStyle]"
        >
          <!-- Custom icon -->
          <component
            :is="typeof item.icon === 'string' ? 'span' : item.icon"
            v-if="item.icon && !progressDot && type !== 'dot'"
            :class="typeof item.icon === 'string' ? item.icon : ''"
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
          class="step-content flex flex-1 flex-col min-w-0"
          :class="[
            direction === 'horizontal' && !alternativeLabel ? 'ml-3 md:ml-4 justify-center' : '',
            direction === 'vertical' ? 'mt-2 justify-start' : '',
            alternativeLabel && direction === 'horizontal' ? 'text-center mt-2.5 justify-start' : '',
          ]"
        >
          <!-- Title -->
          <div
            class="step-title leading-tight"
            :class="sizeClasses.title"
            v-bind="item.styles.title"
          >
            {{ item.title }}
          </div>

          <!-- Description -->
          <div
            v-if="showDescription && item.description"
            class="step-description mt-1.5"
            v-bind="descriptionTextCS"
            :class="sizeClasses.description"
          >
            {{ item.description }}
          </div>
        </div>
      </div>

      <!-- Connector line -->
      <div
        v-if="index < items.length - 1 && type !== 'simple'"
        class="step-connector"
        :class="[
          direction === 'horizontal'
            ? ['flex-1', sizeClasses.connectorX, 'self-center', sizeClasses.connector, 'rounded-full']
            : [sizeClasses.connectorOffsetV, '-mt-1 mb-1.5', sizeClasses.connector, 'min-h-4 rounded'],
        ]"
        v-bind="index < currentStep
          ? connectorStyles.active
          : connectorStyles.idle"
      />
    </template>
  </div>
</template>
