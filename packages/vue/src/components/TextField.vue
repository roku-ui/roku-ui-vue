<script setup lang="ts">
defineProps<{
  modelValue?: string | number
  onChange?: (value: string) => void
}>()

defineEmits(['change', 'update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    class="border-border-1 bg-back-2 border rounded px-2 py-1 outline-none"
    @input="$emit('update:modelValue', ($event.target as any)?.value ?? '')"
  >
</template>
