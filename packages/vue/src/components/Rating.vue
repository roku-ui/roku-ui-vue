<script setup lang="ts">
// Rating 组件颜色系统重构：
// 1. 统一使用 useCS / 主题色，与其它组件一致（参考 Step / TabItem 等）。
// 2. 支持单色 (主题色|hex) 与 多色数组（每个星单独的颜色）。
// 3. active / inactive / hover 三态：
//    - inactive: surface 文本弱化 (index { dark:6, light:3 }) 对齐 Step 的 wait / muted 层级。
//    - active:   选中或范围内使用主色文本 index { dark:5, light:4 }。
//    - hover(仅在 highlightSelectedOnly 时突出当前星): 使用 hover:text 派生。
// 4. highlightSelectedOnly = true 时仅高亮当前 hover / 已选星；否则高亮 <= 当前值的全部星。
// 5. 保持向后兼容：color 允许 string | string[]；默认使用主题 warning 色（如果用户未传则 fallback）。

import type { Color, Size } from '@/types'
import { computed, ref } from 'vue'
import { useCS, useTheme } from '@/shared'

type IconSingle = string | { active: string, normal: string }
type IconType = IconSingle | IconSingle[] | undefined

const props = withDefaults(defineProps<{
  count?: number
  icons?: IconType
  color?: (Color | string) | (Color | string)[]
  highlightSelectedOnly?: boolean
  unselectable?: boolean
  size?: Size
  allowHalf?: boolean
}>(), {
  count: 5,
  color: 'warning', // 主题色（黄金色系），替代硬编码 #ffeb91
  highlightSelectedOnly: false,
  unselectable: false,
  allowHalf: false,
})

const emit = defineEmits<{ select: [number] }>()

// model 值：选中的星数量
const model = defineModel<number>({ default: 0 })

const theme = useTheme()

// ============== 图标处理 ==============
const DEFAULT_ICON = 'i-fluent-star-12-filled'
const DEFAULT_ACTIVE_ICON = 'i-fluent-star-12-filled'

function toPair(v: IconSingle | undefined): { active: string, normal: string } {
  if (!v) {
    return { active: DEFAULT_ACTIVE_ICON, normal: DEFAULT_ICON }
  }
  if (typeof v === 'string') {
    return { active: v, normal: v }
  }
  return {
    active: v.active || DEFAULT_ACTIVE_ICON,
    normal: v.normal || DEFAULT_ICON,
  }
}
function normalizeIcons(input: IconType, n: number): { active: string, normal: string }[] {
  if (!input) {
    return Array.from({ length: n }, () => ({ active: DEFAULT_ACTIVE_ICON, normal: DEFAULT_ICON }))
  }
  if (Array.isArray(input)) {
    if (input.length === 1) {
      const p = toPair(input[0])
      return Array.from({ length: n }, () => ({ ...p }))
    }
    const arr = input.slice(0, n).map(item => toPair(item))
    while (arr.length < n) arr.push({ active: DEFAULT_ACTIVE_ICON, normal: DEFAULT_ICON })
    return arr
  }
  const base = toPair(input)
  return Array.from({ length: n }, () => ({ ...base }))
}

const iconPairs = computed(() => normalizeIcons(props.icons, props.count))

// ============== 颜色系统 ==============
// 用户可传：单色 (string) 或 数组。数组长度不足会复用第一项。
const activeColorList = computed<(Color | string)[]>(() => {
  const c = props.color
  if (Array.isArray(c)) {
    if (c.length === 0) {
      return Array.from({ length: props.count }, () => 'warning')
    }
    if (c.length === 1) {
      return Array.from({ length: props.count }, () => c[0]!)
    }
    // 扩展 / 截断至 count
    const arr = c.slice(0, props.count)
    while (arr.length < props.count) arr.push(c[0]!)
    return arr
  }
  const base = c || 'warning'
  return Array.from({ length: props.count }, () => base)
})

// 统一 inactive / active / hover 三种 CS：
// inactive: surface text 弱化
const inactiveTextCS = useCS({
  color: 'surface',
  type: 'text',
  index: { dark: 6, light: 3 },
})

// active（每颗星可能不同颜色）
const activeTextCSList = activeColorList.value.map(color => useCS({
  color: color as any,
  type: 'text',
  index: { dark: 5, light: 4 },
}))

// hover 文本（用于 highlightSelectedOnly 模式单星悬停）
const hoverTextCSList = activeColorList.value.map(color => useCS({
  color: color as any,
  type: 'hover:text',
  index: { dark: 5, light: 4 },
}))

// ============== 行为逻辑 ==============
const highlightSelectedOnly = computed(() => props.highlightSelectedOnly)
const unselectable = computed(() => props.unselectable)
const allowHalf = computed(() => props.allowHalf)
// hoverValue: null 表示没有 hover；其它为当前预览值（可能是 n 或 n+0.5）
const hoverValue = ref<number | null>(null)

