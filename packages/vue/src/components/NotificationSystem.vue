<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useNotifications } from '..'

const props = withDefaults(defineProps<{
  position?: 'top-left' | 'top-right' | 'top' | 'bottom-left' | 'bottom-right' | 'bottom'
  gap?: number
  pt?: number
  pl?: number
  pr?: number
  pb?: number
}>(), {
  position: 'top-right',
  gap: 8,
  pt: 16,
  pl: 8,
  pr: 8,
  pb: 16,
})
const notifications = useNotifications()
const notificationRefs = ref<HTMLElement[]>([])
const notificationBounds = computed(() => notificationRefs.value.map(ref => ref.getBoundingClientRect()))
const notificationIndexList = computed(() => {
  let topLeft = 0
  let topRight = 0
  let top = 0
  let bottomLeft = 0
  let bottomRight = 0
  let bottom = 0
  const resp = []
  for (let i = 0; i < notificationBounds.value.length; i++) {
    const notification = notifications.value[i]
    if (!notification) {
      continue
    }
    if (!notification.position) {
      notification.position = props.position
    }
    if (notification.position === 'top-left') {
      resp.push(topLeft)
      topLeft += notificationBounds.value[i].height + props.gap
    }
    else if (notification.position === 'top-right') {
      resp.push(topRight)
      topRight += notificationBounds.value[i].height + props.gap
    }
    else if (notification.position === 'top') {
      resp.push(top)
      top += notificationBounds.value[i].height + props.gap
    }
    else if (notification.position === 'bottom-left') {
      resp.push(bottomLeft)
      bottomLeft += notificationBounds.value[i].height + props.gap
    }
    else if (notification.position === 'bottom-right') {
      resp.push(bottomRight)
      bottomRight += notificationBounds.value[i].height + props.gap
    }
    else if (notification.position === 'bottom') {
      resp.push(bottom)
      bottom += notificationBounds.value[i].height + props.gap
    }
  }
  return resp
})
function getNotificationPositionStyle(y: number, position: string | undefined) {
  if (!position) {
    position = props.position
  }
  if (position === 'top-left') {
    return {
      top: `${y + props.pt}px`,
      left: `${props.pl}px`,
    }
  }
  else if (position === 'top-right') {
    return {
      top: `${y + props.pt}px`,
      right: `${props.pr}px`,
    }
  }
  else if (position === 'top') {
    return {
      top: `${y + props.pt}px`,
      left: '50%',
      transform: 'translateX(-50%)',
    }
  }
  else if (position === 'bottom-left') {
    return {
      bottom: `${y + props.pb}px`,
      left: `${props.pl}px`,
    }
  }
  else if (position === 'bottom-right') {
    return {
      bottom: `${y + props.pb}px`,
      right: `${props.pr}px`,
    }
  }
  else if (position === 'bottom') {
    return {
      bottom: `${y + props.pb}px`,
      left: '50%',
      transform: 'translateX(-50%)',
    }
  }
}
const timeouts = ref<Record<string, NodeJS.Timeout>>({})
watchEffect(() => {
  // 如果通知列表变化，则检查所有通知是否需要自动关闭
  // durationMS 存在且大于 0 时，检查是否再 timeouts 中
  notifications.value.forEach((notification) => {
    if (notification.durationMS && notification.durationMS > 0) {
      if (timeouts.value[notification.hash]) {
        return
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
    class="pointer-events-none fixed z-20 h-full w-full children:pointer-events-auto"
  >
    <TransitionGroup
      enter-from-class="op0"
      enter-to-class="op100"
      leave-from-class="op100"
      leave-to-class="op0"
    >
      <div
        v-for="notification, i in notifications"
        :key="notification.hash"
        ref="notificationRefs"
        class="absolute transition-top,bottom,opacity"
        :style="getNotificationPositionStyle(notificationIndexList[i], notification.position)"
      >
        <Notification
          closeable with-border
          :title="notification.title"
          :message="notification.message"
          :icon="notification.icon"
          :loading="notification.loading"
          :color="notification.color"
          @close="notifications.splice(notifications.indexOf(notification), 1)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>
