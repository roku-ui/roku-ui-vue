<script setup lang="ts">
import type { Ref } from 'vue'
import type { NotificationData } from '@/utils/notifications'
import { useElementHover, useRafFn } from '@vueuse/core'
import { computed, ref, shallowRef, watch } from 'vue'
import { Notification } from '@/components'
import { useNotifications } from '@/utils/notifications'

type NotificationPosition = 'top-left' | 'top-right' | 'top' | 'bottom-left' | 'bottom-right' | 'bottom'
const props = withDefaults(defineProps<{
  position?: NotificationPosition
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
  topN: 3,
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
      const hoverRef = hoverRecord.value[d.hash]
      if (hoverRef?.value) {
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

function isTop(position: string) {
  return ['top-left', 'top-right', 'top'].includes(position)
}

function notificationYStyle(y: number = 0, position: string | undefined) {
  if (!position) {
    position = props.position
  }
  return isTop(position)
    ? {
        top: `${y + props.pt}px`,
      }
    : {
        bottom: `${y + props.pb}px`,
      }
}

function notificationXStyle(position: NotificationPosition) {
  if (position.includes('right')) {
    return {
      transform: `translateX(-100%)`,
    }
  }
  else if (position.includes('left')) {
    return {}
  }
  else {
    return {
      transform: `translateX(-50%)`,
    }
  }
}

function groupXStyle(position: NotificationPosition) {
  if (position.includes('right')) {
    return {
      right: `${props.pr}px`,
    }
  }
  else if (position.includes('left')) {
    return {
      left: `${props.pl}px`,
    }
  }
  else {
    return {
      left: '50%',
    }
  }
}

function groupYStyle(position: NotificationPosition) {
  return position.includes('top')
    ? {
        top: `${props.pt}px`,
      }
    : {
        bottom: `${props.pb}px`,
      }
}

function enterClass(position: string) {
  return isTop(position) ? 'animate-keyframes-fade-in-down animate-duration-0.3s' : 'animate-keyframes-fade-in-up animate-duration-0.3s'
}
function leaveClass(position: string) {
  return isTop(position) ? 'animate-keyframes-fade-out-down animate-duration-0.3s' : 'animate-keyframes-fade-out-up animate-duration-0.3s'
}
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
const posList: NotificationPosition[] = ['top-left', 'top-right', 'top', 'bottom-left', 'bottom-right', 'bottom']
</script>

<template>
  <div
    class="h-full w-full pointer-events-none fixed z-20 children:pointer-events-auto"
  >
    <div
      v-for="pos in posList"
      :key="pos"
      :style="[groupYStyle(pos), groupXStyle(pos)]"
      class="absolute"
    >
      <TransitionGroup
        :enter-active-class="enterClass(pos)"
        :leave-active-class="leaveClass(pos)"
      >
        <template
          v-for="notification, i in notifications"
          :key="notification.hash"
        >
          <div
            v-if="notification.position === pos"
            class="transition-top,bottom,transform duration-0.3s absolute"
            :style="[notificationYStyle(notificationIndexList[i], notification.position)]"
          >
            <div
              ref="notificationRefs"
              :data-hash="notification.hash"
              :style="[notificationXStyle(pos), notificationYStyle(notificationIndexList[i], notification.position)]"
            >
              <Notification
                with-border
                closeable
                :title="notification.title"
                :message="notification.message"
                :icon="notification.icon"
                :loading="notification.loading"
                :color="notification.color"
                :complete="progress ? getNotificationDurationPercentage(notification) * 100 : undefined"
                @close="onClose(notification)"
              />
            </div>
          </div>
        </template>
      </TransitionGroup>
    </div>
  </div>
</template>
