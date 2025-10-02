import { computed, shallowRef } from 'vue'

export interface NotificationDataInterface {
  title: string
  message: string
  color: string
  icon: string
  durationMS: number
  position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
  [key: string]: any
}

export interface NotificationData extends NotificationDataInterface {
  hash: string
  initialDurationMS: number
}

const notifications = shallowRef<NotificationData[]>([])

export function useNotifications(topN?: number) {
  return computed<NotificationData[]>({
    get: () => {
      if (typeof topN !== 'number' || topN <= 0) {
        return notifications.value
      }

      const groups: Record<string, NotificationData[]> = {}
      for (const notification of notifications.value) {
        const { position } = notification
        if (!groups[position]) {
          groups[position] = []
        }
        groups[position].push(notification)
      }

      const topNotifications: NotificationData[] = []
      for (const position in groups) {
        const list = groups[position]
        if (Array.isArray(list)) {
          topNotifications.push(...list.slice(-topN))
        }
      }
      // 保持原始顺序
      return notifications.value.filter(notification =>
        topNotifications.includes(notification),
      )
    },
    set: (val) => {
      notifications.value = val
    },
  })
}

export const Notifications = {
  show(data: Partial<NotificationDataInterface>) {
    data.hash = Math.random().toString(36)
    data.initialDurationMS = data.durationMS
    notifications.value = [data as NotificationData, ...notifications.value]
  },
}
