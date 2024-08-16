<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate'
import { useNotifications } from '..'

const notifications = useNotifications()
const timeouts = ref<Record<string, NodeJS.Timeout>>({})
watchEffect(() => {
  // 如果通知列表变化，则检查所有通知是否需要自动关闭
  // durationMS 存在且大于 0 时，检查是否再 timeouts 中
  notifications.value.forEach((notification) => {
    if (notification.durationMS && notification.durationMS > 0) {
      if (timeouts.value[notification.hash]) {
        clearTimeout(timeouts.value[notification.hash])
      }
      timeouts.value[notification.hash] = setTimeout(() => {
        notifications.value.splice(notifications.value.indexOf(notification), 1)
      }, notification.durationMS)
    }
  })
})
</script>

<template>
  <div
    v-auto-animate
    class="fixed z-20 flex flex-col gap-2 p-2"
  >
    <Notification
      v-for="notification in notifications"
      :key="notification.hash"
      with-border
      closeable
      :title="notification.title"
      :message="notification.message"
      :icon="notification.icon"
      :loading="notification.loading"
      :color="notification.color"
      @close="notifications.splice(notifications.indexOf(notification), 1)"
    />
  </div>
</template>
