export interface NotificationData {
  title?: string
  message?: string
  color?: string
  icon?: string
  [key: string]: any
}

export const notificationsSymbol = Symbol('Notifications')
const notifications: NotificationData = reactive<NotificationData[]>([])
export function useNotifications() {
  return notifications
}
export class Notifications {
  static show(data: NotificationData) {
    data.hash = Math.random().toString(36)
    notifications.push(data)
  }
}
