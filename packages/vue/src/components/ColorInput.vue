<script setup lang="ts">
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
      type="color"
      class="pointer-events-none absolute opacity-0"
    >
    <label
      :for="id"
    >
      <ColorSwatch
        class="cursor-pointer"
        :color="model ?? '#222'"
      />
    </label>
  </div>
</template>
