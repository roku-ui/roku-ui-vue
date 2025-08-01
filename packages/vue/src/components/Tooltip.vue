<script setup lang="ts">
import { useDebounce, useElementHover, useMouse } from '@vueuse/core'
import { ref, watch } from 'vue'
import { Paper } from '@/components'

const props = withDefaults(defineProps<{
  timeout?: number
}>(), {
  timeout: 200,
})
const mouse = useMouse()
const hoverableRef = ref<HTMLElement | null>(null)
const isHovered = useElementHover(hoverableRef)
const isHoverdDebounced = useDebounce(isHovered, props.timeout)
const currentX = ref(0)
const currentY = ref(0)
const tooltipRef = ref<HTMLElement | null>(null)
const isHoveredTooltip = useElementHover(tooltipRef)
watch(isHoverdDebounced, (val, old) => {
  if (isHoverdDebounced.value && val !== old) {
    currentX.value = mouse.x.value
    currentY.value = mouse.y.value
  }
})
</script>

<template>
  <div>
    <div ref="hoverableRef">
      <slot />
    </div>
    <div
      v-if="currentX && currentY && (isHoverdDebounced || isHoveredTooltip)"
      ref="tooltipRef"
      class="w-max absolute z-10"
      :style="{
        left: `${currentX + 20}px`,
        top: `${currentY + 20}px`,
      }"
    >
      <Paper with-border>
        <slot
          name="content"
        />
      </Paper>
    </div>
  </div>
</template>
