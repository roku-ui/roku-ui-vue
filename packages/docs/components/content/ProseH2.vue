<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => {
  if (!headings) {
    return false
  }
  if (!headings.anchorLinks) {
    return false
  }
  if (headings.anchorLinks.h2 === true) {
    return props.id
  }
  return props.id && headings.anchorLinks.h2
})
</script>

<template>
  <h2 :id="id">
    <a
      v-if="id && generate"
      class="font-bold decoration-none"
      :href="`#${id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
