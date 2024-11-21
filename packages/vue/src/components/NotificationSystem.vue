<script setup lang="ts">
import type { NotificationData } from '@/utils/notifications'
import type { Ref } from 'vue'
import { useNotifications } from '@/utils/notifications'
import { useElementHover } from '@vueuse/core'
import { computed, ref, shallowRef, watch } from 'vue'

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

function isTop(position: string) {
  return ['top-left', 'top-right', 'top'].includes(position)
}

function notificationYStyle(y: number = 0, position: string | undefined) {
  if (!position) {
    position = props.position
  }
  if (isTop(position)) {
    return {
      top: `${y + props.pt}px`,
    }
  }
  else {
    return {
      bottom: `${y + props.pb}px`,
    }
  }
}

function notificationXStyle(position: NotificationPosition) {
  if (position.includes('right')) {
    return {
      transform: `translateX(-100%)`,
    }
  }
  else if (position.includes('left')) {
    return {
    }
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
  if (position.includes('top')) {
    return {
      top: `${props.pt}px`,
    }
  }
  else {
    return {
      bottom: `${props.pb}px`,
    }
  }
}

const enterClass = function (position: string) {
  return isTop(position) ? 'animate-keyframes-fade-in-down animate-duration-0.3s' : 'animate-keyframes-fade-in-up animate-duration-0.3s'
}
const leaveClass = function (position: string) {
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
    class="pointer-events-none fixed z-20 h-full w-full children:pointer-events-auto"
  >
    <div
      v-for="pos in posList"
      :key="pos"
      :style="[groupYStyle(pos), groupXStyle(pos)]" class="absolute"
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
            class="absolute transition-top,bottom,transform duration-0.3s"
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
