<script setup lang="ts">
const mouse = useMouse()
const hoverableRef = ref<HTMLElement | null>(null)
const isHovered = useElementHover(hoverableRef)
const currentX = ref(0)
const currentY = ref(0)
watch(isHovered, (val, old) => {
  if (isHovered.value && val !== old) {
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
      v-if="currentX && currentY && isHovered"
      class="absolute z-10"
      :style="{
        left: `${currentX + 20}px`,
        top: `${currentY + 20}px`,
      }"
    >
      <slot
        name="content"
      />
    </div>
  </div>
</template>
