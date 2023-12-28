export function useRounded(props: { rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number }) {
  return computed(() => {
    const style = getRoundedStyle(props.rounded)
    return { style, class: 'rounded-[var(--r-rounded)]' }
  },
  )
}

function getRoundedStyle(rounded: 'none' | 'sm' | 'md' | 'lg' | 'full' | string | number) {
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
      if (typeof rounded === 'number' || !Number.isNaN(Number(rounded))) {
        return `--r-rounded: ${rounded}rem;`
      }
      return 'rounded-[var(--r-rounded)]'
  }
}
