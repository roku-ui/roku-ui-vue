<script setup lang="ts">
import type { NotificationData } from '@/utils/notifications'
import type { Ref } from 'vue'
import { useNotifications } from '@/utils/notifications'
import { useElementHover } from '@vueuse/core'
import { computed, ref, shallowRef, watch, watchEffect } from 'vue'

const props = withDefaults(defineProps<{
  position?: 'top-left' | 'top-right' | 'top' | 'bottom-left' | 'bottom-right' | 'bottom'
  progress?: boolean
  topN?: number
  gap?: number
  pt?: number
  pl?: number
  pr?: number
  pb?: number
}>(), {
  position: 'top-right',
  progress: true,
  topN: 1,
  gap: 8,
  pt: 8,
  pl: 8,
  pr: 8,
  pb: 8,
})
const notifications = useNotifications(props.topN)
const notificationRefs = ref<HTMLElement[]>([])
const notificationBounds = computed(() => notificationRefs.value.map(ref => ref.getBoundingClientRect()))
const allNotifications = useNotifications()
const hoverRecord = shallowRef<Record<string, Ref<boolean>>>({})

watch([notificationRefs.value], () => {
  for (const ref of notificationRefs.value) {
    const hash = ref.dataset.hash
    if (!hash) {
      continue
    }
    if (!hoverRecord.value[hash]) {
      const h = useElementHover(ref, {})
      hoverRecord.value[hash] = h
    }
  }
})

if (props.progress) {
  useRafFn(({ delta }) => {
    allNotifications.value = allNotifications.value.map((d) => {
      if (hoverRecord.value[d.hash] && hoverRecord.value[d.hash].value) {
        return d
      }
      if (!notifications.value.includes(d)) {
        return d
      }
      return { ...d, durationMS: d.durationMS - delta }
    }).filter((d) => {
      return d.durationMS > 0
    })
  }, {})
}

const notificationIndexList = computed(() => {
  const positions = {
    'top-left': 0,
    'top-right': 0,
    'top': 0,
    'bottom-left': 0,
    'bottom-right': 0,
    'bottom': 0,
  }
  return notifications.value.map((notification, i) => {
    const position = notification.position || props.position
    const offset = positions[position]
    if (notificationBounds.value[i]) {
      positions[position] += notificationBounds.value[i].height + props.gap
    }
    return offset
  })
})

function getNotificationPositionStyle(y: number = 0, position: string | undefined) {
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
    const resp = {
      bottom: `${y + props.pb}px`,
      left: '50%',
      transform: 'translateX(-50%)',
    }
    return resp
  }
}

const isTop = computed(() => {
  return ['top-left', 'top-right', 'top'].includes(props.position)
})
const enterFromClass = computed(() => {
  return isTop.value ? 'op-0 -translate-y-8' : 'op-0 translate-y-8'
})
const leaveToClass = computed(() => {
  return isTop.value ? 'op-0 translate-y-8' : 'op-0 -translate-y-8'
})
function onClose(notification: NotificationData) {
  const index = notifications.value.indexOf(notification)
  if (index !== -1) {
    allNotifications.value = allNotifications.value.filter(n => n.hash !== notification.hash)
  }
}
function getNotificationDurationPercentage(notification: NotificationData) {
  if (!notification.durationMS || notification.durationMS <= 0) {
    return 0
  }
  const duration = notification.durationMS
  const initDuration = notification.initialDurationMS
  return (initDuration - duration) / initDuration
}
</script>

<template>
  <div
    class="pointer-events-none fixed z-20 h-full w-full children:pointer-events-auto"
  >
    <TransitionGroup
      :enter-from-class="enterFromClass"
      enter-to-class="op-100 translate-y-0"
      leave-from-class="op-100 translate-y-0"
      :leave-to-class="leaveToClass"
    >
      <div
        v-for="notification, i in notifications"
        ref="notificationRefs"
        :key="notification.hash"
        :data-hash="notification.hash"
        class="absolute transition-top,bottom,opacity,transform"
        :style="getNotificationPositionStyle(notificationIndexList[i], notification.position)"
      >
        <Notification
          with-border closeable
          :title="notification.title"
          :message="notification.message"
          :icon="notification.icon"
          :loading="notification.loading"
          :color="notification.color"
          :complete="progress ? getNotificationDurationPercentage(notification) * 100 : undefined"
          @close="onClose(notification)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>
