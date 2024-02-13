<script setup lang="ts">
defineProps<{
  label?: string
}>()
const model = defineModel<string>()
const attrs = useAttrs()
const id = useId(attrs)
const input = ref<HTMLInputElement | null>(null)
</script>

<template>
  <div>
    <input
      :id="id"
      ref="input"
      v-model="model"
      :alt="model"
      type="color"
      class="pointer-events-none absolute opacity-0"
    >
    <label
      class="flex items-center gap-2"
      :for="id"
    >
      <ColorSwatch
        class="cursor-pointer"
        :color="model ?? '#222'"
      />
      <span v-if="label">
        {{ label }}
      </span>
    </label>
  </div>
</template>
