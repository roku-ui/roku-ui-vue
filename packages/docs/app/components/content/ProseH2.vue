<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => {
  if (!headings || !props.id) {
    return false
  }
  const anchorLinks = headings.anchorLinks
  if (anchorLinks === true) {
    return props.id
  }
  if (anchorLinks && typeof anchorLinks === 'object') {
    return anchorLinks.h2 ? props.id : false
  }
  return false
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
