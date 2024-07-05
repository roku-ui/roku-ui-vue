<script setup lang="ts">
const props = withDefaults(defineProps<{
  timeout?: number
}>(), {
  timeout: 1000,
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
      class="absolute z-10"
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
