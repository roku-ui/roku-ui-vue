import { shallowRef } from 'vue'

export interface BaseModalDataType {
  id?: string
}

export interface ConfirmModalDataType extends BaseModalDataType {
  type: 'confirm'
  title: string
  message: string
  onConfirm: () => void
  onCancel?: () => void
}

export interface AlertModalDataType extends BaseModalDataType {
  type: 'alert'
  title: string
  message: string
  onConfirm: () => void
}

export type ModalDataType = ConfirmModalDataType | AlertModalDataType

export type ModalData = ModalDataType & {
  id: string
}

const modals = shallowRef<ModalData[]>([])

export function useModals() {
  return modals
}

export const Modals = {
  open(data: ModalDataType) {
    if (!data.id) {
      data.id = Math.random().toString(36)
    }
    const alreadyExists = modals.value.some(modal => modal.id === data.id)
    if (alreadyExists) {
      return
    }
    modals.value = [data as ModalData, ...modals.value]
  },
  close(id: string) {
    modals.value = modals.value.filter(modal => modal.id !== id)
  },
  clear() {
    modals.value = []
  },
}
