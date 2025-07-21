import { useCS } from '@roku-ui/vue'

export const subTextCS = useCS({
  color: 'surface',
  type: 'text',
  index: { dark: 4, light: 5 },
})

export const surfaceBorderCS = useCS({
  color: 'surface',
  type: 'border',
  index: { dark: 7, light: 4 },
})

export const surfaceCS = useCS({
  color: 'surface',
  type: 'bg',
  index: { dark: 9, light: 1 },
})
