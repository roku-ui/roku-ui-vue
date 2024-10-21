import { computed } from 'vue'

export function useRounded(props: { rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number }) {
  return computed(() => {
    const style = getRoundedStyle(props.rounded)
    return { style, class: 'rounded-[--r-rounded]' }
  },
  )
}

function getRoundedStyle(rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number) {
  const regex = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|em|rem|vh|vw|in|cm|mm|pt|pc|%)?$/
  switch (rounded) {
    case 'none':
      return '--r-rounded: 0'
    case 'sm':
      return '--r-rounded: 0.125rem'
    case 'md':
      return '--r-rounded: 0.25rem'
    case 'lg':
      return '--r-rounded: 0.5rem'
    case 'full':
      return '--r-rounded: 9999px'
    default:
      if (typeof rounded === 'string' && regex.test(rounded)) {
        return `--r-rounded: ${rounded};`
      }
      if (typeof rounded === 'number' || !Number.isNaN(Number(rounded))) {
        return `--r-rounded: ${rounded}rem;`
      }
      return 'rounded-[--r-rounded]'
  }
}
