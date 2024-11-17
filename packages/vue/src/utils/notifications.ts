import { computed, ref } from 'vue'

export interface NotificationData {
  title: string
  message: string
  color: string
  icon: string
  durationMS: number
  position: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
  [key: string]: any
}

export interface NotificationDataWithHash extends NotificationData {
  hash: string
}

const notifications = ref<NotificationDataWithHash[]>([])

export function useNotifications(topN: number) {
  return computed(() => {
    if (typeof topN !== 'number' || topN <= 0) {
      return notifications.value
    }

    const groups = notifications.value.reduce<Record<string, NotificationDataWithHash[]>>((acc, notification) => {
      const { position } = notification
      if (!acc[position]) {
        acc[position] = []
      }
      acc[position].push(notification)
      return acc
    }, {})

    const topNotifications: NotificationDataWithHash[] = []
    for (const position in groups) {
      topNotifications.push(...groups[position].slice(0, topN))
    }

    // 保持原始顺序
    return notifications.value.filter(notification =>
      topNotifications.includes(notification),
    )
  })
}
export class Notifications {
  static show(data: Partial<NotificationData>) {
    data.hash = Math.random().toString(36)
    notifications.value = [data as NotificationDataWithHash, ...notifications.value]
  }
}
