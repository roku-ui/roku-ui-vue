import { inject, provide, ref } from 'vue'

export const rokuProvider = Symbol('rokuProvider')
export function useRokuProvider() {
  return inject(rokuProvider, ref(null))
}

export function provideRokuProvider(provider: any) {
  return provide(rokuProvider, provider)
}
