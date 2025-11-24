<script setup lang="ts">
import { Avatar } from '@roku-ui/vue'
import { computed } from 'vue'

const code = computed(() => `<template>
  <div class="flex flex-wrap items-center gap-3">
    <Avatar name="Full" />
    <Avatar name="Rounded" rounded="lg" />
    <Avatar name="Square" rounded="none" />
    <Avatar
      name="Notch"
      size="lg"
      corner-shape="notch"
    />
    <Avatar
      name="Squircle"
      size="lg"
      corner-shape="squircle"
    />
  </div>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-wrap gap-3 items-center">
        <Avatar name="Full" />
        <Avatar
          name="Rounded"
          rounded="lg"
        />
        <Avatar
          name="Square"
          rounded="none"
        />
        <Avatar
          name="Notch"
          size="lg"
          corner-shape="notch"
        />
        <Avatar
          name="Squircle"
          size="lg"
          corner-shape="squircle"
        />
      </div>
    </template>
  </Demo>
</template>
