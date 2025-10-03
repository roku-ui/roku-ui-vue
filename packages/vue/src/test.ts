import { createApp } from 'vue'
import App from './test/App.vue'
import { router } from './test/router'
import './test/style.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
