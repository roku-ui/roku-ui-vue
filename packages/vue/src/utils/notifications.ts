export interface NotificationData {
  title?: string
  message?: string
  color?: string
  icon?: string
  durationMS?: number
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left'
  [key: string]: any
}

export interface NotificationDataWithHash extends NotificationData {
  hash: string
}

const notifications = ref<NotificationDataWithHash[]>([])
export function useNotifications() {
  return notifications
}
export class Notifications {
  static show(data: NotificationData) {
    data.hash = Math.random().toString(36)
    notifications.value = [data as NotificationDataWithHash, ...notifications.value]
  }
}
