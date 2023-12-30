<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate'
import { useNotifications } from '..'

const notifications = useNotifications()
</script>

<template>
  <div
    v-auto-animate
    class="fixed z-20 flex flex-col gap-2 p-2"
  >
    <Notification
      v-for="notification in notifications"
      :key="notification.hash"

      closeable
      with-border
      :title="notification.title"
      :message="notification.message"
      :icon="notification.icon"
      :loading="notification.loading"
      :color="notification.color"
      @close="notifications.splice(notifications.indexOf(notification), 1)"
    />
  </div>
</template>
