<script setup lang="ts">
import { Notification } from '@roku-ui/vue'

defineProps<{
  message: string
}>()
</script>

<template>
  <Notification
    class="prose-md my-4"
    title="警告"
    icon="i-tabler-alert-triangle"
    color="tertiary"
    rounded="0.75rem"
    :message="message"
    with-border
    block
  />
</template>
