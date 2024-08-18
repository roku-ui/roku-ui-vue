import type { MaybeComputedElementRef } from '@vueuse/core'
import { tryOnMounted, unrefElement, useMutationObserver, useResizeObserver } from '@vueuse/core'
import { computed, ref } from 'vue'

export function useScrollHeight(target: MaybeComputedElementRef) {
  const scrollHeight = ref(0)
  const el = computed(() => unrefElement(target))
  const update = () => {
    if (el.value) {
      scrollHeight.value = el.value.scrollHeight
    }
  }

  update()
  tryOnMounted(update)
  useResizeObserver(() => el.value, update)
  useMutationObserver(() => el.value, update, {
    childList: true,
    subtree: true,
    attributes: true,
  })
  return scrollHeight
}

export function useClientHeight(target: MaybeComputedElementRef, options: {
  initialWidth?: number
  initialHeight?: number
  listenOrientation?: boolean
} = {}) {
  const {
    initialWidth = Number.POSITIVE_INFINITY,
    listenOrientation = true,
  } = options

  const clientHeight = ref(initialWidth)
  const el = computed(() => unrefElement(target))
  const update = () => {
    if (el.value) {
      clientHeight.value = el.value.clientHeight
    }
  }

  update()
  tryOnMounted(update)
  useEventListener('resize', update, { passive: true })
  useResizeObserver(() => el.value, update)
  useMutationObserver(() => el.value, update, {
    childList: true,
    subtree: true,
    attributes: true,
  })
  if (listenOrientation) {
    const matches = useMediaQuery('(orientation: portrait)')
    watch(matches, () => update())
  }

  return clientHeight
}
