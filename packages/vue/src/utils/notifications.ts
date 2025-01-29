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

      const groups = notifications.value.reduce<Record<string, NotificationData[]>>((acc, notification) => {
        const { position } = notification
        if (!acc[position]) {
          acc[position] = []
        }
        acc[position].push(notification)
        return acc
      }, {})

      const topNotifications: NotificationData[] = []
      for (const position in groups) {
        topNotifications.push(...groups[position].slice(-topN))
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

export class Notifications {
  static show(data: Partial<NotificationDataInterface>) {
    data.hash = Math.random().toString(36)
    data.initialDurationMS = data.durationMS
    notifications.value = [data as NotificationData, ...notifications.value]
  }
}
