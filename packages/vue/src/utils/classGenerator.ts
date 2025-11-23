import type { CornerShape, Rounded } from '@/types'
import { computed } from 'vue'

export function useRounded(props: { rounded: Rounded, cornerShape?: CornerShape }) {
  return computed(() => {
    const roundedStyle = getRoundedStyle(props.rounded)
    const cornerShapeStyle = getCornerShapeStyle(props.cornerShape)
    const hasCornerShape = cornerShapeStyle !== ''
    const style = hasCornerShape ? `${roundedStyle} ${cornerShapeStyle}`.trim() : roundedStyle
    const cls = hasCornerShape
      ? 'rounded-[--r-rounded] [corner-shape:var(--r-corner-shape)]'
      : 'rounded-[--r-rounded]'
    return { style, class: cls }
  })
}

function getRoundedStyle(rounded: Rounded) {
  const regex = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|em|rem|vh|vw|in|cm|mm|pt|pc|%)?$/
  switch (rounded) {
    case 'none': {
      return '--r-rounded: 0;'
    }
    case 'sm': {
      return '--r-rounded: 0.125rem;'
    }
    case 'md': {
      return '--r-rounded: 0.25rem;'
    }
    case 'lg': {
      return '--r-rounded: 0.5rem;'
    }
    case 'full': {
      return '--r-rounded: 9999px;'
    }
    default: {
      if (typeof rounded === 'string' && regex.test(rounded)) {
        return `--r-rounded: ${rounded};`
      }
      if (typeof rounded === 'number' || !Number.isNaN(Number(rounded))) {
        const value = typeof rounded === 'number' ? rounded : Number(rounded)
        return `--r-rounded: ${value}rem;`
      }
      return '--r-rounded: 0.25rem;'
    }
  }
}

function getCornerShapeStyle(cornerShape?: CornerShape) {
  if (cornerShape === undefined || cornerShape === null || cornerShape === '') {
    return ''
  }
  return `--r-corner-shape: ${cornerShape};`
}
