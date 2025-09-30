import { createRouter, createWebHashHistory } from 'vue-router'

import { defaultDemoRouteName, demoRoutes } from './demoPages'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: { name: defaultDemoRouteName } },
    ...demoRoutes,
    { path: '/:pathMatch(.*)*', redirect: { name: defaultDemoRouteName } },
  ],
})

export type { DemoRouteName } from './demoPages'

export { demoRoutes } from './demoPages'