// 当前展示用的值（优先 hover）
const displayValue = computed(() => hoverValue.value ?? model.value)

function starState(idx: number): 'full' | 'half' | 'empty' {
  const val = displayValue.value
  if (highlightSelectedOnly.value) {
    // 只突出当前所在的那颗星
    if (val === 0) {
      return 'empty'
    }
    if (val > idx && val <= idx + 1) {
      if (allowHalf.value && val < idx + 1 && val >= idx + 0.5) {
        return 'half'
      }
      if (val >= idx + 1) {
        return 'full'
      }
      // val 在 (idx, idx+0.5) 之间（理论上不会出现，因为我们只产生 .5 增量）
      if (allowHalf.value && val >= idx + 0.5) {
        return 'half'
      }
      return 'full'
    }
    return 'empty'
  }
  // 普通模式：递进高亮
  if (val >= idx + 1) {
    return 'full'
  }
  if (allowHalf.value && val >= idx + 0.5) {
    return 'half'
  }
  return 'empty'
}

function isFull(idx: number) {
  return starState(idx) === 'full'
}
function isHalf(idx: number) {
  return starState(idx) === 'half'
}

function getInactiveIcon(idx: number) {
  const pair = iconPairs.value[idx]
  return pair?.normal || DEFAULT_ICON
}
function getActiveIcon(idx: number) {
  const pair = iconPairs.value[idx]
  return pair?.active || DEFAULT_ACTIVE_ICON
}

function getActiveCS(idx: number) {
  return activeTextCSList[idx]?.value || inactiveTextCS.value
}
function getHoverCS(idx: number) {
  if (!highlightSelectedOnly.value) {
    return
  }
  return hoverTextCSList[idx]?.value
}
function onPointerMove(e: PointerEvent, i: number) {
  if (!allowHalf.value) {
    hoverValue.value = i + 1
    return
  }
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const half = x < rect.width / 2
  hoverValue.value = i + (half ? 0.5 : 1)
}
function onMouseLeave() {
  hoverValue.value = null
}
function onPointerDown(i: number, e: PointerEvent) {
  // 先根据当前 hoverValue / 点击位置确定值
  let val: number
  if (allowHalf.value) {
    if (hoverValue.value === null) {
      // pointerdown 早于 move 时临时计算
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      const x = e.clientX - rect.left
      val = i + (x < rect.width / 2 ? 0.5 : 1)
    }
    else {
      val = hoverValue.value
    }
  }
  else {
    val = i + 1
  }
  if (unselectable.value && model.value === val) {
    model.value = 0
    emit('select', 0)
  }
  else {
    model.value = val
    emit('select', val)
  }
}

// ============== 尺寸 ==============
const sizeCls = computed(() => {
  const sz = props.size ?? theme.value.defaultSize ?? 'md'
  switch (sz) {
    case 'sm': {
      return 'text-xs'
    }
    case 'lg': {
      return 'text-lg'
    }
    default: {
      return 'text-base'
    }
  }
})
</script>

<template>
  <div
    class="flex cursor-pointer select-none"
    :class="sizeCls"
  >
    <div
      v-for="(_, i) in props.count"
      :key="i"
      class="pr-1 inline-flex relative"
      @pointermove="onPointerMove($event, i)"
      @mouseleave="onMouseLeave"
      @pointerdown="onPointerDown(i, $event)"
    >
      <!-- FULL STAR -->
      <i
        v-if="isFull(i)"
        class="transition-colors duration-150 active:translate-y-1px"
        :class="[
          getActiveCS(i).class,
          (highlightSelectedOnly && getHoverCS(i)) ? getHoverCS(i)?.class : '',
          getActiveIcon(i),
        ]"
        :style="[getActiveCS(i).style, (highlightSelectedOnly && getHoverCS(i)) ? getHoverCS(i)?.style : {}]"
      />
      <!-- HALF STAR -->
      <template v-else-if="isHalf(i)">
        <i
          class="transition-colors duration-150 active:translate-y-1px"
          :class="[inactiveTextCS.class, getInactiveIcon(i)]"
          :style="[inactiveTextCS.style]"
        />
        <!-- 覆盖激活星，仅左半显示（clip-path 隐藏右半） -->
        <i
          class="transition-colors duration-150 left-0 top-0 absolute"
          :class="[
            getActiveCS(i).class,
            (highlightSelectedOnly && getHoverCS(i)) ? getHoverCS(i)?.class : '',
            getActiveIcon(i),
          ]"
          :style="[
            getActiveCS(i).style,
            (highlightSelectedOnly && getHoverCS(i)) ? getHoverCS(i)?.style : {},
            { clipPath: 'inset(0 50% 0 0)' },
          ]"
        />
      </template>
      <!-- EMPTY STAR -->
      <i
        v-else
        class="transition-colors duration-150 active:translate-y-1px"
        :class="[inactiveTextCS.class, getInactiveIcon(i)]"
        :style="[inactiveTextCS.style]"
      />
    </div>
  </div>
</template>
