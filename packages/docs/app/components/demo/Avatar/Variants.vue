<script setup lang="ts">
import { Avatar } from '@roku-ui/vue'
import { computed } from 'vue'

const code = computed(() => `<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-3">
      <Avatar name="Default" />
      <Avatar name="Primary" variant="filled" color="primary" />
      <Avatar name="Secondary" variant="light" color="secondary" />
    </div>
    <div class="flex flex-wrap gap-3">
      <Avatar name="Outline" variant="outline" color="tertiary" />
      <Avatar name="Inverted" variant="inverted" color="success" />
      <Avatar name="Warning" variant="filled" color="warning" />
    </div>
  </div>
</template>`)
</script>

<template>
  <Demo :code="code">
    <template #preview>
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-3">
          <Avatar name="Default" />
          <Avatar
            name="Primary"
            variant="filled"
            color="primary"
          />
          <Avatar
            name="Secondary"
            variant="light"
            color="secondary"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <Avatar
            name="Outline"
            variant="outline"
            color="tertiary"
          />
          <Avatar
            name="Inverted"
            variant="inverted"
            color="success"
          />
          <Avatar
            name="Warning"
            variant="filled"
            color="warning"
          />
        </div>
      </div>
    </template>
  </Demo>
</template>
