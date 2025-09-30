import { createApp } from 'vue'
import App from './test/App.vue'
import { router } from './test/router'

const app = createApp(App)

app.use(router)
app.mount('#app')
